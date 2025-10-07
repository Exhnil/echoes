import type { Weapon } from "@/types"

interface WeaponCardProps {
  weapon: Weapon;
  weaponIcon: string;
  setSelectedWeapon: (weapon: Weapon) => void;
}

const WeaponCard = ({ weapon, weaponIcon, setSelectedWeapon }: WeaponCardProps) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={() => setSelectedWeapon(weapon)}>
      <div className="relative bg-gradient-to-b rounded-xl justify-between items-center from-gray-600 to-gray-800">
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