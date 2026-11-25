import type { SceneId } from '../config/types';
import { useGame } from '../store/gameStore';
import { audio, type SfxName } from './AudioManager';
import { world } from './world';
import { SPAWN } from '../config/world';

const DEFAULT_CAM: Record<SceneId, string> = { menu: 'invite', invitation: 'invite', garden: 'overview', house: 'house', secret: 'secret', final: 'final' };
const PERSIST: SceneId[] = ['garden', 'house', 'secret', 'final'];

export function goScene(scene: SceneId, opts: { spawn?: [number, number]; cam?: string; sfx?: SfxName; after?: () => void } = {}) {
  const g = useGame.getState();
  if (g.busy) return;
  useGame.setState({ busy: true, fading: true, hover: null });
  if (opts.sfx) audio.sfx(opts.sfx);
  window.setTimeout(() => {
    const sp = opts.spawn ?? SPAWN[scene];
    const p = world.player;
    p.x = sp[0]; p.z = sp[1]; p.tx = null; p.tz = null; p.arrive = null; p.moving = false;
    useGame.setState((s) => ({
      scene, cam: opts.cam ?? DEFAULT_CAM[scene], camSnap: s.camSnap + 1, indaPose: 'stand', indaY: 0,
      boy: { ...s.boy, visible: false, pose: 'stand', y: 0 }, dialogue: null
    }));
    if (PERSIST.includes(scene)) useGame.getState().patchSave((sv) => ({ ...sv, lastScene: scene }));
    else useGame.getState().refreshMission();
    window.setTimeout(() => {
      useGame.setState({ fading: false, busy: false });
      opts.after?.();
    }, 380);
  }, 460);
}
