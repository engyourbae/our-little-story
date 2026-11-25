import type { ChapterDef, ChapterId } from './types';
import { placeholderPhoto } from '../utils/placeholders';
import { cleanText, safeColor, safeSrc } from '../utils/sanitize';

export interface PhotoItem { id: string; src: string; caption: string; date: string }
export interface GameConfig {
  title: string;
  tagline: string;
  sender: string;
  receiver: string;
  fullReceiver: string;
  specialDate: { label: string; time: string };
  openingMessages: string[];
  letter: { greeting: string[]; paragraphs: string[]; closing: string };
  secretLetter: { title: string; paragraphs: string[] };
  shortMessages: string[];
  photos: PhotoItem[];
  theme: { hijab: string; blouse: string; bottom: string; accent: string };
  miniGames: { memory: boolean; puzzle: boolean; hidden: boolean; hearts: boolean };
  musicUrl: string | null;
  chapterOverrides?: Partial<Record<ChapterId, Partial<ChapterDef>>>;
}

export const baseConfig: GameConfig = {
  title: 'OUR LITTLE STORY',
  tagline: 'A little world, made just for you.',
  sender: 'Aku',
  receiver: 'Inda',
  fullReceiver: 'Inda Satliah',
  specialDate: { label: 'SELASA, 1 SEPTEMBER 2026', time: '19:45' },
  openingMessages: [
    'Selamat datang di dunia kecil yang aku buat khusus untuk kamu.',
    'Aku ingin mengajak kamu jalan-jalan sebentar. Ada beberapa cerita yang ingin aku sampaikan. Sebenarnya bisa saja aku bilang langsung, tapi kali ini aku ingin menyampaikannya dengan cara yang sedikit berbeda.',
    'Jadi, jangan buru-buru ya. Nikmati perjalanannya.'
  ],
  letter: {
    greeting: ['Untuk Inda Satliah, orang yang aku sayang.', 'Hai, kamu!'],
    paragraphs: [
      'Aku nggak tahu kamu akan tersenyum, tertawa, atau malah sedikit terharu ketika membaca ini. Tapi satu hal yang pasti, aku membuat semuanya dengan penuh perasaan.',
      'Aku ingin kamu tahu bahwa aku masih orang yang sama yang menyayangimu. Mungkin caraku menunjukkan rasa sayang nggak selalu sama setiap waktu. Kadang aku bisa sangat ekspresif, kadang lebih diam, kadang juga mungkin nggak terlalu pandai mengungkapkan apa yang sebenarnya aku rasakan.',
      'Tapi tolong jangan samakan perubahan caraku dengan perubahan perasaanku.',
      'Aku masih sayang kamu, Inda. Aku masih mencintai kamu seorang.',
      'Aku suka kamu yang ceria, suara kamu yang lucu dan imut, sisi manja kamu yang bikin kangen, sampai tingkah jahilmu yang kadang bikin aku harus menerima cubitan dan gigitan. Hehe.',
      'Aku suka hal-hal kecil itu. Bahkan mungkin suatu hari nanti, hal-hal sederhana seperti itulah yang paling aku rindukan ketika kita sedang berjauhan.',
      'Aku yang dulunya cukup pemalu, introvert, dan nggak terlalu tahu banyak tentang dunia percintaan, sekarang punya seseorang yang begitu berarti dalam hidupku.',
      'Terima kasih sudah hadir dalam ceritaku.',
      'Aku nggak meminta hubungan kita selalu berjalan sempurna. Aku hanya ingin kita terus belajar memahami satu sama lain, saling percaya, saling jujur, dan tetap mau memperjuangkan hubungan ini bersama-sama.',
      'Kalau suatu hari aku kurang bisa menunjukkan rasa sayang, ingatkan aku. Aku juga akan berusaha lebih baik dalam memahami apa yang kamu butuhkan.',
      'Aku ingin menjadi seseorang yang bukan hanya mengatakan cinta, tetapi juga berusaha membuatmu merasakannya.',
      'Dan kalau kamu bertanya apakah aku masih memilih kamu?',
      'Jawabannya sederhana.',
      'IYA, KAMU.',
      'Masih kamu, Inda.',
      'Terima kasih sudah menjadi bagian paling berwarna dari cerita yang sedang aku jalani.',
      'Aku sayang kamu.'
    ],
    closing: 'Dengan sepenuh hati,\nAku.'
  },
  secretLetter: {
    title: 'Pesan di taman malam',
    paragraphs: [
      'Inda...',
      'Kalau setelah perjalanan kecil ini masih ada satu hal yang ingin kamu ingat, ingatlah ini.',
      'Aku masih sayang kamu.',
      'Aku masih mencintai kamu.',
      'Aku masih ingin berjalan bersama kamu.',
      'Dan aku ingin kita terus membuat cerita-cerita baru.'
    ]
  },
  // Pesan singkat dari bunga-bunga kecil di taman bunga (diambil dari cerita)
  shortMessages: [
    'Suaramu itu lucu, imut, dan entah kenapa gampang banget bikin kangen.',
    'Aku suka ketika kamu menunjukkan sisi manja kamu. Rasanya hangat dan menyenangkan.',
    'Banyak hal kecil darimu yang aku simpan baik-baik di ingatan.'
  ],
  photos: [0, 1, 2, 3].map((i) => ({ id: 'p' + i, src: placeholderPhoto(i), caption: 'Foto kenangan ' + (i + 1) + ' (ganti lewat Editor)', date: '' })),
  theme: { hijab: '#aebf99', blouse: '#fbf4ea', bottom: '#e6c9a8', accent: '#d9505f' },
  miniGames: { memory: true, puzzle: true, hidden: true, hearts: true },
  musicUrl: null
};

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);
const strArr = (v: unknown, max: number, fallback: string[]): string[] =>
  Array.isArray(v) ? v.filter((x) => typeof x === 'string').slice(0, 80).map((x) => cleanText(x, max)) : fallback;

