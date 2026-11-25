export function cleanText(v: unknown, max = 2000): string {
  if (typeof v !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
}
// Hanya izinkan gambar data: (png/jpeg/webp/gif/svg) atau path relatif tanpa skema.
export function safeSrc(v: unknown): string {
  if (typeof v !== 'string') return '';
  const s = v.trim();
  if (/^data:image\/(png|jpe?g|webp|gif|svg\+xml)[;,]/i.test(s)) return s;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return '';
  if (s.startsWith('//')) return '';
  return s;
}
export function safeColor(v: unknown, fallback: string): string {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}
