import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { V3 } from '../../config/world';
import { useGame } from '../../store/gameStore';
import { rng } from '../../utils/rng';

interface BaseP { p?: V3; rot?: V3; c: string; cast?: boolean; rec?: boolean; em?: string; ei?: number; op?: number }
const matProps = (c: string, em?: string, ei = 1, op = 1) => ({ color: c, roughness: 0.9, emissive: em ?? '#000000', emissiveIntensity: em ? ei : 0, transparent: op < 1, opacity: op });

export function Box({ p = [0, 0, 0], rot, s, c, cast = true, rec = true, em, ei, op }: BaseP & { s: V3 }) {
  return <mesh position={p} rotation={rot} castShadow={cast} receiveShadow={rec}><boxGeometry args={s} /><meshStandardMaterial {...matProps(c, em, ei, op)} /></mesh>;
}
export function Sph({ p = [0, 0, 0], rot, r, sc, c, cast = true, rec = false, em, ei, op, seg = 14 }: BaseP & { r: number; sc?: V3; seg?: number }) {
  return <mesh position={p} rotation={rot} scale={sc} castShadow={cast} receiveShadow={rec}><sphereGeometry args={[r, seg, Math.max(8, seg - 4)]} /><meshStandardMaterial {...matProps(c, em, ei, op)} /></mesh>;
}
export function Cyl({ p = [0, 0, 0], rot, rt, rb, h, c, seg = 12, cast = true, rec = false, em, ei, op }: BaseP & { rt: number; rb: number; h: number; seg?: number }) {
  return <mesh position={p} rotation={rot} castShadow={cast} receiveShadow={rec}><cylinderGeometry args={[rt, rb, h, seg]} /><meshStandardMaterial {...matProps(c, em, ei, op)} /></mesh>;
}
export function Cone({ p = [0, 0, 0], rad, h, c, seg = 8, cast = true }: { p?: V3; rad: number; h: number; c: string; seg?: number; cast?: boolean }) {
  return <mesh position={p} castShadow={cast}><coneGeometry args={[rad, h, seg]} /><meshStandardMaterial {...matProps(c)} /></mesh>;
}

