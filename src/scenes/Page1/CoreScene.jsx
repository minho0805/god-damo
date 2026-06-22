import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motion } from 'framer-motion'

function CoreParticles({ count = 500 }) {
  const ref = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r     = 1.7 + Math.random() * 0.9
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return geo
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.12
    ref.current.rotation.x = Math.sin(t * 0.07) * 0.25
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.035} color="#00C853" transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

function OrbitRing({ radius = 2.8, tilt = [1, 0, 0], speed = 0.4 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.006, 8, 80]} />
      <meshBasicMaterial color="#00C853" transparent opacity={0.3} />
    </mesh>
  )
}

function CoreSphere() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.1, 48, 48]} />
      <meshBasicMaterial color="#00C853" transparent opacity={0.07} />
    </mesh>
  )
}

export default function CoreScene() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Three.js canvas fills section */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <CoreSphere />
          <CoreParticles count={500} />
          <OrbitRing radius={2.6} tilt={[1.1, 0, 0]} speed={0.35} />
          <OrbitRing radius={2.9} tilt={[0.4, 0.8, 0]} speed={-0.28} />
        </Canvas>
      </div>

      {/* Radial glow behind core */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div
          style={{
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(0, 200, 83,0.12) 0%, rgba(0, 200, 83,0.04) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 text-center px-6 mt-[55vh]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-green tracking-[0.4em] uppercase mb-5"
        >
          Software Core
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono font-bold text-white leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
        >
          0과 1이<br />세상을 만든다
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-[#666] font-sans text-base max-w-sm mx-auto leading-relaxed"
        >
          소프트웨어학과에서는<br />그 언어를 배웁니다
        </motion.p>
      </div>
    </section>
  )
}
