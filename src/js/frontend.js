import { LANGUAGES, getText } from "./i18n.js";
import { CHARACTER_CLASSES, GENDERS, getPresetKeys, normalizeDraft } from "./character.js";
import { appendCharacterAvatar } from "./character-art.js";

export const FRONT_STATES = {
    LANGUAGE: "FRONT_LANGUAGE",
    MAIN: "FRONT_MAIN",
    OPTIONS: "FRONT_OPTIONS",
    CREDITS: "FRONT_CREDITS",
    CHARACTER: "FRONT_CHARACTER"
};

export function getFrontMenu(state) {
    if (state.gameState === FRONT_STATES.LANGUAGE) return LANGUAGES.map(({ code, label }) => ({ key: code, label, disabled: false }));
    if (state.gameState === FRONT_STATES.MAIN) return [
        { key: "continue", label: getText(state.language, "main.continue"), disabled: !state.hasSave },
        { key: "newGame", label: getText(state.language, "main.newGame"), disabled: false },
        { key: "options", label: getText(state.language, "main.options"), disabled: false },
        { key: "credits", label: getText(state.language, "main.credits"), disabled: false }
    ];
    if (state.gameState === FRONT_STATES.OPTIONS) return [
        { key: "language", label: getText(state.language, "options.language"), disabled: false },
        { key: "controls", label: getText(state.language, "options.controls"), disabled: false },
        { key: "accessibility", label: getText(state.language, "options.accessibility"), disabled: false },
        { key: "defaults", label: getText(state.language, "options.defaults"), disabled: false }
    ];
    return [{ key: "back", label: getText(state.language, "common.back"), disabled: false }];
}

function option(select, value, label) {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = label;
    select.appendChild(item);
}

function renderCharacterCreation({ state, elements }) {
    const draft = normalizeDraft(state.characterDraft);
    state.characterDraft = draft;
    const lang = state.language;
    elements.characterCreation.hidden = false;
    elements.frontEnd.hidden = true;
    elements.svgCanvas.hidden = true;
    elements.characterTitle.textContent = getText(lang, "character.title");
    elements.characterIntro.textContent = getText(lang, "character.intro");
    elements.characterNameLabel.textContent = getText(lang, "character.nameLabel");
    elements.characterName.placeholder = getText(lang, "character.namePlaceholder");
    elements.genderLabel.textContent = getText(lang, "character.genderLabel");
    elements.classLabel.textContent = getText(lang, "character.classLabel");
    elements.presetLabel.textContent = getText(lang, "character.presetLabel");
    elements.characterDescriptionLabel.textContent = getText(lang, "character.descriptionLabel");
    elements.characterConfirm.textContent = getText(lang, "character.confirm");
    elements.characterCancel.textContent = getText(lang, "common.back");

    elements.genderSelect.replaceChildren();
    GENDERS.forEach((gender) => option(elements.genderSelect, gender, getText(lang, `character.genders.${gender}`)));
    elements.genderSelect.value = draft.gender;
    elements.classSelect.replaceChildren();
    CHARACTER_CLASSES.forEach(({ key }) => option(elements.classSelect, key, getText(lang, `character.classes.${key}.name`)));
    elements.classSelect.value = draft.classKey;
    elements.presetSelect.replaceChildren();
    getPresetKeys(draft.gender, draft.classKey).forEach((presetKey, index) => option(elements.presetSelect, presetKey, getText(lang, "character.presetOption").replace("{number}", String(index + 1))));
    elements.presetSelect.value = draft.presetKey;
    elements.characterName.value = draft.name;
    elements.characterClassDescription.textContent = getText(lang, `character.classes.${draft.classKey}.description`);
    elements.characterDescription.textContent = getText(lang, `character.presets.${draft.presetKey}.description`);
    elements.characterPreview.replaceChildren();
    appendCharacterAvatar(elements.characterPreview, { x: 100, y: 100, size: 170, gender: draft.gender, classKey: draft.classKey, presetKey: draft.presetKey });
    elements.characterPreview.setAttribute("aria-label", elements.characterDescription.textContent);
}

export function renderFrontEnd({ state, elements }) {
    if (state.gameState === FRONT_STATES.CHARACTER) {
        renderCharacterCreation({ state, elements });
        return;
    }
    const menu = getFrontMenu(state);
    const lang = state.language;
    elements.characterCreation.hidden = true;
    elements.frontEnd.hidden = false;
    elements.svgCanvas.hidden = true;
    elements.frontTitle.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.title") : state.gameState === FRONT_STATES.MAIN ? "Zenit" : state.gameState === FRONT_STATES.OPTIONS ? getText(lang, "options.title") : getText(lang, "credits.title");
    elements.frontDescription.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.description") : state.gameState === FRONT_STATES.CREDITS ? `${getText(lang, "credits.description")} ${getText(lang, "credits.contact")}` : "";
    elements.frontOptions.replaceChildren();
    menu.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item.label;
        li.setAttribute("role", "menuitem");
        if (item.disabled) li.setAttribute("aria-disabled", "true");
        if (index === state.menuIndex) { li.setAttribute("aria-current", "true"); li.classList.add("menu-option-selected"); }
        if (item.disabled) li.classList.add("menu-option-disabled");
        elements.frontOptions.appendChild(li);
    });
    elements.frontDetails.textContent = state.gameState === FRONT_STATES.MAIN && menu[state.menuIndex]?.disabled ? getText(lang, "main.noSave") : "";
    elements.frontHint.textContent = state.gameState === FRONT_STATES.LANGUAGE ? getText(lang, "language.hint") : state.gameState === FRONT_STATES.CREDITS ? getText(lang, "credits.back") : getText(lang, "common.choose");
}

export { renderCharacterCreation };
