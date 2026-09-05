// Catálogo interno de itens. Textos exibidos devem ser localizados separadamente.

export const ITEM_TIERS = Object.freeze({
    COMMON: Object.freeze({ id: "common", rank: 1, labelKey: "items.tiers.common", multiplier: 1, affixSlots: 0, weight: 55 }),
    UNCOMMON: Object.freeze({ id: "uncommon", rank: 2, labelKey: "items.tiers.uncommon", multiplier: 1.2, affixSlots: 1, weight: 27 }),
    RARE: Object.freeze({ id: "rare", rank: 3, labelKey: "items.tiers.rare", multiplier: 1.5, affixSlots: 2, weight: 12 }),
    EPIC: Object.freeze({ id: "epic", rank: 4, labelKey: "items.tiers.epic", multiplier: 1.9, affixSlots: 3, weight: 5 }),
    LEGENDARY: Object.freeze({ id: "legendary", rank: 5, labelKey: "items.tiers.legendary", multiplier: 2.45, affixSlots: 4, weight: 1 })
});

export const ITEM_CATEGORIES = Object.freeze({
    CONSUMABLE: "consumable",
    EQUIPMENT: "equipment",
    WEAPON: "weapon",
    TOOL: "tool"
});

export const CONSUMABLE_TEMPLATES = Object.freeze([
    Object.freeze({ id: "healing_potion", nameKey: "items.consumables.healingPotion", effect: "heal", basePower: 25, maxStack: 10 }),
    Object.freeze({ id: "stamina_tonic", nameKey: "items.consumables.staminaTonic", effect: "stamina", basePower: 20, maxStack: 10 }),
    Object.freeze({ id: "mana_tonic", nameKey: "items.consumables.manaTonic", effect: "mana", basePower: 20, maxStack: 10 }),
    Object.freeze({ id: "antidote", nameKey: "items.consumables.antidote", effect: "cure_poison", basePower: 1, maxStack: 10 }),
    Object.freeze({ id: "repair_kit", nameKey: "items.consumables.repairKit", effect: "repair", basePower: 15, maxStack: 5 })
]);

export const EQUIPMENT_TEMPLATES = Object.freeze([
    Object.freeze({ id: "hood", nameKey: "items.equipment.hood", slot: "head", baseArmor: 2, baseAttribute: "mente" }),
    Object.freeze({ id: "helmet", nameKey: "items.equipment.helmet", slot: "head", baseArmor: 4, baseAttribute: "potencia" }),
    Object.freeze({ id: "amulet", nameKey: "items.equipment.amulet", slot: "neck", baseArmor: 1, baseAttribute: "mente" }),
    Object.freeze({ id: "ring", nameKey: "items.equipment.ring", slot: "ring", baseArmor: 0, baseAttribute: "coordenacao" }),
    Object.freeze({ id: "vest", nameKey: "items.equipment.vest", slot: "torso", baseArmor: 5, baseAttribute: "coordenacao" }),
    Object.freeze({ id: "cuirass", nameKey: "items.equipment.cuirass", slot: "torso", baseArmor: 8, baseAttribute: "potencia" }),
    Object.freeze({ id: "belt", nameKey: "items.equipment.belt", slot: "waist", baseArmor: 2, baseAttribute: "potencia" }),
    Object.freeze({ id: "boots", nameKey: "items.equipment.boots", slot: "feet", baseArmor: 3, baseAttribute: "coordenacao" })
]);

export const WEAPON_TEMPLATES = Object.freeze([
    Object.freeze({ id: "short_sword", nameKey: "items.weapons.shortSword", kind: "melee", slot: "melee", baseDamage: 7, baseRange: 1, attribute: "potencia" }),
    Object.freeze({ id: "mace", nameKey: "items.weapons.mace", kind: "melee", slot: "melee", baseDamage: 9, baseRange: 1, attribute: "potencia" }),
    Object.freeze({ id: "spear", nameKey: "items.weapons.spear", kind: "melee", slot: "melee", baseDamage: 6, baseRange: 2, attribute: "coordenacao" }),
    Object.freeze({ id: "short_bow", nameKey: "items.weapons.shortBow", kind: "ranged", slot: "ranged", baseDamage: 5, baseRange: 5, attribute: "coordenacao" }),
    Object.freeze({ id: "crossbow", nameKey: "items.weapons.crossbow", kind: "ranged", slot: "ranged", baseDamage: 10, baseRange: 4, attribute: "mente" }),
    Object.freeze({ id: "wand", nameKey: "items.weapons.wand", kind: "ranged", slot: "ranged", baseDamage: 7, baseRange: 4, attribute: "mente" })
]);

export const TOOL_TEMPLATES = Object.freeze([
    Object.freeze({ id: "lockpick", nameKey: "items.tools.lockpick", toolKind: "opening", baseDurability: 3, recipes: ["locked_container", "simple_lock"] }),
    Object.freeze({ id: "pickaxe", nameKey: "items.tools.pickaxe", toolKind: "mining", baseDurability: 10, recipes: ["ore_node", "stone_block"] }),
    Object.freeze({ id: "hammer", nameKey: "items.tools.hammer", toolKind: "smithing", baseDurability: 12, recipes: ["metal_component", "weapon_repair"] }),
    Object.freeze({ id: "shovel", nameKey: "items.tools.shovel", toolKind: "digging", baseDurability: 8, recipes: ["soft_ground", "buried_cache"] }),
    Object.freeze({ id: "sewing_kit", nameKey: "items.tools.sewingKit", toolKind: "tailoring", baseDurability: 6, recipes: ["cloth_component", "armor_repair"] }),
    Object.freeze({ id: "field_kit", nameKey: "items.tools.fieldKit", toolKind: "general_crafting", baseDurability: 5, recipes: ["camp_item", "basic_component"] })
]);

export const AFFIXES = Object.freeze([
    Object.freeze({ id: "sturdy", nameKey: "items.affixes.sturdy", stat: "armor", baseValue: 2 }),
    Object.freeze({ id: "keen", nameKey: "items.affixes.keen", stat: "damage", baseValue: 2 }),
    Object.freeze({ id: "swift", nameKey: "items.affixes.swift", stat: "coordenacao", baseValue: 1 }),
    Object.freeze({ id: "focused", nameKey: "items.affixes.focused", stat: "mente", baseValue: 1 }),
    Object.freeze({ id: "mighty", nameKey: "items.affixes.mighty", stat: "potencia", baseValue: 1 }),
    Object.freeze({ id: "durable", nameKey: "items.affixes.durable", stat: "durability", baseValue: 4 }),
    Object.freeze({ id: "lucky", nameKey: "items.affixes.lucky", stat: "goldFind", baseValue: 5 })
]);
