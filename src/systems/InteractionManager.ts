import { useGame } from '../store/gameStore';
import { world } from './world';
import { APPROACH, BOUNDS } from '../config/world';
import { audio } from './AudioManager';
import { goScene } from './SceneManager';
import { startChapter, houseObject } from './ChapterManager';
import { startDialogue } from './DialogueManager';
import { foundHidden } from '../games/HiddenObject/hidden';
import { houseKey } from './MissionManager';

const INTERACTIVE_SCENES = ['garden', 'house', 'secret'];

export function walkTo(x: number, z: number) {
  const g = useGame.getState();
  if (g.modal || g.dialogue || g.busy || !INTERACTIVE_SCENES.includes(g.scene) && g.finalPhase !== 'free') return;
  const b = BOUNDS[g.scene] ?? BOUNDS.garden;
  const p = world.player;
  p.tx = Math.max(b.x[0], Math.min(b.x[1], x));
  p.tz = Math.max(b.z[0], Math.min(b.z[1], z));
  p.arrive = null; p.stuck = 0;
}

export function requestInteract(id: string) {
  const g = useGame.getState();
  if (g.modal || g.dialogue || g.busy || g.fading || !INTERACTIVE_SCENES.includes(g.scene)) return;
  const ap = APPROACH[id];
  const p = world.player;
  if (ap && Math.hypot(ap[0] - p.x, ap[1] - p.z) > 0.6) {
    p.tx = ap[0]; p.tz = ap[1]; p.arrive = id; p.stuck = 0;
    audio.sfx('pop');
  } else interact(id);
}

export function interact(id: string) {
  const g = useGame.getState();
  const sv = g.save;
  const c = sv.chapters;
  const toast = g.showToast;
  if (id.startsWith('hid')) { foundHidden(Number(id.slice(3))); return; }
  if (id.startsWith('note')) {
    const i = Number(id.slice(4));
    toast('🌸 ' + (g.config.shortMessages[i] ?? ''), 5200);
    audio.sfx('chime');
    if (!sv.notes.includes(i)) g.patchSave((s) => ({ ...s, notes: [...s.notes, i] }));
    return;
  }
  switch (id) {
    case 'signpost': g.openModal('missions'); break;
    case 'bench':
      if (!c.c1) startChapter('c1'); else toast('Bangku ini masih hangat. Ceritanya bisa kamu ulang dari menu Bab.'); break;
    case 'meadow':
      if (!c.c1) toast('Dengarkan cerita di bangku dulu, ya. Taman bunganya menunggu.');
      else if (!c.c2) startChapter('c2'); else toast('Bunga-bunga ini mekar karena ada kamu. Coba ketuk bunga kecil yang bersinar.'); break;
    case 'stall':
      if (!c.c2) toast('Peti kayu berisi buah segar. Kelihatannya enak.');
      else if (!sv.hasKey) { audio.sfx('key'); g.patchSave((s) => ({ ...s, hasKey: true })); g.openModal('keyFound'); }
      else toast('Cuma buah segar. Kuncinya sudah kamu simpan.'); break;
    case 'door':
      if (!sv.hasKey) { audio.sfx('door'); g.openModal('lock'); }
      else goScene('house', { sfx: 'door', after: () => {
        useGame.setState((s) => ({ boy: { visible: true, x: 1.4, z: 2.0, y: 0, pose: 'stand' }, cam: 'house' }));
        if (!useGame.getState().save.chapters.c3) useGame.getState().showToast('Sentuh benda-benda kecil di dalam rumah.', 4200);
      } });
      break;
    case 'arcade': g.openModal('arcade'); break;
    case 'arch':
      if (!c.c3) toast('Lengkungan bunga ini cantik. Mungkin nanti ada ceritanya.');
      else if (!c.c4) startChapter('c4'); else toast('Lengkungan bunga yang selalu mekar.'); break;
    case 'tree':
      if (!c.c4) toast('Pohon besar dengan lampu-lampu kecil. Belum waktunya duduk di sini.');
      else if (!c.c5) startChapter('c5'); else toast('Lampu-lampu di pohon ini masih menyala untukmu.'); break;
    case 'clock': case 'cal':
      if (!c.c5) toast('Jam dan kalender taman. Ceritanya belum terbuka.'); else g.openModal('calendar'); break;
    case 'cushion': case 'doll': case 'heartObj': case 'musicbox': {
      const part = houseKey(id);
      if (id === 'musicbox') audio.sfx('chime');
      houseObject(id, part); break;
    }
    case 'laptop': useGame.setState({ memTab: 'surat' }); g.openModal('memories'); break;
    case 'photoFrame': case 'photosWall': useGame.setState({ memTab: 'album' }); g.openModal('memories'); break;
    case 'bookshelf': g.openModal('chapters'); break;
    case 'exitDoor': goScene('garden', { sfx: 'door', spawn: [0, -2.0], after: () => audio.setMood('garden') }); break;
    case 'secretDoor':
      goScene('secret', { sfx: 'door', after: () => {
        if (!useGame.getState().save.chapters.c7) window.setTimeout(() => startChapter('c7'), 500);
        else useGame.getState().showToast('Ruangan rahasia kita. Ketuk amplop untuk membaca surat lagi.');
      } });
      break;
    case 'secretExit': goScene('house', { sfx: 'door', spawn: [-3.4, -2.2], after: () => { useGame.setState((s) => ({ boy: { ...s.boy, visible: true, x: 1.4, z: 2.0 } })); } }); break;
    case 'envelope':
      if (c.c7 || sv.letterRead) { useGame.setState({ letterIntro: false, letterWhich: 'main' }); g.openModal('letter'); }
      else if (!g.dialogue) { useGame.setState({ letterIntro: true, letterWhich: 'main' }); g.openModal('openLetter'); }
      break;
    default: break;
  }
  void startDialogue;
}
