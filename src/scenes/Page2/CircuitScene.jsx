import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ════════════════════════════════════════════════════════
 *  CircuitScene  (v2 #3 — 살아있는 PCB)
 *
 *  중심 칩에서 45° PCB 트레이스가 뻗어나가 6개 과목 노드로
 *  연결된다. 스크롤에 따라 트레이스가 그려지고(전류 주입),
 *  전류 대시가 흐르며, 데이터 패킷이 칩→노드로 이동하고,
 *  도달한 노드가 점등되며 과목명이 실크스크린으로 발현된다.
 *  (카드 UI 없음 — 과목 = 회로 끝 노드)
 * ════════════════════════════════════════════════════════ */

const G_NEAR = '#66FF99'
const G_MID  = '#00C853'
const G_DEEP = '#00A63E'
const COPPER = '#0a4026'

// viewBox 1000 x 720, chip centered at (500, 360)
const BRANCHES = [
  {
    id: 'prog', area: '프로그래밍 기초', courses: 'C · Python · Java',
    path: 'M 455 285 L 455 232 L 372 150 L 170 150',
    node: { x: 170, y: 150 }, label: { x: 170, y: 110 }, sub: { x: 170, y: 128 },
    start: 0.14, end: 0.26,
  },
  {
    id: 'ai', area: 'AI · 머신러닝', courses: '머신러닝 · 딥러닝 · 데이터분석',
    path: 'M 545 285 L 545 232 L 628 150 L 830 150',
    node: { x: 830, y: 150 }, label: { x: 830, y: 110 }, sub: { x: 830, y: 128 },
    start: 0.24, end: 0.36,
  },
  {
    id: 'algo', area: '알고리즘 · 자료구조', courses: '자료구조 · 알고리즘설계 · 복잡도',
    path: 'M 425 340 L 332 340 L 292 380 L 130 380',
    node: { x: 130, y: 380 }, label: { x: 150, y: 338 }, sub: { x: 150, y: 356 },
    start: 0.34, end: 0.46,
  },
  {
    id: 'web', area: '웹 · 앱 개발', courses: '웹프레임워크 · 모바일 · React',
    path: 'M 575 340 L 668 340 L 708 380 L 870 380',
    node: { x: 870, y: 380 }, label: { x: 850, y: 338 }, sub: { x: 850, y: 356 },
    start: 0.44, end: 0.56,
  },
  {
    id: 'sys', area: '시스템 SW', courses: '운영체제 · 네트워크 · 시스템프로그래밍',
    path: 'M 455 435 L 455 520 L 355 620 L 300 620',
    node: { x: 300, y: 620 }, label: { x: 300, y: 654 }, sub: { x: 300, y: 672 },
    start: 0.54, end: 0.66,
  },
  {
    id: 'data', area: '데이터베이스', courses: 'DB설계 · SQL · 트랜잭션',
    path: 'M 545 435 L 545 520 L 645 620 L 700 620',
    node: { x: 700, y: 620 }, label: { x: 700, y: 654 }, sub: { x: 700, y: 672 },
    start: 0.64, end: 0.76,
  },
]

// 정적 장식용 비아(via)와 부품 풋프린트
const GROUND_VIAS = [
  [80, 80], [930, 80], [80, 660], [930, 660], [500, 60], [500, 680],
  [240, 250], [760, 250], [240, 470], [760, 470], [410, 660], [600, 60],
]

function CircuitBranch({ branch, progress }) {
  const { path, node, label, sub, start, end } = branch

  const traceLen     = useTransform(progress, [start, end], [0, 1])
  const currentOpac  = useTransform(progress, [end - 0.02, end + 0.02], [0, 1])
  const nodeOn       = useTransform(progress, [end - 0.03, end + 0.01], [0, 1])
  const packetOpac   = useTransform(progress, [end, end + 0.03], [0, 1])

  return (
    <g>
      {/* Copper underlay (dark) */}
      <motion.path
        d={path} fill="none" stroke={COPPER} strokeWidth="6"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ pathLength: traceLen }}
      />
      {/* Main copper trace */}
      <motion.path
        d={path} fill="none" stroke={G_DEEP} strokeWidth="2.4"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ pathLength: traceLen }}
      />
      {/* Flowing current overlay */}
      <motion.path
        className="pcb-current"
        d={path} fill="none" stroke={G_NEAR} strokeWidth="2.4"
        strokeLinejoin="round" strokeLinecap="round"
        style={{ opacity: currentOpac, filter: 'drop-shadow(0 0 3px #66FF99)' }}
      />
      {/* Data packet traveling chip → node */}
      <motion.circle
        r="3.6" fill={G_NEAR}
        style={{
          offsetPath: `path('${path}')`,
          opacity: packetOpac,
          filter: 'drop-shadow(0 0 5px #66FF99)',
        }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
      />

      {/* End node (course) */}
      <motion.g style={{ opacity: nodeOn }}>
        {/* pulsing activation ring */}
        <motion.circle
          cx={node.x} cy={node.y} r="16" fill="none" stroke={G_MID} strokeWidth="1"
          animate={{ r: [15, 24], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        {/* solder pad */}
        <circle cx={node.x} cy={node.y} r="13" fill="rgba(0,40,20,0.85)" stroke={G_MID} strokeWidth="1.6" />
        <circle cx={node.x} cy={node.y} r="5" fill={G_NEAR} style={{ filter: 'drop-shadow(0 0 5px #66FF99)' }} />

        {/* silkscreen labels (NOT a card) */}
        <text
          x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle"
          fill="#FFFFFF" fontSize="17" fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
        >
          {branch.area}
        </text>
        <text
          x={sub.x} y={sub.y} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(0,200,83,0.7)" fontSize="10"
          fontFamily="'JetBrains Mono', monospace"
        >
          {branch.courses}
        </text>
      </motion.g>
    </g>
  )
}

export default function CircuitScene() {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.06, 0.12], [0, 1, 1])
  const chipPower    = useTransform(scrollYProgress, [0.04, 0.13], [0, 1])
  const chipGlow     = useTransform(scrollYProgress, [0.04, 0.13], [0.06, 0.16])
  const outroOpacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1])
  const progressPct  = useTransform(scrollYProgress, (v) => `${Math.min(100, Math.round(v * 100))}%`)

  return (
    <section ref={sectionRef} id="curriculum" className="relative h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* PCB substrate */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,60,30,0.35) 0%, rgba(0,20,10,0.2) 45%, #000 80%)',
          }}
        />
        {/* copper grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,200,83,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Header */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute top-[8vh] left-0 right-0 text-center px-6 z-10 pointer-events-none"
        >
          <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: G_MID }}>
            Circuit Expansion · Curriculum
          </p>
          <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.4rem,3.4vw,2.6rem)', letterSpacing: '-0.03em' }}>
            중심 코어에서 커리큘럼이 뻗어나간다
          </h2>
        </motion.div>

        {/* PCB board SVG */}
        <div className="relative z-[5] w-full px-4" style={{ maxWidth: 1100 }}>
          <svg viewBox="0 0 1000 720" className="w-full h-auto" style={{ overflow: 'visible' }}>
            <defs>
              <filter id="chipGlowC" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" /><feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* silkscreen board border */}
            <rect x="20" y="20" width="960" height="680" rx="10" fill="none" stroke="rgba(0,200,83,0.18)" strokeWidth="1" strokeDasharray="2 6" />
            <text x="36" y="46" fill="rgba(0,200,83,0.35)" fontSize="11" fontFamily="'JetBrains Mono', monospace">SKU-PCB-2025 · REV.2</text>
            <text x="964" y="690" textAnchor="end" fill="rgba(0,200,83,0.25)" fontSize="10" fontFamily="'JetBrains Mono', monospace">SOFTWARE ENGINEERING</text>

            {/* ground vias + fiducials */}
            {GROUND_VIAS.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="rgba(0,60,30,0.6)" stroke="rgba(0,200,83,0.25)" strokeWidth="1" />
                <circle cx={x} cy={y} r="1.4" fill="rgba(0,200,83,0.4)" />
              </g>
            ))}

            {/* branches (traces + current + packets + nodes) */}
            {BRANCHES.map((b) => (
              <CircuitBranch key={b.id} branch={b} progress={scrollYProgress} />
            ))}

            {/* ── Central chip (QFP) ── */}
            <g>
              {/* chip pins (4 sides) */}
              {[440, 470, 500, 530, 560].map((x, i) => (
                <g key={`pt${i}`}>
                  <rect x={x - 4} y="270" width="8" height="16" fill={G_DEEP} />
                  <rect x={x - 4} y="434" width="8" height="16" fill={G_DEEP} />
                </g>
              ))}
              {[300, 330, 360, 390, 420].map((y, i) => (
                <g key={`ps${i}`}>
                  <rect x="409" y={y - 4} width="16" height="8" fill={G_DEEP} />
                  <rect x="575" y={y - 4} width="16" height="8" fill={G_DEEP} />
                </g>
              ))}

              {/* package body */}
              <motion.rect
                x="425" y="285" width="150" height="150" rx="8"
                fill="rgba(0,30,16,0.9)"
                stroke={G_MID} strokeWidth="2"
                style={{ filter: 'url(#chipGlowC)', opacity: chipPower }}
              />
              {/* die */}
              <motion.rect
                x="455" y="315" width="90" height="90" rx="3"
                fill="rgba(0, 200, 83,0.04)" stroke="rgba(0,200,83,0.5)" strokeWidth="1"
                style={{ opacity: chipPower }}
              />
              {/* pin-1 marker */}
              <motion.circle cx="445" cy="305" r="3" fill={G_NEAR} style={{ opacity: chipPower }} />
              {/* labels */}
              <motion.text
                x="500" y="356" textAnchor="middle" dominantBaseline="middle"
                fill={G_NEAR} fontSize="15" fontWeight="700" fontFamily="'JetBrains Mono', monospace"
                style={{ opacity: chipPower }}
              >
                SKU·SW
              </motion.text>
              <motion.text
                x="500" y="376" textAnchor="middle" dominantBaseline="middle"
                fill="rgba(0,200,83,0.6)" fontSize="9" fontFamily="'JetBrains Mono', monospace"
                style={{ opacity: chipPower }}
              >
                CORE
              </motion.text>
            </g>
          </svg>
        </div>

        {/* center glow div behind chip */}
        <motion.div
          style={{ opacity: chipGlow }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        >
          <div style={{ width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,83,0.5) 0%, transparent 70%)' }} />
        </motion.div>

        {/* progress HUD */}
        <div className="absolute bottom-8 left-8 font-mono text-[10px] tracking-[0.25em] z-10 pointer-events-none" style={{ color: 'rgba(0,200,83,0.5)' }}>
          {'>>'} ROUTING TRACES <motion.span>{progressPct}</motion.span>
        </div>

        {/* outro caption */}
        <motion.div
          style={{ opacity: outroOpacity }}
          className="absolute bottom-[7vh] left-0 right-0 text-center px-6 z-10 pointer-events-none"
        >
          <p className="font-mono text-sm" style={{ color: G_MID }}>
            6개 전공 트랙이 하나의 코어로 연결됩니다
          </p>
        </motion.div>
      </div>
    </section>
  )
}
