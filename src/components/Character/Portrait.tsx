import type { ExprId, Who } from '../../config/types';
import { EXPR } from '../../config/characters';
import { useGame } from '../../store/gameStore';

// Potret kecil (SVG pixel) untuk kotak dialog.
export function Portrait({ kind, expr }: { kind: Who; expr: ExprId }) {
  const theme = useGame((s) => s.config.theme);
  if (kind === 'narrator') return null;
  const e = EXPR[expr];
  const inda = kind === 'inda';
  const skin = inda ? '#ffdcc2' : '#f3c9a5';
  const eyeH = Math.max(1.5, 5 * e.es);
  const mouthY = 46 + 8 * e.smile;
  return (
    <svg viewBox="0 0 64 64" width="72" height="72" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="64" height="64" fill={inda ? '#dfeacb' : '#cfe3f2'} />
      {inda ? (
        <>
          <ellipse cx="32" cy="34" rx="26" ry="27" fill={theme.hijab} />
          <rect x="8" y="46" width="48" height="18" fill={theme.hijab} />
        </>
      ) : (
        <>
          <rect x="10" y="50" width="44" height="14" fill="#e5786a" />
        </>
      )}
      <ellipse cx="32" cy="36" rx="17" ry="17" fill={skin} />
      {inda ? <path d="M15 28 Q32 8 49 28 Q32 20 15 28Z" fill={theme.hijab} /> : <path d="M14 30 Q14 8 32 8 Q50 8 50 30 Q40 18 32 20 Q22 18 14 30Z" fill="#3b2c2a" />}
      {e.arc ? (
        <>
          <path d="M20 37 Q24 33 28 37" stroke="#2b1a17" strokeWidth="2" fill="none" />
          <path d="M36 37 Q40 33 44 37" stroke="#2b1a17" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <rect x="21" y={37 - eyeH / 2} width="5" height={eyeH} fill="#2b1a17" />
          <rect x="38" y={37 - eyeH / 2} width="5" height={eyeH} fill="#2b1a17" />
        </>
      )}
      <ellipse cx="19" cy="43" rx="4" ry="2.5" fill="#ff8fa3" opacity={0.2 + e.blush * 0.6} />
      <ellipse cx="45" cy="43" rx="4" ry="2.5" fill="#ff8fa3" opacity={0.2 + e.blush * 0.6} />
      {e.open > 0.4 ? <ellipse cx="32" cy="48" rx="4" ry="3" fill="#7a2e3a" /> : <path d={`M26 46 Q32 ${mouthY} 38 46`} stroke="#9c3d4a" strokeWidth="2" fill="none" />}
    </svg>
  );
}
