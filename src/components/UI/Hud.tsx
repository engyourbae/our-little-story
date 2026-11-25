import { useGame } from '../../store/gameStore';
import { currentMission } from '../../systems/MissionManager';
import { CHAPTERS, CHAPTER_ORDER } from '../../config/story';
import { TOTAL_HEARTS } from '../../systems/ProgressManager';
import { audio } from '../../systems/AudioManager';
import { requestInteract } from '../../systems/InteractionManager';
import { cancelHidden, hiddenHint } from '../../games/HiddenObject/hidden';

export function Hud() {
  const scene = useGame((s) => s.scene);
  const save = useGame((s) => s.save);
  const dialogue = useGame((s) => !!s.dialogue);
  const hidden = useGame((s) => s.hidden);
  const modal = useGame((s) => s.modal);
  const finalPhase = useGame((s) => s.finalPhase);
  const setS = useGame.setState;
  if (!['garden', 'house', 'secret', 'final'].includes(scene)) return null;
  if (scene === 'final' && finalPhase !== 'free') return null;
  const m = currentMission(save, scene);
  const nextCh = CHAPTER_ORDER.filter((c) => c !== 'c0').find((c) => !save.chapters[c]);
  const done = CHAPTER_ORDER.filter((c) => c !== 'c0' && save.chapters[c]).length;
  const hint = () => {
    audio.sfx('chime');
    const st = useGame.getState();
    if (hidden.active) { st.showToast(hiddenHint(), 4500); return; }
    if (!m) { st.showToast('Semua cerita sudah terbuka. Jelajahi sesukamu.'); return; }
    st.showToast(m.hint, 5200);
    if (scene === 'garden') { setS({ cam: m.cam }); window.setTimeout(() => useGame.getState().cam === m.cam && useGame.setState({ cam: 'overview' }), 3200); }
  };
  return (
    <>
      {!dialogue && !modal && (
        <div className="hud-left">
          <div className="px hud-card">
            <div className="hud-ch">{nextCh ? `Bab ${CHAPTER_ORDER.indexOf(nextCh)} · ${CHAPTERS[nextCh].title}` : 'Semua bab selesai'}</div>
            {hidden.active ? <div className="hud-mission">Cari benda tersembunyi <b>{hidden.items.filter((i) => i.found).length}/3</b></div> : m && <div className="hud-mission">{m.title}{m.progress && <b> {m.progress}</b>}</div>}
            <div className="bar"><i style={{ width: (done / 8) * 100 + '%' }} /></div>
          </div>
          <div className="px hud-hearts">♥ {save.hearts.length}/{TOTAL_HEARTS}</div>
        </div>
      )}
      {!dialogue && (
        <div className="hud-right">
          {hidden.active && <button className="px hud-btn wide" onClick={() => { cancelHidden(); }}>Berhenti</button>}
          {scene === 'house' && <button className="px hud-btn wide" onClick={() => requestInteract('exitDoor')}>⟵ Keluar</button>}
          {scene === 'secret' && <button className="px hud-btn wide" onClick={() => requestInteract('secretExit')}>⟵ Kembali</button>}
          <button className="px hud-btn" aria-label="Petunjuk" onClick={hint}>?</button>
          <button className="px hud-btn" aria-label="Menu" onClick={() => { audio.sfx('click'); useGame.getState().openModal('menu'); }}>☰</button>
        </div>
      )}
    </>
  );
}
