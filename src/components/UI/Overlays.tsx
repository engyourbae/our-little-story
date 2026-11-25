import { useGame } from '../../store/gameStore';

export function Fade() { const f = useGame((s) => s.fading); return <div className={'fade' + (f ? ' on' : '')} aria-hidden="true" />; }
export function Toast() { const t = useGame((s) => s.toast); return t ? <div className="toast px" role="status">{t}</div> : null; }
export function HoverLabel() {
  const h = useGame((s) => s.hover);
  const d = useGame((s) => !!s.dialogue);
  return h && !d ? <div className="hover-label px" aria-hidden="true">{h}</div> : null;
}
