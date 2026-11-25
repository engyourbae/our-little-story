import type { ExprId } from './types';

export interface ExprDef {
  arc: boolean; // mata tertutup melengkung
  es: number; // skala tinggi mata
  smile: number; // -1 cemberut .. 1 senyum lebar
  open: number; // mulut terbuka 0..1
  blush: number;
  brow: number; // >0 sedih, <0 kesal
  tilt: number; // kemiringan kepala
}

export const EXPR: Record<ExprId, ExprDef> = {
  senang: { arc: false, es: 1, smile: 0.8, open: 0, blush: 0.35, brow: 0, tilt: 0 },
  tertawa: { arc: true, es: 1, smile: 1, open: 0.9, blush: 0.55, brow: 0, tilt: 0.1 },
  malu: { arc: false, es: 0.65, smile: 0.3, open: 0, blush: 1, brow: 0.15, tilt: 0.25 },
  cemberut: { arc: false, es: 0.9, smile: -0.7, open: 0, blush: 0.15, brow: -0.4, tilt: -0.05 },
  terkejut: { arc: false, es: 1.4, smile: 0, open: 0.8, blush: 0.2, brow: 0.35, tilt: 0 },
  manja: { arc: false, es: 1.15, smile: -0.35, open: 0, blush: 0.75, brow: 0.2, tilt: 0.3 },
  jahil: { arc: false, es: 0.75, smile: 0.55, open: 0.15, blush: 0.3, brow: -0.15, tilt: -0.2 },
  sedih: { arc: false, es: 0.8, smile: -0.55, open: 0, blush: 0, brow: 0.4, tilt: 0.1 },
  lembut: { arc: true, es: 1, smile: 0.5, open: 0, blush: 0.5, brow: 0, tilt: 0.05 }
};

// Warna karakter. Warna hijab/blus Inda dapat diubah lewat config.theme.
export const CHARACTERS = {
  inda: { name: 'Inda', skin: '#ffdcc2', eye: '#4a2f27', shoe: '#8a4b3a' },
  boy: { name: 'Aku', skin: '#f3c9a5', hair: '#3b2c2a', jacket: '#e5786a', inner: '#2d3340', bottom: '#f1ece4', shoe: '#ffffff', eye: '#2d1f1b' }
};

// Ganti dengan file .glb buatan sendiri (taruh di public/models) untuk menukar model procedural.
// Contoh: inda: 'models/inda.glb'. Jika gagal dimuat, game otomatis memakai model procedural.
export const MODELS: { inda: string | null; boy: string | null } = { inda: null, boy: null };
