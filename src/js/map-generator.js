// Geração procedural de mapas por bioma, tier, dificuldade, recursos e loot.
import { generateItem, createRng } from "./item-generator.js";
import { ITEM_CATEGORIES, ITEM_TIERS } from "./item-data.js";
import { MAP_BIOMES, MAP_BIOME_LIST, MAP_TIERS, MAP_TIER_LIST } from "./map-data.js";

const WIDTH = 10;
const HEIGHT = 11;
const TIER_LIST = Object.freeze(Object.values(ITEM_TIERS));
const CATEGORY_LIST = Object.freeze(Object.values(ITEM_CATEGORIES));

function resolveBiome(biome) {
    if (biome && typeof biome === "object" && biome.id) return biome;
    if (typeof biome === "string") return MAP_BIOME_LIST.find((candidate) => candidate.id === biome) || null;
    return MAP_BIOMES.SEWERS;
}

function resolveMapTier(tier) {
    if (tier && typeof tier === "object" && tier.id) return tier;
    if (typeof tier === "string") return MAP_TIER_LIST.find((candidate) => candidate.id === tier) || null;
    return MAP_TIERS.COMMON;
}

function key(x, y) { return `${x},${y}`; }
function inside(x, y, width, height) { return x >= 0 && x < width && y >= 0 && y < height; }
function choose(list, rng) { return list[Math.min(list.length - 1, Math.floor(rng() * list.length))]; }

function weightedChoice(weights, rng) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rng() * total;
    return entries.find(([, weight]) => { roll -= weight; return roll < 0; })?.[0] || entries[0][0];
}

function buildPath(width, height, rng) {
    const path = new Set();
    let x = 0;
    let y = 0;
    path.add(key(x, y));
    while (x !== width - 1 || y !== height - 1) {
        const canRight = x < width - 1;
        const canDown = y < height - 1;
        if (canRight && canDown) {
            if (rng() < 0.55) x += 1;
            else y += 1;
        } else if (canRight) x += 1;
        else y += 1;
        path.add(key(x, y));
    }
    return path;
}

export function rollLootTier(mapTier = MAP_TIERS.COMMON, rng = Math.random, { boss = false, firstRun = false } = {}) {
    const selectedMapTier = resolveMapTier(mapTier) || MAP_TIERS.COMMON;
    const weights = TIER_LIST.map((candidate) => {
        const difference = candidate.rank - selectedMapTier.rank;
        if (difference <= 0) {
            // O tier do mapa e os tiers abaixo continuam sendo os resultados normais.
            return candidate.rank === selectedMapTier.rank ? 6 : 3 / (selectedMapTier.rank - candidate.rank + 1);
        }
        // Cada nível acima reduz bastante a chance. Bosses só recebem esta vantagem na primeira run.
        const baseChance = boss && firstRun ? 0.25 : selectedMapTier.aboveTierBaseChance;
        return baseChance * (0.25 ** (difference - 1));
    });
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let roll = rng() * total;
    const selectedIndex = weights.findIndex((weight) => { roll -= weight; return roll < 0; });
    const selected = TIER_LIST[Math.max(0, selectedIndex)];
    return { tier: selected, exception: selected.rank > selectedMapTier.rank, difference: selected.rank - selectedMapTier.rank };
}

function createTerrain(biome, width, height, path, rng) {
    const walls = [];
    const water = [];
    const props = [];
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
        const cell = key(x, y);
        if (path.has(cell) || (x === 0 && y === 0) || (x === width - 1 && y === height - 1)) continue;
        const roll = rng();
        if (biome.id === "sewers" && roll < 0.11) water.push({ x, y });
        else if (biome.id === "forest" && roll < 0.16) props.push({ type: "tree", x, y, blocking: true });
        else if (biome.id === "hills" && roll < 0.1) props.push({ type: "hill", x, y, blocking: true });
        else if (biome.id === "mountains" && roll < 0.24) walls.push({ x, y });
        else if (biome.id === "mountains" && roll < 0.31) props.push({ type: "chasm", x, y, blocking: true });
        else if (biome.id === "ruins" && roll < biome.wallDensity) walls.push({ x, y });
        else if (roll < biome.wallDensity * 0.35) walls.push({ x, y });
    }
    return { walls, water, props };
}

