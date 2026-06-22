import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoUrl from '../../assets/logo/skulogo.svg'

const SECTIONS = [
  { id: 'home',       label: 'Home' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'career',     label: 'Career & Awards' },
]

const G_MID  = '#00C853'
const G_NEAR = '#66FF99'

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* 스크롤 위치에 따른 활성 섹션 추적 */
function useScrollSpy(ids, offsetRatio = 0.38) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * offsetRatio
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offsetRatio])
  return active
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(SECTIONS.map((s) => s.id))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.55)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(0,200,83,0.16)' : 'transparent'}`,
          transition: 'background .35s, border-color .35s, backdrop-filter .35s',
        }}
      >
        <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Logo → Home */}
          <button
            onClick={() => go('home')}
            className="flex items-center gap-3 group"
            aria-label="홈으로 이동"
          >
            <img
              src={logoUrl}
              alt="서경대학교 소프트웨어학과"
              className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,200,83,0.4))' }}
            />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-mono text-sm font-bold tracking-wide text-white">SKU</span>
              <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: G_MID }}>
                SOFTWARE
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-9">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id} className="relative">
                  <button
                    onClick={() => go(s.id)}
                    className="font-mono text-xs tracking-[0.18em] uppercase py-2 transition-colors"
                    style={{ color: isActive ? G_NEAR : 'rgba(255,255,255,0.6)' }}
                  >
                    {s.label}
                  </button>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: G_NEAR, boxShadow: `0 0 8px ${G_NEAR}` }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="메뉴 열기"
          >
            <span className="block w-6 h-px" style={{ background: G_MID }} />
            <span className="block w-6 h-px" style={{ background: G_MID }} />
            <span className="block w-4 h-px" style={{ background: G_MID }} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="font-mono text-lg tracking-[0.2em] uppercase"
                style={{ color: active === s.id ? G_NEAR : 'rgba(255,255,255,0.75)' }}
              >
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
