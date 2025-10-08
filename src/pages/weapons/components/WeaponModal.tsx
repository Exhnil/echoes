import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { axiosInstance } from '@/lib/axios';
import { updateWeaponLevel } from '@/lib/statesUpdate';
import LevelSelector from '@/pages/characters/components/LevelSelector';
import type { Weapon, WeaponState } from '@/types'
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react'

interface WeaponModalProps {
  weapon: Weapon | null;
  open: boolean;
  onClose: () => void;
}

const getWeaponIcon = (id: string) => {
  const url = `${axiosInstance.defaults.baseURL}/weapons/${id.toLowerCase()}/icon.png`
  return url;
}

const WeaponModal = ({ open, weapon, onClose }: WeaponModalProps) => {

  const [weaponState, setWeaponState] = useState<Record<string, WeaponState>>({})

  useEffect(() => {
    if (!weapon) return

    const saved = localStorage.getItem("weaponState")
    const parsed: Record<string, WeaponState> = saved ? JSON.parse(saved) : {}

    if (!parsed[weapon.id]) {
      parsed[weapon.id] = {
        id: weapon.id,
        level: { currentLevel: 1, targetLevel: 1, currentAscensionLevel: 0, targetAscensionLevel: 0 }
      }
    }

    setWeaponState(parsed)
  }, [weapon])

  const updateLevel = (currentOrTarget: "current" | "target", lvl: number, ascension: number) => {
    if (!weapon) return

    setWeaponState(prev => {
      const updated = updateWeaponLevel(prev, weapon.id, currentOrTarget, lvl, ascension)
      const weap = updated?.[weapon.id]

      if (!weap) return prev

      const currentAscension = weap.level.currentAscensionLevel;
      const targetAscension = weap.level.targetAscensionLevel;
      const currentLvl = weap.level.currentLevel;
      const targetLvl = weap.level.targetLevel;

      if (currentAscension > targetAscension || (currentAscension === targetAscension && currentLvl > targetLvl)) {
        weap.level.targetAscensionLevel = currentAscension;
        weap.level.targetLevel = currentLvl;
      }

      localStorage.setItem("weaponState", JSON.stringify(updated))
      return updated ?? prev

    })
  }

  if (!weapon) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-gray-900 shadow-lg'
        style={{ top: "1rem", transform: "translateY(50%" }}>
        <DialogHeader
          className='flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-gray-800 to bg-gray-700 border-b border-gray-700'>
          <div className='w-16 h-16 rounded-full overflow-hidden bg-gray-600 justify-center'>
            <img
              src={getWeaponIcon(weapon.id)}
              alt={weapon.name}
              className='object-cover w-full h-full' />
          </div>
          <DialogTitle className='text-2xl font-bold'>
            {weapon.name}
          </DialogTitle>
        </DialogHeader>
        <div className='p-2 space-y-4'>
          <div className='bg-gray-800 text-center p-2 rounded-md font-medium'>
            Level
          </div>
          <div className='flex items-center justify-center space-x-4'>
            <LevelSelector
              ascension={weaponState[weapon.id]?.level.currentAscensionLevel}
              level={weaponState[weapon.id]?.level.currentLevel}
              onSelect={(lvl, ascension) => updateLevel("current", lvl, ascension)} />
            <ChevronRight className='h-6 w-6' />
            <LevelSelector
              ascension={weaponState[weapon.id]?.level.targetAscensionLevel}
              level={weaponState[weapon.id]?.level.targetLevel}
              onSelect={(lvl, ascension) => updateLevel("target", lvl, ascension)}
              minValue={weaponState[weapon.id]?.level.currentAscensionLevel} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WeaponModal