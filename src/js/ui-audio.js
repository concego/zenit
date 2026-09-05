// Sons curtos de interface gerados pela Web Audio API, sem arquivos externos.

let audioContext = null;

function getAudioContext() {
    if (audioContext) return audioContext;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
    return audioContext;
}

function tone(context, frequency, start, duration, type = "sine", volume = 0.035) {
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

function play(sequence) {
    const context = getAudioContext();
    if (!context) return;
    const start = context.currentTime + 0.005;
    if (context.state === "suspended") context.resume().catch(() => {});
    sequence.forEach((item) => tone(context, item.frequency, start + item.offset, item.duration, item.type, item.volume));
}

export function playMenuScroll() {
    play([{ frequency: 620, offset: 0, duration: 0.045, type: "triangle", volume: 0.028 }]);
}

export function playMenuConfirm() {
    play([
        { frequency: 440, offset: 0, duration: 0.07, type: "sine", volume: 0.032 },
        { frequency: 660, offset: 0.065, duration: 0.105, type: "sine", volume: 0.038 }
    ]);
}

export function playMenuCancel() {
    play([
        { frequency: 520, offset: 0, duration: 0.07, type: "sine", volume: 0.03 },
        { frequency: 330, offset: 0.065, duration: 0.11, type: "sine", volume: 0.035 }
    ]);
}
