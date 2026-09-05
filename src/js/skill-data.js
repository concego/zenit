// Catálogo de habilidades e regras de afinidade das classes.

export const CLASS_SKILL_RULES = Object.freeze({
    vanguard: Object.freeze({ focus: "potencia", fixedSkill: "guardian_oath", generatedAffinity: "potencia" }),
    hunter: Object.freeze({ focus: "coordenacao", fixedSkill: "aimed_shot", generatedAffinity: "coordenacao" }),
    mystic: Object.freeze({ focus: "mente", fixedSkill: "arcane_spark", generatedAffinity: "mente" })
});

export const SKILL_TEMPLATES = Object.freeze([
    Object.freeze({ id: "guardian_oath", nameKey: "skills.guardianOath", classes: ["vanguard"], school: "support", resource: "stamina", baseCost: 4, maxLevel: 5, requirements: { attributes: { potencia: 12 } }, effects: { armor: 2, damageReduction: 0.05 } }),
    Object.freeze({ id: "aimed_shot", nameKey: "skills.aimedShot", classes: ["hunter"], school: "precision", resource: "stamina", baseCost: 4, maxLevel: 5, requirements: { attributes: { coordenacao: 12 } }, effects: { damage: 4, accuracy: 0.1 } }),
    Object.freeze({ id: "arcane_spark", nameKey: "skills.arcaneSpark", classes: ["mystic"], school: "elemental", resource: "mana", baseCost: 5, maxLevel: 5, requirements: { attributes: { mente: 12 } }, effects: { damage: 6, range: 3 } }),
    Object.freeze({ id: "heavy_strike", nameKey: "skills.heavyStrike", classes: ["vanguard"], school: "martial", resource: "stamina", baseCost: 5, maxLevel: 5, requirements: { attributes: { potencia: 15 } }, effects: { damage: 8, stagger: 0.1 } }),
    Object.freeze({ id: "shield_bastion", nameKey: "skills.shieldBastion", classes: ["vanguard"], school: "defense", resource: "stamina", baseCost: 6, maxLevel: 4, requirements: { attributes: { potencia: 16 }, skills: [{ id: "guardian_oath", level: 1 }] }, effects: { armor: 5, block: 0.15 } }),
    Object.freeze({ id: "battle_prayer", nameKey: "skills.battlePrayer", classes: ["vanguard", "mystic"], school: "support", resource: "mana", baseCost: 7, maxLevel: 4, requirements: { attributes: { mente: 14 } }, effects: { heal: 8, damage: 2 } }),
    Object.freeze({ id: "rally", nameKey: "skills.rally", classes: ["vanguard", "hunter"], school: "support", resource: "stamina", baseCost: 5, maxLevel: 4, requirements: { attributes: { potencia: 14, coordenacao: 12 } }, effects: { power: 2, coordination: 2 } }),
    Object.freeze({ id: "precise_shot", nameKey: "skills.preciseShot", classes: ["hunter"], school: "precision", resource: "stamina", baseCost: 5, maxLevel: 5, requirements: { attributes: { coordenacao: 15 } }, effects: { damage: 7, critical: 0.12 } }),
    Object.freeze({ id: "shadow_step", nameKey: "skills.shadowStep", classes: ["hunter"], school: "rogue", resource: "stamina", baseCost: 6, maxLevel: 4, requirements: { attributes: { coordenacao: 16 }, skills: [{ id: "aimed_shot", level: 1 }] }, effects: { evasion: 0.15, movement: 1 } }),
    Object.freeze({ id: "trap", nameKey: "skills.trap", classes: ["hunter"], school: "survival", resource: "stamina", baseCost: 5, maxLevel: 4, requirements: { attributes: { coordenacao: 14 } }, effects: { damage: 5, control: 1 } }),
    Object.freeze({ id: "beast_companion", nameKey: "skills.beastCompanion", classes: ["hunter", "mystic"], school: "nature", resource: "mana", baseCost: 8, maxLevel: 3, requirements: { attributes: { mente: 15, coordenacao: 14 } }, effects: { companionDamage: 5, companionHp: 20 } }),
    Object.freeze({ id: "elemental_bolt", nameKey: "skills.elementalBolt", classes: ["mystic"], school: "elemental", resource: "mana", baseCost: 6, maxLevel: 5, requirements: { attributes: { mente: 15 } }, effects: { damage: 10, range: 4 } }),
    Object.freeze({ id: "healing_rite", nameKey: "skills.healingRite", classes: ["mystic"], school: "restoration", resource: "mana", baseCost: 7, maxLevel: 4, requirements: { attributes: { mente: 16 } }, effects: { heal: 14 } }),
    Object.freeze({ id: "spirit_call", nameKey: "skills.spiritCall", classes: ["mystic"], school: "shamanic", resource: "mana", baseCost: 8, maxLevel: 4, requirements: { attributes: { mente: 17 } }, effects: { damage: 8, resistance: 0.1 } }),
    Object.freeze({ id: "root_entangle", nameKey: "skills.rootEntangle", classes: ["mystic", "hunter"], school: "nature", resource: "mana", baseCost: 6, maxLevel: 4, requirements: { attributes: { mente: 15, coordenacao: 12 } }, effects: { control: 2, damage: 4 } }),
    Object.freeze({ id: "second_wind", nameKey: "skills.secondWind", classes: ["vanguard", "hunter"], school: "survival", resource: "stamina", baseCost: 5, maxLevel: 4, requirements: { attributes: { potencia: 14, coordenacao: 12 } }, effects: { heal: 10, stamina: 8 } }),
    Object.freeze({ id: "smoke_screen", nameKey: "skills.smokeScreen", classes: ["hunter", "mystic"], school: "control", resource: "stamina", baseCost: 6, maxLevel: 4, requirements: { attributes: { coordenacao: 15 } }, effects: { evasion: 0.2, control: 1 } }),
    Object.freeze({ id: "ward", nameKey: "skills.ward", classes: ["vanguard", "mystic"], school: "defense", resource: "mana", baseCost: 7, maxLevel: 4, requirements: { attributes: { mente: 15, potencia: 12 } }, effects: { armor: 4, resistance: 0.15 } }),
    Object.freeze({ id: "poisoned_edge", nameKey: "skills.poisonedEdge", classes: ["hunter", "mystic"], school: "debuff", resource: "stamina", baseCost: 5, maxLevel: 4, requirements: { attributes: { coordenacao: 15 } }, effects: { damage: 3, poison: 2 } }),
    Object.freeze({ id: "blood_pact", nameKey: "skills.bloodPact", classes: ["vanguard", "mystic"], school: "risk", resource: "hp", baseCost: 8, maxLevel: 3, requirements: { attributes: { potencia: 16, mente: 14 } }, effects: { damage: 12, hpCost: 8 } })
]);

export const SKILL_TEMPLATE_BY_ID = Object.freeze(Object.fromEntries(SKILL_TEMPLATES.map((skill) => [skill.id, skill])));
