import { axiosInstance } from "@/lib/axios";
import type { Weapon } from "@/types";
import { AlertCircle } from "lucide-react";
import { useCallback } from "react";

interface WeaponCardProps {
  weapon: Weapon;
  setSelectedWeapon: (weapon: Weapon) => void;
}

const rarityColors: Record<number, string> = {
  2: "bg-green-400",
  3: "bg-blue-400",
  4: "bg-violet-600",
  5: "bg-equator-700",
};

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent";
};

const WeaponCard = ({ weapon, setSelectedWeapon }: WeaponCardProps) => {
  const hasObjective = () => {
    /*const saved = localStorage.getItem("weaponState")
    const parsed: Record<string, WeaponState> = saved ? JSON.parse(saved) : {}

    const weaponState = parsed[weapon.id]
    if (!weaponState) return false

    const level = weaponState.level
    if (level.currentAscensionLevel !== level.targetAscensionLevel || level.currentLevel !== level.targetLevel) {
      return true
    }
*/
    return false;
  };

  const getWeaponIcon = useCallback((id: string) => {
    const url = `${axiosInstance.defaults.baseURL}/weapons/${id.toLowerCase()}/icon.png`;
    return url;
  }, []);

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => setSelectedWeapon(weapon)}
    >
      <div
        className={`relative rounded-none justify-between items-center bg-iron-900`}
      >
        <div className="relative">
          <img
            src={getWeaponIcon(weapon.id)}
            alt={weapon.name}
            className="object-contain w-full"
          />

          <div
            className={`absolute bottom-0 left-0 w-full h-1 ${getRarityColor(weapon.rarity)}`}
          />

          {hasObjective() && (
            <div className="absolute top-1 left-1 w-6 h-6 bg-amber-600/90 rounded-full flex items-center justify-center shadow-md border-white">
              <AlertCircle className="w-4 h-4 text-zinc-300" />
            </div>
          )}
        </div>
        <div className="bg-zinc-700 text-center font-medium">{weapon.name}</div>
      </div>
    </div>
  );
};

export default WeaponCard;
