import { initCharacterProgressState, updateLevelState } from "@/lib/state";
import type { Character, CharacterProgress } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharacterProgressStore {
  charactersProgress: Record<string, CharacterProgress>;

  error: string | null;

  initCharProgress: (char: Character) => void;
  updateLevel: (
    id: string,
    side: "current" | "target",
    level: number,
    ascension: number,
  ) => void;
  updateSkills: (
    id: string,
    side: "currentSkillLevel" | "targetSkillLevel",
    skillName: string,
    level: number,
  ) => void;
  updateTalents: () => void;
  resetCharacter: (id: string) => void;
}

export const useCharacterProgressStore = create<CharacterProgressStore>()(
  persist(
    (set, get) => ({
      charactersProgress: {},
      error: null,
      initCharProgress: (char: Character) => {
        if (get().charactersProgress[char.id]) return;
        set((prev) => ({
          charactersProgress: initCharacterProgressState(
            prev.charactersProgress,
            char.id,
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
          charactersProgress: updateLevelState(
            prev.charactersProgress,
            id,
            side,
            level,
            ascension,
          ),
        }));
      },
      updateSkills() {},
      updateTalents() {},
      resetCharacter() {},
    }),
    {
      name: "charactersProgress",
      partialize: (prev) => ({
        charactersProgress: prev.charactersProgress,
      }),
    },
  ),
);
