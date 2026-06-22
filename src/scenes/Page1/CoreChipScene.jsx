import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion'
import BinaryRain from '../../components/BinaryRain'

/* ════════════════════════════════════════════════════════
 *  CoreChipScene  (v2 #2 — Tunnel → Software Core 전환)
 *
 *  하나의 pin된 스크롤 안에서 6단계가 끊김 없이 이어진다.
 *    0.00–0.12  터널 데이터 분해 → 화이트-그린 블룸
 *    0.05–0.45  Binary Rain 급증 (데이터가 비처럼 쏟아짐)
 *    0.18–0.48  거대한 Software Core 응결(등장)
 *    0.48–0.66  반도체 Chip 활성화 (코어가 칩으로 굳음)
 *    0.66–1.00  Circuit Network 생성 시작 (트레이스가 뻗어나감)
 * ════════════════════════════════════════════════════════ */

// v2 green ramp
const G_NEAR = '#66FF99'
const G_MID  = '#00C853'
const G_DEEP = '#00A63E'

/* ── Three.js: 응결하는 코어 ───────────────────────── */
function CoreParticles({ count = 460 }) {
  const ref = useRef()
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.55 + Math.random() * 0.95
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(ph) * Math.cos(th)
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      pos[i * 3 + 2] = r * Math.cos(ph)
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return geo
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.14
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.22
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.04} color={G_NEAR} transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function OrbitRing({ radius, tilt, speed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed
  })
  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.006, 8, 90]} />
      <meshBasicMaterial color={G_MID} transparent opacity={0.32} />
    </mesh>
  )
}

function CoreSphere() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.material.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 1.6) * 0.035
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.05, 48, 48]} />
      <meshBasicMaterial color={G_MID} transparent opacity={0.09} />
    </mesh>
  )
}

/* ── 활성화되는 반도체 칩 (SVG) ────────────────────── */
const TOP_PADS    = [110, 140, 170, 200, 230, 260, 290]
const BOTTOM_PADS = [110, 140, 170, 200, 230, 260, 290]
const SIDE_PADS   = [120, 150, 180, 210, 240, 270]

