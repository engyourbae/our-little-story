import { useGame } from '../../store/gameStore';
import { FloatingHearts } from '../Animations/FloatingHearts';
import { PxButton } from './PixelPanel';
import { stayHere } from '../../systems/ChapterManager';

export function FinalOverlay() {
  const phase = useGame((s) => s.finalPhase);
  const scene = useGame((s) => s.scene);
  const cfg = useGame((s) => s.config);
  const modal = useGame((s) => s.modal);
  if (scene !== 'final') return null;
  return (
    <>
      {phase !== 'cinema' && <FloatingHearts n={phase === 'free' ? 10 : 18} />}
      {phase === 'title' && !modal && (
        <div className="final-title">
          <h2>OUR STORY IS STILL GOING.</h2>
          <p>{cfg.specialDate.label.charAt(0) + cfg.specialDate.label.slice(1).toLowerCase()} · {cfg.specialDate.time}</p>
          <p>Made with love, for {cfg.fullReceiver}.</p>
          <div className="final-buttons">
            <PxButton primary onClick={() => { useGame.setState({ letterIntro: false, letterWhich: 'main' }); useGame.getState().openModal('letter'); }}>Read My Letter Again</PxButton>
            <PxButton onClick={() => { useGame.setState({ memTab: 'album' }); useGame.getState().openModal('memories'); }}>Revisit Our Memories</PxButton>
            <PxButton onClick={stayHere}>Stay Here A Little Longer</PxButton>
          </div>
        </div>
      )}
      {phase === 'free' && !modal && <button className="px hud-btn final-menu" onClick={() => useGame.getState().openModal('menu')}>☰</button>}
    </>
  );
}
