// Entrada de teclado e menus hierárquicos.

import { createLevel, getBoxAt, isBlocked, isDoor, isInside, isWall, removeBox } from "./map.js";
import { CLASSES, getDirectionVector, initializePlayerStats, resetPlayerPosition } from "./player.js";

const MAIN_MENU = ["Status", "Inventário", "Equipamento"];
const STATUS_MENU = ["Classe", "Potência", "Coordenação", "Mente", "HP", "Estamina", "Mana", "Ouro"];
const EQUIPMENT_MENU = ["Cabeça", "Pescoço", "Anel 1", "Anel 2", "Tronco", "Sobre o Corpo", "Cintura", "Pernas", "Pés", "Arma Corpo a Corpo", "Arma à Distância", "Escudo"];

function statusDetail(player, option) {
    const { attributes, stats } = player;
    const classKey = player.classeAtiva;
    switch (option) {
        case "Classe": {
            const className = CLASSES[classKey] ? CLASSES[classKey].nome : classKey;
            return `Classe: ${className}.`;
        }
        case "Potência": return `Potência: ${attributes.potencia}. Influencia HP, dano físico, estamina e carga.`;
        case "Coordenação": return `Coordenação: ${attributes.coordenacao}. Influencia esquiva, dano à distância e furtividade.`;
        case "Mente": return `Mente: ${attributes.mente}. Influencia mana, magias e leitura de tomos.`;
        case "HP": return `HP: ${stats.hpAtual} de ${stats.hpMax}.`;
        case "Estamina": return `Estamina: ${stats.estAtual} de ${stats.estMax}.`;
        case "Mana": return `Mana: ${stats.manaAtual} de ${stats.manaMax}.`;
        case "Ouro": return `Ouro: ${stats.ouro} moedas.`;
        default: return option;
    }
}

function equipmentDetail(player, option) {
    const equipment = player.equipment;
    const equipmentByMenu = {
        "Cabeça": equipment.cabeca, "Pescoço": equipment.pescoco, "Anel 1": equipment.anel1, "Anel 2": equipment.anel2,
        "Tronco": equipment.tronco, "Sobre o Corpo": equipment.sobreCorpo, "Cintura": equipment.cintura,
        "Pernas": equipment.pernas, "Pés": equipment.pes, "Arma Corpo a Corpo": equipment.armaMelee,
        "Arma à Distância": equipment.armaRanged, "Escudo": equipment.escudo
    };
    const item = equipmentByMenu[option];
    const itemRange = item && item.alcance !== undefined ? item.alcance : 1;
    const itemName = item ? `${item.nome} (alcance: ${itemRange})` : "Vazio";
    return `${option}: ${itemName}.`;
}

function frontPosition(state) {
    const direction = getDirectionVector(state.player.dir);
    return { x: state.player.x + direction.dx, y: state.player.y + direction.dy };
}

function move(state, directionName, announce, render) {
    const direction = getDirectionVector(directionName);
    const newX = state.player.x + direction.dx;
    const newY = state.player.y + direction.dy;
    if (!isInside(state.level, newX, newY)) {
        announce("Fronteira do mapa alcançada.");
        return;
    }
    if (isBlocked(state.level, newX, newY)) {
        let reason = "";
        if (isDoor(state.level, newX, newY)) reason = " Porta à frente. Pressione Enter para abrir.";
        else if (getBoxAt(state.level, newX, newY)) reason = " A caixa deve ser destruída ou contornada.";
        announce(`Caminho bloqueado para ${directionName.toLowerCase()}.${reason}`);
        return;
    }
    state.player.x = newX;
    state.player.y = newY;
    announce(`${newX},${newY}`);
    render();
}

function scan(state, announce) {
    const direction = getDirectionVector(state.player.dir);
    const foundObjects = [];
    const checkedCoordinates = new Set();
    for (let distance = 1; distance <= 5; distance += 1) {
        const spread = Math.floor(distance / 2);
        for (let offset = -spread; offset <= spread; offset += 1) {
            const vertical = state.player.dir === "CIMA" || state.player.dir === "BAIXO";
            const scanX = vertical ? state.player.x + offset : state.player.x + direction.dx * distance;
            const scanY = vertical ? state.player.y + direction.dy * distance : state.player.y + offset;
            const coordinateKey = `${scanX},${scanY}`;
            if (!isInside(state.level, scanX, scanY) || checkedCoordinates.has(coordinateKey)) continue;
            checkedCoordinates.add(coordinateKey);
            if (isWall(state.level, scanX, scanY)) foundObjects.push(`parede em X ${scanX}, Y ${scanY}`);
            else if (getBoxAt(state.level, scanX, scanY)) foundObjects.push(`caixa em X ${scanX}, Y ${scanY}`);
            else if (isDoor(state.level, scanX, scanY)) foundObjects.push(`porta em X ${scanX}, Y ${scanY}`);
        }
    }
    const result = foundObjects.length > 0 ? foundObjects.join(", ") : "nenhum obstáculo ou porta relevante no campo de visão";
    announce(`Varredura em cone concluída: ${result}.`);
}

