import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/axios";
import type { Item } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useCallback, useState } from "react";

interface InventoryItemProps {
  item: Item;
  owned: number;
  required: number;
  craftable: number;
  isGroupEnough: boolean;
  onChange: (value: number) => void;
}

const rarityColors: Record<number, string> = {
  2: "bg-green-400",
  3: "bg-blue-400",
  4: "bg-purple-600",
  5: "bg-equator-700",
};

const getMaterialIcon = (id: string) => {
  const normId = id.toLocaleLowerCase().replace(/_/g, "-");

  return `${
    axiosInstance.defaults.baseURL
  }/materials/${normId}/images/${normId}`;
};

const placeholderPath = `${axiosInstance.defaults.baseURL}/materials/placeholder/images/icon`;

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent";
};

const InventoryItem = ({
  item,
  owned,
  required,
  craftable,
  isGroupEnough,
  onChange,
}: InventoryItemProps) => {
  const [imgSrc, setImgSrc] = useState(
    getMaterialIcon(item.id.replace(/-/g, "_")),
  );

  const isConvertible = item.group && item.group !== "none";

  const isEnough = isConvertible ? isGroupEnough : owned >= required;

  const handleError = useCallback(() => {
    setImgSrc(placeholderPath);
  }, []);

  const increment = () => onChange(owned + 1);
  const decrement = () => onChange(Math.max(0, owned - 1));

  return (
    <div
      className={`flex flex-col items-center border rounded-none bg-zinc-800 transition-opacity ${
        required === 0 ? "opacity-60" : "opacity-100"
      } min-w-[4rem]`}
    >
      <div className="flex justify-center relative w-full h-16 aspect-square bg-iron-900">
        <Tooltip>
          <TooltipTrigger>
            <img
              src={imgSrc}
              onError={handleError}
              alt={item.name}
              className="w-full h-full object-contain rounded-md"
            />
            {item.rarity > 1 && (
              <div
                className={`absolute bottom-0 left-0 w-full h-1  ${getRarityColor(
                  item.rarity,
                )}`}
              />
            )}
            {craftable > 0 && isConvertible && (
              <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-lg z-10">
                {craftable}
              </div>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex w-full flex-col">
        <span
          className={`flex-1 text-center overflow-hidden px-1 py-0.5 text-sm font-semibold ${
            required === 0
              ? "bg-zinc-500"
              : isEnough
                ? "bg-green-400"
                : "bg-red-400"
          }`}
        >
          {required}
        </span>
        <div className="flex items-center bg-zinc-700">
          <button className="text-white" onClick={increment}>
            <Plus className="w-4 h-4" />
          </button>
          <input
            value={owned}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className="flex-1 text-center rounded-none px-1 py-0.5 bg-zinc-700 min-w-[2rem]"
          />
          <button className="text-white" onClick={decrement}>
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;
