import { motion } from 'framer-motion'

export default function ElectricCard({ children, className = '', onClick }) {
  return (
    <motion.div
      className={`relative rounded-xl p-6 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0, 200, 83,0.2)',
        backdropFilter: 'blur(8px)',
      }}
      whileHover={{
        borderColor: 'rgba(0, 200, 83,0.6)',
        boxShadow: '0 0 30px rgba(0, 200, 83,0.15), inset 0 0 30px rgba(0, 200, 83,0.04)',
        y: -4,
      }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
