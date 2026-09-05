// Mapa e elementos do mundo.
import { createRng } from "./item-generator.js";
import { generateBossEnemy, generateEnemy, generateEnemyLoot } from "./enemy-generator.js";

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 11;
export const TILE_SIZE = 40;

const BASE_WALLS = Object.freeze([
    { x: 2, y: 0 }, { x: 2, y: 1 },
    { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
    { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 },
    { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 },
    { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }
]);

const BASE_BOXES = Object.freeze([
    { x: 1, y: 2, ouro: 15 },
    { x: 4, y: 4, ouro: 30 },
    { x: 8, y: 8, ouro: 50 }
]);

const SEWER_WALLS = Object.freeze([
    { x: 2, y: 0 }, { x: 2, y: 1 },
    { x: 7, y: 1 }, { x: 8, y: 1 },
    { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
    { x: 7, y: 4 }, { x: 8, y: 4 },
    { x: 1, y: 7 }, { x: 2, y: 7 },
    { x: 7, y: 7 }, { x: 8, y: 7 },
    { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }
]);

const SEWER_WATER = Object.freeze([
    { x: 4, y: 2 }, { x: 5, y: 2 },
    { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 4, y: 4 }, { x: 5, y: 4 },
    { x: 4, y: 5 }, { x: 5, y: 5 },
    { x: 4, y: 6 }, { x: 5, y: 6 },
    { x: 4, y: 7 }, { x: 5, y: 7 },
    { x: 4, y: 8 }, { x: 5, y: 8 }
]);

const SEWER_BOXES = Object.freeze([
    { x: 1, y: 2, ouro: 15 },
    { x: 3, y: 1, ouro: 20 },
    { x: 7, y: 2, ouro: 25 },
    { x: 8, y: 6, ouro: 30 },
    { x: 2, y: 8, ouro: 40 },
    { x: 7, y: 9, ouro: 50 }
]);

const SEWER_PROPS = Object.freeze([
    { type: "grate", x: 0, y: 6, blocking: false },
    { type: "grate", x: 9, y: 3, blocking: false },
    { type: "lamp", x: 1, y: 9, blocking: false },
    { type: "debris", x: 6, y: 6, blocking: true },
    { type: "debris", x: 8, y: 3, blocking: true },
    { type: "barrel", x: 9, y: 7, blocking: true }
]);

function copyItems(items, levelNumber = 1) {
    return items.map((item) => ({ ...item, ...(item.ouro === undefined ? {} : { ouro: item.ouro * levelNumber }) }));
}

function createSewerEnemies() {
    const rng = createRng(1001);
    const placements = [
        { species: "rat", x: 1, y: 3 },
        { species: "slime", x: 3, y: 3 },
        { species: "cultist", x: 6, y: 2 },
        { species: "rat", x: 8, y: 2 },
        { species: "slime", x: 7, y: 5 },
        { species: "cultist", x: 1, y: 6 },
        { species: "rat", x: 8, y: 8 }
    ];
    const enemies = placements.map((placement) => ({ ...generateEnemy({ biome: "sewers", tier: "common", species: placement.species, level: 1, rng }), x: placement.x, y: placement.y }));
    const boss = generateBossEnemy({ biome: "sewers", tier: "common", species: "slime", level: 1, rng });
    enemies.push({ ...boss, x: 8, y: 10 });
    return { enemies, enemyLoot: enemies.map((enemy) => ({ enemyId: enemy.instanceId, ...generateEnemyLoot(enemy, { firstRun: true, rng }) })) };
}

export function createLevel(number = 1) {
    const levelNumber = Math.max(1, Number(number) || 1);
    const isSewer = levelNumber === 1;
    const enemyData = isSewer ? createSewerEnemies() : { enemies: [], enemyLoot: [] };
    return {
        number: levelNumber,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        tileSize: TILE_SIZE,
        tier: "common",
        tierRank: 1,
        lootRules: { mapTier: "common", mapTierRank: 1, aboveTierBaseChance: 0.03, higherTierChanceFallsBy: 0.25, bossFirstRunException: true },
        walls: copyItems(isSewer ? SEWER_WALLS : BASE_WALLS),
        water: copyItems(isSewer ? SEWER_WATER : []),
        props: copyItems(isSewer ? SEWER_PROPS : []),
        door: { x: 9, y: 10 },
        boxes: copyItems(isSewer ? SEWER_BOXES : BASE_BOXES, levelNumber).map((box) => ({ ...box, tier: "common" })),
        enemies: enemyData.enemies,
        enemyLoot: enemyData.enemyLoot
    };
}

export function isInside(level, x, y) {
    return x >= 0 && x < level.width && y >= 0 && y < level.height;
}

export function isWall(level, x, y) {
    return level.walls.some((wall) => wall.x === x && wall.y === y);
}

export function isWater(level, x, y) {
    return level.water?.some((water) => water.x === x && water.y === y) || false;
}

export function getBoxAt(level, x, y) {
    return level.boxes.find((box) => box.x === x && box.y === y);
}

export function getEnemyAt(level, x, y) {
    return level.enemies?.find((enemy) => enemy.x === x && enemy.y === y) || null;
}

export function getPropAt(level, x, y) {
    return level.props?.find((prop) => prop.x === x && prop.y === y) || null;
}

export function isDoor(level, x, y) {
    return level.door.x === x && level.door.y === y;
}

export function isBlocked(level, x, y) {
    const prop = getPropAt(level, x, y);
    return isWall(level, x, y) || isWater(level, x, y) || Boolean(getBoxAt(level, x, y)) || Boolean(getEnemyAt(level, x, y)) || Boolean(prop?.blocking) || isDoor(level, x, y);
}

export function removeBox(level, box) {
    level.boxes = level.boxes.filter((currentBox) => currentBox !== box);
}

export function removeEnemy(level, enemy) {
    level.enemies = (level.enemies || []).filter((currentEnemy) => currentEnemy !== enemy);
}
