import type { Character, CharacterState, Material } from "@/types";

export const calculate = (
  characters: Character[],
  charactersState: Record<string, CharacterState>
) => {
  const totalMats: Record<string, Material> = {};
  const addMats = (materials: Material[]) => {
    for (const { name, value } of materials) {
      totalMats[name] ??= { name, value: 0 };
      totalMats[name].value += value;
    }
  };

  const charaMap = Object.fromEntries(characters.map((c) => [c.id, c]));

  for (const [characterId, state] of Object.entries(charactersState)) {
    const character = charaMap[characterId];
    if (!character) continue;

    const { currentCharacterLevel, targetCharacterLevel } = state.level;

    // ascension
    for (const [levelString, materials] of Object.entries(
      character.ascension_materials
    )) {
      const level = Number(levelString);
      if (level > currentCharacterLevel && level <= targetCharacterLevel) {
        addMats(materials);
      }
    }

    // skills
    for (const [levelString, materials] of Object.entries(
      character.skill_materials
    )) {
      const level = Number(levelString);
      const skillStepNumber = Object.values(state.skills).filter(
        (skill) =>
          level > skill.currentSkillLevel && level <= skill.targetSkillLevel
      ).length;

      if (skillStepNumber > 0) {
        addMats(
          materials.map((material) => ({
            name: material.name,
            value: material.value * skillStepNumber,
          }))
        );
      }
    }

    for (const bonus of state.bonusStats ?? []) {
      if (bonus.state !== "planned") continue;
      const mats = character.stats_bonus_materials?.[`rank_${bonus.rank}`];
      if (mats) addMats(mats);
    }

    for (const inherent of state.inherentSkills ?? []) {
      if (inherent.state !== "planned") continue;
      const mats =
        character.inherent_skill_materials?.[`rank_${inherent.rank}`];
      if (mats) addMats(mats);
    }
  }
  return totalMats;
};
