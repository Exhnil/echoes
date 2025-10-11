import { axiosInstance } from '@/lib/axios'
import { useWeaponStore } from '@/store/WeaponStore'
import type { Weapon } from '@/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import WeaponModal from './WeaponModal'
import WeaponCard from './WeaponCard'
import React from 'react'
import WeaponGridSkeleton from '@/pages/skeletons/WeaponGridSkeleton'

interface WeaponGridProps {
  rarity: string
  weaponType: string
}

const WeaponGrid = ({ rarity, weaponType }: WeaponGridProps) => {
  const { weapons, fetchWeapons, isLoading } = useWeaponStore()

  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    if (weapons.length === 0) fetchWeapons()
  }, [fetchWeapons, weapons.length])

  const getWeaponIcon = useCallback((id: string) => {
    const url = `${axiosInstance.defaults.baseURL}/weapons/${id.toLowerCase()}/icon.png`
    return url;
  }, [])

  const filteredWeapons = useMemo(() => {
    return weapons.filter((weapon) => (
      (!rarity || weapon.rarity.toString() === rarity) &&
      (!weaponType || weapon.type === weaponType)
    ))
  }, [weapons, rarity, weaponType])

  useEffect(() => {
    if (weapons.length === 0) return

    let loadedCount = 0
    const total = filteredWeapons.length

    filteredWeapons.forEach((weapon) => {
      const img = new Image()
      img.src = getWeaponIcon(weapon.id)
      img.onload = () => {
        loadedCount += 1
        if (loadedCount === total) setImagesLoaded(true)
      }
    })

    return () => setImagesLoaded(false)
  }, [weapons, filteredWeapons, getWeaponIcon])

  return (
    <>
      <div className='mt-6'>
        {isLoading || !imagesLoaded ?
          (
            <WeaponGridSkeleton count={filteredWeapons.length || 100} />
          ) : (
            <div className='grid grid-cols-8 gap-x-4 gap-y-8'>
              {
                filteredWeapons
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((weapon) => (
                    <WeaponCard
                      key={weapon.id}
                      weapon={weapon}
                      weaponIcon={getWeaponIcon(weapon.id)}
                      setSelectedWeapon={(weapon) => setSelectedWeapon(weapon)} />
                  ))}
            </div>
          )}
      </div >
      <WeaponModal
        open={!!selectedWeapon}
        weapon={selectedWeapon}
        onClose={() => setSelectedWeapon(null)}
      />
    </>
  )
}

export default React.memo(WeaponGrid)