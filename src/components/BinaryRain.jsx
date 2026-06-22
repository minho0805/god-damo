import { useEffect, useRef } from 'react'

const CHARS = '01010110011001010110110001100011011011110110010001100101'

export default function BinaryRain({
  opacity = 0.15,
  speed = 0.6,
  density = 0.978,
  bodyColor = '#00C853',
  headColor = '#FFFFFF',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const fontSize = 13
    let drops = []
    let animId

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
      drops = Array(Math.floor(canvas.width / fontSize)).fill(0).map(() =>
        Math.floor(Math.random() * -50)
      )
    }

    resize()

    function draw() {
      // Fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize
        if (y < 0) { drops[i] += speed; continue }

        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * fontSize

        // Bright head
        if (drops[i] % 2 === 0) {
          ctx.fillStyle = headColor
          ctx.shadowColor = headColor
          ctx.shadowBlur = 6
        } else {
          ctx.fillStyle = bodyColor
          ctx.shadowColor = bodyColor
          ctx.shadowBlur = 3
        }

        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        if (y > canvas.height && Math.random() > density) {
          drops[i] = 0
        }
        drops[i] += speed
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [speed, density, bodyColor, headColor])

  return (
    <canvas
      ref={canvasRef}
      style={{ opacity, display: 'block' }}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
