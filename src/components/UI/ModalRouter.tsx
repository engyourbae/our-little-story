import { useGame } from '../../store/gameStore';
import { AboutPanel, CalendarPanel, ChaptersPanel, ConfirmPanel, KeyFoundPanel, LettersPanel, LockPanel, MemoriesPanel, MenuPanel, MissionsPanel, SettingsPanel } from './Panels';
import { ArcadePanel, HeartsGame, HiddenGame, MemoryGame, PuzzleGame } from './ArcadePanel';
import { LetterReader, OpenLetterPrompt } from './LetterReader';
import { EditorPanel } from './Editor';
import { ErrorBoundary } from './ErrorBoundary';

export function ModalRouter() {
  const m = useGame((s) => s.modal);
  if (!m) return null;
  const body = (() => {
    switch (m) {
      case 'menu': return <MenuPanel />;
      case 'settings': return <SettingsPanel />;
      case 'chapters': return <ChaptersPanel />;
      case 'memories': return <MemoriesPanel />;
      case 'letters': return <LettersPanel />;
      case 'about': return <AboutPanel />;
      case 'editor': return <EditorPanel />;
      case 'arcade': return <ArcadePanel />;
      case 'missions': return <MissionsPanel />;
      case 'lock': return <LockPanel />;
      case 'keyFound': return <KeyFoundPanel />;
      case 'calendar': return <CalendarPanel />;
      case 'openLetter': return <OpenLetterPrompt />;
      case 'letter': return <LetterReader />;
      case 'game:memory': return <MemoryGame />;
      case 'game:puzzle': return <PuzzleGame />;
      case 'game:hearts': return <HeartsGame />;
      case 'game:hidden': return <HiddenGame />;
      case 'hiddenWin': return <HiddenGame win />;
      case 'confirmNew': return <ConfirmPanel kind="new" />;
      case 'confirmReset': return <ConfirmPanel kind="reset" />;
      default: return null;
    }
  })();
  return <ErrorBoundary label={'modal-' + m} fallback={<div className="overlay"><div className="px panel"><p>Ada yang salah di panel ini.</p><button className="pxbtn" onClick={() => useGame.getState().closeModal()}>Tutup</button></div></div>}>{body}</ErrorBoundary>;
}
