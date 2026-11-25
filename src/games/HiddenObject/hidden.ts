import { useGame, type HiddenItem } from '../../store/gameStore';
import { HIDDEN_SPOTS } from '../../config/world';
import { audio } from '../../systems/AudioManager';
import { miniWin } from '../../systems/ProgressManager';
import { shuffle } from '../../utils/rng';

export function startHidden() {
  const spots = shuffle(HIDDEN_SPOTS.map((_, i) => i)).slice(0, 3);
  const types: HiddenItem['type'][] = ['star', 'heart', 'flower'];
  const items: HiddenItem[] = spots.map((spot, i) => ({ type: types[i], spot, found: false }));
  useGame.setState({ hidden: { active: true, items }, modal: null, cam: 'overview' });
  useGame.getState().showToast('Cari bintang, hati, dan bunga yang bersinar di taman!', 4200);
  audio.sfx('chime');
}

export function cancelHidden() {
  useGame.setState({ hidden: { active: false, items: [] } });
}

export function foundHidden(i: number) {
  const g = useGame.getState();
  const items = g.hidden.items.map((it, k) => (k === i ? { ...it, found: true } : it));
  if (!g.hidden.active || !items[i] || g.hidden.items[i].found) return;
  audio.sfx('heart');
  const all = items.every((x) => x.found);
  useGame.setState({ hidden: { active: !all, items: all ? [] : items } });
  if (all) {
    g.patchSave((s) => ({ ...s, hiddenDone: true }));
    miniWin('hidden');
    window.setTimeout(() => useGame.getState().openModal('hiddenWin'), 600);
  } else g.showToast(`Ketemu! ${items.filter((x) => x.found).length}/3`, 1800);
}

export function hiddenHint(): string {
  const g = useGame.getState();
  const left = g.hidden.items.find((x) => !x.found);
  return left ? 'Petunjuk: ' + HIDDEN_SPOTS[left.spot].hint + '.' : '';
}
