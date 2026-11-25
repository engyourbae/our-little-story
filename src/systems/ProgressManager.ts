import { useGame } from '../store/gameStore';
import { audio } from './AudioManager';
import { clearSave, defaultSave } from './SaveManager';
import { writeSave } from './SaveManager';
import { world } from './world';

export const TOTAL_HEARTS = 12;

export function miniWin(id: 'memory' | 'puzzle' | 'hearts' | 'hidden') {
  const g = useGame.getState();
  if (g.save.mini[id]) return;
  g.patchSave((s) => ({ ...s, mini: { ...s.mini, [id]: true }, hearts: s.hearts.includes('mini:' + id) ? s.hearts : [...s.hearts, 'mini:' + id] }));
  audio.sfx('heart');
}

// Reset total (dengan konfirmasi di UI). Pengaturan suara & kualitas dipertahankan.
export function resetProgress() {
  const keep = useGame.getState().save.settings;
  clearSave();
  const fresh = { ...defaultSave(), settings: keep };
  writeSave(fresh);
  world.player.tx = null; world.player.tz = null;
  useGame.setState({
    save: fresh, hasSave: false, bloom: 0, glow: 0, lamps: 0, dialogue: null, modal: null, finalPhase: 'none',
    hidden: { active: false, items: [] }, boy: { visible: false, x: -6, z: 2, y: 0, pose: 'stand' }, indaPose: 'stand', letterIntro: false
  });
}
