# 해양레저스포츠 AI 기반 자율신고제도 MVP - Vercel/Supabase/Next.js/PWA 기반 PRD

## 1. 설계의 목적 및 필요성

### 1.1 목적 및 필요성
**선정 동기**: 해양레저스포츠 참여자들이 직면하는 가장 큰 문제는 활동 지역에 대한 정확한 사전 정보 부족입니다. 이로 인해 선의의 레저활동자들이 의도치 않게 법규를 위반하거나 어업인들과 갈등을 겪는 사례가 빈번하게 발생하고 있습니다.

**주요 해결 방법**: AI 기반 통합 정보 분석 시스템을 통해 레저활동자가 사전에 활동 계획을 신고하면, Supabase Edge Functions와 공공기관 API를 연계하여 해당 지역의 법적 제약사항, 안전정보, 어업권 현황 등을 종합 분석해 맞춤형 정보를 제공합니다.[1][2]

**주요 기능**:
- 사전 자율신고 시스템 (Supabase PostgreSQL + RLS 기반)
- AI 기반 다중 API 통합 분석 (Edge Functions 활용)
- 실시간 안전 정보 제공 (Realtime Subscriptions)
- 지도 기반 시각적 안전구역 표시 (Kakao Map + Supabase Storage)
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
│  │ (인증)       │  │ (파일저장)   │  │ (AI 임베딩)  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   외부 API (공공데이터)                       │
│  • 해양수산부 API  • 해양경찰청 API  • 기상청 API            │
│  • Kakao Map API                                            │
└─────────────────────────────────────────────────────────────┘
```

**각 모듈 설명**:

**클라이언트 계층**:[2]
- Next.js 14 App Router: React Server Components 활용
- PWA Service Worker: 오프라인 캐싱 및 백그라운드 동기화[6]
- Tailwind CSS: 유틸리티 우선 스타일링

**Vercel 계층**:[3][4]
- Edge Network: 전 세계 CDN으로 저지연 배포
- Serverless Functions: API Routes 자동 스케일링
- Middleware: Supabase Auth 토큰 자동 갱신[10]

**Supabase 계층**:[1][4]
- PostgreSQL + RLS: 데이터베이스 레벨 보안[8]
- Edge Functions: 서버리스 비즈니스 로직 실행
- Realtime: WebSocket 기반 실시간 데이터 동기화
- Auth: 이메일/OAuth 인증 지원[10]
- Storage: 지도 오버레이 이미지, 첨부파일 저장

### 3.2 Supabase 데이터베이스 스키마

```sql
-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 자율신고 테이블
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  report_id TEXT UNIQUE NOT NULL,
  location_name TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  activity_type TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  participants INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('APPROVED', 'CAUTION', 'DENIED')),
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 안전구역 정보 테이블 (공개 데이터)
CREATE TABLE safety_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name TEXT NOT NULL,
  zone_type TEXT NOT NULL,
  boundary JSONB NOT NULL,
  restrictions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE safety_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view safety zones"
  ON safety_zones FOR SELECT
  TO authenticated
  USING (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
```

### 3.3 PWA 구성 (Service Worker + Offline Support)

**manifest.json**:[5]
```json
{
  "name": "해양레저 자율신고 시스템",
  "short_name": "해양신고",
  "description": "AI 기반 해양레저스포츠 안전 신고 플랫폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Service Worker 전략**:[6]
- **Cache First**: 정적 자산 (CSS, JS, 이미지)
- **Network First**: API 요청 (Supabase)
- **IndexedDB**: 오프라인 신고 데이터 임시 저장
- **Background Sync**: 온라인 복귀 시 Supabase로 동기화[12]

### 3.4 테스트 평가 방법

**성능 기준**:
- Vercel Analytics로 페이지 로드 시간 모니터링
- Lighthouse PWA 점수 90점 이상[6]
- Supabase 쿼리 응답 시간 500ms 이내

**보안 테스트**:[7]
```sql
-- RLS 정책 테스트
SET role authenticated;
SET request.jwt.claims.sub TO 'user-uuid-here';
SELECT * FROM reports; -- 본인 신고만 조회되는지 확인
RESET role;
```

**E2E 테스트 (Playwright)**:
```typescript
test('사용자가 오프라인에서 신고를 작성하고 온라인에서 동기화', async ({ page, context }) => {
  await page.goto('/');
  await context.setOffline(true);
  
  await page.fill('[data-testid=location]', '부산 해운대');
  await page.click('[data-testid=submit]');
  await expect(page.locator('text=오프라인 저장됨')).toBeVisible();
  
  await context.setOffline(false);
  await page.waitForTimeout(2000);
  await expect(page.locator('text=동기화 완료')).toBeVisible();
});
```

### 3.5 사용 도구

**프론트엔드**:[2]
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (Supabase 클라이언트 상태 관리)
- React Hook Form

**백엔드 (Supabase)**:[13][1]
- Supabase Client Library (`@supabase/supabase-js`)
- Supabase Auth Helpers for Next.js (`@supabase/auth-helpers-nextjs`)
- PostgreSQL + PostgREST
- Edge Functions (Deno runtime)

**PWA**:[6]
- Workbox (Service Worker 라이브러리)
- IndexedDB (오프라인 데이터 저장)
- Web Push API (푸시 알림)

**배포 및 인프라**:[3][4]
- Vercel (프론트엔드 + API Routes 배포)
- Supabase Cloud (백엔드 관리형 서비스)
- GitHub Actions (CI/CD)

## 4. 팀 구성 및 일정

| 역할 | 담당 업무 | 기술 스택 |
|------|----------|-----------|
| 풀스택 개발자 | -  Supabase 스키마 설계 및 RLS 정책<br/>-  Next.js 14 App Router 구현<br/>-  PWA Service Worker 개발<br/>-  Vercel 배포 및 환경 설정 | Next.js 14, TypeScript, Supabase, Tailwind CSS, PWA |

## 5. API 명세서

### 5.1 Supabase RPC Functions

**자율신고 접수**:
```sql
CREATE OR REPLACE FUNCTION submit_report(
  p_location_name TEXT,
  p_location_lat DECIMAL,
  p_location_lng DECIMAL,
  p_activity_type TEXT,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_participants INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_report_id TEXT;
  v_safety_score INTEGER;
  v_status TEXT;
BEGIN
  -- 신고 ID 생성
  v_report_id := 'RPT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('report_seq')::TEXT, 3, '0');
  
  -- 간단한 안전도 계산 (실제로는 Edge Function에서 수행)
  v_safety_score := 85;
  v_status := 'APPROVED';
  
  -- 신고 저장
  INSERT INTO reports (
    user_id, report_id, location_name, location_lat, location_lng,
    activity_type, start_time, end_time, participants,
    status, safety_score
  ) VALUES (
    auth.uid(), v_report_id, p_location_name, p_location_lat, p_location_lng,
    p_activity_type, p_start_time, p_end_time, p_participants,
    v_status, v_safety_score
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'report_id', v_report_id,
    'status', v_status,
    'safety_score', v_safety_score
  );
END;
$$;
```

### 5.2 Next.js API Routes (Supabase 클라이언트 사용)

**POST /api/report/submit**:[10]
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  const { data, error } = await supabase.rpc('submit_report', {
    p_location_name: body.location.name,
    p_location_lat: body.location.coordinates.lat,
    p_location_lng: body.location.coordinates.lng,
    p_activity_type: body.activity.type,
    p_start_time: body.activity.startTime,
    p_end_time: body.activity.endTime,
    p_participants: body.activity.participants
  });
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  
  return Response.json(data);
}
```

### 5.3 Realtime Subscriptions 클라이언트 코드

```typescript
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export function RealtimeReports() {
  const [reports, setReports] = useState([]);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('reports-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          setReports((current) => [...current, payload.new]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  
  return <div>{/* reports 렌더링 */}</div>;
}
```

## 6. 폴더 구조 (Vercel + Supabase 최적화)

```
marine-leisure-report/
├── README.md
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .env.local                        # Supabase 환경변수
│   # NEXT_PUBLIC_SUPABASE_URL=
│   # NEXT_PUBLIC_SUPABASE_ANON_KEY=
│   # SUPABASE_SERVICE_ROLE_KEY=     # 서버 전용
├── .gitignore
├── middleware.ts                     # Supabase Auth 미들웨어
├── supabase/
│   ├── migrations/                   # DB 마이그레이션
│   │   └── 20250119_init.sql
│   ├── functions/                    # Edge Functions
│   │   └── analyze-safety/
│   │       └── index.ts
│   └── config.toml                   # Supabase 로컬 설정
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # 홈 (신고 입력)
│   │   ├── login/
│   │   │   └── page.tsx              # Supabase Auth 로그인
│   │   ├── report/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── report/
│   │       │   └── submit/
│   │       │       └── route.ts      # Supabase RPC 호출
│   │       └── auth/
│   │           └── callback/
│   │               └── route.ts      # OAuth 콜백
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   │   └── ReportForm.tsx
│   │   ├── map/
│   │   │   └── MapView.tsx
│   │   └── realtime/
│   │       └── RealtimeAlerts.tsx    # Supabase Realtime
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # 클라이언트용
│   │   │   ├── server.ts             # 서버 컴포넌트용
│   │   │   └── middleware.ts         # 미들웨어용
│   │   ├── services/
│   │   │   └── reportService.ts
│   │   └── hooks/
│   │       ├── useSupabase.ts
│   │       └── useRealtimeReports.ts
│   └── types/
│       └── database.types.ts         # Supabase CLI 자동생성
├── public/
│   ├── manifest.json                 # PWA 매니페스트
│   ├── sw.js                         # Service Worker
│   └── icons/
├── __tests__/
└── docs/
```

## 7. 환경 변수 설정 (Vercel)

**`.env.local`**:[3][10]
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # 서버 전용, 절대 클라이언트 노출 금지

# Kakao Map
NEXT_PUBLIC_KAKAO_MAP_KEY=your-kakao-key
```

**Vercel Dashboard 설정**:[3]
- Production / Preview / Development 환경별로 동일하게 설정
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 환경에만 추가

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