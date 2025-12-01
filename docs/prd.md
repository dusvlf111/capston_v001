# 해양레저스포츠 AI 기반 자율신고제도 MVP - Vercel/Supabase/Next.js/PWA 기반 PRD

## 1. 설계의 목적 및 필요성

### 1.1 목적 및 필요성
**선정 동기**: 해양레저스포츠 참여자들이 직면하는 가장 큰 문제는 활동 지역에 대한 정확한 사전 정보 부족입니다. 이로 인해 선의의 레저활동자들이 의도치 않게 법규를 위반하거나 어업인들과 갈등을 겪는 사례가 빈번하게 발생하고 있습니다.

**주요 해결 방법**: AI 기반 통합 정보 분석 시스템을 통해 레저활동자가 사전에 활동 계획을 신고하면, Supabase Edge Functions와 공공기관 API를 연계하여 해당 지역의 법적 제약사항, 안전정보, 어업권 현황 등을 종합 분석해 맞춤형 정보를 제공합니다.[1][2]

**주요 기능**:
- 사전 자율신고 시스템 (Supabase PostgreSQL + RLS 기반)
- AI 기반 다중 API 통합 분석 (Edge Functions 활용)
- 실시간 안전 정보 제공 (Realtime Subscriptions)
- 지도 기반 시각적 안전구역 표시 (Windy API + OpenStreetMap + Supabase Storage)
- 응급상황 대응 시스템
- PWA 오프라인 지원 (Service Worker + IndexedDB)

**사용 대상**:
- 1차: 해양레저스포츠 참여자 (패들보드, 카약, 윈드서핑 등)
- 2차: 해양경찰, 구조기관, 어업인

**개선 효과**:
- 해양레저 관련 민원 30% 감소 예상
- 응급상황 구조 시간 단축
- 레저활동자와 어업인 간 상생 환경 조성
- 오프라인 환경에서도 기본 기능 사용 가능

### 1.2 관련 기술 및 시장 동향

**기술 동향**:
- Vercel Edge Network를 통한 글로벌 배포 및 CDN 최적화[3][4]
- Supabase Realtime으로 실시간 데이터 동기화 지원[4]
- Next.js 14 App Router 기반 서버 컴포넌트 활용[2]
- PWA 기술 발달로 네이티브 앱과 유사한 UX 제공[5][6]
- Supabase Row Level Security로 데이터베이스 레벨 보안 강화[7][8]
- Windy API를 통한 실시간 기상 데이터 시각화 및 예보 정보 제공
- OpenStreetMap 레이어 통합으로 상세 지도 정보 제공

**시장성**:
- 국내 해양레저스포츠 시장 연간 15% 성장
- 해양레저 참여인구 2024년 기준 약 500만명
- 해양 안전사고 연간 약 1,500건 발생
- 정부의 해양레저산업 육성 정책 강화

### 1.3 기존 연구와의 차별성

**기술적 차별성**:
- 기존: 단일 기관 정보 제공 → 신규: Supabase Edge Functions 기반 다중 공공기관 API 통합 분석[1]
- 기존: 사후 대응 중심 → 신규: 사전 예방 중심 자율신고
- 기존: 온라인 전용 → 신규: PWA 기반 오프라인 지원[6]
- 기존: 중앙 서버 의존 → 신규: Vercel Edge Runtime으로 저지연 응답[4]

**보안적 차별성**:
- Supabase RLS로 데이터베이스 레벨에서 사용자별 접근 제어[8][7]
- API Key를 Vercel Environment Variables로 안전하게 관리[9][3]
- 인증된 사용자만 민감 데이터 접근 가능 (`auth.uid()` 활용)[8]

## 2. 요구사항 분석

### 2.1 요구분석

**기능적 요구사항**:
- Supabase Auth 기반 사용자 인증 (이메일/소셜 로그인)[10][11]
- 활동 정보 입력 및 실시간 검증
- Edge Functions를 통한 다중 공공기관 API 연동[1]
- AI 기반 종합 안전도 분석 (Supabase Vector 활용 가능)[1]
- Supabase Realtime Subscriptions로 실시간 알림[4]
- PWA Service Worker 기반 오프라인 기능[5][6]
- Windy API Map Forecast로 기상/해양 데이터 시각화
- Windy Point Forecast API로 정밀 지점 예보 데이터 제공
- OpenStreetMap 레이어 토글 기능

**성능적 요구사항**:
- 동시 사용자 1,000명 지원 (Vercel 자동 스케일링)[4]
- Edge Network를 통한 응답시간 1초 이내[4]
- 99.9% 가용성 보장 (Vercel + Supabase SLA)[4]
- PWA 오프라인 모드에서 기본 기능 동작[6]

