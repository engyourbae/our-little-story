import type { ChapterDef, ChapterId, DialogueLine, ExprId } from './types';
import type { GameConfig } from './gameConfig';

const B = (text: string, boy: ExprId = 'senang', inda: ExprId = 'lembut', extra: Partial<DialogueLine> = {}): DialogueLine => ({ who: 'boy', text, boy, inda, ...extra });

const c3 = {
  cushion: [B('Aku suka waktu kamu manja. Kadang tingkahmu sederhana saja, tapi bisa bikin aku senyum sendiri.', 'senang', 'manja')],
  doll: [B('Kadang kamu juga suka iseng. Ada saja tingkahmu yang bikin aku geleng-geleng kepala.', 'jahil', 'jahil')],
  heart: [
    B('Terus ada satu hal yang nggak bisa dilupakan...', 'lembut', 'terkejut'),
    B('Cubitan dan gigitanmu.', 'jahil', 'jahil'),
    B('HAHAHA. Kadang aku dicubit, digigit, dan dijahilin. Sebenarnya ini pacaran atau latihan ketahanan fisik, sih?', 'tertawa', 'tertawa'),
    B('Tapi anehnya, aku malah suka.', 'malu', 'malu'),
    B('Karena dari hal-hal kecil seperti itu, aku merasa dekat denganmu. Rasanya seperti ada cara unik darimu untuk menunjukkan kasih sayang.', 'lembut', 'lembut')
  ],
  music: [
    B('Kalau suara manja kamu mulai keluar, rasanya suasana langsung berubah.', 'lembut', 'manja'),
    B('Kadang hal-hal sederhana seperti ini justru yang paling gampang bikin aku kangen.', 'malu', 'malu')
  ],
  end: [B('Inda, mungkin kamu nggak sadar, tapi banyak hal kecil darimu yang aku simpan baik-baik di ingatan.', 'lembut', 'malu')]
};

const c5 = [
  'Inda, sekarang aku ingin menyampaikan sesuatu yang benar-benar penting.',
  'Aku tahu terkadang caraku menunjukkan rasa sayang bisa berubah-ubah.',
  'Ada saatnya aku sangat perhatian, ada saatnya aku mungkin lebih diam, ada kalanya aku menunjukkan kasih sayang dengan cara yang berbeda.',
  'Tapi aku ingin kamu tahu satu hal.',
  'PERASAANKU KE KAMU MASIH SAMA DALAM HAL YANG PALING PENTING.',
  'Aku masih sayang kamu.',
  'Aku masih mencintai kamu.',
  'Dan aku masih memilih kamu, seorang.',
  'Perubahan caraku bersikap bukan berarti aku berhenti mencintai kamu.',
  'Aku nggak mau kamu harus menebak-nebak apakah aku masih sayang atau tidak.',
  'Aku ingin kamu tahu jawabannya secara langsung: IYA, AKU MASIH SANGAT SAYANG SAMA KAMU.',
  'Kalau ada waktunya aku terlihat berbeda, bukan berarti kamu sudah nggak penting buatku.',
  'Aku juga masih belajar. Belajar memahami kamu, belajar menyampaikan perasaanku dengan lebih baik, dan belajar menjadi pasangan yang lebih baik.',
  'Aku nggak bisa menjanjikan kalau kita nggak akan pernah punya masalah. Tapi aku ingin kita bisa membicarakannya, saling mendengarkan, dan nggak mudah menyerah hanya karena ada sesuatu yang belum kita pahami.',
  'Aku ingin kamu merasa aman untuk menjadi dirimu sendiri saat bersamaku.',
  'Jadi, jangan merasa harus selalu menebak isi hatiku, ya. Kalau ada yang kamu ragukan, tanyakan. Aku ingin menjelaskannya, bukan membiarkan kamu sendirian dengan pikiranmu.'
].map((t, i) => B(t, 'lembut', 'lembut', { hold: 800, mood: i === 0 ? 'soft' : undefined }));

