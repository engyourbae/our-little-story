import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Anim, ExprId, Pose } from '../../config/types';
import { CHARACTERS, EXPR } from '../../config/characters';
import { useGame } from '../../store/gameStore';

interface Props { kind: 'inda' | 'boy'; expr: ExprId; talking?: boolean; pose?: Pose; anim?: Anim; moving?: boolean }
const D = THREE.MathUtils.damp;
const FACE = '#2b1a17';

// Chibi 3D gaya "pixel lucu": kepala besar, mata kotak besar berkilau, blush, rambut/hijab faceted (flat shading),
// plus animasi bouncy (squash & stretch, goyang hijab, kepala miring). Props sama dengan versi sebelumnya.
export function Chibi({ kind, expr, talking = false, pose = 'stand', anim = null, moving = false }: Props) {
  const theme = useGame((s) => s.config.theme);
  const isI = kind === 'inda';
  const ch = isI ? CHARACTERS.inda : CHARACTERS.boy;
  const boy = CHARACTERS.boy;
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const sway = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Group>(null);
  const eyeR = useRef<THREE.Group>(null);
  const arcL = useRef<THREE.Mesh>(null);
  const arcR = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const mouthO = useRef<THREE.Mesh>(null);
  const blushL = useRef<THREE.Mesh>(null);
  const blushR = useRef<THREE.Mesh>(null);
  const browL = useRef<THREE.Mesh>(null);
  const browR = useRef<THREE.Mesh>(null);
  const k = useRef({ smile: 0.5, open: 0, es: 1, blush: 0.4, brow: 0, tilt: 0, arc: 1, t: Math.random() * 10, lean: 0, sq: 0 });
  const iris = useMemo(() => new THREE.Color(ch.eye).lerp(new THREE.Color('#ffffff'), 0.28).getStyle(), [ch.eye]);

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
    const bp = t % 3.6;
    const blink = bp > 3.45 ? 1 - Math.abs((bp - 3.525) / 0.075) : 0;
    const esb = s.es * (1 - 0.92 * Math.max(0, blink));
    const showArc = s.arc > 0.5;

    if (eyeL.current && eyeR.current && arcL.current && arcR.current) {
      eyeL.current.visible = eyeR.current.visible = !showArc;
      arcL.current.visible = arcR.current.visible = showArc;
      eyeL.current.scale.set(1, esb, 1);
      eyeR.current.scale.set(1, esb, 1);
    }
    if (mouth.current) mouth.current.scale.set(0.15 * (1 - 0.25 * s.open), 0.15 * s.smile, 0.15);
    if (mouthO.current) {
      mouthO.current.visible = s.open > 0.06;
      mouthO.current.scale.set(0.04 + 0.03 * s.open, 0.01 + 0.07 * s.open, 1);
    }
    if (blushL.current && blushR.current) {
      (blushL.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + s.blush * 0.7;
      (blushR.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + s.blush * 0.7;
    }
    if (browL.current && browR.current) { browL.current.rotation.z = s.brow; browR.current.rotation.z = -s.brow; }

    // pose & animasi
    const sit = pose === 'sit';
    const hug = pose === 'hug';
    const walk = moving && !sit && !hug;
    const sw = Math.sin(t * 11);
    const hopRaw = anim === 'hop' ? Math.abs(Math.sin(t * 9)) : 0;
    const joy = e.smile > 0.9 ? Math.abs(Math.sin(t * 7)) * 0.05 : 0;
    s.sq = D(s.sq, walk ? Math.sin(t * 22) * 0.045 : Math.sin(t * 2.2) * 0.018, 18, dt); // napas / squash
    if (root.current) {
      root.current.position.y = walk ? Math.abs(sw) * 0.09 : hopRaw * 0.38 + joy;
      root.current.rotation.z = walk ? sw * 0.045 : Math.sin(t * 1.4) * 0.012;
    }
    if (body.current) {
      const stretch = hopRaw > 0.6 ? 0.08 : 0;
      body.current.scale.set(1 - s.sq * 0.5 - stretch * 0.5, 1 + s.sq + stretch, 1 - s.sq * 0.5);
      s.lean = D(s.lean, hug ? 0.12 : walk ? 0.07 : 0, 6, dt);
      body.current.rotation.x = s.lean;
    }
    if (head.current) {
      head.current.rotation.z = s.tilt * 0.4 + Math.sin(t * 1.3) * 0.035 + (walk ? -sw * 0.04 : 0);
      head.current.rotation.x = (talking ? Math.sin(t * 7) * 0.05 : 0) + (hug ? 0.1 : 0) + (walk ? Math.abs(sw) * 0.03 : 0);
      head.current.rotation.y = !walk && !hug ? Math.sin(t * 0.7) * 0.07 : 0;
    }
    if (sway.current) {
      sway.current.rotation.z = Math.sin(t * 1.8) * 0.03 + (walk ? sw * 0.07 : 0);
      sway.current.rotation.x = walk ? 0.1 + Math.abs(sw) * 0.06 : Math.sin(t * 1.6) * 0.02;
    }
    const legSwing = walk ? sw * 0.8 : 0;
    if (legL.current && legR.current) {
      legL.current.rotation.x = sit ? -1.5 : legSwing;
      legR.current.rotation.x = sit ? -1.5 : -legSwing;
    }
    if (armL.current && armR.current) {
      const aSwing = walk ? -sw * 0.75 : Math.sin(t * 1.6) * 0.05;
      armL.current.rotation.x = hug ? -1.25 : aSwing;
      armR.current.rotation.x = hug ? -1.25 : -aSwing;
      armL.current.rotation.z = hug ? -0.25 : -0.1 - (walk ? 0.08 : 0);
      armR.current.rotation.z = anim === 'wave' ? 2.5 + Math.sin(t * 12) * 0.35 : hug ? 0.25 : 0.1 + (walk ? 0.08 : 0);
    }
  });

  // hijab / rambut memakai flatShading agar terlihat faceted ala pixel
  const hijabMat = <meshStandardMaterial color={theme.hijab} roughness={1} flatShading side={THREE.DoubleSide} />;
  const hijabDark = <meshStandardMaterial color={new THREE.Color(theme.hijab).multiplyScalar(0.88)} roughness={1} flatShading side={THREE.DoubleSide} />;
  const hairMat = <meshStandardMaterial color={boy.hair} roughness={1} flatShading />;
  const clothTop = isI ? theme.blouse : boy.jacket;

  return (
    <group ref={root}>
      {/* bayangan kecil di bawah kaki */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.38, 20]} /><meshBasicMaterial color="#000" transparent opacity={0.16} depthWrite={false} /></mesh>
      <group ref={body}>
        {/* kaki + sepatu bulat */}
        {[-1, 1].map((sx) => (
          <group key={sx} ref={sx < 0 ? legL : legR} position={[sx * 0.12, 0.42, 0]}>
            <mesh position={[0, -0.18, 0]} castShadow><capsuleGeometry args={[0.09, 0.18, 4, 8]} /><meshStandardMaterial color={isI ? theme.bottom : boy.bottom} roughness={0.9} /></mesh>
            <mesh position={[0, -0.4, 0.05]} scale={[1, 0.8, 1.25]} castShadow><sphereGeometry args={[0.11, 10, 8]} /><meshStandardMaterial color={isI ? CHARACTERS.inda.shoe : boy.shoe} roughness={0.8} /></mesh>
          </group>
        ))}
        {/* rok / celana lebar Inda */}
        {isI && <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.2, 0.32, 0.3, 10]} /><meshStandardMaterial color={theme.bottom} roughness={0.9} flatShading /></mesh>}
        {/* badan mungil */}
        <mesh position={[0, 0.65, 0]} castShadow><capsuleGeometry args={[0.22, 0.16, 6, 12]} /><meshStandardMaterial color={clothTop} roughness={0.9} /></mesh>
        {/* ikat pinggang / aksen */}
        {isI ? <mesh position={[0, 0.56, 0]}><cylinderGeometry args={[0.235, 0.235, 0.05, 14]} /><meshStandardMaterial color={theme.accent} roughness={0.8} /></mesh> : (
          <>
            <mesh position={[0, 0.68, 0.19]}><boxGeometry args={[0.17, 0.32, 0.05]} /><meshStandardMaterial color={boy.inner} roughness={0.9} /></mesh>
            <mesh position={[0, 0.84, 0.15]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.36, 0.06, 0.1]} /><meshStandardMaterial color={clothTop} roughness={0.9} /></mesh>
          </>
        )}
        {/* lengan pendek gemuk */}
        {[-1, 1].map((sx) => (
          <group key={sx} ref={sx < 0 ? armL : armR} position={[sx * 0.29, 0.8, 0]}>
            <mesh position={[0, -0.12, 0]} castShadow><capsuleGeometry args={[0.07, 0.14, 4, 8]} /><meshStandardMaterial color={clothTop} roughness={0.9} /></mesh>
            <mesh position={[0, -0.27, 0]}><sphereGeometry args={[0.065, 10, 8]} /><meshStandardMaterial color={ch.skin} /></mesh>
          </group>
        ))}
        {/* hijab: drape bahu (ikut bergoyang) */}
        {isI && (
          <group ref={sway} position={[0, 0.9, 0]}>
            <mesh position={[0, 0, -0.03]} scale={[0.52, 0.36, 0.44]} castShadow><sphereGeometry args={[1, 12, 9]} />{hijabMat}</mesh>
            <mesh position={[0, -0.14, 0.17]} scale={[0.34, 0.34, 0.2]} castShadow><sphereGeometry args={[1, 10, 8]} />{hijabDark}</mesh>
            <mesh position={[0, -0.02, 0.33]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.07, 0.07, 0.03]} /><meshStandardMaterial color={theme.accent} roughness={0.6} /></mesh>
          </group>
        )}
        {/* kepala besar */}
        <group ref={head} position={[0, 1.28, 0]}>
          <mesh castShadow scale={[1.06, 0.97, 1]}><sphereGeometry args={[0.5, 28, 22]} /><meshStandardMaterial color={ch.skin} roughness={0.75} /></mesh>
          {isI ? (
            <>
              <mesh scale={[1.06, 0.97, 1]}><sphereGeometry args={[0.565, 14, 12, Math.PI / 2 + 0.95, Math.PI * 2 - 1.9, 0, 2.55]} />{hijabMat}</mesh>
              <mesh scale={[1.06, 0.97, 1]}><sphereGeometry args={[0.575, 14, 8, 0, Math.PI * 2, 0, 0.85]} />{hijabDark}</mesh>
              {/* bingkai hijab di sekeliling wajah */}
              <mesh position={[0, -0.02, 0.34]} scale={[1.04, 1.08, 0.6]}><torusGeometry args={[0.44, 0.05, 6, 20]} />{hijabMat}</mesh>
            </>
          ) : (
            <>
              <mesh scale={[1.06, 0.97, 1]}><sphereGeometry args={[0.53, 14, 10, 0, Math.PI * 2, 0, 1.25]} />{hairMat}</mesh>
              {/* poni berlapis + jambul */}
              {[-0.3, -0.15, 0, 0.15, 0.3].map((x, i) => (
                <mesh key={i} position={[x, 0.3 - Math.abs(x) * 0.25, 0.4 - Math.abs(x) * 0.35]} rotation={[0.5, 0, x * -1.2]} scale={[1, 1.4, 0.7]}><sphereGeometry args={[0.09, 6, 6]} />{hairMat}</mesh>
              ))}
              <mesh position={[0.05, 0.56, 0.05]} rotation={[0, 0, -0.4]} scale={[0.8, 1.2, 0.8]}><coneGeometry args={[0.1, 0.2, 5]} />{hairMat}</mesh>
              {[-1, 1].map((sx) => <mesh key={sx} position={[sx * 0.52, -0.06, 0]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={boy.skin} /></mesh>)}
            </>
          )}
          {/* wajah */}
          {[-1, 1].map((sx) => (
            <group key={sx}>
              {/* mata kotak besar: gelap + iris + 2 kilau */}
              <group ref={sx < 0 ? eyeL : eyeR} position={[sx * 0.2, -0.07, 0.452]} rotation={[0, sx * 0.4, 0]}>
                <mesh><boxGeometry args={[0.15, 0.19, 0.02]} /><meshBasicMaterial color={ch.eye} /></mesh>
                <mesh position={[0, -0.03, 0.011]}><boxGeometry args={[0.1, 0.1, 0.01]} /><meshBasicMaterial color={iris} /></mesh>
                <mesh position={[0.03, 0.045, 0.02]}><boxGeometry args={[0.05, 0.05, 0.01]} /><meshBasicMaterial color="#ffffff" /></mesh>
                <mesh position={[-0.03, -0.04, 0.02]}><boxGeometry args={[0.025, 0.025, 0.01]} /><meshBasicMaterial color="#ffffff" /></mesh>
                {isI && <mesh position={[sx * 0.075, 0.095, 0.012]} rotation={[0, 0, sx * -0.5]}><boxGeometry args={[0.05, 0.02, 0.01]} /><meshBasicMaterial color={FACE} /></mesh>}
              </group>
              <mesh ref={sx < 0 ? arcL : arcR} position={[sx * 0.2, -0.09, 0.456]} rotation={[0, sx * 0.4, 0]}><torusGeometry args={[0.055, 0.016, 6, 12, Math.PI]} /><meshBasicMaterial color={FACE} /></mesh>
              <mesh ref={sx < 0 ? blushL : blushR} position={[sx * 0.31, -0.19, 0.37]} rotation={[0, sx * 0.7, 0]} scale={[0.1, 0.055, 0.02]}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#ff7f98" transparent opacity={0.4} depthWrite={false} /></mesh>
              <mesh ref={sx < 0 ? browL : browR} position={[sx * 0.2, 0.12, 0.44]} rotation={[0, sx * 0.4, 0]}><boxGeometry args={[0.1, 0.022, 0.015]} /><meshBasicMaterial color={isI ? '#6b4a3f' : boy.hair} /></mesh>
            </group>
          ))}
          <mesh position={[0, -0.14, 0.488]}><sphereGeometry args={[0.016, 6, 6]} /><meshBasicMaterial color="#e3a083" /></mesh>
          <mesh ref={mouth} position={[0, -0.24, 0.45]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.5, 0.09, 6, 14, Math.PI]} /><meshBasicMaterial color="#9c3d4a" /></mesh>
          <mesh ref={mouthO} position={[0, -0.27, 0.446]}><circleGeometry args={[1, 14]} /><meshBasicMaterial color="#7a2e3a" /></mesh>
        </group>
      </group>
    </group>
  );
}
