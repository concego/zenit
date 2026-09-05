// Sons de interface carregados como assets WAV gerados fora do código.

const SOUND_IDS = Object.freeze({
    scroll: "menuScrollSound",
    confirm: "menuConfirmSound",
    cancel: "menuCancelSound"
});

function playSound(kind) {
    const audio = document.getElementById(SOUND_IDS[kind]);
    if (!audio) return;
    audio.volume = kind === "scroll" ? 0.42 : 0.5;
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
}

export function playMenuScroll() { playSound("scroll"); }
export function playMenuConfirm() { playSound("confirm"); }
export function playMenuCancel() { playSound("cancel"); }
