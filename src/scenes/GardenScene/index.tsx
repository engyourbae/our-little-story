import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../store/gameStore';
import { useQuality } from '../../hooks/useQuality';
import { Interactive } from '../../components/InteractiveObject/Interactive';
import { Actor } from '../../components/Character/Actor';
import { ErrorBoundary } from '../../components/UI/ErrorBoundary';
import { PlayerController } from '../shared/PlayerController';
import { Box, Bush, Butterflies, Chicken, Cone, Cyl, Fence, Flowers, Lamp, Pine, Sph, Tree, Bench } from '../shared/props';
import { HIDDEN_SPOTS, type V3 } from '../../config/world';

const FLOWER_COLORS = ['#ffffff', '#ffd1e0', '#fff1a8', '#ffb3c7', '#e4d0ff'];
const MEADOW: [number, number, number, number] = [-10, 3.8, -3.8, 8.8];
const EDGE: [number, number, number, number] = [-3, 8.2, 10, 8.9];

function House({ night }: { night: boolean }) {
  const th = 0.5, hd = 3.1;
  const gable = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-hd + 0.4, 0); s.lineTo(hd - 0.4, 0); s.lineTo(0, (hd - 0.4) * Math.tan(th)); return new THREE.ShapeGeometry(s); }, []);
  const glass = night ? '#ffd98a' : '#6fc0c4';
  const win = (x: number) => (
    <group key={x} position={[x, 1.9, -3.46]}>
      <Box s={[1.05, 1.25, 0.1]} c="#7a5538" />
      <Box p={[0, 0, 0.04]} s={[0.85, 1.05, 0.08]} c={glass} em={night ? '#ffcf7a' : undefined} ei={0.9} cast={false} />
      <Box p={[0, 0, 0.1]} s={[0.07, 1.05, 0.05]} c="#7a5538" cast={false} /><Box p={[0, 0, 0.1]} s={[0.85, 0.07, 0.05]} c="#7a5538" cast={false} />
    </group>
  );
  return (
    <group position={[0, 0, -6.2]}>
      <Box p={[0, 1.6, 0]} s={[8, 3.2, 5.4]} c="#efe7d3" />
      <Box p={[0, 0.08, 0]} s={[8.1, 0.16, 5.5]} c="#9a9588" />
      <Box p={[0, 4.05, -1.55]} rot={[-th, 0, 0]} s={[8.8, 0.2, hd / Math.cos(th)]} c="#5d7b52" />
      <Box p={[0, 4.05, 1.55]} rot={[th, 0, 0]} s={[8.8, 0.2, hd / Math.cos(th)]} c="#5d7b52" />
      <Box p={[0, 4.9, 0]} s={[8.9, 0.15, 0.25]} c="#46633f" />
      {[-4, 4].map((x) => <mesh key={x} geometry={gable} position={[x, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}><meshStandardMaterial color="#efe7d3" side={THREE.DoubleSide} /></mesh>)}
      <Box p={[2.7, 5, -0.7]} s={[0.8, 1.4, 0.8]} c="#d8ccb0" />
      {[-2.9, -1.5, 1.6, 3.0].map(win)}
      <Box p={[0, 3.0, -2.75]} s={[8, 0.12, 0.1]} c="#7a5538" cast={false} />
      {[-0.95, 0.95].map((x) => <Box key={x} p={[x, 2.3, -2.78]} s={[0.22, 0.34, 0.22]} c="#d9d4c0" em={night ? '#ffcf7a' : undefined} ei={1.6} cast={false} />)}
    </group>
  );
}

function StringLights({ from, to, glow }: { from: V3; to: V3; glow: number }) {
  const pts = useMemo(() => Array.from({ length: 16 }, (_, i) => { const t = i / 15; return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t - Math.sin(Math.PI * t) * 0.7, from[2] + (to[2] - from[2]) * t] as V3; }), [from, to]);
  const cols = ['#ffd98a', '#ffb3c7', '#fff6d6'];
  return <group>{pts.map((q, i) => <Sph key={i} p={q} r={0.09} c={cols[i % 3]} em={cols[i % 3]} ei={0.5 + glow * 1.8} cast={false} seg={8} />)}</group>;
}

