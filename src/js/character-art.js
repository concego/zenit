// Ilustração vetorial estilizada dos personagens. Tudo é SVG: leve, escalável e nítido.

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function svg(name, attributes = {}) {
    const element = document.createElementNS(SVG_NAMESPACE, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
}

const PALETTES = {
    vanguard: { primary: "#e05d5d", secondary: "#f2b84b", dark: "#421f39", light: "#ffd7a0", glow: "#ff806e" },
    hunter: { primary: "#39b982", secondary: "#b6e35d", dark: "#123b45", light: "#d7f5c3", glow: "#5de0bd" },
    mystic: { primary: "#9874f2", secondary: "#63d6e8", dark: "#241b54", light: "#e5d8ff", glow: "#c18cff" }
};

const VARIANTS = {
    "1": { skin: "#a9674d", hair: "#241a28", hairAccent: "#d58a54" },
    "2": { skin: "#d28a62", hair: "#6d342b", hairAccent: "#f0b45c" },
    "3": { skin: "#704737", hair: "#151c31", hairAccent: "#6cb2d8" }
};

export function appendCharacterAvatar(parent, { x, y, size, gender = "feminine", classKey = "vanguard", presetKey = "vanguard-f-1" }) {
    const palette = PALETTES[classKey] || PALETTES.vanguard;
    const variant = VARIANTS[String(presetKey).split("-").at(-1)] || VARIANTS["1"];
    const scale = size / 100;
    const group = svg("g", { transform: `translate(${x - size / 2} ${y - size / 2}) scale(${scale})`, "aria-hidden": "true" });
    const shadow = svg("ellipse", { cx: 50, cy: 91, rx: 29, ry: 6, fill: "#000", opacity: 0.28 });
    const aura = svg("circle", { cx: 50, cy: 46, r: 43, fill: palette.glow, opacity: 0.13 });
    group.append(aura, shadow);

    if (classKey === "hunter") {
        group.append(svg("path", { d: "M18 83 Q22 42 50 39 Q78 42 82 83 Z", fill: palette.dark, stroke: palette.secondary, "stroke-width": 2 }));
        group.append(svg("path", { d: "M17 45 Q50 17 83 45 L78 53 Q50 38 22 53 Z", fill: palette.primary, stroke: palette.light, "stroke-width": 2 }));
    } else if (classKey === "mystic") {
        group.append(svg("path", { d: "M16 86 Q22 39 50 38 Q78 39 84 86 Z", fill: palette.dark, stroke: palette.secondary, "stroke-width": 2 }));
        group.append(svg("path", { d: "M24 48 Q50 8 76 48 L67 45 Q50 27 33 45 Z", fill: palette.primary, stroke: palette.light, "stroke-width": 2 }));
        group.append(svg("circle", { cx: 50, cy: 23, r: 4, fill: palette.secondary }));
    } else {
        group.append(svg("path", { d: "M18 84 Q21 47 50 42 Q79 47 82 84 Z", fill: palette.primary, stroke: palette.secondary, "stroke-width": 2 }));
        group.append(svg("path", { d: "M20 55 L26 32 Q50 20 74 32 L80 55 L68 48 L50 54 L32 48 Z", fill: palette.dark, stroke: palette.light, "stroke-width": 2 }));
    }

    group.append(svg("path", { d: "M29 76 Q50 68 71 76 L67 89 Q50 96 33 89 Z", fill: palette.secondary, opacity: 0.85 }));
    group.append(svg("rect", { x: 31, y: 36, width: 38, height: 34, rx: 15, fill: variant.skin, stroke: "#291927", "stroke-width": 2 }));
    group.append(svg("path", { d: gender === "masculine" ? "M31 42 Q50 26 69 42 L66 31 Q50 18 34 31 Z" : "M28 43 Q50 21 72 43 L69 28 Q50 12 31 28 Z", fill: variant.hair, stroke: "#291927", "stroke-width": 2 }));
    group.append(svg("path", { d: "M34 34 Q50 25 66 34", fill: "none", stroke: variant.hairAccent, "stroke-width": 3, opacity: 0.8 }));
    group.append(svg("circle", { cx: 42, cy: 51, r: 2.5, fill: "#1c1730" }), svg("circle", { cx: 58, cy: 51, r: 2.5, fill: "#1c1730" }));
    group.append(svg("path", { d: "M43 60 Q50 64 57 60", fill: "none", stroke: "#6d3838", "stroke-width": 2, "stroke-linecap": "round" }));

    if (classKey === "hunter") {
        group.append(svg("path", { d: "M76 37 Q92 50 76 78", fill: "none", stroke: palette.secondary, "stroke-width": 3 }));
        group.append(svg("path", { d: "M76 37 L76 78", fill: "none", stroke: palette.light, "stroke-width": 2 }));
    } else if (classKey === "mystic") {
        group.append(svg("path", { d: "M84 33 L84 84", stroke: palette.secondary, "stroke-width": 3 }));
        group.append(svg("circle", { cx: 84, cy: 29, r: 6, fill: palette.glow, stroke: palette.light, "stroke-width": 2 }));
    } else {
        group.append(svg("path", { d: "M77 42 L91 75 L82 78 L69 50 Z", fill: palette.secondary, stroke: palette.light, "stroke-width": 2 }));
    }
    parent.appendChild(group);
    return group;
}
