// Dados do criador de personagem. Os textos ficam em i18n.js para manter a interface localizada.

export const GENDERS = Object.freeze(["feminine", "masculine"]);

export const CHARACTER_CLASSES = Object.freeze([
    Object.freeze({ key: "vanguard", playerClass: "VANGUARDA" }),
    Object.freeze({ key: "hunter", playerClass: "CACADOR" }),
    Object.freeze({ key: "mystic", playerClass: "MISTICO" })
]);

const PRESETS = {
    feminine: {
        vanguard: ["vanguard-f-1", "vanguard-f-2", "vanguard-f-3"],
        hunter: ["hunter-f-1", "hunter-f-2", "hunter-f-3"],
        mystic: ["mystic-f-1", "mystic-f-2", "mystic-f-3"]
    },
    masculine: {
        vanguard: ["vanguard-m-1", "vanguard-m-2", "vanguard-m-3"],
        hunter: ["hunter-m-1", "hunter-m-2", "hunter-m-3"],
        mystic: ["mystic-m-1", "mystic-m-2", "mystic-m-3"]
    }
};

export function getPresetKeys(gender, classKey) {
    return PRESETS[gender]?.[classKey] || PRESETS.feminine.vanguard;
}

export function getDefaultDraft() {
    return { name: "", gender: "feminine", classKey: "vanguard", presetKey: "vanguard-f-1" };
}

export function normalizeDraft(draft) {
    const gender = GENDERS.includes(draft.gender) ? draft.gender : "feminine";
    const classKey = CHARACTER_CLASSES.some((item) => item.key === draft.classKey) ? draft.classKey : "vanguard";
    const presets = getPresetKeys(gender, classKey);
    const presetKey = presets.includes(draft.presetKey) ? draft.presetKey : presets[0];
    return { name: String(draft.name || ""), gender, classKey, presetKey };
}

export function getClassByKey(classKey) {
    return CHARACTER_CLASSES.find((item) => item.key === classKey) || CHARACTER_CLASSES[0];
}
