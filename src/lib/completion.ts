import type {
  Character,
  CharacterState,
  ItemState,
  Material,
  Weapon,
  WeaponState,
} from "@/types";

const addMats = (
  materials: Material[],
  totalMats: Record<string, Material>
) => {
  for (const { name, id, value } of materials) {
    totalMats[id] ??= { name, id, value: 0 };
    totalMats[id].value += value;
  }
};

export const completeCharacterLevel = (
  state: CharacterState,
  inventory: ItemState[],
  character: Character
) => {
  const totalMats: Record<string, Material> = {};

  for (const [levelString, materials] of Object.entries(
    character.ascension_materials
  )) {
    const level = Number(levelString);
    if (
      level > state.level.currentAscensionLevel &&
      level <= state.level.targetAscensionLevel
    ) {
      addMats(materials, totalMats);
    }
  }

  const newInventory = consumeMats(inventory, totalMats);
  state.level.currentAscensionLevel = state.level.targetAscensionLevel;
  state.level.currentLevel = state.level.targetLevel;

  return newInventory;
};

export const completeCharacterSkills = (
  state: CharacterState,
  inventory: ItemState[],
  character: Character
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
        materials.map((material) => ({
          name: material.name,
          id: material.id,
          value: material.value * skillStepNumber,
        })),
        totalMats
      );
    }
  }

  const newInventory = consumeMats(inventory, totalMats);

  // Mise à jour des niveaux
  for (const skill of Object.values(state.skills)) {
    skill.currentSkillLevel = skill.targetSkillLevel;
  }

  return newInventory;
};

export const completeCharacterTalents = (
  state: CharacterState,
  inventory: ItemState[],
  character: Character
) => {
  const totalMats: Record<string, Material> = {};

  // Bonus Stats
  for (const bonus of state.bonusStats) {
    if (bonus.state === "planned") {
      const mats = character.stats_bonus_materials[bonus.id];
      if (mats) addMats(mats, totalMats);
    }
  }

  // Inherent Skills
  for (const skill of state.inherentSkills) {
    if (skill.state === "planned") {
      const mats = character.inherent_skill_materials[skill.id];
      if (mats) addMats(mats, totalMats);
    }
  }

  // Consommation
  const newInventory = consumeMats(inventory, totalMats);
  // Mise à jour des talents
  for (const bonus of state.bonusStats) {
    if (bonus.state === "planned") bonus.state = "done";
  }
  for (const skill of state.inherentSkills) {
    if (skill.state === "planned") skill.state = "done";
  }

  return newInventory;
};

export const completeWeaponLevel = (
  state: WeaponState,
  inventory: ItemState[],
  weapon: Weapon
) => {
  const totalMats: Record<string, Material> = {};

  for (const [levelString, materials] of Object.entries(
    weapon.ascension_materials
  )) {
    const level = Number(levelString);
    if (
      level > state.level.currentAscensionLevel &&
      level <= state.level.targetAscensionLevel
    ) {
      addMats(materials, totalMats);
    }
  }

  const newInventory = consumeMats(inventory, totalMats);
  state.level.currentAscensionLevel = state.level.targetAscensionLevel;
  state.level.currentLevel = state.level.targetLevel;

  return newInventory;
};

const consumeMats = (
  inventory: ItemState[],
  totalMats: Record<string, Material>
) => {
  const newInventory = structuredClone(inventory);
  for (const [id, mat] of Object.entries(totalMats)) {
    const itemState = newInventory.find((i) => i.id === id);
    if (!itemState) return inventory;
    itemState.owned =
      itemState.owned >= mat.value ? itemState.owned - mat.value : 0;
  }
  return newInventory;
};
