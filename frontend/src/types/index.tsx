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
    stats_bonus_material: StatsBonusMaterial
    inherent_skill_materials: InherentSkillMaterials
}

interface Material {
    name: string;
    value: number
}

interface AscensionMaterials {
    [level: string]: Material[];
}

interface SkillMaterials {
    [level: string]: Material[];
}

interface StatsBonusMaterial {
    [level: string]: Material[];
}

interface InherentSkillMaterials {
    [level: string]: Material[];
}