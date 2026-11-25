import { useRef, useState } from 'react';
import { useGame } from '../../store/gameStore';
import { PixelPanel, PxButton } from './PixelPanel';
import { baseConfig, buildConfig, type GameConfig } from '../../config/gameConfig';
import { clearOverrides, loadOverrides, saveOverrides } from '../../utils/configStore';
import { placeholderPhoto } from '../../utils/placeholders';
import { cleanText } from '../../utils/sanitize';

const MAX_IMG = 1.5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Editor lokal: perubahan hanya tersimpan di browser ini (tidak mengubah pengunjung lain).
// Untuk berlaku ke semua pengunjung: Ekspor JSON -> simpan sebagai public/config.json -> deploy ulang.
export function EditorPanel() {
  const cur = useGame((s) => s.config);
  const [c, setC] = useState<GameConfig>(() => JSON.parse(JSON.stringify(cur)));
  const [msg, setMsg] = useState('');
  const importRef = useRef<HTMLTextAreaElement>(null);
  const set = (p: Partial<GameConfig>) => setC((o) => ({ ...o, ...p }));

  const save = () => {
    const built = buildConfig(c);
    saveOverrides(c); useGame.getState().setConfig(built); setMsg('Tersimpan di browser ini.');
  };
  const upload = (i: number, f?: File | null) => {
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) { setMsg('Format harus JPG, PNG, atau WEBP.'); return; }
    if (f.size > MAX_IMG) { setMsg('Ukuran foto maksimal 1,5 MB.'); return; }
    const r = new FileReader();
    r.onload = () => { const src = String(r.result); setC((o) => ({ ...o, photos: o.photos.map((p, k) => (k === i ? { ...p, src } : p)) })); setMsg('Foto dipilih. Tekan Simpan.'); };
    r.onerror = () => setMsg('Gagal membaca foto.');
    r.readAsDataURL(f);
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'config.json'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const importJson = () => {
    try {
      const o = JSON.parse(importRef.current?.value || '');
      const built = buildConfig(o); setC(JSON.parse(JSON.stringify(built))); setMsg('Impor valid. Tekan Simpan untuk memakainya.');
    } catch { setMsg('JSON tidak valid.'); }
  };
  const resetAll = () => { clearOverrides(); useGame.getState().setConfig(buildConfig(null)); setC(JSON.parse(JSON.stringify(baseConfig))); setMsg('Kembali ke konfigurasi bawaan.'); };
  void loadOverrides;

  return (
    <PixelPanel title="Editor konten (lokal)" onClose={() => useGame.getState().closeModal()} wide>
      <div className="stack editor">
        <label className="field">Nama pengirim<input value={c.sender} maxLength={40} onChange={(e) => set({ sender: cleanText(e.target.value, 40) })} /></label>
        <label className="field">Nama panggilan penerima<input value={c.receiver} maxLength={40} onChange={(e) => set({ receiver: cleanText(e.target.value, 40) })} /></label>
        <label className="field">Nama lengkap penerima<input value={c.fullReceiver} maxLength={80} onChange={(e) => set({ fullReceiver: cleanText(e.target.value, 80) })} /></label>
        <div className="row"><label className="field">Tanggal spesial<input value={c.specialDate.label} onChange={(e) => set({ specialDate: { ...c.specialDate, label: cleanText(e.target.value, 60) } })} /></label><label className="field">Jam<input value={c.specialDate.time} onChange={(e) => set({ specialDate: { ...c.specialDate, time: cleanText(e.target.value, 10) } })} /></label></div>
        <label className="field">Pesan pembuka (pisahkan paragraf dengan baris kosong)<textarea rows={4} value={c.openingMessages.join('\n\n')} onChange={(e) => set({ openingMessages: e.target.value.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean) })} /></label>
        <label className="field">Isi surat utama (paragraf dipisah baris kosong)<textarea rows={8} value={c.letter.paragraphs.join('\n\n')} onChange={(e) => set({ letter: { ...c.letter, paragraphs: e.target.value.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean) } })} /></label>
        <label className="field">Penutup surat<input value={c.letter.closing.replace(/\n/g, ' / ')} onChange={(e) => set({ letter: { ...c.letter, closing: e.target.value.replace(/ \/ /g, '\n') } })} /></label>
        <label className="field">Pesan rahasia<textarea rows={4} value={c.secretLetter.paragraphs.join('\n\n')} onChange={(e) => set({ secretLetter: { ...c.secretLetter, paragraphs: e.target.value.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean) } })} /></label>
        <div className="row">{(['hijab', 'blouse', 'bottom', 'accent'] as const).map((k) => <label key={k} className="field">{k}<input type="color" value={c.theme[k]} onChange={(e) => set({ theme: { ...c.theme, [k]: e.target.value } })} /></label>)}</div>
        <div className="row">{(['memory', 'puzzle', 'hidden', 'hearts'] as const).map((k) => <label key={k} className="check"><input type="checkbox" checked={c.miniGames[k]} onChange={(e) => set({ miniGames: { ...c.miniGames, [k]: e.target.checked } })} /> {k}</label>)}</div>
        <label className="field">URL musik (opsional, file di public/audio)<input value={c.musicUrl ?? ''} onChange={(e) => set({ musicUrl: e.target.value ? cleanText(e.target.value, 300) : null })} /></label>
        <h4>Foto kenangan</h4>
        {c.photos.map((p, i) => (
          <div key={p.id} className="photo-edit">
            <img src={p.src} alt="" />
            <div className="stack">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => upload(i, e.target.files?.[0])} />
              <input placeholder="Keterangan" value={p.caption} maxLength={160} onChange={(e) => setC((o) => ({ ...o, photos: o.photos.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)) }))} />
              <input placeholder="Tanggal" value={p.date} maxLength={60} onChange={(e) => setC((o) => ({ ...o, photos: o.photos.map((x, k) => (k === i ? { ...x, date: e.target.value } : x)) }))} />
              <PxButton small onClick={() => setC((o) => ({ ...o, photos: o.photos.map((x, k) => (k === i ? { ...x, src: placeholderPhoto(i) } : x)) }))}>Pakai placeholder</PxButton>
            </div>
          </div>
        ))}
        <PxButton small onClick={() => setC((o) => ({ ...o, photos: [...o.photos, { id: 'p' + o.photos.length, src: placeholderPhoto(o.photos.length), caption: '', date: '' }].slice(0, 12) }))}>+ Tambah foto</PxButton>
        <h4>Ekspor / Impor</h4>
        <textarea ref={importRef} rows={3} placeholder="Tempel JSON konfigurasi di sini" />
        <div className="row"><PxButton small onClick={importJson}>Impor</PxButton><PxButton small onClick={exportJson}>Ekspor JSON</PxButton></div>
        {msg && <p role="status"><b>{msg}</b></p>}
        <div className="row"><PxButton primary onClick={save}>Simpan</PxButton><PxButton onClick={resetAll}>Bawaan</PxButton></div>
      </div>
    </PixelPanel>
  );
}
