import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Anim, ExprId, Pose } from '../../config/types';
import { CHARACTERS, EXPR } from '../../config/characters';
import { useGame } from '../../store/gameStore';

interface Props { kind: 'inda' | 'boy'; expr: ExprId; talking?: boolean; pose?: Pose; anim?: Anim; moving?: boolean }
const D = THREE.MathUtils.damp;
const FACE = '#2b1a17';

// Model chibi 3D procedural. Satu komponen dipakai ulang di semua bab agar desain konsisten.
export function Chibi({ kind, expr, talking = false, pose = 'stand', anim = null, moving = false }: Props) {
  const theme = useGame((s) => s.config.theme);
  const isI = kind === 'inda';
  const ch = isI ? CHARACTERS.inda : CHARACTERS.boy;
  const boy = CHARACTERS.boy;
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const arcL = useRef<THREE.Mesh>(null);
  const arcR = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const mouthO = useRef<THREE.Mesh>(null);
  const blushL = useRef<THREE.Mesh>(null);
  const blushR = useRef<THREE.Mesh>(null);
  const browL = useRef<THREE.Mesh>(null);
  const browR = useRef<THREE.Mesh>(null);
  const k = useRef({ smile: 0.5, open: 0, es: 1, blush: 0.4, brow: 0, tilt: 0, arc: 1, t: Math.random() * 10, lean: 0, armUp: 0 });

  useFrame((_, dt) => {
    const e = EXPR[expr];
    const s = k.current;
    s.t += dt;
    const t = s.t;
    s.smile = D(s.smile, e.smile, 10, dt);
    s.es = D(s.es, e.es, 10, dt);
    s.blush = D(s.blush, e.blush, 8, dt);
    s.brow = D(s.brow, e.brow, 10, dt);
    s.tilt = D(s.tilt, e.tilt, 6, dt);
    s.arc = D(s.arc, e.arc ? 1 : 0, 14, dt);
    const talk = talking ? Math.max(0, Math.sin(t * 14)) * 0.8 : 0;
    s.open = D(s.open, Math.max(e.open, talk), 20, dt);
    const bp = t % 3.8;
    const blink = bp > 3.65 ? 1 - Math.abs((bp - 3.725) / 0.075) : 0;
    const esb = s.es * (1 - 0.9 * Math.max(0, blink));
    const showArc = s.arc > 0.5;

    if (eyeL.current && eyeR.current && arcL.current && arcR.current) {
      eyeL.current.visible = eyeR.current.visible = !showArc;
      arcL.current.visible = arcR.current.visible = showArc;
      eyeL.current.scale.set(0.075, 0.1 * esb, 0.03);
      eyeR.current.scale.set(0.075, 0.1 * esb, 0.03);
    }
    if (mouth.current) mouth.current.scale.set(0.15 * (1 - 0.25 * s.open), 0.15 * s.smile, 0.15);
    if (mouthO.current) {
      mouthO.current.visible = s.open > 0.06;
      mouthO.current.scale.set(0.04 + 0.03 * s.open, 0.01 + 0.07 * s.open, 1);
    }
    if (blushL.current && blushR.current) {
      (blushL.current.material as THREE.MeshBasicMaterial).opacity = s.blush * 0.8;
      (blushR.current.material as THREE.MeshBasicMaterial).opacity = s.blush * 0.8;
    }
    if (browL.current && browR.current) { browL.current.rotation.z = s.brow; browR.current.rotation.z = -s.brow; }

    // pose & animasi
    const sit = pose === 'sit';
    const hug = pose === 'hug';
    const walk = moving && !sit && !hug;
    const sw = Math.sin(t * 10);
    const hop = anim === 'hop' ? Math.abs(Math.sin(t * 9)) * 0.35 : 0;
    if (body.current) {
      body.current.position.y = walk ? Math.abs(sw) * 0.05 : Math.sin(t * 2) * 0.012 + hop;
      s.lean = D(s.lean, hug ? 0.12 : 0, 6, dt);
      body.current.rotation.x = s.lean;
    }
    if (head.current) {
      head.current.rotation.z = s.tilt * 0.4 + Math.sin(t * 1.3) * 0.03;
      head.current.rotation.x = (talking ? Math.sin(t * 7) * 0.04 : 0) + (hug ? 0.1 : 0);
    }
    const legSwing = walk ? sw * 0.7 : 0;
    if (legL.current && legR.current) {
      legL.current.rotation.x = sit ? -1.5 : legSwing;
      legR.current.rotation.x = sit ? -1.5 : -legSwing;
    }
    if (armL.current && armR.current) {
      const aSwing = walk ? -sw * 0.6 : 0;
      armL.current.rotation.x = hug ? -1.25 : aSwing;
      armR.current.rotation.x = hug ? -1.25 : -aSwing;
      armL.current.rotation.z = hug ? -0.25 : -0.08;
      armR.current.rotation.z = anim === 'wave' ? 2.5 + Math.sin(t * 12) * 0.35 : hug ? 0.25 : 0.08;
    }
  });

  const hijabMat = <meshStandardMaterial color={theme.hijab} roughness={0.95} side={THREE.DoubleSide} />;

  return (
    <group>
      <group ref={body}>
        {/* kaki */}
        {[-1, 1].map((sx) => (
          <group key={sx} ref={sx < 0 ? legL : legR} position={[sx * 0.13, 0.42, 0]}>
            <mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.1, 0.2, 4, 8]} /><meshStandardMaterial color={isI ? theme.bottom : boy.bottom} roughness={0.9} /></mesh>
            <mesh position={[0, -0.42, 0.04]} castShadow><sphereGeometry args={[0.11, 10, 8]} /><meshStandardMaterial color={isI ? CHARACTERS.inda.shoe : boy.shoe} roughness={0.8} /></mesh>
          </group>
        ))}
        {/* rok / celana lebar Inda */}
        {isI && <mesh position={[0, 0.42, 0]} castShadow><cylinderGeometry args={[0.22, 0.3, 0.26, 16]} /><meshStandardMaterial color={theme.bottom} roughness={0.9} /></mesh>}
        {/* badan */}
        <mesh position={[0, 0.66, 0]} castShadow><capsuleGeometry args={[0.24, 0.2, 6, 12]} /><meshStandardMaterial color={isI ? theme.blouse : boy.jacket} roughness={0.9} /></mesh>
        {!isI && <mesh position={[0, 0.7, 0.2]}><boxGeometry args={[0.18, 0.34, 0.06]} /><meshStandardMaterial color={boy.inner} roughness={0.9} /></mesh>}
        {/* lengan */}
        {[-1, 1].map((sx) => (
          <group key={sx} ref={sx < 0 ? armL : armR} position={[sx * 0.3, 0.82, 0]}>
            <mesh position={[0, -0.14, 0]} castShadow><capsuleGeometry args={[0.065, 0.18, 4, 8]} /><meshStandardMaterial color={isI ? theme.blouse : boy.jacket} roughness={0.9} /></mesh>
            <mesh position={[0, -0.3, 0]}><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color={ch.skin} /></mesh>
          </group>
        ))}
        {/* hijab: drape bahu */}
        {isI && (
          <>
            <mesh position={[0, 0.93, -0.03]} scale={[0.5, 0.33, 0.42]} castShadow><sphereGeometry args={[1, 20, 14]} />{hijabMat}</mesh>
            <mesh position={[0, 0.76, 0.2]} scale={[0.3, 0.3, 0.17]} castShadow><sphereGeometry args={[1, 16, 12]} />{hijabMat}</mesh>
          </>
        )}
        {/* kepala */}
        <group ref={head} position={[0, 1.3, 0]}>
          <mesh castShadow><sphereGeometry args={[0.5, 32, 24]} /><meshStandardMaterial color={ch.skin} roughness={0.8} /></mesh>
          {isI ? (
            <>
              <mesh><sphereGeometry args={[0.565, 32, 24, Math.PI / 2 + 0.95, Math.PI * 2 - 1.9, 0, 2.55]} />{hijabMat}</mesh>
              <mesh><sphereGeometry args={[0.575, 32, 12, 0, Math.PI * 2, 0, 0.85]} />{hijabMat}</mesh>
            </>
          ) : (
            <>
              <mesh><sphereGeometry args={[0.525, 24, 16, 0, Math.PI * 2, 0, 1.3]} /><meshStandardMaterial color={boy.hair} roughness={0.9} /></mesh>
              {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.5, -0.02, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={boy.skin} /></mesh>)}
            </>
          )}
          {/* wajah */}
          {[-1, 1].map((sx) => (
            <group key={sx}>
              <mesh ref={sx < 0 ? eyeL : eyeR} position={[sx * 0.17, -0.02, 0.462]}><sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color={ch.eye} /></mesh>
              <mesh position={[sx * 0.17 + 0.022, 0.025, 0.486]}><sphereGeometry args={[0.017, 6, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>
              <mesh ref={sx < 0 ? arcL : arcR} position={[sx * 0.17, -0.04, 0.47]} rotation={[0, 0, 0]}><torusGeometry args={[0.05, 0.012, 6, 12, Math.PI]} /><meshBasicMaterial color={FACE} /></mesh>
              <mesh ref={sx < 0 ? blushL : blushR} position={[sx * 0.29, -0.12, 0.4]} scale={[0.085, 0.05, 0.02]}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ff8fa3" transparent opacity={0.4} depthWrite={false} /></mesh>
              <mesh ref={sx < 0 ? browL : browR} position={[sx * 0.17, 0.14, 0.45]}><boxGeometry args={[0.11, 0.02, 0.015]} /><meshBasicMaterial color={FACE} /></mesh>
            </group>
          ))}
          <mesh ref={mouth} position={[0, -0.15, 0.468]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.5, 0.06, 6, 14, Math.PI]} /><meshBasicMaterial color="#9c3d4a" /></mesh>
          <mesh ref={mouthO} position={[0, -0.19, 0.466]}><circleGeometry args={[1, 14]} /><meshBasicMaterial color="#7a2e3a" /></mesh>
        </group>
      </group>
    </group>
  );
}
