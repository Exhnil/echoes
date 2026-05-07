import { Card, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosInstance } from "@/lib/axios";
import type { Domain, Item } from "@/types";
import MaterialPopover from "./MaterialPopover";

interface DomainCardProps {
  domain: Domain;
  requiredMap: Record<string, number>;
  runs: number;
  items: Item[];
}

const getMaterialIcon = (id: string) => {
  const normId = id.toLowerCase().replace(/_/g, "-");
  return `${axiosInstance.defaults.baseURL}/materials/${normId}/images/${normId}`;
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

const DomainCard = ({ domain, requiredMap, runs }: DomainCardProps) => {
  return (
    <Card
      key={domain.id}
      className="bg-zinc-900/60 p-4 flex flex-col items-center gap-3 rounded-none border-neutral-800"
    >
      <CardTitle className="text-lg sm:text-xl font-bold text-center">
        {domain.name}
      </CardTitle>
      <p className="text-sm text-center w-full bg-gradient-to-r from-equator to-transparent px-2 py-1 font-semibold text-white">
        <span>
          x{runs} | {runs * domain.cost} waveplates
        </span>
      </p>
      <div className="flex gap-2 mt-2">
        {domain.materials.map((mat) => {
          const required = requiredMap[mat.id] ?? 0;

          return (
            <div
              key={mat.id}
              className="relative bg-zinc-900/80 shadow-inner w-16 h-16"
            >
              <Tooltip>
                <MaterialPopover material={mat} required={requiredMap[mat.id]}>
                  <TooltipTrigger asChild>
                    <img
                      src={getMaterialIcon(mat.id.replace(/[' -]/g, "_"))}
                      alt={mat.id}
                      className="w-16 h-16 object-cover cursor-pointer"
                    />
                  </TooltipTrigger>
                </MaterialPopover>
                <TooltipContent>
                  <p>{mat.name}</p>
                </TooltipContent>
              </Tooltip>
              <span className="absolute top-0 right-0 text-white text-xs px-1 font-semibold">
                {required}
              </span>
              <div
                className={`absolute bottom-0 w-full h-1 ${getRarityColor(mat.rarity)}`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DomainCard;
