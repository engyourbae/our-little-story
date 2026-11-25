import { useGame } from '../../store/gameStore';
import { PixelPanel, PxButton } from './PixelPanel';
import { MiniGameShell } from '../../games/MiniGameShell';
import { MemoryMatch } from '../../games/MemoryMatch/MemoryMatch';
import { PhotoPuzzle } from '../../games/PhotoPuzzle/PhotoPuzzle';
import { HeartCollection } from '../../games/HeartCollection/HeartCollection';
import { startHidden } from '../../games/HiddenObject/hidden';

const close = () => useGame.getState().closeModal();

export function ArcadePanel() {
  const cfg = useGame((s) => s.config);
  const mini = useGame((s) => s.save.mini);
  const open = (m: 'game:memory' | 'game:puzzle' | 'game:hearts' | 'game:hidden') => useGame.getState().openModal(m);
  const games: [boolean, 'game:memory' | 'game:puzzle' | 'game:hearts' | 'game:hidden', string, string, boolean][] = [
    [cfg.miniGames.hidden, 'game:hidden', 'Benda Tersembunyi', 'Cari bintang, hati, dan bunga di taman', !!mini.hidden],
    [cfg.miniGames.memory, 'game:memory', 'Memory Match', 'Cocokkan pasangan kartu', !!mini.memory],
    [cfg.miniGames.puzzle, 'game:puzzle', 'Photo Puzzle', 'Susun potongan foto', !!mini.puzzle],
    [cfg.miniGames.hearts, 'game:hearts', 'Heart Collection', 'Kumpulkan hati dari kotak hadiah', !!mini.hearts]
  ];
  return (
    <PixelPanel title="Arcade kecil" onClose={close}>
      <div className="stack">
        {games.filter((g) => g[0]).map(([, id, name, desc, won]) => (
          <div key={id} className="chapter-row"><span className="chapter-name"><b>{name} {won ? '✔' : ''}</b><small>{desc}</small></span><PxButton small primary onClick={() => open(id)}>Main</PxButton></div>
        ))}
      </div>
    </PixelPanel>
  );
}

export function MemoryGame() {
  return (
    <MiniGameShell id="memory" title="Memory Match" intro="Balik kartu dan temukan semua pasangannya." rules={['Ketuk kartu untuk membalik', 'Cocokkan 6 pasang', 'Semakin sedikit langkah, semakin keren']}>
      {(win) => <MemoryMatch onWin={win} />}
    </MiniGameShell>
  );
}
export function PuzzleGame() {
  return (
    <MiniGameShell id="puzzle" title="Photo Puzzle" intro="Susun potongan foto menjadi satu gambar utuh." rules={['Ketuk satu potongan, lalu potongan lain untuk bertukar', 'Potongan yang benar diberi bingkai hijau', 'Foto bisa diganti lewat Editor']}>
      {(win) => <PhotoPuzzle onWin={win} />}
    </MiniGameShell>
  );
}
export function HeartsGame() {
  return (
    <MiniGameShell id="hearts" title="Heart Collection" intro="Buka kotak hadiah dan kumpulkan semua hati." rules={['Ada 12 kotak, 6 di antaranya menyimpan hati', 'Ketuk kotak untuk membukanya', 'Kumpulkan 6 hati untuk menang']}>
      {(win) => <HeartCollection onWin={win} />}
    </MiniGameShell>
  );
}
export function HiddenGame({ win = false }: { win?: boolean }) {
  return (
    <MiniGameShell id="hidden" title="Benda Tersembunyi" startStage={win ? 'win' : 'intro'} onStart={startHidden}
      intro="Ada tiga benda yang bersinar tersembunyi di taman: bintang, hati, dan bunga."
      rules={['Setelah Mulai, jelajahi taman', 'Ketuk benda yang bersinar untuk menemukannya', 'Tombol ? memberi petunjuk lokasi']} />
  );
}
