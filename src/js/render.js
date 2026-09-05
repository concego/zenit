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
    const box = createSvgElement("linearGradient", { id: "zenitBox", x1: "0", y1: "0", x2: "1", y2: "1" });
    box.append(createSvgElement("stop", { offset: "0", "stop-color": "#f0a24b" }), createSvgElement("stop", { offset: "1", "stop-color": "#a74255" }));
    const glow = createSvgElement("filter", { id: "zenitGlow", x: "-50%", y: "-50%", width: "200%", height: "200%" });
    glow.append(createSvgElement("feGaussianBlur", { stdDeviation: "2", result: "blur" }));
    const merge = createSvgElement("feMerge");
    merge.append(createSvgElement("feMergeNode", { in: "blur" }), createSvgElement("feMergeNode", { in: "SourceGraphic" }));
    glow.append(merge);
    defs.append(floor, wall, box, glow);
    svgCanvas.appendChild(defs);
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
    level.walls.forEach((wall) => {
        const px = wall.x * tileSize + 2;
        const py = wall.y * tileSize + 2;
        svgCanvas.appendChild(createSvgElement("rect", { x: px, y: py, width: tileSize - 4, height: tileSize - 4, rx: 6, fill: "url(#zenitWall)", stroke: "#87a7c7", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 6} ${py + 12} H ${px + 30} M ${px + 10} ${py + 22} H ${px + 26}`, stroke: "#9bb6d2", opacity: 0.3, "aria-hidden": "true" }));
    });
    level.boxes.forEach((box) => {
        const px = box.x * tileSize + 7;
        const py = box.y * tileSize + 7;
        svgCanvas.appendChild(createSvgElement("rect", { x: px, y: py, width: tileSize - 14, height: tileSize - 14, rx: 5, fill: "url(#zenitBox)", stroke: "#ffd18a", "stroke-width": 1.5, "aria-hidden": "true" }));
        svgCanvas.appendChild(createSvgElement("path", { d: `M ${px + 5} ${py + 5} L ${px + 23} ${py + 23} M ${px + 23} ${py + 5} L ${px + 5} ${py + 23}`, stroke: "#ffe4ac", opacity: 0.55, "aria-hidden": "true" }));
    });
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
