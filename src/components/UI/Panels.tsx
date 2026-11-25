import { useState } from 'react';
import { useGame } from '../../store/gameStore';
import { audio, type SfxName } from '../../systems/AudioManager';
import { CHAPTERS, CHAPTER_ORDER } from '../../config/story';
import { PixelPanel, PxButton } from './PixelPanel';
import { TOTAL_HEARTS, resetProgress } from '../../systems/ProgressManager';
import { currentMission } from '../../systems/MissionManager';
import { replayChapter, startChapter } from '../../systems/ChapterManager';
import { goScene } from '../../systems/SceneManager';
import { beginNew } from './MainMenu';
import type { ChapterId, MusicMood, Quality } from '../../config/types';

const close = () => useGame.getState().closeModal();

export function MenuPanel() {
  const scene = useGame((s) => s.scene);
  return (
    <PixelPanel title="Menu" onClose={close}>
      <div className="stack">
        <PxButton primary onClick={close}>Lanjut bermain</PxButton>
        <PxButton onClick={() => useGame.getState().openModal('chapters')}>Bab & Cerita</PxButton>
        <PxButton onClick={() => { useGame.setState({ memTab: 'surat' }); useGame.getState().openModal('memories'); }}>Memories</PxButton>
        <PxButton onClick={() => useGame.getState().openModal('letters')}>Letters</PxButton>
        <PxButton onClick={() => useGame.getState().openModal('settings')}>Pengaturan</PxButton>
        <PxButton onClick={() => { close(); audio.setMood('off'); useGame.setState({ finalPhase: 'none', dialogue: null }); goScene('menu'); }}>Menu utama {scene === 'garden' ? '' : ''}</PxButton>
      </div>
    </PixelPanel>
  );
}

export function SettingsPanel() {
  const st = useGame((s) => s.save.settings);
  const inst = useGame((s) => s.installEvt);
  const patch = (p: Partial<typeof st>) => { const g = useGame.getState(); g.patchSave((s) => ({ ...s, settings: { ...s.settings, ...p } })); };
  return (
    <PixelPanel title="Pengaturan" onClose={close}>
      <div className="stack">
        <label className="field">Volume musik <input type="range" min={0} max={1} step={0.05} value={st.music} onChange={(e) => patch({ music: Number(e.target.value) })} /></label>
        <label className="field">Volume efek suara <input type="range" min={0} max={1} step={0.05} value={st.sfx} onChange={(e) => { patch({ sfx: Number(e.target.value) }); audio.sfx('chime'); }} /></label>
        <div className="row">
          <PxButton small onClick={() => patch({ muted: !st.muted })}>{st.muted ? '🔇 Suara mati' : '🔊 Suara nyala'}</PxButton>
          <PxButton small onClick={() => patch({ playing: !st.playing })}>{st.playing ? '⏸ Jeda musik' : '▶ Putar musik'}</PxButton>
        </div>
        <div className="field">Kualitas grafis
          <div className="row">{(['low', 'medium', 'high'] as Quality[]).map((q) => <PxButton key={q} small primary={st.quality === q} onClick={() => patch({ quality: q })}>{q === 'low' ? 'Low' : q === 'medium' ? 'Medium' : 'High'}</PxButton>)}</div>
          <small>Low untuk HP lama: bayangan & partikel dikurangi, semua fitur tetap jalan.</small>
        </div>
        <div className="field">Kecepatan teks
          <div className="row">{(['slow', 'normal', 'fast'] as const).map((q) => <PxButton key={q} small primary={st.textSpeed === q} onClick={() => patch({ textSpeed: q })}>{q === 'slow' ? 'Pelan' : q === 'normal' ? 'Normal' : 'Cepat'}</PxButton>)}</div>
        </div>
        {inst && <PxButton onClick={() => { void inst.prompt?.(); }}>Pasang ke layar utama</PxButton>}
        <PxButton onClick={() => useGame.getState().openModal('confirmReset')}>Reset progres…</PxButton>
      </div>
    </PixelPanel>
  );
}

export function ConfirmPanel({ kind }: { kind: 'new' | 'reset' }) {
  return (
    <PixelPanel title={kind === 'new' ? 'Mulai dari awal?' : 'Reset progres?'} onClose={close}>
      <p>Semua progres cerita, hati, dan benda yang ditemukan akan dihapus. Pengaturan suara dan kualitas tetap. Tindakan ini tidak bisa dibatalkan.</p>
      <div className="row">
        <PxButton onClick={close}>Batal</PxButton>
        <PxButton primary onClick={() => { resetProgress(); if (kind === 'new') beginNew(); else { useGame.getState().showToast('Progres sudah direset.'); goScene('menu'); } }}>Ya, hapus</PxButton>
      </div>
    </PixelPanel>
  );
}

