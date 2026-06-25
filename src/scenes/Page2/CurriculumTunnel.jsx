import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleField from '../../components/ParticleField';

const YEAR_Z      = [-45, -95, -150, -205];
const YEAR_COLORS = ['#66FF99', '#22DD77', '#00C853', '#00802E'];

function DepthRing({ z, color, radius }) {
  return (
    // rotation.x = 0.12 — original의 살짝 기울어진 링
    <mesh position={[0, 0, z]} rotation={[0.12, 0, 0]}>
      <torusGeometry args={[radius, 0.07, 12, 90]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function CurriculumScene({ scrollDisp, gaugeRef }) {
  const { camera } = useThree();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame(({ clock }) => {
    const t   = scrollDisp.current;      // smoothed scroll 0-1
    const now = clock.getElapsedTime();

    // Z: 20 → -228
    camera.position.z = 20 + (-228 - 20) * t;

    // scroll-dependent x/y drift (from original)
    if (!reduced) {
      camera.position.x = Math.sin(t * 7) * 2.2 + Math.sin(now * 0.0004) * 0.4;
      camera.position.y = Math.cos(t * 5.5) * 1.6;
    }

    // always look 16 units ahead (critical for smoothness feel)
    camera.lookAt(
      camera.position.x * 0.4,
      camera.position.y * 0.4,
      camera.position.z - 16,
    );
  });

  return (
    <>
      <fogExp2 attach="fog" args={[0x020805, 0.011]} />
      <ambientLight color={0x113322} intensity={0.8} />
      <pointLight color={0x00ff88} intensity={1.1} distance={120} position={[10, 10, 10]} />
      <pointLight color={0x00c853} intensity={0.9} distance={120} position={[-12, -6, 4]} />

      {YEAR_Z.map((z, i) => (
        <DepthRing key={i} z={z} color={YEAR_COLORS[i]} radius={14 + i * 1.5} />
      ))}

      <ParticleField gaugeRef={gaugeRef} depthRange={[30, -230]} />
    </>
  );
}