export function Tree({ p, s = 1, leaf = '#5d9b4a', trunk = '#7a5538' }: { p: V3; s?: number; leaf?: string; trunk?: string }) {
  return (
    <group position={p} scale={s}>
      <Cyl p={[0, 0.9, 0]} rt={0.22} rb={0.32} h={1.8} c={trunk} seg={8} />
      <Sph p={[0, 2.5, 0]} r={1.35} c={leaf} />
      <Sph p={[0.85, 2.1, 0.3]} r={0.95} c={leaf} />
      <Sph p={[-0.8, 2.15, -0.3]} r={0.95} c={leaf} />
      <Sph p={[0.1, 3.2, 0.2]} r={0.8} c={leaf} />
    </group>
  );
}
export function Pine({ p, s = 1 }: { p: V3; s?: number }) {
  return (
    <group position={p} scale={s}>
      <Cyl p={[0, 0.4, 0]} rt={0.15} rb={0.2} h={0.8} c="#6b4a33" seg={6} />
      <Cone p={[0, 1.4, 0]} rad={1.2} h={1.6} c="#3f7a4a" />
      <Cone p={[0, 2.4, 0]} rad={0.95} h={1.4} c="#468a52" />
      <Cone p={[0, 3.3, 0]} rad={0.65} h={1.2} c="#4f9a5a" />
    </group>
  );
}
export function Bush({ p, s = 1, seed = 1 }: { p: V3; s?: number; seed?: number }) {
  const dots = useMemo(() => { const r = rng(seed * 97); return Array.from({ length: 12 }, () => [(r() - 0.5) * 1.1, 0.35 + r() * 0.5, (r() - 0.5) * 0.9] as V3); }, [seed]);
  return (
    <group position={p} scale={s}>
      <Sph p={[0, 0.4, 0]} r={0.6} c="#3d7a3f" /><Sph p={[0.5, 0.35, 0.1]} r={0.45} c="#468a46" /><Sph p={[-0.5, 0.35, -0.1]} r={0.45} c="#3d7a3f" />
      {dots.map((d, i) => <Sph key={i} p={d} r={0.09} c="#ffffff" cast={false} seg={8} />)}
    </group>
  );
}
export function Lamp({ p, on, light = false }: { p: V3; on: boolean; light?: boolean }) {
  return (
    <group position={p}>
      <Cyl p={[0, 1.2, 0]} rt={0.05} rb={0.07} h={2.4} c="#2b2b2e" seg={8} />
      <Cyl p={[0, 0.08, 0]} rt={0.16} rb={0.2} h={0.16} c="#2b2b2e" seg={8} />
      <Box p={[0, 2.55, 0]} s={[0.4, 0.5, 0.4]} c="#d9d4c0" em={on ? '#ffcf7a' : undefined} ei={on ? 1.8 : 0} cast={false} />
      <Cone p={[0, 2.95, 0]} rad={0.32} h={0.3} c="#2b2b2e" seg={4} />
      {on && light && <pointLight position={[0, 2.5, 0]} intensity={8} distance={8} color="#ffcf7a" decay={2} />}
    </group>
  );
}
export function Bench({ p, rot }: { p: V3; rot?: V3 }) {
  return (
    <group position={p} rotation={rot}>
      <Box p={[0, 0.42, 0]} s={[2.2, 0.1, 0.7]} c="#9a6a40" />
      <Box p={[0, 0.85, -0.3]} s={[2.2, 0.5, 0.08]} c="#8a5a35" />
      {[-0.95, 0.95].map((x) => <Box key={x} p={[x, 0.2, 0]} s={[0.1, 0.4, 0.6]} c="#3a3a40" />)}
    </group>
  );
}
export function Fence({ from, to, n }: { from: V3; to: V3; n: number }) {
  const pts = useMemo(() => Array.from({ length: n }, (_, i) => [from[0] + ((to[0] - from[0]) * i) / (n - 1), from[1], from[2] + ((to[2] - from[2]) * i) / (n - 1)] as V3), [from, to, n]);
  const len = Math.hypot(to[0] - from[0], to[2] - from[2]);
  const ang = -Math.atan2(to[2] - from[2], to[0] - from[0]);
  return (
    <group>
      {pts.map((q, i) => <Box key={i} p={[q[0], 0.45, q[2]]} s={[0.14, 0.9, 0.14]} c="#8a5f3a" />)}
      {[0.35, 0.7].map((y) => <Box key={y} p={[(from[0] + to[0]) / 2, y, (from[2] + to[2]) / 2]} rot={[0, ang, 0]} s={[len, 0.09, 0.07]} c="#a0714a" />)}
    </group>
  );
}

// Bunga instanced agar ringan. reactive=true mengikuti nilai bloom (Bab 2).
export function Flowers({ rect, count, seed, colors, reactive = false }: { rect: [number, number, number, number]; count: number; seed: number; colors: string[]; reactive?: boolean }) {
  const stem = useRef<THREE.InstancedMesh>(null);
  const bloom = useRef<THREE.InstancedMesh>(null);
  const grp = useRef<THREE.Group>(null);
  const data = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => ({ x: rect[0] + r() * (rect[2] - rect[0]), z: rect[1] + r() * (rect[3] - rect[1]), h: 0.25 + r() * 0.22, col: colors[Math.floor(r() * colors.length)] }));
  }, [count, seed, rect, colors]);
  useLayoutEffect(() => {
    const o = new THREE.Object3D(); const col = new THREE.Color();
    data.forEach((d, i) => {
      o.position.set(d.x, d.h / 2, d.z); o.scale.set(1, d.h, 1); o.updateMatrix(); stem.current?.setMatrixAt(i, o.matrix);
      o.position.set(d.x, d.h + 0.03, d.z); o.scale.set(1, 1, 1); o.updateMatrix(); bloom.current?.setMatrixAt(i, o.matrix); bloom.current?.setColorAt(i, col.set(d.col));
    });
    if (stem.current) stem.current.instanceMatrix.needsUpdate = true;
    if (bloom.current) { bloom.current.instanceMatrix.needsUpdate = true; if (bloom.current.instanceColor) bloom.current.instanceColor.needsUpdate = true; }
  }, [data]);
  useFrame((_, dt) => {
    if (!reactive || !grp.current) return;
    const b = useGame.getState().bloom;
    grp.current.scale.y = THREE.MathUtils.damp(grp.current.scale.y, 0.25 + 0.75 * b, 1.6, dt);
  });
  return (
    <group ref={grp} scale={[1, reactive ? 0.25 : 1, 1]}>
      <instancedMesh ref={stem} args={[undefined, undefined, count]} frustumCulled={false}><cylinderGeometry args={[0.015, 0.015, 1, 5]} /><meshStandardMaterial color="#5a9a4a" /></instancedMesh>
      <instancedMesh ref={bloom} args={[undefined, undefined, count]} frustumCulled={false}><sphereGeometry args={[0.075, 8, 6]} /><meshStandardMaterial /></instancedMesh>
    </group>
  );
}

