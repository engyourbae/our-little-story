import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../store/gameStore';
import { audio } from '../../systems/AudioManager';
import { PixelPanel, PxButton } from './PixelPanel';
import { finishLetterStory } from '../../systems/ChapterManager';

// Amplop fisik: tombol "Open My Letter" -> amplop bergerak -> kertas keluar -> teks muncul perlahan.
export function OpenLetterPrompt() {
  const cfg = useGame((s) => s.config);
  const sealed = true;
  return (
    <div className="overlay center">
      <div className="px panel narrow center-text">
        <div className={'envelope' + (sealed ? ' pulse' : '')} aria-hidden="true"><i /></div>
        <p>Ada surat untuk {cfg.receiver}.</p>
        <PxButton primary onClick={() => { audio.sfx('open'); useGame.getState().openModal('letter'); }}>Open My Letter</PxButton>
        <PxButton small onClick={() => useGame.getState().closeModal()}>Nanti dulu</PxButton>
      </div>
    </div>
  );
}

export function LetterReader() {
  const cfg = useGame((s) => s.config);
  const which = useGame((s) => s.letterWhich);
  const intro = useGame((s) => s.letterIntro);
  const [stage, setStage] = useState<'opening' | 'reading'>('opening');
  const [n, setN] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const body = which === 'main' ? [...cfg.letter.greeting, ...cfg.letter.paragraphs, cfg.letter.closing].join('\n\n') : cfg.secretLetter.paragraphs.join('\n\n');
  const title = which === 'main' ? 'Surat untuk ' + cfg.fullReceiver : cfg.secretLetter.title;

  useEffect(() => {
    audio.sfx('open'); audio.setMood('emotional');
    const t = window.setTimeout(() => { setStage('reading'); audio.sfx('page'); }, 1500);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (stage !== 'reading') return;
    const id = window.setInterval(() => setN((v) => Math.min(body.length, v + 2)), 38);
    return () => window.clearInterval(id);
  }, [stage, body]);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [n]);

  const close = () => {
    audio.sfx('click');
    useGame.getState().closeModal();
    if (intro) finishLetterStory();
    else audio.setMood(useGame.getState().scene === 'garden' ? 'garden' : 'romantic');
  };
  const done = n >= body.length;
  return (
    <PixelPanel title={title} wide onClose={done ? close : undefined}>
      {stage === 'opening' ? (
        <div className="center-text"><div className="envelope opening" aria-hidden="true"><i /><b /></div><p>Amplop terbuka...</p></div>
      ) : (
        <>
          <div className="letter-paper" ref={box}>{body.slice(0, n)}{!done && <span className="caret">▌</span>}</div>
          <div className="row">
            {!done && <PxButton small onClick={() => setN(body.length)}>Tampilkan semua</PxButton>}
            {done && <PxButton primary onClick={close}>{intro ? 'Lanjut' : 'Tutup'}</PxButton>}
          </div>
        </>
      )}
    </PixelPanel>
  );
}
