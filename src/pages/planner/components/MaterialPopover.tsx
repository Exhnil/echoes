import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "@/lib/axios";
import { useInventoryStore } from "@/store/InventoryStore";
import type { Material } from "@/types";
import { Minus, Plus } from "lucide-react";

interface MaterialPopoverProps {
  material: Material;
  required: number;
  children: React.ReactNode;
}

const getMaterialIcon = (id: string) => {
  const normId = id.toLowerCase().replace(/_/g, "-");

  return `${
    axiosInstance.defaults.baseURL
  }/materials/${normId}/images/${normId}`;
};

const rarityColors: Record<number, string> = {
  2: "bg-green-400",
  3: "bg-blue-400",
  4: "bg-purple-600",
  5: "bg-equator-700",
};

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent";
};

const MaterialPopover = ({
  material,
  required,
  children,
}: MaterialPopoverProps) => {
  const { inventoryState, setOwned } = useInventoryStore();
  const owned = inventoryState[material.id] ?? 0;
  const isEnough = owned >= required;

  const increment = () => setOwned(material.id, owned + 1);
  const decrement = () => setOwned(material.id, Math.max(0, owned - 1));

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit p-2 bg-zinc-800 items-center">
        <div className="flex justify-center relative h-16 w-full aspect-square bg-iron-900">
          <img
            src={getMaterialIcon(material.id)}
            alt={material.name}
            className="object-contain rounded-md"
          />
          {material.rarity > 1 && (
            <div
              className={`absolute bottom-0 left-0 w-full h-1 ${getRarityColor(material.rarity)}`}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span
            className={`flex-1 text-center overflow-hidden px-1 py-0.5 text-sm font-semibold ${required === 0 ? "bg-zinc-500" : isEnough ? "bg-green-400" : "bg-red-400"}`}
          >
            {required}
          </span>
          <div className="flex items-center bg-zinc-700">
            <button className="text-white" onClick={increment}>
              <Plus className="w-4 h-4" />
            </button>
            <input
              value={owned}
              onChange={(e) => {
                setOwned(material.id, Number(e.target.value) || 0);
              }}
              className="text-center rounded-none px-1 py-0.5 bg-zinc-700 w-12"
            />
            <button className="text-white" onClick={decrement}>
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MaterialPopover;
