import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/layout/components/ConfirmDialog";
import { axiosInstance } from "@/lib/axios";
import LevelSelector from "@/pages/characters/components/LevelSelector";
import { useWeaponProgressStore } from "@/store/WeaponProgressStore";
import type { Weapon } from "@/types";
import { Check, ChevronRight, Save } from "lucide-react";

interface WeaponModalProps {
  weapon: Weapon | null;
  open: boolean;
  onClose: () => void;
}

const getWeaponIcon = (id: string) => {
  const normId = id
    .toLocaleLowerCase()
    .replace(/&/g, "and")
    .replace(/[_\s]/g, "-");
  return `${axiosInstance.defaults.baseURL}/weapons/${normId}/images/icon`;
};

const WeaponModal = ({ open, weapon, onClose }: WeaponModalProps) => {
  const { weaponsProgress, updateLevel } = useWeaponProgressStore();

  const completeLeveling = () => {};

  if (!weapon) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-zinc-900 shadow-lg"
        style={{ top: "1rem", transform: "translateY(50%" }}
      >
        <DialogHeader className="flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-zinc-800 to bg-zinc-700 border-b border-zinc-700">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-600 justify-center">
            <img
              src={getWeaponIcon(weapon.id)}
              alt={weapon.name}
              className="object-cover w-full h-full"
            />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {weapon.name}
          </DialogTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-3"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </DialogHeader>
        <div className="p-2 space-y-4">
          <div className="bg-zinc-800 text-center p-2 rounded-md font-medium">
            Level
          </div>
          <div className="flex items-center justify-center space-x-4">
            <LevelSelector
              ascension={weaponsProgress[weapon.id].level.currentAscensionLevel}
              level={weaponsProgress[weapon.id].level.currentLevel}
              onSelect={(lvl, ascension) =>
                updateLevel(weapon.id, "current", lvl, ascension)
              }
            />
            <ChevronRight className="h-6 w-6" />
            <LevelSelector
              ascension={weaponsProgress[weapon.id].level.targetAscensionLevel}
              level={weaponsProgress[weapon.id].level.targetLevel}
              onSelect={(lvl, ascension) =>
                updateLevel(weapon.id, "target", lvl, ascension)
              }
              minValue={weaponsProgress[weapon.id]?.level.currentLevel ?? 1}
            />
          </div>
          <div className="flex justify-end">
            <ConfirmDialog
              title="Finish Character"
              description="Materials will be consumed"
              onConfirm={() => completeLeveling()}
              trigger={
                <Button className="font-semibold px-6 py-2 rounded-lg shadow-md">
                  <Check className="w-4 h-4 mr-2" />
                  Done
                </Button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WeaponModal;
