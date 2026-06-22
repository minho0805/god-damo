# Analysis Report — SKU Software Promo

> 작성일: 2026-06-22
> 목적: design-strategy.md v3 · refactor-plan.md · **현재 구현** 3자 비교 분석
> 범위: 분석 전용 — **코드/기존 md 수정 없음**. 본 보고서는 신규 산출물.

---

## 0. 비교 기준 & 현황 요약

| 비교 대상 | 상태 | 비고 |
|-----------|------|------|
| `design-strategy.md` v3 | **존재** (as-built 기록으로 재작성됨) | 일부 항목이 이번 요구와 충돌(아래 ★) |
| `refactor-plan.md` | **부재** | 아직 없음 → 검토 후 신규 작성 예정 |
| 현재 구현 | v3 패치 반영 상태 | App 8개 씬, 내 v3 편집 유지 중 |

**★ 문서-요구 충돌 (선행 인지 필요)**
- v3 **#3a**는 *"모니터(네모칸)는 유지하고 내부 Binary Rain만 제거"* 로 기록됨.
- 이번 **item 1**은 *"네모칸 확장 연출 자체를 삭제하고 즉시 터널 진입"* → **v3 #3a를 supersede(대체)**.
- 또한 App.jsx 상단 주석은 *"busy 캔버스 씬은 bg-black으로 가려진다"* 인데, 실제로는 이후 busy 씬 `bg-black`을 제거했으므로 **주석이 stale**.

---

## 1. Binary Tunnel 진입부 — 사각형 확장 삭제

### 현재 구현
- **컴포넌트**: `src/scenes/Page1/ComputerScene.jsx`
- **배치**: `src/App.jsx:33` — `<HeroScene/>` 와 `<TunnelScene/>` 사이
- **연출**: 250vh 섹션, 모니터(네모칸)가 `scale 0.25 → 14`로 확대(`ComputerScene.jsx:13`), `opacity` 페이드(`:14`). 내부 레인은 v3 #3a로 이미 제거됨, CRT 스크린+터미널 텍스트만 남음.
- 즉 현재도 "네모칸 확대"가 **터널 진입 전 단계로 존재**.

### 문제 원인
- 요구사항: 이 확대 연출을 **삭제**하고 사용자가 **즉시 Binary Tunnel로 진입**.
- 현재는 Hero → (모니터 확대 250vh) → Tunnel 순으로 한 단계가 끼어 있음.

### 영향 받는 파일 / 수정 대상
- `src/App.jsx` — `<ComputerScene/>` 사용부 + import 제거
- `src/scenes/Page1/ComputerScene.jsx` — 사용처 사라지면 dead component (삭제 또는 보존 결정 필요)
- 내러티브: "현실 → 컴퓨터 → 터널" → **"현실 → 터널"** 로 축약

### 권장 수정안
- App에서 `ComputerScene` 제거 → Hero 직후 Tunnel.
- 진입 연출은 **TunnelScene 자체의 ENTRY 조립 인트로(`ENTRY_END=0.18`)** 가 대체 (흩어진 글자가 모여 터널 형성).
- 부수 검토: ① Hero의 "SCROLL TO ENTER" 카피 유지 여부 ② 전체 스크롤 길이 **−250vh** ③ Hero(비핀) → Tunnel(GSAP 핀) 핸드오프 점검.

### 우선순위: **P0** (단순·명확, 의존성 낮음)

---

## 2. Binary Tunnel → 다음 페이지 전환

### 현재 구조
| 씬 | 스크롤 제어 | 핀 방식 | 높이 |
|----|-------------|---------|------|
| `TunnelScene` | **GSAP `ScrollTrigger.onUpdate`** | `pin:true, pinSpacing:false` (start top top / end bottom top) | 300vh |
| `CoreChipScene` | **framer `useScroll`** (offset `start start`/`end end`) | **CSS `sticky`** (GSAP 핀 아님) | 460vh |

두 씬은 **App에서 순차 배치**(`App.jsx:34-35`), 항상 마운트됨.

