import type { MusicMood, Who } from '../config/types';

export type SfxName = 'click' | 'chime' | 'page' | 'door' | 'step' | 'win' | 'key' | 'heart' | 'pop' | 'open';
type Mood = MusicMood;
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const PAT = [0, 1, 2, 3, 2, 1, 3, 2];
const SONGS: Record<Exclude<Mood, 'off'>, { beat: number; chords: number[][]; vel: number; wave: OscillatorType; pad: boolean }> = {
  garden: { beat: 330, chords: [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]], vel: 0.12, wave: 'triangle', pad: false },
  soft: { beat: 520, chords: [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]], vel: 0.1, wave: 'sine', pad: true },
  romantic: { beat: 460, chords: [[53, 57, 60, 64], [52, 55, 59, 64], [50, 53, 57, 62], [55, 59, 62, 65]], vel: 0.11, wave: 'sine', pad: true },
  emotional: { beat: 600, chords: [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 66]], vel: 0.12, wave: 'triangle', pad: true }
};

// Audio sepenuhnya sintesis WebAudio (original, tanpa file) agar ringan dan bisa offline.
class AudioManager {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfxG!: GainNode;
  private noiseBuf: AudioBuffer | null = null;
  private timer: number | null = null;
  private step = 0;
  private mood: Mood = 'off';
  private want: Mood = 'off';
  private vol = { music: 0.6, sfx: 0.8 };
  private muted = false;
  private playing = true;
  private ext: HTMLAudioElement | null = null;
  private extUrl: string | null = null;
  private lastBlip = 0;
  private lastStep = 0;

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => {}); return; }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const c = new AC();
      this.ctx = c;
      this.master = c.createGain(); this.music = c.createGain(); this.sfxG = c.createGain();
      this.music.connect(this.master); this.sfxG.connect(this.master); this.master.connect(c.destination);
      const buf = c.createBuffer(1, c.sampleRate * 0.3, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) void this.ctx.suspend().catch(() => {}); else void this.ctx.resume().catch(() => {});
      });
      this.apply();
      this.setMood(this.want);
    } catch { this.ctx = null; }
  }
  configure(v: { music: number; sfx: number; muted: boolean; playing: boolean }) {
    this.vol = { music: v.music, sfx: v.sfx }; this.muted = v.muted; this.playing = v.playing; this.apply();
  }
  setExternal(url: string | null) {
    if (url === this.extUrl) return;
    this.extUrl = url;
    if (this.ext) { this.ext.pause(); this.ext = null; }
    if (!url) return;
    try {
      const a = new Audio(url); a.loop = true; a.onerror = () => { this.ext = null; this.extUrl = null; };
      this.ext = a; this.apply();
    } catch { this.ext = null; }
  }
  private apply() {
    if (this.ext) { this.ext.volume = Math.min(1, this.vol.music); this.ext.muted = this.muted || !this.playing; if (this.ctx && this.mood !== 'off') void this.ext.play().catch(() => { this.ext = null; }); }
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.muted ? 0 : 1, t, 0.05);
    this.music.gain.setTargetAtTime(this.playing && !this.ext ? this.vol.music * 0.9 : 0, t, 0.1);
    this.sfxG.gain.setTargetAtTime(this.vol.sfx, t, 0.05);
  }
  getMood() { return this.want; }
  setMood(m: Mood) {
    this.want = m;
    if (!this.ctx) return;
    this.mood = m; this.step = 0;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    if (this.ext) { if (m === 'off') this.ext.pause(); else void this.ext.play().catch(() => {}); }
    if (m === 'off') return;
    this.timer = window.setInterval(() => this.tick(), SONGS[m].beat);
  }
  private tone(freq: number, dur: number, type: OscillatorType, gain: number, dest: AudioNode, slideTo?: number, delay = 0) {
    if (!this.ctx) return;
    const c = this.ctx; const o = c.createOscillator(); const g = c.createGain();
    const t = c.currentTime + delay;
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  }
  private tick() {
    if (!this.ctx || this.mood === 'off' || this.ext || !this.playing) return;
    const s = SONGS[this.mood as Exclude<Mood, 'off'>];
    const i = this.step++;
    const chord = s.chords[Math.floor(i / 8) % 4];
    const n = chord[PAT[i % 8]] + (i % 8 === 3 || i % 8 === 7 ? 12 : 0);
    this.tone(midi(n), s.beat / 1000 * 3.2, s.wave, s.vel, this.music);
    if (i % 8 === 0) {
      this.tone(midi(chord[0] - 12), s.beat / 1000 * 6, 'sine', s.vel * 0.9, this.music);
      if (s.pad) chord.slice(0, 3).forEach((c) => this.tone(midi(c), s.beat / 1000 * 8, 'sine', 0.03, this.music));
    }
  }
  private noise(dur: number, gain: number, freq: number) {
    if (!this.ctx || !this.noiseBuf) return;
    const c = this.ctx; const src = c.createBufferSource(); const f = c.createBiquadFilter(); const g = c.createGain();
    src.buffer = this.noiseBuf; f.type = 'bandpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(gain, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    src.connect(f); f.connect(g); g.connect(this.sfxG); src.start(); src.stop(c.currentTime + dur + 0.02);
  }
  sfx(name: SfxName) {
    if (!this.ctx) return;
    const d = this.sfxG;
    switch (name) {
      case 'click': this.tone(520, 0.07, 'square', 0.08, d); break;
      case 'pop': this.tone(300, 0.1, 'sine', 0.2, d, 600); break;
      case 'chime': this.tone(880, 0.5, 'sine', 0.18, d); this.tone(1318, 0.6, 'sine', 0.14, d, undefined, 0.09); break;
      case 'page': this.noise(0.18, 0.25, 2400); break;
      case 'open': this.noise(0.25, 0.3, 1800); this.tone(660, 0.3, 'sine', 0.1, d, undefined, 0.1); break;
      case 'door': this.tone(120, 0.25, 'sawtooth', 0.12, d, 60); this.noise(0.15, 0.2, 500); break;
      case 'step': if (performance.now() - this.lastStep > 260) { this.lastStep = performance.now(); this.noise(0.05, 0.12, 900); } break;
      case 'key': [1568, 2093, 2637].forEach((f, i) => this.tone(f, 0.4, 'triangle', 0.14, d, undefined, i * 0.08)); break;
      case 'heart': [660, 880, 1100].forEach((f, i) => this.tone(f, 0.35, 'sine', 0.16, d, undefined, i * 0.07)); break;
      case 'win': [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.5, 'triangle', 0.16, d, undefined, i * 0.12)); break;
    }
  }
  blip(who: Who) {
    if (!this.ctx) return;
    const now = performance.now();
    if (now - this.lastBlip < 55) return;
    this.lastBlip = now;
    this.tone(who === 'boy' ? 330 + Math.random() * 40 : 520 + Math.random() * 60, 0.04, 'square', 0.035, this.sfxG);
  }
}
export const audio = new AudioManager();
