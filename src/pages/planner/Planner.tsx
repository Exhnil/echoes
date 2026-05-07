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
import type { Item } from "@/types";
import MaterialPopover from "./components/MaterialPopover";

const getMaterialIcon = (id: string) => {
  const normId = id.toLowerCase().replace(/_/g, "-");
  return `${axiosInstance.defaults.baseURL}/materials/${normId}/images/${normId}`;
};

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent";
};

const rarityColors: Record<number, string> = {
  2: "bg-green-400",
  3: "bg-blue-400",
  4: "bg-purple-600",
  5: "bg-equator-700",
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

  const filteredDomains = domains
    .filter((domain) =>
      domain.materials.some((mat) => {
        const required = requiredMap[mat.id] ?? 0;
        const owned = inventoryState[mat.id] ?? 0;

        return required > owned;
      }),
    )
    .map((domain) => ({
      ...domain,
      materials: [...domain.materials].sort((a, b) => b.rarity - a.rarity),
    }));

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
        i.source.toLowerCase().includes(sourceKey) &&
        (requiredMap[i.id] ?? 0) > (inventoryState[i.id] ?? 0),
    );
  };

  const filteredLocalItems = filterBySource("local");

  const filteredEnemyDrops = filterBySource("enemies");

  const groupedEnemyDrops = useMemo(() => {
    const drops: Record<string, { items: Item[]; required: number }> = {};

    for (const item of filteredEnemyDrops) {
      const key = item.group && item.group !== "none" ? item.group : item.id;

      if (!drops[key]) {
        drops[key] = { items: [], required: 0 };
      }

      drops[key].items.push(item);
      drops[key].required += requiredMap[item.id] ?? 0;
    }

    for (const group of Object.values(drops)) {
      group.items.sort((a, b) => b.rarity - a.rarity);
    }
    return drops;
  }, [filteredEnemyDrops, requiredMap]);

  const runsByDomain = useMemo(() => {
    return Object.fromEntries(
      domains.map((d) => [
        d.id,
        computeDomainRuns(d, requiredMap, inventoryState),
      ]),
    );
  }, [domains, requiredMap, inventoryState]);

  const hasNothingToFarm =
    filteredEnemyDrops.length === 0 &&
    forgeryMaterials.length === 0 &&
    weeklyDomains.length === 0 &&
    overlordClasses.length === 0 &&
    filteredLocalItems.length === 0;

  const totalEnergy = useMemo(() => {
    let totalEnergy = 0;
    for (const domain of filteredDomains) {
      totalEnergy += runsByDomain[domain.id] * domain.cost;
    }
    return totalEnergy;
  }, [filteredDomains, runsByDomain]);

  return (
    <div className="p-6 space-y-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl mb-2 font-bold">Planner</h1>
      </div>

      <div className="my-4 h-1 w-full bg-iron-700" />

      {!hasNothingToFarm && (
        <div>
          <p className="inline-block text-sm bg-gradient-to-r from-equator-500 to-transparent px-2 py-1 font-semibold text-white">
            <span>{totalEnergy} total waveplates</span>
          </p>
        </div>
      )}

      {hasNothingToFarm && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
          <h2 className="text-xl font-semibold mb-2">
            The void is looking at you
          </h2>
          <p className="text-sm">
            You have nothing to farm. Did you liberate yourself from the farm ?
            Saw the light at the end of the grind ? Or maybe you just didn't add
            anything. In that case, go add an objective, quick, and come back.
          </p>
        </div>
      )}

      {filteredEnemyDrops.length > 0 && (
        <SectionLayout title="Enemy Drops">
          {Object.entries(groupedEnemyDrops).map(([key, group]) => (
            <Card
              key={key}
              className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800"
            >
              <CardTitle className="text-lg sm:text-xl font-bold text-center">
                {group.items[group.items.length - 1].name}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-16 h-16 shadow-inner bg-zinc-900/60"
                  >
                    <Tooltip>
                      <MaterialPopover
                        id={item.id}
                        rarity={item.rarity}
                        required={requiredMap[item.id]}
                      >
                        <TooltipTrigger asChild>
                          <img
                            src={getMaterialIcon(item.id)}
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                          />
                        </TooltipTrigger>
                      </MaterialPopover>
                      <TooltipContent>
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="absolute top-0 right-0 text-white text-xs px-1 font font-semibold">
                      {requiredMap[item.id]}
                    </span>
                    <div
                      className={`absolute bottom-0 w-full h-1 ${getRarityColor(item.rarity)}`}
                    />
                  </div>
                ))}
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
                    <MaterialPopover
                      id={item.id}
                      rarity={item.rarity}
                      required={requiredMap[item.id]}
                    >
                      <TooltipTrigger asChild>
                        <img
                          src={getMaterialIcon(item.id.replace(/[' -]/g, "_"))}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </TooltipTrigger>
                    </MaterialPopover>
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
