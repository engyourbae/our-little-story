import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useGame } from '../../store/gameStore';
import { requestInteract } from '../../systems/InteractionManager';
import type { V3 } from '../../config/world';

function Marker({ y }: { y: number }) {
  const r = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!r.current) return;
    r.current.position.y = y + Math.sin(clock.elapsedTime * 3) * 0.15;
    r.current.rotation.y = clock.elapsedTime * 2;
  });
  return (
    <group ref={r} position={[0, y, 0]}>
      <mesh><octahedronGeometry args={[0.22, 0]} /><meshBasicMaterial color="#ffd24a" /></mesh>
    </group>
  );
}

interface Props { id: string; label: string; position?: V3; rot?: V3; children?: ReactNode; hits?: { s: V3; p?: V3 }[]; my?: number }

// Objek yang bisa disentuh: label hover, penanda misi, dan area sentuh yang lebih besar untuk layar kecil.
export function Interactive({ id, label, position, rot, children, hits, my = 2.6 }: Props) {
  const isMarker = useGame((s) => s.markerId === id);
  return (
    <group
      position={position}
      rotation={rot}
      onClick={(e) => { e.stopPropagation(); requestInteract(id); }}
      onPointerOver={(e) => { e.stopPropagation(); useGame.setState({ hover: label }); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { useGame.setState({ hover: null }); document.body.style.cursor = 'auto'; }}
    >
      {children}
      {hits?.map((h, i) => (
        <mesh key={i} position={h.p}><boxGeometry args={h.s} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
      ))}
      {isMarker && <Marker y={my} />}
    </group>
  );
}
