import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../store/gameStore';
import { useQuality } from '../../hooks/useQuality';
import { Interactive } from '../../components/InteractiveObject/Interactive';
import { Actor } from '../../components/Character/Actor';
import { ErrorBoundary } from '../../components/UI/ErrorBoundary';
import { PlayerController } from '../shared/PlayerController';
import { Box, Cyl, Sph } from '../shared/props';

const BOOKS = ['#c0554a', '#4a7fa8', '#e0b04a', '#5a9a6a', '#8a5fa8', '#d9805a', '#3f6b78'];

function Bookshelf() {
  const rows = [0.5, 1.2, 1.9];
  return (
    <Interactive id="bookshelf" label="Rak buku" position={[2.0, 0, -3.62]} hits={[{ s: [2.3, 2.9, 0.8], p: [0, 1.45, 0] }]} my={3.4}>
      <Box p={[0, 1.4, 0]} s={[2.2, 2.8, 0.6]} c="#8a5a35" />
      {rows.map((y, r) => (
        <group key={r}>
          <Box p={[0, y + 0.55, 0.05]} s={[2.0, 0.06, 0.5]} c="#9a6a40" cast={false} />
          {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-0.85 + i * 0.21, y + 0.28, 0.1]} s={[0.15, 0.45 + ((i * 7 + r * 3) % 4) * 0.04, 0.34]} c={BOOKS[(i + r * 2) % 7]} cast={false} />)}
        </group>
      ))}
    </Interactive>
  );
}

function FloatingHeart() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (g.current) { g.current.position.y = 1.15 + Math.sin(clock.elapsedTime * 2.2) * 0.08; g.current.rotation.y = clock.elapsedTime * 1.4; } });
  return (
    <group ref={g}>
      <Sph p={[-0.09, 0.06, 0]} r={0.13} c="#ff5a7a" em="#ff5a7a" ei={0.6} cast={false} /><Sph p={[0.09, 0.06, 0]} r={0.13} c="#ff5a7a" em="#ff5a7a" ei={0.6} cast={false} />
      <Box p={[0, -0.05, 0]} s={[0.19, 0.19, 0.12]} rot={[0, 0, Math.PI / 4]} c="#ff5a7a" em="#ff5a7a" ei={0.6} cast={false} />
    </group>
  );
}

