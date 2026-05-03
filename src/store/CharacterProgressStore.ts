import {
  initCharacterProgressState,
  updateLevelState,
  updateSkillLevel,
  updateTalentsState,
} from "@/lib/state";
import type { Character, CharacterProgress, UnlockProgress } from "@/types";
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
  updateTalents: (
    id: string,
    side: "bonusStats" | "inherentSkills",
    rank: number,
    value: UnlockProgress,
    index?: number,
  ) => void;
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
      updateSkills(
        id: string,
        side: "currentSkillLevel" | "targetSkillLevel",
        skillName: string,
        level: number,
      ) {
        set((prev) => ({
          charactersProgress: updateSkillLevel(
            prev.charactersProgress,
            id,
            skillName,
            side,
            level,
          ),
        }));
      },
      updateTalents(
        id: string,
        side: "bonusStats" | "inherentSkills",
        rank: number,
        value: UnlockProgress,
        index?: number,
      ) {
        set((prev) => ({
          charactersProgress: updateTalentsState(
            prev.charactersProgress,
            id,
            side,
            rank,
            value,
            index,
          ),
        }));
      },
      resetCharacter(id: string) {
        delete get().charactersProgress[id];
        set((prev) => {
          const { [id]: _, ...rest } = prev.charactersProgress;
          return { charactersProgress: rest };
        });
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
