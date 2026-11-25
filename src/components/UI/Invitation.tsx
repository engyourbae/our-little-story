import { useEffect, useState } from 'react';
import { useGame } from '../../store/gameStore';
import { audio } from '../../systems/AudioManager';
import { goScene } from '../../systems/SceneManager';
import { PxButton } from './PixelPanel';

export function Invitation() {
  const cfg = useGame((s) => s.config);
  const [stage, setStage] = useState<'closed' | 'opening' | 'letter'>('closed');
  const [k, setK] = useState(0);
  useEffect(() => {
    if (stage !== 'letter') return;
    if (k >= cfg.openingMessages.length) return;
    const t = window.setTimeout(() => { setK((v) => v + 1); audio.sfx('pop'); }, k === 0 ? 700 : 1900);
    return () => window.clearTimeout(t);
  }, [stage, k, cfg.openingMessages.length]);

  const open = () => {
    audio.unlock(); audio.setMood('garden'); audio.sfx('open'); setStage('opening');
    window.setTimeout(() => { setStage('letter'); audio.sfx('page'); }, 1600);
  };
  const start = () => {
    useGame.getState().patchSave((s) => ({ ...s, chapters: { ...s.chapters, c0: true }, started: true }));
    goScene('garden', { sfx: 'door', after: () => { useGame.getState().showToast('Ketuk tanah untuk berjalan. Ketuk benda yang bercahaya untuk berinteraksi.', 5200); audio.setMood('garden'); } });
  };
  return (
    <div className="invite">
      {stage !== 'letter' && (
        <div className="invite-card">
          <p className="big">Untuk {cfg.fullReceiver}.</p>
          <p>Hei, kamu!</p>
          <p>Ada seseorang yang sedang menyiapkan sesuatu untukmu.</p>
          <p>Tenang, bukan tagihan, bukan tugas, dan bukan juga ujian mendadak. Hehe.</p>
          <div className={'envelope' + (stage === 'opening' ? ' opening' : '')} aria-hidden="true"><i /><b /></div>
          <PxButton primary disabled={stage === 'opening'} onClick={open}>Open My Little World</PxButton>
        </div>
      )}
      {stage === 'letter' && (
        <div className="px invite-letter">
          {cfg.openingMessages.slice(0, k).map((m, i) => <p key={i} className="fadein">{m}</p>)}
          {k >= cfg.openingMessages.length && <PxButton primary onClick={start}>Mulai</PxButton>}
        </div>
      )}
    </div>
  );
}
