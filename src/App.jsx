import GlowCursor   from './components/GlowCursor'
import NavBar       from './components/chrome/NavBar'
import BinaryRain   from './components/BinaryRain'

import HeroScene    from './scenes/Page1/HeroScene'
import TunnelScene  from './scenes/Page1/TunnelScene'
import CoreChipScene from './scenes/Page1/CoreChipScene'

import CircuitScene from './scenes/Page2/CircuitScene'

import SparkScene   from './scenes/Page3/SparkScene'
import CareerNetwork from './scenes/Page3/CareerNetwork'
import FutureScene  from './scenes/Page3/FutureScene'

export default function App() {
  return (
    <main className="overflow-x-clip">
      {/* ── 전역 상시 데이터 레인 (v3 #2) ──
          body 가 이미 #000 이므로 main 배경은 비우고, 레인을 -z-10 으로 깔아
          전 페이지 뒤에 항상 은은히 흐르게 한다. 각 캔버스 씬은 자기 비주얼을
          이 위에 그린다(Tunnel/Core 캔버스는 자체 트레일로 거의 덮음). */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <BinaryRain opacity={0.08} speed={0.5} density={0.985} />
      </div>

      <GlowCursor />
      <NavBar />

      {/* ── Page 1: 현실 → 터널 → (분해→Rain→Core→Chip→회로큐) ──
          (v4 P0) 진입부 ComputerScene(모니터 확대) 삭제 → Hero 직후 즉시 터널 진입.
          진입 연출은 터널 자체 ENTRY 조립(ENTRY_END=0.18)이 담당. */}
      <HeroScene />
      <TunnelScene />
      <CoreChipScene />

      {/* ── Page 2: 살아있는 PCB — 코어에서 과목 노드로 확장 ── */}
      <CircuitScene />

      <div className="section-divider" />

      {/* ── Page 3: 스파크 → 커리어 → 미래 ── */}
      <SparkScene />
      <CareerNetwork />
      <FutureScene />
    </main>
  )
}
