// Ponto de entrada e estado principal do Zenit.

import { installInput } from "./input.js";
import { installFrontInput } from "./frontend-input.js";
import { createLevel } from "./map.js";
import { createPlayer } from "./player.js";
import { renderGame } from "./render.js";
import { FRONT_STATES, renderFrontEnd } from "./frontend.js";
import { getDefaultDraft } from "./character.js";
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
        frontHint: document.getElementById("frontHint"),
        characterCreation: document.getElementById("characterCreation"),
        characterTitle: document.getElementById("characterTitle"),
        characterIntro: document.getElementById("characterIntro"),
        characterHint: document.getElementById("characterHint"),
        characterForm: document.getElementById("characterForm"),
        characterName: document.getElementById("characterName"),
        characterNameLabel: document.getElementById("characterNameLabel"),
        genderLabel: document.getElementById("genderLabel"),
        genderSelect: document.getElementById("characterGender"),
        classLabel: document.getElementById("classLabel"),
        classSelect: document.getElementById("characterClass"),
        presetLabel: document.getElementById("presetLabel"),
        presetSelect: document.getElementById("characterPreset"),
        characterClassDescription: document.getElementById("characterClassDescription"),
        characterDescriptionLabel: document.getElementById("characterDescriptionLabel"),
        characterDescription: document.getElementById("characterDescription"),
        characterPreview: document.getElementById("characterPreview"),
        characterConfirm: document.getElementById("characterConfirm"),
        characterCancel: document.getElementById("characterCancel"),
        menuMusic: document.getElementById("menuMusic"),
        levelMusic: document.getElementById("levelMusic")
    };
    if (Object.values(elements).some((element) => !element)) throw new Error("A interface principal do Zenit não foi encontrada.");

    const savedLanguage = getSavedLanguage();
    const state = {
        gameState: savedLanguage ? FRONT_STATES.MAIN : FRONT_STATES.LANGUAGE,
        language: savedLanguage || "pt-BR",
        languageContext: savedLanguage ? "main" : "startup",
        levelNumber: 1,
        level: createLevel(1),
        player: createPlayer(),
        character: null,
        characterDraft: getDefaultDraft(),
        characterFocus: 0,
        characterNameEditing: false,
        menuIndex: 0,
        hasSave: false
    };

    let announcementTimer = null;
    const announce = (message) => {
        window.clearTimeout(announcementTimer);
        elements.announcer.textContent = "";
        announcementTimer = window.setTimeout(() => { elements.announcer.textContent = message; }, 20);
    };

    const syncMenuMusic = () => {
        const isMainMenu = state.gameState === FRONT_STATES.MAIN;
        if (isMainMenu) {
            elements.menuMusic.volume = 0.35;
            const playback = elements.menuMusic.play();
            if (playback && typeof playback.catch === "function") playback.catch(() => {});
        } else {
            elements.menuMusic.pause();
            elements.menuMusic.currentTime = 0;
        }

        const isFirstLevel = state.gameState === "NORMAL" && state.levelNumber === 1;
        if (isFirstLevel) {
            elements.levelMusic.volume = 0.3;
            const playback = elements.levelMusic.play();
            if (playback && typeof playback.catch === "function") playback.catch(() => {});
        } else {
            elements.levelMusic.pause();
            elements.levelMusic.currentTime = 0;
        }
    };

    const render = () => {
        if (state.gameState.startsWith("FRONT_")) renderFrontEnd({ state, elements });
        else {
            elements.frontEnd.hidden = true;
            elements.characterCreation.hidden = true;
            elements.svgCanvas.hidden = false;
            renderGame({ svgCanvas: elements.svgCanvas, level: state.level, player: state.player, language: state.language });
        }
        syncMenuMusic();
    };

    const onLanguageSelected = (language) => {
        state.language = language;
        saveLanguage(language);
        document.documentElement.lang = language;
        render();
    };

    const startNewGame = () => {
        state.gameState = FRONT_STATES.CHARACTER;
        state.characterDraft = getDefaultDraft();
        state.characterFocus = 0;
        state.characterNameEditing = false;
        state.menuIndex = 0;
        render();
        elements.characterName.focus();
        announce(getText(state.language, "character.intro"));
    };

    const cancelCharacter = () => {
        state.gameState = FRONT_STATES.MAIN;
        state.menuIndex = 1;
        render();
        elements.frontEnd.focus();
        announce(getText(state.language, "main.title"));
    };

    const confirmCharacter = () => {
        const name = elements.characterName.value.trim();
        state.characterDraft.name = name;
        if (!name) { announce(getText(state.language, "character.nameRequired")); elements.characterName.focus(); return; }
        state.character = { ...state.characterDraft, name };
        state.gameState = "NORMAL";
        state.levelNumber = 1;
        state.level = createLevel(1);
        state.player = createPlayer(state.character);
        state.hasSave = true;
        render();
        elements.svgCanvas.focus();
        announce(`${getText(state.language, "startup.newGame")} ${name}. ${getText(state.language, "startup.controls")}`);
    };

    installFrontInput({ state, elements, announce, render, onLanguageSelected, startNewGame, confirmCharacter, cancelCharacter });
    installInput({ state, announce, render });
    render();
    document.documentElement.lang = state.language;
    if (state.gameState === FRONT_STATES.LANGUAGE) { elements.frontEnd.focus(); announce(getText(state.language, "language.hint")); }
    else elements.frontEnd.focus();
}

document.addEventListener("DOMContentLoaded", startGame, { once: true });
