import type {
  Character,
  CharacterState,
  Material,
  Weapon,
  WeaponState,
} from "@/types";

const addMats = (
  totalMats: Record<string, Material>,
  materials: Material[]
) => {
  for (const { name, value } of materials) {
    totalMats[name] ??= { name, value: 0 };
    totalMats[name].value += value;
  }
};

export const calculateLevels = (
  reference: Character | Weapon,
  state: WeaponState | CharacterState
) => {
  const totalMats: Record<string, Material> = {};

  const {
    currentAscensionLevel: currentAscensionLevel,
    targetAscensionLevel: targetAscensionLevel,
  } = state.level;

  for (const [levelString, materials] of Object.entries(
    reference.ascension_materials
  )) {
    const level = Number(levelString);
    if (level > currentAscensionLevel && level <= targetAscensionLevel) {
      addMats(totalMats, materials);
    }
  }

  return totalMats;
};

export const calculateTalents = (
  character: Character,
  state: CharacterState
) => {
  const totalMats: Record<string, Material> = {};

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
        totalMats,
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
    if (mats) addMats(totalMats, mats);
  }

  for (const inherent of state.inherentSkills ?? []) {
    if (inherent.state !== "planned") continue;
    const mats = character.inherent_skill_materials?.[`rank_${inherent.rank}`];
    if (mats) addMats(totalMats, mats);
  }
  return totalMats;
};

export const calculate = (
  characters: Character[],
  weapons: Weapon[],
  charactersState: Record<string, CharacterState>,
  weaponsState: Record<string, WeaponState>
) => {
  const totalMats: Record<string, Material> = {};

  const charaMap = Object.fromEntries(characters.map((c) => [c.id, c]));
  const weapMap = Object.fromEntries(weapons.map((w) => [w.id, w]));

  for (const [characterId, state] of Object.entries(charactersState)) {
    const character = charaMap[characterId];
    if (!character) continue;

    addMats(totalMats, Object.values(calculateLevels(character, state)));
    addMats(totalMats, Object.values(calculateTalents(character, state)));
  }

  for (const [weaponId, state] of Object.entries(weaponsState)) {
    const weapon = weapMap[weaponId];
    if (!weapon) continue;
    addMats(totalMats, Object.values(calculateLevels(weapon, state)));
  }
  return totalMats;
};