function attack(state, announce, render) {
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    if (!weapon) {
        announce("Nenhuma arma equipada nesta instância.");
        return;
    }
    const direction = getDirectionVector(state.player.dir);
    const range = weapon.alcance !== undefined ? weapon.alcance : 1;
    for (let distance = 1; distance <= range; distance += 1) {
        const targetX = state.player.x + direction.dx * distance;
        const targetY = state.player.y + direction.dy * distance;
        if (!isInside(state.level, targetX, targetY)) break;
        if (isWall(state.level, targetX, targetY)) {
            announce(`Ataque bloqueado por parede em X ${targetX}, Y ${targetY}.`);
            return;
        }
        if (isDoor(state.level, targetX, targetY)) {
            announce("A porta bloqueia o ataque. Pressione Enter para interagir com ela.");
            return;
        }
        const box = getBoxAt(state.level, targetX, targetY);
        if (box) {
            state.player.stats.ouro += box.ouro;
            removeBox(state.level, box);
            announce(`Caixa em X ${targetX}, Y ${targetY} destruída. Você encontrou ${box.ouro} de ouro. Total: ${state.player.stats.ouro}.`);
            render();
            return;
        }
    }
    announce(`Ataque desferido com ${weapon.nome}. Nenhum alvo ao alcance.`);
}

function interact(state, announce, render) {
    const position = frontPosition(state);
    if (!isDoor(state.level, position.x, position.y)) {
        announce("Nada com que interagir nesta direção.");
        return;
    }
    state.levelNumber += 1;
    state.level = createLevel(state.levelNumber);
    resetPlayerPosition(state.player);
    initializePlayerStats(state.player);
    announce(`Porta aberta. Você avançou para o nível ${state.levelNumber}.`);
    render();
}

function toggleWeapon(state, announce) {
    state.player.instanciaAtiva = state.player.instanciaAtiva === "MELEE" ? "RANGED" : "MELEE";
    const weapon = state.player.instanciaAtiva === "MELEE" ? state.player.equipment.armaMelee : state.player.equipment.armaRanged;
    const weaponName = weapon ? weapon.nome : "nenhuma";
    announce(`Arma ativa: ${weaponName}.`);
}

function handleMenuKey(state, event, announce) {
    const { key } = event;
    const menu = state.gameState === "MENU_STATUS" ? STATUS_MENU : state.gameState === "MENU_EQUIPAMENTO" ? EQUIPMENT_MENU : MAIN_MENU;
    if (key === "ArrowUp" || key === "ArrowDown") {
        const increment = key === "ArrowDown" ? 1 : -1;
        state.menuIndex = (state.menuIndex + increment + menu.length) % menu.length;
        const option = menu[state.menuIndex];
        const detail = state.gameState === "MENU_STATUS" ? statusDetail(state.player, option) : state.gameState === "MENU_EQUIPAMENTO" ? equipmentDetail(state.player, option) : option;
        announce(detail);
        return true;
    }
    if (key === "Escape") {
        const previousState = state.gameState;
        if (previousState === "MENU_PRINCIPAL") {
            state.gameState = "NORMAL";
            announce(`${state.player.x},${state.player.y}`);
        } else {
            state.gameState = "MENU_PRINCIPAL";
            state.menuIndex = previousState === "MENU_STATUS" ? 0 : 2;
            announce(`Menu principal. Opção: ${MAIN_MENU[state.menuIndex]}.`);
        }
        return true;
    }
    if (state.gameState === "MENU_PRINCIPAL" && key === "Enter") {
        const option = MAIN_MENU[state.menuIndex];
        if (option === "Status") {
            state.gameState = "MENU_STATUS";
            state.menuIndex = 0;
            announce(`Submenu de Status. ${statusDetail(state.player, STATUS_MENU[0])}`);
        } else if (option === "Inventário") {
            announce("Inventário vazio.");
        } else {
            state.gameState = "MENU_EQUIPAMENTO";
            state.menuIndex = 0;
            announce(`Submenu de Equipamento. ${equipmentDetail(state.player, EQUIPMENT_MENU[0])}`);
        }
        return true;
    }
    return false;
}

export function installInput({ state, announce, render }) {
    function onKeyDown(event) {
        if (state.gameState !== "NORMAL") {
            if (handleMenuKey(state, event, announce)) event.preventDefault();
            return;
        }
        const key = event.key;
        const lowerKey = key.toLowerCase();
        const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key);
        const isGameKey = isArrow || ["a", "c", "enter", "s", "t", "w"].includes(lowerKey);
        if (isGameKey) event.preventDefault();
        if (lowerKey === "s") scan(state, announce);
        else if (lowerKey === "c") {
            state.gameState = "MENU_PRINCIPAL";
            state.menuIndex = 0;
            announce("Menu principal. Use as setas, Enter para selecionar e Escape para fechar.");
        } else if (lowerKey === "t") announce(`Você está olhando para ${state.player.dir.toLowerCase()}.`);
        else if (lowerKey === "w") toggleWeapon(state, announce);
        else if (lowerKey === "a") attack(state, announce, render);
        else if (key === "Enter") interact(state, announce, render);
        else if (isArrow) {
            const direction = { ArrowUp: "CIMA", ArrowDown: "BAIXO", ArrowLeft: "ESQUERDA", ArrowRight: "DIREITA" }[key];
            if (event.shiftKey) {
                state.player.dir = direction;
                announce(`Olhar direcionado para ${direction.toLowerCase()}.`);
                render();
            } else move(state, direction, announce, render);
        }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
}