function addInteractables(map, biome, tier, rng) {
    const occupied = new Set([...map.walls, ...map.water, ...map.props].map((item) => key(item.x, item.y)));
    const reserved = new Set([key(0, 0), key(map.width - 1, map.height - 1)]);
    const free = [];
    for (let y = 0; y < map.height; y += 1) for (let x = 0; x < map.width; x += 1) {
        if (!occupied.has(key(x, y)) && !reserved.has(key(x, y))) free.push({ x, y });
    }
    const interactables = [];
    const count = Math.min(free.length, 3 + tier.rank + Math.floor(rng() * 3));
    for (let index = 0; index < count; index += 1) {
        const position = free.splice(Math.floor(rng() * free.length), 1)[0];
        const type = choose(biome.interactables.filter((item) => item !== "door"), rng);
        interactables.push({ type, x: position.x, y: position.y, blocking: ["crate", "barrel", "chest", "ore_node"].includes(type) });
    }
    interactables.push({ type: "door", x: map.width - 1, y: map.height - 1, blocking: true });
    return interactables;
}

function addEnemies(map, biome, tier, rng) {
    const occupied = new Set([...map.walls, ...map.water, ...map.props, ...map.interactables].map((item) => key(item.x, item.y)));
    const free = [];
    for (let y = 0; y < map.height; y += 1) for (let x = 0; x < map.width; x += 1) if (!occupied.has(key(x, y))) free.push({ x, y });
    const count = Math.min(free.length, Math.max(2, Math.round((3 + tier.rank * 2) * tier.enemyMultiplier)));
    return Array.from({ length: count }, () => {
        const position = free.splice(Math.floor(rng() * free.length), 1)[0];
        const family = choose(biome.enemyFamilies, rng);
        return { id: `${family}-${Math.floor(rng() * 100000)}`, family, x: position.x, y: position.y, level: tier.rank };
    });
}

function addResources(map, biome, tier, rng) {
    const occupied = new Set([...map.walls, ...map.water, ...map.props, ...map.interactables, ...map.enemies].map((item) => key(item.x, item.y)));
    const free = [];
    for (let y = 0; y < map.height; y += 1) for (let x = 0; x < map.width; x += 1) if (!occupied.has(key(x, y))) free.push({ x, y });
    const count = Math.min(free.length, 3 + tier.rank);
    return Array.from({ length: count }, () => {
        const position = free.splice(Math.floor(rng() * free.length), 1)[0];
        return { type: choose(biome.resources, rng), x: position.x, y: position.y, renewable: rng() < 0.35 };
    });
}

function addLoot(map, biome, tier, rng, firstRun) {
    const containers = map.interactables.filter((item) => ["crate", "barrel", "chest", "altar"].includes(item.type));
    return containers.map((container) => {
        const roll = rollLootTier(tier, rng, { firstRun });
        const category = weightedChoice(biome.lootBias, rng);
        return { x: container.x, y: container.y, source: container.type, exception: roll.exception, tierDifference: roll.difference, item: generateItem({ category, tier: roll.tier.id, level: tier.rank, rng }) };
    });
}

export function generateBossLoot({ mapTier = "common", firstRun = false, level = 1, seed } = {}) {
    const tier = resolveMapTier(mapTier);
    const rng = createRng(seed);
    const roll = rollLootTier(tier, rng, { boss: true, firstRun });
    return { source: "boss", firstRun, exception: roll.exception, item: generateItem({ category: weightedChoice({ weapon: 3, equipment: 3, tool: 1, consumable: 1 }, rng), tier: roll.tier.id, level, rng }) };
}

export function generateMap({ biome = "sewers", tier = "common", level = 1, width = WIDTH, height = HEIGHT, seed = Date.now(), firstRun = true } = {}) {
    const selectedBiome = resolveBiome(biome);
    const selectedTier = resolveMapTier(tier);
    const rng = createRng(seed);
    const path = buildPath(width, height, rng);
    const terrain = createTerrain(selectedBiome, width, height, path, rng);
    const map = { number: level, width, height, tileSize: 40, biome: selectedBiome.id, tier: selectedTier.id, tierRank: selectedTier.rank, seed, ...terrain, interactables: [], enemies: [], resources: [], loot: [], door: { x: width - 1, y: height - 1 }, lootRules: { mapTier: selectedTier.id, mapTierRank: selectedTier.rank, aboveTierBaseChance: selectedTier.aboveTierBaseChance, higherTierChanceFallsBy: 0.25, bossFirstRunException: true } };
    map.interactables = addInteractables(map, selectedBiome, selectedTier, rng);
    map.enemies = addEnemies(map, selectedBiome, selectedTier, rng);
    map.resources = addResources(map, selectedBiome, selectedTier, rng);
    map.loot = addLoot(map, selectedBiome, selectedTier, rng, firstRun);
    return map;
}

export function getMapBiome(biomeId) { return MAP_BIOMES[biomeId?.toUpperCase()] || null; }
export function getMapTier(tierId) { return MAP_TIER_LIST.find((tier) => tier.id === tierId) || null; }
