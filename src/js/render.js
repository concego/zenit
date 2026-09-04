// Renderização do mapa em SVG.

import { getDirectionVector } from "./player.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, name);
    Object.entries(attributes).forEach(([attribute, value]) => {
        element.setAttribute(attribute, String(value));
    });
    return element;
}

export function renderGame({ svgCanvas, level, player }) {
    if (!svgCanvas) return;

    const { width, height, tileSize } = level;
    svgCanvas.replaceChildren();
    svgCanvas.setAttribute("viewBox", `0 0 ${width * tileSize} ${height * tileSize}`);
    svgCanvas.setAttribute("width", width * tileSize);
    svgCanvas.setAttribute("height", height * tileSize);
    svgCanvas.setAttribute("aria-label", `Mapa do nível ${level.number}. ${player.x},${player.y}.`);

    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            svgCanvas.appendChild(createSvgElement("rect", {
                x: x * tileSize, y: y * tileSize, width: tileSize, height: tileSize,
                fill: "#1e1e1e", stroke: "#2a2a2a"
            }));
        }
    }

    level.walls.forEach((wall) => {
        svgCanvas.appendChild(createSvgElement("rect", {
            x: wall.x * tileSize + 2, y: wall.y * tileSize + 2,
            width: tileSize - 4, height: tileSize - 4,
            fill: "#7f8c8d", "aria-hidden": "true"
        }));
    });

    level.boxes.forEach((box) => {
        svgCanvas.appendChild(createSvgElement("rect", {
            x: box.x * tileSize + 8, y: box.y * tileSize + 8,
            width: tileSize - 16, height: tileSize - 16,
            fill: "#d35400", "aria-hidden": "true"
        }));
    });

    svgCanvas.appendChild(createSvgElement("rect", {
        x: level.door.x * tileSize + 5, y: level.door.y * tileSize + 5,
        width: tileSize - 10, height: tileSize - 10,
        fill: "#e67e22", "aria-hidden": "true"
    }));

    const playerX = player.x * tileSize + tileSize / 2;
    const playerY = player.y * tileSize + tileSize / 2;
    svgCanvas.appendChild(createSvgElement("path", {
        d: `M ${playerX - 12} ${playerY + 12} Q ${playerX} ${playerY - 18} ${playerX + 12} ${playerY + 12} Z`,
        fill: "#3498db", "aria-hidden": "true"
    }));

    const direction = getDirectionVector(player.dir);
    svgCanvas.appendChild(createSvgElement("circle", {
        cx: playerX + direction.dx * 10, cy: playerY + direction.dy * 10,
        r: 4, fill: "#ffffff", "aria-hidden": "true"
    }));
}
