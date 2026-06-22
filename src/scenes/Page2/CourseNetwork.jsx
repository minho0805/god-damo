import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COURSES = [
  {
    id: 'prog',
    title: '프로그래밍 언어',
    tag: '1학년',
    items: ['C 프로그래밍', 'Python 기초', 'Java 프로그래밍'],
    color: '#00C853',
  },
  {
    id: 'algo',
    title: '알고리즘 · 자료구조',
    tag: '2학년',
    items: ['자료구조', '알고리즘 설계', '복잡도 분석'],
    color: '#00C853',
  },
  {
    id: 'web',
    title: '웹 · 앱 개발',
    tag: '2-3학년',
    items: ['웹 프레임워크', '모바일 앱', 'React · Flutter'],
    color: '#00C853',
  },
  {
    id: 'ai',
    title: 'AI · 데이터',
    tag: '3학년',
    items: ['머신러닝', '딥러닝', '데이터 분석'],
    color: '#00C853',
  },
  {
    id: 'sys',
    title: '시스템 · 네트워크',
    tag: '3-4학년',
    items: ['운영체제', '컴퓨터 네트워크', '시스템 프로그래밍'],
    color: '#00C853',
  },
  {
    id: 'cap',
    title: '캡스톤 · 프로젝트',
    tag: '4학년',
    items: ['산학협력 프로젝트', '졸업 작품', '스타트업 인큐베이팅'],
    color: '#00C853',
  },
]

function CourseCard({ course, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Circuit trace coming from left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center" style={{ left: -32, width: 28 }}>
        <div style={{ flex: 1, height: 1, background: isOpen ? 'rgba(0, 200, 83,0.8)' : 'rgba(0, 200, 83,0.25)' }} />
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: isOpen ? '#00C853' : 'rgba(0, 200, 83,0.4)',
            boxShadow: isOpen ? '0 0 8px rgba(0, 200, 83,0.8)' : 'none',
          }}
        />
      </div>

      <motion.div
        className="rounded-xl overflow-hidden cursor-pointer select-none"
        style={{
          border: `1px solid ${isOpen ? 'rgba(0, 200, 83,0.5)' : 'rgba(0, 200, 83,0.15)'}`,
          background: isOpen ? 'rgba(0, 200, 83,0.06)' : 'rgba(255,255,255,0.02)',
        }}
        whileHover={{ borderColor: 'rgba(0, 200, 83,0.4)' }}
        onClick={onToggle}
      >
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] text-green/60 tracking-widest uppercase block mb-1">
              {course.tag}
            </span>
            <span className="font-mono text-sm text-white font-medium">{course.title}</span>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-green text-lg font-mono font-light"
          >
            +
          </motion.span>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-4 space-y-2 border-t" style={{ borderColor: 'rgba(0, 200, 83,0.1)' }}>
                {course.items.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 pt-2"
                  >
                    <span className="text-green text-xs font-mono">→</span>
                    <span className="text-[#888] text-xs font-sans">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function CourseNetwork() {
  const [openId, setOpenId] = useState('prog')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-black py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs text-green tracking-[0.4em] uppercase mb-4"
          >
            Course Network
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono font-bold text-white"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', letterSpacing: '-0.03em' }}
          >
            4년의 여정,<br />
            <span className="text-green">체계적으로 연결된</span> 커리큘럼
          </motion.h2>
        </div>

        {/* Vertical circuit spine */}
        <div className="relative pl-10">
          {/* Spine line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'linear' }}
            className="absolute left-4 top-0 bottom-0 w-px origin-top"
            style={{ background: 'linear-gradient(180deg, #00C853, rgba(0, 200, 83,0.2))' }}
          />

          <div className="space-y-4">
            {COURSES.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                isOpen={openId === course.id}
                onToggle={() => setOpenId(openId === course.id ? null : course.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
