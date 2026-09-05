// Geradores determinísticos e extensíveis de itens do Zenit.
import {
    AFFIXES,
    CONSUMABLE_TEMPLATES,
    EQUIPMENT_TEMPLATES,
    ITEM_CATEGORIES,
    ITEM_TIERS,
    TOOL_TEMPLATES,
    WEAPON_TEMPLATES
} from "./item-data.js";

const TIER_LIST = Object.freeze(Object.values(ITEM_TIERS));
const CATEGORY_LIST = Object.freeze(Object.values(ITEM_CATEGORIES));

export function createRng(seed = Date.now()) {
    let state = (Number(seed) >>> 0) || 1;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

function resolveRng(rng, seed) {
    return typeof rng === "function" ? rng : createRng(seed);
}

function choose(list, rng) {
    return list[Math.min(list.length - 1, Math.floor(rng() * list.length))];
}

function resolveTier(tier, rng) {
    if (tier && typeof tier === "object" && tier.id) return tier;
    if (typeof tier === "string") return TIER_LIST.find((candidate) => candidate.id === tier) || null;
    const total = TIER_LIST.reduce((sum, candidate) => sum + candidate.weight, 0);
    let roll = rng() * total;
    return TIER_LIST.find((candidate) => { roll -= candidate.weight; return roll < 0; }) || TIER_LIST[0];
}

function scaled(value, tier, level) {
    return Math.max(1, Math.round(value * tier.multiplier * (1 + Math.max(0, level - 1) * 0.08)));
}

function buildAffixes(tier, rng) {
    const pool = [...AFFIXES];
    const affixes = [];
    for (let index = 0; index < tier.affixSlots && pool.length; index += 1) {
        const selectedIndex = Math.floor(rng() * pool.length);
        const [affix] = pool.splice(selectedIndex, 1);
        affixes.push({ id: affix.id, nameKey: affix.nameKey, stat: affix.stat, value: scaled(affix.baseValue, tier, 1) });
    }
    return affixes;
}

function baseItem(template, category, tier, level, rng) {
    return {
        instanceId: `${category}:${template.id}:${tier.id}:${Math.floor(rng() * 1000000000)}`,
        category,
        templateId: template.id,
        nameKey: template.nameKey,
        tier: { id: tier.id, rank: tier.rank, labelKey: tier.labelKey, multiplier: tier.multiplier },
        level,
        affixes: buildAffixes(tier, rng)
    };
}

function applyAffixes(item) {
    item.affixes.forEach((affix) => {
        if (affix.stat === "armor") item.armor = (item.armor || 0) + affix.value;
        else if (affix.stat === "damage") item.damage = (item.damage || 0) + affix.value;
        else if (affix.stat === "durability") item.durability = (item.durability || 0) + affix.value;
        else {
            item.attributeBonuses = item.attributeBonuses || {};
            item.attributeBonuses[affix.stat] = (item.attributeBonuses[affix.stat] || 0) + affix.value;
        }
    });
    return item;
}

export function generateConsumable({ tier, level = 1, rng, seed } = {}) {
    const random = resolveRng(rng, seed);
    const quality = resolveTier(tier, random);
    const template = choose(CONSUMABLE_TEMPLATES, random);
    const item = baseItem(template, ITEM_CATEGORIES.CONSUMABLE, quality, level, random);
    item.stackable = true;
    item.maxStack = template.maxStack;
    item.quantity = 1;
    item.effect = template.effect;
    item.power = scaled(template.basePower, quality, level);
    return applyAffixes(item);
}

export function generateEquipment({ tier, level = 1, rng, seed } = {}) {
    const random = resolveRng(rng, seed);
    const quality = resolveTier(tier, random);
    const template = choose(EQUIPMENT_TEMPLATES, random);
    const item = baseItem(template, ITEM_CATEGORIES.EQUIPMENT, quality, level, random);
    item.slot = template.slot;
    item.armor = scaled(template.baseArmor, quality, level);
    item.attributeBonuses = { [template.baseAttribute]: Math.max(1, Math.round(quality.multiplier)) };
    return applyAffixes(item);
}

export function generateWeapon({ tier, level = 1, rng, seed } = {}) {
    const random = resolveRng(rng, seed);
    const quality = resolveTier(tier, random);
    const template = choose(WEAPON_TEMPLATES, random);
    const item = baseItem(template, ITEM_CATEGORIES.WEAPON, quality, level, random);
    item.kind = template.kind;
    item.slot = template.slot;
    item.damage = scaled(template.baseDamage, quality, level);
    item.range = template.baseRange;
    item.attribute = template.attribute;
    item.durability = scaled(12, quality, level);
    return applyAffixes(item);
}

export function generateTool({ tier, level = 1, rng, seed } = {}) {
    const random = resolveRng(rng, seed);
    const quality = resolveTier(tier, random);
    const template = choose(TOOL_TEMPLATES, random);
    const item = baseItem(template, ITEM_CATEGORIES.TOOL, quality, level, random);
    item.toolKind = template.toolKind;
    item.durability = scaled(template.baseDurability, quality, level);
    item.recipes = [...template.recipes];
    item.crafting = { required: true, toolKind: template.toolKind };
    return applyAffixes(item);
}

export function generateItem({ category, tier, level = 1, rng, seed } = {}) {
    const random = resolveRng(rng, seed);
    if (category === ITEM_CATEGORIES.CONSUMABLE) return generateConsumable({ tier, level, rng: random });
    if (category === ITEM_CATEGORIES.EQUIPMENT) return generateEquipment({ tier, level, rng: random });
    if (category === ITEM_CATEGORIES.WEAPON) return generateWeapon({ tier, level, rng: random });
    if (category === ITEM_CATEGORIES.TOOL) return generateTool({ tier, level, rng: random });
    throw new Error(`Unknown item category: ${category}`);
}

export function generateLoot({ count = 1, categories = CATEGORY_LIST, tier, level = 1, seed } = {}) {
    const rng = createRng(seed);
    return Array.from({ length: Math.max(0, count) }, () => generateItem({ category: choose(categories, rng), tier, level, rng }));
}

export function getItemTier(tierId) {
    return TIER_LIST.find((tier) => tier.id === tierId) || null;
}
