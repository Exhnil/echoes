import type { Character, CharacterState, Material } from "@/types";

export const calculate = (
  characters: Character[],
  charactersState: Record<string, CharacterState>
) => {
  const totalMats: Record<string, Material> = {};

  Object.entries(charactersState).forEach(([characterId, state]) => {
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;
    const currentCharaLevel = state.level.currentCharacterLevel;
    const targetCharacterLevel = state.level.targetCharacterLevel;

    for (const [levelString, materials] of Object.entries(
      character.ascension_materials
    )) {
      const level = parseInt(levelString, 10);
      if (level >= currentCharaLevel && level <= targetCharacterLevel) {
        for (const material of materials) {
          if (totalMats[material.name]) {
            totalMats[material.name].value += material.value;
          } else {
            totalMats[material.name] = { ...material };
          }
        }
      }
    }
  });
  //console.log(totalMats);
  return totalMats;
};