// Menggabungkan override (dari Editor / config.json) ke konfigurasi dasar dengan validasi.
export function buildConfig(ov: unknown): GameConfig {
  const c: GameConfig = JSON.parse(JSON.stringify(baseConfig));
  if (!isObj(ov)) return c;
  c.sender = cleanText(ov.sender, 40) || c.sender;
  c.receiver = cleanText(ov.receiver, 40) || c.receiver;
  c.fullReceiver = cleanText(ov.fullReceiver, 80) || c.fullReceiver;
  if (isObj(ov.specialDate)) {
    c.specialDate.label = cleanText(ov.specialDate.label, 60) || c.specialDate.label;
    c.specialDate.time = cleanText(ov.specialDate.time, 10) || c.specialDate.time;
  }
  c.openingMessages = strArr(ov.openingMessages, 600, c.openingMessages);
  if (isObj(ov.letter)) {
    c.letter.greeting = strArr(ov.letter.greeting, 200, c.letter.greeting);
    c.letter.paragraphs = strArr(ov.letter.paragraphs, 1200, c.letter.paragraphs);
    c.letter.closing = cleanText(ov.letter.closing, 200) || c.letter.closing;
  }
  if (isObj(ov.secretLetter)) {
    c.secretLetter.title = cleanText(ov.secretLetter.title, 80) || c.secretLetter.title;
    c.secretLetter.paragraphs = strArr(ov.secretLetter.paragraphs, 1200, c.secretLetter.paragraphs);
  }
  c.shortMessages = strArr(ov.shortMessages, 400, c.shortMessages);
  if (Array.isArray(ov.photos)) {
    c.photos = ov.photos.filter(isObj).slice(0, 12).map((p, i) => ({
      id: 'p' + i,
      src: safeSrc(p.src) || placeholderPhoto(i),
      caption: cleanText(p.caption, 160),
      date: cleanText(p.date, 60)
    }));
    if (c.photos.length === 0) c.photos = baseConfig.photos;
  }
  if (isObj(ov.theme)) {
    c.theme.hijab = safeColor(ov.theme.hijab, c.theme.hijab);
    c.theme.blouse = safeColor(ov.theme.blouse, c.theme.blouse);
    c.theme.bottom = safeColor(ov.theme.bottom, c.theme.bottom);
    c.theme.accent = safeColor(ov.theme.accent, c.theme.accent);
  }
  if (isObj(ov.miniGames)) {
    (['memory', 'puzzle', 'hidden', 'hearts'] as const).forEach((k) => {
      const v = (ov.miniGames as Json)[k];
      if (typeof v === 'boolean') c.miniGames[k] = v;
    });
  }
  if (typeof ov.musicUrl === 'string' && ov.musicUrl) c.musicUrl = cleanText(ov.musicUrl, 300);
  if (isObj(ov.chapterOverrides)) c.chapterOverrides = ov.chapterOverrides as GameConfig['chapterOverrides'];
  return c;
}
