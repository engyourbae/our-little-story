import { useGame } from '../../store/gameStore';
import { audio } from '../../systems/AudioManager';
import { goScene } from '../../systems/SceneManager';
import { PxButton } from './PixelPanel';
import { startFinal } from '../../systems/ChapterManager';

export function MainMenu() {
  const hasSave = useGame((s) => s.hasSave);
  const save = useGame((s) => s.save);
  const cfg = useGame((s) => s.config);
  const modal = useGame((s) => s.modal);
  const busy = useGame((s) => s.busy);
  if (modal) return null;
  const unlock = () => { audio.unlock(); };
  const cont = () => {
    unlock(); audio.setMood('garden');
    const sc = save.lastScene;
    if (sc === 'final') { startFinal(!!save.chapters.final); return; }
    goScene(sc, { sfx: 'door', after: () => {
      if (sc === 'house') useGame.setState((s) => ({ boy: { ...s.boy, visible: true, x: 1.4, z: 2.0 }, cam: 'house' }));
    } });
  };
  const newGame = () => { unlock(); if (hasSave) useGame.getState().openModal('confirmNew'); else beginNew(); };
  return (
    <div className="menu">
      <div className="menu-title">
        <h1>{cfg.title}</h1>
        <p>{cfg.tagline}</p>
      </div>
      <div className="px menu-panel">
        <PxButton primary disabled={!hasSave || busy} onClick={cont}>Continue</PxButton>
        <PxButton disabled={busy} onClick={newGame}>New Game</PxButton>
        <PxButton onClick={() => { unlock(); useGame.getState().openModal('memories'); }}>Memories</PxButton>
        <PxButton onClick={() => { unlock(); useGame.getState().openModal('letters'); }}>Letters</PxButton>
        <PxButton onClick={() => { unlock(); useGame.getState().openModal('settings'); }}>Settings</PxButton>
        <PxButton onClick={() => { unlock(); useGame.getState().openModal('about'); }}>About This Little World</PxButton>
        {(location.search.includes('editor=1') || location.hash === '#editor') && <PxButton onClick={() => useGame.getState().openModal('editor')}>Editor (lokal)</PxButton>}
      </div>
    </div>
  );
}

export function beginNew() {
  audio.unlock();
  useGame.getState().patchSave((s) => ({ ...s, started: true }));
  useGame.getState().closeModal();
  goScene('invitation', { sfx: 'page' });
}