**데이터베이스 요구사항**:
- Supabase PostgreSQL 기반 관계형 데이터 저장
- Row Level Security 정책 적용으로 사용자별 데이터 격리[8]
- Realtime Subscriptions로 실시간 데이터 동기화[4]
- Supabase Storage로 지도 이미지/첨부파일 관리

**보안 요구사항**:
- 모든 테이블에 RLS 활성화 필수[8]
- `auth.uid()` 기반 사용자별 접근 제어[7]
- Service Role Key는 서버 환경에만 노출[9]
- Vercel Environment Variables로 API Key 관리[3]

### 2.2 현실적 제한 요건

**시간적 제약**:
- 개발 기간: 1일 (MVP 데모 버전)
- 실제 API 연동 대신 목데이터 활용
- 핵심 기능 위주 Supabase 스키마 설계

**기술적 제약**:
- Next.js App Router + Server Components 우선 개발[2]
- 복잡한 AI 분석 대신 Supabase Functions 기반 규칙 로직
- PWA 기본 기능(오프라인 캐싱, 설치) 구현[6]

**비용적 제약**:
- Vercel Hobby Plan (무료 티어) 활용
- Supabase Free Tier (500MB DB, 1GB Storage)
- 공공데이터 포털 무료 API 사용

## 3. 설계의 내용

### 3.1 시스템 구성 (Vercel + Supabase 아키텍처)

```
┌─────────────────────────────────────────────────────────────┐
│                    클라이언트 계층                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Next.js 14   │  │ PWA Service  │  │ 반응형 UI    │      │
│  │ App Router   │  │ Worker       │  │ (Tailwind)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Vercel Edge Network (배포 플랫폼)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Next.js Server Components (RSC)                   │  │
│  │  • API Routes (서버리스 함수)                         │  │
│  │  • Middleware (Auth 토큰 새로고침)                    │  │
│  │  • Environment Variables (API Key 관리)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase (백엔드 플랫폼)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │ Edge        │  │ Realtime    │        │
│  │ + RLS       │  │ Functions   │  │ Subscriptions│       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Auth        │  │ Storage     │  │ Vector      │        │
## 8. 배포 워크플로우

### Vercel 자동 배포:[3][4]
1. GitHub 저장소 연동
2. `main` 브랜치 푸시 시 자동 배포
3. PR 생성 시 Preview 환경 자동 생성
4. Environment Variables 자동 주입

### Supabase 마이그레이션:[13]
```bash
# 로컬 개발
supabase start
supabase migration new init
supabase db push

# 프로덕션 배포
supabase link --project-ref xxxxx
supabase db push
```

이 PRD는 Vercel의 Edge Network와 Supabase의 관리형 백엔드를 활용하여 확장 가능하고 안전한 해양레저 자율신고 시스템을 구축합니다. RLS 기반 보안, PWA 오프라인 지원, Realtime 실시간 동기화를 통해 현대적인 풀스택 애플리케이션을 제공합니다.[2][1][8][4][6]

[1](https://fabwebstudio.com/blog/build-a-blazing-fast-scalable-app-with-next-js-and-supabase-step-by-step-tutorial)
[2](https://chat2db.ai/resources/blog/how-to-integrate-supabase-with-nextjs)
[3](https://developer.paddle.com/build/nextjs-supabase-vercel-starter-kit)
[4](https://uibakery.io/blog/vercel-vs-supabase)
[5](https://nextjs.org/docs/app/guides/progressive-web-apps)
[6](https://adropincalm.com/blog/nextjs-offline-service-worker/)
[7](https://prosperasoft.com/blog/database/how-to-manage-row-level-security-policies-effectively-in-supabase/)
[8](https://supabase.com/docs/guides/database/postgres/row-level-security)
[9](https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide)
[10](https://www.zestminds.com/blog/supabase-auth-nextjs-setup-guide/)
[11](https://dev.to/brayancodes/integrating-supabase-with-nextjs-a-step-by-step-guide-4ab)
[12](https://www.reddit.com/r/PWA/comments/16h1vmp/building_a_pwa_with_supabase/)
[13](https://supabase.com/docs/guides/getting-started/architecture)
[14](https://www.reddit.com/r/nextjs/comments/1hwd49d/the_best_way_to_use_supabase_with_vercel_nextjs/)
[15](https://www.youtube.com/watch?v=yLJIrvYapA0)
[16](https://leapcell.io/blog/ko/nextjs-js-pwa-ohpeonaen-gibileong-hwalyong-han-wep-aepeullikeisyeon-geotuchuk)
[17](https://github.com/vercel/next.js/discussions/82498)
[18](https://www.getfishtank.com/insights/building-native-like-offline-experience-in-nextjs-pwas)
[19](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/js13kGames/Offline_Service_workers)
[20](https://dev.to/stephengade/pwa-build-installable-nextjs-app-that-works-offline-3fff)