import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/axios";
import type { Item, ItemState } from "@/types";
import { useCallback, useMemo, useState } from "react";

interface InventoryItemProps {
    item: Item;
    state: ItemState;
    onChange: (value: number) => void;
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

const InventoryItem = ({ item, state, onChange }: InventoryItemProps) => {
    const [imgSrc, setImgSrc] = useState(getMaterialIcon(item.id.replace(/-/g, "_")));

    const placeholderPath = useMemo(() => `${axiosInstance.defaults.baseURL}/materials/placeholder/icon.png`, [])
    const isEnough = state.owned >= state.required
    const isEmpty = state.required === 0

    const handleError = useCallback(() => {
        setImgSrc(placeholderPath)
    }, [placeholderPath])

    return (
        <div className={`flex flex-col items-center border rounded bg-gray-800 transition-opacity ${isEmpty ? "opacity-60" : "opacity-100"}`}>
            <div className="flex justify-center relative w-full h-16">
                <Tooltip>
                    <TooltipTrigger>
                        <img
                            src={imgSrc}
                            onError={handleError}
                            alt={item.name}
                            className="w-16 h-full object-contain"
                        />
                        {item.rarity > 1 && (
                            <div
                                className={`absolute bottom-0 left-0 w-full h-5 bg-gradient-to-t ${getRarityColor(item.rarity)} to-transparent`} />
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{item.name}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="flex w-full flex-col">
                <span
                    className={`flex-1 text-center overflow-hidden px-1 py-0.5 text-sm font-semibold ${isEmpty ? "bg-gray-500" : isEnough ? "bg-green-400" : "bg-red-400"}`}>
                    {state.required}
                </span>
                <input
                    value={state.owned}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="flex-1 text-center rounded-b overflow-hidden px-1 py-0.5 bg-gray-700"
                />
            </div>

        </div>
    )
}

export default InventoryItem