import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import FacultyCarousel from '../../components/FacultyCarousel'

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

export default function FutureScene() {
  const canvasRef = useRef(null)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <Starfield canvasRef={canvasRef} />

      {/* Main message */}
      <div className="relative z-10 w-full text-center px-6">
        <div className="section-divider mb-16 max-w-xs mx-auto" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs text-green/60 tracking-[0.3em] uppercase mb-6"
        >
          Meet the Faculty
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full max-w-[1200px] mx-auto"
        >
          <FacultyCarousel />
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
