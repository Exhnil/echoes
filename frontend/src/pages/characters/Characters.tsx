import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMiscStore } from '@/store/MiscStore'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import CharactersGrid from './components/CharactersGrid'
import { attributeIcons, elementColor, weaponIcons } from '@/constants/icons'

const Characters = () => {
  const { attributes, weaponsTypes, fetchWeaponsType, fetchAttributes, isLoading } = useMiscStore();

  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(null)
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null)

  useEffect(() => {
    fetchAttributes();
    fetchWeaponsType();
  }, [fetchAttributes, fetchWeaponsType])

  return (
    <div className='p-6'>
      <div className='items-center mb-4'>
        <h1 className='text-2xl font-bold mb-2'>Characters</h1>
        <div className='mb-6 flex'>
          <Button className='bg-gray-600 hover:bg-gray-500 text-white'>Add</Button>
        </div>
      </div>

      <div className='mb-6'>
        <span className='block font-semibold mb-2'>Filter</span>
        {isLoading ? (
          <div>Is loading...</div>
        ) : (
          <div className='flex items-center gap-6'>
            <ToggleGroup
              type='single'
              className='flex bg-gray-800'
              value={selectedRarity ?? ''}
              onValueChange={setSelectedRarity}>
              <ToggleGroupItem value='4' className='px-3 py-1 border hover:bg-gray-700 cursor-pointer'>
                <Star className='text-purple-600' />
              </ToggleGroupItem>
              <ToggleGroupItem value='5' className='px-3 py-1 border hover:bg-gray-700 cursor-pointer'>
                <Star className='text-amber-400' />
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className='flex bg-gray-800'
              value={selectedAttribute ?? ''}
              onValueChange={setSelectedAttribute}>
              {attributes.map((attribute) => (
                <ToggleGroupItem
                  key={attribute}
                  value={attribute}
                  className='relative px-3 py-1 border hover:bg-gray-700 cursor-pointer'>

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
                    title={attribute}
                    className='w-5 h-5 relative z-10' />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className="flex bg-gray-800"
              value={selectedWeapon ?? ''}
              onValueChange={setSelectedWeapon}>
              {weaponsTypes.map((weapon) => (
                <ToggleGroupItem
                  key={weapon}
                  value={weapon}
                  className='px-3 py-1 border hover:bg-gray-700 cursor-pointer'>
                  <img
                    src={weaponIcons[weapon]}
                    alt={weapon}
                    title={weapon}
                    className='w-5 h-5' />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

      </div>

      <CharactersGrid
        rarity={selectedRarity}
        attribute={selectedAttribute}
        weapon={selectedWeapon} />
    </div>
  )
}

export default Characters