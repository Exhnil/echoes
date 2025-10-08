import type { CharacterState, WeaponState } from "@/types";

export const updateCharacterLevel = (
  prev: Record<string, CharacterState>,
  characterId: string,
  key: "current" | "target",
  level: number,
  ascension: number
) => ({
  ...prev,
  [characterId]: {
    ...prev[characterId],
    level: {
      ...prev[characterId].level,
      [key + "Level"]: level,
      [key + "AscensionLevel"]: ascension,
    },
  },
});

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

export const updateTalents = () => {};

export const updateWeaponLevel = (
  prev: Record<string, WeaponState>,
  id: string,
  key: "current" | "target",
  lvl: number,
  ascension: number
) => ({
  ...prev,
  [id]: {
    ...prev[id],
    level: {
      ...prev[id].level,
      [key + "Level"]: lvl,
      [key + "AscensionLevel"]: ascension,
    },
  },
});