function HiddenThing({ index, type, spot }: { index: number; type: 'star' | 'heart' | 'flower'; spot: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (g.current) { g.current.rotation.y = clock.elapsedTime * 2; g.current.position.y = HIDDEN_SPOTS[spot].p[1] + Math.sin(clock.elapsedTime * 2.5 + index) * 0.06; } });
  const col = type === 'star' ? '#ffd24a' : type === 'heart' ? '#ff5a7a' : '#ff9ad5';
  return (
    <Interactive id={'hid' + index} label={type === 'star' ? 'Bintang' : type === 'heart' ? 'Hati' : 'Bunga'} position={[HIDDEN_SPOTS[spot].p[0], 0, HIDDEN_SPOTS[spot].p[2]]} hits={[{ s: [1, 1, 1], p: [0, HIDDEN_SPOTS[spot].p[1], 0] }]} my={HIDDEN_SPOTS[spot].p[1] + 0.8}>
      <group ref={g} position={[0, HIDDEN_SPOTS[spot].p[1], 0]}>
        {type === 'star' && <mesh><octahedronGeometry args={[0.2, 0]} /><meshBasicMaterial color={col} /></mesh>}
        {type === 'heart' && <><Sph p={[-0.07, 0.05, 0]} r={0.1} c={col} em={col} cast={false} seg={8} /><Sph p={[0.07, 0.05, 0]} r={0.1} c={col} em={col} cast={false} seg={8} /><Box p={[0, -0.04, 0]} s={[0.15, 0.15, 0.1]} rot={[0, 0, Math.PI / 4]} c={col} em={col} cast={false} /></>}
        {type === 'flower' && <><Sph r={0.1} c="#ffe566" em="#ffe566" cast={false} seg={8} />{[0, 1, 2, 3, 4].map((i) => <Sph key={i} p={[Math.cos(i * 1.256) * 0.14, Math.sin(i * 1.256) * 0.14, 0]} r={0.08} c={col} em={col} cast={false} seg={8} />)}</>}
        <Sparkles count={10} scale={0.9} size={3} speed={0.6} color="#fff2a8" />
      </group>
    </Interactive>
  );
}

