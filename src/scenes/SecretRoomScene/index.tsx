import { Sparkles } from '@react-three/drei';
import { useGame } from '../../store/gameStore';
import { useQuality } from '../../hooks/useQuality';
import { Interactive } from '../../components/InteractiveObject/Interactive';
import { Actor } from '../../components/Character/Actor';
import { ErrorBoundary } from '../../components/UI/ErrorBoundary';
import { PlayerController } from '../shared/PlayerController';
import { Box, Cyl, Sph } from '../shared/props';

export default function SecretRoomScene() {
  const q = useQuality();
  const lettered = useGame((s) => !!s.save.letterRead);
  return (
    <>
      <ambientLight intensity={0.6} color="#ffd9b0" />
      <hemisphereLight args={['#ffd9b0', '#5a3a4a', 0.5]} />
      <directionalLight position={[6, 10, 8]} intensity={0.9} color="#ffd1a0" castShadow={q.shadows} shadow-mapSize-width={q.shadowMap} shadow-mapSize-height={q.shadowMap} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} />
      <pointLight position={[0, 2.2, -0.4]} intensity={q.pointLights ? 14 : 7} distance={9} color="#ffb875" />

      <Box p={[0, -0.1, 0]} s={[8, 0.2, 7]} c="#a8603f" cast={false} /><Box p={[0, -0.8, 0]} s={[8.2, 1.4, 7.2]} c="#8a4a38" cast={false} /><Box p={[0, -1.6, 0]} s={[8.2, 0.3, 7.2]} c="#6b3a30" cast={false} />
      <Box p={[0, 1.6, -3.6]} s={[8.4, 3.2, 0.2]} c="#5b3b57" /><Box p={[-4.1, 1.6, 0]} s={[0.2, 3.2, 7.4]} c="#6b4668" />
      <Box p={[0, 0.015, 0.3]} s={[4.4, 0.03, 3.2]} c="#c25a6a" cast={false} /><Box p={[0, 0.035, 0.3]} s={[3.8, 0.03, 2.6]} c="#e6a15a" cast={false} />

      {/* lampu tali di dinding belakang */}
      {Array.from({ length: 14 }, (_, i) => <Sph key={i} p={[-3.4 + i * 0.52, 2.7 - Math.sin((i / 13) * Math.PI) * 0.5, -3.45]} r={0.07} c="#ffd98a" em="#ffd98a" ei={1.6} cast={false} seg={8} />)}
      {/* foto kenangan di dinding */}
      <Interactive id="photosWall" label="Foto kenangan" position={[0, 1.7, -3.45]} hits={[{ s: [4.2, 1.2, 0.5] }]} my={1.0}>
        {[-1.3, 0, 1.3].map((x, i) => <group key={i} position={[x, i === 1 ? 0.1 : 0, 0]} rotation={[0, 0, (i - 1) * 0.06]}><Box s={[0.95, 0.8, 0.06]} c="#f4efe3" /><Box p={[0, 0, 0.04]} s={[0.8, 0.65, 0.04]} c={['#f6c1c9', '#b9d8f0', '#f7e0a8'][i]} cast={false} /></group>)}
      </Interactive>

      {/* meja + bunga + lampu + kotak musik */}
      <Box p={[0, 0.5, -0.5]} s={[2.0, 0.1, 1.1]} c="#7a4a2c" />
      {[[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].map(([x, z], i) => <Box key={i} p={[x, 0.25, -0.5 + z]} s={[0.1, 0.5, 0.1]} c="#6b3f25" />)}
      <Cyl p={[-0.7, 0.75, -0.5]} rt={0.1} rb={0.14} h={0.4} c="#7ec3c9" />
      {[[-0.7, 1.05, -0.5, '#ff9ab6'], [-0.58, 1.0, -0.45, '#fff1a8'], [-0.82, 1.0, -0.55, '#ffffff']].map(([x, y, z, c], i) => <Sph key={i} p={[x as number, y as number, z as number]} r={0.13} c={c as string} seg={8} />)}
      <Cyl p={[0.75, 0.78, -0.5]} rt={0.08} rb={0.12} h={0.3} c="#f0dca8" em="#ffe2a0" ei={0.9} />
      <Box p={[0.3, 0.64, -0.7]} s={[0.4, 0.2, 0.3]} c="#e0b04a" />
      <Interactive id="envelope" label="Amplop untukmu" position={[0, 0.58, -0.4]} hits={[{ s: [0.9, 0.7, 0.8], p: [0, 0.2, 0] }]} my={1.1}>
        <Box p={[0, 0.03, 0]} rot={[0, 0.2, 0]} s={[0.6, 0.04, 0.4]} c="#fbf6ea" em={lettered ? undefined : '#fff1c2'} ei={0.5} /><Sph p={[0, 0.07, 0]} r={0.07} sc={[1, 0.4, 1]} c="#d9505f" seg={8} cast={false} />
        {!lettered && <Sparkles count={12} scale={[0.9, 0.7, 0.9]} position={[0, 0.3, 0]} size={4} speed={0.5} color="#fff1a8" />}
      </Interactive>

      {/* tanaman & pintu kembali */}
      <Cyl p={[3.0, 0.3, -2.6]} rt={0.35} rb={0.28} h={0.6} c="#b86f4a" /><Sph p={[3.0, 0.95, -2.6]} r={0.5} sc={[1, 1.2, 1]} c="#4a9a55" />
      <Interactive id="secretExit" label="Kembali ke rumah" position={[-4.0, 1.1, 2.6]} hits={[{ s: [0.8, 2.4, 1.5] }]} my={1.9}>
        <Box s={[0.14, 2.2, 1.1]} c="#7a4a2c" /><Box p={[0.08, 0, 0.35]} s={[0.06, 0.1, 0.1]} c="#e8c26a" cast={false} />
      </Interactive>
      <Sparkles count={q.sparkles} scale={[7, 3, 6]} position={[0, 1.6, 0]} size={3} speed={0.25} color="#ffd98a" />

      <PlayerController scene="secret" w={8} d={7} />
      <ErrorBoundary label="inda"><Actor who="inda" /></ErrorBoundary>
      <ErrorBoundary label="boy"><Actor who="boy" /></ErrorBoundary>
    </>
  );
}
