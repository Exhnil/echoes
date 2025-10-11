import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/axios";
import type { Item, ItemState } from "@/types";
import { Hammer } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface InventoryItemProps {
    item: Item;
    state: ItemState;
    craftable: number;
    onChange: (value: number) => void;
    onCraft: () => void;
}

const rarityColors: Record<number, string> = {
    2: "from-green-400",
    3: "from-blue-400",
    4: "from-purple-600",
    5: "from-yellow-400",
}

const getMaterialIcon = (id: string) => {
    return `${axiosInstance.defaults.baseURL}/materials/${id.toLowerCase()}/${id.toLowerCase()}.png`
}

const getRarityColor = (rarity: number) => {
    return rarityColors[rarity] ?? "from-transparent"
}

const InventoryItem = ({ item, state, craftable, onChange, onCraft }: InventoryItemProps) => {
    const [imgSrc, setImgSrc] = useState(getMaterialIcon(item.id.replace(/-/g, "_")));

    const placeholderPath = useMemo(() => `${axiosInstance.defaults.baseURL}/materials/placeholder/icon.png`, [])
    const isEnough = state.owned >= state.required
    const isEmpty = state.required === 0

    const handleError = useCallback(() => {
        setImgSrc(placeholderPath)
    }, [placeholderPath])

    return (
        <div className={`flex flex-col items-center border rounded bg-zinc-800 transition-opacity ${isEmpty ? "opacity-60" : "opacity-100"}`}>
            <div className="flex justify-center relative w-full h-16">
                {(craftable > 0 && !isEnough) && (
                    <button
                        className="absolute top-1 left-1 p-1 bg-zinc-700/70 hover:bg-zinc-600/80 text-white rounded-full shadow-md flex items-center justify-center text-xs z-10"
                        onClick={onCraft}
                    >
                        <Hammer size={14} />
                    </button>
                )
                }
                <Tooltip>
                    <TooltipTrigger>
                        <img
                            src={imgSrc}
                            onError={handleError}
                            alt={item.name}
                            className="w-16 h-full object-contain rounded-md"
                        />
                        {item.rarity > 1 && (
                            <div
                                className={`absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t ${getRarityColor(item.rarity)} to-transparent`} />
                        )}
                        {(craftable > 0 && !isEnough) &&
                            <div
                                className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-lg z-10"
                            >
                                {craftable}
                            </div>
                        }
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.name}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex w-full flex-col">
                <span
                    className={`flex-1 text-center overflow-hidden px-1 py-0.5 text-sm font-semibold ${isEmpty ? "bg-zinc-500" : isEnough ? "bg-green-400" : "bg-red-400"}`}>
                    {state.required}
                </span>
                <input
                    value={state.owned}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="flex-1 text-center rounded-b overflow-hidden px-1 py-0.5 bg-zinc-700"
                />
            </div>

        </div>
    )
}

export default InventoryItem