### 원인 분석 (요구된 4개 가설별)
- **카메라 전환 문제?** → ❌ 해당 없음. 터널은 2D Canvas 원근 투영이라 실제 3D 카메라가 없음. "카메라"는 스크롤로 구동되는 velocity일 뿐.
- **스크롤 동기화 문제?** → ★ **핵심 원인**. 터널은 GSAP ScrollTrigger, 코어칩은 framer useScroll — **서로 다른 두 측정계**가 **순차(겹치지 않는) 섹션**을 구동. 경계에서 **크로스페이드 구간이 없는 하드 핸드오프**. 터널 종료(0.80→1.0 분해)와 코어칩 인트로(0→ bloom/rain)가 **시간적으로 겹치지 않고 맞닿음**.
- **opacity 전환 문제?** → △ 부분 기여. 터널은 종료 시 `fieldAlpha→0`(투명 분해), 코어칩은 시작 시 `bloomOpacity 0.5`+`rainOpacity 0.85`로 등장. 겹침이 없으면 경계에 **짧은 빈틈/암전** 또는 톤 점프 가능.
- **section mounting 문제?** → ❌ 둘 다 상시 마운트라 mount/unmount 잔상은 아님. **단**, `pinSpacing:false` + GSAP unpin 순간 `position:fixed→static` 전환에서 **1프레임 위치 스냅** 가능성 있음.

