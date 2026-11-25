import { useMemo, type CSSProperties } from 'react';

export function FloatingHearts({ n = 14 }: { n?: number }) {
  const items = useMemo(() => Array.from({ length: n }, (_, i) => ({ left: 5 + ((i * 37) % 90), delay: (i % 7) * 0.9, dur: 6 + (i % 5), size: 14 + (i % 4) * 6 })), [n]);
  return (
    <div className="hearts" aria-hidden="true">
      {items.map((h, i) => <span key={i} style={{ left: h.left + '%', animationDelay: h.delay + 's', animationDuration: h.dur + 's', fontSize: h.size } as CSSProperties}>♥</span>)}
    </div>
  );
}
