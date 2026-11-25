import { useState } from 'react';
import { useGame } from '../../store/gameStore';
import { shuffle } from '../../utils/rng';
import { audio } from '../../systems/AudioManager';

const N = 3;
const solved = (o: number[]) => o.every((v, i) => v === i);
const fresh = () => { let o = shuffle(Array.from({ length: N * N }, (_, i) => i)); while (solved(o)) o = shuffle(o); return o; };

export function PhotoPuzzle({ onWin }: { onWin: () => void }) {
  const src = useGame((s) => s.config.photos[0]?.src ?? '');
  const [order, setOrder] = useState<number[]>(fresh);
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const tap = (i: number) => {
    audio.sfx('pop');
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    const o = [...order]; [o[sel], o[i]] = [o[i], o[sel]];
    setOrder(o); setSel(null); setMoves((m) => m + 1);
    if (solved(o)) { audio.sfx('chime'); window.setTimeout(onWin, 500); }
  };
  return (
    <div className="stack center-text">
      <p>Langkah: <b>{moves}</b> · Benar: <b>{order.filter((v, i) => v === i).length}/{N * N}</b></p>
      <div className="pz-grid">
        {order.map((piece, i) => (
          <button key={i} className={'pz-tile' + (sel === i ? ' sel' : '') + (piece === i ? ' ok' : '')} onClick={() => tap(i)} aria-label={'Potongan ' + (i + 1)}
            style={{ backgroundImage: `url("${src}")`, backgroundSize: `${N * 100}% ${N * 100}%`, backgroundPosition: `${(piece % N) * (100 / (N - 1))}% ${Math.floor(piece / N) * (100 / (N - 1))}%` }} />
        ))}
      </div>
      <p className="muted">Ketuk dua potongan untuk saling bertukar.</p>
    </div>
  );
}
