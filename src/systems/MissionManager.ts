import type { SaveData, SceneId } from '../config/types';

export interface Mission { title: string; hint: string; target: string | null; cam: string; progress?: string }
const HOUSE_ORDER = ['cushion', 'doll', 'heartObj', 'musicbox'];
const HOUSE_KEY: Record<string, string> = { cushion: 'cushion', doll: 'doll', heartObj: 'heart', musicbox: 'music' };
export const houseKey = (id: string) => HOUSE_KEY[id];
export const houseIds = HOUSE_ORDER;

export function currentMission(save: SaveData, scene: SceneId): Mission | null {
  const c = save.chapters;
  if (!c.c1) return { title: 'Duduk di bangku taman', hint: 'Ada seseorang yang duduk sendirian di bangku. Ketuk bangku itu.', target: 'bench', cam: 'bench' };
  if (!c.c2) return { title: 'Jalan ke taman bunga', hint: 'Ketuk papan dan bunga besar di taman bunga, kiri depan.', target: 'meadow', cam: 'meadow' };
  if (!save.hasKey) return { title: 'Cari kunci rumah', hint: 'Pintu rumah terkunci. Coba periksa peti kayu di lapak buah.', target: 'stall', cam: 'stall' };
  if (!c.c3) {
    const left = HOUSE_ORDER.filter((id) => !save.c3seen.includes(HOUSE_KEY[id]));
    const prog = `${HOUSE_ORDER.length - left.length}/${HOUSE_ORDER.length}`;
    if (scene === 'house') return { title: 'Sentuh benda-benda kecil', hint: 'Bantal, boneka, hati kecil, dan kotak musik menyimpan cerita.', target: left[0] ?? null, cam: 'house', progress: prog };
    return { title: 'Masuk ke rumah kecil', hint: 'Kuncinya sudah ada. Ketuk pintu rumah.', target: 'door', cam: 'door', progress: prog };
  }
  if (!c.c4) return { title: 'Ke lengkungan bunga', hint: 'Ada lengkungan bunga di atas jalan setapak.', target: 'arch', cam: 'arch' };
  if (!c.c5) return { title: 'Duduk di bawah pohon berlampu', hint: 'Pohon besar di kiri belakang punya lampu-lampu kecil.', target: 'tree', cam: 'tree' };
  if (!c.c6) return { title: 'Lihat jam taman', hint: 'Ketuk jam di tiang, dekat papan kalender.', target: 'clock', cam: 'clock' };
  if (!save.hiddenDone) return { title: 'Main arcade: Benda Tersembunyi', hint: 'Ketuk mesin arcade lalu pilih Benda Tersembunyi.', target: 'arcade', cam: 'arcade' };
  if (!c.c7) return { title: 'Ada yang berubah di rumah', hint: scene === 'house' ? 'Cari pintu yang bercahaya di dinding.' : 'Masuk lagi ke rumah. Ada pintu baru.', target: scene === 'house' ? 'secretDoor' : 'door', cam: scene === 'house' ? 'house' : 'door' };
  return null;
}
