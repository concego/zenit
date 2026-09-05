// Sons curtos de interface gerados pela Web Audio API, sem arquivos externos.

let audioContext = null;
let audioEnabled = false;
let resumePromise = null;

function getAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    try {
        audioContext = new AudioContextClass();
    } catch {
        return null;
    }
    return audioContext;
}

export async function enableAudio() {
    const context = getAudioContext();
    if (!context) return false;
    if (context.state === "running") { audioEnabled = true; return true; }
    if (!resumePromise) resumePromise = context.resume().then(() => context.state === "running").catch(() => false);
    const enabled = await resumePromise;
    resumePromise = null;
    audioEnabled = enabled;
    return enabled;
}

export function isAudioEnabled() { return audioEnabled; }

function tone(context, frequency, start, duration, type = "sine", volume = 0.07) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
}

function schedule(context, sequence) {
    const start = context.currentTime + 0.01;
    sequence.forEach((item) => tone(context, item.frequency, start + item.offset, item.duration, item.type, item.volume));
}

function play(sequence) {
    enableAudio().then((enabled) => {
        if (enabled) schedule(audioContext, sequence);
    });
}

window.addEventListener("pointerdown", () => { enableAudio(); }, { passive: true });
window.addEventListener("touchstart", () => { enableAudio(); }, { passive: true });
window.addEventListener("keydown", () => { enableAudio(); }, { passive: true });

export function playMenuScroll() {
    play([{ frequency: 620, offset: 0, duration: 0.07, type: "triangle", volume: 0.06 }]);
}

export function playMenuConfirm() {
    play([
        { frequency: 440, offset: 0, duration: 0.09, type: "sine", volume: 0.07 },
        { frequency: 660, offset: 0.075, duration: 0.14, type: "sine", volume: 0.085 }
    ]);
}

export function playMenuCancel() {
    play([
        { frequency: 520, offset: 0, duration: 0.09, type: "sine", volume: 0.065 },
        { frequency: 330, offset: 0.075, duration: 0.14, type: "sine", volume: 0.075 }
    ]);
}