function ChipActivate({ active }) {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="ccGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Package body */}
      <rect
        x="100" y="100" width="200" height="200" rx="8"
        fill="rgba(0,40,18,0.55)"
        stroke={active ? G_MID : G_DEEP} strokeWidth="1.5"
        style={{ filter: active ? 'url(#ccGlow)' : 'none', transition: 'stroke .4s' }}
      />

      {/* Die */}
      <rect
        x="130" y="130" width="140" height="140" rx="4"
        fill="rgba(0, 200, 83,0.03)"
        stroke={active ? 'rgba(0,200,83,0.5)' : 'rgba(0,166,62,0.25)'} strokeWidth="1"
      />

      {/* Internal trace grid — draws on activation */}
      {[150, 170, 190, 210, 230, 250].map((p, i) => (
        <motion.line
          key={`v${i}`} x1={p} y1="130" x2={p} y2="270"
          stroke={G_DEEP} strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
        />
      ))}
      {[150, 170, 190, 210, 230, 250].map((p, i) => (
        <motion.line
          key={`h${i}`} x1="130" y1={p} x2="270" y2={p}
          stroke={G_DEEP} strokeWidth="0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
        />
      ))}

      {/* Core label */}
      <motion.text
        x="200" y="196" textAnchor="middle" dominantBaseline="middle"
        fill={G_NEAR} fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="700"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        SKU·CORE
      </motion.text>
      <motion.text
        x="200" y="214" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0,200,83,0.5)" fontSize="8" fontFamily="'JetBrains Mono', monospace"
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.65 }}
      >
        ACTIVE
      </motion.text>

      {/* Pads — light up on activation */}
      {TOP_PADS.map((x, i) => (
        <motion.rect
          key={`pt${i}`} x={x - 6} y="86" width="12" height="14" rx="2"
          fill={active ? G_MID : G_DEEP}
          initial={{ opacity: 0.25 }}
          animate={active ? { opacity: [0.25, 1, 0.7] } : { opacity: 0.25 }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
          style={{ filter: active ? 'url(#ccGlow)' : 'none' }}
        />
      ))}
      {BOTTOM_PADS.map((x, i) => (
        <motion.rect
          key={`pb${i}`} x={x - 6} y="300" width="12" height="14" rx="2"
          fill={active ? G_MID : G_DEEP}
          initial={{ opacity: 0.25 }}
          animate={active ? { opacity: [0.25, 1, 0.7] } : { opacity: 0.25 }}
          transition={{ duration: 0.4, delay: i * 0.04 }}
          style={{ filter: active ? 'url(#ccGlow)' : 'none' }}
        />
      ))}
      {SIDE_PADS.map((y, i) => (
        <motion.rect
          key={`pl${i}`} x="84" y={y - 6} width="16" height="12" rx="2"
          fill={active ? G_MID : G_DEEP}
          initial={{ opacity: 0.25 }}
          animate={active ? { opacity: [0.25, 1, 0.7] } : { opacity: 0.25 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          style={{ filter: active ? 'url(#ccGlow)' : 'none' }}
        />
      ))}
      {SIDE_PADS.map((y, i) => (
        <motion.rect
          key={`pr${i}`} x="300" y={y - 6} width="16" height="12" rx="2"
          fill={active ? G_MID : G_DEEP}
          initial={{ opacity: 0.25 }}
          animate={active ? { opacity: [0.25, 1, 0.7] } : { opacity: 0.25 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          style={{ filter: active ? 'url(#ccGlow)' : 'none' }}
        />
      ))}
    </svg>
  )
}

/* ── 회로 생성 시작 큐 (트레이스가 칩 밖으로 뻗음) ──── */
const CUE_TRACES = [
  'M 200 70  L 200 30  L 360 30',
  'M 200 330 L 200 372 L 60 372',
  'M 78 200  L 30 200  L 30 70',
  'M 322 200 L 372 200 L 372 330',
  'M 130 100 L 90 60   L 30 60',
  'M 270 300 L 320 350 L 372 350',
]

function CueTrace({ d, grow }) {
  const dist = useTransform(grow, (v) => `${v * 100}%`)
  const dotOpacity = useTransform(grow, [0, 0.05, 0.95, 1], [0, 1, 1, 0])
  return (
    <g>
      <motion.path
        d={d} fill="none" stroke={G_MID} strokeWidth="1.4"
        style={{ pathLength: grow }}
      />
      <motion.circle
        r="4" fill={G_NEAR}
        style={{
          offsetPath: `path('${d}')`,
          offsetDistance: dist,
          opacity: dotOpacity,
          filter: 'drop-shadow(0 0 6px #66FF99)',
        }}
      />
    </g>
  )
}

function CircuitCue({ grow }) {
  // L자(직교 1굴절) 트레이스 — 본격 PCB는 #3에서
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width: 'min(92vw, 680px)', height: 'min(92vw, 680px)', overflow: 'visible' }}
    >
      {CUE_TRACES.map((d, i) => (
        <CueTrace key={i} d={d} grow={grow} />
      ))}
    </svg>
  )
}

