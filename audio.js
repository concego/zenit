// Gerenciador de Áudio usando a Web Audio API com desbloqueio automático
class SoundManager {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    }

    // Garante que o contexto de áudio seja ativado após a primeira interação do usuário
    init() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
                console.log("Contexto de áudio ativado com sucesso.");
            });
        }
    }

    playStep() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playHitWall() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playSuccess() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let now = this.ctx.currentTime;
        [440, 554.37, 659.25].forEach((freq, index) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + (index * 0.08));

            gain.gain.setValueAtTime(0.08, now + (index * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.08) + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (index * 0.08));
            osc.stop(now + (index * 0.08) + 0.15);
        });
    }

    playScan() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let now = this.ctx.currentTime;
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playAttack() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let now = this.ctx.currentTime;
        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playMenuScroll() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let osc = this.ctx.createOscillator();
        let gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playMenuConfirm() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let now = this.ctx.currentTime;
        [350, 580].forEach((freq, index) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + (index * 0.06));

            gain.gain.setValueAtTime(0.1, now + (index * 0.06));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.06) + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (index * 0.06));
            osc.stop(now + (index * 0.06) + 0.1);
        });
    }

    playMenuBack() {
        this.init();
        if (this.ctx.state !== 'running') return;

        let now = this.ctx.currentTime;
        [500, 300].forEach((freq, index) => {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (index * 0.05));

            gain.gain.setValueAtTime(0.08, now + (index * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (index * 0.05) + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + (index * 0.05));
            osc.stop(now + (index * 0.05) + 0.08);
        });
    }
}

const soundManager = new SoundManager();