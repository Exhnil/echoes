export interface Character {
    id: string
    name: string
    attribute: string
    weapon: string
    gender: string
    nation: string
    class: string
    rarity: number
    release: string
    ascension_materials: AscensionMaterials
    skill_materials: SkillMaterials
    stats_bonus_materials: StatsBonusMaterials
    inherent_skill_materials: InherentSkillMaterials
}

export interface Material {
    name: string;
    value: number;
}

interface AscensionMaterials {
    [ascensionLevel: string]: Material[];
}

interface SkillMaterials {
    [level: string]: Material[];
}

interface StatsBonusMaterials {
    [rank: string]: Material[];
}

interface InherentSkillMaterials {
    [rank: string]: Material[];
}

export interface CharacterState {
    id: string;
    level: levelState
    skills: Record<string, SkillState>
    bonusStats: BonusStat[]
    inherentSkills: InherentSkill[]
}

interface levelState {
    currentAscensionLevel: number;
    targetAscensionLevel:number
    currentLevel: number;
    targetLevel: number;
}

export interface SkillState {
    currentSkillLevel: number;
    targetSkillLevel: number;
}

export type UnlockState = "none" | "planned" | "done";

export interface BonusStat {
    id: string;
    rank: number;
    index: number;
    state: UnlockState;
}

export interface InherentSkill {
    id: string;
    rank: number;
    state: UnlockState;
}

export interface Weapon {
    id: string
    name: string
    type: string
    rarity: number
    ascension_materials: AscensionMaterials
}

export interface WeaponState {
    id: string;
    level: levelState
}

export interface Item {
    name: string,
    id: string,
    type: string,
    rarity: number,
    source: string
}

export interface ItemState {
    id: string;
    name: string;
    owned: number;
    required: number;
}