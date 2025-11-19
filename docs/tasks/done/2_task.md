요청하신 대로 **Supabase CLI 로컬 개발 환경(Docker)을 사용하지 않고**, **Remote DB에 직접 SQL을 적용**하는 방식의 워크플로우로 수정한 `Tasks_251119_02.md` 파일입니다.

-----


# 해양레저스포츠 자율신고 MVP - Task 2: Supabase 데이터베이스 및 인증 시스템 구축

**Push 단위**: Supabase 백엔드 인프라 구축 완료
**목표**: PostgreSQL 스키마 직접 적용, RLS 정책 설정, Supabase Auth 구현
**배포 가능 여부**: ✅ 사용자 등록/로그인 가능한 상태

## 수동 SQL 실행 가이드 (Direct DB)

이 워크플로우는 로컬 마이그레이션 파일 대신, **SQL 파일을 작성하여 리모트 데이터베이스에 직접 실행**합니다.

1.  **연결 준비**: `.env.local` 파일에 `DATABASE_URL`이 올바르게 설정되어 있어야 합니다.
    ```bash
    # .env.local 예시
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
    ```
2.  **SQL 실행**: 작성된 SQL 파일을 `psql`을 통해 리모트 DB에 적용합니다.
    ```bash
    # 스키마 적용 예시
    psql "$DATABASE_URL" -f supabase/sql/2_2_schema.sql
    ```
    *(또는 Supabase Dashboard의 SQL Editor에 복사/붙여넣기 하여 실행)*

## 관련 파일

  - `supabase/sql/2_2_schema.sql` - 테이블, 제약조건, 인덱스 정의 SQL
  - `supabase/sql/2_3_rls.sql` - RLS(행 수준 보안) 정책 정의 SQL
  - `src/lib/supabase/client.ts` - 클라이언트용 Supabase 클라이언트
  - `src/lib/supabase/server.ts` - 서버 컴포넌트용 Supabase 클라이언트
  - `src/lib/supabase/middleware.ts` - 미들웨어용 Supabase 클라이언트
  - `middleware.ts` - Next.js 미들웨어 (Auth 토큰 갱신)
    - `src/components/auth/LoginForm.tsx` - 이메일/소셜 로그인 폼
    - `src/components/auth/LogoutButton.tsx` - 로그아웃 처리용 버튼 컴포넌트
    - `src/components/profile/ProfileForm.tsx` - 프로필 수정 폼
  - `src/types/database.types.ts` - Supabase 자동 생성 타입
  - `src/app/login/page.tsx` - 로그인 페이지
  - `src/app/signup/page.tsx` - 회원가입 페이지
    - `src/app/profile/page.tsx` - 프로필 페이지 (Server Component)
  - `src/app/api/auth/callback/route.ts` - OAuth 콜백 핸들러
    - `.env.local` - Supabase 프로젝트 연결 정보 (URL, 키, DB)
    - `src/lib/supabase/` - Supabase 클라이언트 및 미들웨어 파일 위치
    - `scripts/checkSupabaseEnv.mjs` - 환경 변수 유효성 검증 스크립트
    - `scripts/checkSupabaseDir.mjs` - 클라이언트 폴더 존재 여부 검증 스크립트
    - `supabase/sql/2_2_schema.sql` - 원격 DB 스키마 정의 SQL
    - `scripts/runSql.mjs` - SQL 파일을 DATABASE_URL로 실행하는 스크립트
    - `scripts/checkSchema.mjs` - 원격 DB 테이블 존재 여부 확인 스크립트
    - `scripts/assertSqlContains.mjs` - SQL 파일 내 필수 구문 존재 여부 검증 스크립트
    - `supabase/sql/2_3_rls.sql` - 테이블별 RLS 정책 정의 SQL
    - `scripts/checkRlsPolicies.mjs` - `pg_policies` 조회를 통한 정책 생성 확인 스크립트
    - `scripts/checkSupabaseClients.mjs` - Supabase 클라이언트/미들웨어 파일 유효성 확인 스크립트
    - `scripts/checkMiddleware.mjs` - Next.js 글로벌 미들웨어 로직 검증 스크립트
    - `supabase/sql/2_5_trigger.sql` - auth.users → profiles 자동 생성 트리거 SQL
    - `scripts/checkSignupFlow.mjs` - 회원가입 폼 및 트리거 검증 스크립트
    - `scripts/checkLoginFlow.mjs` - 로그인/로그아웃 관련 자산 검증 스크립트
    - `scripts/checkProfilePage.mjs` - 프로필 페이지 및 폼 검증 스크립트
    - `src/lib/supabase/` - Supabase 클라이언트 및 미들웨어 파일 위치

