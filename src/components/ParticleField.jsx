import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function getParticleCount() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return 280;
  const mobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 760;
  if (mobile) return 520;
  if (navigator.hardwareConcurrency <= 4) return 900;
  return 1500;
}

// CanvasTexture radial glow (same as original)
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0,    'rgba(255,255,255,1)');
  grd.addColorStop(0.22, 'rgba(255,255,255,0.6)');
  grd.addColorStop(1,    'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// demo 전역 그린 테마에 맞춘 팔레트 (밝은 그린 · 코어 그린 · 화이트)
const PALETTE = [
  [0.4, 1, 0.6],      // bright green
  [0, 0.78, 0.33],    // core green (#00C853)
  [0.94, 0.96, 0.97], // white
];

export default function ParticleField({ gaugeRef, depthRange = [-10, -230] }) {
  const count   = useMemo(() => getParticleCount(), []);
  const meshRef = useRef();
  const velRef  = useRef(null);

  const { positions, colors, basePos, glowTex } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 80;
      const z = 30 + Math.random() * (depthRange[0] - 30 + (depthRange[0] - depthRange[1]));
      // distribute along z from depthRange[0] to depthRange[1]
      const zz = depthRange[0] + Math.random() * (depthRange[1] - depthRange[0]);
      pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=zz;
      base[i*3]=x; base[i*3+1]=y; base[i*3+2]=zz;

      const c = PALETTE[(Math.random() * PALETTE.length) | 0];
      const f = 0.5 + Math.random() * 0.5;
      col[i*3]=c[0]*f; col[i*3+1]=c[1]*f; col[i*3+2]=c[2]*f;
    }

    return {
      positions: pos,
      colors: col,
      basePos: base,
      glowTex: makeGlowTexture(),
    };
  }, [count]);

  // velocity buffer
  useMemo(() => { velRef.current = new Float32Array(count * 3); }, [count]);

  const isMobile = window.innerWidth < 760;
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame(({ camera }) => {
    if (!meshRef.current || reduced) return;
    const pos  = meshRef.current.geometry.attributes.position.array;
    const base = basePos;
    const vel  = velRef.current;
    const g    = gaugeRef?.current ?? 0;
    const gaugeActive = g > 3;

    let sx = 0, sy = 0, sz = 0;
    if (gaugeActive) {
      // suction point: ahead of camera
      sx = camera.position.x;
      sy = camera.position.y - 4;
      sz = camera.position.z - 14;
    }

    for (let i = 0; i < count; i++) {
      const ix = i*3, iy = ix+1, iz = ix+2;
      // gentle spring back to base
      vel[ix] += (base[ix] - pos[ix]) * 0.6 * 0.016;
      vel[iy] += (base[iy] - pos[iy]) * 0.6 * 0.016;
      vel[iz] += (base[iz] - pos[iz]) * 0.6 * 0.016;
      // gauge suction
      if (gaugeActive) {
        const gf = (g / 100) * 10 * 0.016;
        vel[ix] += (sx - pos[ix]) * gf * 0.06;
        vel[iy] += (sy - pos[iy]) * gf * 0.06;
        vel[iz] += (sz - pos[iz]) * gf * 0.06;
      }
      vel[ix] *= 0.9; vel[iy] *= 0.9; vel[iz] *= 0.9;
      pos[ix] += vel[ix]; pos[iy] += vel[iy]; pos[iz] += vel[iz];
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color"    array={colors}    count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 1.4 : 1.1}
        map={glowTex}
        vertexColors
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
