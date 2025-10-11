import type { Weapon, WeaponState } from "@/types"
import { AlertCircle } from "lucide-react";

interface WeaponCardProps {
  weapon: Weapon;
  weaponIcon: string;
  setSelectedWeapon: (weapon: Weapon) => void;
}

const rarityColors: Record<number, string> = {
  2: "from-green-400",
  3: "from-blue-400",
  4: "from-violet-600",
  5: "from-yellow-500",
}

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent"
}

const WeaponCard = ({ weapon, weaponIcon, setSelectedWeapon }: WeaponCardProps) => {

  const hasObjective = () => {
    const saved = localStorage.getItem("weaponState")
    const parsed: Record<string, WeaponState> = saved ? JSON.parse(saved) : {}

    const weaponState = parsed[weapon.id]
    if (!weaponState) return false

    const level = weaponState.level
    if (level.currentAscensionLevel !== level.targetAscensionLevel || level.currentLevel !== level.targetLevel) {
      return true
    }

    return false
  }

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => setSelectedWeapon(weapon)}>
      <div className={`relative bg-gradient-to-b rounded-xl justify-between items-center ${getRarityColor(weapon.rarity)} to-zinc-800`}>
        <img
          src={weaponIcon}
          alt={weapon.name}
          className="object-contain" />
        {
          hasObjective() && (
            <div
              className='absolute top-1 left-1 w-6 h-6 bg-amber-600/90 rounded-full flex items-center justify-center shadow-md border-white'>
              <AlertCircle
                className='w-4 h-4 text-zinc-300' />
            </div>
          )
        }
        <div className="text-center font-medium">{weapon.name}</div>
      </div>
    </div>
  )
}

export default WeaponCard