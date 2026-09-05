import { FRONT_STATES, getFrontMenu } from "./frontend.js";
import { getText } from "./i18n.js";
import { getPresetKeys } from "./character.js";
import { playMenuCancel, playMenuConfirm, playMenuScroll } from "./ui-audio.js";

const CHARACTER_FOCUS_COUNT = 6;

function characterControls(elements) {
    return [elements.characterName, elements.genderSelect, elements.classSelect, elements.presetSelect, elements.characterConfirm, elements.characterCancel];
}

function focusCharacterControl(state, elements) {
    const control = characterControls(elements)[state.characterFocus];
    if (control) control.focus();
}

function characterFocusAnnouncement(state, elements) {
    const control = characterControls(elements)[state.characterFocus];
    if (state.characterFocus === 0) return state.characterNameEditing
        ? getText(state.language, "character.nameEditing")
        : getText(state.language, "character.nameFocus");
    if (state.characterFocus === 1) return `${getText(state.language, "character.genderLabel")}: ${elements.genderSelect.options[elements.genderSelect.selectedIndex].textContent}.`;
    if (state.characterFocus === 2) return `${getText(state.language, "character.classLabel")}: ${elements.classSelect.options[elements.classSelect.selectedIndex].textContent}.`;
    if (state.characterFocus === 3) return `${getText(state.language, "character.presetLabel")}: ${elements.presetSelect.options[elements.presetSelect.selectedIndex].textContent}`;
    if (state.characterFocus === 4) return getText(state.language, "character.confirm");
    return getText(state.language, "common.back");
}

function changeCharacterChoice(state, elements, direction, announce, render) {
    const select = state.characterFocus === 1 ? elements.genderSelect : state.characterFocus === 2 ? elements.classSelect : elements.presetSelect;
    if (!select) return false;
    const next = (select.selectedIndex + direction + select.options.length) % select.options.length;
    playMenuScroll();
    select.selectedIndex = next;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    render();
    focusCharacterControl(state, elements);
    announce(characterFocusAnnouncement(state, elements));
    return true;
}

export function installFrontInput({ state, elements, announce, render, onLanguageSelected, startNewGame, confirmCharacter, cancelCharacter }) {
    elements.characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        confirmCharacter();
    });
    elements.characterCancel.addEventListener("click", () => cancelCharacter());
    elements.genderSelect.addEventListener("change", () => {
        state.characterDraft.gender = elements.genderSelect.value;
        state.characterDraft.presetKey = getPresetKeys(state.characterDraft.gender, state.characterDraft.classKey)[0];
        state.characterFocus = 1;
        render();
    });
    elements.classSelect.addEventListener("change", () => {
        state.characterDraft.classKey = elements.classSelect.value;
        state.characterDraft.presetKey = getPresetKeys(state.characterDraft.gender, state.characterDraft.classKey)[0];
        state.characterFocus = 2;
        render();
    });
    elements.presetSelect.addEventListener("change", () => {
        state.characterDraft.presetKey = elements.presetSelect.value;
        state.characterFocus = 3;
        render();
    });
    elements.characterName.addEventListener("input", () => { state.characterDraft.name = elements.characterName.value; });

    window.addEventListener("keydown", (event) => {
        if (state.gameState === FRONT_STATES.CHARACTER) {
            if (state.characterNameEditing) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    playMenuConfirm();
                    state.characterNameEditing = false;
                    state.characterDraft.name = elements.characterName.value;
                    render();
                    focusCharacterControl(state, elements);
                    announce(getText(state.language, "character.nameConfirmed"));
                } else if (event.key === "Escape") {
                    event.preventDefault();
                    playMenuCancel();
                    state.characterNameEditing = false;
                    render();
                    focusCharacterControl(state, elements);
                    announce(getText(state.language, "character.nameCancelled"));
                }
                return;
            }
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                playMenuScroll();
                const direction = event.key === "ArrowDown" ? 1 : -1;
                state.characterFocus = (state.characterFocus + direction + CHARACTER_FOCUS_COUNT) % CHARACTER_FOCUS_COUNT;
                render();
                focusCharacterControl(state, elements);
                announce(characterFocusAnnouncement(state, elements));
            } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                if ([1, 2, 3].includes(state.characterFocus)) {
                    event.preventDefault();
                    changeCharacterChoice(state, elements, event.key === "ArrowRight" ? 1 : -1, announce, render);
                }
            } else if (event.key === "Enter") {
                event.preventDefault();
                playMenuConfirm();
                if (state.characterFocus === 0) {
                    state.characterNameEditing = true;
                    render();
                    focusCharacterControl(state, elements);
                    announce(getText(state.language, "character.nameEditing"));
                } else if (state.characterFocus === 4) confirmCharacter();
                else if (state.characterFocus === 5) cancelCharacter();
                else announce(characterFocusAnnouncement(state, elements));
            } else return;
            return;
        }
        if (!state.gameState.startsWith("FRONT_")) return;
        const menu = getFrontMenu(state);
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            playMenuScroll();
            state.menuIndex = (state.menuIndex + (event.key === "ArrowDown" ? 1 : -1) + menu.length) % menu.length;
            announce(menu[state.menuIndex].disabled ? getText(state.language, "main.noSave") : menu[state.menuIndex].label);
        } else if (event.key === "Escape") {
            playMenuCancel();
            if (state.gameState === FRONT_STATES.LANGUAGE && state.languageContext === "startup") announce(getText(state.language, "language.hint"));
            else { state.gameState = FRONT_STATES.MAIN; state.menuIndex = 0; announce(getText(state.language, "main.title")); }
        } else if (event.key === "Enter") {
            const item = menu[state.menuIndex];
            if (!item) return;
            if (!item.disabled) playMenuConfirm();
            if (item.disabled) announce(getText(state.language, "main.noSave"));
            else if (state.gameState === FRONT_STATES.LANGUAGE) {
                const context = state.languageContext;
                onLanguageSelected(item.key);
                state.gameState = context === "options" ? FRONT_STATES.OPTIONS : FRONT_STATES.MAIN;
                state.menuIndex = 0;
                announce(getText(state.language, "language.selected"));
            } else if (state.gameState === FRONT_STATES.MAIN) {
                if (item.key === "newGame") startNewGame();
                else { state.gameState = item.key === "options" ? FRONT_STATES.OPTIONS : FRONT_STATES.CREDITS; state.menuIndex = 0; }
            } else if (state.gameState === FRONT_STATES.OPTIONS) {
                if (item.key === "language") { state.languageContext = "options"; state.gameState = FRONT_STATES.LANGUAGE; state.menuIndex = 0; }
                else announce(getText(state.language, `options.${item.key}Info`));
            } else { state.gameState = FRONT_STATES.MAIN; state.menuIndex = 0; }
        } else return;
        event.preventDefault();
        event.stopImmediatePropagation();
        render();
    });
}
