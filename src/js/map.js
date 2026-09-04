// Mapa e elementos do mundo.

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 11;
export const TILE_SIZE = 40;

const BASE_WALLS = Object.freeze([
    { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
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

export function createLevel(number = 1) {
    const levelNumber = Math.max(1, Number(number) || 1);

    return {
        number: levelNumber,
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        tileSize: TILE_SIZE,
        walls: BASE_WALLS.map((wall) => ({ ...wall })),
        door: { x: 9, y: 10 },
        boxes: BASE_BOXES.map((box) => ({ ...box, ouro: box.ouro * levelNumber }))
    };
}

export function isInside(level, x, y) {
    return x >= 0 && x < level.width && y >= 0 && y < level.height;
}

export function isWall(level, x, y) {
    return level.walls.some((wall) => wall.x === x && wall.y === y);
}

export function getBoxAt(level, x, y) {
    return level.boxes.find((box) => box.x === x && box.y === y);
}

export function isDoor(level, x, y) {
    return level.door.x === x && level.door.y === y;
}

export function isBlocked(level, x, y) {
    return isWall(level, x, y) || Boolean(getBoxAt(level, x, y)) || isDoor(level, x, y);
}

export function removeBox(level, box) {
    level.boxes = level.boxes.filter((currentBox) => currentBox !== box);
}
