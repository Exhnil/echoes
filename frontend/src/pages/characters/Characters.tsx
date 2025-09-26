import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMiscStore } from '@/store/MiscStore'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import CharactersGrid from './components/CharactersGrid'

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
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Characters</h1>
        <Button>Add</Button>
      </div>

      <div className='mb-6'>
        <span className='block font-semibold mb-2'>Filter</span>
        {isLoading ? (
          <div>Is loading...</div>
        ) : (
          <div className='flex items-center gap-6'>
            <ToggleGroup
              type='single'
              className='flex'
              value={selectedRarity ?? ''}
              onValueChange={setSelectedRarity}>
              <ToggleGroupItem value='4' className='px-3 py-1 border'>
                <Star className='text-purple-600' />
              </ToggleGroupItem>
              <ToggleGroupItem value='5' className='px-3 py-1 border'>
                <Star className='text-amber-400' />
              </ToggleGroupItem>
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className='flex'
              value={selectedAttribute ?? ''}
              onValueChange={setSelectedAttribute}>
              {attributes.map((attribute) => (
                <ToggleGroupItem
                  key={attribute}
                  value={attribute}
                  className='px-3 py-1 border'>
                  {attribute}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <ToggleGroup
              type='single'
              className="flex"
              value={selectedWeapon ?? ''}
              onValueChange={setSelectedWeapon}>
              {weaponsTypes.map((weapon) => (
                <ToggleGroupItem
                  key={weapon}
                  value={weapon}
                  className='px-3 py-1 border'>
                  {weapon}
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