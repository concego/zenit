// Conector entre bioma, tier, objeto interativo e loot.
import { createRng, generateItem } from "./item-generator.js";
import { ITEM_CATEGORIES, ITEM_TIERS } from "./item-data.js";
import { MAP_BIOMES, MAP_BIOME_LIST, MAP_TIERS, MAP_TIER_LIST } from "./map-data.js";

const ITEM_TIER_LIST = Object.freeze(Object.values(ITEM_TIERS));

const CONTAINER_RULES = Object.freeze({
    box: Object.freeze({ itemChance: 0.7, minimumItems: 0, maximumItems: 1, goldChance: 0, goldMin: 0, goldMax: 0, woodChance: 0.25, woodMin: 1, woodMax: 2, categoryWeights: { consumable: 3, tool: 2, equipment: 1 } }),
    crate: Object.freeze({ itemChance: 0.75, minimumItems: 0, maximumItems: 1, goldChance: 0.55, goldMin: 2, goldMax: 8, woodChance: 0.25, woodMin: 1, woodMax: 2, categoryWeights: { consumable: 3, tool: 3, equipment: 1, weapon: 1 } }),
    barrel: Object.freeze({ itemChance: 0.65, minimumItems: 0, maximumItems: 1, goldChance: 0.4, goldMin: 1, goldMax: 6, woodChance: 0.5, woodMin: 1, woodMax: 2, categoryWeights: { consumable: 5, tool: 1 } }),
    chest: Object.freeze({ itemChance: 1, minimumItems: 1, maximumItems: 2, goldChance: 0.9, goldMin: 8, goldMax: 25, categoryWeights: { consumable: 2, tool: 2, equipment: 4, weapon: 3 } }),
    altar: Object.freeze({ itemChance: 1, minimumItems: 1, maximumItems: 1, goldChance: 0.25, goldMin: 3, goldMax: 12, categoryWeights: { consumable: 2, equipment: 4, weapon: 2 } })
});

function resolveTier(tier) {
    if (tier && typeof tier === "object" && tier.id) return tier;
    if (typeof tier === "string") return MAP_TIER_LIST.find((candidate) => candidate.id === tier) || null;
    return MAP_TIERS.COMMON;
}

function resolveBiome(biome) {
    if (biome && typeof biome === "object" && biome.id) return biome;
    if (typeof biome === "string") return MAP_BIOME_LIST.find((candidate) => candidate.id === biome) || null;
    return MAP_BIOMES.SEWERS;
}

function weightedChoice(weights, rng) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rng() * total;
    return entries.find(([key, weight]) => { roll -= weight; return roll < 0; })?.[0] || entries[0][0];
}

export function rollLootTier(mapTier = MAP_TIERS.COMMON, rng = Math.random, { boss = false, firstRun = false } = {}) {
    const selectedMapTier = resolveTier(mapTier) || MAP_TIERS.COMMON;
    const normal = ITEM_TIER_LIST.filter((candidate) => candidate.rank <= selectedMapTier.rank);
    const higher = ITEM_TIER_LIST.filter((candidate) => candidate.rank > selectedMapTier.rank);
    const aboveTierChance = boss && firstRun ? 0.25 : selectedMapTier.aboveTierBaseChance;
    let selected;
    if (higher.length && rng() < aboveTierChance) {
        const weights = higher.map((candidate) => 0.25 ** (candidate.rank - selectedMapTier.rank - 1));
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        let roll = rng() * total;
        const index = weights.findIndex((weight) => { roll -= weight; return roll < 0; });
        selected = higher[Math.max(0, index)];
    } else {
        const weights = normal.map((candidate) => candidate.rank === selectedMapTier.rank ? 6 : 3 / (selectedMapTier.rank - candidate.rank + 1));
        const total = weights.reduce((sum, weight) => sum + weight, 0);
        let roll = rng() * total;
        const index = weights.findIndex((weight) => { roll -= weight; return roll < 0; });
        selected = normal[Math.max(0, index)];
    }
    return { tier: selected, exception: selected.rank > selectedMapTier.rank, difference: selected.rank - selectedMapTier.rank };
}

export function generateContainerLoot({ source = "crate", biome = "sewers", tier = "common", level = 1, seed, rng, firstRun = true } = {}) {
    const random = typeof rng === "function" ? rng : createRng(seed);
    const selectedBiome = resolveBiome(biome) || MAP_BIOMES.SEWERS;
    const selectedMapTier = resolveTier(tier) || MAP_TIERS.COMMON;
    const rule = CONTAINER_RULES[source] || CONTAINER_RULES.crate;
    const items = [];
    const exceptions = [];
    const itemCount = rule.minimumItems + Math.floor(random() * (rule.maximumItems - rule.minimumItems + 1));
    for (let index = 0; index < itemCount; index += 1) {
        if (random() > rule.itemChance) continue;
        const roll = rollLootTier(selectedMapTier, random, { firstRun });
        const categoryWeights = Object.fromEntries(Object.entries(rule.categoryWeights).map(([category, weight]) => [category, weight * (selectedBiome.lootBias?.[category] || 1)]));
        const category = weightedChoice(categoryWeights, random);
        items.push(generateItem({ category, tier: roll.tier.id, level, rng: random }));
        if (roll.exception) exceptions.push(roll.difference);
    }
    let gold = 0;
    if (rule.goldChance && random() <= rule.goldChance) {
        const baseGold = rule.goldMin + Math.floor(random() * (rule.goldMax - rule.goldMin + 1));
        gold = Math.max(0, Math.round(baseGold * selectedMapTier.lootMultiplier));
    }
    const materials = [];
    if (rule.woodChance && random() <= rule.woodChance) {
        materials.push({ materialId: "wood", nameKey: "materials.wood", quantity: rule.woodMin + Math.floor(random() * (rule.woodMax - rule.woodMin + 1)) });
    }
    return { source, biome: selectedBiome.id, mapTier: selectedMapTier.id, items, materials, gold, exceptions };
}

export function getContainerRule(source) { return CONTAINER_RULES[source] || null; }
