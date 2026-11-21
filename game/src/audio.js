// Tiny WebAudio sound effects, synthesized on the spot — no audio files, no
// network. The AudioContext is created lazily on the first user gesture so the
// browser's autoplay policy never blocks the page.
export class SoundFX {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  unlock() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.context = new AC();
    }
    if (this.context && this.context.state === 'suspended') void this.context.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // One oscillator blip: frequency slides from `from` to `to` over `seconds`.
  blip(from, to, seconds, type, gainValue, when = 0) {
    if (this.muted || !this.context) return;
    const t0 = this.context.currentTime + when;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + seconds);
    gain.gain.setValueAtTime(gainValue, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + seconds);
    osc.connect(gain).connect(this.context.destination);
    osc.start(t0);
    osc.stop(t0 + seconds + 0.02);
  }

  // A found difference: a bright two-note chime, rising with the combo.
  found(combo) {
    const base = 520 + Math.min(combo, 8) * 40;
    this.blip(base, base * 1.5, 0.16, 'sine', 0.16);
    this.blip(base * 1.5, base * 2, 0.22, 'sine', 0.12, 0.07);
  }

  // A wrong click: a low, dull buzz.
  wrong() {
    this.blip(160, 90, 0.22, 'sawtooth', 0.08);
  }

  // A hint spent: a soft wooden tick.
  hint() {
    this.blip(880, 660, 0.09, 'triangle', 0.1);
  }

  // A level cleared: a short rising arpeggio.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => this.blip(f, f, 0.28, 'sine', 0.14, i * 0.09));
  }

  // The clock running out: a sad descending pair.
  lose() {
    this.blip(392, 370, 0.3, 'triangle', 0.12);
    this.blip(370, 311, 0.45, 'triangle', 0.12, 0.25);
  }
}
