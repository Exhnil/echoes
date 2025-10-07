import type { Character, CharacterState, Material, Weapon, WeaponState } from "@/types";

export const calculate = (
  characters: Character[],
  weapons: Weapon[],
  charactersState: Record<string, CharacterState>,
  weaponsState: Record<string, WeaponState>
) => {
  const totalMats: Record<string, Material> = {};
  const addMats = (materials: Material[]) => {
    for (const { name, value } of materials) {
      totalMats[name] ??= { name, value: 0 };
      totalMats[name].value += value;
    }
  };

  const charaMap = Object.fromEntries(characters.map((c) => [c.id, c]));
  const weapMap = Object.fromEntries(weapons.map((w) => [w.id, w]));

  for (const [characterId, state] of Object.entries(charactersState)) {
    const character = charaMap[characterId];
    if (!character) continue;

    const {
      currentAscensionLevel: currentAscensionLevel,
      targetAscensionLevel: targetAscensionLevel,
    } = state.level;

    // ascension
    for (const [levelString, materials] of Object.entries(
      character.ascension_materials
    )) {
      const level = Number(levelString);
      if (level > currentAscensionLevel && level <= targetAscensionLevel) {
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

  for (const [weaponId, state] of Object.entries(weaponsState)) {
    const weapon = weapMap[weaponId];
    if (!weapon) continue;
    const {
      currentAscensionLevel: currentAscensionLevel,
      targetAscensionLevel: targetAscensionLevel,
    } = state.level;

    for(const [levelString,materials]of Object.entries(
      weapon.ascension_materials
    )){
      const level = Number(levelString);
      if(level>currentAscensionLevel&&level <= targetAscensionLevel){
        addMats(materials)
      }
    }
  }
  return totalMats;
};
