export const EASE = {
  smooth: [0.16, 1, 0.3, 1],
  snap:   [0.25, 0.46, 0.45, 0.94],
  bounce: [0.34, 1.56, 0.64, 1],
}

export const DUR = {
  fast:   0.3,
  normal: 0.6,
  slow:   1.0,
  epic:   1.8,
}

export const staggerChildren = (delay = 0.08) => ({
  animate: { transition: { staggerChildren: delay } },
})

export const fadeUp = {
  initial:  { opacity: 0, y: 24 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: DUR.normal, ease: EASE.smooth },
}

export const scanReveal = {
  initial:  { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
  animate:  { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 0.8, ease: EASE.smooth },
}
