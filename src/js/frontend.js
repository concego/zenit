import { LANGUAGES, getText } from "./i18n.js";
export const FRONT_STATES = { LANGUAGE: "FRONT_LANGUAGE", MAIN: "FRONT_MAIN", OPTIONS: "FRONT_OPTIONS", CREDITS: "FRONT_CREDITS" };
export function getFrontMenu(state) {
    if (state.gameState === FRONT_STATES.LANGUAGE) return LANGUAGES.map(({ code, label }) => ({ key: code, label, disabled: false }));
    if (state.gameState === FRONT_STATES.MAIN) return [{ key: "continue", label: getText(state.language, "main.continue"), disabled: !state.hasSave }, { key: "newGame", label: getText(state.language, "main.newGame"), disabled: false }, { key: "options", label: getText(state.language, "main.options"), disabled: false }, { key: "credits", label: getText(state.language, "main.credits"), disabled: false }];
    if (state.gameState === FRONT_STATES.OPTIONS) return [{ key: "language", label: getText(state.language, "options.language"), disabled: false }, { key: "controls", label: getText(state.language, "options.controls"), disabled: false }, { key: "accessibility", label: getText(state.language, "options.accessibility"), disabled: false }, { key: "defaults", label: getText(state.language, "options.defaults"), disabled: false }];
    return [{ key: "back", label: getText(state.language, "common.back"), disabled: false }];
}
export function renderFrontEnd({ state, elements }) {
    const menu = getFrontMenu(state);
    const lang = state.language;
    elements.frontEnd.hidden = false;
    elements.svgCanvas.hidden = true;
    elements.frontTitle.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.title") : state.gameState === FRONT_STATES.MAIN ? "Zenit" : state.gameState === FRONT_STATES.OPTIONS ? getText(lang, "options.title") : getText(lang, "credits.title");
    elements.frontDescription.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.description") : state.gameState === FRONT_STATES.CREDITS ? `${getText(lang, "credits.description")} ${getText(lang, "credits.contact")}` : "";
    elements.frontOptions.replaceChildren();
    menu.forEach((item, index) => { const li = document.createElement("li"); li.textContent = item.label; li.setAttribute("role", "menuitem"); if (item.disabled) li.setAttribute("aria-disabled", "true"); if (index === state.menuIndex) { li.setAttribute("aria-current", "true"); li.classList.add("menu-option-selected"); } if (item.disabled) li.classList.add("menu-option-disabled"); elements.frontOptions.appendChild(li); });
    elements.frontDetails.textContent = state.gameState === FRONT_STATES.MAIN && menu[state.menuIndex]?.disabled ? getText(lang, "main.noSave") : "";
    elements.frontHint.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.hint") : state.gameState === FRONT_STATES.CREDITS ? getText(lang, "credits.back") : getText(lang, "common.choose");
}
