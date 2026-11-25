# OUR LITTLE STORY — A world made for Inda

Game kejutan romantis berbasis web: dunia 3D diorama (React + TypeScript + Three.js/React Three Fiber), karakter chibi 3D, UI retro pixel, 8 bab cerita + adegan akhir, 4 mini-game, surat digital, galeri, PWA (bisa diinstal & offline).

> Status jujur: kode ini ditulis tanpa bisa menjalankan `npm install`/`build` (lingkungan penulis tidak punya internet).
> Pemeriksaan sintaks dilakukan, tetapi **TypeScript check penuh dan build belum dijalankan**.
> Jalankan langkah "Cek sebelum deploy" di bawah dan perbaiki bila ada error kecil.

## Jalankan di komputer
```bash
npm install
npm run typecheck     # cek TypeScript
npm run dev           # buka http://localhost:5173
npm run build         # hasil di folder dist
npm run preview       # uji hasil build
```

## Cek sebelum deploy (wajib)
1. `npm run typecheck` -> harus tanpa error.
2. `npm run build` -> harus sukses.
3. `npm run preview`, mainkan dari New Game sampai adegan akhir di HP (Chrome Android / Safari iPhone).
4. Uji offline: buka sekali, matikan internet, buka lagi.

## Unggah ke GitHub & aktifkan GitHub Pages
1. Buat repository baru di GitHub (mis. `our-little-story`), lalu:
   ```bash
   git init && git add . && git commit -m "Our Little Story"
   git branch -M main
   git remote add origin https://github.com/<username>/our-little-story.git
   git push -u origin main
   ```
2. Di repository: **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` berjalan otomatis (tab **Actions**). Base path diisi otomatis `/<nama-repo>/`.
4. URL: `https://<username>.github.io/<nama-repo>/` — buka di Chrome Android -> menu -> *Install app* / di iPhone Safari -> Bagikan -> *Tambah ke Layar Utama*.

Jangan anggap berhasil sebelum URL itu benar-benar dibuka dan diuji.

## Mengganti isi cerita, foto, nama (tanpa mengubah kode)
- Buka `https://.../?editor=1` -> menu utama -> **Editor (lokal)**. Perubahan tersimpan hanya di browser itu.
- Agar berlaku untuk semua pengunjung: di Editor tekan **Ekspor JSON**, simpan file sebagai `public/config.json`, commit & push.
- Foto: unggah JPG/PNG/WEBP maks 1,5 MB (divalidasi). Keterangan & tanggal bisa diisi.
- Teks bab/dialog bisa diubah lewat `chapterOverrides` di JSON, atau langsung di `src/config/story.ts` dan `src/config/gameConfig.ts`.

## Mengganti model karakter (placeholder -> final)
Karakter Inda (hijab, chibi) dan karakter laki-laki saat ini **model 3D procedural (placeholder yang konsisten)**, bukan aset final.
Letakkan model `.glb` buatan sendiri di `public/models/` lalu isi `MODELS` di `src/config/characters.ts`
(mis. `inda: 'models/inda.glb'`). Jika file gagal dimuat, game otomatis kembali ke model procedural.
Aset eksternal: cek lisensi (CC0: Kenney, Quaternius, Poly Pizza) dan catat sumbernya di bawah.

### Sumber aset pihak ketiga
Belum ada. Semua geometri, musik, dan efek suara dibuat langsung oleh kode (original).

## Struktur
```
src/app (App, Game)         src/scenes (Garden/House/SecretRoom + kamera & pemain)
src/components (Character, Dialogue, InteractiveObject, UI, Animations)
src/games (MemoryMatch, PhotoPuzzle, HeartCollection, HiddenObject)
src/systems (Audio, Dialogue, Mission, Interaction, Scene, Chapter, Progress, Save)
src/config (gameConfig, story, characters, world)   src/store (zustand)
```
Catatan: Asset/Settings/Configuration Manager digabung ke `config/*` dan `store`.

## Alur game
Menu -> Invitation (Bab 0) -> Taman: bangku (Bab 1) -> taman bunga (Bab 2) -> kunci di lapak buah -> rumah (Bab 3: bantal, boneka, hati, kotak musik) -> lengkungan bunga (Bab 4) -> pohon berlampu (Bab 5) -> jam & kalender (Bab 6) -> arcade: Benda Tersembunyi -> pintu rahasia di rumah (Bab 7 + surat) -> taman malam (Final).
Mini-game lain (Memory Match, Photo Puzzle, Heart Collection) ada di mesin arcade. Progres tersimpan otomatis.

## Font pixel
UI memakai font monospace sistem agar bisa offline tanpa unduhan. Untuk font pixel asli, bundel file `.woff2` (lisensi OFL) lalu tambahkan `@font-face` di `src/styles/global.css`.
