// Renderização vetorial do mapa e do personagem.
import { getDirectionVector } from "./player.js";
import { getText } from "./i18n.js";
import { appendCharacterAvatar } from "./character-art.js";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, name);
    Object.entries(attributes).forEach(([attribute, value]) => element.setAttribute(attribute, String(value)));
    return element;
}

function appendDefs(svgCanvas) {
    const defs = createSvgElement("defs");
    const floor = createSvgElement("linearGradient", { id: "zenitFloor", x1: "0", y1: "0", x2: "1", y2: "1" });
    floor.append(createSvgElement("stop", { offset: "0", "stop-color": "#18283b" }), createSvgElement("stop", { offset: "1", "stop-color": "#101827" }));
    const wall = createSvgElement("linearGradient", { id: "zenitWall", x1: "0", y1: "0", x2: "1", y2: "1" });
    wall.append(createSvgElement("stop", { offset: "0", "stop-color": "#536b86" }), createSvgElement("stop", { offset: "1", "stop-color": "#27364f" }));
    const water = createSvgElement("linearGradient", { id: "zenitWater", x1: "0", y1: "0", x2: "1", y2: "1" });
    water.append(createSvgElement("stop", { offset: "0", "stop-color": "#1b6074" }), createSvgElement("stop", { offset: "0.55", "stop-color": "#123d5b" }), createSvgElement("stop", { offset: "1", "stop-color": "#0b263f" }));
    const box = createSvgElement("linearGradient", { id: "zenitBox", x1: "0", y1: "0", x2: "1", y2: "1" });
    box.append(createSvgElement("stop", { offset: "0", "stop-color": "#c77a3f" }), createSvgElement("stop", { offset: "1", "stop-color": "#713d3d" }));
    const glow = createSvgElement("filter", { id: "zenitGlow", x: "-50%", y: "-50%", width: "200%", height: "200%" });
    glow.append(createSvgElement("feGaussianBlur", { stdDeviation: "2", result: "blur" }));
    const merge = createSvgElement("feMerge");
    merge.append(createSvgElement("feMergeNode", { in: "blur" }), createSvgElement("feMergeNode", { in: "SourceGraphic" }));
    glow.append(merge);
    defs.append(floor, wall, water, box, glow);
    svgCanvas.appendChild(defs);
}

