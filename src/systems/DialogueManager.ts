import type { ChapterId, DialogueLine } from '../config/types';
import { useGame } from '../store/gameStore';
import { audio } from './AudioManager';
import { world } from './world';

function setAnim(who: 'boy' | 'inda', a: 'wave' | 'hop') {
  useGame.setState((s) => ({ fxAnim: { ...s.fxAnim, [who]: a } }));
  window.setTimeout(() => useGame.setState((s) => ({ fxAnim: { ...s.fxAnim, [who]: null } })), 1700);
}

export function runFx(name: string) {
  const g = useGame.getState();
  switch (name) {
    case 'bloom': useGame.setState({ bloom: 1 }); audio.sfx('chime'); break;
    case 'waveInda': setAnim('inda', 'wave'); break;
    case 'hopInda': setAnim('inda', 'hop'); break;
    case 'waveBoy': setAnim('boy', 'wave'); break;
    case 'lamp+': useGame.setState({ lamps: g.lamps + 1 }); audio.sfx('pop'); break;
    default: break;
  }
}

function applyLine(line?: DialogueLine) {
  if (!line) return;
  const g = useGame.getState();
  useGame.setState({
    stage: { boy: line.boy ?? g.stage.boy, inda: line.inda ?? g.stage.inda, talking: line.who === 'narrator' ? null : line.who }
  });
  if (line.mood) audio.setMood(line.mood);
  line.fx?.forEach(runFx);
  if (line.hold) {
    useGame.setState((s) => (s.dialogue ? { dialogue: { ...s.dialogue, hold: true } } : {}));
    window.setTimeout(() => useGame.setState((s) => (s.dialogue ? { dialogue: { ...s.dialogue, hold: false } } : {})), line.hold);
  }
}

export function startDialogue(lines: DialogueLine[], opts: { onDone?: () => void; chapter?: ChapterId } = {}) {
  if (!lines.length) { opts.onDone?.(); return; }
  useGame.setState({ dialogue: { queue: [...lines], index: 0, log: [], onDone: opts.onDone, chapter: opts.chapter, hold: false }, markerId: null });
  applyLine(lines[0]);
}

export function endDialogue() {
  const d = useGame.getState().dialogue;
  if (!d) return;
  useGame.setState((s) => ({ dialogue: null, stage: { ...s.stage, talking: null } }));
  useGame.getState().refreshMission();
  d.onDone?.();
}

export function advance() {
  const d = useGame.getState().dialogue;
  if (!d || d.hold) return;
  const cur = d.queue[d.index];
  if (cur?.choices) return;
  audio.sfx('click');
  const next = d.index + 1;
  const log = [...d.log, { who: cur.who, text: cur.text }];
  if (next >= d.queue.length) { useGame.setState({ dialogue: { ...d, log } }); endDialogue(); return; }
  useGame.setState({ dialogue: { ...d, index: next, log } });
  applyLine(d.queue[next]);
}

export function pickChoice(i: number) {
  const d = useGame.getState().dialogue;
  if (!d) return;
  const cur = d.queue[d.index];
  const choice = cur?.choices?.[i];
  if (!choice) return;
  audio.sfx('pop');
  const q = [...d.queue];
  q.splice(d.index, 1, ...choice.reply);
  const log = [...d.log, { who: 'inda' as const, text: choice.label }];
  if (d.index >= q.length) { useGame.setState({ dialogue: { ...d, queue: q, log } }); endDialogue(); return; }
  useGame.setState({ dialogue: { ...d, queue: q, log } });
  applyLine(q[d.index]);
}

// Lewati semua dialog tetapi tetap menjalankan efek (mis. bunga mekar).
export function skipAll() {
  const d = useGame.getState().dialogue;
  if (!d) return;
  const run = (lines: DialogueLine[]) => lines.forEach((l) => { l.fx?.forEach(runFx); if (l.choices?.[0]) run(l.choices[0].reply); });
  run(d.queue.slice(d.index));
  const last = d.queue[d.queue.length - 1];
  if (last) useGame.setState((s) => ({ stage: { ...s.stage, boy: last.boy ?? s.stage.boy, inda: last.inda ?? s.stage.inda } }));
  endDialogue();
}
export const isWalking = () => world.player.tx !== null;
