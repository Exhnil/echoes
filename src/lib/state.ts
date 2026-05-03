import type { CharacterProgress, SkillProgress, UnlockProgress } from "@/types";
import { skillNames } from "./constants";

export const initCharacterProgressState = (
  prev: Record<string, CharacterProgress>,
  id: string,
): Record<string, CharacterProgress> => {
  return {
    ...prev,
    [id]: {
      level: {
        currentLevel: 1,
        targetLevel: 1,
        currentAscensionLevel: 0,
        targetAscensionLevel: 0,
      },
      skills: Object.fromEntries(
        skillNames.map((skill) => [
          skill,
          {
            currentSkillLevel: 1,
            targetSkillLevel: 1,
          },
        ]),
      ) as Record<string, SkillProgress>,
      bonusStats: {
        1: ["none", "none", "none", "none"],
        2: ["none", "none", "none", "none"],
      },
      inherentSkills: { 1: "none", 2: "none" },
    },
  };
};

export const updateLevelState = (
  prev: Record<string, CharacterProgress>,
  id: string,
  side: "current" | "target",
  lvl: number,
  ascension: number,
): Record<string, CharacterProgress> => {
  const map = {
    current: {
      level: "currentLevel",
      ascension: "currentAscensionLevel",
    },
    target: {
      level: "targetLevel",
      ascension: "targetAscensionLevel",
    },
  } as const;

  const character = prev[id];
  if (!character) return prev;

  return {
    ...prev,
    [id]: {
      ...prev[id],
      level: {
        ...prev[id].level,
        [map[side].level]: lvl,
        [map[side].ascension]: ascension,
      },
    },
  };
};

export const updateSkillLevel = (
  prev: Record<string, CharacterProgress>,
  characterId: string,
  skillName: string,
  side: "currentSkillLevel" | "targetSkillLevel",
  value: number,
): Record<string, CharacterProgress> => {
  if (value < 1 || value > 10) return prev;
  const character = prev[characterId];
  if (!character) return prev;
  return {
    ...prev,
    [characterId]: {
      ...character,
      skills: {
        ...character.skills,
        [skillName]: {
          ...character.skills[skillName],
          [side]: value,
        },
      },
    },
  };
};

export const updateTalentsState = (
  prev: Record<string, CharacterProgress>,
  characterId: string,
  side: "bonusStats" | "inherentSkills",
  rank: number,
  value: UnlockProgress,
  index?: number,
): Record<string, CharacterProgress> => {
  const character = prev[characterId];
  if (!character) return prev;

  if (side === "bonusStats") {
    if (index === undefined) return prev;
    const current = character.bonusStats[rank] || [];
    const updated = [...current];
    updated[index] = value;
    return {
      ...prev,
      [characterId]: {
        ...character,
        [side]: {
          ...character.bonusStats,
          [rank]: updated,
        },
      },
    };
  } else if (side === "inherentSkills") {
    return {
      ...prev,
      [characterId]: {
        ...character,
        [side]: {
          ...character.inherentSkills,
          [rank]: value,
        },
      },
    };
  }
  return prev;
};
