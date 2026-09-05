// Keyboard input and in-game menus.
import { createLevel, getBoxAt, getPropAt, isBlocked, isDoor, isInside, isWall, isWater, removeBox } from "./map.js";
import { CLASSES, getDirectionVector, initializePlayerStats, resetPlayerPosition } from "./player.js";
import { getText } from "./i18n.js";
import { playMenuCancel, playMenuConfirm, playMenuScroll } from "./ui-audio.js?v=menu-files1";
import { canLearnSkill, learnSkill } from "./skill-generator.js";

const t = (state, key) => getText(state.language, `gameplay.${key}`);
const m = (state, key) => getText(state.language, `gameplay.messages.${key}`);
const direction = (state, key) => getText(state.language, `gameplay.direction.${key}`);
const itemName = (state, name) => getText(state.language, `gameplay.item.${name}`);

const MAIN_MENU = ["status", "inventory", "equipment", "skills"];
const STATUS_MENU = ["class", "power", "coordination", "mind", "hp", "stamina", "mana", "gold"];

function skillsMenu(state) { return state.player.skills?.skills?.map((skill) => skill.id) || []; }
const EQUIPMENT_MENU = ["head", "neck", "ring1", "ring2", "torso", "body", "waist", "legs", "feet", "melee", "ranged", "shield"];
const equipmentByKey = { head: "cabeca", neck: "pescoco", ring1: "anel1", ring2: "anel2", torso: "tronco", body: "sobreCorpo", waist: "cintura", legs: "pernas", feet: "pes", melee: "armaMelee", ranged: "armaRanged", shield: "escudo" };

function statusDetail(state, player, option) {
    const { attributes, stats } = player;
    switch (option) {
        case "class": return `${t(state, "class")}: ${itemName(state, CLASSES[player.classeAtiva]?.nome || player.classeAtiva)}.`;
        case "power": return `${t(state, "power")}: ${attributes.potencia}.`;
        case "coordination": return `${t(state, "coordination")}: ${attributes.coordenacao}.`;
        case "mind": return `${t(state, "mind")}: ${attributes.mente}.`;
        case "hp": return `${t(state, "hp")}: ${stats.hpAtual} / ${stats.hpMax}.`;
        case "stamina": return `${t(state, "stamina")}: ${stats.estAtual} / ${stats.estMax}.`;
        case "mana": return `${t(state, "mana")}: ${stats.manaAtual} / ${stats.manaMax}.`;
        case "gold": return `${t(state, "gold")}: ${stats.ouro}.`;
        default: return option;
    }
}

function equipmentDetail(state, player, option) {
    const item = player.equipment[equipmentByKey[option]];
    const range = item && item.alcance !== undefined ? item.alcance : 1;
    const name = item ? `${itemName(state, item.nome)} (${t(state, "range")}: ${range})` : t(state, "empty");
    return `${t(state, option)}: ${name}.`;
}

function skillLabel(state, skill) { return getText(state.language, `skills.names.${skill.id}`); }

function skillDescription(state, skill) { return getText(state.language, `skills.descriptions.${skill.id}`); }

function skillDetail(state, skillId) {
    const skill = state.player.skills.skills.find((item) => item.id === skillId);
    if (!skill) return m(state, "skillUnavailable");
    const nextCost = skill.level >= skill.maxLevel ? "—" : skill.levelCosts[skill.level];
    const requirementParts = [];
    Object.entries(skill.requirements.attributes || {}).forEach(([attribute, value]) => requirementParts.push(`${t(state, attribute === "potencia" ? "power" : attribute === "coordenacao" ? "coordination" : "mind")}: ${value}`));
    (skill.requirements.skills || []).forEach((requirement) => requirementParts.push(`${skillLabel(state, state.player.skills.skills.find((item) => item.id === requirement.id) || { id: requirement.id })} ${t(state, "skillLevelShort")}: ${requirement.level}`));
    const result = canLearnSkill(state.player.skills, skill.id, state.player.attributes);
    const status = skill.level >= skill.maxLevel ? m(state, "skillMax") : result.allowed ? m(state, "skillReady") : result.reason === "skill_points" ? m(state, "skillNeedPoints") : result.reason === "requirements" ? m(state, "skillNeedRequirements") : "";
    return `${skillLabel(state, skill)}. ${m(state, "skillDescription")}: ${skillDescription(state, skill)} ${m(state, "skillLevel")}: ${skill.level}/${skill.maxLevel}. ${m(state, "skillCost")}: ${nextCost}. ${m(state, "skillPoints")}: ${state.player.skills.skillPoints}. ${m(state, "skillRequirements")}: ${requirementParts.join(", ") || m(state, "skillNone")}. ${status}`;
}

