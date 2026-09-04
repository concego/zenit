// Módulo do Mapa e Elementos do Mundo
const gridWidth = 10;
const gridHeight = 11;
const tileSize = 40;

const walls = [
    { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
    { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
    { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 },
    { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, 
    { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }
];

let door = { x: 9, y: 10 };

let boxes = [
    { x: 1, y: 2, ouro: 15 },
    { x: 4, y: 4, ouro: 30 },
    { x: 8, y: 8, ouro: 50 }
];

function isWall(x, y) {
    return walls.some(w => w.x === x && w.y === y);
}

function getBoxAt(x, y) {
    return boxes.find(b => b.x === x && b.y === y);
}

function isDoor(x, y) {
    return door.x === x && door.y === y;
}

function isBlocked(x, y) {
    return isWall(x, y) || getBoxAt(x, y) !== undefined || isDoor(x, y);
}