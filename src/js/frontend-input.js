import { FRONT_STATES, getFrontMenu } from "./frontend.js";
import { getText } from "./i18n.js";
export function installFrontInput({ state, announce, render, onLanguageSelected, startNewGame }) {
    window.addEventListener("keydown", (event) => {
        if (!state.gameState.startsWith("FRONT_")) return;
        const menu = getFrontMenu(state);
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            state.menuIndex = (state.menuIndex + (event.key === "ArrowDown" ? 1 : -1) + menu.length) % menu.length;
            announce(menu[state.menuIndex].disabled ? getText(state.language, "main.noSave") : menu[state.menuIndex].label);
        } else if (event.key === "Escape") {
            if (state.gameState === FRONT_STATES.LANGUAGE && state.languageContext === "startup") announce(getText(state.language, "language.hint"));
            else { state.gameState = FRONT_STATES.MAIN; state.menuIndex = 0; announce(getText(state.language, "main.title")); }
        } else if (event.key === "Enter") {
            const item = menu[state.menuIndex];
            if (!item) return;
            if (item.disabled) announce(getText(state.language, "main.noSave"));
            else if (state.gameState === FRONT_STATES.LANGUAGE) { const context = state.languageContext; onLanguageSelected(item.key); state.gameState = context === "options" ? FRONT_STATES.OPTIONS : FRONT_STATES.MAIN; state.menuIndex = 0; announce(getText(state.language, "language.selected")); }
            else if (state.gameState === FRONT_STATES.MAIN) { if (item.key === "newGame") startNewGame(); else { state.gameState = item.key === "options" ? FRONT_STATES.OPTIONS : FRONT_STATES.CREDITS; state.menuIndex = 0; } }
            else if (state.gameState === FRONT_STATES.OPTIONS) { if (item.key === "language") { state.languageContext = "options"; state.gameState = FRONT_STATES.LANGUAGE; state.menuIndex = 0; } else announce(getText(state.language, `options.${item.key}Info`)); }
            else { state.gameState = FRONT_STATES.MAIN; state.menuIndex = 0; }
        } else return;
        event.preventDefault(); event.stopImmediatePropagation(); render();
    });
}