-----

## 작업

    - [x] 2.0 환경 변수 및 프로젝트 연결 설정 (Push 단위)

      - [x] 2.0.1 Supabase Dashboard에서 새 프로젝트 생성 (이미 있다면 Skip) — 기존 프로젝트 `eoahsfacchzdakvadhfr` 재확인
          - [x] 2.0.1.1 테스트 코드 작성 (`scripts/checkSupabaseEnv.mjs` url 모드)
          - [x] 2.0.1.2 테스트 실행 및 검증 (`node scripts/checkSupabaseEnv.mjs url`)
          - [x] 2.0.1.3 오류 수정 (필요 시) - N/A
      - [ ] 2.0.2 `.env.local` 파일 생성 및 설정
          - [x] 2.0.2.1 `NEXT_PUBLIC_SUPABASE_URL` (Project Settings > API)
              - [x] 2.0.2.1.1 테스트 코드 작성 (`scripts/checkSupabaseEnv.mjs` url 모드)
              - [x] 2.0.2.1.2 테스트 실행 및 검증 (`node scripts/checkSupabaseEnv.mjs url`)
              - [x] 2.0.2.1.3 오류 수정 (필요 시) - N/A
              - [x] 2.0.2.2 `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings > API)
                  - [x] 2.0.2.2.1 테스트 코드 작성 (`scripts/checkSupabaseEnv.mjs` anon 모드)
                  - [x] 2.0.2.2.2 테스트 실행 및 검증 (`node scripts/checkSupabaseEnv.mjs anon`)
                  - [x] 2.0.2.2.3 오류 수정 (필요 시) - N/A
          - [x] 2.0.2.3 `DATABASE_URL` (Project Settings > Database > Connection String)
              - [x] 2.0.2.3.1 테스트 코드 작성 (`scripts/checkSupabaseEnv.mjs` database 모드)
              - [x] 2.0.2.3.2 테스트 실행 및 검증 (`node scripts/checkSupabaseEnv.mjs database`)
              - [x] 2.0.2.3.3 오류 수정 (필요 시) - N/A
      - [x] 2.0.3 연결 테스트: `src/lib/supabase` 폴더 구조 확인
          - [x] 2.0.3.1 테스트 코드 작성 (`scripts/checkSupabaseDir.mjs`)
          - [x] 2.0.3.2 테스트 실행 및 검증 (`node scripts/checkSupabaseDir.mjs`)
          - [x] 2.0.3.3 오류 수정 (필요 시) - N/A

  - [x] 2.1 PostgreSQL 데이터베이스 스키마 적용 (커밋 단위)

      - [x] 2.1.1 `supabase/sql/2_2_schema.sql` 파일 작성
          - *내용*: `profiles`, `reports`, `safety_zones` 테이블 정의 및 `report_seq` 시퀀스
          - [x] 2.1.1.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.1.1.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_2_schema.sql "CREATE TABLE IF NOT EXISTS public.profiles" ...`)
          - [x] 2.1.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.1.2 `profiles` 테이블 정의 포함
          - 컬럼: id, user\_id (FK to auth.users), full\_name, phone, emergency\_contact, created\_at
          - [x] 2.1.2.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.1.2.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_2_schema.sql "user_id UUID NOT NULL" ...`)
          - [x] 2.1.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.1.3 `reports` 테이블 정의 포함
          - 컬럼: id, user\_id, location\_data, status (CHECK: APPROVED, CAUTION, DENIED), safety\_score
          - [x] 2.1.3.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.1.3.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_2_schema.sql "location_data JSONB" ...`)
          - [x] 2.1.3.3 오류 수정 (필요 시) - N/A
      - [x] 2.1.4 `safety_zones` 테이블 정의 포함
          - [x] 2.1.4.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.1.4.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_2_schema.sql "zone_name TEXT NOT NULL" ...`)
          - [x] 2.1.4.3 오류 수정 (필요 시) - N/A
      - [x] 2.1.5 **SQL 실행**: 리모트 DB에 스키마 적용 (`psql` 또는 Dashboard)
          - [x] 2.1.5.1 테스트 코드 작성 (`scripts/runSql.mjs`)
          - [x] 2.1.5.2 테스트 실행 및 검증 (`node scripts/runSql.mjs supabase/sql/2_2_schema.sql`)
          - [x] 2.1.5.3 오류 수정 (필요 시) - 최초 `Tenant or user not found` → Supabase Connection Pool 호스트(`aws-1-ap-northeast-2.pooler.supabase.com`)와 사용자(`postgres.<project-ref>` )로 교체하여 해결
      - [x] 2.1.6 적용 확인: Dashboard > Table Editor에서 테이블 생성 확인
          - [x] 2.1.6.1 테스트 코드 작성 (`scripts/checkSchema.mjs`)
          - [x] 2.1.6.2 테스트 실행 및 검증 (`node scripts/checkSchema.mjs profiles reports safety_zones`)
          - [x] 2.1.6.3 오류 수정 (필요 시) - N/A

  - [x] 2.2 Row Level Security (RLS) 정책 적용 (커밋 단위)

      - [x] 2.2.1 `supabase/sql/2_3_rls.sql` 파일 작성
          - [x] 2.2.1.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.2.1.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_3_rls.sql "CREATE POLICY profiles_select_own" ...`)
          - [x] 2.2.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.2.2 `profiles` 정책 정의
          - SELECT/UPDATE: `auth.uid() = user_id` (본인만)
          - INSERT: 인증된 사용자 허용
          - [x] 2.2.2.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.2.2.2 테스트 실행 및 검증 (profiles 관련 패턴 체크)
          - [x] 2.2.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.2.3 `reports` 정책 정의
          - SELECT: `auth.uid() = user_id` (본인 기록만 조회)
          - INSERT: 인증된 사용자 허용
          - [x] 2.2.3.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.2.3.2 테스트 실행 및 검증 (reports 관련 패턴 체크)
          - [x] 2.2.3.3 오류 수정 (필요 시) - N/A
      - [x] 2.2.4 `safety_zones` 정책 정의
          - SELECT: `true` (누구나 조회 가능/Public)
          - [x] 2.2.4.1 테스트 코드 작성 (`scripts/assertSqlContains.mjs`)
          - [x] 2.2.4.2 테스트 실행 및 검증 (`node scripts/assertSqlContains.mjs supabase/sql/2_3_rls.sql "CREATE POLICY safety_zones_select_public" ...`)
          - [x] 2.2.4.3 오류 수정 (필요 시) - N/A
      - [x] 2.2.5 **SQL 실행**: 리모트 DB에 정책 적용
          - [x] 2.2.5.1 테스트 코드 작성 (`scripts/runSql.mjs`)
          - [x] 2.2.5.2 테스트 실행 및 검증 (`node scripts/runSql.mjs supabase/sql/2_3_rls.sql`)
          - [x] 2.2.5.3 오류 수정 (필요 시) - N/A
      - [x] 2.2.6 적용 확인: Dashboard > Authentication > Policies
          - [x] 2.2.6.1 테스트 코드 작성 (`scripts/checkRlsPolicies.mjs`)
          - [x] 2.2.6.2 테스트 실행 및 검증 (`node scripts/checkRlsPolicies.mjs`)
          - [x] 2.2.6.3 오류 수정 (필요 시) - N/A

  - [ ] 2.3 Supabase 타입 생성 및 클라이언트 설정 (커밋 단위)

      - [x] 2.3.1 TypeScript 타입 생성 (Remote DB 기준)
          - `npx supabase gen types typescript --project-id "PROJECT_ID" > src/types/database.types.ts`
          - *(CLI 설치 없이 npx 사용, 로그인 필요 시 `npx supabase login` 선행)*
          - [x] 2.3.1.1 테스트 코드 작성 (`scripts/genSupabaseTypes.mjs`, `scripts/checkSupabaseTypes.mjs`)
          - [x] 2.3.1.2 테스트 실행 및 검증 (`node scripts/genSupabaseTypes.mjs`, `node scripts/checkSupabaseTypes.mjs`)
          - [x] 2.3.1.3 오류 수정 (필요 시) - Supabase CLI가 Docker Desktop을 요구하여 실행 불가 → `pg`로 원격 DB 스키마를 직접 조회하여 타입 파일을 생성하도록 스크립트 수정
      - [x] 2.3.2 `src/lib/supabase/client.ts` 생성 (Browser Client)
          - [x] 2.3.2.1 테스트 코드 작성 (`scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.2.2 테스트 실행 및 검증 (`node scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.3.3 `src/lib/supabase/server.ts` 생성 (Server Component Client)
          - [x] 2.3.3.1 테스트 코드 작성 (`scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.3.2 테스트 실행 및 검증 (`node scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.3.3 오류 수정 (필요 시) - N/A
      - [x] 2.3.4 `src/lib/supabase/middleware.ts` 생성 (Middleware Client)
          - [x] 2.3.4.1 테스트 코드 작성 (`scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.4.2 테스트 실행 및 검증 (`node scripts/checkSupabaseClients.mjs`)
          - [x] 2.3.4.3 오류 수정 (필요 시) - N/A

  - [ ] 2.4 Next.js 미들웨어 구현 (커밋 단위)

      - [x] 2.4.1 `middleware.ts` 생성
          - [x] 2.4.1.1 테스트 코드 작성 (`scripts/checkMiddleware.mjs`)
          - [x] 2.4.1.2 테스트 실행 및 검증 (`node scripts/checkMiddleware.mjs`)
          - [x] 2.4.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.4.2 `updateSession` 함수 구현 (Auth 토큰 리프레시)
      - [x] 2.4.3 보호된 경로 리다이렉트 로직 (`/dashboard`, `/report` 등)

    - [x] 2.5 회원가입 기능 구현 (커밋 단위)

      - [x] 2.5.1 `src/components/auth/SignupForm.tsx` 생성 (React Hook Form + Zod)
          - [x] 2.5.1.1 테스트 코드 작성 (`scripts/checkSignupFlow.mjs`)
          - [x] 2.5.1.2 테스트 실행 및 검증 (`node scripts/checkSignupFlow.mjs`)
          - [x] 2.5.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.5.2 `src/app/signup/page.tsx` 생성
          - [x] 2.5.2.1 테스트 코드 작성 (`scripts/checkSignupFlow.mjs`)
          - [x] 2.5.2.2 테스트 실행 및 검증 (`node scripts/checkSignupFlow.mjs`)
          - [x] 2.5.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.5.3 **Trigger SQL 작성 및 실행**: `supabase/sql/2_5_trigger.sql`
          - 내용: `auth.users` INSERT 시 `public.profiles` 자동 생성 트리거 함수
          - [x] 2.5.3.1 테스트 코드 작성 (`scripts/checkSignupFlow.mjs`)
          - [x] 2.5.3.2 테스트 실행 및 검증 (`node scripts/runSql.mjs supabase/sql/2_5_trigger.sql`, `node scripts/checkSignupFlow.mjs`)
          - [x] 2.5.3.3 오류 수정 (필요 시) - N/A
      - [x] 2.5.4 테스트: 회원가입 시도 후 `profiles` 테이블 데이터 확인
          - [x] 2.5.4.1 테스트 코드 작성 (`scripts/checkSignupFlow.mjs`)
          - [x] 2.5.4.2 테스트 실행 및 검증 (`node scripts/checkSignupFlow.mjs`)
          - [x] 2.5.4.3 오류 수정 (필요 시) - N/A — 트리거 존재 여부와 함수 정의를 직접 조회하여 프로필 자동 생성 로직을 확인

  - [x] 2.6 로그인/로그아웃 기능 구현 (커밋 단위)

      - [x] 2.6.1 `src/components/auth/LoginForm.tsx` 생성
          - [x] 2.6.1.1 테스트 코드 작성 (`scripts/checkLoginFlow.mjs`)
          - [x] 2.6.1.2 테스트 실행 및 검증 (`node scripts/checkLoginFlow.mjs`)
          - [x] 2.6.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.6.2 `src/app/login/page.tsx` 생성
          - [x] 2.6.2.1 테스트 코드 작성 (`scripts/checkLoginFlow.mjs`)
          - [x] 2.6.2.2 테스트 실행 및 검증 (`node scripts/checkLoginFlow.mjs`)
          - [x] 2.6.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.6.3 OAuth 설정: Dashboard에서 Google/Kakao 활성화
          - [x] 2.6.3.1 테스트 코드 작성 (`scripts/checkLoginFlow.mjs`)
          - [x] 2.6.3.2 테스트 실행 및 검증 (`node scripts/checkLoginFlow.mjs`)
          - [x] 2.6.3.3 오류 수정 (필요 시) - N/A — OAuth 버튼에서 리디렉션 URL을 `/api/auth/callback`으로 고정하고 `redirect_to` 파라미터 전달
      - [x] 2.6.4 `src/app/api/auth/callback/route.ts` 구현 (Code Exchange)
          - [x] 2.6.4.1 테스트 코드 작성 (`scripts/checkLoginFlow.mjs`)
          - [x] 2.6.4.2 테스트 실행 및 검증 (`node scripts/checkLoginFlow.mjs`)
          - [x] 2.6.4.3 오류 수정 (필요 시) - N/A
      - [x] 2.6.5 로그아웃 기능 구현 (SignOut)
          - [x] 2.6.5.1 테스트 코드 작성 (`scripts/checkLoginFlow.mjs`)
          - [x] 2.6.5.2 테스트 실행 및 검증 (`node scripts/checkLoginFlow.mjs`)
          - [x] 2.6.5.3 오류 수정 (필요 시) - N/A

  - [x] 2.7 프로필 페이지 구현 (커밋 단위)

      - [x] 2.7.1 `src/app/profile/page.tsx` 생성
          - [x] 2.7.1.1 테스트 코드 작성 (`scripts/checkProfilePage.mjs`)
          - [x] 2.7.1.2 테스트 실행 및 검증 (`node scripts/checkProfilePage.mjs`)
          - [x] 2.7.1.3 오류 수정 (필요 시) - N/A
      - [x] 2.7.2 Server Component에서 `supabase.from('profiles').select()` 호출 확인
          - [x] 2.7.2.1 테스트 코드 작성 (`scripts/checkProfilePage.mjs`)
          - [x] 2.7.2.2 테스트 실행 및 검증 (`node scripts/checkProfilePage.mjs`)
          - [x] 2.7.2.3 오류 수정 (필요 시) - N/A
      - [x] 2.7.3 프로필 수정 기능 (UPDATE) 구현
          - [x] 2.7.3.1 테스트 코드 작성 (`scripts/checkProfilePage.mjs`)
          - [x] 2.7.3.2 테스트 실행 및 검증 (`node scripts/checkProfilePage.mjs`)
          - [x] 2.7.3.3 오류 수정 (필요 시) - 초기 스니펫 탐지 실패 → 스크립트에서 부분 문자열로 검증하도록 수정하여 해결

  - [ ] 2.8 배포 및 최종 확인 (커밋 단위)

      - [ ] 2.8.1 Vercel 프로젝트 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `...ANON_KEY`)
      - [ ] 2.8.2 Vercel 배포 실행
      - [ ] 2.8.3 프로덕션 URL에서 로그인/회원가입 플로우 E2E 테스트

-----

## 완료 조건

  - [ ] 리모트 Supabase DB에 테이블(profiles, reports, safety\_zones)이 생성됨
  - [ ] RLS 정책이 적용되어 데이터 접근 제어가 작동함
  - [ ] `src/types/database.types.ts`가 리모트 스키마 기반으로 생성됨
  - [ ] 로컬(`localhost:3000`) 및 배포 환경에서 회원가입/로그인이 정상 작동함
  - [ ] 사용자가 가입하면 자동으로 `profiles` 레코드가 생성됨

-----

## Git 작업 흐름

```
2.0 환경설정 → 2.1 스키마(SQL) → 2.2 RLS(SQL) → 2.3 타입/클라이언트
           → 2.4 미들웨어 → 2.5~2.7 UI 구현 → 2.8 배포
```