### 개선 방향 (제안)
1. **스크롤계 통일**: 터널·코어칩을 **하나의 ScrollTrigger 타임라인/핀 컨테이너**로 묶어 unpin↔re-pin 경계 제거.
2. **전환존(overlap) 도입**: 터널 분해 구간과 코어칩 bloom/rain 시작을 **겹치게** (예: 코어칩 인트로를 음수 offset으로 앞당기거나, 공유 "transition zone" 섹션 신설).
3. **공유 요소 연속**: 분해되는 글리프 입자를 코어칩 인트로의 Rain으로 **형태만 바꿔 연속**(v2 #2 "공유 비주얼" 원칙 재적용).
4. unpin 스냅이 확인되면 `pinSpacing` 전략 재검토.

### 영향 받는 파일 / 수정 대상
- `src/scenes/Page1/TunnelScene.jsx`, `src/scenes/Page1/CoreChipScene.jsx`, 경우에 따라 `src/App.jsx`(컨테이너 통합 시)

### 우선순위: **P1** (구조적, 체감 효과 큼, 리스크 중간)

---

## 3. Curriculum 중심 칩(“Software Hack”) 중앙 정렬

> "Software Hack" = `CircuitScene`의 중앙 칩 **`SKU·SW CORE`** 로 식별(다른 'Hack' 명칭 요소 없음).

### 현재 구현
- **컴포넌트**: `src/scenes/Page2/CircuitScene.jsx`
- 칩: SVG `viewBox 0 0 1000 720`, 패키지 `x425 y285 w150 h150` → **기하 중심 (500, 360) = viewBox 정중심**(`:234`).
- SVG 컨테이너: `relative w-full px-4 maxWidth 1100`(`:188`), 부모 sticky `flex flex-col items-center justify-center`(`:154`).
- 별도 **center-glow div**: `absolute left-1/2 top-1/2 -translate-x/y-1/2`(뷰포트 중심)(`:268`).
- 칩 등장: `chipPower` **opacity만**(`:147`) — 위치 이동/스케일 없음.

### 원인 분석
- **정적 분석상 칩은 기하적으로 중앙**(viewBox 중심 + 컨테이너 flex center). 즉 수학적으론 화면 중앙에 와야 함 → **런타임 재현 필요**.
- 의심 지점(가설):
  1. **이중 중심 산정계**: 칩은 *SVG 내부 좌표 중심*, 글로우는 *뷰포트 중심(top/left-1/2)*. `maxWidth 1100` 캡·`px-4`·**세로 스크롤바 폭** 등으로 두 기준이 **미세 발산** → 칩과 글로우가 어긋나 "칩이 중앙이 아닌" 인상.
  2. **transform-origin 문제?** → ❌ 칩은 스케일하지 않으므로 origin 무관.
  3. **애니메이션 시작 좌표?** → ❌ opacity 페이드만, 좌표 고정.
  4. **인지적 중심 편차**: 6개 BRANCHES가 좌우/상하로 비대칭 분포 + 하단 라벨 무게 → 광학적 중심이 한쪽으로 당겨져 보일 수 있음.
  5. **짧은 뷰포트**: SVG 렌더 높이(≈ width×0.72, 최대 ≈792px)가 화면보다 크면 `justify-center` 오버플로로 수직 인지 편차.

### 권장 수정안
- 칩과 center-glow를 **단일 중심 기준으로 통합**(글로우를 SVG 내부 좌표로 그리거나, 칩 기준 위치로 산출).
- 런타임에서 칩 vs 글로우 vs 뷰포트 중심을 측정해 실제 편차 출처 확정 후 보정.

### 우선순위: **P2** (정적상 중앙 → 재현·측정 선행 필요)

---

## 4. Career Node 전체 시작 위치 중앙

### 현재 구현
- **컴포넌트**: `src/scenes/Page3/CareerNetwork.jsx`
- 그래프 컨테이너: `relative w-full mb-14 maxWidth 1000 margin:0 auto`(`:268`), 부모 `max-w-6xl mx-auto px-6`.
- SVG `viewBox 0 0 1000 340`. 노드 위치는 절대 div + `toPct(x,1000)`/`toPct(y,340)` + `translate(-50%,-50%)`.
- 노드 좌표: 허브 `(500,64)`, 진로 노드 x `{130,315,500,685,870}`(500 대칭), y 모두 `250`.

### 원인 분석
- **가로**: 노드 x가 500 기준 좌우 대칭, 허브 50% → **가로는 이미 중앙**(정적 분석 확인). `node container 위치`·`initial position` 모두 대칭.
- **세로(유력)**: 진로 노드 y=`250/340 = 73.5%` → **그래프 박스 하단에 쏠림**(허브는 상단 18.8%). 실제 콘텐츠는 y64~250 구간만 사용, 상단 여백 64 / 하단 여백 90 → **비대칭** → 콘텐츠 중심(≈157)이 박스 중심(170)보다 위. 결과적으로 "노드 전체가 박스/섹션 중앙이 아니라 아래로 치우쳐" 보일 수 있음.
- **responsive**: 컨테이너 height = SVG 렌더 height(절대% 비례)라 **가로는 안정**. 세로 쏠림은 반응형 문제가 아니라 **레이아웃 상수(HUB.y / pos.y / viewBox height)** 의 디자인값 문제.

### 권장 수정안
- 가로 중앙은 유지(확인됨).
- 세로 쏠림이 이슈라면 `HUB.y`·진로 노드 `pos.y`·`viewBox` 높이를 재배치해 **콘텐츠(허브+노드)를 박스 수직 중앙**에 정렬하거나, 그래프 박스 높이를 콘텐츠에 맞게 축소.
- 런타임에서 "무엇 기준 중앙이 아닌지"(박스/섹션/뷰포트)를 먼저 확정.

### 우선순위: **P2**

---

## 5. md 수정안 제안 (※ 실제 수정은 검토 승인 후)

### 5.1 `design-strategy.md` v3 수정 제안
1. **#3a 갱신(중요)**: "네모칸 유지 + 내부 레인 제거" → **"진입부(ComputerScene) 전면 삭제, Hero→Tunnel 직결"** 로 변경. 기존 #3a 결정이 이번 요구로 **대체됨**을 명시.
2. **#1(전환) 보강**: Tunnel→CoreChip 경계의 **하드 핸드오프(GSAP vs framer 독립 스크롤계)** 원인과 **스크롤계 통일/전환존** 개선 방향을 추가.
3. **신규 항목 추가**:
   - *Curriculum 중심 칩 중앙* — 칩/글로우 **단일 중심 통합**.
   - *Career 노드 세로 정렬* — 콘텐츠를 박스 수직 중앙으로.
4. App.jsx **stale 주석**(busy 씬 bg-black 관련) 정정 메모 추가.

### 5.2 `refactor-plan.md` (신규) 골격 제안
- **목적/범위/원칙** (분석 보고서 연동, 회귀 최소화)
- **작업 항목표**: 각 항목별 `현재 → 목표 → 변경 파일 → 리스크 → 검증 방법`
- **실행 순서/우선순위**: P0(진입부 삭제) → P1(전환 통합) → P2(중앙 정렬 2건)
- **회귀 위험 & 롤백 전략**, **검증 체크리스트**(build/lint/실측)

---

## 6. 우선순위 종합

| 순위 | 항목 | 리스크 | 근거 |
|:---:|------|:---:|------|
| **P0** | 1. 진입부(ComputerScene) 삭제 | 낮음 | 단순 제거, 명확 |
| **P1** | 2. Tunnel→CoreChip 전환 통합 | 중간 | 구조적, 체감 효과 큼 |
| **P2** | 3. Curriculum 칩 중앙 | 낮음 | 정적상 중앙, 재현 필요 |
| **P2** | 4. Career 노드 세로 정렬 | 낮음 | 가로는 OK, 세로 상수 조정 |

---

## 7. 다음 단계 (게이트)
1. 본 보고서 검토.
2. **§5 md 수정안 승인** (design-strategy.md v3 갱신 방향 확정). → ✅ **승인됨(2026-06-22)**
3. 승인 후 **`refactor-plan.md` 신규 작성**.
4. 그 다음 단계에서만 **구현 착수**.

---

## 8. 스크린샷 분석 — 런타임 증거 (2026-06-22)

입력: `src/assets/career.png`, `src/assets/hack.png`, `src/assets/turnpage.png`

### 8.1 turnpage.png — Tunnel 전환 (item 2 **확증**)
- 화면: 상단 = 한 점에서 방사하는 0/1 **분해(터널 EXIT)**, 하단 = 수직 바이너리 레인 띠. **둘 사이에 뚜렷한 수평 경계선(seam)**.
- 해석: 터널 분해 레이어와 다음 씬 레인 레이어가 **겹침(cross-fade) 없이 맞닿아** 경계가 그대로 노출 → §2의 "하드 핸드오프(GSAP vs framer 독립 스크롤계, 전환존 부재)"를 **시각적으로 확증**.
- 추가: 상단 분해 방사 중심과 하단 레인 띠가 **수직 정렬·밀도 연속성 없이 분리** → "공유 요소 연속" 부재.

### 8.2 hack.png — ★ item 3 **대상 재식별**
- 화면: **"데이터가 핵을 이룬다"** 캡션 + 파티클 코어. 이는 **`CoreChipScene`(Page1)** 의 `capCore`(코어 응결 캡션). **`CircuitScene`(Curriculum) 중심 칩이 아님.**
- **정정**: item 3의 "Software **Hack**" = **"핵"(core/nucleus)**. 대상 컴포넌트 = **`CoreChipScene`** (= 기존 **v3 #3b** 영역). CircuitScene 중심 칩은 §3 정적 분석상 이미 중앙 → **별건**.
- 증거: 코어가 화면 **수직 상단 + 약간 좌측**에 위치(정중앙 아님).
- 원인 후보: (a) 이 캡처가 **v3 #3b(정사각 중앙 스테이지) 적용 前** 상태일 가능성, (b) 적용 後에도 잔여라면 — Three 코어 자체는 캔버스 중심이나 **하단 캡션·오빗링의 시각 무게**로 위로 치우쳐 보이거나 `coreScale` 성장 중 시점. → **런타임에서 #3b 반영 여부 우선 확인.**

### 8.3 career.png — item 4 **보강**
- 화면: 헤딩 "당신의 다음 목적지"는 중앙. 그래프(허브+노드)는 **시각적으로 좌측 치우침** — 선택된 AI 노드(마젠타 글로우)와 좌측 하단 드릴다운 패널이 좌측 무게, 우측 노드들은 어두워(`rgba(0,0,0,0.85)`) 덜 보임.
- 노드 행은 화면 **상–중단**(수직), 아래로 큰 여백 후 패널.
- 해석: 노드 가로 좌표는 대칭(정적 확인)이나 **헤딩 중심축과 그래프 시각 중심이 불일치**해 보임. 진성 오프셋 여부는 DOM 측정 필요하나, 최소 **시각 균형(우측 노드 가시성) + 수직 배치** 보정 필요.

### 8.3.1 스크린샷 반영 — 우선순위/대상 갱신
| # | 변경 | 대상 |
|---|------|------|
| 2 | 원인 **확증**(레이어 seam) | TunnelScene ↔ CoreChipScene |
| 3 | **대상 재식별**: Curriculum 칩 → **CoreChip "핵"** | `CoreChipScene` (v3 #3b) |
| 4 | 가로=대칭, **시각 좌치우침 + 수직 배치** 이슈 | `CareerNetwork` |

---

## 9. 다음 단계 (갱신)
1. ✅ md 수정안 방향 승인 + 스크린샷 증거 확보.
2. **`design-strategy.md` v3 갱신** (승인 방향 + §8 보정 반영).
3. **`refactor-plan.md` 신규 작성** (P0→P1→P2).
4. 이후에만 **구현 착수**.

> 본 보고서: 분석 + 런타임 증거까지 반영. **코드 미수정.**
