import { useState, type ReactNode } from 'react';
import { PixelPanel, PxButton } from '../components/UI/PixelPanel';
import { FloatingHearts } from '../components/Animations/FloatingHearts';
import { audio } from '../systems/AudioManager';
import { miniWin } from '../systems/ProgressManager';
import { useGame } from '../store/gameStore';

type Id = 'memory' | 'puzzle' | 'hearts' | 'hidden';
interface Props { id: Id; title: string; intro: string; rules: string[]; onStart?: () => void; startStage?: 'intro' | 'win'; children?: (win: () => void) => ReactNode }

// Halaman pembuka, instruksi, mulai, kemenangan (animasi), ulangi, kembali.
export function MiniGameShell({ id, title, intro, rules, onStart, startStage = 'intro', children }: Props) {
  const [stage, setStage] = useState<'intro' | 'play' | 'win'>(startStage);
  const [round, setRound] = useState(0);
  const close = () => useGame.getState().closeModal();
  const start = () => { if (onStart) { onStart(); return; } setStage('play'); };
  const win = () => { setStage('win'); audio.sfx('win'); if (id !== 'hidden') miniWin(id); };
  return (
    <PixelPanel title={title} onClose={close}>
      {stage === 'intro' && (
        <div className="stack center-text">
          <p>{intro}</p>
          <ul className="plain left">{rules.map((r, i) => <li key={i}>{r}</li>)}</ul>
          <PxButton primary onClick={start}>Mulai</PxButton>
          <PxButton small onClick={close}>Kembali</PxButton>
        </div>
      )}
      {stage === 'play' && children && <div key={round}>{children(win)}</div>}
      {stage === 'win' && (
        <div className="stack center-text win">
          <FloatingHearts n={10} />
          <h3 className="winpop">Kamu berhasil! ♥</h3>
          <p>Satu hati kecil masuk ke koleksimu.</p>
          <PxButton primary onClick={() => { if (onStart) { onStart(); return; } setRound((r) => r + 1); setStage('play'); }}>Ulangi</PxButton>
          <PxButton onClick={close}>Kembali</PxButton>
        </div>
      )}
    </PixelPanel>
  );
}