function frontPosition(state) {
    const vector = getDirectionVector(state.player.dir);
    return { x: state.player.x + vector.dx, y: state.player.y + vector.dy };
}

function move(state, directionName, announce, render) {
    const vector = getDirectionVector(directionName);
    const newX = state.player.x + vector.dx;
    const newY = state.player.y + vector.dy;
    if (!isInside(state.level, newX, newY)) { announce(m(state, "boundary")); return; }
    if (isBlocked(state.level, newX, newY)) {
        const reason = isDoor(state.level, newX, newY) ? m(state, "doorAhead") : getBoxAt(state.level, newX, newY) ? m(state, "boxAhead") : isWater(state.level, newX, newY) ? m(state, "waterAhead") : getPropAt(state.level, newX, newY) ? m(state, "objectAhead") : "";
        announce(`${m(state, "blocked")} ${direction(state, directionName)}.${reason}`); return;
    }
    state.player.x = newX; state.player.y = newY; announce(`${newX},${newY}`); render();
}

function scan(state, announce) {
    const vector = getDirectionVector(state.player.dir); const found = []; const checked = new Set();
    for (let distance = 1; distance <= 5; distance += 1) {
        const spread = Math.floor(distance / 2);
        for (let offset = -spread; offset <= spread; offset += 1) {
            const vertical = state.player.dir === "CIMA" || state.player.dir === "BAIXO";
            const x = vertical ? state.player.x + offset : state.player.x + vector.dx * distance;
            const y = vertical ? state.player.y + vector.dy * distance : state.player.y + offset;
            const key = `${x},${y}`;
            if (!isInside(state.level, x, y) || checked.has(key)) continue; checked.add(key);
            if (isWall(state.level, x, y)) found.push(`${m(state, "scanWall")} X ${x}, Y ${y}`);
            else if (isWater(state.level, x, y)) found.push(`${m(state, "scanWater")} X ${x}, Y ${y}`);
            else if (getBoxAt(state.level, x, y)) found.push(`${m(state, "scanBox")} X ${x}, Y ${y}`);
            else if (getPropAt(state.level, x, y)) found.push(`${m(state, "scanObject")} X ${x}, Y ${y}`);
            else if (isDoor(state.level, x, y)) found.push(`${m(state, "scanDoor")} X ${x}, Y ${y}`);
        }
    }
    announce(`${m(state, "scanDone")}: ${found.length ? found.join(", ") : m(state, "scanNone")}.`);
}

function attack(state, announce, render) {
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    if (!weapon) { announce(m(state, "noWeapon")); return; }
    const vector = getDirectionVector(state.player.dir); const range = weapon.alcance !== undefined ? weapon.alcance : 1;
    for (let distance = 1; distance <= range; distance += 1) {
        const x = state.player.x + vector.dx * distance; const y = state.player.y + vector.dy * distance;
        if (!isInside(state.level, x, y)) break;
        if (isWall(state.level, x, y)) { announce(`${m(state, "attackWall")} X ${x}, Y ${y}.`); return; }
        if (isDoor(state.level, x, y)) { announce(m(state, "attackDoor")); return; }
        const box = getBoxAt(state.level, x, y);
        if (box) { state.player.stats.ouro += box.ouro; removeBox(state.level, box); announce(`${t(state, "box")} X ${x}, Y ${y} ${m(state, "destroyed")} ${box.ouro} ${t(state, "gold")}. ${m(state, "total")}: ${state.player.stats.ouro}.`); render(); return; }
    }
    announce(`${m(state, "attackDone")} ${itemName(state, weapon.nome)}. ${m(state, "noTarget")}`);
}

function interact(state, announce, render) {
    const position = frontPosition(state);
    if (!isDoor(state.level, position.x, position.y)) { announce(m(state, "nothing")); return; }
    state.levelNumber += 1; state.level = createLevel(state.levelNumber); resetPlayerPosition(state.player); initializePlayerStats(state.player);
    announce(`${m(state, "doorOpened")} ${state.levelNumber}.`); render();
}

function toggleWeapon(state, announce) {
    state.player.instanciaAtiva = state.player.instanciaAtiva === "MELEE" ? "RANGED" : "MELEE";
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    announce(`${m(state, "activeWeapon")}: ${weapon ? itemName(state, weapon.nome) : m(state, "none")}.`);
}

