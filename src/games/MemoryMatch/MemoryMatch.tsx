import { useRef, useState } from 'react';
import { shuffle } from '../../utils/rng';
import { audio } from '../../systems/AudioManager';

const SYMS = ['⭐', '❤️', '🌸', '🔑', '🎁', '🌙'];
interface Card { id: number; s: string; open: boolean; done: boolean }

export function MemoryMatch({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState<Card[]>(() => shuffle([...SYMS, ...SYMS]).map((s, i) => ({ id: i, s, open: false, done: false })));
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const sel = useRef<number[]>([]);
  const tap = (i: number) => {
    if (lock) return;
    const c = cards[i];
    if (c.open || c.done) return;
    audio.sfx('pop');
    const next = cards.map((x, k) => (k === i ? { ...x, open: true } : x));
    setCards(next);
    sel.current.push(i);
    if (sel.current.length === 2) {
      const [a, b] = sel.current; sel.current = [];
      setMoves((m) => m + 1);
      if (next[a].s === next[b].s) {
        const nn = next.map((x, k) => (k === a || k === b ? { ...x, done: true } : x));
        setCards(nn); audio.sfx('chime');
        if (nn.every((x) => x.done)) window.setTimeout(onWin, 500);
      } else {
        setLock(true);
        window.setTimeout(() => { setCards((cs) => cs.map((x, k) => (k === a || k === b ? { ...x, open: false } : x))); setLock(false); }, 700);
      }
    }
  };
  return (
    <div className="stack center-text">
      <p>Langkah: <b>{moves}</b> · Pasangan: <b>{cards.filter((c) => c.done).length / 2}/6</b></p>
      <div className="mm-grid">
        {cards.map((c, i) => (
          <button key={c.id} className={'mm-card' + (c.open || c.done ? ' open' : '') + (c.done ? ' done' : '')} onClick={() => tap(i)} aria-label={c.open || c.done ? c.s : 'Kartu tertutup'}>
            <span className="mm-inner"><span className="mm-front">?</span><span className="mm-back">{c.s}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