function renderWater(svgCanvas, water, tileSize) {
    water.forEach((tile) => {
        const px = tile.x * tileSize;
        const py = tile.y * tileSize;
        svgCanvas.appendChild(createSvgElement("rect", { x: px + 1, y: py + 1, width: tileSize - 2, height: tileSize - 2, rx: 4, fill: "url(#zenitWater)", stroke: "#3f9eb0", "stroke-width": 1.2, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 7} ${py + 13} Q ${px + 15} ${py + 8} ${px + 25} ${py + 13} M ${px + 10} ${py + 27} Q ${px + 19} ${py + 22} ${px + 32} ${py + 27}`, fill: "none", stroke: "#76c8c9", "stroke-width": 1.2, opacity: 0.6, "aria-hidden": "true" }));
    });
}

function renderProp(svgCanvas, prop, tileSize) {
    const px = prop.x * tileSize;
    const py = prop.y * tileSize;
    if (prop.type === "grate") {
        svgCanvas.appendChild(createSvgElement("circle", { cx: px + 20, cy: py + 20, r: 13, fill: "#111a25", stroke: "#8997a0", "stroke-width": 2, "aria-hidden": "true" }));
        for (let i = -8; i <= 8; i += 8) svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 12 + i} ${py + 11} L ${px + 12 + i} ${py + 29}`, stroke: "#b0b9b9", "stroke-width": 2, opacity: 0.7, "aria-hidden": "true" }));
    } else if (prop.type === "lamp") {
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 20} ${py + 31} V ${py + 11} Q ${px + 20} ${py + 7} ${px + 25} ${py + 7}`, fill: "none", stroke: "#a88a61", "stroke-width": 3, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx: px + 28, cy: py + 9, r: 6, fill: "#f1c66e", stroke: "#fff0ac", "stroke-width": 1.5, filter: "url(#zenitGlow)", "aria-hidden": "true" }));
    } else if (prop.type === "barrel") {
        svgCanvas.appendChild(createSvgElement("rect", { x: px + 10, y: py + 6, width: 20, height: 29, rx: 7, fill: "#704434", stroke: "#c89b62", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 9} ${py + 13} H ${px + 31} M ${px + 9} ${py + 28} H ${px + 31}`, stroke: "#d3af70", "stroke-width": 2, "aria-hidden": "true" }));
    } else {
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 7} ${py + 30} L ${px + 12} ${py + 14} L ${px + 21} ${py + 23} L ${px + 28} ${py + 10} L ${px + 34} ${py + 31} Z`, fill: "#4b4d58", stroke: "#9b9aa0", "stroke-width": 1.5, "aria-hidden": "true" }));
    }
}

function renderEnemy(svgCanvas, enemy, tileSize) {
    const cx = enemy.x * tileSize + tileSize / 2;
    const cy = enemy.y * tileSize + tileSize / 2;
    const boss = enemy.isBoss;
    const colors = { rat: "#8d806f", slime: "#56b89b", cultist: "#805783" };
    const fill = colors[enemy.species] || "#a85d5d";
    if (boss) {
        svgCanvas.appendChild(createSvgElement("circle", { cx, cy, r: 16, fill: "#c08b39", stroke: "#ffe49a", "stroke-width": 2, filter: "url(#zenitGlow)", "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx, cy, r: 11, fill, stroke: "#20192a", "stroke-width": 1.5, "aria-hidden": "true" }));
    } else if (enemy.species === "slime") {
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${cx - 13} ${cy + 10} Q ${cx - 15} ${cy - 8} ${cx - 7} ${cy - 12} Q ${cx} ${cy - 17} ${cx + 8} ${cy - 10} Q ${cx + 16} ${cy - 5} ${cx + 12} ${cy + 10} Z`, fill, stroke: "#a7ead0", "stroke-width": 1.5, "aria-hidden": "true" }));
    } else if (enemy.species === "spider") {
        for (const direction of [-1, 1]) {
            svgCanvas.appendChild(createSvgElement("path", { d: `M ${cx + direction * 5} ${cy - 4} L ${cx + direction * 14} ${cy - 11} M ${cx + direction * 6} ${cy} L ${cx + direction * 16} ${cy} M ${cx + direction * 5} ${cy + 5} L ${cx + direction * 14} ${cy + 12}`, stroke: "#c9a2d2", "stroke-width": 2, "aria-hidden": "true" }));
        }
        svgCanvas.appendChild(createSvgElement("ellipse", { cx, cy, rx: 8, ry: 10, fill, stroke: "#e1b4e8", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx: cx - 3, cy: cy - 3, r: 1.5, fill: "#fff0a6", "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx: cx + 3, cy: cy - 3, r: 1.5, fill: "#fff0a6", "aria-hidden": "true" }));
    } else if (enemy.species === "cultist") {
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${cx - 12} ${cy + 12} L ${cx} ${cy - 14} L ${cx + 12} ${cy + 12} Z`, fill, stroke: "#d4a8dc", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx, cy: cy - 1, r: 5, fill: "#221b2c", "aria-hidden": "true" }));
    } else {
        svgCanvas.appendChild(createSvgElement("circle", { cx, cy, r: 11, fill, stroke: "#d4c3a4", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx: cx - 4, cy: cy - 2, r: 2, fill: "#201822", "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("circle", { cx: cx + 4, cy: cy - 2, r: 2, fill: "#201822", "aria-hidden": "true" }));
    }
}

export function renderGame({ svgCanvas, level, player, language = "pt-BR" }) {
    if (!svgCanvas) return;
    const { width, height, tileSize } = level;
    svgCanvas.replaceChildren();
    svgCanvas.setAttribute("viewBox", `0 0 ${width * tileSize} ${height * tileSize}`);
    svgCanvas.setAttribute("width", width * tileSize);
    svgCanvas.setAttribute("height", height * tileSize);
    svgCanvas.setAttribute("aria-label", `${getText(language, "gameplay.map")} ${getText(language, "gameplay.level")} ${level.number}. ${player.x},${player.y}.`);
    appendDefs(svgCanvas);

    for (let x = 0; x < width; x += 1) for (let y = 0; y < height; y += 1) {
        const px = x * tileSize;
        const py = y * tileSize;
        svgCanvas.appendChild(createSvgElement("rect", { x: px, y: py, width: tileSize, height: tileSize, rx: 3, fill: "url(#zenitFloor)", stroke: "#2a405a", "stroke-width": 1 }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 7} ${py + 30} l 4 -2 M ${px + 27} ${py + 10} l 3 -1`, stroke: "#36516b", "stroke-width": 1, opacity: 0.55, "aria-hidden": "true" }));
    }
    renderWater(svgCanvas, level.water || [], tileSize);
    level.walls.forEach((wall) => {
        const px = wall.x * tileSize + 2;
        const py = wall.y * tileSize + 2;
        svgCanvas.appendChild(createSvgElement("rect", { x: px, y: py, width: tileSize - 4, height: tileSize - 4, rx: 6, fill: "url(#zenitWall)", stroke: "#87a7c7", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 6} ${py + 12} H ${px + 30} M ${px + 10} ${py + 22} H ${px + 26}`, stroke: "#9bb6d2", opacity: 0.3, "aria-hidden": "true" }));
    });
    (level.props || []).forEach((prop) => renderProp(svgCanvas, prop, tileSize));
    level.boxes.forEach((box) => {
        const px = box.x * tileSize + 7;
        const py = box.y * tileSize + 7;
        svgCanvas.appendChild(createSvgElement("rect", { x: px, y: py, width: tileSize - 14, height: tileSize - 14, rx: 5, fill: "url(#zenitBox)", stroke: "#d9b37a", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 5} ${py + 5} L ${px + 23} ${py + 23} M ${px + 23} ${py + 5} L ${px + 5} ${py + 23}`, stroke: "#f1d39d", opacity: 0.55, "aria-hidden": "true" }));
    });
    (level.enemies || []).forEach((enemy) => renderEnemy(svgCanvas, enemy, tileSize));
    const doorX = level.door.x * tileSize + 5;
    const doorY = level.door.y * tileSize + 5;
    svgCanvas.appendChild(createSvgElement("rect", { x: doorX, y: doorY, width: tileSize - 10, height: tileSize - 10, rx: 7, fill: "#b94b91", stroke: "#f6b4ed", "stroke-width": 2, filter: "url(#zenitGlow)", "aria-hidden": "true" }));
    svgCanvas.appendChild(createSvgElement("circle", { cx: doorX + 15, cy: doorY + 15, r: 3, fill: "#fff0ff", "aria-hidden": "true" }));

    const playerX = player.x * tileSize + tileSize / 2;
    const playerY = player.y * tileSize + tileSize / 2;
    const character = player.character || { gender: "feminine", classKey: "vanguard", presetKey: "vanguard-f-1" };
    appendCharacterAvatar(svgCanvas, { x: playerX, y: playerY, size: 34, ...character });
    const direction = getDirectionVector(player.dir);
    svgCanvas.appendChild(createSvgElement("circle", { cx: playerX + direction.dx * 14, cy: playerY + direction.dy * 14, r: 2.5, fill: "#ffffff", stroke: "#142033", "stroke-width": 1, "aria-hidden": "true" }));
}
