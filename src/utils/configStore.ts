const KEY = 'our-little-story.overrides.v1';
let mem: unknown = null;

export function loadOverrides(): unknown {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* abaikan */ }
  return mem;
}
export function saveOverrides(o: unknown): boolean {
  mem = o;
  try { localStorage.setItem(KEY, JSON.stringify(o)); return true; } catch { return false; }
}
export function clearOverrides(): void {
  mem = null;
  try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
}
// config.json opsional di folder public (hasil Ekspor dari Editor) -> berlaku untuk semua pengunjung.
export async function loadRemoteConfig(): Promise<unknown> {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'config.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    const type = res.headers.get('content-type') || '';
    if (!type.includes('json')) return null;
    return await res.json();
  } catch { return null; }
}
