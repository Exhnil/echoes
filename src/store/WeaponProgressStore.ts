import { initWeaponsProgressState, updateWeaponLevelState } from "@/lib/state";
import type { Weapon, WeaponProgress } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WeaponProgressStore {
  weaponsProgress: Record<string, WeaponProgress>;

  error: string | null;

  initWeaponsProgress: (weapon: Weapon) => void;
  updateLevel: (
    id: string,
    side: "current" | "target",
    level: number,
    ascension: number,
  ) => void;
  resetWeapon: (id: string) => void;
}

export const useWeaponProgressStore = create<WeaponProgressStore>()(
  persist(
    (set, get) => ({
      weaponsProgress: {},
      error: null,
      initWeaponsProgress(weapon: Weapon) {
        if (get().weaponsProgress[weapon.id]) return;
        set((prev) => ({
          weaponsProgress: initWeaponsProgressState(
            prev.weaponsProgress,
            weapon.id,
          ),
        }));
      },
      updateLevel: (
        id: string,
        side: "current" | "target",
        level: number,
        ascension: number,
      ) => {
        set((prev) => ({
          weaponsProgress: updateWeaponLevelState(
            prev.weaponsProgress,
            id,
            side,
            level,
            ascension,
          ),
        }));
      },
      resetWeapon: (id: string) => {
        delete get().weaponsProgress[id];
        set((prev) => {
          const { [id]: _, ...rest } = prev.weaponsProgress;
          return { weaponsProgress: rest };
        });
      },
    }),
    {
      name: "weaponsProgress",
      partialize: (prev) => ({
        weaponsProgress: prev.weaponsProgress,
      }),
    },
  ),
);
