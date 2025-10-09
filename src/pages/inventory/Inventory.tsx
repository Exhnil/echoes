import { useEffect, useState } from "react"
import InventoryItem from "./components/InventoryItem";
import { useItemStore } from "@/store/ItemStore";
import type { ItemState, Item, CharacterState, WeaponState } from "@/types";
import { calculate } from "@/lib/calculateMaterials";
import { useCharactersStore } from "@/store/CharactersStore";
import { axiosInstance } from "@/lib/axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { materialsGroups, typeOrder } from "@/lib/constants";
import { useWeaponStore } from "@/store/WeaponStore";

const STORAGE_KEY = "inventoryState";
const creditIcon = `${axiosInstance.defaults.baseURL}/materials/shell_credit/shell_credit.png`

const Inventory = () => {
  const { items, fetchAllMaterials } = useItemStore();
  const { characters, fetchCharacters } = useCharactersStore()
  const { weapons, fetchWeapons } = useWeaponStore()

  const [itemsState, setItemsState] = useState<ItemState[]>([]);
  const [showOnlyRequired, setShowOnlyRequired] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAllMaterials(), fetchCharacters(), fetchWeapons()])
    }
    loadData()
  }, [fetchAllMaterials, fetchCharacters, fetchWeapons])

  useEffect(() => {
    if (!items.length) {
      console.log("[Inventory] items empty, skipping init");
      return
    }
    const savedJson = localStorage.getItem(STORAGE_KEY);
    console.log("[Inventory] raw localStorage:", savedJson);

    const savedItems: ItemState[] = savedJson ? JSON.parse(savedJson) : [];
    console.log("[Inventory] parsed items:", savedItems);
    setItemsState(savedItems);

    const itemsStateMap = Object.fromEntries(savedItems.map(s => [s.id, s]));

    const state = items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        owned: itemsStateMap[item.id]?.owned ?? 0,
        required: itemsStateMap[item.id]?.required ?? 0
      };
    });

    setItemsState(state);
  }, [items]);

  useEffect(() => {
    if (!itemsState.length) return

    const savedCharacters = localStorage.getItem("characterState")
    const parsedCharacters: Record<string, CharacterState> = savedCharacters ? JSON.parse(savedCharacters) : {}

    const savedWeapons = localStorage.getItem("weaponState")
    const parsedWeapons: Record<string, WeaponState> = savedWeapons ? JSON.parse(savedWeapons) : {}

    const result = calculate(characters, weapons, parsedCharacters, parsedWeapons)

    setItemsState(prev =>
      prev.map(item => ({
        ...item,
        required: result[item.name]?.value ?? 0
      }))
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsState))

  }, [characters, itemsState, weapons])

  const handleOwnedChange = (id: string, value: number) => {
    setItemsState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, owned: value } : item)
    )
  }

  const variantMap = new Map<string, string>()
  materialsGroups.forEach(group => {
    group.variants.forEach(v => variantMap.set(v, group.base))
  })


  const sortItems = (a: Item, b: Item) => {
    const typeDiff = typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    if (typeDiff !== 0) return typeDiff

    const aBase = variantMap.get(a.name) ?? a.name
    const bBase = variantMap.get(b.name) ?? b.name

    const baseDiff = aBase.localeCompare(bBase)
    if (baseDiff !== 0) return baseDiff

    const rarity = b.rarity - a.rarity
    if (rarity !== 0) return rarity

    return a.name.localeCompare(b.name)
  }

  return (
    <div className="p-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Inventory</h1>
      </div>

      <div className="flex">
        <Button
          className="text-gray-300 bg-gray-600 hover:bg-gray-700"
          onClick={() => setShowOnlyRequired(prev => !prev)}
        >{showOnlyRequired ? "Show All" : "Required only"}</Button>
      </div>

      <div className="p-2">
        <div className="flex w-64 flex-row items-stretch border rounded bg-gray-800">
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
          {
            items
              .filter(item => item.name === "Shell Credit")
              .map((item) => {
                const state = itemsState.find(s => s.id === item.id)
                if (!state) return null
                return (
                  <div key={item.id} className="flex flex-col flex-1">

                    <span
                      className={`text-center px-1 py-0.5 overflow-hidden text-sm font-semibold ${(state.owned ?? 0) >= (state.required ?? 0) ? "bg-green-400" : "bg-red-400"}`}
                    >
                      {state.required}
                    </span>
                    <input
                      value={state.owned ?? 0}
                      onChange={(e) => handleOwnedChange(item.id, Number(e.target.value))}
                      className="text-center flex-1 rounded-br px-1 py-0.5 bg-gray-700" />
                  </div>)
              })
          }
        </div>
      </div>

      <div className="rounded p-2">
        <div className="grid grid-cols-12 gap-4">
          {
            items
              .filter((item) => item.name !== "Shell Credit")
              .sort(sortItems)
              .map((item) => {
                const state = itemsState.find(s => s.id === item.id)
                if (!state) return null
                if (showOnlyRequired && (state.required ?? 0) <= 0) {
                  return null
                }
                return (
                  <InventoryItem
                    key={item.id}
                    item={item}
                    state={state}
                    onChange={(value) => handleOwnedChange(item.id, value)} />
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

export default Inventory