export function ChaptersPanel() {
  const save = useGame((s) => s.save);
  return (
    <PixelPanel title="Bab & Cerita" onClose={close} wide>
      <p className="muted">Ulangi bab yang sudah dibuka tanpa menghapus progres.</p>
      <div className="stack">
        {CHAPTER_ORDER.map((id, i) => {
          const done = !!save.chapters[id];
          const prev = i === 0 ? true : !!save.chapters[CHAPTER_ORDER[i - 1]];
          const status = done ? 'Selesai' : prev ? 'Tersedia' : 'Terkunci';
          const extra = id === 'c3' && !done ? ` ${save.c3seen.length}/4` : '';
          return (
            <div key={id} className="chapter-row">
              <span className={'dot ' + (done ? 'done' : prev ? 'open' : 'lock')}>{done ? '✔' : prev ? '▶' : '🔒'}</span>
              <span className="chapter-name"><b>{CHAPTERS[id].title}</b><small>{status}{extra} · {CHAPTERS[id].subtitle}</small></span>
              {done && <PxButton small onClick={() => replayChapter(id as ChapterId)}>Ulangi</PxButton>}
            </div>
          );
        })}
      </div>
    </PixelPanel>
  );
}

export function MissionsPanel() {
  const save = useGame((s) => s.save);
  const scene = useGame((s) => s.scene);
  const m = currentMission(save, scene);
  const rows: [string, string][] = [
    ['Taman', save.chapters.c2 ? 'Selesai' : 'Berlangsung'],
    ['Perjalanan', save.chapters.c6 ? 'Selesai' : 'Berlangsung'],
    ['Kenangan', `${save.c3seen.length}/4`],
    ['Ruang Rahasia', save.chapters.c6 && save.hiddenDone ? (save.chapters.c7 ? 'Selesai' : 'Terbuka') : 'Terkunci'],
    ['Kejutan Akhir', save.chapters.final ? 'Selesai' : save.chapters.c7 ? 'Terbuka' : 'Terkunci']
  ];
  return (
    <PixelPanel title="Papan petunjuk" onClose={close}>
      <p><b>Misi sekarang:</b> {m ? m.title : 'Semua misi selesai'}</p>
      {m && <p className="muted">{m.hint}</p>}
      <ul className="plain">{rows.map(([a, b]) => <li key={a}><b>{a}:</b> {b}</li>)}</ul>
      <p>♥ {save.hearts.length}/{TOTAL_HEARTS} hati terkumpul</p>
    </PixelPanel>
  );
}

export function LockPanel() {
  return (
    <PixelPanel title="Terkunci." onClose={close}>
      <div className="center-text"><div className="lock-icon" aria-hidden="true">🔒</div><p>Sepertinya kamu membutuhkan sebuah kunci.</p></div>
      <div className="stack">
        <PxButton primary onClick={() => { close(); useGame.setState({ cam: 'stall' }); useGame.getState().showToast('Coba periksa peti kayu di lapak buah.', 4200); window.setTimeout(() => useGame.setState({ cam: 'overview' }), 3200); }}>Hint · cari petunjuk</PxButton>
        <PxButton small onClick={close}>Kembali menjelajah</PxButton>
      </div>
    </PixelPanel>
  );
}

export function KeyFoundPanel() {
  return (
    <PixelPanel title="Benda baru didapat!" onClose={close}>
      <div className="center-text"><div className="lock-icon glow" aria-hidden="true">🗝️</div><h3>Kunci rumah ditemukan.</h3><p>Sekarang, kembali ke rumah.</p></div>
      <PxButton primary onClick={close}>Simpan kunci dan kembali</PxButton>
    </PixelPanel>
  );
}

export function CalendarPanel() {
  const cfg = useGame((s) => s.config);
  const done = useGame((s) => !!s.save.chapters.c6);
  return (
    <PixelPanel title="Jam & Kalender" onClose={close}>
      <div className="center-text">
        <div className="clock-face" aria-hidden="true"><i className="h" /><i className="m" /></div>
        <h3>{cfg.specialDate.time}</h3>
        <div className="calendar">{cfg.specialDate.label}</div>
      </div>
      <PxButton primary onClick={() => { close(); startChapter('c6', done); }}>{done ? 'Dengar lagi' : 'Lanjut'}</PxButton>
    </PixelPanel>
  );
}

