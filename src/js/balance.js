// Modelo numérico inicial do combate e da progressão do Zenit.
// Os valores ficam centralizados para permitir testes de balanceamento.

export const BALANCE = Object.freeze({
    progression: Object.freeze({
        initialLevel: 1,
        levelCap: 20,
        attributePointsPerLevel: 3,
        skillPointsPerLevel: 1,
        firstLevelXp: 100,
        xpGrowth: 75
    }),
    combat: Object.freeze({
        hitBase: 0.75,
        hitMinimum: 0.2,
        hitMaximum: 0.95,
        dodgeBase: 0.03,
        dodgePerCoordination: 0.006,
        dodgeMaximum: 0.4,
        criticalBase: 0.05,
        criticalPerCoordination: 0.004,
        criticalMaximum: 0.3,
        criticalMultiplier: 1.5,
        defenseConstant: 40,
        defenseMaximumReduction: 0.75,
        minimumDamage: 1
    }),
    weapons: Object.freeze({
        melee: Object.freeze({ attribute: "potencia", attributeScale: 0.55, accuracy: 0.02 }),
        ranged: Object.freeze({ attribute: "coordenacao", attributeScale: 0.5, accuracy: 0.05 }),
        magic: Object.freeze({ attribute: "mente", attributeScale: 0.65, accuracy: 0.03 })
    }),
    qualityMultipliers: Object.freeze({ common: 1, uncommon: 1.2, rare: 1.5, epic: 1.9, legendary: 2.45 })
});

export const STARTING_ATTRIBUTES = Object.freeze({ potencia: 12, coordenacao: 10, mente: 10 });
export const CLASS_STARTING_BONUSES = Object.freeze({
    VANGUARDA: Object.freeze({ potencia: 4, coordenacao: -1, mente: -1 }),
    CACADOR: Object.freeze({ potencia: 0, coordenacao: 3, mente: -1 }),
    MISTICO: Object.freeze({ potencia: -1, coordenacao: 0, mente: 3 })
});

function clamp(value, minimum, maximum) { return Math.min(maximum, Math.max(minimum, value)); }

export function getDerivedStats(attributes) {
    return {
        hpMax: Math.max(1, attributes.potencia * 10),
        estMax: Math.max(1, (attributes.potencia + attributes.coordenacao) * 5),
        manaMax: Math.max(1, attributes.mente * 10)
    };
}

export function getClassStartingAttributes(classKey) {
    const bonus = CLASS_STARTING_BONUSES[classKey] || CLASS_STARTING_BONUSES.VANGUARDA;
    return {
        potencia: STARTING_ATTRIBUTES.potencia + bonus.potencia,
        coordenacao: STARTING_ATTRIBUTES.coordenacao + bonus.coordenacao,
        mente: STARTING_ATTRIBUTES.mente + bonus.mente
    };
}

export function getXpForNextLevel(level) {
    const currentLevel = Math.max(1, Number(level) || 1);
    return BALANCE.progression.firstLevelXp + (currentLevel - 1) * BALANCE.progression.xpGrowth;
}

export function getAttackPower({ weaponDamage = 0, attribute = 10, kind = "melee", tier = "common", flatBonus = 0 } = {}) {
    const profile = BALANCE.weapons[kind] || BALANCE.weapons.melee;
    const quality = BALANCE.qualityMultipliers[tier] || BALANCE.qualityMultipliers.common;
    return Math.max(BALANCE.combat.minimumDamage, Math.round((weaponDamage * quality) + attribute * profile.attributeScale + flatBonus));
}

export function getHitChance({ attackerCoordination = 10, defenderCoordination = 10, weaponAccuracy = 0, accuracyBonus = 0 } = {}) {
    const differenceBonus = (attackerCoordination - defenderCoordination) * 0.02;
    return clamp(BALANCE.combat.hitBase + differenceBonus + weaponAccuracy + accuracyBonus, BALANCE.combat.hitMinimum, BALANCE.combat.hitMaximum);
}

export function getDodgeChance({ coordination = 10, evasionBonus = 0 } = {}) {
    return clamp(BALANCE.combat.dodgeBase + Math.max(0, coordination - 10) * BALANCE.combat.dodgePerCoordination + evasionBonus, 0, BALANCE.combat.dodgeMaximum);
}

export function getCriticalChance({ coordination = 10, criticalBonus = 0 } = {}) {
    return clamp(BALANCE.combat.criticalBase + Math.max(0, coordination - 10) * BALANCE.combat.criticalPerCoordination + criticalBonus, 0, BALANCE.combat.criticalMaximum);
}

export function getDamageReduction({ defense = 0, penetration = 0 } = {}) {
    const effectiveDefense = Math.max(0, defense - penetration);
    return clamp(effectiveDefense / (effectiveDefense + BALANCE.combat.defenseConstant), 0, BALANCE.combat.defenseMaximumReduction);
}

export function calculateDamage({ attackPower = 1, targetDefense = 0, armorPenetration = 0, critical = false } = {}) {
    const reduced = attackPower * (1 - getDamageReduction({ defense: targetDefense, penetration: armorPenetration }));
    return Math.max(BALANCE.combat.minimumDamage, Math.round(critical ? reduced * BALANCE.combat.criticalMultiplier : reduced));
}

export function advanceProgression(progression, experience) {
    const next = { ...progression };
    next.experience = Math.max(0, (next.experience || 0) + Math.max(0, experience || 0));
    let levelsGained = 0;
    while (next.level < BALANCE.progression.levelCap && next.experience >= getXpForNextLevel(next.level)) {
        next.experience -= getXpForNextLevel(next.level);
        next.level += 1;
        next.attributePoints = (next.attributePoints || 0) + BALANCE.progression.attributePointsPerLevel;
        next.skillPoints = (next.skillPoints || 0) + BALANCE.progression.skillPointsPerLevel;
        levelsGained += 1;
    }
    return { progression: next, levelsGained };
}
