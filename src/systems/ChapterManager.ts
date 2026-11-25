import type { ChapterId, DialogueLine, StageSpec } from '../config/types';
import { useGame } from '../store/gameStore';
import { getChapter, CHAPTERS } from '../config/story';
import { startDialogue } from './DialogueManager';
import { goScene } from './SceneManager';
import { audio } from './AudioManager';
import { world } from './world';
import { currentMission } from './MissionManager';

function walkInda(x: number, z: number) {
  const p = world.player; p.tx = x; p.tz = z; p.arrive = null;
}

export function applyStage(st: StageSpec) {
  const g = useGame.getState();
  useGame.setState({
    cam: st.cam,
    bloom: st.bloom ?? g.bloom,
    glow: st.glow ?? g.glow,
    boy: st.boy ? { visible: st.boy.visible ?? true, x: st.boy.x, z: st.boy.z, y: st.boy.y ?? 0, pose: st.boy.pose ?? 'stand' } : g.boy,
    indaPose: st.inda?.pose ?? 'stand',
    indaY: st.inda?.y ?? 0
  });
  if (st.inda) walkInda(st.inda.x, st.inda.z);
  if (st.mood) audio.setMood(st.mood);
}

function afterChapter(keepBoy: boolean) {
  const s = useGame.getState();
  useGame.setState({
    cam: s.scene === 'garden' ? 'overview' : s.scene === 'house' ? 'house' : s.cam,
    indaPose: 'stand', indaY: 0,
    boy: keepBoy ? { ...s.boy, pose: 'stand', y: 0 } : { ...s.boy, visible: false, pose: 'stand', y: 0 }
  });
  if (s.scene === 'garden') audio.setMood('garden');
}

export function completeChapter(id: ChapterId) {
  const g = useGame.getState();
  if (g.save.chapters[id]) return;
  g.patchSave((s) => ({ ...s, chapters: { ...s.chapters, [id]: true }, hearts: s.hearts.includes('heart:' + id) ? s.hearts : [...s.hearts, 'heart:' + id] }));
  audio.sfx('heart');
  useGame.getState().showToast('♥ Hati baru terkumpul · Bab selesai');
  if (id !== 'c7' && id !== 'final') afterChapter(id === 'c3');
  window.setTimeout(() => {
    const s = useGame.getState();
    const m = currentMission(s.save, s.scene);
    if (m && !s.dialogue && !s.modal && id !== 'c7') s.showToast('Misi baru: ' + m.title, 3800);
  }, 3400);
}

export function startChapter(id: ChapterId, replay = false) {
  const ch = getChapter(id, useGame.getState().config);
  applyStage(ch.stage);
  audio.sfx('chime');
  startDialogue(ch.lines, {
    chapter: id,
    onDone: () => {
      if (id === 'c7') { useGame.setState({ letterIntro: !replay, letterWhich: 'main' }); useGame.getState().openModal(replay ? null : 'openLetter'); return; }
      if (replay) { afterChapter(id === 'c3'); return; }
      completeChapter(id);
    }
  });
}

export function replayChapter(id: ChapterId) {
  const ch = CHAPTERS[id];
  useGame.getState().closeModal();
  if (id === 'final') { startFinal(true); return; }
  if (id === 'c0') { goScene('invitation'); return; }
  if (useGame.getState().scene !== ch.scene) goScene(ch.scene, { after: () => startChapter(id, true) });
  else startChapter(id, true);
}

export function houseObject(id: string, part: string) {
  const g = useGame.getState();
  const ch = getChapter('c3', g.config);
  const lines = ch.parts?.[part] ?? [];
  startDialogue(lines, {
    chapter: 'c3',
    onDone: () => {
      const s = useGame.getState();
      if (s.save.chapters.c3) return;
      const seen = s.save.c3seen.includes(part) ? s.save.c3seen : [...s.save.c3seen, part];
      s.patchSave((sv) => ({ ...sv, c3seen: seen }));
      if (seen.length >= 4) startDialogue(ch.parts?.end ?? [], { chapter: 'c3', onDone: () => completeChapter('c3') });
    }
  });
}

// Setelah surat utama ditutup: tandai selesai dan menuju adegan akhir.
export function finishLetterStory() {
  const s = useGame.getState();
  s.patchSave((sv) => ({ ...sv, letterRead: true }));
  useGame.setState({ letterIntro: false });
  completeChapter('c7');
  window.setTimeout(() => startFinal(false), 1400);
}

export function startFinal(replay: boolean) {
  const ch = CHAPTERS.final;
  goScene('final', {
    sfx: 'door',
    after: () => {
      audio.setMood('romantic');
      const timers: number[] = [];
      useGame.setState({ lamps: 0, finalPhase: 'cinema', boy: { visible: false, x: -0.6, z: 2.4, y: 0, pose: 'stand' }, indaPose: 'stand' });
      for (let i = 1; i <= 6; i++) timers.push(window.setTimeout(() => { useGame.setState({ lamps: i }); audio.sfx('pop'); }, 900 + i * 700));
      timers.push(window.setTimeout(() => { useGame.setState((st) => ({ boy: { ...st.boy, visible: true } })); audio.sfx('chime'); }, 5600));
      timers.push(window.setTimeout(() => {
        const lines: DialogueLine[] = getChapter('final', useGame.getState().config).lines;
        startDialogue(lines, { chapter: 'final', onDone: () => hugSequence(replay) });
      }, 7000));
      void ch;
    }
  });
}

function hugSequence(replay: boolean) {
  const s = useGame.getState();
  useGame.setState({ boy: { ...s.boy, x: 0.05, z: 2.4, pose: 'hug' }, indaPose: 'hug', stage: { boy: 'lembut', inda: 'malu', talking: null } });
  world.player.tx = 0.6; world.player.tz = 2.4;
  audio.sfx('heart');
  window.setTimeout(() => {
    useGame.setState({ finalPhase: 'title' });
    audio.sfx('win');
    if (!replay) {
      useGame.getState().patchSave((sv) => ({ ...sv, chapters: { ...sv.chapters, final: true }, hearts: sv.hearts.includes('heart:final') ? sv.hearts : [...sv.hearts, 'heart:final'] }));
    }
  }, 5200);
}

export function stayHere() {
  useGame.setState((s) => ({ finalPhase: 'free', indaPose: 'stand', boy: { ...s.boy, pose: 'stand', x: -0.4 } }));
  world.player.tx = 0.6; world.player.tz = 2.8;
}
