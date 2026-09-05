// Regras de construção, ecologia e loot dos biomas.
import { ITEM_TIERS } from "./item-data.js";

export const MAP_BIOMES = Object.freeze({
    SEWERS: Object.freeze({
        id: "sewers", nameKey: "maps.biomes.sewers", openness: "enclosed", wallDensity: 0.18,
        terrain: ["floor", "water", "wall"],
        enemyFamilies: ["rat", "slime", "cultist"],
        interactables: ["crate", "barrel", "chest", "door", "grate"],
        resources: ["iron_ore", "mushroom", "reeds"],
        preferredDrops: ["consumable", "tool", "equipment"],
        lootBias: { consumable: 3, tool: 2, equipment: 1, weapon: 1 }
    }),
    FOREST: Object.freeze({
        id: "forest", nameKey: "maps.biomes.forest", openness: "open", wallDensity: 0.04,
        terrain: ["floor", "grass", "tree", "stream"],
        enemyFamilies: ["wolf", "boar", "spider"],
        interactables: ["crate", "barrel", "chest", "door", "herb_patch"],
        resources: ["wood", "herb", "fruit", "resin"],
        preferredDrops: ["consumable", "tool", "equipment"],
        lootBias: { consumable: 4, tool: 2, equipment: 1, weapon: 1 }
    }),
    HILLS: Object.freeze({
        id: "hills", nameKey: "maps.biomes.hills", openness: "open", wallDensity: 0.08,
        terrain: ["floor", "grass", "hill", "stone"],
        enemyFamilies: ["bandit", "boar", "harpy"],
        interactables: ["crate", "barrel", "chest", "door", "watchtower"],
        resources: ["wood", "stone", "herb", "copper_ore"],
        preferredDrops: ["weapon", "equipment", "tool"],
        lootBias: { consumable: 2, tool: 2, equipment: 3, weapon: 3 }
    }),
    MOUNTAINS: Object.freeze({
        id: "mountains", nameKey: "maps.biomes.mountains", openness: "enclosed", wallDensity: 0.28,
        terrain: ["floor", "stone", "mountain", "chasm"],
        enemyFamilies: ["golem", "harpy", "dragonkin"],
        interactables: ["crate", "chest", "door", "ore_node", "bridge"],
        resources: ["iron_ore", "copper_ore", "gold_ore", "stone"],
        preferredDrops: ["weapon", "equipment", "tool"],
        lootBias: { consumable: 1, tool: 3, equipment: 3, weapon: 4 }
    }),
    RUINS: Object.freeze({
        id: "ruins", nameKey: "maps.biomes.ruins", openness: "mixed", wallDensity: 0.2,
        terrain: ["floor", "stone", "wall", "rubble"],
        enemyFamilies: ["skeleton", "cultist", "shade"],
        interactables: ["crate", "barrel", "chest", "door", "altar"],
        resources: ["stone", "iron_ore", "herb", "crystal"],
        preferredDrops: ["equipment", "weapon", "consumable"],
        lootBias: { consumable: 2, tool: 1, equipment: 4, weapon: 3 }
    })
});

export const MAP_TIERS = Object.freeze({
    COMMON: Object.freeze({ id: "common", rank: ITEM_TIERS.COMMON.rank, difficulty: 1, enemyMultiplier: 1, lootMultiplier: 1, higherTierChance: 0.01 }),
    UNCOMMON: Object.freeze({ id: "uncommon", rank: ITEM_TIERS.UNCOMMON.rank, difficulty: 1.35, enemyMultiplier: 1.2, lootMultiplier: 1.25, higherTierChance: 0.012 }),
    RARE: Object.freeze({ id: "rare", rank: ITEM_TIERS.RARE.rank, difficulty: 1.8, enemyMultiplier: 1.5, lootMultiplier: 1.6, higherTierChance: 0.015 }),
    EPIC: Object.freeze({ id: "epic", rank: ITEM_TIERS.EPIC.rank, difficulty: 2.4, enemyMultiplier: 1.9, lootMultiplier: 2.1, higherTierChance: 0.018 }),
    LEGENDARY: Object.freeze({ id: "legendary", rank: ITEM_TIERS.LEGENDARY.rank, difficulty: 3.2, enemyMultiplier: 2.4, lootMultiplier: 2.8, higherTierChance: 0.02 })
});

export const MAP_BIOME_LIST = Object.freeze(Object.values(MAP_BIOMES));
export const MAP_TIER_LIST = Object.freeze(Object.values(MAP_TIERS));
