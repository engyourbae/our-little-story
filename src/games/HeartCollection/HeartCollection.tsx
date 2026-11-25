import { useMemo, useState } from 'react';
import { shuffle } from '../../utils/rng';
import { audio } from '../../systems/AudioManager';

export function HeartCollection({ onWin }: { onWin: () => void }) {
  const hearts = useMemo(() => new Set(shuffle(Array.from({ length: 12 }, (_, i) => i)).slice(0, 6)), []);
  const [opened, setOpened] = useState<number[]>([]);
  const found = opened.filter((i) => hearts.has(i)).length;
  const tap = (i: number) => {
    if (opened.includes(i)) return;
    const o = [...opened, i]; setOpened(o);
    if (hearts.has(i)) { audio.sfx('heart'); if (o.filter((x) => hearts.has(x)).length === 6) window.setTimeout(onWin, 600); } else audio.sfx('pop');
  };
  return (
    <div className="stack center-text">
      <p>Hati ditemukan: <b>{found}/6</b> · Kotak dibuka: <b>{opened.length}</b></p>
      <div className="hc-grid">
        {Array.from({ length: 12 }, (_, i) => {
          const o = opened.includes(i);
          return <button key={i} className={'hc-box' + (o ? ' open' : '')} onClick={() => tap(i)} aria-label={o ? (hearts.has(i) ? 'Hati' : 'Kosong') : 'Kotak hadiah'}>{o ? (hearts.has(i) ? '❤️' : '✨') : '🎁'}</button>;
        })}
      </div>
    </div>
  );
}
