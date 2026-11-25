import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Chibi } from './Chibi';
import { useGame } from '../../store/gameStore';
import { world } from '../../systems/world';
import { MODELS } from '../../config/characters';
import { ErrorBoundary } from '../UI/ErrorBoundary';

const SCALE = 0.78;
const angDamp = (a: number, b: number, l: number, dt: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + d * (1 - Math.exp(-l * dt));
};

function Glb({ url }: { url: string }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + url);
  return <primitive object={scene.clone()} />;
}

export function Actor({ who }: { who: 'boy' | 'inda' }) {
  const g = useRef<THREE.Group>(null);
  const expr = useGame((s) => (who === 'boy' ? s.stage.boy : s.stage.inda));
  const talking = useGame((s) => s.stage.talking === who);
  const pose = useGame((s) => (who === 'boy' ? s.boy.pose : s.indaPose));
  const anim = useGame((s) => s.fxAnim[who]);
  const boyVisible = useGame((s) => s.boy.visible);
  const [moving, setMoving] = useState(false);
  const mv = useRef(false);
  const init = useRef(false);

  useFrame((_, dt) => {
    const node = g.current;
    if (!node) { init.current = false; return; }
    const s = useGame.getState();
    const p = world.player;
    if (who === 'inda') {
      node.position.set(p.x, s.indaY, p.z);
      node.rotation.y = p.face;
      if (p.moving !== mv.current) { mv.current = p.moving; setMoving(p.moving); }
    } else {
      const b = s.boy;
      if (!init.current) { node.position.set(b.x, b.y, b.z); init.current = true; }
      const dx = b.x - node.position.x, dz = b.z - node.position.z;
      const d = Math.hypot(dx, dz);
      const isMoving = d > 0.06;
      if (isMoving) {
        const step = Math.min(d, 2.6 * dt);
        node.position.x += (dx / d) * step; node.position.z += (dz / d) * step;
        node.rotation.y = angDamp(node.rotation.y, Math.atan2(dx, dz), 8, dt);
      } else if (b.pose !== 'hug') {
        node.rotation.y = angDamp(node.rotation.y, Math.atan2(p.x - node.position.x, p.z - node.position.z), 4, dt);
      } else node.rotation.y = angDamp(node.rotation.y, Math.atan2(p.x - node.position.x, p.z - node.position.z), 6, dt);
      node.position.y = D_y(node.position.y, b.y, dt);
      if (isMoving !== mv.current) { mv.current = isMoving; setMoving(isMoving); }
    }
  });

  if (who === 'boy' && !boyVisible) return null;
  const url = MODELS[who];
  const procedural = <Chibi kind={who} expr={expr} talking={talking} pose={pose} anim={anim} moving={moving} />;
  return (
    <group ref={g}>
      <group scale={SCALE}>
        <ErrorBoundary label={'actor-' + who} fallback={procedural}>
          {url ? <Suspense fallback={procedural}><Glb url={url} /></Suspense> : procedural}
        </ErrorBoundary>
      </group>
    </group>
  );
}
const D_y = (a: number, b: number, dt: number) => THREE.MathUtils.damp(a, b, 8, dt);
