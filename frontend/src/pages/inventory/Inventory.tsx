import { useEffect, useState } from "react"
import InventoryItem from "./components/InventoryItem";
import { useItemStore } from "@/store/ItemStore";
import type { ItemState, Item, CharacterState } from "@/types";
import { calculate } from "@/lib/calculateMaterials";
import { useCharactersStore } from "@/store/CharactersStore";
import { axiosInstance } from "@/lib/axios";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STORAGE_KEY = "inventoryState";
const creditIcon = `${axiosInstance.defaults.baseURL}/materials/shell_credit/item_shell_credit.png`

const Inventory = () => {
  const { items, fetchAllMaterials } = useItemStore();

  const [itemsState, setItemsState] = useState<ItemState[]>([]);
  const [credits, setCredits] = useState<number>(0)
  const [requiredCredits, setRequiredCredits] = useState<number>(0)

  const { characters, fetchCharacters } = useCharactersStore()

  useEffect(() => {

    const loadData = async () => {
      await Promise.all([
        fetchAllMaterials(),
        fetchCharacters()
      ]);

      //const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      const saved: ItemState[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      const itemsStateMap = Object.fromEntries(saved.map(s => [s.id, s]))

      const merged: ItemState[] = items.map((item: Item) => {
        const state = itemsStateMap[item.id]
        //const state = saved.find((s: ItemState) => s.id === item.id);
        return {
          id: item.id,
          name: item.name,
          owned: state ? state.owned : 0,
          required: state ? state.required : 1
        }
      })
      setItemsState(merged)
    }
    loadData()
  }, [fetchCharacters, items, fetchAllMaterials])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsState))
  }, [itemsState])

  const handleOwnedChange = (id: string, value: number) => {
    setItemsState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, owned: value } : item)
    )
  }

  useEffect(() => {
    const saved = localStorage.getItem("characterState")
    const parsed: Record<string, CharacterState> = saved ? JSON.parse(saved) : {}
    const requiredMaterials = calculate(characters, parsed)

    setRequiredCredits(requiredMaterials["Shell Credit"]?.value ?? 0)
    setItemsState(prev =>
      prev.map(item => ({
        ...item,
        required: requiredMaterials[item.name]?.value ?? 0
      }))
    )
  }, [characters])

  return (
    <div className="p-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Inventory</h1>
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
          <div className="flex flex-col flex-1">
            <span
              className={`text-center px-1 py-0.5 overflow-hidden text-sm font-semibold ${credits >= requiredCredits ? "bg-green-400" : "bg-red-400"}`}
            >
              {requiredCredits}
            </span>
            <input
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              className="text-center flex-1 rounded-br px-1 py-0.5 bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="rounded p-2">
        <div className="grid grid-cols-12 gap-4">
          {itemsState
            .filter(state => state.required)
            .map(state => {
              const item = items.find((s) => s.id === state.id);
              if (!item) return null

              return (
                <InventoryItem
                  key={item.id}
                  item={item}
                  state={state}
                  onChange={(value) => handleOwnedChange(item.id, value)} />
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default Inventory