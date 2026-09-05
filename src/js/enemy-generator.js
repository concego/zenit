// Gerador de inimigos por bioma, espécie e tier.
import { createRng } from "./item-generator.js";
import { generateItem } from "./item-generator.js";
import { ENEMY_SPECIES, ENEMY_SPECIES_LIST } from "./enemy-data.js";
import { MAP_BIOMES, MAP_BIOME_LIST, MAP_TIERS, MAP_TIER_LIST } from "./map-data.js";

function resolveBiome(biome) {
    if (biome && typeof biome === "object" && biome.id) return biome;
    if (typeof biome === "string") return MAP_BIOME_LIST.find((candidate) => candidate.id === biome) || null;
    return MAP_BIOMES.SEWERS;
}

function resolveTier(tier) {
    if (tier && typeof tier === "object" && tier.id) return tier;
    if (typeof tier === "string") return MAP_TIER_LIST.find((candidate) => candidate.id === tier) || null;
    return MAP_TIERS.COMMON;
}

function resolveSpecies(species, biome, rng) {
    if (species && typeof species === "object" && species.id) return species;
    if (typeof species === "string" && ENEMY_SPECIES[species]) return ENEMY_SPECIES[species];
    const available = biome.enemyFamilies.map((id) => ENEMY_SPECIES[id]).filter(Boolean);
    return available[Math.min(available.length - 1, Math.floor(rng() * available.length))] || ENEMY_SPECIES_LIST[0];
}

function scaled(value, multiplier) { return Math.max(1, Math.round(value * multiplier)); }

export function generateEnemy({ biome = "sewers", tier = "common", species, level = 1, seed, rng, isBoss = false } = {}) {
    const random = typeof rng === "function" ? rng : createRng(seed);
    const selectedBiome = resolveBiome(biome) || MAP_BIOMES.SEWERS;
    const selectedTier = resolveTier(tier) || MAP_TIERS.COMMON;
    const selectedSpecies = resolveSpecies(species, selectedBiome, random);
    const normalMultiplier = 1 + (selectedTier.rank - 1) * 0.45;
    const multiplier = isBoss ? normalMultiplier * (2.8 + selectedTier.rank * 0.3) : normalMultiplier;
    const stats = {
        hp: scaled(selectedSpecies.baseStats.hp, multiplier),
        damage: scaled(selectedSpecies.baseStats.damage, multiplier),
        defense: scaled(selectedSpecies.baseStats.defense, multiplier),
        speed: Math.max(1, Math.round(selectedSpecies.baseStats.speed * (isBoss ? 1.15 : 1))),
        coordination: 8 + selectedSpecies.baseStats.speed
    };
    stats.maxHp = stats.hp;
    stats.hpAtual = stats.hp;
    const instanceId = `${selectedSpecies.id}:${selectedTier.id}:${isBoss ? "boss" : "normal"}:${Math.floor(random() * 1000000000)}`;
    return {
        instanceId,
        id: instanceId,
        species: selectedSpecies.id,
        type: selectedSpecies.type,
        nameKey: isBoss ? selectedSpecies.bossNameKey : selectedSpecies.nameKey,
        biome: selectedBiome.id,
        tier: selectedTier.id,
        tierRank: selectedTier.rank,
        level,
        isBoss,
        behavior: selectedSpecies.behavior,
        stats,
        lootProfile: {
            materials: selectedSpecies.materials.map((material) => material.id),
            itemCategories: [...(selectedSpecies.itemCategories || [])]
        }
    };
}

export function generateBossEnemy({ biome = "sewers", tier = "common", species, level = 1, seed, rng } = {}) {
    return generateEnemy({ biome, tier, species, level, seed, rng, isBoss: true });
}

export function generateEnemyLoot(enemy, { firstRun = false, seed, rng } = {}) {
    const random = typeof rng === "function" ? rng : createRng(seed);
    const species = ENEMY_SPECIES[enemy.species];
    if (!species) return { materials: [], items: [] };
    const rank = enemy.tierRank || 1;
    const bossMultiplier = enemy.isBoss ? (firstRun ? 2 : 1.5) : 1;
    const materials = species.materials.flatMap((material) => {
        const chance = Math.min(1, material.chance * (enemy.isBoss ? 1.2 : 1));
        if (random() > chance) return [];
        const baseQuantity = material.min + Math.floor(random() * (material.max - material.min + 1));
        return [{ materialId: material.id, nameKey: material.nameKey, quantity: Math.max(1, Math.round(baseQuantity * bossMultiplier + (enemy.isBoss ? rank - 1 : 0))), tier: enemy.tier }];
    });
    const items = [];
    if (species.itemCategories?.length) {
        const itemChance = enemy.isBoss ? (firstRun ? 0.8 : 0.35) : 0.12;
        if (random() < itemChance) {
            const category = species.itemCategories[Math.floor(random() * species.itemCategories.length)];
            items.push(generateItem({ category, tier: enemy.tier, level: enemy.level, rng: random }));
        }
    }
    return { materials, items };
}

export function getEnemySpecies(speciesId) { return ENEMY_SPECIES[speciesId] || null; }
