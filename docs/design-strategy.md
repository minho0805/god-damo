# Design Strategy — 서경대학교 소프트웨어학과

> **핵심 명제**: 이것은 학과 홈페이지가 아니다.  
> 사용자가 소프트웨어 세계로 빨려 들어가는 **탐험 경험**이다.

---

# ⚡ v2 Strategy Revision (2026-06-21)

> 1차 프로토타입 검토 결과 발견된 7개 Critical Issue를 반영한 개정안.  
> 아래 v2 섹션이 기존 전략의 해당 부분을 **대체(override)** 한다.  
> 기존 v1 본문(TOP 10 이하)은 배경 맥락으로 유지한다.

## v2 한눈에 보기 — 무엇이 바뀌는가

| # | 문제 (v1) | 해결 방향 (v2) |
|---|-----------|---------------|
| 1 | 터널이 "물리적 공간"처럼 보임 | 터널 벽 자체를 **흐르는 0/1 데이터**로 구성 → 데이터 공간 진입 |
| 2 | 씬 전환이 검은 화면으로 단절됨 | **하나의 연속 타임라인**으로 끊김 없는 변환 (Tunnel→붕괴→Rain→Core→Circuit) |
| 3 | Page 3에 수상경력 누락 | Career Node를 **5계층 드릴다운**(스택→프로젝트→수상→진로)으로 확장 |
| 4 | 회로가 지나치게 단순 | **살아있는 PCB** — 트레이스/비아/패드 + 흐르는 전류 + 데이터 패킷 |
| 5 | 네비게이션 없음 | 상단 고정 Nav (Home / Curriculum / Career & Awards) |
| 6 | 로고 없음 | 좌측 상단 고정 **디지털화된 서경대 나뭇잎 로고** (클릭 → Home) |
| 7 | `#00FF88`이 네온·저렴함 | **`#00C853` 기반 딥 그린 램프**로 교체, 네온 금지 |

---

## [v2 #7] Color System — Deep Premium Green (★ 기존 Color System 대체)

> **`#00FF88` 전면 폐기.** 네온 라임빛은 "해커 장난감" 인상을 준다.  
> 더 진하고 묵직한 에메랄드-그린 램프로 교체해 **프리미엄·신뢰감**을 확보한다.

```css
/* === v2 Green Ramp (deep → bright) === */
--green-900:   #003D1A;   /* 가장 어두운 그린 — 면(fill) 배경, 그림자 */
--green-deep:  #00A63E;   /* 딥 그린 — 트레이스 base, 비활성 보더 */
--green:       #00C853;   /* ★ PRIMARY — 텍스트, 활성 보더, 노드, 강조 */
--green-bright:#00E676;   /* 하이라이트 전용 — 빗줄기 head, 스파크 코어 (극소량) */

/* === Glow (채도 낮춰 고급스럽게) === */
--green-glow:   rgba(0, 200, 83, 0.14);
--green-border: rgba(0, 200, 83, 0.22);
--green-shadow: 0 0 40px rgba(0, 200, 83, 0.28);

/* === Text === */
--text:        #FFFFFF;
--text-sub:    #7A8A80;   /* 차가운 회녹색 — 보조 텍스트 (순회색보다 통일감) */
--text-code:   #00C853;
```

