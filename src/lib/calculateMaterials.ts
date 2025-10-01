import type { Character, CharacterState, Material } from "@/types";

const totalMats: Record<string, Material> = {};

const addMats = (materials: Material[]) => {
  for (const material of materials) {
    const exist = totalMats[material.name];
    if (exist) {
      exist.value += material.value;
    } else {
      totalMats[material.name] = { ...material };
    }
  }
};

export const calculate = (
  characters: Character[],
  charactersState: Record<string, CharacterState>
) => {
  const charaMap = Object.fromEntries(characters.map((c) => [c.id, c]));

  for (const [characterId, state] of Object.entries(charactersState)) {
    const character = charaMap[characterId];
    if (!character) continue;

    const { currentCharacterLevel, targetCharacterLevel } = state.level;

    for (const [levelString, materials] of Object.entries(
      character.ascension_materials
    )) {
      const level = +levelString;
      if (level >= currentCharacterLevel && level <= targetCharacterLevel) {
        addMats(materials);
      }
    }

    for (const [levelStr, materials] of Object.entries(
      character.skill_materials
    )) {
      const level = +levelStr;
      for (const { currentSkillLevel, targetSkillLevel } of Object.values(
        state.skills
      )) {
        if (level >= currentSkillLevel && level <= targetSkillLevel) {
          addMats(materials);
        }
      }
    }
  }

  //console.log(totalMats);
  return totalMats;
};
