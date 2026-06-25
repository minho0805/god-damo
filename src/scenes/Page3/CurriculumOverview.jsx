import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { courses, competencies } from '../../data/curriculum'
import { C } from '../../constants/colors'

/* 학과 이수체계도(전공역량 × 학기) 한눈에 보기 — SparkScene/CareerNetwork를
   대체하는 섹션. 처음엔 PCB 트레이스 라인 위에 칩을 띄우는 방식으로 만들었으나
   칩이 옆 학기 칸으로 넘쳐 보이고 텍스트가 어두워 가독성이 떨어졌다. 진짜
   그리드 표로 다시 짜서 학기마다 독립된 칸을 주고, 칩 텍스트를 흰색으로 올려
   대비를 높였다. */

const SEMESTERS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2']

const TYPE_COLOR = {
  lec:  '#66FF99',
  both: '#00C853',
  lab:  '#00A63E',
}

const TYPE_LABEL = {
  lec:  '이론',
  both: '이론+실습',
  lab:  '실습',
}

function CourseChip({ course }) {
  const color = TYPE_COLOR[course.type]
  return (
    <div
      className="font-mono text-white"
      style={{
        borderLeft: `2px solid ${color}`,
        background: 'rgba(255,255,255,.05)',
        borderRadius: 3,
        padding: '3px 6px',
        fontSize: 11,
        lineHeight: 1.4,
        marginBottom: 4,
      }}
    >
      {course.ko}
    </div>
  )
}

const GRID_COLS = '148px repeat(8, minmax(96px, 1fr))'

export default function CurriculumOverview() {
  return (
    <section className="relative bg-black py-28 px-6 overflow-hidden">
      {/* copper grid backdrop, matches CircuitScene's PCB language */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,200,83,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,60,30,0.3) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs tracking-[0.4em] uppercase mb-3" style={{ color: C.green }}>
            Curriculum Roadmap · Overview
          </p>
          <h2 className="font-mono font-bold text-white" style={{ fontSize: 'clamp(1.6rem,3.6vw,2.8rem)', letterSpacing: '-0.03em' }}>
            4년, 8학기의 이수체계도
          </h2>
          <p className="text-sm mt-4 opacity-60 max-w-xl mx-auto">
            전공역량 4가지가 학기를 따라 어떻게 쌓이는지 한 장에 모았습니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto"
        >
          <div
            className="grid rounded-xl overflow-hidden"
            style={{
              gridTemplateColumns: GRID_COLS,
              border: `1px solid ${C.greenBorder}`,
              background: 'rgba(2,8,5,.55)',
              backdropFilter: 'blur(6px)',
              minWidth: 980,
            }}
          >
            {/* header row */}
            <div
              className="font-mono text-[11px] flex items-center px-4 py-3"
              style={{ color: 'rgba(0,200,83,.7)', borderBottom: `1px solid ${C.greenBorder}`, background: 'rgba(0,200,83,.05)' }}
            >
              전공역량
            </div>
            {SEMESTERS.map((sem, i) => (
              <div
                key={sem}
                className="font-mono text-[12px] text-center py-3 tracking-wider"
                style={{
                  color: C.green,
                  fontWeight: 700,
                  borderBottom: `1px solid ${C.greenBorder}`,
                  borderLeft: `1px solid ${C.greenBorder}`,
                  background: i % 2 === 0 ? 'rgba(0,200,83,.07)' : 'rgba(0,200,83,.03)',
                }}
              >
                {sem}
              </div>
            ))}

            {/* data rows */}
            {competencies.map((comp, ci) => (
              <Fragment key={comp.id}>
                <div
                  className="flex flex-col justify-center px-4 py-4"
                  style={{
                    borderLeft: `3px solid ${comp.color}`,
                    borderBottom: ci < competencies.length - 1 ? `1px solid ${C.greenBorder}` : 'none',
                  }}
                >
                  <div className="font-bold text-[13px]" style={{ color: comp.color }}>{comp.name}</div>
                  <div className="font-mono text-[9px] mt-1" style={{ color: 'rgba(0,200,83,.5)', letterSpacing: '.08em' }}>
                    {comp.en}
                  </div>
                </div>
                {SEMESTERS.map((sem, si) => {
                  const list = courses.filter((c) => c.comp === comp.id && c.sem === sem)
                  return (
                    <div
                      key={sem}
                      className="px-2 py-3 flex flex-col justify-center"
                      style={{
                        borderLeft: `1px solid ${C.greenBorder}`,
                        borderBottom: ci < competencies.length - 1 ? `1px solid ${C.greenBorder}` : 'none',
                        background: si % 2 === 0 ? 'rgba(0,200,83,.025)' : 'transparent',
                      }}
                    >
                      {list.length > 0 ? (
                        list.map((c, i) => <CourseChip key={i} course={c} />)
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,.18)', fontSize: 12 }}>—</span>
                      )}
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </motion.div>

        {/* legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 font-mono text-[11px]" style={{ color: 'rgba(255,255,255,.6)' }}>
          {Object.entries(TYPE_LABEL).map(([type, label]) => (
            <div key={type} className="flex items-center gap-2">
              <span
                className="inline-block rounded-sm"
                style={{ width: 12, height: 12, borderLeft: `2px solid ${TYPE_COLOR[type]}`, background: 'rgba(255,255,255,.05)' }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
