import type { SaveData, SceneId, Settings } from '../config/types';

const KEY = 'our-little-story.save.v1';
let memory: string | null = null;

function detectQuality(): Settings['quality'] {
  try {
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency || 4;
    if ((mem && mem <= 2) || cores <= 3) return 'low';
    if (window.innerWidth < 820 || cores <= 6) return 'medium';
  } catch { /* abaikan */ }
  return 'high';
}
export function defaultSettings(): Settings {
  return { music: 0.6, sfx: 0.8, muted: false, playing: true, quality: detectQuality(), textSpeed: 'normal' };
}
export function defaultSave(): SaveData {
  return { v: 1, started: false, chapters: {}, c3seen: [], hasKey: false, hiddenDone: false, hearts: [], mini: {}, lastScene: 'garden', letterRead: false, notes: [], settings: defaultSettings() };
}
export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(KEY) ?? memory;
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o || o.v !== 1) return null;
    const d = defaultSave();
    const ok: SceneId[] = ['garden', 'house', 'secret', 'final'];
    return { ...d, ...o, settings: { ...d.settings, ...(o.settings || {}) }, lastScene: ok.includes(o.lastScene) ? o.lastScene : 'garden' };
  } catch { return null; }
}
export function writeSave(s: SaveData): void {
  const raw = JSON.stringify(s);
  memory = raw;
  try { localStorage.setItem(KEY, raw); } catch { /* penyimpanan penuh / diblokir: tetap jalan di memori */ }
}
export function clearSave(): void {
  memory = null;
  try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
}
