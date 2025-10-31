import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMiscStore } from '@/store/MiscStore'
import { Star } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { attributeIcons, elementColor, weaponIcons } from '@/constants/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import FilterSkeleton from '../skeletons/FilterSkeleton'

const CharactersGrid = lazy(() => import("./components/CharactersGrid"))

const Characters = () => {
  const { attributes, weaponsTypes, fetchWeaponsType, fetchAttributes, isLoading } = useMiscStore();

  const [selectedRarity, setSelectedRarity] = useState<string>("")
  const [selectedAttribute, setSelectedAttribute] = useState<string>("")
  const [selectedWeapon, setSelectedWeapon] = useState<string>("")

  const [init, setInit] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("characterFilters")
    if (saved) {
      const { rarity, attribute, weapon } = JSON.parse(saved)
      setSelectedAttribute(attribute || "")
      setSelectedRarity(rarity || "")
      setSelectedWeapon(weapon || "")
    }
    setInit(true)
  }, [])

  useEffect(() => {
    if (!init) return
    localStorage.setItem(
      "characterFilters",
      JSON.stringify({
        rarity: selectedRarity,
        attribute: selectedAttribute,
        weapon: selectedWeapon,
      })
    )
  }, [selectedRarity, selectedAttribute, selectedWeapon, init])

  useEffect(() => {
    fetchAttributes();
    fetchWeaponsType();
  }, [fetchAttributes, fetchWeaponsType])

  return (
    <div className='p-6'>
      <div className='items-center mb-4'>
        <h1 className='text-2xl font-bold mb-2'>Characters</h1>
      </div>

      <div className='mb-6'>
        <span className='block font-semibold mb-2'>Filter</span>
        {isLoading ? (
          <div className="flex gap-4">
            <FilterSkeleton size={2} />
            <FilterSkeleton size={6} />
            <FilterSkeleton size={5} />
          </div>
        ) : (
          <div className='relative inline-flex gap-4 p-2 rounded-s bg-gradient-to-r from-equator-500 to-transparent'>
            <ToggleGroup
              type='single'
              className='flex bg-iron-900'
              value={selectedRarity}
              onValueChange={setSelectedRarity}>
              <ToggleGroupItem value='4' className='px-3 py-1 border hover:bg-zinc-700 cursor-pointer'>
                <Star className='text-purple-600' />
              </ToggleGroupItem>
              <ToggleGroupItem value='5' className='px-3 py-1 border hover:bg-zinc-700 cursor-pointer'>
                <Star className='text-amber-400' />
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className='flex bg-iron-900'
              value={selectedAttribute}
              onValueChange={setSelectedAttribute}>
              {attributes.map((attribute) => (
                <ToggleGroupItem
                  key={attribute}
                  value={attribute}
                  className='relative px-3 py-1 border hover:bg-zinc-700 cursor-pointer'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <div
                          className='absolute top w-5 h-5 rounded-full'
                          style={{
                            background: `radial-gradient(circle, ${elementColor[attribute]} 0%, transparent 70%)`,
                            zIndex: 0
                          }}
                        />
                        <img
                          src={attributeIcons[attribute]}
                          alt={attribute}
                          className='w-5 h-5 relative z-10' />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{attribute}</p>
                    </TooltipContent>
                  </Tooltip>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className="flex bg-iron-900"
              value={selectedWeapon}
              onValueChange={setSelectedWeapon}>
              {weaponsTypes.map((weapon) => (
                <ToggleGroupItem
                  key={weapon}
                  value={weapon}
                  className='px-3 py-1 border hover:bg-zinc-700 cursor-pointer'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={weaponIcons[weapon]}
                        alt={weapon}
                        className='w-5 h-5' />
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

      <div className='my-4 h-1 w-full bg-iron-700' />

      <Suspense>
        <CharactersGrid
          rarity={selectedRarity}
          attribute={selectedAttribute}
          weapon={selectedWeapon} />
      </Suspense>
    </div>
  )
}

export default Characters