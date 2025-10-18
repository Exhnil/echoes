import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ConfirmDialog from '@/layout/components/ConfirmDialog';
import { axiosInstance } from '@/lib/axios';
import { calculateLevels } from '@/lib/calculateMaterials';
import { completeWeaponLevel } from '@/lib/completion';
import { updateLevelState } from '@/lib/state';
import LevelSelector from '@/pages/characters/components/LevelSelector';
import type { ItemState, Weapon, WeaponState } from '@/types'
import { Check, ChevronRight, Save } from 'lucide-react';
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
      const updated = updateLevelState(prev, weapon.id, currentOrTarget, lvl, ascension)
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

  const completeLeveling = () => {
    if (!weapon) return
    const state = weaponState[weapon.id]
    if (!state) return
    const saved = localStorage.getItem("inventoryState")
    const inventory: ItemState[] = saved ? JSON.parse(saved) : []

    const result = completeWeaponLevel(state, inventory, weapon)

    localStorage.setItem("inventoryState", JSON.stringify(result))
    setWeaponState(prev => {
      const updated = { ...prev }
      updated[weapon.id] = state
      localStorage.setItem("weaponState", JSON.stringify(updated))
      return updated
    })
  }

  const canCompleteLevel = (weapon: Weapon, state: WeaponState) => {
    const needed = calculateLevels(weapon, state)
    const saved = localStorage.getItem("inventoryState")
    const inventory: ItemState[] = saved ? JSON.parse(saved) : []
    for (const [name, mat] of Object.entries(needed)) {
      const item = inventory.find(i => i.name === name)
      if (!item || item.owned < mat.value) return false
    }
    return true
  }

  const levelReady = weapon && weaponState[weapon.id] ? canCompleteLevel(weapon, weaponState[weapon.id]) : false

  if (!weapon) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className='w-[650px] !max-w-none mt-6 p-0 overflow-hidden bg-zinc-900 shadow-lg'
        style={{ top: "1rem", transform: "translateY(50%" }}>
        <DialogHeader
          className='flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-zinc-800 to bg-zinc-700 border-b border-zinc-700'>
          <div className='w-16 h-16 rounded-full overflow-hidden bg-zinc-600 justify-center'>
            <img
              src={getWeaponIcon(weapon.id)}
              alt={weapon.name}
              className='object-cover w-full h-full' />
          </div>
          <DialogTitle className='text-2xl font-bold'>
            {weapon.name}
          </DialogTitle>
          <Button
            variant='secondary'
            size="sm"
            onClick={onClose}
            className='bg-green-600 hover:bg-green-500 text-white font-semibold px-3'
          >
            <Save className='w-4 h-4 mr-1' />
            Save
          </Button>
        </DialogHeader>
        <div className='p-2 space-y-4'>
          <div className='bg-zinc-800 text-center p-2 rounded-md font-medium'>
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
              minValue={weaponState[weapon.id]?.level.currentAscensionLevel ?? 1} />
          </div>
          <div className='flex justify-end'>
            <ConfirmDialog
              title="Finish Character"
              description="Materials will be consumed"
              onConfirm={() => completeLeveling()}
              trigger={<Button
                className={`font-semibold px-6 py-2 rounded-lg shadow-md ${levelReady ? 'bg-green-600' : 'bg-orange-400'}`}>
                <Check className='w-4 h-4 mr-2' />
                Done
              </Button>} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WeaponModal