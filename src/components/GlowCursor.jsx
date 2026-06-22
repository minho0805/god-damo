import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function GlowCursor() {
  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)

  // Inner dot — tight follow
  const x1 = useSpring(mx, { damping: 28, stiffness: 350, mass: 0.5 })
  const y1 = useSpring(my, { damping: 28, stiffness: 350, mass: 0.5 })

  // Outer ring — looser follow
  const x2 = useSpring(mx, { damping: 35, stiffness: 180, mass: 0.8 })
  const y2 = useSpring(my, { damping: 35, stiffness: 180, mass: 0.8 })

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX - 8)
      my.set(e.clientY - 8)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [mx, my])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999]"
        style={{
          x: x1, y: y1,
          background: '#00C853',
          boxShadow: '0 0 12px rgba(0, 200, 83,0.9), 0 0 30px rgba(0, 200, 83,0.4)',
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]"
        style={{
          x: x2, y: y2,
          border: '1px solid rgba(0, 200, 83,0.4)',
          translateX: '-25%',
          translateY: '-25%',
        }}
      />
    </>
  )
}
