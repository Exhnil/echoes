import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { weaponIcons } from "@/constants/icons"
import { useMiscStore } from "@/store/MiscStore"
import { Star } from "lucide-react"
import { lazy, Suspense, useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const WeaponGrid = lazy(()=> import("./components/WeaponGrid"))

const Weapons = () => {
  const { weaponsTypes, fetchWeaponsType, isLoading } = useMiscStore()

  const [selectedRarity, setSelectedRarity] = useState<string>("")
  const [selectedWeaponType, setSelectedWeaponType] = useState<string>("")

  useEffect(() => {
    fetchWeaponsType()
  }, [fetchWeaponsType])

  return (
    <div className="p-6">
      <div className="items-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Weapons</h1>
      </div>

      <div className="mb-6">
        <span className="block font-semibold mb-2">Filter</span>
        {isLoading ? (
          <div>Loading</div>
        ) : (
          <div className="flex items-center gap-6">
            <ToggleGroup
              type="single"
              className="flex bg-zinc-800"
              value={selectedRarity}
              onValueChange={setSelectedRarity}>
              <ToggleGroupItem
                value="1"
                className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                <Star className="text-zinc-400" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                <Star className="text-green-500" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3"
                className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                <Star className="text-blue-600" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="4"
                className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                <Star className="text-purple-600" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="5"
                className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                <Star className="text-amber-400" />
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type="single"
              className="flex bg-zinc-800"
              value={selectedWeaponType}
              onValueChange={setSelectedWeaponType}>
              {weaponsTypes.map((weapon) => (
                <ToggleGroupItem
                  value={weapon}
                  key={weapon}
                  className="px-3 py-1 border hover:bg-zinc-700 cursor-pointer">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img src={weaponIcons[weapon]}
                        alt={weapon}
                        className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{weapon}</p>
                    </TooltipContent>
                  </Tooltip>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>

      <Suspense>
        <WeaponGrid
          rarity={selectedRarity}
          weaponType={selectedWeaponType} />
      </Suspense>
    </div>
  )
}

export default Weapons