function handleMenuKey(state, event, announce) {
    const { key } = event;
    const menu = state.gameState === "MENU_STATUS" ? STATUS_MENU : state.gameState === "MENU_EQUIPAMENTO" ? EQUIPMENT_MENU : state.gameState === "MENU_HABILIDADES" ? skillsMenu(state) : MAIN_MENU;
    if (key === "ArrowUp" || key === "ArrowDown") {
        playMenuScroll();
        const increment = key === "ArrowDown" ? 1 : -1;
        state.menuIndex = (state.menuIndex + increment + menu.length) % menu.length;
        const option = menu[state.menuIndex];
        announce(state.gameState === "MENU_STATUS" ? statusDetail(state, state.player, option) : state.gameState === "MENU_EQUIPAMENTO" ? equipmentDetail(state, state.player, option) : state.gameState === "MENU_HABILIDADES" ? skillDetail(state, option) : t(state, option));
        return true;
    }
    if (key === "Escape") {
        playMenuCancel();
        const previous = state.gameState;
        if (previous === "MENU_PRINCIPAL") { state.gameState = "NORMAL"; announce(`${state.player.x},${state.player.y}`); }
        else {
            state.gameState = "MENU_PRINCIPAL";
            state.menuIndex = previous === "MENU_STATUS" ? 0 : previous === "MENU_HABILIDADES" ? 3 : 2;
            announce(`${t(state, "mainMenu")}. ${m(state, "option")}: ${t(state, MAIN_MENU[state.menuIndex])}.`);
        }
        return true;
    }
    if (state.gameState === "MENU_PRINCIPAL" && key === "Enter") {
        playMenuConfirm();
        const option = MAIN_MENU[state.menuIndex];
        if (option === "status") { state.gameState = "MENU_STATUS"; state.menuIndex = 0; announce(`${m(state, "submenuStatus")} ${statusDetail(state, state.player, STATUS_MENU[0])}`); }
        else if (option === "inventory") announce(m(state, "inventoryEmpty"));
        else if (option === "equipment") { state.gameState = "MENU_EQUIPAMENTO"; state.menuIndex = 0; announce(`${m(state, "submenuEquipment")} ${equipmentDetail(state, state.player, EQUIPMENT_MENU[0])}`); }
        else { state.gameState = "MENU_HABILIDADES"; state.menuIndex = 0; const firstSkill = skillsMenu(state)[0]; announce(`${m(state, "submenuSkills")} ${skillDetail(state, firstSkill)}`); }
        return true;
    }
    if (state.gameState === "MENU_HABILIDADES" && key === "Enter") {
        const skillId = skillsMenu(state)[state.menuIndex];
        const result = learnSkill(state.player.skills, skillId, state.player.attributes);
        if (result.allowed) { playMenuConfirm(); announce(`${skillLabel(state, result.skill)}: ${m(state, "skillPurchased")} ${result.level}. ${skillDetail(state, skillId)}`); }
        else { playMenuCancel(); announce(`${skillDetail(state, skillId)} ${m(state, "skillCannotPurchase")}`); }
        return true;
    }
    return false;
}

export function installInput({ state, announce, render }) {
    function onKeyDown(event) {
        if (state.gameState.startsWith("FRONT_")) return;
        if (state.gameState !== "NORMAL") { if (handleMenuKey(state, event, announce)) event.preventDefault(); return; }
        const key = event.key; const lowerKey = key.toLowerCase(); const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key); const isGameKey = isArrow || ["a", "c", "enter", "s", "t", "w"].includes(lowerKey); if (isGameKey) event.preventDefault();
        if (lowerKey === "s") scan(state, announce);
        else if (lowerKey === "c") { state.gameState = "MENU_PRINCIPAL"; state.menuIndex = 0; announce(`${t(state, "mainMenu")}. ${m(state, "menuHint")}`); }
        else if (lowerKey === "t") announce(`${m(state, "looking")} ${direction(state, state.player.dir)}.`);
        else if (lowerKey === "w") toggleWeapon(state, announce);
        else if (lowerKey === "a") attack(state, announce, render);
        else if (key === "Enter") interact(state, announce, render);
        else if (isArrow) { const dir = { ArrowUp: "CIMA", ArrowDown: "BAIXO", ArrowLeft: "ESQUERDA", ArrowRight: "DIREITA" }[key]; if (event.shiftKey) { state.player.dir = dir; announce(`${m(state, "look")} ${direction(state, dir)}.`); render(); } else move(state, dir, announce, render); }
    }
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
}
