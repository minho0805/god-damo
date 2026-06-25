import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import CurriculumTunnel from './CurriculumTunnel'
import CurriculumTable from '../../components/CurriculumTable'

/* AI-contest-ver.chungs 프로젝트의 커리큘럼 로드맵(연도별 3D 터널 + 학년 테이블)을
   그대로 가져온 섹션. 원본은 휠 이벤트를 가로채는 전역 가상 스크롤 훅을 썼지만
   demo는 여러 섹션이 한 페이지에 이어지는 구조라, 이 섹션 안에서만 동작하는
   framer-motion의 useScroll(scrollYProgress)로 교체해 같은 0→1 진행도를 공급한다. */
const YEAR_RANGES = [
  [0.06, 0.28],
  [0.28, 0.50],
  [0.50, 0.72],
  [0.72, 0.90],
]

// 마지막 학년 표가 끝난 뒤(0.90→1.0) 터널/표를 걷어내고 다음 섹션(이수체계도
// 전체보기)과 같은 어두운 배경 + 코퍼 그리드로 미리 바뀌면서 자연스럽게 이어진다
const OUTRO_START = 0.90

function getYear(p) {
  for (let i = 0; i < YEAR_RANGES.length; i++) {
    if (p < YEAR_RANGES[i][1]) return i + 1
  }
  return 4
}

export default function CurriculumRoadmap() {
  const containerRef = useRef(null)
  const scrollRef = useRef(0)
  const gaugeRef = useRef(0)
  const contentWrapRef = useRef(null)
  const gridWrapRef = useRef(null)
  const bridgeRef = useRef(null)
  const [year, setYear] = useState(1)
  const [showTable, setShowTable] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollRef.current = v
    const tableVisible = v > YEAR_RANGES[0][0] && v < OUTRO_START
    setShowTable((prev) => (prev === tableVisible ? prev : tableVisible))
    if (tableVisible) {
      const y = getYear(v)
      setYear((prev) => (prev === y ? prev : y))
    }

    // outro: 터널·표·헤더를 걷어내고(0→1) 다음 섹션과 같은 코퍼 그리드 배경을 깐다
    const outroT = Math.max(0, Math.min(1, (v - OUTRO_START) / (1 - OUTRO_START)))
    if (contentWrapRef.current) contentWrapRef.current.style.opacity = String(1 - outroT)
    if (gridWrapRef.current) gridWrapRef.current.style.opacity = String(outroT * 0.4)
    // 브릿지 문구는 outro 중반에 잠깐 떠올랐다가 다시 가라앉는다
    const bridgeT = outroT < 0.5 ? outroT * 2 : (1 - outroT) * 2
    if (bridgeRef.current) bridgeRef.current.style.opacity = String(Math.max(0, Math.min(1, bridgeT)))
  })

  const isMobile = window.innerWidth < 760
  const dpr = isMobile ? 1.5 : Math.min(window.devicePixelRatio, 2)

  return (
    <section ref={containerRef} className="relative h-[840vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(0,60,30,0.35) 0%, #000 70%)' }}
      >
        <div ref={contentWrapRef}>
          <Canvas
            dpr={dpr}
            camera={{ fov: 62, near: 0.1, far: 1000, position: [0, 0, 20] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <CurriculumTunnel scrollDisp={scrollRef} gaugeRef={gaugeRef} />
          </Canvas>

          <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
            {showTable && (
              <div key={`yr-${year}`} style={{ position: 'absolute', inset: 0 }}>
                <CurriculumTable year={year} />
              </div>
            )}

            <div className="absolute top-[8vh] left-0 right-0 text-center px-6 pointer-events-none">
              <p className="font-mono text-[11px] tracking-[0.4em] uppercase mb-3" style={{ color: '#00C853' }}>
                Curriculum Roadmap
              </p>
              <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.4rem,3.4vw,2.6rem)', letterSpacing: '-0.03em' }}>
                4년간의 커리큘럼을 따라 깊이 들어간다
              </h2>
            </div>
          </div>
        </div>

        {/* 다음 섹션(이수체계도 전체보기)과 같은 코퍼 그리드 — outro에서 서서히 드러난다 */}
        <div
          ref={gridWrapRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            backgroundImage:
              'linear-gradient(rgba(0,200,83,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* 다음 섹션으로 넘어가는 브릿지 문구 */}
        <div
          ref={bridgeRef}
          className="absolute inset-0 flex items-center justify-center text-center px-6 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <p className="font-mono text-white" style={{ fontSize: 'clamp(1.2rem,2.8vw,2rem)', letterSpacing: '-0.02em' }}>
            이제, 4년의 흐름을<br />
            <span style={{ color: '#00C853' }}>한 장의 표</span>로 모아봅니다
          </p>
        </div>

        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            boxShadow: 'inset 0 0 240px 40px rgba(0,5,2,.9)',
          }}
        />
      </div>
    </section>
  )
}