export default function CoreChipScene() {
  const sectionRef = useRef(null)
  const [chipActive, setChipActive] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // 단계별 트랜스폼
  // 터널 종료의 은은한 그린 글로우와 톤을 맞춰 시작(흰빛 점멸 방지)
  const bloomOpacity = useTransform(scrollYProgress, [0, 0.08, 0.2], [0.5, 0.32, 0])
  const rainOpacity  = useTransform(scrollYProgress, [0, 0.08, 0.4, 0.5], [0.85, 0.95, 0.35, 0.12])
  const coreOpacity  = useTransform(scrollYProgress, [0.16, 0.34, 0.62, 0.72], [0, 1, 1, 0.55])
  const coreScale    = useTransform(scrollYProgress, [0.16, 0.46], [0.25, 1])
  const chipOpacity  = useTransform(scrollYProgress, [0.46, 0.6], [0, 1])
  const chipScale    = useTransform(scrollYProgress, [0.46, 0.62], [0.82, 1])
  const circuitGrow  = useTransform(scrollYProgress, [0.66, 1], [0, 1])

  // 캡션 페이드 윈도우
  const capCore    = useTransform(scrollYProgress, [0.2, 0.3, 0.42, 0.46], [0, 1, 1, 0])
  const capChip    = useTransform(scrollYProgress, [0.5, 0.58, 0.66, 0.7], [0, 1, 1, 0])
  const capCircuit = useTransform(scrollYProgress, [0.74, 0.84, 1], [0, 1, 1])

  // 칩 활성화 트리거 (한 번 켜지면 유지)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.52 && !chipActive) setChipActive(true)
    if (v < 0.46 && chipActive) setChipActive(false)
  })

  return (
    // 전환존(P1-A): 터널 꼬리와 -50vh 겹쳐, 터널이 용해되는 동안 코어칩 Rain/Bloom이
    // 그 위로 페이드인되며 크로스페이드된다 (코어칩은 GSAP 핀 없는 CSS sticky라 거동 예측 가능)
    <section ref={sectionRef} id="core" className="relative h-[460vh]" style={{ marginTop: '-50vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* 1. Binary Rain — 데이터 분해/쏟아짐 (v2 green) */}
        <motion.div style={{ opacity: rainOpacity }} className="absolute inset-0">
          <BinaryRain
            opacity={1}
            speed={1.5}
            density={0.955}
            bodyColor={G_MID}
            headColor={G_NEAR}
          />
        </motion.div>

        {/* 2. 터널 분해 블룸 (시작부 화이트-그린 과노출) */}
        <motion.div
          style={{ opacity: bloomOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(180,255,220,0.9) 0%, rgba(102, 255, 153,0.5) 25%, rgba(0,200,83,0.12) 50%, rgba(0,0,0,0) 75%)',
            }}
          />
        </motion.div>

        {/* 3. Software Core (Three.js) — 정사각 중앙 스테이지에서 "제자리 응결"(v3 #3b)
            기존: absolute inset-0(가로로 긴 뷰포트)를 스케일 → 시각 중심이 흔들려
                  핵이 빗겨 생겼다가 가운데로 이동하는 것처럼 보임.
            수정: 뷰포트 정중앙에 고정된 정사각 스테이지를 origin-center 로 스케일.
                  Canvas·글로우가 모두 같은 중심을 공유 → 위치 고정, 제자리에서 커진다. */}
        <motion.div
          style={{ opacity: coreOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{ scale: coreScale, transformOrigin: 'center', width: 'min(92vw, 92vh)', height: 'min(92vw, 92vh)' }}
            className="relative"
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 55 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: 'transparent' }}
              onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
            >
              <CoreSphere />
              <CoreParticles count={460} />
              <OrbitRing radius={2.5} tilt={[1.1, 0, 0]} speed={0.35} />
              <OrbitRing radius={2.85} tilt={[0.4, 0.8, 0]} speed={-0.26} />
            </Canvas>
            {/* core radial glow — 같은 정사각 중심에 정렬 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  width: '70%', height: '70%', borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(0,200,83,0.14) 0%, rgba(0,200,83,0.04) 42%, transparent 70%)',
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* 4. 반도체 Chip (활성화) */}
        <motion.div
          style={{ opacity: chipOpacity, scale: chipScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div style={{ width: 'min(80vw, 460px)', height: 'min(80vw, 460px)' }}>
            <ChipActivate active={chipActive} />
          </div>
        </motion.div>

        {/* 5. Circuit Network 생성 시작 */}
        <CircuitCue grow={circuitGrow} />

        {/* ── 캡션 ── */}
        <motion.div
          style={{ opacity: capCore }}
          className="absolute bottom-20 left-0 right-0 text-center px-6 pointer-events-none"
        >
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: G_MID }}>
            Software Core
          </p>
          <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', letterSpacing: '-0.03em' }}>
            데이터가 핵을 이룬다
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: capChip }}
          className="absolute bottom-20 left-0 right-0 text-center px-6 pointer-events-none"
        >
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: G_NEAR }}>
            Chip Activated
          </p>
          <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', letterSpacing: '-0.03em' }}>
            컴퓨터의 뇌가 깨어난다
          </h2>
        </motion.div>

        <motion.div
          style={{ opacity: capCircuit }}
          className="absolute bottom-20 left-0 right-0 text-center px-6 pointer-events-none"
        >
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: G_MID }}>
            Circuit Network
          </p>
          <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.6rem,4vw,3rem)', letterSpacing: '-0.03em' }}>
            회로가 형성된다
          </h2>
          <p className="font-mono text-xs mt-3" style={{ color: 'rgba(0,200,83,0.4)' }}>
            ↓ 커리큘럼이 펼쳐집니다
          </p>
        </motion.div>

        {/* HUD */}
        <div className="absolute top-8 left-8 font-mono text-[10px] tracking-[0.3em] pointer-events-none" style={{ color: 'rgba(0,200,83,0.4)' }}>
          {'>>'} CORE SYSTEM
        </div>
      </div>
    </section>
  )
}
