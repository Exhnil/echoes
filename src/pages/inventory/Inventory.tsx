import { useEffect, useMemo, useState } from "react";
import { useItemStore } from "@/store/ItemStore";
import type { Item } from "@/types";
import { useCharactersStore } from "@/store/CharactersStore";
import { axiosInstance } from "@/lib/axios";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { typeOrder } from "@/lib/constants";
import { useWeaponStore } from "@/store/WeaponStore";
import { useInventoryStore } from "@/store/InventoryStore";
import InventoryItem from "./components/InventoryItem";
import { calculate } from "@/lib/calculateMaterials";
import { useCharacterProgressStore } from "@/store/CharacterProgressStore";
import { useWeaponProgressStore } from "@/store/WeaponProgressStore";
import { getCraftable } from "@/lib/crafting";

const creditIcon = `${axiosInstance.defaults.baseURL}/materials/shell-credit/images/shell-credit`;

const Inventory = () => {
  const { items, fetchAllMaterials, isLoading } = useItemStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { charactersProgress } = useCharacterProgressStore();
  const { weapons, fetchWeapons } = useWeaponStore();
  const { weaponsProgress } = useWeaponProgressStore();
  const { inventoryState, setOwned } = useInventoryStore();

  const [showOnlyRequired, setShowOnlyRequired] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchAllMaterials(),
        fetchCharacters(),
        fetchWeapons(),
      ]);
    };
    loadData();
  }, [fetchAllMaterials, fetchCharacters, fetchWeapons]);

  const requiredMap = useMemo(() => {
    return calculate(characters, weapons, charactersProgress, weaponsProgress);
  }, [characters, weapons, charactersProgress, weaponsProgress]);

  const getItemWeight = (rarity: number) => {
    return Math.pow(3, rarity - 2);
  };

  const groupValues = useMemo(() => {
    const map = new Map<string, { owned: number; required: number }>();
    items.forEach((item) => {
      if (!item.group || item.group === "none") return;
      const weight = getItemWeight(item.rarity);

      const owned = inventoryState[item.id] ?? 0;
      const required = requiredMap[item.id] ?? 0;

      if (!map.has(item.group)) {
        map.set(item.group, { owned: 0, required: 0 });
      }

      const entry = map.get(item.group)!;
      entry.owned += owned * weight;
      entry.required += required * weight;
    });
    console.log(map);
    return map;
  }, [items, inventoryState, requiredMap]);

  const handleOwnedChange = (id: string, value: number) => {
    setOwned(id, value);
  };

  const sortItems = (a: Item, b: Item) => {
    const typeDiff = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    if (typeDiff !== 0) return typeDiff;

    const rarity = b.rarity - a.rarity;
    if (rarity !== 0) return rarity;

    return a.name.localeCompare(b.name);
  };

  return (
    <div className="p-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Inventory</h1>
      </div>

      <div className="flex">
        <Button
          className="text-zinc-300 bg-zinc-600 hover:bg-zinc-700"
          onClick={() => setShowOnlyRequired((prev) => !prev)}
        >
          {showOnlyRequired ? "Show All" : "Required only"}
        </Button>
      </div>

      <div className="p-2">
        <div className="flex w-64 flex-row items-stretch border rounded bg-zinc-800">
          <div className="flex justify-center items-center relative w-16 h-16">
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={creditIcon}
                  alt="Shell Credit"
                  className="w-16 h-16 object-contain"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Shell Credit</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {isLoading ? (
            <div className="flex text-center items-center justify-center">
              Loading...
            </div>
          ) : (
            items
              .filter((item) => item.id === "shell-credit")
              .map((item) => {
                const required = requiredMap[item.id] ?? 0;
                return (
                  <div key={item.id} className="flex flex-col flex-1">
                    <span className="text-center px-1 py-0.5 overflow-hidden text-sm font-semibold ">
                      {required}
                    </span>
                    <input
                      value={inventoryState[item.id] ?? 0}
                      onChange={(e) =>
                        handleOwnedChange(item.id, Number(e.target.value))
                      }
                      className="text-center flex-1 rounded-br px-1 py-0.5 bg-zinc-700"
                    />
                  </div>
                );
              })
          )}
        </div>
      </div>

      <div className="my-4 h-1 w-full bg-iron-700" />

      <div className="rounded p-2">
        <div className="grid grid-cols-12 gap-4">
          {[...items]
            .filter((item) => item.id !== "shell-credit")
            .sort(sortItems)
            .map((item) => {
              const required = requiredMap[item.id] ?? 0;
              const craftable = getCraftable(item.id, inventoryState, items);
              const group = item.group ? groupValues.get(item.group) : null;
              const isGroupEnough = group
                ? group.owned >= group.required
                : true;
              if (showOnlyRequired && required <= 0) {
                return null;
              }
              return (
                <InventoryItem
                  key={item.id}
                  item={item}
                  owned={inventoryState[item.id] ?? 0}
                  required={required}
                  craftable={craftable}
                  isGroupEnough={isGroupEnough}
                  onChange={(value) => handleOwnedChange(item.id, value)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
