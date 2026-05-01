import type {
  CharacterProgress,
  LevelProgress,
  SkillProgress,
  UnlockProgress,
} from "@/types";
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

export const updateLevelState = <T extends { level: LevelProgress }>(
  prev: Record<string, T>,
  id: string,
  side: "current" | "target",
  lvl: number,
  ascension: number,
) => {
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
  key: "currentSkillLevel" | "targetSkillLevel",
  value: number,
) => {
  if (value < 1 || value > 10) return;
  return {
    ...prev,
    [characterId]: {
      ...prev[characterId],
      skills: {
        ...prev[characterId].skills,
        [skillName]: {
          ...prev[characterId].skills[skillName],
          [key]: value,
        },
      },
    },
  };
};

export const updateTalentsState = (
  prev: Record<string, CharacterProgress>,
  characterId: string,
  id: string,
  key: "bonusStats" | "inherentSkills",
  value: UnlockProgress,
) => {
  const character = prev[characterId];
  if (!character) return prev;

  const list = character[key];
  const index = list.findIndex((i) => i.id === id);
  if (index < 0) return prev;

  const updatedList = [...list];
  updatedList[index] = { ...updatedList[index], state: value };

  return {
    ...prev,
    [characterId]: {
      ...prev[characterId],
      [key]: updatedList,
    },
  };
};
