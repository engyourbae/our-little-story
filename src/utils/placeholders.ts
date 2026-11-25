const PAL = [['#f6c1c9', '#f9e3d0'], ['#b9d8f0', '#e6f2d9'], ['#d9c6f0', '#fbe5ee'], ['#f7e0a8', '#f3b9a1']];
const HEART = ['..XX...XX..', '.XXXX.XXXX.', 'XXXXXXXXXXX', 'XXXXXXXXXXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..XXXXXXX..', '...XXXXX...', '....XXX....', '.....X.....'];

// Foto placeholder (bukan foto asli). Ganti lewat Editor atau public/config.json.
export function placeholderPhoto(i: number, label = 'Ganti dengan foto kalian'): string {
  const [a, b] = PAL[i % PAL.length];
  let rects = '';
  HEART.forEach((row, y) => [...row].forEach((c, x) => { if (c === 'X') rects += `<rect x='${146 + x * 28}' y='${120 + y * 28}' width='28' height='28'/>`; }));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><g fill='#d9505f' shape-rendering='crispEdges'>${rects}</g><text x='300' y='500' text-anchor='middle' font-family='monospace' font-size='28' fill='#5b3a2e'>${label}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
