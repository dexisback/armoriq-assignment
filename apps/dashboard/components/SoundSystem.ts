"use client";

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    if (typeof window !== "undefined") {
      this.isEnabled = localStorage.getItem("sound-enabled") !== "false";
      const savedVolume = localStorage.getItem("sound-volume");
      if (savedVolume) this.volume = parseFloat(savedVolume);
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleSound(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("sound-enabled", String(this.isEnabled));
    }
    if (this.isEnabled) {
      this.playToggleOn();
    } else {
      this.isEnabled = true;
      this.playToggleOff();
      this.isEnabled = false;
    }
    return this.isEnabled;
  }

  getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("sound-volume", String(this.volume));
    }
  }

  getVolume(): number {
    return this.volume;
  }

  playTap() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1300, now);

    const mod = ctx.createOscillator();
    const modGain = ctx.createGain();
    mod.type = "sine";
    mod.frequency.setValueAtTime(650, now);
    modGain.gain.setValueAtTime(100, now);

    mod.connect(modGain);
    modGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14 * this.volume, now + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    mod.start(now);
    osc.start(now);

    mod.stop(now + 0.025);
    osc.stop(now + 0.025);
  }

  playToggleOn() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playNote = (freq: number, gainVal: number, delay: number) => {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gainVal * this.volume, now + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    };

    playNote(2093, 0.11, 0);
    playNote(3136, 0.10, 0.025);
  }

  playToggleOff() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playNote = (freq: number, gainVal: number, delay: number) => {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gainVal * this.volume, now + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    };

    playNote(3136, 0.11, 0);
    playNote(2093, 0.10, 0.025);
  }

  playModalOpen() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(430, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.09 * this.volume, now + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.105);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playModalClose() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(730, now);
    osc.frequency.exponentialRampToValueAtTime(430, now + 0.08);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.001);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.105);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playSuccess() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playStep = (freq: number, endFreq: number | null, gainVal: number, delay: number, decay: number, release: number) => {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + decay);
      }

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(gainVal * this.volume, now + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.003 + decay + release);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay + release + 0.05);
    };

    playStep(523, null, 0.12, 0, 0.16, 0.06);
    playStep(659, null, 0.10, 0.07, 0.16, 0.06);
    playStep(784, 880, 0.10, 0.14, 0.18, 0.07);
  }

  playError() {
    if (!this.isEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.connect(ctx.destination);

    const playTone = (type: OscillatorType, startFreq: number, endFreq: number, gainVal: number, delay: number, decay: number, release: number) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + decay);

      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.linearRampToValueAtTime(gainVal * this.volume, t + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.001 + decay + release);

      osc.connect(gainNode);
      gainNode.connect(filter);

      osc.start(t);
      osc.stop(t + decay + release + 0.05);
    };

    playTone("sawtooth", 320, 140, 0.17, 0, 0.18, 0.05);
    playTone("square", 180, 90, 0.12, 0.03, 0.15, 0.04);
  }
}

export const sound = new SoundSystem();
