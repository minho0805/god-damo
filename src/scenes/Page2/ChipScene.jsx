import { motion } from 'framer-motion'

const PADS_TOP    = [145, 195, 245, 295, 345]
const PADS_BOTTOM = [145, 195, 245, 295, 345]
const PADS_LEFT   = [145, 185, 225, 265]
const PADS_RIGHT  = [145, 185, 225, 265]

function ChipSVG() {
  return (
    <svg
      viewBox="0 0 490 350"
      className="w-full max-w-xl"
      style={{ filter: 'drop-shadow(0 0 24px rgba(0, 200, 83,0.3))' }}
    >
      <defs>
        <filter id="chipGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- Chip body --- */}
      <motion.rect
        x="120" y="80" width="250" height="190" rx="6"
        fill="none" stroke="rgba(0, 200, 83,0.5)" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'linear' }}
        filter="url(#chipGlow)"
      />

      {/* Die (inner rectangle) */}
      <motion.rect
        x="148" y="108" width="194" height="134" rx="3"
        fill="rgba(0, 200, 83,0.03)" stroke="rgba(0, 200, 83,0.25)" strokeWidth="1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />

      {/* Internal grid lines */}
      {[168, 188, 208, 228, 248, 268, 288, 308, 328].map((x, i) => (
        <motion.line
          key={`vg${i}`} x1={x} y1="108" x2={x} y2="242"
          stroke="rgba(0, 200, 83,0.1)" strokeWidth="0.5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.9 + i * 0.04 }}
        />
      ))}
      {[128, 148, 168, 188, 208, 228].map((y, i) => (
        <motion.line
          key={`hg${i}`} x1="148" y1={y} x2="342" y2={y}
          stroke="rgba(0, 200, 83,0.1)" strokeWidth="0.5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.9 + i * 0.04 }}
        />
      ))}

      {/* Core label */}
      <motion.text
        x="245" y="178" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0, 200, 83,0.7)" fontSize="11" fontFamily="'JetBrains Mono', monospace"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4 }}
      >
        SKU-SW-CORE
      </motion.text>
      <motion.text
        x="245" y="194" textAnchor="middle" dominantBaseline="middle"
        fill="rgba(0, 200, 83,0.4)" fontSize="8" fontFamily="'JetBrains Mono', monospace"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.6 }}
      >
        32nm PROCESS
      </motion.text>

      {/* Top pads + traces */}
      {PADS_TOP.map((x, i) => (
        <g key={`pt${i}`}>
          <motion.rect
            x={x} y="60" width="16" height="18" rx="2"
            fill="rgba(0, 200, 83,0.5)"
            initial={{ opacity: 0, scaleY: 0 }} whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: `${x + 8}px 78px` }}
            transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
          />
          <motion.line
            x1={x + 8} y1="78" x2={x + 8} y2="108"
            stroke="rgba(0, 200, 83,0.35)" strokeWidth="1"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.08, ease: 'linear' }}
          />
        </g>
      ))}

      {/* Bottom pads */}
      {PADS_BOTTOM.map((x, i) => (
        <g key={`pb${i}`}>
          <motion.rect
            x={x} y="272" width="16" height="18" rx="2"
            fill="rgba(0, 200, 83,0.5)"
            initial={{ opacity: 0, scaleY: 0 }} whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: `${x + 8}px 272px` }}
            transition={{ duration: 0.3, delay: 1 + i * 0.08 }}
          />
          <motion.line
            x1={x + 8} y1="242" x2={x + 8} y2="272"
            stroke="rgba(0, 200, 83,0.35)" strokeWidth="1"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.08, ease: 'linear' }}
          />
        </g>
      ))}

      {/* Left pads */}
      {PADS_LEFT.map((y, i) => (
        <g key={`pl${i}`}>
          <motion.rect
            x="98" y={y} width="20" height="14" rx="2"
            fill="rgba(0, 200, 83,0.5)"
            initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: `118px ${y + 7}px` }}
            transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
          />
          <motion.line
            x1="118" y1={y + 7} x2="148" y2={y + 7}
            stroke="rgba(0, 200, 83,0.35)" strokeWidth="1"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.1, ease: 'linear' }}
          />
        </g>
      ))}

      {/* Right pads */}
      {PADS_RIGHT.map((y, i) => (
        <g key={`pr${i}`}>
          <motion.rect
            x="372" y={y} width="20" height="14" rx="2"
            fill="rgba(0, 200, 83,0.5)"
            initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            style={{ transformOrigin: `372px ${y + 7}px` }}
            transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
          />
          <motion.line
            x1="342" y1={y + 7} x2="372" y2={y + 7}
            stroke="rgba(0, 200, 83,0.35)" strokeWidth="1"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.1, ease: 'linear' }}
          />
        </g>
      ))}
    </svg>
  )
}

export default function ChipScene() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black py-24">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-mono text-xs text-green tracking-[0.4em] uppercase mb-10 relative z-10"
      >
        Hardware Foundation
      </motion.p>

      <div className="relative z-10 w-full max-w-xl px-6">
        <ChipSVG />
      </div>

      <div className="relative z-10 text-center mt-12 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono font-bold text-white mb-4"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
        >
          컴퓨터의 뇌를<br />이해한다
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-[#666] text-sm max-w-xs mx-auto leading-relaxed"
        >
          하드웨어부터 소프트웨어까지,<br />
          전체 스택을 다루는 엔지니어를 만듭니다
        </motion.p>
      </div>
    </section>
  )
}
