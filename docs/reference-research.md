# 레퍼런스 리서치 — 서경대학교 소프트웨어학과 홍보 웹사이트

> 조사 목적: Black + Green(#00FF88) 테마, Matrix Binary Rain, Apple 스타일 Scroll Storytelling,  
> Vercel / Linear / Nvidia 감성의 Premium Futuristic 웹사이트 제작을 위한 레퍼런스 수집  
> 조사 일자: 2026-06-21

---

## 범례

| 필드 | 설명 |
|------|------|
| 구현 난이도 | 1(쉬움) ~ 5(매우 어려움) |
| React | React 내 구현 가능 여부 |
| Framer Motion | Framer Motion(Motion for React) 활용 가능 여부 |
| Three.js | Three.js / WebGL 필수 여부 |

---

## 카테고리 1 — Binary Rain / Matrix 스타일 UI

### 01. Matrix Code Rain (Geek Prank)
- **URL**: https://geekprank.com/matrix-code-rain/
- **핵심 인터랙션**: Canvas 기반 초록색 이진/문자 폭포, 속도·밀도 커스텀
- **참고 포인트**: 폭포 줄기의 head(밝은 흰색) → tail(점점 어두워지는 초록) 그라디언트 렌더링 로직
- **구현 난이도**: 2
- **React**: ✅ (useRef + useEffect + Canvas API)
- **Framer Motion**: ❌ (Canvas requestAnimationFrame이 효율적)
- **Three.js**: ❌

---

### 02. Bruno Simon Portfolio — Particle / Code Aesthetic
- **URL**: https://bruno-simon.com
- **핵심 인터랙션**: Three.js 기반 미니 3D 세계, 자동차가 요소를 탐험 / 클릭 인터랙션
- **참고 포인트**: WebGL 환경에서 "컴퓨터 세계 탐험" 메타포를 직접 구현한 최고 사례
- **구현 난이도**: 5
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 03. Lusion v3 — Awwwards Site of the Year 2024
- **URL**: https://lusion.co / https://www.awwwards.com/sites/lusion-v3
- **핵심 인터랙션**: 실시간 WebGL 파티클 필드, 커서 따라 물결치는 반응형 시각 효과
- **참고 포인트**: 파티클이 Binary/Data 느낌을 주면서도 프리미엄 감성 유지. Black BG + 네온 포인트
- **구현 난이도**: 5
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 04. Final Hack of the Year 2022 — Awwwards Honorable Mention
- **URL**: https://www.awwwards.com/sites/final-hack-of-the-year-2022
- **핵심 인터랙션**: 해커 미학 + 터미널/코드 UI + 데이터 스트리밍 시각화
- **참고 포인트**: 소프트웨어학과 "컴퓨터 해킹/탐험" 스토리텔링에 직접 적용 가능한 시각 언어
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅ (텍스트 타이핑 애니메이션)
- **Three.js**: ❌

---

### 05. Particles 3D Animation Set — Awwwards Honorable Mention
- **URL**: https://www.awwwards.com/sites/particles-3d-animation-set
- **핵심 인터랙션**: 추상적 3D 파티클 세트, 다양한 파티클 움직임 패턴
- **참고 포인트**: Binary Rain의 3D 버전, 데이터 흐름을 입체적으로 표현
- **구현 난이도**: 4
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

## 카테고리 2 — Binary Tunnel / Camera Zoom Transition

### 06. Infinite Tubes with Three.js — Codrops
- **URL**: https://tympanus.net/codrops/2017/05/09/infinite-tubes-with-three-js/
- **핵심 인터랙션**: Three.js CatmullRomCurve3로 만든 무한 터널, 카메라가 안으로 날아가는 효과
- **참고 포인트**: "Binary Tunnel" 씬의 핵심 기술. 터널 텍스처를 이진수 패턴으로 교체하면 완성
- **구현 난이도**: 4
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 07. Tunnel Animation — Mamboleoo / Louis Hoebregts
- **URL**: https://www.mamboleoo.be/articles/tunnel-animation-1  
  CodePen: https://codepen.io/Mamboleoo/post/tunnel-animation-1
- **핵심 인터랙션**: Canvas 2D + requestAnimationFrame으로 구현된 퍼스펙티브 터널
- **참고 포인트**: Three.js 없이도 Canvas로 터널 효과 가능. 퍼포먼스 최적화에 유리
- **구현 난이도**: 3
- **React**: ✅ (useRef Canvas)
- **Framer Motion**: ❌
- **Three.js**: ❌

---

### 08. 3D Camera Scroll — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/3d-camera-scroll-submission-6364dde2a2f86187118961
- **핵심 인터랙션**: 스크롤에 따라 3D 공간을 카메라가 날아다니는 효과 (Pixelynx Musicverse)
- **참고 포인트**: "현실 → 컴퓨터 화면 → Binary Tunnel" 씬 전환에 직접 적용 가능
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 09. Zoom In 3D Animation — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/zoom-in-3d-animation
- **핵심 인터랙션**: 요소를 향해 카메라가 급격히 줌인, 다음 씬으로 진입하는 전환
- **참고 포인트**: "Software Core" 또는 "Career Network"로 진입하는 씬 전환 레퍼런스
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅ (scale + perspective)
- **Three.js**: △ (선택적)

---

### 10. Zoom Out Effect by Scrolling — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/zoom-out-effect-by-scrolling
- **핵심 인터랙션**: 스크롤 시 카메라가 뒤로 물러나며 전체 구조가 드러나는 효과
- **참고 포인트**: "Circuit Expansion" 씬 — 회로가 점점 넓게 펼쳐지는 연출에 적용
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅ (useScroll + useTransform)
- **Three.js**: △ (선택적)

---

## 카테고리 3 — Circuit Board / Electric Spark

### 11. Animated Electric Border CSS Card
- **URL**: https://freefrontend.com/code/animated-electric-border-css-card-2026-02-23/
- **핵심 인터랙션**: SVG feTurbulence 필터로 카드 테두리에 전기 흐름 효과
- **참고 포인트**: 회로기판 UI 요소, 강의 카드/커리어 카드에 적용. CSS만으로 구현
- **구현 난이도**: 2
- **React**: ✅
- **Framer Motion**: ✅ (animate + variants)
- **Three.js**: ❌

---

### 12. Animated CSS Sparkler — DEV Community
- **URL**: https://dev.to/johnnyfekete/animated-css-sparkler-5fbb
- **핵심 인터랙션**: Pure CSS keyframe으로 스파크/불꽃 효과 구현
- **참고 포인트**: "Spark Transition" 씬의 전환 효과, 클릭 인터랙션에 활용
- **구현 난이도**: 2
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 13. Click Spark Effect — DEV Community
- **URL**: https://dev.to/prahalad/click-anywhere-to-see-spark-effectfireworks-using-css-and-js-20fn
- **핵심 인터랙션**: 클릭 지점에서 불꽃이 사방으로 튀는 파티클 효과 (CSS + JS)
- **참고 포인트**: 사용자 인터랙션 시 "전기 방전" 느낌, 소프트웨어 세계 진입 순간 연출
- **구현 난이도**: 2
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 14. Animated Electric Card — Coding Stella
- **URL**: https://codingstella.com/how-to-make-animated-electric-card-using-html-css/
- **핵심 인터랙션**: oklch() 색상 모델 + 그라디언트 보더 + 블러 글로우 레이어 조합
- **참고 포인트**: Green(#00FF88) 포인트 색상의 글로우 카드 UI 구현에 최적
- **구현 난이도**: 2
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 15. Iconscout Semiconductor Chip Lottie Animations
- **URL**: https://iconscout.com/lottie-animations/semiconductor-chip
- **핵심 인터랙션**: 290개+ 반도체 칩 Lottie 애니메이션 (GIF, JSON, MP4)
- **참고 포인트**: "Software Core" / "Circuit Expansion" 씬의 배경 또는 UI 요소로 즉시 활용 가능
- **구현 난이도**: 1
- **React**: ✅ (lottie-react)
- **Framer Motion**: ❌
- **Three.js**: ❌

---

### 16. Recreating Crosswire's Reflective Grid — Codrops
- **URL**: https://tympanus.net/codrops/2023/02/13/recreating-crosswires-reflective-grid-with-three-js/
- **핵심 인터랙션**: Three.js로 만든 반사 격자 + 에너지 파동, 회로기판 질감
- **참고 포인트**: PCB 회로 패턴의 표면 질감 구현, "Circuit Expansion" 씬 배경
- **구현 난이도**: 4
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

## 카테고리 4 — Network Visualization / Data Flow

### 17. State of AI 2025 Data Visualization — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/data-visualization-state-of-ai-2025
- **핵심 인터랙션**: AI 데이터를 네트워크 노드/엣지로 시각화, 스크롤 연동 애니메이션
- **참고 포인트**: "Course Network" / "Career Network" 씬의 그래프 시각화 레퍼런스
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: △ (d3.js 또는 canvas 병행 권장)
- **Three.js**: △ (선택적)

---

### 18. The Unconventional Gallery — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/the-unconventional-gallery-interactive-and-immersive-webgl-gallery-exhibition
- **핵심 인터랙션**: WebGL 기반 몰입형 갤러리, 공간 이동 인터랙션
- **참고 포인트**: "컴퓨터 세계 탐험" 컨셉의 갤러리 형태로 커리어 맵을 표현할 때 참고
- **구현 난이도**: 5
- **React**: ✅ (react-three-fiber)
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 19. Futuristic Digital Journey — CHILE20 (Awwwards Inspiration)
- **URL**: https://www.awwwards.com/inspiration/futuristic-digital-journey-chile20
- **핵심 인터랙션**: 미래적 디지털 여정 스토리텔링, 씬 간 전환 연출
- **참고 포인트**: 전체 스토리 "현실 → Future" 플로우의 씬 전환 방식 참고
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ✅ 필수

---

### 20. Anderson Mancini Portfolio
- **URL**: https://www.andersonmancini.me
- **핵심 인터랙션**: WebGL + Three.js 몰입형 3D 이미지 캐러셀, 커서 기반 인터랙션
- **참고 포인트**: 데이터 흐름 / 네트워크 노드 씬 구현을 위한 Three.js 패턴 참고
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

## 카테고리 5 — Scroll Storytelling

### 21. Apple iPhone 15 Pro 공식 사이트 (원본)
- **URL**: https://www.apple.com/iphone-15-pro/
- **핵심 인터랙션**: 스크롤에 따라 3D 모델 회전, 이미지 시퀀스 재생, 텍스트 페이드인
- **참고 포인트**: 스크롤 스토리텔링의 교과서. "현실 → Binary Tunnel" 전환에 직접 적용
- **구현 난이도**: 4
- **React**: ✅ (GSAP ScrollTrigger + react-three-fiber)
- **Framer Motion**: △ (일부 가능, GSAP ScrollTrigger가 더 강력)
- **Three.js**: ✅ 필수

---

### 22. Apple iPhone 15 Pro Clone — adrianhajdin/iphone (GitHub)
- **URL**: https://github.com/adrianhajdin/iphone
- **핵심 인터랙션**: React + Three.js + GSAP로 애플 스크롤 스토리텔링 완전 재현
- **참고 포인트**: 오픈소스 구현체. 코드 패턴을 직접 학습/참고 가능
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: ❌ (GSAP 기반)
- **Three.js**: ✅ 필수

---

### 23. Scroll Triggered Animation — Apple AirPods Pro (Awwwards Inspiration)
- **URL**: https://www.awwwards.com/inspiration/product-scroll-triggered-animation-apple-airpods-pro
- **핵심 인터랙션**: 스크롤에 따라 제품 기능이 순서대로 애니메이션으로 등장
- **참고 포인트**: 강의 커리큘럼이나 프로그램 특징을 순차적으로 소개하는 방식에 적용
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅ (useScroll + useTransform)
- **Three.js**: ❌

---

### 24. The Power of Storytelling — Noomo Agency (Awwwards SOTD)
- **URL**: https://www.awwwards.com/sites/the-power-of-storytelling
- **핵심 인터랙션**: WebGL + GSAP + Three.js 조합 스토리텔링, 스크롤로 내러티브 전개
- **참고 포인트**: 스토리텔링 + WebGL의 결합 방식, 씬 전환 기법
- **구현 난이도**: 5
- **React**: ✅
- **Framer Motion**: ❌
- **Three.js**: ✅ 필수

---

### 25. Zoom Wave Scroll Effect — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/zoom-wave-scroll-effect
- **핵심 인터랙션**: 스크롤 시 파동처럼 요소가 줌인/아웃되는 물결 효과
- **참고 포인트**: "Binary Tunnel → Software Core" 전환의 웨이브 연출
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 26. GSAP Award-Winning Website Clone — adrianhajdin (GitHub + SOTM)
- **URL**: https://github.com/adrianhajdin/award-winning-website
- **핵심 인터랙션**: GSAP + clip-path 기반 기하학적 전환, 비디오 트랜지션, 스크롤 애니메이션
- **참고 포인트**: 씬 전환 시 clip-path 기법 참고. Awwwards SOTM 수상작 재현
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ❌ (GSAP 기반)
- **Three.js**: ❌

---

### 27. Storytelling Collection — Awwwards
- **URL**: https://www.awwwards.com/awwwards/collections/storytelling/
- **핵심 인터랙션**: 스크롤 기반 내러티브 스토리텔링 모음집
- **참고 포인트**: 다양한 스토리텔링 패턴을 한 곳에서 비교 탐색 가능
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

## 카테고리 6 — 대학/기관 홍보 웹사이트

### 28. InterMedia Design University — Awwwards Nominee
- **URL**: https://www.awwwards.com/sites/intermedia-design-university
- **핵심 인터랙션**: Canvas 물리 엔진 애니메이션, 디자인 대학 홍보 웹사이트
- **참고 포인트**: 교육 기관이 awwwards에서 인정받은 드문 사례. UI 구조 및 섹션 흐름 참고
- **구현 난이도**: 4
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: △ (선택적)

---

### 29. Best Institutions Websites — Awwwards Collection
- **URL**: https://www.awwwards.com/websites/institutions/
- **핵심 인터랙션**: 교육/기관 카테고리 수상작 모음
- **참고 포인트**: 대학 홍보 사이트의 업계 수준과 트렌드 파악용 컬렉션
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

## 카테고리 7 — Premium Dark Tech 감성 (Vercel / Linear / Nvidia)

### 30. Vercel Design Guidelines
- **URL**: https://vercel.com/design/guidelines
- **핵심 인터랙션**: Black/White 정밀 미학, Geist 폰트, 서브틸 그리드 패턴, 마우스 스팟라이트
- **참고 포인트**: 전체 사이트의 타이포그래피, 컬러 토큰, 공간감 설계의 기준점
- **구현 난이도**: 2 (디자인 시스템 참고)
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 31. Linear — Modern Website Design Aesthetic
- **URL**: https://linear.app
- **핵심 인터랙션**: 다크 기본 + 퍼플 액센트, 거대 키네틱 타이포그래피, 라이브 인-프로덕트 데모
- **참고 포인트**: 개발자 도구 감성 + 시네마틱 미니멀리즘. Bento Grid 레이아웃, 커서 마이크로인터랙션
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 32. Electric Colors for the Ultimate Digital Future — Awwwards Article
- **URL**: https://www.awwwards.com/electric-colors-for-the-ultimate-digital-future.html
- **핵심 인터랙션**: 네온/일렉트릭 컬러 팔레트 + 글로우 효과 적용 사례 모음
- **참고 포인트**: #00FF88 Green을 포함한 Electric 컬러 조합 이론 및 실제 사례
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

### 33. Dark Mode Collection — Awwwards
- **URL**: https://www.awwwards.com/awwwards/collections/dark-mode/
- **핵심 인터랙션**: 다크 모드 UI 수상작 모음, 배경/텍스트/액센트 컬러 조화
- **참고 포인트**: Black Background + 네온 포인트 조합의 레퍼런스 풀
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

### 34. Vercel Blueprint Grid Design — Setproduct Blog
- **URL**: https://www.setproduct.com/blog/complete-guide-to-blueprint-grid-design
- **핵심 인터랙션**: 히어로 영역의 서브틸 격자(그리드) 패턴 배경 기법
- **참고 포인트**: "회로기판" 느낌의 격자 배경 구현 방법론. CSS background-image로 구현 가능
- **구현 난이도**: 1
- **React**: ✅
- **Framer Motion**: ❌
- **Three.js**: ❌

---

### 35. Glassmorphism with Dark & Light Theme — Awwwards Inspiration
- **URL**: https://www.awwwards.com/inspiration/glassmorphism-with-dark-light-theme-henning-tillmann
- **핵심 인터랙션**: 다크 배경 위 반투명 유리 카드 UI, 블러 + 글로우 레이어
- **참고 포인트**: 교수진 소개, 커리큘럼 카드 등 정보 카드 UI 스타일
- **구현 난이도**: 2
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

## 카테고리 8 — 추가 크리에이티브 레퍼런스

### 36. Zenly Website Animation — The Animated Web
- **URL**: https://theanimatedweb.com/inspiration/zenly/
- **핵심 인터랙션**: 스크롤 스토리텔링 + 화면 간 유기적 전환, 소셜 앱 홍보
- **참고 포인트**: 앱/서비스 소개 페이지의 스크롤 스토리텔링 흐름 참고
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

### 37. Fancy Scrolling Animations — CSS-Tricks (Apple Style)
- **URL**: https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/
- **핵심 인터랙션**: 스크롤 포지션에 따라 이미지 시퀀스 프레임을 바꿔 영상처럼 보이게 하는 기법
- **참고 포인트**: "현실 → 컴퓨터 화면" 씬 전환 시 이미지 시퀀스 기법 구현 가이드
- **구현 난이도**: 3
- **React**: ✅
- **Framer Motion**: ✅ (useScroll)
- **Three.js**: ❌

---

### 38. Three.js Examples — threejs.org
- **URL**: https://threejs.org/examples/
- **핵심 인터랙션**: 공식 Three.js 예제 전체 (파티클, 쉐이더, 물리, 후처리 등)
- **참고 포인트**: Binary Rain, 터널, 회로 애니메이션 구현을 위한 공식 기술 레퍼런스
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: ✅

---

### 39. Codrops Creative Hub
- **URL**: https://tympanus.net/codrops/hub/
- **핵심 인터랙션**: 오픈소스 웹 데모, 디자인 실험, 인터랙티브 컨셉 쇼케이스
- **참고 포인트**: Three.js, WebGL, Canvas 기반 크리에이티브 구현체 탐색
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

### 40. Build Interactive WebGL with Next.js — Vercel Blog
- **URL**: https://vercel.com/blog/building-an-interactive-webgl-experience-in-next-js
- **핵심 인터랙션**: Next.js + WebGL 통합 방법론, 성능 최적화 패턴
- **참고 포인트**: React 기반 프로젝트에서 WebGL 씬을 최적화하는 공식 가이드
- **구현 난이도**: 참고용
- **React**: ✅
- **Framer Motion**: △
- **Three.js**: ✅

---

### 41. Some Recent Creative Coding Experiments — Codrops (2024)
- **URL**: https://tympanus.net/codrops/2024/10/04/some-recent-creative-fun-coding-experiments/
- **핵심 인터랙션**: 2024년 최신 크리에이티브 코딩 실험 모음
- **참고 포인트**: 최신 트렌드의 시각 실험들, 독창적인 애니메이션 아이디어 탐색
- **구현 난이도**: 참고용
- **React**: 참고용
- **Framer Motion**: 참고용
- **Three.js**: 참고용

---

### 42. Motion for React (구 Framer Motion) 공식 문서
- **URL**: https://motion.dev/docs/react
- **핵심 인터랙션**: Web Animations API + ScrollTimeline 기반 120fps 애니메이션
- **참고 포인트**: 2025년부터 framer-motion이 motion으로 renamed. import 경로 변경 필요
- **구현 난이도**: 참고용
- **React**: ✅
- **Framer Motion**: ✅
- **Three.js**: ❌

---

## 종합 구현 전략 요약

### 씬별 권장 기술 스택

| 씬 | 핵심 기술 | 난이도 | 주요 레퍼런스 |
|---|---|---|---|
| Binary Rain | Canvas 2D + requestAnimationFrame | 2 | #01, #07 |
| Binary Tunnel | Three.js (CatmullRomCurve3) | 4 | #06, #08 |
| Camera Zoom Transition | GSAP ScrollTrigger + Three.js | 4 | #09, #10, #22 |
| Software Core | react-three-fiber + 파티클 | 5 | #02, #03, #05 |
| Circuit Expansion | Three.js + CSS SVG 그리드 | 4 | #16, #34 |
| Course Network | d3-force + Canvas / Three.js | 4 | #17, #20 |
| Spark Transition | CSS SVG feTurbulence / Particle | 2 | #11, #12, #13 |
| Career Network | d3-force 또는 Three.js 그래프 | 3 | #17, #19 |
| 전반적 Scroll | GSAP ScrollTrigger + Lenis | 3 | #21, #24, #26 |
| 카드/UI 감성 | Tailwind + Framer Motion + Glass | 2 | #30, #31, #35 |

### 기술 스택 추천

```
Core: React 18 + Vite
3D/WebGL: Three.js + @react-three/fiber + @react-three/drei
Scroll: GSAP ScrollTrigger + Lenis (smooth scroll)
Animation: Framer Motion (UI/마이크로) + GSAP (씬 전환)
Shader: glsl (커스텀) 또는 Codrops 오픈소스 참고
Network: d3-force (Course/Career Network 씬)
```

### 구현 우선순위

1. **즉시 구현 가능** (난이도 1~2): Binary Rain, Electric Card, Grid BG, Lottie Chip
2. **핵심 구현** (난이도 3~4): Scroll Storytelling, Camera Zoom, Binary Tunnel
3. **고급 구현** (난이도 5): WebGL 파티클 필드, 3D 월드 탐험

---

*리서치 기준: Awwwards 수상작, Codrops 크리에이티브 허브, 공식 기술 문서, GitHub 오픈소스 구현체*
