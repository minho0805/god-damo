import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ════════════════════════════════════════════════════════
 *  CareerNetwork  (v2 #4 — Career + Awards 드릴다운)
 *
 *  네트워크 노드(직군) 선택 → 하나의 연결된 패널 안에서
 *    ① 기술 스택 → ② 프로젝트 → ③ 수상 경력 → ④ 진로
 *  가 수직 트레이스로 연결되어 흐른다. 수상과 진로가
 *  같은 UI 안에서 이어져 보인다.
 * ════════════════════════════════════════════════════════ */

const G_NEAR = '#66FF99'
const G_MID  = '#00C853'

// 그래프 좌표 (viewBox 1000 x 340) — 선·노드 모두 이 좌표계를 공유
const HUB = { x: 500, y: 64 }

const CAREERS = [
  {
    id: 'ai', label: 'AI Engineer', icon: '🧠', tagline: '지능을 설계하는 사람',
    pos: { x: 130, y: 250 },
    stack: ['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'MLOps'],
    projects: ['실시간 객체탐지 시스템', '의료영상 분할 연구', 'LLM 파인튜닝 파이프라인'],
    awards: [
      { t: '전국 대학생 AI 경진대회 대상', y: '2024' },
      { t: 'ICPC 아시아 지역본선 동상', y: '2023' },
      { t: '한국정보과학회 학부 우수논문상', y: '2024' },
    ],
    career: 'AI 연구소·자율주행·의료AI 분야 진출 또는 AI 대학원 진학. 모델링부터 MLOps까지 전 주기를 다룬다.',
    companies: ['삼성리서치', 'LG AI연구원', '네이버 클로바'],
    salary: '평균 초봉 5,500만원+',
  },
  {
    id: 'fe', label: 'Frontend Developer', icon: '🎨', tagline: '경험을 그리는 사람',
    pos: { x: 315, y: 250 },
    stack: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Three.js'],
    projects: ['인터랙티브 포트폴리오 플랫폼', '실시간 협업 에디터', 'WebGL 데이터 시각화'],
    awards: [
      { t: '교내 해커톤 대상', y: '2024' },
      { t: '카카오 테크 캠퍼스 우수상', y: '2023' },
      { t: '공개SW 개발자대회 입상', y: '2024' },
    ],
    career: '웹·앱 프론트엔드 / UI 엔지니어 / 풀스택 개발자. 사용자가 직접 만지는 인터페이스를 책임진다.',
    companies: ['카카오', '토스', '당근마켓'],
    salary: '평균 초봉 4,800만원+',
  },
  {
    id: 'be', label: 'Backend Developer', icon: '⚙️', tagline: '시스템을 떠받치는 사람',
    pos: { x: 500, y: 250 },
    stack: ['Java', 'Spring', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    projects: ['대용량 트래픽 API 서버', 'MSA 결제 시스템', '실시간 알림 서버'],
    awards: [
      { t: '우아한테크코스 수료', y: '2024' },
      { t: '공개SW 개발자대회 장려상', y: '2023' },
      { t: '교내 캡스톤 최우수상', y: '2024' },
    ],
    career: '서버·백엔드 / 인프라·DevOps 엔지니어. 안정적인 대규모 시스템 아키텍처를 설계한다.',
    companies: ['우아한형제들', '쿠팡', 'NHN'],
    salary: '평균 초봉 5,000만원+',
  },
  {
    id: 'de', label: 'Data Engineer', icon: '📊', tagline: '데이터를 흐르게 하는 사람',
    pos: { x: 685, y: 250 },
    stack: ['Python', 'Spark', 'Kafka', 'Airflow', 'BigQuery', 'SQL'],
    projects: ['실시간 데이터 파이프라인', '추천 시스템 구축', '데이터 레이크 설계'],
    awards: [
      { t: '빅데이터 분석 경진대회 우수상', y: '2024' },
      { t: '공공데이터 활용 공모전 입상', y: '2023' },
      { t: '한국정보과학회 포스터 발표상', y: '2024' },
    ],
    career: '데이터 엔지니어·플랫폼 / 데이터 사이언티스트. 수집부터 분석까지 데이터 인프라를 만든다.',
    companies: ['SK텔레콤', '쿠팡', 'LINE'],
    salary: '평균 초봉 5,200만원+',
  },
  {
    id: 'founder', label: 'Startup Founder', icon: '🚀', tagline: '세상을 새로 짜는 사람',
    pos: { x: 870, y: 250 },
    stack: ['Product', 'Lean Startup', 'Growth', 'Full-Stack', 'Pitch'],
    projects: ['교내 창업동아리 MVP', '예비창업패키지 서비스', '캠퍼스 SaaS 런칭'],
    awards: [
      { t: '예비창업패키지 선정', y: '2024' },
      { t: '교내 창업경진대회 대상', y: '2023' },
      { t: 'K-Startup 그랜드챌린지 본선', y: '2024' },
    ],
    career: '스타트업 창업(CEO/CTO) 또는 초기 멤버 합류. 기술과 사업을 동시에 끌고 가는 역할.',
    companies: ['자체 창업', '프라이머', '스파크랩스'],
    salary: '성장 잠재력 무한',
  },
]

/* ── 그래프 노드 위치 → % 변환 ── */
const toPct = (v, max) => `${(v / max) * 100}%`

/* ── 드릴다운: 한 스테이지(레이어) ── */
const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function StageRow({ idx, title, accent, children, last }) {
  return (
    <motion.div variants={rowVariants} className="relative flex gap-5">
      {/* spine node */}
      <div className="relative flex flex-col items-center" style={{ width: 32 }}>
        {accent ? (
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 26, height: 26, transform: 'rotate(45deg)',
              background: 'rgba(102, 255, 153,0.12)',
              border: `1.5px solid ${G_NEAR}`,
              boxShadow: '0 0 16px rgba(102, 255, 153,0.5)',
            }}
          >
            <span style={{ transform: 'rotate(-45deg)', fontSize: 12 }}>🏆</span>
          </div>
        ) : (
          <div
            style={{
              width: 14, height: 14, borderRadius: '50%',
              background: 'rgba(0,40,20,0.9)', border: `2px solid ${G_MID}`,
              boxShadow: '0 0 8px rgba(0,200,83,0.4)',
            }}
          />
        )}
        {!last && (
          <div
            className="flex-1 mt-1"
            style={{ width: 2, background: 'linear-gradient(180deg, rgba(0,200,83,0.5), rgba(0,200,83,0.12))' }}
          />
        )}
      </div>

      {/* content */}
      <div className={`flex-1 ${last ? 'pb-2' : 'pb-7'}`}>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-mono text-[10px]" style={{ color: accent ? G_NEAR : 'rgba(0,200,83,0.6)' }}>
            {String(idx).padStart(2, '0')}
          </span>
          <span
            className="font-mono text-[11px] tracking-[0.25em] uppercase"
            style={{ color: accent ? G_NEAR : G_MID, textShadow: accent ? '0 0 12px rgba(102, 255, 153,0.6)' : 'none' }}
          >
            {title}
          </span>
        </div>
        {children}
      </div>
    </motion.div>
  )
}

function Tag({ children, bright }) {
  return (
    <span
      className="font-mono text-[11px] px-2.5 py-1 rounded"
      style={{
        border: `1px solid ${bright ? 'rgba(102, 255, 153,0.45)' : 'rgba(0,200,83,0.25)'}`,
        background: bright ? 'rgba(102, 255, 153,0.08)' : 'rgba(0,200,83,0.04)',
        color: bright ? G_NEAR : G_MID,
      }}
    >
      {children}
    </span>
  )
}

function Drilldown({ career }) {
  return (
    <motion.div
      key={career.id}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
      className="w-full"
    >
      {/* selected header */}
      <motion.div variants={rowVariants} className="flex items-center gap-3 mb-7">
        <span style={{ fontSize: 30 }}>{career.icon}</span>
        <div>
          <h3 className="font-mono font-bold text-white" style={{ fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
            {career.label}
          </h3>
          <p className="font-mono text-xs" style={{ color: 'rgba(0,200,83,0.6)' }}>
            {career.tagline} · {career.salary}
          </p>
        </div>
      </motion.div>

      {/* ① 기술 스택 */}
      <StageRow idx={1} title="Tech Stack">
        <div className="flex flex-wrap gap-2">
          {career.stack.map((s) => <Tag key={s}>{s}</Tag>)}
        </div>
      </StageRow>

      {/* ② 프로젝트 */}
      <StageRow idx={2} title="Projects">
        <ul className="space-y-1.5">
          {career.projects.map((p) => (
            <li key={p} className="flex items-center gap-2 font-sans text-sm" style={{ color: '#b8c4bd' }}>
              <span style={{ color: G_MID }}>▹</span>{p}
            </li>
          ))}
        </ul>
      </StageRow>

      {/* ③ 수상 경력 (강조) */}
      <StageRow idx={3} title="Awards" accent>
        <ul className="space-y-2">
          {career.awards.map((a) => (
            <li key={a.t} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 font-mono text-sm text-white">
                <span style={{ color: G_NEAR }}>★</span>{a.t}
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'rgba(0,200,83,0.5)' }}>{a.y}</span>
            </li>
          ))}
        </ul>
      </StageRow>

      {/* ④ 진로 */}
      <StageRow idx={4} title="Career Path" last>
        <p className="font-sans text-sm leading-relaxed mb-3" style={{ color: '#b8c4bd' }}>
          {career.career}
        </p>
        <div className="flex flex-wrap gap-2">
          {career.companies.map((c) => <Tag key={c} bright>{c}</Tag>)}
        </div>
      </StageRow>
    </motion.div>
  )
}

export default function CareerNetwork() {
  // 기본 선택을 중앙 노드(be, x=500)로 — 로드 시 허브→중앙노드→패널이 수직축에 정렬되어
  // 시작 구도가 중앙에 온다(v4 P2-b). 좌측 ai 기본 선택이 좌측 치우침의 원인이었음.
  const [activeId, setActiveId] = useState('be')
  const active = CAREERS.find((c) => c.id === activeId)

  return (
    <section id="career" className="relative min-h-screen py-24 overflow-hidden">
      {/* faint star/grid backdrop */}
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* header — 그래프와 같은 1000px 중앙 컬럼으로 통일(v3 #4): 헤딩이 hub 바로 위에 정렬 */}
        <div className="text-center mb-12 mx-auto" style={{ maxWidth: 1000 }}>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.4em] uppercase mb-4" style={{ color: G_MID }}
          >
            Career & Awards Network
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-bold text-white"
            style={{ fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', letterSpacing: '-0.03em' }}
          >
            당신의 다음 목적지
          </motion.h2>
          <p className="font-mono text-[11px] mt-3" style={{ color: 'rgba(0,200,83,0.45)' }}>
            노드를 선택해 진로·수상·프로젝트를 탐색하세요
          </p>
        </div>

        {/* ── 네트워크 그래프 (직군 선택) ── */}
        <div className="relative w-full mb-14" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <svg viewBox="0 0 1000 340" className="w-full h-auto" style={{ overflow: 'visible' }}>
            {/* hub → node 트레이스 */}
            {CAREERS.map((c) => {
              const selected = c.id === activeId
              return (
                <g key={c.id}>
                  <line
                    x1={HUB.x} y1={HUB.y} x2={c.pos.x} y2={c.pos.y}
                    stroke={selected ? G_NEAR : 'rgba(0,200,83,0.2)'} strokeWidth={selected ? 1.6 : 1}
                  />
                  {selected && (
                    <line
                      className="pcb-current fast"
                      x1={HUB.x} y1={HUB.y} x2={c.pos.x} y2={c.pos.y}
                      stroke={G_NEAR} strokeWidth="1.6"
                      style={{ filter: 'drop-shadow(0 0 3px #66FF99)' }}
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* hub node */}
          <div
            className="absolute flex items-center justify-center text-center"
            style={{
              left: toPct(HUB.x, 1000), top: toPct(HUB.y, 340),
              transform: 'translate(-50%,-50%)',
              width: 78, height: 78, borderRadius: '50%',
              border: `2px solid ${G_MID}`, background: 'rgba(0,200,83,0.08)',
              boxShadow: '0 0 30px rgba(0,200,83,0.3)',
            }}
          >
            <span className="font-mono text-[10px] font-bold leading-tight" style={{ color: G_NEAR }}>
              SKU<br />졸업생
            </span>
          </div>

          {/* career nodes — 위치(중앙정렬)와 스케일(hover)을 분리해 호버 점프 제거(v3 #5)
              바깥 div가 translate(-50%,-50%)로 위치만 고정(framer가 건드리지 않음),
              안쪽 motion.button은 scale 만 담당 → 노드 중심이 선 끝점에 항상 일치. */}
          {CAREERS.map((c) => {
            const selected = c.id === activeId
            return (
              <div
                key={c.id}
                className="absolute"
                style={{
                  left: toPct(c.pos.x, 1000), top: toPct(c.pos.y, 340),
                  transform: 'translate(-50%,-50%)',
                }}
              >
                <motion.button
                  onClick={() => setActiveId(c.id)}
                  className="flex flex-col items-center justify-center"
                  style={{
                    width: 92, height: 92, borderRadius: '50%',
                    border: `1.5px solid ${selected ? G_NEAR : 'rgba(0,200,83,0.5)'}`,
                    background: selected ? 'rgba(102, 255, 153,0.12)' : 'rgba(0,18,9,0.88)',
                    boxShadow: selected ? '0 0 26px rgba(102, 255, 153,0.45)' : '0 0 10px rgba(0,200,83,0.12)',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.08, borderColor: G_NEAR }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <span
                    className="font-mono text-[9px] mt-1 px-1 text-center leading-tight"
                    style={{ color: selected ? G_NEAR : '#9aa' }}
                  >
                    {c.label.split(' ')[0]}
                  </span>
                </motion.button>
              </div>
            )
          })}
        </div>

        {/* ── 드릴다운 패널 (진로 + 수상 연결) ── */}
        <div
          className="relative mx-auto rounded-2xl p-8 sm:p-10"
          style={{
            maxWidth: 720,
            border: '1px solid rgba(0,200,83,0.22)',
            background: 'linear-gradient(180deg, rgba(0,30,16,0.55), rgba(0,0,0,0.4))',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 0 60px rgba(0,200,83,0.08)',
          }}
        >
          {/* connecting trace from selected node into panel */}
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-px"
            style={{ height: 28, background: 'linear-gradient(180deg, transparent, rgba(102, 255, 153,0.6))' }}
          />
          <AnimatePresence mode="wait">
            <Drilldown key={active.id} career={active} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
