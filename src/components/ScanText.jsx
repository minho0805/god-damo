import { motion } from 'framer-motion'

export default function ScanText({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}) {
  const MotionTag = motion[Tag] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
