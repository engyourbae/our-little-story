import type { ReactNode } from 'react';
import { audio } from '../../systems/AudioManager';

export function PixelPanel({ title, onClose, children, wide = false }: { title: string; onClose?: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="overlay">
      <div className={'px panel' + (wide ? ' wide' : '')} role="dialog" aria-label={title}>
        <div className="px-title"><span>{title}</span>{onClose && <button className="px-x" onClick={() => { audio.sfx('click'); onClose(); }} aria-label="Tutup">✕</button>}</div>
        <div className="px-body">{children}</div>
      </div>
    </div>
  );
}
export function PxButton({ children, onClick, primary = false, disabled = false, small = false }: { children: ReactNode; onClick?: () => void; primary?: boolean; disabled?: boolean; small?: boolean }) {
  return <button className={'pxbtn' + (primary ? ' primary' : '') + (small ? ' small' : '')} disabled={disabled} onClick={() => { audio.sfx('click'); onClick?.(); }}>{children}</button>;
}
