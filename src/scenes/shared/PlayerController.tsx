import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { world } from '../../systems/world';
import { BOUNDS, OBSTACLES } from '../../config/world';
import { interact, walkTo } from '../../systems/InteractionManager';
import { audio } from '../../systems/AudioManager';
import { useGame } from '../../store/gameStore';

const SPEED = 4;
const inRect = (x: number, z: number, r: number[]) => x > r[0] && x < r[2] && z > r[1] && z < r[3];

// Gerakan otomatis Inda menuju titik yang disentuh + bidang tanah penerima ketukan.
export function PlayerController({ scene, w, d }: { scene: 'garden' | 'house' | 'secret' | 'final'; w: number; d: number }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, dt) => {
    const p = world.player;
    const b = BOUNDS[scene]; const obs = OBSTACLES[scene] ?? [];
    if (p.tx === null || p.tz === null) { p.moving = false; if (ring.current) ring.current.visible = false; return; }
    const dx = p.tx - p.x, dz = p.tz - p.z; const dist = Math.hypot(dx, dz);
    const finish = () => {
      const id = p.arrive;
      p.tx = null; p.tz = null; p.moving = false; p.arrive = null; p.stuck = 0;
      if (id) interact(id);
    };
    if (dist < 0.12) { finish(); return; }
    const step = Math.min(dist, SPEED * dt);
    let nx = p.x + (dx / dist) * step; let nz = p.z + (dz / dist) * step;
    nx = Math.max(b.x[0], Math.min(b.x[1], nx)); nz = Math.max(b.z[0], Math.min(b.z[1], nz));
    const blocked = (x: number, z: number) => obs.some((r) => inRect(x, z, r));
    let moved = true;
    if (blocked(nx, nz)) {
      if (!blocked(nx, p.z)) nz = p.z; else if (!blocked(p.x, nz)) nx = p.x; else { nx = p.x; nz = p.z; moved = false; }
    }
    const before = Math.hypot(nx - p.x, nz - p.z);
    p.x = nx; p.z = nz; p.moving = before > 0.0005;
    if (p.moving) { p.face = THREE.MathUtils.lerp(p.face, p.face, 0); const target = Math.atan2(dx, dz); let df = ((target - p.face + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; p.face += df * Math.min(1, dt * 12); audio.sfx('step'); }
    if (!moved || before < step * 0.2) { p.stuck++; if (p.stuck > 18) { if (p.arrive && dist < 1.6) finish(); else { p.tx = null; p.tz = null; p.moving = false; p.arrive = null; p.stuck = 0; } } } else p.stuck = 0;
    if (ring.current) { ring.current.visible = true; ring.current.position.set(p.tx ?? 0, 0.06, p.tz ?? 0); ring.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 8) * 0.12); }
  });
  return (
    <>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => { e.stopPropagation(); walkTo(e.point.x, e.point.z); }}>
        <planeGeometry args={[w, d]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}><ringGeometry args={[0.22, 0.3, 20]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.7} depthWrite={false} /></mesh>
    </>
  );
}
void useGame;
