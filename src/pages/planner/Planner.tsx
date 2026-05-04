import { useItemStore } from "@/store/ItemStore";
import { useEffect, useMemo } from "react";
import DomainCard from "./components/DomainCard";
import SectionLayout from "./components/SectionLayout";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardTitle } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useInventoryStore } from "@/store/InventoryStore";
import { calculate, computeDomainRuns } from "@/lib/calculateMaterials";
import { useCharacterProgressStore } from "@/store/CharacterProgressStore";
import { useCharactersStore } from "@/store/CharactersStore";
import { useWeaponProgressStore } from "@/store/WeaponProgressStore";
import { useWeaponStore } from "@/store/WeaponStore";

const getMaterialIcon = (id: string) => {
  return `${axiosInstance.defaults.baseURL}/materials/${id.toLowerCase()}/${id.toLowerCase()}.png`;
};

const Planner = () => {
  const { domains, items, fetchAllMaterials, fetchAllDomains } = useItemStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { charactersProgress } = useCharacterProgressStore();
  const { weapons, fetchWeapons } = useWeaponStore();
  const { weaponsProgress } = useWeaponProgressStore();
  const { inventoryState } = useInventoryStore();

  const requiredMap = useMemo(() => {
    return calculate(characters, weapons, charactersProgress, weaponsProgress);
  }, [characters, weapons, charactersProgress, weaponsProgress]);

  const requiredItems = Object.entries(requiredMap)
    .map(([id, quantity]) => {
      const item = items.find((i) => i.id === id);
      if (!item) return null;
      return { ...item, requiredQty: quantity };
    })
    .filter(Boolean);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchAllMaterials(),
        fetchCharacters(),
        fetchWeapons(),
        fetchAllDomains(),
      ]);
    };
    loadData();
  }, [fetchAllDomains, fetchAllMaterials, fetchCharacters, fetchWeapons]);

  const getProgress = (id: string) => {
    const required = requiredMap[id] ?? 0;
    const owned = inventoryState[id] ?? 0;

    return {
      required,
      owned,
      remaimaning: Math.max(required - owned, 0),
      needed: required > owned,
    };
  };

  const filteredDomains = domains.filter((domain) =>
    domain.materials.some((mat) => (requiredMap[mat.id] ?? 0) > 0),
  );

  const forgeryMaterials = filteredDomains.filter(
    (d) => d.type === "Forgery Challenge",
  );
  const overlordClasses = filteredDomains.filter(
    (d) => d.type === "Overlord Class",
  );
  const weeklyDomains = filteredDomains.filter(
    (d) => d.type === "Weekly Challenge",
  );

  const filterBySource = (sourceKey: string) => {
    return items.filter(
      (i) =>
        i.source.toLocaleLowerCase().includes(sourceKey) &&
        (requiredMap[i.id] ?? 0 > 0),
    );
  };

  const filteredLocalItems = filterBySource("local");

  const filteredEnemyDrops = filterBySource("enemies");

  const runsByDomain = useMemo(() => {
    return Object.fromEntries(
      domains.map((d) => [
        d.id,
        computeDomainRuns(d, requiredMap, inventoryState),
      ]),
    );
  }, [domains, requiredMap, inventoryState]);

  return (
    <div className="p-6 space-y-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl mb-2 font-bold">Planner</h1>
      </div>

      <div className="my-4 h-1 w-full bg-iron-700" />

      {filteredEnemyDrops.length > 0 && (
        <SectionLayout title="Enemy Drops">
          {filteredEnemyDrops.map((item) => (
            <Card
              key={item.id}
              className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800"
            >
              <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {item.name}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <div className="relative w-16 h-16 shadow-inner bg-zinc-900/60">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={getMaterialIcon(item.id.replace(/[' -]/g, "_"))}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="absolute top-0 right-0 text-white text-xs px-1 font font-semibold">
                    {requiredMap[item.id]}
                  </span>
                  <div
                    className={`absolute bottom-0 w-full h-1  ${["bg-green-400", "bg-blue-400", "bg-purple-600", "bg-equator-700"][item.rarity - 2] ?? "from-transparent"}`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </SectionLayout>
      )}

      {forgeryMaterials.length > 0 && (
        <SectionLayout title="Forgery Challenge">
          {forgeryMaterials.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              items={items}
              requiredMap={requiredMap}
              runs={runsByDomain[domain.id]}
            />
          ))}
        </SectionLayout>
      )}

      {weeklyDomains.length > 0 && (
        <SectionLayout title="Weekly Challenge">
          {weeklyDomains.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              items={items}
              requiredMap={requiredMap}
              runs={runsByDomain[domain.id]}
            />
          ))}
        </SectionLayout>
      )}

      {overlordClasses.length > 0 && (
        <SectionLayout title="Overlord Class">
          {overlordClasses.map((domain) => (
            <DomainCard
              key={domain.id}
              domain={domain}
              items={items}
              requiredMap={requiredMap}
              runs={runsByDomain[domain.id]}
            />
          ))}
        </SectionLayout>
      )}

      {filteredLocalItems.length > 0 && (
        <SectionLayout title="Exploration">
          {filteredLocalItems.map((item) => (
            <Card
              key={item.id}
              className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800"
            >
              <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {item.name}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <div className="relative w-16 h-16 shadow-inner bg-zinc-900/60">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={getMaterialIcon(item.id.replace(/[' -]/g, "_"))}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="absolute top-0 right-0 text-white text-xs px-1 font font-semibold">
                    {requiredMap[item.id]}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </SectionLayout>
      )}
    </div>
  );
};

export default Planner;
