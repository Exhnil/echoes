import { axiosInstance } from "@/lib/axios";
import { useWeaponStore } from "@/store/WeaponStore";
import type { Weapon } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import WeaponModal from "./WeaponModal";
import WeaponCard from "./WeaponCard";
import React from "react";
import WeaponGridSkeleton from "@/pages/skeletons/WeaponGridSkeleton";
import { useWeaponProgressStore } from "@/store/WeaponProgressStore";

interface WeaponGridProps {
  rarity: string;
  weaponType: string;
}

const WeaponGrid = ({ rarity, weaponType }: WeaponGridProps) => {
  const { weapons, fetchWeapons, isLoading } = useWeaponStore();
  const { initWeaponsProgress } = useWeaponProgressStore();

  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

  useEffect(() => {
    if (weapons.length === 0) fetchWeapons();
  }, [fetchWeapons, weapons.length]);

  const filteredWeapons = useMemo(() => {
    return weapons.filter(
      (weapon) =>
        (!rarity || weapon.rarity.toString() === rarity) &&
        (!weaponType || weapon.type === weaponType),
    );
  }, [weapons, rarity, weaponType]);

  const handleOpenWeapon = (weapon: Weapon) => {
    initWeaponsProgress(weapon);
    setSelectedWeapon(weapon);
  };

  return (
    <>
      <div className="mt-6">
        <div className="grid grid-cols-8 gap-x-4 gap-y-8">
          {filteredWeapons
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((weapon) => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                setSelectedWeapon={handleOpenWeapon}
              />
            ))}
        </div>
      </div>
      {selectedWeapon && (
        <WeaponModal
          open={true}
          weapon={selectedWeapon}
          onClose={() => setSelectedWeapon(null)}
        />
      )}
    </>
  );
};

export default React.memo(WeaponGrid);
