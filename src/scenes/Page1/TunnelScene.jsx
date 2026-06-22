import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ───────────────────────────────────────────────
 *  Binary Data Tunnel  (v2 — Canvas 2D perspective)
 *
 *  벽이 비어있는 "복도"가 아니라, 3D 공간에 떠 있는
 *  0 / 1 글리프가 카메라를 향해 흐르며 데이터의 강을
 *  이룬다. 중심은 비워 통로(throat)를 만들고, 가까운
 *  글리프는 밝게(#66FF99) / 먼 글리프는 딥하게(#00A63E).
 * ─────────────────────────────────────────────── */

// v2 Green ramp (#00C853 기반)
const GREEN_NEAR = '#66FF99' // head — 가까운 글리프
const GREEN_MID  = '#00C853' // primary
const GREEN_FAR  = '#00A63E' // deep — 먼 글리프

const GLYPH_COUNT = 520
const FOCAL       = 320      // 초점거리(원근 강도)
const Z_NEAR      = 14       // 이보다 가까우면 재배치
const Z_FAR       = 920      // 스폰 깊이
const R_MIN       = 55       // 월드 반경 최소 (이보다 안쪽은 비움 = throat)
const R_MAX       = 320      // 월드 반경 최대 (벽 두께)

function spawnGlyph(g, randomZ) {
  // 단면(annulus) 위의 한 점 → 중심을 비운 튜브형 분포
  const angle  = Math.random() * Math.PI * 2
  const radius = R_MIN + Math.random() * (R_MAX - R_MIN)
  g.x    = Math.cos(angle) * radius
  g.y    = Math.sin(angle) * radius
  g.z    = randomZ ? Z_NEAR + Math.random() * (Z_FAR - Z_NEAR) : Z_FAR
  g.char = Math.random() > 0.5 ? '1' : '0'
  g.flip = 18 + Math.random() * 70 // 글자 깜빡임까지 프레임 수
  return g
}

function makeGlyphs() {
  return Array.from({ length: GLYPH_COUNT }, () => spawnGlyph({}, true))
}

function drawTunnel(ctx, w, h, glyphs, velocity, radiusScale, fieldAlpha, bloomB, dissolve = 0) {
  // 잔상(motion trail) — 분해 막바지(dissolve)엔 옅게 → 캔버스가 어두운 블록으로 남지 않고
  // 투명하게 용해되며 뒤의 전역 레인/다음 씬이 비친다 (P1-A: 하드 seam 제거)
  ctx.fillStyle = `rgba(0, 0, 0, ${0.30 * (1 - dissolve * 0.85)})`
  ctx.fillRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2

  for (const g of glyphs) {
    g.z -= velocity
    if (g.z <= Z_NEAR) { spawnGlyph(g, false); continue }

    if (--g.flip <= 0) {
      g.char = Math.random() > 0.5 ? '1' : '0'
      g.flip = 18 + Math.random() * 70
    }

    const k = FOCAL / g.z // 원근 스케일
    // radiusScale: 진입 시 큰 값→1 로 수렴(흩어진 글자가 모여 터널 형성),
    //              종료 시 1→큰 값 으로 발산(터널이 공중으로 분해)
    const sx = cx + g.x * radiusScale * k
    const sy = cy + g.y * radiusScale * k

    // 화면 밖이면 스킵
    if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue

    const depth = 1 - (g.z - Z_NEAR) / (Z_FAR - Z_NEAR) // 0(far)~1(near)
    const alpha = Math.min(1, depth * 1.5) * fieldAlpha  // 조립 전/분해 후엔 옅어짐
    if (alpha <= 0.012) continue

    const size = Math.max(1, k * 15)

    let color = GREEN_FAR
    if (depth > 0.78)      color = GREEN_NEAR
    else if (depth > 0.40) color = GREEN_MID

    ctx.globalAlpha = alpha
    ctx.fillStyle   = color
    if (depth > 0.55) {
      ctx.shadowColor = color
      ctx.shadowBlur  = depth * 10
    } else {
      ctx.shadowBlur = 0
    }
    ctx.font = `${size}px 'JetBrains Mono', monospace`
    ctx.fillText(g.char, sx, sy)
  }

  ctx.globalAlpha = 1
  ctx.shadowBlur  = 0

  // 소실점 글로우 (통로 끝의 빛) — 터널이 살아있을 때만 선명, 분해되면 함께 사그라듦
  const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 220)
  grd.addColorStop(0,   `rgba(102, 255, 153, ${0.16 * fieldAlpha})`)
  grd.addColorStop(0.5, `rgba(0, 200, 83, ${0.04 * fieldAlpha})`)
  grd.addColorStop(1,   'rgba(0, 0, 0, 0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)

  // 종료 막바지에만 은은한 그린 글로우 — CoreChipScene와 톤을 잇는다(번쩍이는 흰빛 아님)
  if (bloomB > 0) {
    const maxR = Math.hypot(w, h) * 0.55
    const gb = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR)
    gb.addColorStop(0,   `rgba(140, 255, 200, ${0.40 * bloomB})`)
    gb.addColorStop(0.3, `rgba(0, 200, 83, ${0.16 * bloomB})`)
    gb.addColorStop(0.7, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gb
    ctx.fillRect(0, 0, w, h)
  }
}

export default function TunnelScene() {
  const containerRef = useRef(null)
  const canvasRef    = useRef(null)
  const overlayRef   = useRef(null)
  const progressRef  = useRef(0)   // GSAP ScrollTrigger.onUpdate가 채워준다
  const animRef      = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
    }
    resize()

    const glyphs = makeGlyphs()
    let smoothP = 0

    // 진입(조립)·종료(분해) 구간 정의 — 가운데 안정 구간을 충분히 길게
    const ENTRY_END  = 0.18   // 0 → 0.18: 흩어진 글자가 모여 터널 형성
    const EXIT_START = 0.80   // 0.80 → 1: 터널이 공중으로 분해
    const SPREAD     = 2.6    // 양 끝에서 벌어지는 최대 반경 배수

    function loop() {
      // 스크롤 진행도를 부드럽게 추적 → 속도로 변환
      smoothP += (progressRef.current - smoothP) * 0.06
      const p = progressRef.current

      // 진입/종료 진행도 0→1
      const entryT = Math.max(0, Math.min(1, p / ENTRY_END))
      const exitT  = Math.max(0, Math.min(1, (p - EXIT_START) / (1 - EXIT_START)))
      const eoEntry = 1 - Math.pow(1 - entryT, 3) // easeOut — 부드럽게 수렴
      const eiExit  = exitT * exitT * exitT        // easeIn  — 서서히 벌어지다 가속

      // 진입: SPREAD→1 (모임) / 종료: 1→SPREAD (분해). 가운데선 둘 다 1.
      const radiusScale = (1 + (SPREAD - 1) * (1 - eoEntry)) * (1 + (SPREAD - 1) * eiExit)
      // 조립 전엔 옅게 나타나고, 분해되며 다시 옅어진다
      const fieldAlpha  = eoEntry * (1 - eiExit)
      // 기본 속도 + 스크롤 끝 완만한 가속(데이터 다이브) — 급가속 임펄스 제거
      const velocity    = (5 + smoothP * 24) * (1 + eiExit * 1.4)
      // 종료 막바지에만 은은한 그린 글로우(다음 씬 연결용)
      const bloomB      = eiExit * eiExit
      // 전환존(P1-A): 막바지 [0.88→1.0]에 캔버스를 투명으로 용해 → 전역 레인/다음 씬과 연속
      const dissolve    = Math.max(0, Math.min(1, (p - 0.88) / 0.12))
      canvas.style.opacity = String(1 - dissolve)

      drawTunnel(ctx, canvas.width, canvas.height, glyphs, velocity, radiusScale, fieldAlpha, bloomB, dissolve)

      // HUD: 조립과 함께 나타났다가 분해 시작과 함께 사라진다
      if (overlayRef.current) {
        const hudOut = Math.max(0, Math.min(1, (p - 0.74) / 0.14))
        overlayRef.current.style.opacity = String(eoEntry * (1 - hudOut))
      }

      animRef.current = requestAnimationFrame(loop)
    }
    loop()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [])

  // 깊은 스크롤 동안 터널이 고정되도록 pin
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: false,
        // 핀을 GSAP가 소유하므로 진행도도 ScrollTrigger에서 직접 받는다.
        // (position:fixed 상태에선 framer useScroll이 진행도를 못 읽어
        //  fieldAlpha가 0에 머물며 터널이 통째로 사라지던 문제를 해결)
        onUpdate: (self) => { progressRef.current = self.progress },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* HUD-style overlay — 조립과 함께 나타났다 분해와 함께 사라진다 */}
        <div ref={overlayRef} style={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 font-mono text-[10px] tracking-[0.3em]" style={{ color: 'rgba(0,200,83,0.45)' }}>
            {'>>'} DATA STREAM
          </div>
          <div className="absolute top-8 right-8 font-mono text-[10px] tracking-[0.3em]" style={{ color: 'rgba(0,200,83,0.45)' }}>
            DEPTH: ∞
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(0,200,83,0.55)' }}>
              Binary Tunnel
            </p>
            <p className="font-mono text-xs tracking-[0.15em]" style={{ color: 'rgba(0,200,83,0.30)' }}>
              ENTERING THE DATA SPACE
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
