// Ponto de entrada e estado principal do Zenit.

import { installInput } from "./input.js";
import { createLevel } from "./map.js";
import { createPlayer } from "./player.js";
import { renderGame } from "./render.js";

function startGame() {
    const svgCanvas = document.getElementById("gameCanvas");
    const announcer = document.getElementById("screenReaderAnnouncer");
    if (!svgCanvas || !announcer) throw new Error("A interface principal do Zenit não foi encontrada.");

    const state = {
        gameState: "NORMAL",
        levelNumber: 1,
        level: createLevel(1),
        player: createPlayer(),
        menuIndex: 0
    };

    let announcementTimer = null;
    const announce = (message) => {
        window.clearTimeout(announcementTimer);
        announcer.textContent = "";
        announcementTimer = window.setTimeout(() => { announcer.textContent = message; }, 20);
    };

    const render = () => renderGame({ svgCanvas, level: state.level, player: state.player });
    installInput({ state, announce, render });
    render();
    announce("Zenit iniciado. Use as setas para mover, Shift mais setas para olhar, T para direção, S para scan, W para trocar arma, A para atacar, Enter para interagir e C para abrir o menu.");
}

document.addEventListener("DOMContentLoaded", startGame, { once: true });
