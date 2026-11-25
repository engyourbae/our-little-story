import { Canvas } from '@react-three/fiber';
import { useGame } from '../store/gameStore';
import { useQuality } from '../hooks/useQuality';
import { SceneSwitch } from '../scenes/SceneSwitch';
import { ErrorBoundary } from '../components/UI/ErrorBoundary';

export function Game() {
  const q = useQuality();
  const quality = useGame((s) => s.save.settings.quality);
  return (
    <div className="canvas-wrap">
      <ErrorBoundary label="canvas" fallback={<div className="fallback px">Grafik 3D tidak bisa dimuat di perangkat ini. Coba kualitas Low atau browser lain.</div>}>
        <Canvas
          key={quality}
          flat
          shadows={q.shadows}
          dpr={[1, q.dpr]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 30, near: 0.1, far: 220, position: [20, 18, 22] }}
          onCreated={({ gl }) => { gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault()); }}
        >
          <SceneSwitch />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
