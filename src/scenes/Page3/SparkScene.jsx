import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function createParticles(canvas) {
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const particles = []
  const count = 120

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
    const speed = 4 + Math.random() * 8
    const life  = 0.6 + Math.random() * 0.6
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: 1.5 + Math.random() * 3,
      color: Math.random() > 0.3 ? '#00C853' : '#FFFFFF',
    })
  }
  return particles
}

function runSpark(canvas) {
  const ctx = canvas.getContext('2d')
  let particles = createParticles(canvas)
  let raf

  function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    particles = particles.filter(p => p.life > 0)

    for (const p of particles) {
      const alpha = p.life / p.maxLife
      ctx.globalAlpha = alpha
      ctx.shadowColor = p.color
      ctx.shadowBlur  = 8
      ctx.fillStyle   = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
      ctx.fill()

      p.x  += p.vx
      p.y  += p.vy
      p.vx *= 0.96
      p.vy *= 0.96
      p.vy += 0.08  // slight gravity
      p.life -= 0.02
    }

    ctx.globalAlpha = 1
    ctx.shadowBlur  = 0

    if (particles.length > 0) {
      raf = requestAnimationFrame(loop)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  loop()
  return () => cancelAnimationFrame(raf)
}

export default function SparkScene() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)
  const firedRef   = useRef(false)
  const isInView   = useInView(sectionRef, { once: true, margin: '-20%' })

  useEffect(() => {
    if (!isInView || firedRef.current) return
    firedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const cleanup = runSpark(canvas)
    return cleanup
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Flash overlay */}
      {isInView && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: '#00C853' }}
        />
      )}

      {/* Text */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-mono text-xs text-green tracking-[0.4em] uppercase mb-4"
        >
          Spark Transition
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono font-bold text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}
        >
          그래서,<br />
          <span className="text-green">졸업 후에는?</span>
        </motion.h2>
      </div>
    </section>
  )
}