export const CHAPTERS: Record<ChapterId, ChapterDef> = {
  c0: { id: 'c0', title: 'THE INVITATION', subtitle: 'Sebuah amplop untuk kamu', scene: 'invitation', lines: [], stage: { cam: 'invite' } },
  c1: {
    id: 'c1', title: 'THE BOY BEHIND THE STORY', subtitle: 'Kenalan dulu sama aku', scene: 'garden', stage: { cam: 'bench', boy: { x: -6, z: 2, y: 0.12, pose: 'sit', visible: true }, inda: { x: -4.4, z: 3.4 }, mood: 'garden' },
    lines: [
      B('Kenalin, ini aku.', 'malu', 'lembut'),
      B('Kalau dilihat sekarang mungkin biasa saja, tapi sebenarnya aku ini orang yang cukup pemalu.', 'malu', 'lembut'),
      B('Aku juga termasuk introvert. Bukan berarti nggak suka orang lain, cuma kadang lebih nyaman diam, memperhatikan, dan menyimpan banyak hal di kepala.', 'lembut', 'lembut'),
      B('Kalau soal percintaan? Wah, jangan tanya.', 'jahil', 'jahil'),
      B('Pengalamanku nggak banyak. Bahkan kalau dibuat daftar, mungkin daftar gagalnya lebih panjang. Hahaha.', 'tertawa', 'tertawa'),
      B('Aku dari kecil sudah diajarkan untuk mandiri. Terbiasa mengurus banyak hal sendiri.', 'lembut', 'lembut'),
      B('Kadang aku juga cengeng, lho. Iya, jangan ketawa dulu.', 'malu', 'jahil'),
      B('Walaupun kelihatannya bisa menghadapi banyak hal sendiri, sebenarnya ada saat-saat ketika aku juga merasa kesepian.', 'sedih', 'lembut'),
      B('Aneh memang. Teman banyak, tapi terkadang tetap merasa sendiri.', 'sedih', 'sedih'),
      B('Begitulah aku sebelum cerita ini dimulai.', 'lembut', 'lembut'),
      {
        who: 'boy', text: 'Sentuh bangkunya, atau tanya sesuatu.', boy: 'lembut', inda: 'lembut',
        choices: [{ label: 'Kenapa duduk sendirian?', reply: [B('Kadang aku cuma suka menikmati suasana. Tapi ternyata, ada seseorang yang kemudian membuat suasana itu terasa jauh lebih menyenangkan.', 'malu', 'malu')] }]
      }
    ]
  },
  c2: {
    id: 'c2', title: 'WHEN I MET YOU', subtitle: 'Hari ketika aku bertemu kamu', scene: 'garden', stage: { cam: 'meadow', boy: { x: -7.2, z: 6.2, pose: 'stand', visible: true }, inda: { x: -5.4, z: 7 }, bloom: 1, mood: 'garden' },
    lines: [
      B('Terus, suatu hari aku bertemu seseorang.', 'senang', 'lembut', { fx: ['bloom'] }),
      B('Namanya Inda.', 'senang', 'malu'),
      B('Hal pertama yang cukup membekas dari kamu adalah kesan ceria dan bahagia yang kamu bawa.', 'lembut', 'senang'),
      B('Entah kenapa, ada sesuatu dari dirimu yang membuat suasana terasa berbeda.', 'lembut', 'malu'),
      B('Dan satu hal lagi...', 'jahil', 'terkejut'),
      B('SUARAMU!', 'tertawa', 'terkejut', { fx: ['hopInda'] }),
      B('HAHAHA.', 'tertawa', 'jahil'),
      B('Suaramu itu lucu, imut, dan entah kenapa gampang banget bikin kangen.', 'senang', 'malu'),
      B('Kadang aku sampai kepikiran, kok bisa ya ada orang yang suaranya seperti itu?', 'jahil', 'cemberut'),
      B('Apalagi kalau kamu mulai manja. Aduh, itu salah satu hal yang paling aku suka.', 'senang', 'manja'),
      B('Jujur, aku suka ketika kamu menunjukkan sisi manja kamu. Rasanya ada sesuatu yang hangat dan menyenangkan.', 'lembut', 'manja'),
      B('Sejak kamu hadir, hidupku yang sebelumnya terasa biasa-biasa saja jadi sedikit berwarna.', 'lembut', 'lembut'),
      B('Eh, bukan sedikit deng. Sangat berwarna.', 'tertawa', 'senang', { fx: ['waveInda'] })
    ]
  },
  c3: {
    id: 'c3', title: 'LITTLE THINGS I LOVE', subtitle: 'Hal-hal kecil yang aku suka', scene: 'house', stage: { cam: 'house', boy: { x: 1.4, z: 2.0, pose: 'stand', visible: true } },
    lines: [...c3.cushion, ...c3.doll, ...c3.heart, ...c3.music, ...c3.end], parts: c3
  },
  c4: {
    id: 'c4', title: 'A LITTLE COLOR IN MY LIFE', subtitle: 'Warna baru di hidupku', scene: 'garden', stage: { cam: 'arch', boy: { x: -0.9, z: 2.7, pose: 'stand', visible: true }, inda: { x: 0.9, z: 2.7 }, bloom: 1, mood: 'garden' },
    lines: [
      B('Dulu aku terbiasa menjalani banyak hal sendiri.', 'lembut', 'lembut'),
      B('Bukan berarti hidupku nggak punya warna. Aku punya teman, punya kesibukan, dan punya banyak cerita.', 'senang', 'lembut'),
      B('Tapi semenjak mengenal kamu, ada warna baru yang hadir.', 'senang', 'senang'),
      B('Ada seseorang yang bisa aku rindukan.', 'lembut', 'malu'),
      B('Ada suara yang ingin aku dengar.', 'lembut', 'senang'),
      B('Ada tingkah manja yang kadang bikin gemas.', 'jahil', 'manja'),
      B('Ada seseorang yang bisa membuatku tersenyum hanya karena mengingat hal-hal kecil.', 'senang', 'malu'),
      B('Dan orang itu adalah kamu, Inda.', 'malu', 'malu'),
      B('Terima kasih sudah hadir dan menjadi bagian dari ceritaku.', 'lembut', 'senang', { fx: ['waveInda'] })
    ]
  },
  c5: {
    id: 'c5', title: 'LET ME REASSURE YOU', subtitle: 'Biar aku tenangkan kamu', scene: 'garden',
    stage: { cam: 'tree', boy: { x: -7.5, z: -1.3, y: -0.22, pose: 'sit', visible: true }, inda: { x: -6.5, z: -1.1, y: -0.22, pose: 'sit' }, glow: 1, mood: 'soft' },
    lines: c5
  },
  c6: {
    id: 'c6', title: 'OUR LITTLE BEGINNING', subtitle: 'Awal cerita kita', scene: 'garden', stage: { cam: 'clock', boy: { x: 3.0, z: 1.0, pose: 'stand', visible: true }, inda: { x: 4.3, z: 1.0 }, mood: 'soft' },
    lines: [
      B('Eh, kamu ingat tanggal ini?', 'senang', 'lembut'),
      B('Selasa, 1 September 2026.', 'lembut', 'senang'),
      B('Pukul 19:45.', 'lembut', 'malu'),
      B('Ini bukan angka asal-asalan, lho. Ini salah satu waktu yang akan selalu punya tempat tersendiri dalam ceritaku.', 'malu', 'malu'),
      B('Di waktu itulah kita memulai hubungan ini.', 'lembut', 'senang'),
      B('Kalau dipikir-pikir, lucu juga ya. Dari dua orang yang punya kehidupan masing-masing, akhirnya memutuskan untuk menjalani sebuah cerita bersama.', 'senang', 'senang'),
      B('Aku mungkin nggak selalu pandai menunjukkan semuanya, tapi aku nggak pernah menganggap hubungan ini sebagai sesuatu yang sepele.', 'lembut', 'lembut'),
      B('Aku ingin kita terus punya cerita baru.', 'senang', 'senang'),
      B('Bukan harus selalu cerita yang besar. Hal sederhana pun nggak masalah.', 'lembut', 'lembut'),
      B('Yang penting kita sama-sama mau menjaganya.', 'lembut', 'senang')
    ]
  },
  c7: {
    id: 'c7', title: 'THE LETTER I MADE FOR YOU', subtitle: 'Surat yang aku buat untukmu', scene: 'secret', stage: { cam: 'secret', boy: { x: -1.2, z: 0.6, pose: 'stand', visible: true }, inda: { x: 1.2, z: 1.8 }, mood: 'romantic' },
    lines: [
      B('Sebentar, ada satu hal lagi.', 'malu', 'terkejut'),
      B('Surat ini sedikit berbeda.', 'lembut', 'lembut'),
      B('Aku benar-benar menyiapkan dunia kecil ini dengan matang.', 'senang', 'lembut'),
      B('Aku memikirkan konsepnya, menyusun ceritanya, memikirkan bagaimana caranya supaya kamu bisa menikmati setiap bagian.', 'lembut', 'senang'),
      B('Aku bahkan sampai begadang mengerjakannya.', 'malu', 'senang'),
      B('Bukan karena terpaksa atau karena ingin terlihat hebat.', 'lembut', 'lembut'),
      B('Aku mengerjakannya dengan hati yang bahagia, penuh semangat, dan tentu saja sambil membayangkan wajah kamu.', 'senang', 'malu'),
      B('Kadang saat sedang mengerjakannya, aku malah tersenyum sendiri.', 'malu', 'senang'),
      B('Bayangin saja, aku sedang sibuk menyusun sesuatu, tapi yang ada di pikiranku justru kamu.', 'jahil', 'malu'),
      B('Semoga ketika kamu memainkan game kecil ini, kamu bisa merasakan sedikit dari kebahagiaan yang aku rasakan saat membuatnya.', 'lembut', 'lembut', { mood: 'romantic' })
    ]
  },
  final: {
    id: 'final', title: 'JUST YOU AND ME', subtitle: 'Taman malam kita', scene: 'final', stage: { cam: 'final', boy: { x: -0.6, z: 2.4, pose: 'stand', visible: true }, inda: { x: 0.6, z: 2.4 }, mood: 'romantic' },
    lines: [
      B('Inda...', 'lembut', 'lembut', { hold: 900 }),
      B('Kalau setelah perjalanan kecil ini masih ada satu hal yang ingin kamu ingat, ingatlah ini.', 'lembut', 'lembut', { hold: 700 }),
      B('Aku masih sayang kamu.', 'lembut', 'malu', { hold: 900 }),
      B('Aku masih mencintai kamu.', 'lembut', 'malu', { hold: 900 }),
      B('Aku masih ingin berjalan bersama kamu.', 'senang', 'senang', { hold: 900 }),
      B('Dan aku ingin kita terus membuat cerita-cerita baru.', 'senang', 'senang', { hold: 900 })
    ]
  }
};

export const CHAPTER_ORDER: ChapterId[] = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'final'];

// Mengambil bab dengan override opsional dari config (hanya baris dialog & judul yang valid).
export function getChapter(id: ChapterId, cfg?: GameConfig): ChapterDef {
  const base = CHAPTERS[id];
  const ov = cfg?.chapterOverrides?.[id];
  if (!ov) return base;
  const ok = (l: unknown): l is DialogueLine => !!l && typeof l === 'object' && typeof (l as DialogueLine).text === 'string' && ['boy', 'inda', 'narrator'].includes((l as DialogueLine).who);
  const lines = Array.isArray(ov.lines) && ov.lines.every(ok) ? ov.lines.slice(0, 120).map((l) => ({ ...l, text: l.text.slice(0, 800) })) : base.lines;
  return { ...base, title: typeof ov.title === 'string' ? ov.title.slice(0, 60) : base.title, lines: id === 'c3' ? base.lines : lines, parts: base.parts };
}
