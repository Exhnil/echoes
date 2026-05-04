import type {
  Character,
  CharacterProgress,
  LevelProgress,
  Material,
  Weapon,
  WeaponProgress,
} from "@/types";

const addMats = (totalMats: Record<string, number>, materials: Material[]) => {
  for (const mat of materials) {
    totalMats[mat.id] = (totalMats[mat.id] ?? 0) + mat.value;
  }
};

export const calculateLevels = (
  reference: Character | Weapon,
  state: LevelProgress,
): Record<string, number> => {
  const totalMats: Record<string, number> = {};

  const {
    currentAscensionLevel: currentAscensionLevel,
    targetAscensionLevel: targetAscensionLevel,
  } = state;

  for (const [levelString, materials] of Object.entries(
    reference.ascension_materials,
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
  state: CharacterProgress,
): Record<string, number> => {
  const totalMats: Record<string, number> = {};

  for (const [levelString, materials] of Object.entries(
    character.skill_materials,
  )) {
    const level = Number(levelString);
    for (const skill of Object.values(state.skills)) {
      if (level > skill.currentSkillLevel && level <= skill.targetSkillLevel) {
        addMats(totalMats, materials);
        break;
      }
    }
  }

  for (const [rank, bonuses] of Object.entries(state.bonusStats)) {
    if (!bonuses) continue;
    for (const bonus of bonuses) {
      if (bonus !== "planned") continue;

      const key = `rank_${rank}`;
      const mats = character.stats_bonus_materials[key];
      if (mats) addMats(totalMats, mats);
    }
  }

  for (const [rank, inherent] of Object.entries(state.inherentSkills)) {
    if (!inherent) continue;
    if (inherent !== "planned") continue;

    const key = `rank_${rank}`;
    const mats = character.stats_bonus_materials[key];
    if (mats) addMats(totalMats, mats);
  }
  return totalMats;
};

export const calculate = (
  characters: Character[],
  weapons: Weapon[],
  charactersProgress: Record<string, CharacterProgress>,
  weaponsProgress: Record<string, WeaponProgress>,
): Record<string, number> => {
  const totalMats: Record<string, number> = {};

  const charaMap = Object.fromEntries(characters.map((c) => [c.id, c]));
  const weapMap = Object.fromEntries(weapons.map((w) => [w.id, w]));

  for (const [characterId, state] of Object.entries(charactersProgress)) {
    const character = charaMap[characterId];
    if (!character) continue;

    mergeMats(totalMats, calculateLevels(character, state.level));
    mergeMats(totalMats, calculateTalents(character, state));
  }

  for (const [weaponId, state] of Object.entries(weaponsProgress)) {
    const weapon = weapMap[weaponId];
    if (!weapon) continue;
    mergeMats(totalMats, calculateLevels(weapon, state.level));
  }
  return totalMats;
};

const mergeMats = (
  target: Record<string, number>,
  source: Record<string, number>,
) => {
  for (const [id, quantity] of Object.entries(source)) {
    if (!id || typeof quantity !== "number") {
      continue;
    }
    target[id] = (target[id] ?? 0) + quantity;
  }
};