export function Butterflies({ n, center, rx, rz }: { n: number; center: V3; rx: number; rz: number }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const cols = ['#ffd1e0', '#fff1a8', '#c7e3ff', '#ffc08a'];
  useFrame(({ clock }) => {
    const on = useGame.getState().bloom > 0.5;
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.visible = on;
      const t = clock.elapsedTime * (0.35 + i * 0.07) + i * 2;
      g.position.set(center[0] + Math.cos(t) * rx * (0.6 + 0.4 * Math.sin(i)), center[1] + 0.7 + Math.sin(t * 2) * 0.25, center[2] + Math.sin(t * 1.3) * rz);
      g.rotation.y = -t;
      const f = Math.sin(clock.elapsedTime * 14 + i) * 0.7;
      (g.children[0] as THREE.Object3D).rotation.z = f; (g.children[1] as THREE.Object3D).rotation.z = -f;
    });
  });
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el; }} visible={false}>
          <mesh position={[0.06, 0, 0]}><planeGeometry args={[0.14, 0.11]} /><meshBasicMaterial color={cols[i % 4]} side={THREE.DoubleSide} /></mesh>
          <mesh position={[-0.06, 0, 0]}><planeGeometry args={[0.14, 0.11]} /><meshBasicMaterial color={cols[i % 4]} side={THREE.DoubleSide} /></mesh>
        </group>
      ))}
    </>
  );
}

export function Chicken({ p, seed }: { p: V3; seed: number }) {
  const g = useRef<THREE.Group>(null);
  const st = useRef({ x: p[0], z: p[2], tx: p[0], tz: p[2], next: 0, rot: 0 });
  useFrame(({ clock }, dt) => {
    const s = st.current; const t = clock.elapsedTime;
    if (t > s.next) { s.tx = p[0] + (Math.random() - 0.5) * 2.4; s.tz = p[2] + (Math.random() - 0.5) * 2.4; s.next = t + 2 + Math.random() * 4 + seed; }
    const dx = s.tx - s.x, dz = s.tz - s.z; const d = Math.hypot(dx, dz);
    if (d > 0.05) { s.x += (dx / d) * dt * 0.6; s.z += (dz / d) * dt * 0.6; s.rot = Math.atan2(dx, dz); }
    if (g.current) { g.current.position.set(s.x, Math.abs(Math.sin(t * 8 + seed)) * (d > 0.05 ? 0.04 : 0), s.z); g.current.rotation.y = s.rot; }
  });
  return (
    <group ref={g} position={p}>
      <Sph p={[0, 0.28, 0]} r={0.22} sc={[1, 0.9, 1.25]} c="#fbfbf6" />
      <Sph p={[0, 0.52, 0.2]} r={0.12} c="#fbfbf6" />
      <Sph p={[0, 0.66, 0.2]} r={0.05} sc={[0.6, 1, 1.4]} c="#d9393a" cast={false} seg={8} />
      <Cone p={[0, 0.5, 0.33]} rad={0.04} h={0.1} c="#f3a23a" seg={4} cast={false} />
      <Box p={[0, 0.38, -0.27]} s={[0.05, 0.2, 0.16]} c="#e9e9e0" rot={[0.5, 0, 0]} />
    </group>
  );
}
