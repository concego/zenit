// Ponto de entrada e estado principal do Zenit.

import { installInput } from "./input.js";
import { installFrontInput } from "./frontend-input.js";
import { createLevel } from "./map.js";
import { createPlayer } from "./player.js";
import { renderGame } from "./render.js";
import { FRONT_STATES, renderFrontEnd } from "./frontend.js";
import { getSavedLanguage, getText, saveLanguage } from "./i18n.js";

function startGame() {
    const elements = {
        svgCanvas: document.getElementById("gameCanvas"),
        announcer: document.getElementById("screenReaderAnnouncer"),
        frontEnd: document.getElementById("frontEnd"),
        frontTitle: document.getElementById("frontTitle"),
        frontDescription: document.getElementById("frontDescription"),
        frontOptions: document.getElementById("frontOptions"),
        frontDetails: document.getElementById("frontDetails"),
        frontHint: document.getElementById("frontHint")
    };
    if (Object.values(elements).some((element) => !element)) {
        throw new Error("A interface principal do Zenit não foi encontrada.");
    }

    const savedLanguage = getSavedLanguage();
    const state = {
        gameState: savedLanguage ? FRONT_STATES.MAIN : FRONT_STATES.LANGUAGE,
        language: savedLanguage || "pt-BR",
        languageContext: savedLanguage ? "main" : "startup",
        levelNumber: 1,
        level: createLevel(1),
        player: createPlayer(),
        menuIndex: 0,
        hasSave: false
    };

    let announcementTimer = null;
    const announce = (message) => {
        window.clearTimeout(announcementTimer);
        elements.announcer.textContent = "";
        announcementTimer = window.setTimeout(() => { elements.announcer.textContent = message; }, 20);
    };

    const render = () => {
        const isFrontEnd = state.gameState.startsWith("FRONT_");
        if (isFrontEnd) {
            renderFrontEnd({ state, elements });
        } else {
            elements.frontEnd.hidden = true;
            elements.svgCanvas.hidden = false;
            renderGame({ svgCanvas: elements.svgCanvas, level: state.level, player: state.player });
        }
    };

    const onLanguageSelected = (language) => {
        state.language = language;
        saveLanguage(language);
        document.documentElement.lang = language;
        render();
    };

    const startNewGame = () => {
        state.gameState = "NORMAL";
        state.levelNumber = 1;
        state.level = createLevel(1);
        state.player = createPlayer();
        state.menuIndex = 0;
        render();
        elements.svgCanvas.focus();
        announce(`${getText(state.language, "startup.newGame")} ${getText(state.language, "startup.controls")}`);
    };

    installFrontInput({ state, announce, render, onLanguageSelected, startNewGame });
    installInput({ state, announce, render });
    render();
    elements.frontEnd.focus();
    announce(state.gameState === FRONT_STATES.LANGUAGE
        ? getText(state.language, "language.hint")
        : getText(state.language, "main.title"));
}

document.addEventListener("DOMContentLoaded", startGame, { once: true });
