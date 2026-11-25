import { useEffect } from 'react';
import { useGame } from '../store/gameStore';
import { Game } from './Game';
import { audio } from '../systems/AudioManager';
import { DialogueBox } from '../components/Dialogue/DialogueBox';
import { Hud } from '../components/UI/Hud';
import { MainMenu } from '../components/UI/MainMenu';
import { ModalRouter } from '../components/UI/ModalRouter';
import { Invitation } from '../components/UI/Invitation';
import { FinalOverlay } from '../components/UI/FinalOverlay';
import { Fade, HoverLabel, Toast } from '../components/UI/Overlays';
import { loadRemoteConfig } from '../utils/configStore';
import { buildConfig } from '../config/gameConfig';
import { loadOverrides } from '../utils/configStore';

export default function App() {
  const scene = useGame((s) => s.scene);
  const st = useGame((s) => s.save.settings);
  const url = useGame((s) => s.config.musicUrl);
  const night = scene !== 'garden' && scene !== 'house' && scene !== 'secret';

  useEffect(() => { audio.configure({ music: st.music, sfx: st.sfx, muted: st.muted, playing: st.playing }); }, [st.music, st.sfx, st.muted, st.playing]);
  useEffect(() => { audio.setExternal(url); }, [url]);
  useEffect(() => {
    // config.json opsional (hasil ekspor Editor) lalu override lokal browser
    void loadRemoteConfig().then((remote) => {
      if (!remote) return;
      const merged = { ...(remote as object), ...((loadOverrides() as object) ?? {}) };
      useGame.getState().setConfig(buildConfig(merged));
    });
    const onPrompt = (e: Event) => { e.preventDefault(); useGame.setState({ installEvt: e as never }); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);
  useEffect(() => { useGame.getState().refreshMission(); }, [scene]);

  return (
    <div className={'app ' + (scene === 'house' ? 'sky-house' : scene === 'secret' ? 'sky-secret' : night ? 'sky-night' : 'sky-day')}>
      <Game />
      {scene === 'menu' && <MainMenu />}
      {scene === 'invitation' && <Invitation />}
      <Hud />
      <FinalOverlay />
      <HoverLabel />
      <DialogueBox />
      <Toast />
      <ModalRouter />
      <Fade />
    </div>
  );
}