export default function GardenScene() {
  const scene = useGame((s) => s.scene);
  const lamps = useGame((s) => s.lamps);
  const glow = useGame((s) => s.glow);
  const hidden = useGame((s) => s.hidden);
  const finalPhase = useGame((s) => s.finalPhase);
  const q = useQuality();
  const night = scene !== 'garden';
  const lampsOn = scene === 'final' ? lamps : night ? 6 : 0;
  const playable = scene === 'garden' || (scene === 'final' && finalPhase === 'free');
  const showActors = scene === 'garden' || scene === 'final';
  const lampPos: V3[] = [[-1.6, 0, 6.8], [1.6, 0, 6.8], [-1.6, 0, 4.4], [1.6, 0, 4.4], [-1.6, 0, 0.2], [1.6, 0, 0.2]];
  const shadowProps = { 'shadow-mapSize-width': q.shadowMap, 'shadow-mapSize-height': q.shadowMap, 'shadow-camera-left': -16, 'shadow-camera-right': 16, 'shadow-camera-top': 16, 'shadow-camera-bottom': -16, 'shadow-camera-near': 1, 'shadow-camera-far': 60, 'shadow-bias': -0.0004 };

  return (
    <>
      {night ? (
        <>
          <ambientLight intensity={0.75} color="#8aa0ff" />
          <hemisphereLight args={['#7f96e6', '#25402e', 0.7]} />
          <directionalLight position={[-8, 14, 6]} intensity={1.1} color="#b4c4ff" castShadow={q.shadows} {...shadowProps} />
          <Stars radius={70} depth={30} count={q.stars} factor={4} fade speed={1} />
          <mesh position={[-28, 26, -34]}><sphereGeometry args={[2.4, 16, 12]} /><meshBasicMaterial color="#fff8dc" /></mesh>
        </>
      ) : (
        <>
          <ambientLight intensity={0.75} color="#fff4e0" />
          <hemisphereLight args={['#dff3ff', '#7fae6a', 0.6]} />
          <directionalLight position={[10, 16, 8]} intensity={2.2} color="#fff0d0" castShadow={q.shadows} {...shadowProps} />
        </>
      )}

      {/* pulau diorama */}
      <Box p={[0, -0.2, 0]} s={[24, 0.4, 20]} c={night ? '#4f9a4f' : '#6fb857'} cast={false} />
      <Box p={[0, -1.1, 0]} s={[24.2, 1.4, 20.2]} c="#b9684a" cast={false} />
      <Box p={[0, -1.7, 0]} s={[24.3, 0.3, 20.3]} c="#9c5238" cast={false} />
      <Box p={[0, -2.3, 0]} s={[24.2, 0.9, 20.2]} c="#8a4630" cast={false} />
      <Box p={[-6, 0.005, 6]} s={[6, 0.02, 4]} c={night ? '#58a85a' : '#7cc562'} cast={false} />
      <Box p={[7, 0.005, 6.5]} s={[5, 0.02, 3]} c={night ? '#58a85a' : '#7cc562'} cast={false} />
      {/* jalan setapak */}
      <Box p={[0, 0.02, 2.4]} s={[1.9, 0.04, 11.6]} c="#e3c9a5" cast={false} />
      <Box p={[3.4, 0.02, 3.6]} s={[7, 0.04, 1.3]} c="#e3c9a5" cast={false} />
      <Box p={[-3, 0.02, 6.9]} s={[6, 0.04, 1.2]} c="#e3c9a5" cast={false} />
      <Box p={[0, 0.06, 3.6]} s={[3.6, 0.08, 2.6]} c="#aeadb6" cast={false} />
      <Box p={[0, 0.075, -2.9]} s={[2.6, 0.15, 1.2]} c="#aeadb6" />
      <Box p={[0, 0.15, -3.2]} s={[2.4, 0.3, 0.7]} c="#b8b7c0" />

      <House night={night} />
      <Interactive id="door" label="Pintu rumah" position={[0, 1.1, -3.4]} hits={[{ s: [2.0, 2.6, 0.8] }]} my={2.1}>
        <Box s={[1.1, 2.2, 0.12]} c="#7a4a2c" />
        <Box p={[0.38, 0, 0.1]} s={[0.1, 0.1, 0.08]} c="#e8c26a" cast={false} />
        <Box p={[0, 0.0, 0.03]} s={[0.8, 1.8, 0.06]} c="#8c5a36" cast={false} />
      </Interactive>

      {/* pohon & dekorasi */}
      <Tree p={[-11, 0, 4]} s={1.3} leaf="#c8453b" trunk="#6b4a33" />
      <Pine p={[10.5, 0, -7]} s={1.2} /><Pine p={[9.2, 0, -9]} /><Pine p={[-10.5, 0, -8]} s={1.1} /><Pine p={[-11, 0, -5.5]} /><Pine p={[11, 0, 1]} s={1} /><Pine p={[-10.8, 0, 8]} s={0.9} />
      <Interactive id="tree" label="Pohon berlampu" position={[-8.5, 0, -3]} hits={[{ s: [2.2, 3.2, 2.2], p: [0, 1.6, 0] }]} my={4.4}>
        <Tree p={[0, 0, 0]} s={1.55} />
      </Interactive>
      <StringLights from={[-8.5, 3.2, -3]} to={[-4.9, 2.6, -1.4]} glow={glow} />
      <StringLights from={[-8.5, 3.4, -3]} to={[-8.3, 2.6, 1.6]} glow={glow} />
      <Lamp p={[-4.9, 0, -1.4]} on={lampsOn > 0 || glow > 0} light={false} />
      <Lamp p={[-8.3, 0, 1.6]} on={lampsOn > 0 || glow > 0} light={false} />
      {glow > 0 && q.pointLights && <pointLight position={[-7, 2.8, -1.5]} intensity={14} distance={9} color="#ffcf8a" />}
      {lampPos.map((p, i) => <Lamp key={i} p={p} on={i < lampsOn} light={q.pointLights && i < 3} />)}
      {[[-3.6, -3.1, 1], [3.6, -3.1, 2], [-1.8, -1.0, 3], [1.8, -1.0, 4], [-1.8, 1.6, 5], [1.8, 1.6, 6]].map(([x, z, sd]) => <Bush key={sd} p={[x, 0, z]} seed={sd} />)}
      <Fence from={[-10.5, 0, 9.3]} to={[-3.2, 0, 9.3]} n={6} />
      <Box p={[8.3, 0.02, -5]} s={[5.2, 0.05, 5.2]} c="#76d0d6" cast={false} op={0.92} />
      {[[-2.5, -2.6], [2.5, -2.6], [-2.5, 2.6], [2.5, 2.6]].map(([x, z], i) => <Sph key={i} p={[8.3 + x, 0.1, -5 + z]} r={0.35} sc={[1.2, 0.7, 1]} c="#9b9aa3" cast={false} seg={8} />)}

      {/* taman bunga */}
      <Flowers rect={MEADOW} count={q.flowers} seed={11} colors={FLOWER_COLORS} reactive />
      <Flowers rect={EDGE} count={Math.floor(q.flowers / 3)} seed={23} colors={FLOWER_COLORS} />
      <Butterflies n={q.butterflies} center={[-6.5, 0, 6.3]} rx={3} rz={2} />
      <Interactive id="meadow" label="Taman bunga" position={[-4.2, 0, 5]} hits={[{ s: [1.6, 1.6, 1.2], p: [0, 0.8, 0] }]} my={2.2}>
        <Cyl p={[0, 0.7, 0]} rt={0.05} rb={0.05} h={1.4} c="#7a5538" seg={6} /><Box p={[0, 1.3, 0]} s={[1.3, 0.55, 0.1]} c="#8a5f3a" />
        <Sph p={[0.1, 0.3, 0.6]} r={0.35} c="#ffb3c7" /><Sph p={[-0.2, 0.25, 0.7]} r={0.3} c="#fff1a8" /><Sph p={[0.35, 0.22, 0.45]} r={0.25} c="#ffffff" />
      </Interactive>
      {[[-7.4, 5.0, 0], [-5.2, 7.4, 1], [-9.0, 4.2, 2]].map(([x, z, i]) => (
        <Interactive key={i} id={'note' + i} label="Bunga kecil" position={[x, 0, z]} hits={[{ s: [0.9, 1, 0.9], p: [0, 0.5, 0] }]} my={1.4}>
          <Cyl p={[0, 0.15, 0]} rt={0.12} rb={0.09} h={0.3} c="#b86f4a" seg={8} /><Cyl p={[0, 0.5, 0]} rt={0.02} rb={0.02} h={0.5} c="#5a9a4a" seg={5} />
          <Sph p={[0, 0.8, 0]} r={0.16} c="#ff9ad5" em="#ff9ad5" ei={0.4} seg={10} /><Sph p={[0, 0.8, 0.1]} r={0.07} c="#ffe566" seg={8} />
        </Interactive>
      ))}

      {/* bangku */}
      <Interactive id="bench" label="Bangku taman" position={[-6, 0, 2]} hits={[{ s: [2.4, 1.2, 1], p: [0, 0.6, 0] }]} my={1.9}><Bench p={[0, 0, 0]} /></Interactive>

      {/* lapak buah */}
      <group position={[6.5, 0, 1.4]}>
        {[[-1.5, -0.8], [1.5, -0.8], [-1.5, 0.8], [1.5, 0.8]].map(([x, z], i) => <Box key={i} p={[x, 1.2, z]} s={[0.12, 2.4, 0.12]} c="#8a5f3a" />)}
        <group position={[0, 2.5, 0]} rotation={[0.22, 0, 0]}>{Array.from({ length: 6 }, (_, i) => <Box key={i} p={[-1.4 + i * 0.56, 0, 0]} s={[0.56, 0.08, 2.1]} c={i % 2 ? '#f6f3ea' : '#3aa59a'} />)}</group>
        <Box p={[0, 0.5, -0.6]} s={[3, 1, 0.5]} c="#9a6a40" />
        <Cyl p={[1.9, 0.45, 0.3]} rt={0.4} rb={0.35} h={0.9} c="#3a3a40" seg={10} />
      </group>
      <Interactive id="stall" label="Peti buah" position={[6.5, 0, 2.5]} hits={[{ s: [2.6, 1.2, 1.2], p: [0, 0.5, 0] }]} my={1.8}>
        <Box p={[-0.7, 0.3, 0]} s={[1.1, 0.6, 0.8]} c="#8a5a35" /><Box p={[0.7, 0.3, 0]} s={[1.1, 0.6, 0.8]} c="#8a5a35" />
        {[[-0.9, 0], [-0.5, 0.15], [-0.7, -0.15]].map(([x, z], i) => <Sph key={i} p={[x, 0.72, z]} r={0.17} c="#e0443a" seg={10} />)}
        {[[0.5, 0], [0.9, 0.15], [0.7, -0.15]].map(([x, z], i) => <Sph key={i} p={[x, 0.72, z]} r={0.17} c="#9ccc4a" seg={10} />)}
      </Interactive>

      {/* arcade */}
      <Box p={[8.8, 0.08, 5]} s={[3, 0.16, 2.4]} c="#b9753f" cast={false} />
      <Interactive id="arcade" label="Mesin arcade" position={[8.9, 0, 4.8]} hits={[{ s: [1.3, 2.2, 1.2], p: [0, 1.1, 0] }]} my={2.8}>
        <Box p={[0, 1.0, 0]} s={[0.9, 1.9, 0.8]} c="#5b2a3a" />
        <Box p={[0, 1.4, 0.42]} s={[0.7, 0.55, 0.04]} c="#69e0d0" em="#69e0d0" ei={0.8} cast={false} />
        <Box p={[0, 0.85, 0.5]} s={[0.8, 0.12, 0.3]} c="#3a1a24" /><Sph p={[-0.15, 0.95, 0.5]} r={0.06} c="#e0443a" seg={8} />
        <Box p={[0, 1.95, 0]} s={[1.0, 0.12, 0.9]} c="#c0392b" />
      </Interactive>

      {/* papan petunjuk */}
      <Interactive id="signpost" label="Papan petunjuk" position={[2.6, 0, 6.2]} hits={[{ s: [1.4, 1.6, 0.8], p: [0, 0.9, 0] }]} my={2.2}>
        <Cyl p={[0, 0.8, 0]} rt={0.06} rb={0.06} h={1.6} c="#6b4a33" seg={6} /><Box p={[0, 1.35, 0.05]} s={[1.1, 0.4, 0.08]} c="#8a5f3a" /><Box p={[0.1, 0.95, 0.05]} s={[0.9, 0.3, 0.08]} c="#7a5538" />
      </Interactive>

      {/* tiang jam & kalender */}
      <Interactive id="clock" label="Jam taman" position={[4.2, 0, -1]} hits={[{ s: [1.6, 3.4, 1], p: [0, 1.6, 0] }]} my={4.0}>
        <Cyl p={[0, 1.4, 0]} rt={0.09} rb={0.12} h={2.8} c="#2b2b2e" seg={8} />
        <Cyl p={[0, 3.0, 0]} rot={[Math.PI / 2, 0, 0]} rt={0.72} rb={0.72} h={0.14} c="#8a5f3a" seg={20} />
        <Cyl p={[0, 3.0, 0.08]} rot={[Math.PI / 2, 0, 0]} rt={0.62} rb={0.62} h={0.05} c="#f8f3e4" seg={20} cast={false} />
        <Box p={[0, 3.0, 0.14]} rot={[0, 0, -4.058]} s={[0.07, 0.34, 0.03]} c="#2b2b2e" cast={false} />
        <Box p={[-0.2, 3.0, 0.14]} rot={[0, 0, -4.712]} s={[0.05, 0.5, 0.03]} c="#2b2b2e" cast={false} />
      </Interactive>
      <Interactive id="cal" label="Kalender" position={[5.7, 0, -0.9]} hits={[{ s: [1.4, 1.8, 0.6], p: [0, 1.1, 0] }]} my={2.5}>
        <Box p={[-0.6, 0.7, 0]} s={[0.1, 1.4, 0.1]} c="#6b4a33" /><Box p={[0.6, 0.7, 0]} s={[0.1, 1.4, 0.1]} c="#6b4a33" />
        <Box p={[0, 1.3, 0.05]} s={[1.3, 1.0, 0.08]} c="#f6ecd3" /><Box p={[0, 1.7, 0.1]} s={[1.3, 0.2, 0.08]} c="#d9505f" cast={false} />
      </Interactive>

      {/* lengkungan bunga */}
      <Interactive id="arch" label="Lengkungan bunga" position={[0, 0, 2]} hits={[{ s: [0.7, 2.4, 0.7], p: [-1.4, 1.2, 0] }, { s: [0.7, 2.4, 0.7], p: [1.4, 1.2, 0] }, { s: [3.2, 0.6, 0.7], p: [0, 3.2, 0] }]} my={3.9}>
        {[-1.4, 1.4].map((x) => <Cyl key={x} p={[x, 0.95, 0]} rt={0.07} rb={0.09} h={1.9} c="#f4f0e6" seg={8} />)}
        <mesh position={[0, 1.9, 0]} castShadow><torusGeometry args={[1.4, 0.07, 8, 28, Math.PI]} /><meshStandardMaterial color="#f4f0e6" roughness={0.9} /></mesh>
        {Array.from({ length: 16 }, (_, i) => { const a = (i / 15) * Math.PI; return <Sph key={i} p={[Math.cos(a) * 1.4, 1.9 + Math.sin(a) * 1.4, 0.05]} r={0.13} c={['#ffb3c7', '#ffffff', '#ffd1e0', '#e4d0ff'][i % 4]} seg={8} />; })}
        {[-1.4, 1.4].map((x) => <Sph key={x} p={[x, 0.3, 0.1]} r={0.3} c="#ffb3c7" />)}
      </Interactive>

      <Chicken p={[3, 0, 5]} seed={1} /><Chicken p={[-2, 0, 8]} seed={2} /><Chicken p={[7.4, 0, 4]} seed={3} />

      {hidden.active && hidden.items.map((it, i) => (it.found ? null : <HiddenThing key={i} index={i} type={it.type} spot={it.spot} />))}

      {night && <Sparkles count={q.sparkles} scale={[18, 4, 14]} position={[0, 2, 0]} size={4} speed={0.3} color="#ffe9a8" />}
      {scene === 'final' && finalPhase !== 'cinema' && <Sparkles count={q.sparkles} scale={[6, 3, 5]} position={[0, 1.5, 2.4]} size={6} speed={0.5} color="#ff9ab6" />}

      {playable && <PlayerController scene={scene === 'final' ? 'final' : 'garden'} w={24} d={20} />}
      {showActors && (
        <>
          <ErrorBoundary label="inda"><Actor who="inda" /></ErrorBoundary>
          <ErrorBoundary label="boy"><Actor who="boy" /></ErrorBoundary>
        </>
      )}
    </>
  );
}
void Cone;
