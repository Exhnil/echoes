import type { CharacterState } from "@/types";

export const updateCharacterLevel = (
  prev: Record<string, CharacterState>,
  characterId: string,
  key: "currentCharacterLevel" | "targetCharacterLevel",
  value: number
) => ({
  ...prev,
  [characterId]: {
    ...prev[characterId],
    level: {
      ...prev[characterId].level,
      [key]: value,
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
