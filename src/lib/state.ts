import type { CharacterState, LevelState, UnlockState } from "@/types";

export const updateSkillLevel = (
  prev: Record<string, CharacterState>,
  characterId: string,
  skillName: string,
  key: "currentSkillLevel" | "targetSkillLevel",
  value: number
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
  prev: Record<string, CharacterState>,
  characterId: string,
  id: string,
  key: "bonusStats" | "inherentSkills",
  value: UnlockState
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

export const updateLevelState = <T extends { level: LevelState }>(
  prev: Record<string, T>,
  id: string,
  key: "current" | "target",
  lvl: number,
  ascension: number
) => {
  return {
    ...prev,
    [id]: {
      ...prev[id],
      level: {
        ...prev[id].level,
        [key + "Level"]: lvl,
        [key + "AscensionLevel"]: ascension,
      },
    },
  };
};
