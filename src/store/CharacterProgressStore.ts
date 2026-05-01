import { skillNames } from "@/lib/constants";
import type { Character, CharacterProgress, SkillProgress } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CharacterProgressStore {
  charactersProgress: Record<string, CharacterProgress>;

  error: string | null;

  initCharProgress: (char: Character) => void;
}

export const useCharacterProgressStore = create<CharacterProgressStore>()(
  persist(
    (set, get) => ({
      charactersProgress: {},
      error: null,
      initCharProgress: (char: Character) => {
        if (get().charactersProgress[char.id]) return;
        set((prev) => ({
          charactersProgress: {
            ...prev.charactersProgress,
            [char.id]: {
              id: char.id,
              level: {
                currentLevel: 1,
                targetLevel: 1,
                currentAscensionLevel: 0,
                targetAscensionLevel: 0,
              },
              skills: skillNames.reduce(
                (acc, skill) => {
                  acc[skill] = {
                    currentSkillLevel: 1,
                    targetSkillLevel: 1,
                  } as SkillProgress;
                  return acc;
                },
                {} as Record<string, SkillProgress>,
              ),
              bonusStats: {
                1: ["none", "none", "none", "none"],
                2: ["none", "none", "none", "none"],
              },
              inherentSkills: { 1: "none", 2: "none" },
            },
          },
        }));
      },
    }),
    {
      name: "charactersProgress",
      partialize: (prev) => ({
        charactersProgress: prev.charactersProgress,
      }),
    },
  ),
);