**적용 규칙**
- 코드 전역에서 `#00FF88` → `var(--green)` (`#00C853`) 로 일괄 치환
- 빗줄기·스파크의 **선두(head)만** `--green-bright`(#00E676), 나머지는 `--green-deep`
- 글로우는 채도·알파를 낮춰 **번쩍임 대신 은은한 발광**
- 면적이 넓은 곳일수록 더 어두운 톤(`--green-deep`, `--green-900`) 사용 → 깊이감

| 용도 | v1 | v2 |
|------|----|----|
| 메인 액센트 | `#00FF88` | `#00C853` |
| 트레이스/보더 base | `#00FF88` (동일) | `#00A63E` |
| 글로우 head | `#00FF88` | `#00E676` (극소량) |

---

## [v2 #5·#6] Global Chrome — Navigation & Logo

전 페이지에 고정되는 **상시 UI 레이어**. 콘텐츠 위에 `position: fixed`, glass blur.

### 6. 로고 (좌측 상단 고정)

```
┌─ Logo Lockup ───────────────────────┐
│  [디지털 나뭇잎 마크]  SKU            │
│                       SOFTWARE       │
└──────────────────────────────────────┘
```

- **컨셉**: 서경대 상징 **나뭇잎**을 회로 트레이스로 재해석한 SVG 마크
  - 잎맥(leaf vein) = PCB 트레이스, 잎맥 분기점 = 노드(작은 발광 원)
  - 잎 윤곽선이 `stroke-dashoffset`로 한 번 그려지며 등장 → 이후 정적
  - hover 시 잎맥을 따라 데이터 패킷(작은 점)이 한 번 흐름
- **에셋 처리**: 실제 학과 로고 파일을 받기 전까지 `LeafMark.jsx`에 **placeholder SVG**로 구현, 추후 공식 자산으로 교체 (props로 분리)
- **동작**: 클릭 → `#home`으로 smooth scroll (맨 위)
- **위치**: `fixed top-6 left-6 z-50`, 항상 표시

### 5. 네비게이션 (상단)

```
                          ┌──────────────────────────────────────┐
   [Leaf] SKU SOFTWARE    │  HOME    CURRICULUM    CAREER & AWARDS │
                          └──────────────────────────────────────┘
```

- **항목 → 앵커 매핑**
  | 라벨 | 타깃 섹션 |
  |------|----------|
  | `HOME` | `#home` (HeroScene) |
  | `CURRICULUM` | `#curriculum` (Page 2 — Chip/Circuit/Course) |
  | `CAREER & AWARDS` | `#career` (Page 3 — Career/Awards) |
- **스타일**: JetBrains Mono, `letter-spacing: 0.2em`, glass 배경(`backdrop-blur`) + 하단 1px green 보더
- **거동**:
  - Hero 구간에서는 **반투명**, 스크롤 시작하면 **불투명 + blur** 강화
  - 현재 보고 있는 섹션 라벨에 `--green` underline (IntersectionObserver로 active 추적)
  - 모바일: 우측 상단 햄버거 → 풀스크린 오버레이 메뉴
- **구현**: `useScrollSpy` 훅 + `scrollIntoView({ behavior: 'smooth' })`
- 각 씬 컴포넌트 루트에 `id="home|curriculum|career"` 부여

---

## [v2 #1·#2] Page 1 재설계 — 데이터 공간 진입 & 무이음(seamless) 변환

> 핵심: 사용자는 **물리적 터널**이 아니라 **이진 데이터의 강** 속으로 들어간다.  
> 그리고 모든 씬은 **검은 단절 없이** 하나의 흐름으로 이어진다.

### #1 — Binary Tunnel = 흐르는 데이터로 만든 벽

**v1 문제**: 동심 사각형(ring)이 텅 빈 윤곽선이라 "복도"처럼 보임.

**v2 구조**: 터널의 벽면을 **3D 공간에 떠 있는 0/1 글리프 필드**로 채운다.

```
구현 옵션 A — Three.js (High-End)
  · InstancedMesh 또는 Points로 수천 개의 0/1 글리프를 원통/사각 터널 내벽에 배치
  · 글리프 텍스처: 0과 1을 그린 작은 캔버스 스프라이트
  · 카메라가 Z축으로 전진 → 가까운 글리프는 밝고 크게(#00E676),
    먼 글리프는 어둡게(#00A63E) 페이드
  · 글리프는 터널 축을 따라 살짝 흘러내림(스크롤과 별개의 미세 자전 모션)
  · 벽 = 데이터, 중심 = 빛 → "데이터 스트림 속을 비행"

구현 옵션 B — Canvas 2D 원근 투영 (MVP)
  · 0/1 문자를 3D 좌표(x,y,z)에 배치한 배열 생성
  · 매 프레임 z를 감소시켜 카메라 쪽으로 이동(perspective: scale = f/z)
  · z가 임계값 넘으면 뒤로 재배치(무한 스트림)
  · 화면 중앙 수렴점 기준 방사형 배치 → 터널 벽이 글자로 채워짐
```

- 더 이상 빈 사각 링이 아니라 **글자들이 벽을 이룬 데이터 통로**
- 양옆·상하 모든 면이 0/1로 빽빽 → "디지털 공간" 체감

### #2 — 무이음 변환 시퀀스 (검은 화면 단절 제거)

**v1 문제**: 모니터 줌인 후 black cut → 터널 → 또 cut → Core.

**v2 원칙**: Page 1 전체를 **하나의 pin된 스크롤 타임라인**으로 묶고, 씬 사이에 **공유 요소(0/1 글리프)** 를 연속시켜 cut을 없앤다.

```
연속 타임라인 (스크롤 0% → 100%, 검은 프레임 없음)

[0%]  Hero — 격자 위로 Binary Rain
        │ (모니터 화면 속 Rain이 그대로 확대됨 = 공유요소)
        ▼
[20%] 모니터 줌인 — 화면 속 0/1이 점점 커지며 뷰포트를 채움
        │ (모니터 베젤이 사라지는 순간, 그 0/1들이 곧 터널의 근거리 글리프가 됨)
        ▼
[35%] Binary Tunnel — 0/1 데이터의 강을 비행 (벽 = 글리프)
        │
        ▼
[70%] ★ 터널 붕괴(Tunnel Collapse) — NEW
        · 비행 속도 급가속, 글리프들이 중심으로 빨려 들어가며 수렴
        · 화면 전체가 0/1로 가득 찼다가 중심으로 임플로전(implosion)
        · 짧은 화이트-그린 블룸(블랙아웃이 아니라 '과노출')
        ▼
[80%] Binary Rain 급증 — 붕괴한 글리프가 비처럼 쏟아져 배경을 채움
        │ (Rain 밀도가 최대 → 이 비 사이로 거대 실루엣이 떠오름)
        ▼
[90%] 거대 Software Core = 반도체 칩 등장 — NEW 통합
        · 쏟아지던 0/1이 칩 표면으로 흡수되며 칩이 응결(condense)
        · Core(파티클 구체)와 Chip(반도체)을 하나의 오브제로 통합
        ▼
[100%] 회로 생성 → 과목 소개로 자연 연결 (Page 2)
```

**전환 기법**
- 씬 경계마다 **공유 비주얼**을 둠: Rain의 0/1 → 터널 글리프 → 붕괴 입자 → Core 흡수. 같은 "데이터 입자"가 형태만 바꿔 계속 살아있음
- black cut 금지 → 대신 **과노출 블룸(white→green flash)** 또는 **크로스페이드**
- Software Core와 ChipScene을 **하나의 "Core = Chip" 씬으로 병합** (v1은 분리되어 있었음): 데이터가 모여 반도체가 되는 단일 서사

### v2 Page 1 씬 흐름 (수정)

```
HeroScene (#home)
  → ComputerScene (모니터 줌인, Rain 공유)
  → DataTunnelScene (글리프 데이터 터널 + 붕괴)
  → CoreChipScene (Rain 급증 → 데이터가 응결한 거대 반도체 Core)  ← Core+Chip 병합
```

---

## [v2 #4] Page 2 재설계 — 살아있는 PCB

> 회로는 정적 다이어그램이 아니라 **전류가 흐르고 데이터 패킷이 오가는 살아있는 기판**이다.

### 살아있는 회로의 4개 레이어

```
Layer 1 — PCB 트레이스 (구조)
  · 45° 꺾임만 사용하는 진짜 PCB 라우팅 스타일 (직각 금지, 45도 모따기)
  · 트레이스 두께 2종(파워=굵게, 시그널=가늘게)
  · 비아(via): 트레이스가 교차/관통하는 도금홀 → 작은 이중 원
  · 패드/실크스크린: 노드마다 사각 패드 + 라벨 텍스트(JetBrains Mono)
  · base 색: --green-deep(#00A63E), 어두운 기판 위 음각 느낌

Layer 2 — 흐르는 전류 (생명력)
  · 각 트레이스를 따라 밝은 점선이 흐름 (stroke-dasharray + dashoffset 애니메이션)
  · 활성 경로는 --green-bright, 흐름 속도는 경로마다 미세하게 다르게

Layer 3 — 데이터 패킷 (네트워크)
  · 노드 사이를 작은 발광 점(packet)이 이동 (Motion path / offsetPath)
  · 패킷이 노드 도착 시 노드가 한 번 pulse → "통신 중" 느낌
  · 토폴로지: 중심(학과)에서 방사 + 노드 간 상호 연결(메시)

Layer 4 — 정보 발현 (콘텐츠)
  · 전류가 트레이스를 다 채우면 그 끝 노드에서 과목 정보가 발현
  · "회로를 따라 정보가 나타나는" v1 원칙 강화: 트레이스 그려짐 → 노드 점등 → 패널
```

- **느낌 레퍼런스**: 실제 PCB(녹색 기판) + 반도체 다이 + 네트워크 토폴로지 + 데이터 플로우
- **구현**: SVG(트레이스/패드/비아) + `stroke-dashoffset`(전류) + Motion `offsetPath`(패킷) + IntersectionObserver(발현 트리거)
- **CircuitScene 업그레이드**: v1의 단순 노드-엣지 → 다층 PCB. 노드는 칩 패키지 형태(사각+핀), 엣지는 45° 트레이스
- **CourseNetwork**: 세로 아코디언 유지하되 좌측 spine을 **PCB 버스(bus) 트레이스**로 교체, 카드 펼침 시 해당 트레이스에 전류 점등

### v2 Page 2 씬 흐름

```
CoreChipScene (Page1에서 이어짐)
  → CircuitScene (#curriculum) — 살아있는 PCB로 커리큘럼 확장
  → CourseNetwork — PCB 버스를 따라 4년 과목 발현
```

---

## [v2 #3] Page 3 재설계 — Career → Awards 5계층 드릴다운

> Page 3는 단순 진로 소개가 아니다. **노드를 클릭하면 데이터가 계층적으로 펼쳐진다.**

### Career Node 드릴다운 구조

```
Career Node (예: AI Engineer)
   │ 클릭 / 노드 점등
   ▼
① 기술 스택 (Tech Stack)
   Python · TensorFlow · PyTorch · CUDA
   ▼
② 관련 프로젝트 (Projects)
   학부 캡스톤 / 연구실 프로젝트 예시
   ▼
③ 관련 수상 경력 (Awards)  ★ v1 누락분 — 핵심 추가
   공모전·해커톤·논문 수상 실적
   ▼
④ 관련 진로 (Career Path)
   취업 기업 · 직무 · 대학원 트랙
```

### 데이터 모델 (씬 단위 확장)

```js
// 각 커리어 노드가 가지는 4계층 데이터
{
  id: 'ai',
  label: 'AI Engineer',
  stack:    ['Python', 'TensorFlow', 'PyTorch', 'CUDA'],
  projects: ['실시간 객체탐지 캡스톤', '의료영상 분할 연구'],
  awards:   ['ICPC 지역본선 입상', 'AI 공모전 대상', 'KCC 학부논문상'],  // ★
  careers:  ['삼성리서치 AI', 'LG AI연구원', 'AI대학원 진학'],
}
```

### 인터랙션 설계

- **노드 클릭** → 우측(또는 하단) **드릴다운 패널**이 슬라이드인
- 패널 내부는 ①→②→③→④ 순서로 **stagger 등장** (계층이 위에서 아래로 흐름)
- ③ Awards는 **트로피/메달 아이콘 + 발광 강조**로 시각적 무게 부여
- 노드 → 패널 사이를 **데이터 패킷 트레이스**로 연결 (Page 2 회로 언어와 통일)
- **Awards 별도 집계 섹션** 추가: 학과 전체 누적 수상 실적을 카운터로 (Page 3 하단)

### v2 Page 3 씬 흐름

```
SparkScene (전환)
  → CareerNetwork (#career) — 노드 클릭 시 스택→프로젝트→수상→진로 드릴다운
  → AwardsScene — 학과 누적 수상 실적 집계 (NEW, 독립 강조 섹션)
  → FutureScene — 최종 메시지 + CTA
```

---

## v2 컴포넌트 구조 변경 요약

```
src/
├── components/
│   ├── chrome/
│   │   ├── NavBar.jsx        ← [NEW #5] 상단 고정 네비
│   │   └── LeafMark.jsx      ← [NEW #6] 디지털 나뭇잎 로고 (placeholder SVG)
│   ├── BinaryRain.jsx        ← 색상 v2 그린으로
│   ├── GlyphField.jsx        ← [NEW #1] 0/1 데이터 터널 글리프 필드
│   ├── pcb/
│   │   ├── Trace.jsx         ← [NEW #4] 45° 트레이스 + 전류
│   │   ├── Via.jsx           ← [NEW #4] 비아/패드
│   │   └── DataPacket.jsx    ← [NEW #4] 흐르는 패킷
│   └── DrilldownPanel.jsx    ← [NEW #3] 스택→프로젝트→수상→진로
├── hooks/
│   └── useScrollSpy.js       ← [NEW #5] active 섹션 추적
├── scenes/
│   ├── Page1/
│   │   ├── HeroScene        (#home)
│   │   ├── ComputerScene
│   │   ├── DataTunnelScene   ← 글리프 터널 + 붕괴
│   │   └── CoreChipScene     ← [병합 #2] Core+Chip 통합
│   ├── Page2/
│   │   ├── CircuitScene      (#curriculum) ← 살아있는 PCB
│   │   └── CourseNetwork
│   └── Page3/
│       ├── SparkScene
│       ├── CareerNetwork     (#career) ← 5계층 드릴다운
│       ├── AwardsScene       ← [NEW #3]
│       └── FutureScene
└── constants/colors.js       ← v2 그린 램프
```

### v2 → v1 매핑(무엇이 바뀌나)
- `TunnelScene` → `DataTunnelScene` (글리프 + 붕괴 추가)
- `CoreScene` + `ChipScene` → `CoreChipScene` (병합, 무이음 연결)
- `CircuitScene` 단순 그래프 → 다층 PCB
- `CareerNetwork` 평면 정보 → 4계층 드릴다운
- `AwardsScene` 신규 분리
- `NavBar`, `LeafMark`, `GlyphField`, PCB 컴포넌트군 신규

---

## v2 우선순위 (다음 구현 스프린트)

```
P0 (인상 좌우 — 먼저):
  #7 컬러 램프 교체     — 전역, 비용 낮고 효과 큼
  #2 무이음 전환        — Page1 타임라인 통합 + Core/Chip 병합
  #1 데이터 글리프 터널 — 컨셉의 심장

P1 (구조 완성):
  #4 살아있는 PCB
  #3 Career 드릴다운 + Awards 분리

P2 (마감):
  #5 Nav + #6 로고 (글로벌 chrome)
```

---

## ✅ v2 확정 결정 (2026-06-21, 사용자 승인)

| 항목 | 결정 | 비고 |
|------|------|------|
| Primary Green | **`#00C853`** (Signal Green) | 어두운 BG 대비 선명 + 글로우 여유, 네온 아님 |
| 터널 글리프(#1) | **Canvas 2D 원근 투영** | Three.js 미사용. 효과 대비 비용 우수, 모바일 안전 |
| 로고 에셋(#6) | **실제 로고 제공 대기** | 공식 PNG/SVG 수령 후 디지털 변환. 그동안 `LeafMark`는 보류 — NavBar는 텍스트 로고("SKU SOFTWARE")로 선구현 |

> 위 결정에 따라 P0 구현 시: 컬러 토큰은 `#00C853` 램프로 확정, 터널은 `GlyphField`를 Canvas 2D로,  
> 로고 자리는 텍스트 placeholder로 두고 자산 수령 시 마크 교체.

---

# ⚡ v3 Polish Revision — 구현 완료 (2026-06-22)

> 구현 프로토타입을 실제 스크롤하며 발견한 **연출 단절·정렬·인터랙션 결함 7건**의 개정 + **구현 결과** 기록.  
> 이 섹션은 분석안이 아니라 **as-built(실제 구현된 상태)** 다. 일부 항목은 구현 중 사용자 피드백으로 초기안에서 방향이 바뀌었고, 그 최종 형태를 기록한다.  
> 검증: `vite build` 성공, 변경 코드 ESLint 클린. **브라우저 실측은 미완** — 각 항목의 "노브"로 미세 조정 예정.

## v3 한눈에 — 구현 상태

| # | 영역 | 결함 | 구현 결과 | 파일 | 상태 |
|---|------|------|----------|------|:----:|
| 1 | 터널 전·후 전환 | 단절 / "빛만 쏘는" / 너무 빨리 붕괴 / 터널이 사라짐 | **대칭 조립·분해** + 진행도 소스를 GSAP로 교정 | TunnelScene, CoreChipScene | ✅ |
| 2 | 전역 배경 | 레인이 Hero에만 | **전 페이지 상시 레인**(busy 씬 포함) | App + 8개 씬 | ✅ |
| 3a | 모니터 진입 | 내부 레인 증폭으로 산만 | 내부 레인 제거 → 바로 터널로 | ComputerScene | ✅ |
| 3b | 코어 응결 | 핵이 빗겨 생겼다 중앙으로 이동 | **정사각 중앙 스테이지** 제자리 응결 | CoreChipScene | ✅ |
| 4 | Page3 헤더 | "당신의 다음 목적지" 어긋남 | 그래프와 동일 중앙 컬럼 통일 | CareerNetwork | ✅ |
| 5 | Page3 진로 노드 | 호버 점프 + 선·위치 불일치 | **위치/스케일 분리** | CareerNetwork | ✅ |
| 6 | Page3 어워드 | 비중앙 + The Future와 너무 붙음 | mx-auto + 간격 확대 | FutureScene | ✅ |

---

## [v3 #1] 터널 전·후 — 대칭 조립·분해 (초기 "붕괴"안에서 변경)

**초기안**: 종료 시 글리프를 중심으로 수렴시키는 임플로전 + 강한 흰빛 블룸.  
**피드백**: ① 너무 빨리 붕괴 ② 붕괴가 아니라 "그냥 빛만 쏘는" 느낌 ③ 진입도 역순(모여서 터널 발생)이었으면.  
→ **외향 발산 기반의 대칭 인터랙션으로 재설계.**

**최종 구현** — `src/scenes/Page1/TunnelScene.jsx`
- 렌더 시점의 두 값으로 진입/종료를 대칭 처리:
  - `radiusScale` — 글리프 월드 반경 배수. **진입: SPREAD→1(모임)** / 안정: 1 / **종료: 1→SPREAD(분해)**
  - `fieldAlpha` — 필드 투명도. 조립 전/분해 후엔 옅고, 안정 구간엔 1
- 구간: `ENTRY_END=0.18`(진입 조립), `EXIT_START=0.80`(종료 분해), `SPREAD=2.6`
- velocity **급가속 임펄스 제거**(×6 → 완만한 ×1.4) → 종료가 천천히 진행
- 강한 흰빛 과노출 블룸 → **은은한 그린 글로우(0.40)** 로 축소 ("빛만 쏘는" 해소). 소실점 글로우도 `fieldAlpha`에 연동

**★ 근본 버그 수정 — 진행도 소스 교체**
- 증상: 조립 페이드 적용 후 **터널이 통째로 사라짐**.
- 원인: GSAP `pin:true`가 컨테이너를 `position:fixed`로 만들면 **framer `useScroll`이 진행도를 못 읽어** `scrollYProgress`가 0 근처에 고정 → `fieldAlpha=0`.
  (이전 코드는 alpha가 진행도와 무관해 우연히 보였고, "빛만 쏘는 느낌"은 사실 다음 씬 bloom이 교체되며 보인 것)
- 수정: 진행도를 **핀을 소유한 `ScrollTrigger.onUpdate(self.progress)`에서 직접 수신**. framer-motion 의존 제거, HUD opacity도 동일 진행도로 갱신.

**연속성** — `src/scenes/Page1/CoreChipScene.jsx`
- 시작 bloom `0.9 → 0.5`로 낮춰 **경계의 흰빛 점멸 제거**(터널 종료의 은은한 그린과 톤 연결)

**노브**: `ENTRY_END / EXIT_START / SPREAD` (TunnelScene loop 상단), CoreChip `bloomOpacity`

> 🔎 **후속(v4, analysis-report item 2 — turnpage.png 확증)**: 터널 분해(EXIT)와 다음 씬 레인이
> **겹침 없이 맞닿아 수평 경계선(seam)** 이 보임. 근본은 **GSAP(터널) vs framer(코어칩) 독립 스크롤계의 하드 핸드오프**.
> → 스크롤계 통일 / 전환존(overlap) / 분해 글리프→Rain 공유 연속으로 개선. `refactor-plan.md` 참조.

---

## [v3 #2] 전역 상시 바이너리 레인 (busy 씬까지 확대)

**최종 구현** — `src/App.jsx` + 8개 씬
- App 최상위에 `fixed inset-0 -z-10` 전역 `BinaryRain`(`opacity 0.08, density 0.985(희소), speed 0.5`)
- **스태킹 함정 해결**: `main`의 `bg-black` 제거(body가 이미 `#000`). main 배경이 있으면 음수 z 레인을 덮어버리기 때문.
- Hero 로컬 레인(0.12) 제거 → 전역으로 일원화(중복 방지)
- **사용자 요청으로 busy 씬까지 노출**: Computer/Tunnel/Core/Circuit + Career/Future 컨테이너의 `bg-black` 제거
- 주의: Tunnel/Core 캔버스는 자체 트레일(`rgba(0,0,0,0.30)`)로 화면을 거의 덮으므로, 레인은 **분해·throat 등 옅은 구간에 은은히** 비침
- 접근성(`prefers-reduced-motion`) 대응은 별도 항목(final-review #4)으로 보류

**노브**: 전역 레인 `opacity 0.08`, `density`

---

## [v3 #3a] 모니터 진입 — 내부 레인 제거, 바로 터널로

> ⚠️ **SUPERSEDED (2026-06-22, analysis-report item 1)**: 본 #3a("네모칸 유지 + 내부 레인만 제거")는
> **"진입부(ComputerScene) 전면 삭제, Hero→Tunnel 직결"** 로 대체됨. 진입 연출은 터널 자체 ENTRY 조립이 담당.
> 상세·실행은 v4 / `refactor-plan.md` 참조.

**최종 구현(구버전)** — `src/scenes/Page1/ComputerScene.jsx`
- 모니터 **내부 `BinaryRain` + `rainAlpha`(0.1→0.7 증폭) 제거** → 줌인 시 산만함 해소
- 외부 컨테이너 `bg-black` 제거 → 모니터가 전역 레인 위에 떠 있음
- CRT 스크린은 검은 화면 + 터미널 프롬프트만 유지. 네모칸이 커지며 뷰포트를 덮고 바로 터널로 연결
- 미사용 `BinaryRain` import 정리

---

## [v3 #3b] 코어 응결 — 정사각 중앙 스테이지

**원인**: `absolute inset-0`(가로로 긴 뷰포트)를 스케일 → 시각 중심이 흔들려 핵이 빗겨 생겼다 가운데로 이동하는 것처럼 보임.

**최종 구현** — `src/scenes/Page1/CoreChipScene.jsx`
- 뷰포트 정중앙에 고정된 **정사각 스테이지(`min(92vw,92vh)`)**를 `origin-center`로 스케일
- Canvas·radial glow가 **같은 중심을 공유** → 위치 고정, 제자리에서 커진다(이동 아님)

**노브**: 스테이지 크기 `min(92vw,92vh)` (체감 크기 조정)

> 🔎 **후속(v4, analysis-report item 3 — hack.png)**: 사용자가 말한 "Software **Hack**" = **"핵"** =
> 본 #3b의 코어("데이터가 핵을 이룬다"). 스크린샷상 코어가 여전히 **수직 상단·약간 좌측**으로 보임.
> → ① 캡처가 #3b 적용 前인지 런타임 확인, ② 적용 後에도 잔여면 코어의 화면상 중심을 명시 앵커.

---

## [v3 #4] Page3 헤더 — 중앙 컬럼 통일

**분석**: 헤더는 `text-center`로 **이미 가로 중앙**이었고 그래프도 `margin:auto`로 같은 중심. 체감 어긋남은 #5 노드 점프 영향이 컸음.

**최종 구현** — `src/scenes/Page3/CareerNetwork.jsx`
- 헤더 블록을 **그래프와 동일한 1000px 중앙 컬럼**(`max-w-[1000px] mx-auto`)으로 통일 → 헤딩이 hub 노드 바로 위에 정렬

> 🔎 **후속(v4, analysis-report item 4 — career.png)**: 노드 가로 좌표는 대칭(중앙)이나 화면상
> **그래프가 좌측으로 치우쳐** 보임(선택 노드+패널 좌측 무게, 우측 노드 어두워 덜 보임) + 노드 행이 상–중단.
> → 그래프 시각 중심을 헤딩 축에 맞추고, 우측 노드 가시성·수직 배치 보정. DOM 측정 후 진성 오프셋 확정.

---

## [v3 #5] Page3 진로 노드 — 호버 점프 + 선 불일치 ★핵심 버그

**원인**: `motion.button`의 인라인 `transform: translate(-50%,-50%)`(중앙정렬)를 `whileHover={{ scale }}`가 호버 시 **통째로 덮어써 중앙정렬이 풀리며 노드가 우하단으로 점프**. 점프한 노드는 연결선 끝점과도 어긋남 → "선·위치 불일치"도 같은 버그.

**최종 구현** — `src/scenes/Page3/CareerNetwork.jsx`
- **위치(중앙정렬)와 스케일(hover)을 분리**: 바깥 `div`가 `translate(-50%,-50%)`로 위치만 고정(framer가 건드리지 않음), 안쪽 `motion.button`은 `scale`만 담당 → 노드 중심이 **항상 선 끝점에 일치**, 호버해도 제자리에서 확대
- 좌표계: 선(SVG viewBox 340)과 노드(`toPct(_,340)`)가 수학적으로 정합함을 확인. stale 주석 `380 → 340` 정정
- 미사용 상수 `G_DEEP` 제거(린트 클린)

---

## [v3 #6] Page3 Awards — 중앙 정렬 + 간격 확대

**최종 구현** — `src/scenes/Page3/FutureScene.jsx`
- Awards 블록에 `mx-auto` 명시(부모 flex로 이미 중앙이었으나 정렬 확정)
- Awards ↔ The Future 간격 `mb-20 → mb-32` 확대(너무 가깝던 문제 해소)

**노브**: Awards `mb-32`

---

## v3 검증 & 잔여

- ✅ `vite build` 성공(447 modules) / 변경 코드 ESLint 에러 0
- ⚠️ **브라우저 실측 미완** — 위 각 항목 "노브"로 조정 예정
- ⛏️ **알려진 사전 결함(범위 밖)**: `CoreChipScene`의 `CoreParticles` `useMemo`가 렌더 중 `Math.random` 호출(`react-hooks/purity` 3건). 빌드 비차단. 추후 인덱스 기반 결정론적 분포 또는 effect 초기화로 정리 가능

---

# ⚡ v4 Follow-up — 분석 기반 차기 개정 (계획, 2026-06-22)

> 출처: `docs/analysis-report.md`(런타임 스크린샷 증거 포함). **승인된 방향**.  
> 본 섹션은 *계획*이며, 상세 실행안은 **`docs/refactor-plan.md`** 가 보유한다. (현 시점 코드 미구현)

| 항목 | 결정/방향 | 대상 | 우선 |
|------|----------|------|:---:|
| 진입부 삭제 | **ComputerScene 전면 제거**, Hero→Tunnel 직결 (v3 #3a 대체) | `App.jsx`, `ComputerScene.jsx` | **P0** |
| 전환 무이음화 | 터널 분해↔코어칩 인트로 **하드 핸드오프 seam** 제거 — 스크롤계 통일/전환존/공유 글리프 연속 | `TunnelScene`, `CoreChipScene`, (`App`) | **P1** |
| 핵(코어) 중앙 | hack.png = **CoreChip "핵"**(Curriculum 칩 아님). #3b 반영 확인 후 화면 중심 명시 앵커 | `CoreChipScene` | **P2** |
| Career 그래프 중앙 | 가로=대칭이나 **시각 좌치우침 + 수직 배치** 보정, 헤딩 축 정렬 | `CareerNetwork` | **P2** |
| 정리 | `App.jsx` stale 주석(“busy 씬 bg-black”) 정정 | `App.jsx` | P3 |

> 주의(용어): item 3의 "Software **Hack**" = 한국어 **"핵"(core/nucleus)** — `CircuitScene`(Curriculum) 중심 칩이 아니라
> `CoreChipScene`의 "데이터가 핵을 이룬다" 코어다. CircuitScene 중심 칩은 정적 분석상 이미 중앙(별건).

---

# (이하 v1 원본 — 배경 맥락으로 유지)

## TOP 10 레퍼런스 선정

42개 레퍼런스를 다음 기준으로 평가해 최종 10개를 선정했다.

- **Story Fit**: 8개 씬 흐름에 직접 대응되는가
- **Visual Match**: Black + #00FF88 + Futuristic 감성에 부합하는가
- **Implementability**: React + Vite 환경에서 현실적으로 구현 가능한가
- **Impact / Cost Ratio**: 개발 비용 대비 시각적 임팩트가 높은가

| 순위 | 레퍼런스 | 선정 이유 | 담당 씬 |
|------|---------|---------|--------|
| 🥇 1 | Apple iPhone 15 Pro (#21) | 전체 Scroll Storytelling 골격의 교과서 | 전 씬 공통 |
| 🥈 2 | adrianhajdin/iphone GitHub (#22) | #21의 오픈소스 구현체, 코드 직접 참고 | 전 씬 공통 |
| 🥉 3 | Infinite Tubes — Codrops (#06) | Binary Tunnel 씬의 대체 불가능 핵심 기술 | Binary Tunnel |
| 4 | Matrix Code Rain (#01) | Binary Rain 효과의 직접 구현 레퍼런스 | Hero + 전환 |
| 5 | Lusion v3 — SOTY 2024 (#03) | 목표 사이트의 완성형 비전, BG+파티클+프리미엄 | Software Core |
| 6 | GSAP Award-Winning Clone (#26) | clip-path 씬 전환 기법, 오픈소스 코드 참고 | 씬 전환 전체 |
| 7 | Crosswire Reflective Grid — Codrops (#16) | Circuit Board 텍스처 + 에너지 파동 | Circuit Expansion |
| 8 | Linear Website Design (#31) | 전체 UI/UX 감성, Bento Grid, 마이크로인터랙션 | UI 전체 |
| 9 | State of AI Data Visualization (#17) | Course/Career Network 노드-엣지 시각화 | Network 씬 |
| 10 | Animated Electric Border Card (#11) | Spark 전환 + 카드 UI 전기 테두리, 난이도 2 | Spark + 카드 UI |

---

## Overall Concept

### 경험의 메타포: "당신이 소프트웨어가 되는 순간"

방문자는 **탐험가**다. 학과를 읽는 것이 아니라, 소프트웨어 세계 안으로 직접 걸어 들어간다.

```
현실 세계
  │  스크롤 시작 — 화면이 당신을 빨아들인다
  ▼
모니터 속 세계 (Binary Rain이 내리기 시작)
  │  터널로 진입
  ▼
Binary Tunnel — 0과 1의 통로를 통과
  │  핵심으로 도달
  ▼
Software Core — 프로그래밍의 본질, 빛나는 중심부
  │  세계가 펼쳐진다
  ▼
Circuit Expansion — 학과 커리큘럼이 회로처럼 확장
  │  연결이 드러난다
  ▼
Course Network — 과목들이 살아있는 그래프로 연결
  │  전기가 튀긴다
  ▼
Spark Transition — 현재에서 미래로의 점프
  │  진로가 보인다
  ▼
Career Network — 졸업 후 세계가 네트워크로 펼쳐짐
  │  당신의 자리
  ▼
Future — "이 세계를 만드는 사람이 되라"
```

### 경험의 세 가지 감정 곡선

| 구간 | 감정 | 연출 |
|------|------|------|
| 진입부 (Hero → Tunnel) | 호기심 → 경이 | 느리게 빨려들어가는 속도감 |
| 탐험부 (Core → Network) | 발견 → 흥분 | 정보가 살아있는 것처럼 등장 |
| 각인부 (Spark → Future) | 설렘 → 확신 | 강렬하고 간결한 메시지 |

---

## Visual Identity

### 무드 키워드

**Cinematic Minimalism** × **Techno-Futurism** × **Premium Dark**

- Blade Runner 2049의 빛과 어둠 대비
- Vercel 홈페이지의 정밀한 공백감
- The Matrix의 디지털 비 (Binary Rain)
- NVIDIA RTX의 네온 초록 에너지

### 시각 언어 원칙

1. **배경은 무한한 어둠이다** — 순수 Black(#000000), 그라디언트 없음
2. **빛은 포인트로만** — Green Glow는 의미 있는 요소에만, 남발 금지
3. **텍스처는 디지털이다** — 노이즈, 격자, 스캔라인으로 기계 질감 부여
4. **움직임은 데이터다** — 모든 애니메이션이 "정보가 흐른다"는 느낌
5. **공백은 우주다** — 여백을 두려워하지 않는다. 여백이 스케일을 만든다

### 타이포그래피

```
Heading (씬 타이틀):   Geist Mono  — 코드처럼 보이는 제목
Sub-heading (섹션):   Geist Sans  — 클린하고 현대적
Body (설명 텍스트):   Inter       — 가독성 최우선
Code / Data:          JetBrains Mono — 터미널/코드 블록
```

- 모든 Heading은 **letter-spacing: -0.04em** (타이트하고 묵직하게)
- 코드 요소는 **JetBrains Mono** + Green 컬러로 강조
- 줄 길이는 최대 **60ch** (가독성 유지)

---

## Color System

```css
/* === Core Palette === */
--black:          #000000;   /* 배경 기본 */
--black-soft:     #0A0A0A;   /* 카드/패널 배경 */
--black-mid:      #111111;   /* 호버 상태 배경 */

/* === Accent === */
--green:          #00FF88;   /* 메인 액센트 — 스파크, 하이라이트 */
--green-dim:      #00CC66;   /* 보조 액센트 — 텍스트, 아이콘 */
--green-glow:     rgba(0, 255, 136, 0.15);  /* 배경 글로우 */
--green-border:   rgba(0, 255, 136, 0.25);  /* 카드 테두리 */
--green-shadow:   0 0 40px rgba(0, 255, 136, 0.3); /* box-shadow */

/* === Text === */
--text-primary:   #FFFFFF;   /* 주요 텍스트 */
--text-secondary: #888888;   /* 보조 텍스트 */
--text-muted:     #444444;   /* 비활성 텍스트 */
--text-code:      #00FF88;   /* 코드/데이터 텍스트 */

/* === Glass UI === */
--glass-bg:       rgba(255, 255, 255, 0.03);
--glass-border:   rgba(255, 255, 255, 0.08);
--glass-blur:     blur(12px);

/* === Binary Rain === */
--rain-head:      #FFFFFF;   /* 빗줄기 선두 — 흰색 */
--rain-body:      #00FF88;   /* 빗줄기 몸통 — Green */
--rain-tail:      rgba(0, 255, 136, 0);  /* 빗줄기 꼬리 — 페이드아웃 */
```

### 글로우 사용 규칙

| 상황 | 글로우 강도 |
|------|-----------|
| 일반 UI 카드 호버 | `0 0 20px rgba(0,255,136,0.2)` |
| 핵심 CTA 버튼 | `0 0 40px rgba(0,255,136,0.4)` |
| Binary Rain 선두 | `text-shadow: 0 0 8px #fff` |
| Software Core 중심부 | `0 0 120px rgba(0,255,136,0.6)` |
| Spark Transition 순간 | `0 0 200px rgba(0,255,136,0.8)` |

---

## Animation System

### 두 개의 레이어

```
Layer A — Scroll Engine (거시적)
  GSAP ScrollTrigger + Lenis
  씬 전체 전환, 카메라 이동, 텍스트 등장
  타임라인 기반, 스크롤 1px = 애니메이션 진행

Layer B — Micro Animation (미시적)
  Motion for React (motion/react)
  카드 호버, 버튼 클릭, 모달 등장
  선언형 variants 패턴
```

### 속도 토큰

```js
const EASING = {
  // 부드럽고 고급스럽게 감속
  smooth:   [0.16, 1, 0.3, 1],
  // 빠르게 시작해서 서서히 멈춤
  snap:     [0.25, 0.46, 0.45, 0.94],
  // 튕기는 느낌 (Spark 효과)
  bounce:   [0.34, 1.56, 0.64, 1],
  // 완전히 선형 (Binary Rain, 데이터 느낌)
  linear:   [0, 0, 1, 1],
}

const DURATION = {
  instant:  0.1,   // 즉각 반응
  fast:     0.3,   // UI 마이크로
  normal:   0.6,   // 섹션 내 요소
  slow:     1.2,   // 씬 전환
  epic:     2.4,   // 터널 진입 등 임팩트
}
```

### 반복 모티브 (Signature Motion)

이 사이트에서 반복되어 정체성이 되는 움직임:

1. **Digital Glitch** — 텍스트가 순간 어긋났다가 제자리로 (등장 시마다)
2. **Scan Line Wipe** — 가로 스캔라인이 아래로 내려오며 요소 등장
3. **Green Pulse** — 핵심 요소가 심장박동처럼 초록 빛을 한 번 뿜음
4. **Data Stream** — 숫자/문자가 빠르게 롤링되다가 최종값으로 확정

---

## Scroll Storytelling Flow

### 전체 스크롤 맵

```
0vh ─────────── Hero (현실 출발점)
                  └─ Binary Rain이 화면 위로 떨어지기 시작

200vh ─────────── 모니터 진입
                  └─ 구형 모니터 프레임이 화면을 덮음
                  └─ 모니터 속으로 카메라 줌인

400vh ─────────── Binary Tunnel 진입
                  └─ Three.js 터널, 카메라 Z축 이동
                  └─ 터널 벽에 이진수 흘러내림

700vh ─────────── Software Core (Page 2 시작)
                  └─ 터널 끝 — 빛나는 Core 등장
                  └─ 파티클 폭발 후 안정화

900vh ─────────── Circuit Expansion
                  └─ Core에서 회로가 사방으로 뻗어나감
                  └─ 학과 프로그램 항목이 회로 노드로 등장

1100vh ─────────── Course Network
                  └─ 회로가 과목 그래프로 변환
                  └─ 노드 클릭 → 과목 상세 패널

1300vh ─────────── Spark Transition (Page 3 시작)
                  └─ 전기 방전 — 화면 가득 스파크
                  └─ 색이 Black → Green으로 가득 찼다가 다시 Black

1500vh ─────────── Career Network
                  └─ 진로 노드들이 빛나며 등장
                  └─ 각 커리어 경로가 연결선으로 표시

1700vh ─────────── Future (엔딩)
                  └─ 카메라 풀백 — 전체 구조가 보임
                  └─ 최종 메시지 + CTA
```

### 씬 전환 원칙

```
A씬 → B씬 전환은 항상 이 패턴을 따른다:

1. EXIT  — A씬 요소들이 [방향/방식]으로 사라진다
2. HOLD  — 0.3초의 순수 Black 프레임 (또는 Spark Flash)
3. ENTER — B씬 요소들이 [방향/방식]으로 등장한다
```

---

## Page 1 Strategy — Binary Tunnel

> **목표**: 방문자가 "나 지금 소프트웨어 세계 안으로 들어가고 있구나"를 몸으로 느끼게 한다

### Scene 1-0: Hero (현실 출발점)

```
화면 구성:
  - 배경: 순수 Black
  - 중앙: "소프트웨어학과" 타이틀 (Geist Mono, 흰색, 대형)
  - 서브: "SKU Software Engineering" (초록, 작게)
  - 우측 하단: "SCROLL TO ENTER" 깜빡이는 텍스트
  - 배경 효과: 극히 미세한 Green 격자 패턴 (Vercel Blueprint Grid 참고 — REF #34)
```

**애니메이션 시퀀스** (페이지 로드 후):
1. `t=0.0s` — 완전 Black 화면
2. `t=0.4s` — 타이틀, Digital Glitch로 등장 (Scan Line Wipe 적용)
3. `t=1.0s` — 서브타이틀 fade in
4. `t=1.5s` — Binary Rain이 화면 상단에서 조금씩 떨어지기 시작 (Canvas, REF #01)
5. `t=2.0s` — "SCROLL TO ENTER" pulse 애니메이션 시작

**레퍼런스**: REF #01 (Binary Rain), REF #34 (Grid BG)

---

### Scene 1-1: 모니터 프레임 진입

스크롤 구간: `0% → 30%` of Page 1

```
스크롤 시작:
  - Binary Rain 밀도 증가 (sparse → dense)
  - 화면 중앙에 구형 CRT 모니터 프레임이 작게 등장

스크롤 진행:
  - 모니터 프레임이 카메라(뷰포트)를 향해 빠르게 확대
  - 모니터 베젤이 화면 가장자리로 사라지는 순간 = 진입

  ← GSAP ScrollTrigger: scrub: true, pin: true
  ← scale(0.3) → scale(20) 를 스크롤에 매핑
```

**핵심 코드 패턴**:
```jsx
// GSAP ScrollTrigger + clip-path (REF #26 참고)
gsap.to(".monitor-frame", {
  scale: 20,
  scrollTrigger: {
    trigger: ".scene-monitor",
    start: "top top",
    end: "bottom top",
    scrub: 1.5,
    pin: true,
  }
})
```

---

### Scene 1-2: Binary Tunnel 통과

스크롤 구간: `30% → 100%` of Page 1

```
구조:
  Three.js Scene — 독립 Canvas (WebGL)
  - CatmullRomCurve3로 S자 곡선 터널 경로 설정
  - TubeGeometry로 터널 메시 생성
  - 터널 내벽 텍스처: 이진수 문자열 (Canvas로 동적 생성)
  - ShaderMaterial: 이진수가 초록색으로 흘러내리는 효과
  - 카메라: 경로 따라 이동 (t: 0 → 1 매핑)

스크롤 연동:
  GSAP ScrollTrigger의 progress (0~1)를
  Three.js 카메라 position으로 변환

  scrollProgress → camera.position = curve.getPoint(scrollProgress)
  camera.lookAt(curve.getPoint(scrollProgress + 0.01))
```

**시각 효과 상세**:
- 터널 내벽: `00100110 11001001 01101100` 패턴 텍스처 (Canvas로 사전 렌더)
- 터널 길이: 씬을 3배 높이 스크롤로 천천히 통과
- 글로우: 터널 끝 (exit point)에 강한 Green Radial Gradient
- 속도감: 카메라 이동 속도를 스크롤 끝부분에서 가속 (ease.in)

**레퍼런스**: REF #06 (Tube 기술), REF #08 (Camera Scroll), REF #22 (GSAP 패턴)

---

### Page 1 구현 기술 결정

```
Canvas 2D:   Binary Rain (Hero 배경 + 터널 텍스처 소스)
Three.js:    모니터 줌인 씬 + Binary Tunnel 씬
GSAP:        ScrollTrigger (전체 스크롤 컨트롤)
Lenis:       Smooth scroll (터널 통과 시 부드러움)
```

---

## Page 2 Strategy — Software Core · Circuit Expansion · Course Network

> **목표**: "소프트웨어학과에서 무엇을 배우는가"를 정보가 살아서 움직이는 형태로 보여준다

### Scene 2-0: Software Core

스크롤 구간: 터널 탈출 직후 `0% → 25%` of Page 2

```
터널 끝에서 카메라가 빛 속으로 돌진하면:

  1. 화면 전체가 Green-White로 플래시 (0.1초)
  2. 플래시가 걷히며 거대한 구체(Core)가 중앙에 등장
  3. 구체 주변: 파티클이 궤도를 돌며 회전 (react-three-fiber)
  4. 구체 표면: 실시간 GLSL 셰이더 (노이즈 + 펄스)

구체가 안정화된 후:
  아래에서 헤드카피 등장:
  "이 모든 것은 코드로 시작된다"
  (Geist Mono, 대형, 스캔라인 와이프 등장)
```

**파티클 시스템** (Lusion v3 참고 — REF #03):
```jsx
// react-three-fiber 기반
// Points geometry + custom shader
// Green 파티클 300~500개
// 구체 주위를 elliptical orbit으로 공전
// 커서 위치에 반응해 약간 휘어짐
```

**레퍼런스**: REF #03 (Lusion 파티클), REF #05 (3D 파티클 패턴)

---

### Scene 2-1: Circuit Expansion

스크롤 구간: `25% → 60%` of Page 2

```
Software Core가 화면 상단으로 올라가며 작아지고,
그 자리에서 회로 패턴이 사방으로 뻗어나간다.

회로 노드 = 학과 프로그램 항목
  ○ 프로그래밍 기초
  ○ 알고리즘 & 자료구조
  ○ 인공지능
  ○ 웹/앱 개발
  ○ 시스템 소프트웨어
  ○ 데이터베이스

각 노드 등장 방식:
  - 회로 선이 먼저 그려지고 (SVG stroke-dashoffset 애니메이션)
  - 선 끝에서 노드(원)이 Green Pulse와 함께 팝(pop)
  - 노드 내부: 전기 테두리 효과 (REF #11 Electric Border 참고)
  - 노드 호버: 상세 설명 패널이 Glass UI로 등장
```

**회로 그리드 배경** (Codrops Reflective Grid 참고 — REF #16):
```
배경: Green 격자 패턴 (CSS)
격자 위: SVG로 동적 회로선 그리기
z-index 상단: Three.js 파티클 (미세한 먼지 느낌)
```

**레퍼런스**: REF #16 (Reflective Grid), REF #11 (Electric Border), REF #34 (Grid BG)

---

### Scene 2-2: Course Network

스크롤 구간: `60% → 100%` of Page 2

```
Circuit의 회로 패턴이 d3-force 그래프로 변환된다:

  - 트랜지션: 회로 노드 위치 → d3 시뮬레이션 노드 위치로 이동
    (GSAP morphing 또는 React state transition)

  - 그래프 구조:
    중심 노드: "소프트웨어학과"
    1차 노드: 전공 영역 (AI, 시스템, 웹, 데이터 등)
    2차 노드: 세부 과목
    엣지: 과목 간 선수 관계 또는 연계성

  - 인터랙션:
    노드 클릭 → 해당 과목/영역 상세 패널 (슬라이드인)
    노드 호버 → 연결된 과목들 하이라이트
    드래그 → d3 force simulation 반응

  - 하단: "이 모든 것이 연결되어 있다" 텍스트
```

**레퍼런스**: REF #17 (Data Visualization), REF #19 (Digital Journey)

---

### Page 2 구현 기술 결정

```
Three.js (r3f):   Software Core 구체 + 파티클 궤도
SVG Animation:    Circuit 선 그리기 (stroke-dashoffset)
d3-force:         Course Network 그래프 물리 시뮬레이션
Canvas 2D:        회로 배경 격자
GSAP:             씬 전환 + 노드 등장 타이밍
Motion (FM):      카드 패널 슬라이드인/아웃
```

---

## Page 3 Strategy — Spark Transition · Career Network · Future

> **목표**: "이 탐험의 끝에는 당신의 미래가 있다"는 감정적 각인

### Scene 3-0: Spark Transition

스크롤 구간: Page 2 → Page 3 경계

```
이 전환은 사이트 전체에서 가장 극적인 순간이다.

연출 순서:
  1. Course Network의 그래프가 점점 진동하기 시작
  2. 모든 노드와 엣지가 동시에 과부하(overload) 상태로
     (진동 진폭 증가, Green Glow 강도 최대)
  3. 중앙에서 전기 방전 — 화면 전체에 Spark 파티클 폭발
     (Click Spark Effect 기법 — REF #13, CSS + Canvas 파티클)
  4. 화면 전체 Green Flash (100ms)
  5. 완전 Black으로 리셋
  6. 새로운 텍스트 등장: "그래서, 졸업 후에는?"
```

**Spark 파티클 시스템**:
```jsx
// Canvas 기반 파티클 (Three.js 불필요)
// 중앙에서 360도 방향으로 발사
// 색상: White → Green → Fade Out
// 중력 효과 적용 (vy += 0.1)
// 50~80개 파티클, 1.5초간
```

**레퍼런스**: REF #11 (Electric Border), REF #12 (Sparkler), REF #13 (Click Spark)

---

### Scene 3-1: Career Network

스크롤 구간: `0% → 65%` of Page 3

```
화면 구성:
  Course Network의 구조와 유사하지만,
  노드가 "과목" 대신 "직업/진로"로 대체된다

  중심 노드: "SKU 소프트웨어학과 졸업생"
  1차 노드 (진로 영역):
    ○ 개발자 (Frontend / Backend / Full-Stack)
    ○ AI 엔지니어 / 데이터 사이언티스트
    ○ 스타트업 창업
    ○ 대기업 IT 부서
    ○ 게임 개발
    ○ 대학원 / 연구직

  각 노드 내부:
    - 실제 취업 기업 아이콘 (작게)
    - 평균 연봉 / 취업률 (Data Stream 효과로 카운팅)

  배경:
    - 성층권 위 우주 느낌 (매우 어두운 배경)
    - 미세한 별 파티클 (Canvas)
    - 노드들이 별처럼 빛남

  인터랙션:
    노드 클릭 → 해당 커리어의 졸업생 인터뷰 / 로드맵 카드
```

**레퍼런스**: REF #17 (Network Viz), REF #18 (Immersive Gallery)

---

### Scene 3-2: Future (엔딩)

스크롤 구간: `65% → 100%` of Page 3

```
Career Network가 카메라 풀백으로 작아지며,
전체 그래프가 하나의 빛나는 점처럼 보이게 된다.

그 위에 최종 메시지:

  ┌──────────────────────────────────────┐
  │                                      │
  │   이 세계를 만드는 사람이 되고 싶다면  │
  │                                      │
  │   SOFTWARE ENGINEERING               │
  │   @ Seokyeong University             │
  │                                      │
  │   [ 입학 안내 →  ]  [ 커리큘럼 보기 ] │
  │                                      │
  └──────────────────────────────────────┘

  하단: 학과 정보 (교수진, 연락처, SNS)
  — Glass UI 카드 (REF #35)
  — Electric Border Hover (REF #11)
```

**마지막 인터랙션**:
```
"입학 안내" 버튼 클릭 시:
  → 전체 화면 Green Spark 폭발 (Spark 씬 재현)
  → 외부 입학처 링크로 이동
```

---

## Recommended Tech Stack

### 핵심 결정

```
이 프로젝트는 현재 React 18 + Vite 기반이다.
추가 선택 시 기존 환경과의 충돌 없이 점진적으로 추가한다.
```

### 패키지 목록

```json
{
  "dependencies": {
    // === 이미 설치된 것 ===
    "react": "^18",
    "vite": "^5",

    // === 3D / WebGL ===
    "three": "^0.167",
    "@react-three/fiber": "^8",
    "@react-three/drei": "^9",

    // === Scroll Engine ===
    "gsap": "^3.12",
    "@gsap/react": "^2",
    "lenis": "^1.1",

    // === UI Animation ===
    "motion": "^11",

    // === Network Graph ===
    "d3-force": "^3",
    "d3-selection": "^3",

    // === Utilities ===
    "lottie-react": "^2.4",
    "clsx": "^2"
  }
}
```

### 파일 구조 (권장)

```
src/
├── scenes/
│   ├── HeroScene/          ← Binary Rain + 격자 배경
│   ├── TunnelScene/        ← Three.js Binary Tunnel
│   ├── CoreScene/          ← Software Core 파티클
│   ├── CircuitScene/       ← SVG 회로 + 노드
│   ├── CourseNetwork/      ← d3-force 그래프
│   ├── SparkTransition/    ← Canvas 파티클 폭발
│   ├── CareerNetwork/      ← d3-force 그래프 v2
│   └── FutureScene/        ← 엔딩 + CTA
├── components/
│   ├── BinaryRain/         ← Canvas 컴포넌트
│   ├── ElectricCard/       ← SVG 테두리 카드
│   ├── GlassPanel/         ← 글래스 UI 패널
│   ├── DataStream/         ← 숫자 롤링 효과
│   ├── ScanLineText/       ← 스캔라인 등장 텍스트
│   └── GlowCursor/         ← 커스텀 커서
├── hooks/
│   ├── useScrollProgress.js
│   ├── useLenis.js
│   └── useGSAP.js
├── shaders/
│   ├── tunnel.vert.glsl
│   ├── tunnel.frag.glsl
│   ├── core.vert.glsl
│   └── core.frag.glsl
└── constants/
    ├── colors.js
    ├── easing.js
    └── timing.js
```

---

## Risk Analysis

### Risk 1: WebGL 모바일 성능 ★★★★☆ (고위험)

**문제**: Three.js 씬이 다수 존재 → 저사양 모바일/구형 PC에서 프레임 드롭

**완화 전략**:
```
1. 기기 감지: GPU tier 체크 (detect-gpu 패키지)
   - High Tier → Full WebGL experience
   - Low Tier  → CSS Fallback (Three.js 비활성화)

2. 씬 간 메모리 정리: useEffect cleanup에서 dispose() 철저히 수행

3. 파티클 수 조정: 모바일 100개, 데스크탑 500개

4. Suspense + lazy loading: 각 Scene 컴포넌트를 Lazy로 로드
```

---

### Risk 2: 스크롤 상태 복잡도 ★★★☆☆ (중위험)

**문제**: 8개 씬을 하나의 긴 스크롤로 관리 → 타이밍 충돌, 디버깅 어려움

**완화 전략**:
```
1. GSAP Timeline을 씬 단위로 분리 (global timeline X, scene timeline O)
2. ScrollTrigger.create에 id 부여 → 개별 kill/refresh 가능
3. 개발 중 ScrollTrigger.getAll().forEach(t => t.kill()) 로 초기화
```

---

### Risk 3: 번들 크기 ★★★☆☆ (중위험)

**문제**: Three.js(600KB) + GSAP(200KB) + d3(200KB) → 총 1MB+ 번들

**완화 전략**:
```
1. Code Splitting: 각 Scene을 dynamic import
2. Three.js tree-shaking: import { Scene, ... } 형태 사용
3. d3 modular import: d3-force, d3-selection만 사용
4. vite-plugin-compression: gzip 적용 시 실제 전송량 60% 감소
```

---

### Risk 4: 접근성 (Motion Sensitivity) ★★☆☆☆ (저위험)

**문제**: 빠른 플래시/터널 효과 → 광과민성 사용자 문제

**완화 전략**:
```css
@media (prefers-reduced-motion: reduce) {
  /* 터널, 스파크 등 강한 모션 비활성화 */
  /* 정적 이미지로 대체 */
}
```

---

### Risk 5: Binary Tunnel 씬 미완성 시 전체 인상 저하 ★★★★☆ (고위험)

**문제**: 터널이 핵심인데, 구현 품질이 낮으면 전체 컨셉이 무너짐

**완화 전략**:
```
→ 터널 씬을 MVP에서 제외하고 CSS/Canvas 대체 버전으로 먼저 런칭
→ 후속 스프린트에서 Three.js 터널 적용
(MVP 전략 섹션 참고)
```

---

## MVP Version

> **목표**: Three.js 없이, GSAP + Canvas + CSS만으로 핵심 경험을 전달한다  
> **기간 예상**: 3~4주  
> **품질 목표**: "와 이런 학과 사이트 처음 봤다" 반응

### MVP에 포함하는 것

| 씬 | MVP 구현 방식 |
|----|-------------|
| Hero | Canvas Binary Rain ✅ + Grid BG ✅ + 타이틀 등장 ✅ |
| 모니터 진입 | CSS scale + GSAP ScrollTrigger ✅ (Three.js 없이) |
| Binary Tunnel | **CSS 원근법 터널** (perspective + rotating squares) 🔄 |
| Software Core | **CSS 글로우 구체** + Canvas 파티클 2D 🔄 |
| Circuit Expansion | SVG 애니메이션 + CSS Grid ✅ |
| Course Network | **Canvas 기반 간이 그래프** (d3-force) ✅ |
| Spark Transition | CSS + Canvas 파티클 ✅ |
| Career Network | **카드 리스트** (Framer Motion 슬라이드인) 🔄 |
| Future | 텍스트 + CTA ✅ |

> ✅ 원안 그대로 / 🔄 단순화 버전

### MVP 기술 스택

```
React 18 + Vite + Tailwind
GSAP 3 + ScrollTrigger + Lenis
Motion (Framer Motion) — UI 마이크로
Canvas 2D — Binary Rain + Spark
SVG — Circuit 선 그리기
d3-force — Course Network (Canvas 렌더)
```

---

## High-End Version

> **목표**: Awwwards SOTD 수준. 방문자가 스크린샷 찍어서 공유하는 경험  
> **기간 예상**: MVP + 4~6주 추가  
> **품질 목표**: "이게 대학교 홍보 사이트야?" 반응

### High-End 추가 구현

| 씬 | High-End 추가 사항 |
|----|--------------------|
| Binary Tunnel | Three.js CatmullRomCurve3 실제 터널 + GLSL 셰이더 |
| Software Core | react-three-fiber 파티클 궤도 + PBR 구체 재질 |
| Circuit Expansion | Three.js 기반 회로 (에너지 파동 효과) |
| Course Network | Three.js 기반 3D 네트워크 그래프 (노드 부유감) |
| Spark Transition | WebGL Particle System (1000개+, 물리 시뮬레이션) |
| Career Network | 성층권 배경 + 별 파티클 Three.js |
| 전체 공통 | 커스텀 GLSL 후처리 (bloom, chromatic aberration) |
| 커서 | 자기장 커서 (magnetic cursor + glow trail) |

### High-End 추가 패키지

```
@react-three/postprocessing  ← bloom, CA 후처리
detect-gpu                   ← GPU 성능 티어 감지
vite-plugin-glsl             ← GLSL 파일 import
```

---

## 한 줄 요약

> 우리는 학과를 **설명**하지 않는다.  
> 소프트웨어 세계를 **경험**하게 한다.  
> 방문자가 스크롤을 끝냈을 때, 그 세계의 일부가 되고 싶어야 한다.
