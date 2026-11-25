export type V3 = [number, number, number];

export const SPAWN: Record<string, [number, number]> = {
  garden: [0, 7.6], house: [-3.4, 2.6], secret: [1.6, 2.2], final: [0.6, 2.4], invitation: [0, 7.6], menu: [0, 7.6]
};
const GB = { x: [-10.8, 10.8] as [number, number], z: [-8.4, 9.0] as [number, number] };
export const BOUNDS: Record<string, { x: [number, number]; z: [number, number] }> = {
  garden: GB, final: GB, invitation: GB, menu: GB,
  house: { x: [-4.3, 4.6], z: [-2.9, 3.6] },
  secret: { x: [-3.1, 3.3], z: [-2.3, 3.1] }
};
// [x1, z1, x2, z2]
const GO = [[-4.3, -9, 4.3, -3.3], [5.6, -7.8, 11, -2.4], [5.1, 0.6, 7.9, 1.9], [8.4, 4.3, 9.4, 5.3], [-9.2, -3.7, -7.8, -2.3]];
export const OBSTACLES: Record<string, number[][]> = {
  garden: GO, final: GO, invitation: [], menu: [],
  house: [[-1.6, -0.6, 1.2, 0.8]],
  secret: [[-1.0, -1.2, 1.0, 0.3]]
};

// Titik tempat Inda berjalan sebelum interaksi dijalankan
export const APPROACH: Record<string, [number, number]> = {
  bench: [-4.6, 3.2], signpost: [3.2, 6.4], meadow: [-5.2, 6.6], stall: [6.5, 3.4], door: [0, -2.2], arcade: [7.0, 6.0],
  arch: [0, 4.2], tree: [-6.8, -1.0], clock: [3.4, 1.2], cal: [5.4, 1.2],
  note0: [-7.4, 6.0], note1: [-5.2, 8.4], note2: [-9.0, 5.0],
  cushion: [-3.0, 0.9], doll: [1.8, 2.0], heartObj: [-0.6, 1.4], musicbox: [0.3, 1.4], laptop: [3.4, -2.2],
  photoFrame: [-0.3, -2.5], bookshelf: [2.0, -2.2], secretDoor: [-3.6, -2.6], exitDoor: [-3.6, 3.0],
  envelope: [0, 0.9], photosWall: [0.6, -1.8], secretExit: [-2.3, 2.6]
};

export const HIDDEN_SPOTS: { p: V3; hint: string }[] = [
  { p: [-11, 3.4, 4], hint: 'tinggi di antara daun pohon merah' },
  { p: [-2.4, 0.35, -3.3], hint: 'di balik semak dekat rumah' },
  { p: [1.0, 0.45, -2.9], hint: 'di anak tangga depan pintu' },
  { p: [7.8, 0.3, -2.6], hint: 'di tepi kolam' },
  { p: [-7.4, 0.4, 3.2], hint: 'di samping bangku taman' },
  { p: [6.5, 2.6, 1.0], hint: 'di atas atap lapak buah' },
  { p: [-9.4, 0.4, -1.6], hint: 'di bawah pohon berlampu' },
  { p: [10.0, 0.35, 6.6], hint: 'di dekat mesin arcade' },
  { p: [-3.0, 1.0, 8.9], hint: 'di atas pagar depan' },
  { p: [5.4, 0.35, -0.2], hint: 'di dekat tiang jam' }
];

export const CAMS: Record<string, { t: V3; d: number; follow?: boolean; orbit?: boolean }> = {
  overview: { t: [0, 0, 1], d: 22, follow: true },
  bench: { t: [-6, 0.6, 2.4], d: 13 },
  meadow: { t: [-6, 0.3, 6.4], d: 14 },
  stall: { t: [6.5, 0.8, 2.5], d: 12 },
  door: { t: [0, 1.5, -3], d: 15 },
  arcade: { t: [8.5, 1, 5], d: 13 },
  arch: { t: [0, 1, 2.6], d: 13 },
  tree: { t: [-7.4, 1.5, -1.8], d: 13 },
  clock: { t: [4, 1.2, 0.4], d: 12.5 },
  house: { t: [0, 0.9, 0], d: 15 },
  secret: { t: [0, 0.8, 0], d: 11.5 },
  invite: { t: [0, 1.5, -1], d: 30, orbit: true },
  final: { t: [0, 1.4, 1.8], d: 19, orbit: true }
};