export default function HouseScene() {
  const save = useGame((s) => s.save);
  const q = useQuality();
  const secretOpen = !!save.chapters.c6 && save.hiddenDone;
  return (
    <>
      <ambientLight intensity={0.95} color="#fff0d8" />
      <hemisphereLight args={['#fff3dd', '#a8744f', 0.5]} />
      <directionalLight position={[8, 12, 8]} intensity={1.6} color="#ffe9c4" castShadow={q.shadows} shadow-mapSize-width={q.shadowMap} shadow-mapSize-height={q.shadowMap} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-bias={-0.0004} />
      {q.pointLights && <pointLight position={[-2.6, 1.0, -3]} intensity={8} distance={6} color="#ff9a52" />}

      {/* lantai & dinding (potongan diorama) */}
      <Box p={[0, -0.1, 0]} s={[10, 0.2, 8]} c="#b86f4a" cast={false} />
      {[-3, -1.5, 0, 1.5, 3].map((z) => <Box key={z} p={[0, 0.005, z]} s={[10, 0.012, 0.03]} c="#9c5a38" cast={false} />)}
      <Box p={[0, -0.8, 0]} s={[10.2, 1.4, 8.2]} c="#b9684a" cast={false} />
      <Box p={[0, -1.7, 0]} s={[10.2, 0.4, 8.2]} c="#8a4630" cast={false} />
      <Box p={[0, 1.7, -4.1]} s={[10.4, 3.4, 0.2]} c="#efe5cf" />
      <Box p={[-5.1, 1.7, 0]} s={[0.2, 3.4, 8.4]} c="#e8dec6" />
      <Box p={[0, 0.2, -3.98]} s={[10, 0.4, 0.06]} c="#c9b99a" cast={false} /><Box p={[-4.98, 0.2, 0]} s={[0.06, 0.4, 8]} c="#c9b99a" cast={false} />
      <Box p={[0, 3.3, -3.95]} s={[10, 0.12, 0.12]} c="#8a5a35" cast={false} />

      {/* karpet */}
      <Box p={[0, 0.015, 0.3]} s={[4.7, 0.03, 3.3]} c="#5fb3ad" cast={false} /><Box p={[0, 0.035, 0.3]} s={[4.2, 0.03, 2.8]} c="#d98a62" cast={false} /><Box p={[0, 0.055, 0.3]} s={[1.6, 0.02, 1.2]} c="#f1d9a8" cast={false} />

      {/* perapian */}
      <Box p={[-2.6, 1.3, -3.65]} s={[2, 2.6, 0.7]} c="#b5553a" />
      {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[-2.6, 0.4 + i * 0.5, -3.28]} s={[2.02, 0.03, 0.02]} c="#8f3f2b" cast={false} />)}
      <Box p={[-2.6, 0.5, -3.3]} s={[1.1, 0.95, 0.1]} c="#2a1b17" cast={false} /><Box p={[-2.6, 1.3, -3.2]} s={[2.4, 0.14, 0.9]} c="#8a5a35" />
      <Cyl p={[-3.1, 1.55, -3.2]} rt={0.17} rb={0.17} h={0.05} c="#f4efe3" rot={[Math.PI / 2, 0, 0]} /><Cyl p={[-2.2, 1.55, -3.2]} rt={0.08} rb={0.1} h={0.3} c="#7ec3c9" />

      <Bookshelf />
      <Interactive id="photoFrame" label="Foto kenangan" position={[-0.2, 2.0, -3.95]} hits={[{ s: [1.2, 1, 0.4] }]} my={0.9}>
        <Box s={[0.95, 0.75, 0.08]} c="#5b3a28" /><Box p={[0, 0, 0.05]} s={[0.78, 0.58, 0.04]} c="#f6c1c9" cast={false} /><Sph p={[0, 0, 0.09]} r={0.1} sc={[1, 1, 0.3]} c="#d9505f" cast={false} seg={8} />
      </Interactive>

      {/* jendela di dinding kiri */}
      <Box p={[-4.95, 1.9, -0.8]} s={[0.08, 1.4, 1.4]} c="#7a5538" cast={false} /><Box p={[-4.9, 1.9, -0.8]} s={[0.06, 1.2, 1.2]} c="#9ed6f0" em="#bfe6ff" ei={0.7} cast={false} />

      {/* sofa + bantal */}
      <Box p={[-4.1, 0.25, 0.2]} s={[1.3, 0.5, 2.5]} c="#3fa29b" /><Box p={[-4.65, 0.75, 0.2]} s={[0.3, 0.95, 2.5]} c="#378f89" />
      <Box p={[-4.1, 0.55, 0.2]} s={[1.1, 0.1, 2.3]} c="#47b0a8" cast={false} />
      <Interactive id="cushion" label="Bantal kecil" position={[-4.0, 0.72, 0.9]} hits={[{ s: [0.9, 0.7, 0.9] }]} my={0.9}>
        <Box s={[0.5, 0.2, 0.5]} rot={[0.1, 0.5, 0.2]} c="#f08a5d" />
      </Interactive>

      {/* meja + hati + kotak musik */}
      <Box p={[-0.2, 0.55, 0.0]} s={[1.9, 0.1, 1.1]} c="#7a4a2c" />
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], i) => <Box key={i} p={[x - 0.2, 0.25, z]} s={[0.1, 0.5, 0.1]} c="#6b3f25" />)}
      <Sph p={[-0.8, 0.8, -0.1]} r={0.2} sc={[1, 0.8, 1]} c="#f4efe3" /><Sph p={[0.55, 0.72, 0.2]} r={0.1} c="#f4efe3" cast={false} seg={8} />
      <Cyl p={[0.2, 0.74, -0.25]} rt={0.17} rb={0.17} h={0.24} c="#c0392b" /><Box p={[0.2, 0.98, -0.25]} s={[0.03, 0.12, 0.03]} c="#fff1a8" cast={false} em="#ffd98a" ei={1} />
      <Interactive id="heartObj" label="Hati kecil" position={[-0.6, 0, 0.1]} hits={[{ s: [0.8, 0.8, 0.8], p: [0, 1.1, 0] }]} my={1.7}><FloatingHeart /></Interactive>
      <Interactive id="musicbox" label="Kotak musik" position={[0.55, 0.6, -0.1]} hits={[{ s: [0.6, 0.6, 0.6], p: [0, 0.2, 0] }]} my={0.9}>
        <Box p={[0, 0.1, 0]} s={[0.4, 0.2, 0.3]} c="#e0b04a" /><Box p={[0, 0.24, -0.04]} s={[0.4, 0.08, 0.22]} rot={[-0.4, 0, 0]} c="#c99a36" />
      </Interactive>

      {/* kursi + boneka */}
      <Box p={[2.6, 0.3, 1.0]} s={[1.2, 0.6, 1.2]} c="#efe7d3" /><Box p={[2.6, 0.9, 0.5]} s={[1.2, 0.8, 0.2]} c="#e5dcc4" /><Box p={[2.6, 0.08, 1.0]} s={[1.4, 0.16, 1.4]} c="#8a5a35" />
      <Interactive id="doll" label="Boneka lucu" position={[2.6, 0.65, 1.1]} hits={[{ s: [0.8, 0.9, 0.8], p: [0, 0.3, 0] }]} my={1.1}>
        <Sph p={[0, 0.15, 0]} r={0.22} c="#c98a5a" /><Sph p={[0, 0.48, 0]} r={0.18} c="#c98a5a" /><Sph p={[-0.14, 0.62, 0]} r={0.07} c="#c98a5a" seg={8} /><Sph p={[0.14, 0.62, 0]} r={0.07} c="#c98a5a" seg={8} />
        <Sph p={[0, 0.45, 0.16]} r={0.06} c="#f1d9b8" seg={8} cast={false} /><Sph p={[-0.07, 0.52, 0.16]} r={0.02} c="#2b1a17" seg={6} cast={false} /><Sph p={[0.07, 0.52, 0.16]} r={0.02} c="#2b1a17" seg={6} cast={false} />
      </Interactive>

      {/* meja kerja + laptop */}
      <Box p={[4.0, 0.8, -3.2]} s={[1.9, 0.1, 0.9]} c="#7a4a2c" />
      {[[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].map(([x, z], i) => <Box key={i} p={[4.0 + x, 0.4, -3.2 + z]} s={[0.08, 0.8, 0.08]} c="#6b3f25" />)}
      <Interactive id="laptop" label="Laptop kenangan" position={[3.9, 0.85, -3.2]} hits={[{ s: [0.9, 0.7, 0.8], p: [0, 0.3, 0] }]} my={1.3}>
        <Box p={[0, 0.03, 0.05]} s={[0.7, 0.05, 0.5]} c="#c9ccd1" /><Box p={[0, 0.32, -0.2]} rot={[-0.15, 0, 0]} s={[0.7, 0.5, 0.04]} c="#b8bcc2" /><Box p={[0, 0.32, -0.17]} rot={[-0.15, 0, 0]} s={[0.6, 0.4, 0.03]} c="#69e0d0" em="#69e0d0" ei={0.9} cast={false} />
      </Interactive>
      <Cyl p={[4.7, 1.0, -3.3]} rt={0.1} rb={0.16} h={0.3} c="#e7d7a8" em="#ffe2a0" ei={0.5} /><Sph p={[-4.5, 0.2, 2.9]} r={0.01} c="#fff" cast={false} seg={6} />
      <Cyl p={[4.4, 0.25, 2.1]} rt={0.28} rb={0.22} h={0.5} c="#b86f4a" /><Sph p={[4.4, 0.8, 2.1]} r={0.4} sc={[1, 1.1, 1]} c="#4a9a55" /><Sph p={[4.6, 1.1, 2.0]} r={0.3} c="#5aaa65" />

      {/* pintu keluar & pintu rahasia */}
      <Interactive id="exitDoor" label="Pintu keluar" position={[-4.92, 1.1, 3.2]} hits={[{ s: [0.8, 2.4, 1.5] }]} my={1.9}>
        <Box s={[0.14, 2.2, 1.1]} c="#7a4a2c" /><Box p={[0.08, 0, 0.35]} s={[0.06, 0.1, 0.1]} c="#e8c26a" cast={false} />
      </Interactive>
      {secretOpen && !save.chapters.c7 && (
        <Interactive id="secretDoor" label="Pintu rahasia" position={[-4.9, 1.1, -2.7]} hits={[{ s: [0.8, 2.6, 1.6] }]} my={2.1}>
          <Box s={[0.14, 2.2, 1.1]} c="#7b5aa6" em="#c9a6ff" ei={0.7} /><Box p={[0.08, 0, 0.35]} s={[0.06, 0.1, 0.1]} c="#ffe08a" em="#ffe08a" ei={1} cast={false} />
          <Sparkles count={14} scale={[0.5, 2.4, 1.4]} size={4} speed={0.5} color="#e3c9ff" />
        </Interactive>
      )}
      {secretOpen && save.chapters.c7 && (
        <Interactive id="secretDoor" label="Ruang rahasia" position={[-4.9, 1.1, -2.7]} hits={[{ s: [0.8, 2.6, 1.6] }]} my={2.1}>
          <Box s={[0.14, 2.2, 1.1]} c="#7b5aa6" em="#c9a6ff" ei={0.5} />
        </Interactive>
      )}

      <PlayerController scene="house" w={10} d={8} />
      <ErrorBoundary label="inda"><Actor who="inda" /></ErrorBoundary>
      <ErrorBoundary label="boy"><Actor who="boy" /></ErrorBoundary>
    </>
  );
}
