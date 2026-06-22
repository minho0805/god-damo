import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Minimal starfield canvas
function Starfield({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const stars = Array.from({ length: 200 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.2,
      a:    Math.random(),
      da:   (Math.random() - 0.5) * 0.005,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da))
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1
        ctx.globalAlpha = s.a * 0.4
        ctx.fillStyle = '#00C853'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [canvasRef])

  return null
}

const AWARDS = [
  { icon: '🏆', title: 'SW 중심 대학', sub: '교육부 선정' },
  { icon: '🚀', title: '창업 동아리 12개', sub: '학과 내 운영 중' },
  { icon: '🤝', title: '산학협력 48개사', sub: '현장 실습 연계' },
  { icon: '💡', title: '특허 출원 23건', sub: '학부생 공동 연구' },
]

export default function FutureScene() {
  const canvasRef = useRef(null)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <Starfield canvasRef={canvasRef} />

      {/* Awards grid — 명시적 중앙 정렬(mx-auto) + The Future 와 간격 확대(mb-20→mb-32) (v3 #6) */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 mb-32">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs text-green tracking-[0.4em] uppercase text-center mb-10"
        >
          Awards · Achievements
        </motion.p>

        <div className="grid grid-cols-2 gap-4">
          {AWARDS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl px-5 py-4"
              style={{
                border: '1px solid rgba(0, 200, 83,0.15)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="text-xl mb-2">{a.icon}</div>
              <p className="font-mono text-white text-sm font-medium">{a.title}</p>
              <p className="font-mono text-[#555] text-xs mt-1">{a.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main message */}
      <div className="relative z-10 text-center px-6">
        <div className="section-divider mb-16 max-w-xs mx-auto" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-green/60 tracking-[0.3em] uppercase mb-6"
        >
          The Future
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="font-mono font-bold text-white leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', letterSpacing: '-0.04em' }}
        >
          이 세계를<br />만드는 사람이<br />
          <span className="text-green">되고 싶다면</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-mono text-[#555] text-sm tracking-widest uppercase mt-6 mb-12"
        >
          SOFTWARE ENGINEERING @ Seokyeong University
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.a
            href="#"
            className="font-mono text-black font-bold px-8 py-4 rounded-lg text-sm"
            style={{
              background: '#00C853',
              boxShadow: '0 0 30px rgba(0, 200, 83,0.4)',
            }}
            whileHover={{ boxShadow: '0 0 50px rgba(0, 200, 83,0.7)', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            입학 안내 →
          </motion.a>
          <motion.a
            href="#"
            className="font-mono text-green px-8 py-4 rounded-lg text-sm"
            style={{ border: '1px solid rgba(0, 200, 83,0.4)', background: 'rgba(0, 200, 83,0.05)' }}
            whileHover={{ borderColor: 'rgba(0, 200, 83,0.8)', background: 'rgba(0, 200, 83,0.1)' }}
            whileTap={{ scale: 0.97 }}
          >
            커리큘럼 보기
          </motion.a>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full mt-20 px-6 text-center">
        <div className="section-divider mb-8 max-w-lg mx-auto" />
        <p className="font-mono text-[#333] text-[11px] tracking-widest">
          © 2025 Seokyeong University · Department of Software Engineering
        </p>
        <p className="font-mono text-[#222] text-[10px] mt-2">
          서경대학교 소프트웨어학과 · 서울특별시 성북구 서경로 124
        </p>
      </div>
    </section>
  )
}
