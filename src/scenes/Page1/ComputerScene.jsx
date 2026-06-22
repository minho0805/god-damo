import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ComputerScene() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Monitor grows from small → fills screen
  const scale     = useTransform(scrollYProgress, [0.1, 0.7], [0.25, 14])
  const opacity   = useTransform(scrollYProgress, [0.05, 0.15, 0.75, 0.9], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        <motion.div style={{ scale, opacity }} className="relative">
          {/* Monitor outer shell */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              width: 560,
              height: 380,
              border: '2px solid rgba(0, 200, 83,0.35)',
              background: '#050505',
              boxShadow: '0 0 60px rgba(0, 200, 83,0.08), inset 0 0 40px rgba(0,0,0,0.8)',
            }}
          >
            {/* Bezel inner line */}
            <div
              className="absolute inset-3 rounded-xl overflow-hidden scanlines"
              style={{ border: '1px solid rgba(0, 200, 83,0.15)' }}
            >
              {/* Screen content — 내부 Binary Rain 제거(v3 #3a): 네모칸만 커져 바로 터널로 */}
              <div className="absolute inset-0 bg-black">
                {/* Terminal prompt */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6 font-mono text-green text-sm">
                  <p className="text-green/50 text-xs mb-1">{'>>'} BOOT SEQUENCE COMPLETE</p>
                  <p className="text-green/50 text-xs mb-1">{'>>'} LOADING SOFTWARE CORE...</p>
                  <p className="text-white text-sm">
                    C:\SKU\SOFTWARE&gt; <span className="blink">_</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Monitor brand label */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-green/20 font-mono text-[10px] tracking-widest">
              SKU-SW-01
            </div>
          </div>

          {/* Monitor stand */}
          <div className="flex justify-center mt-1">
            <div
              style={{
                width: 80,
                height: 24,
                background: 'linear-gradient(180deg, rgba(0, 200, 83,0.1), rgba(0, 200, 83,0.03))',
                border: '1px solid rgba(0, 200, 83,0.15)',
                borderRadius: '0 0 8px 8px',
              }}
            />
          </div>
          <div
            className="mx-auto mt-0"
            style={{
              width: 140,
              height: 4,
              background: 'rgba(0, 200, 83,0.08)',
              borderRadius: 4,
            }}
          />
        </motion.div>

        {/* Enter text */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0, 1, 0]) }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 font-mono text-xs text-green/50 tracking-widest text-center"
        >
          ENTERING DIGITAL SPACE
        </motion.div>
      </div>
    </section>
  )
}
