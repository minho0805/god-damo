import { motion } from 'framer-motion'

const titleVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const charVariant = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

function GlitchTitle({ text }) {
  return (
    <motion.h1
      variants={titleVariants}
      initial="hidden"
      animate="visible"
      className="font-mono font-bold leading-none tracking-tighter text-white"
      style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', letterSpacing: '-0.04em' }}
    >
      {text.split('').map((char, i) => (
        <motion.span key={i} variants={charVariant} style={{ display: 'inline-block' }}>
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

export default function HeroScene() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Binary rain 은 전역 레이어(App.jsx)가 담당 — 여기 로컬 인스턴스 제거 */}

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      <div className="relative z-10 text-center px-6 select-none">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs tracking-[0.3em] text-green mb-8 uppercase"
        >
          Seokyeong University · Seoul, Korea
        </motion.p>

        {/* Main title */}
        <GlitchTitle text="소프트웨어학과" />

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="font-mono text-base text-[#888] mt-6 tracking-[0.2em]"
        >
          SOFTWARE ENGINEERING
        </motion.p>

        {/* CRT scan line decoration */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 h-px origin-left"
          style={{ background: 'linear-gradient(90deg, transparent, #00C853, transparent)', width: '320px' }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }}
          className="mt-12 font-mono text-xs tracking-[0.25em] text-green"
        >
          SCROLL TO ENTER ↓
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-green/30 font-mono text-xs">[ 01 ]</div>
      <div className="absolute top-8 right-8 text-green/30 font-mono text-xs">SKU_SW</div>
      <div className="absolute bottom-8 left-8 text-green/20 font-mono text-[10px]">
        {'>>'} SYSTEM ONLINE
      </div>
      <div className="absolute bottom-8 right-8 text-green/20 font-mono text-[10px]">
        v2025.1
      </div>
    </section>
  )
}
