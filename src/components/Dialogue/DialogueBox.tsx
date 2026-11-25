import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../../store/gameStore';
import { advance, pickChoice, skipAll } from '../../systems/DialogueManager';
import { audio } from '../../systems/AudioManager';
import { Portrait } from '../Character/Portrait';

export function DialogueBox() {
  const d = useGame((s) => s.dialogue);
  const cfg = useGame((s) => s.config);
  const speed = useGame((s) => s.save.settings.textSpeed);
  const [auto, setAuto] = useState(false);
  const [shown, setShown] = useState(0);
  const [logOpen, setLogOpen] = useState(false);
  const shownRef = useRef(0);
  const line = d ? d.queue[d.index] : undefined;
  const text = line?.text ?? '';
  const done = shown >= text.length;
  const hold = !!d?.hold;

  useEffect(() => { shownRef.current = 0; setShown(0); }, [d?.index, d?.queue, text]);
  useEffect(() => {
    if (!line) return;
    const cps = speed === 'slow' ? 20 : speed === 'fast' ? 90 : 42;
    const id = window.setInterval(() => {
      const n = shownRef.current;
      if (n >= text.length) return;
      shownRef.current = n + 1; setShown(n + 1);
      if ((n + 1) % 3 === 0) audio.blip(line.who);
    }, 1000 / cps);
    return () => window.clearInterval(id);
  }, [line, speed, text]);

  const tap = useCallback(() => {
    if (!line) return;
    if (shownRef.current < text.length) { shownRef.current = text.length; setShown(text.length); return; }
    if (!line.choices) advance();
  }, [line, text]);

  useEffect(() => {
    if (!line || !auto || !done || line.choices || hold) return;
    const id = window.setTimeout(() => advance(), 1500 + text.length * 22);
    return () => window.clearTimeout(id);
  }, [auto, done, line, hold, text]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); tap(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap]);

  if (!d || !line) return null;
  const name = line.who === 'boy' ? cfg.sender : line.who === 'inda' ? cfg.receiver : '';
  const expr = line.who === 'boy' ? (line.boy ?? 'senang') : (line.inda ?? 'lembut');
  return (
    <>
      <div className="dlg-wrap">
        <div className="px dlg" onClick={tap} role="dialog" aria-live="polite">
          {line.who !== 'narrator' && <div className="dlg-portrait"><Portrait kind={line.who} expr={expr} /></div>}
          <div className="dlg-main">
            {name && <div className="dlg-name">{name}</div>}
            <p className="dlg-text">{text.slice(0, shown)}</p>
            {done && line.choices ? (
              <div className="dlg-choices">{line.choices.map((c, i) => <button key={i} className="pxbtn primary" onClick={(e) => { e.stopPropagation(); pickChoice(i); }}>{c.label}</button>)}</div>
            ) : done && !hold ? <span className="dlg-next" aria-hidden="true">▼</span> : null}
          </div>
          <div className="dlg-tools" onClick={(e) => e.stopPropagation()}>
            <button className="tool" title="Ulang baris" onClick={() => { shownRef.current = 0; setShown(0); }}>↺</button>
            <button className={'tool' + (auto ? ' on' : '')} title="Otomatis" onClick={() => setAuto(!auto)}>A</button>
            <button className="tool" title="Riwayat" onClick={() => setLogOpen(true)}>≡</button>
            <button className="tool" title="Lewati semua" onClick={() => skipAll()}>⏭</button>
          </div>
        </div>
      </div>
      {logOpen && (
        <div className="overlay" onClick={() => setLogOpen(false)}>
          <div className="px panel" onClick={(e) => e.stopPropagation()}>
            <div className="px-title"><span>Riwayat percakapan</span><button className="px-x" onClick={() => setLogOpen(false)}>✕</button></div>
            <div className="px-body log">
              {d.log.length === 0 && <p>Belum ada percakapan.</p>}
              {d.log.map((l, i) => <p key={i}><b>{l.who === 'boy' ? cfg.sender : cfg.receiver}:</b> {l.text}</p>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