const SFXMAP: Record<string, SfxName> = {};
void SFXMAP;
export function LettersPanel() {
  const save = useGame((s) => s.save);
  const cfg = useGame((s) => s.config);
  const open = (w: 'main' | 'secret') => { useGame.setState({ letterWhich: w, letterIntro: false }); useGame.getState().openModal('letter'); };
  return (
    <PixelPanel title="Letters" onClose={close}>
      <div className="stack">
        <div className="chapter-row"><span className="chapter-name"><b>Surat utama untuk {cfg.receiver}</b><small>{save.letterRead ? 'Bisa dibaca ulang' : 'Terkunci · ada di ruang rahasia'}</small></span><PxButton small disabled={!save.letterRead} onClick={() => open('main')}>Baca</PxButton></div>
        <div className="chapter-row"><span className="chapter-name"><b>{cfg.secretLetter.title}</b><small>{save.chapters.final ? 'Pesan rahasia terbuka' : 'Terkunci · selesaikan kejutan akhir'}</small></span><PxButton small disabled={!save.chapters.final} onClick={() => open('secret')}>Baca</PxButton></div>
      </div>
    </PixelPanel>
  );
}

export function MemoriesPanel() {
  const tab = useGame((s) => s.memTab);
  const cfg = useGame((s) => s.config);
  const save = useGame((s) => s.save);
  const [idx, setIdx] = useState(0);
  const [, force] = useState(0);
  const tabs: [typeof tab, string][] = [['surat', 'Surat'], ['album', 'Album'], ['musik', 'Musik'], ['catatan', 'Catatan']];
  const ph = cfg.photos[idx] ?? cfg.photos[0];
  const moods: [MusicMood, string][] = [['garden', 'Taman'], ['soft', 'Lembut'], ['romantic', 'Romantis'], ['emotional', 'Emosional'], ['off', 'Hening']];
  return (
    <PixelPanel title="Memories" onClose={close} wide>
      <div className="tabs">{tabs.map(([k, l]) => <button key={k} className={'tab' + (tab === k ? ' on' : '')} onClick={() => { audio.sfx('click'); useGame.setState({ memTab: k }); }}>{l}</button>)}</div>
      {tab === 'surat' && <LettersPanelInner />}
      {tab === 'album' && ph && (
        <div className="album">
          <div className="photo-frame"><img src={ph.src} alt={ph.caption} /></div>
          <p className="caption"><b>{ph.caption}</b>{ph.date && <small> · {ph.date}</small>}</p>
          <div className="thumbs">{cfg.photos.map((p, i) => <button key={p.id} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} aria-label={'Foto ' + (i + 1)}><img src={p.src} alt="" /></button>)}</div>
        </div>
      )}
      {tab === 'musik' && <div className="stack"><p className="muted">Musik latar dibuat langsung oleh game ini (tanpa file).</p>{moods.map(([m, l]) => <PxButton key={m} small primary={audio.getMood() === m} onClick={() => { audio.unlock(); audio.setMood(m); force((v) => v + 1); }}>{l}</PxButton>)}</div>}
      {tab === 'catatan' && <div className="stack">{save.notes.length === 0 && <p className="muted">Belum ada catatan. Ketuk bunga kecil yang bersinar di taman bunga.</p>}{save.notes.map((n) => <div key={n} className="note">🌸 {cfg.shortMessages[n]}</div>)}</div>}
    </PixelPanel>
  );
}
function LettersPanelInner() {
  const save = useGame((s) => s.save);
  const cfg = useGame((s) => s.config);
  const open = (w: 'main' | 'secret') => { useGame.setState({ letterWhich: w, letterIntro: false }); useGame.getState().openModal('letter'); };
  return (
    <div className="stack">
      <div className="chapter-row"><span className="chapter-name"><b>Surat utama</b><small>{save.letterRead ? 'Untuk ' + cfg.fullReceiver : 'Terkunci'}</small></span><PxButton small disabled={!save.letterRead} onClick={() => open('main')}>Baca</PxButton></div>
      <div className="chapter-row"><span className="chapter-name"><b>{cfg.secretLetter.title}</b><small>{save.chapters.final ? 'Terbuka' : 'Terkunci'}</small></span><PxButton small disabled={!save.chapters.final} onClick={() => open('secret')}>Baca</PxButton></div>
    </div>
  );
}

export function AboutPanel() {
  const cfg = useGame((s) => s.config);
  const inst = useGame((s) => s.installEvt);
  return (
    <PixelPanel title="About This Little World" onClose={close}>
      <p><b>{cfg.title}</b> — {cfg.tagline}</p>
      <p>Dibuat oleh {cfg.sender} untuk {cfg.fullReceiver}. Dunia kecil ini bisa dikunjungi, dijelajahi, dan dimainkan dari awal sampai akhir.</p>
      <p className="muted">Offline: setelah pernah dibuka sekali dengan internet, game bisa dibuka lagi tanpa internet (progres tersimpan di perangkat ini). Di iPhone: Bagikan → Tambah ke Layar Utama.</p>
      <p className="muted">Musik & efek suara dibuat langsung oleh game (original). Tidak ada pelacakan atau data yang dikirim ke server.</p>
      {inst && <PxButton onClick={() => { void inst.prompt?.(); }}>Pasang ke layar utama</PxButton>}
    </PixelPanel>
  );
}
