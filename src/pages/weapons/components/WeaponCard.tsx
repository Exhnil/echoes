import type { Weapon } from "@/types"

interface WeaponCardProps {
  weapon: Weapon;
  weaponIcon: string;
  setSelectedWeapon: (weapon: Weapon) => void;
}

const rarityColors: Record<number, string> = {
  2: "from-green-400",
  3: "from-blue-400",
  4: "from-purple-600",
  5: "from-yellow-400",
}

const getRarityColor = (rarity: number) => {
  return rarityColors[rarity] ?? "from-transparent"
}

const WeaponCard = ({ weapon, weaponIcon, setSelectedWeapon }: WeaponCardProps) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => setSelectedWeapon(weapon)}>
      <div className={`relative bg-gradient-to-b rounded-xl justify-between items-center ${getRarityColor(weapon.rarity)} to-zinc-800`}>
        <img
          src={weaponIcon}
          alt={weapon.name}
          className="object-contain" />
        <div className="text-center font-medium">{weapon.name}</div>
      </div>
    </div>
  )
}

export default WeaponCard