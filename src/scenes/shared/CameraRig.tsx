import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../store/gameStore';
import { CAMS } from '../../config/world';
import { world } from '../../systems/world';

const DIR = new THREE.Vector3(0.62, 0.58, 0.78).normalize();
const D = THREE.MathUtils.damp;

// Kamera isometrik tetap yang bergeser halus antar-zona (tanpa kontrol bebas).
export function CameraRig() {
  const cur = useRef({ t: new THREE.Vector3(0, 0, 0), d: 30, yaw: 0, init: false });
  const snap = useGame((s) => s.camSnap);
  const orbitT = useRef(0);
  useEffect(() => { cur.current.init = false; }, [snap]);
  useFrame((state, dt) => {
    const s = useGame.getState();
    const pr = CAMS[s.cam] ?? CAMS.overview;
    const asp = state.size.width / state.size.height;
    const k = asp < 1.1 ? 1 + (1.1 - asp) * 1.1 : 1;
    const c = cur.current;
    let tx = pr.t[0], ty = pr.t[1], tz = pr.t[2];
    if (pr.follow) { tx = world.player.x * 0.8; tz = world.player.z * 0.8 + 0.5; }
    let yaw = 0;
    if (pr.orbit) { orbitT.current += dt; yaw = Math.sin(orbitT.current * 0.12) * 0.55; }
    const dist = pr.d * k;
    if (!c.init) { c.t.set(tx, ty, tz); c.d = dist; c.yaw = yaw; c.init = true; }
    const l = 2.4;
    c.t.set(D(c.t.x, tx, l, dt), D(c.t.y, ty, l, dt), D(c.t.z, tz, l, dt));
    c.d = D(c.d, dist, l, dt);
    c.yaw = D(c.yaw, yaw, 1.2, dt);
    const dir = DIR.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), c.yaw);
    state.camera.position.copy(c.t).addScaledVector(dir, c.d);
    state.camera.lookAt(c.t);
  });
  return null;
}
