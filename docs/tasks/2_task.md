# Tasks_251119_02.md
# 해양레저스포츠 자율신고 MVP - Task 2: Supabase 데이터베이스 및 인증 시스템 구축

**Push 단위**: Supabase 백엔드 인프라 구축 완료  
**목표**: PostgreSQL 스키마, RLS 정책, Supabase Auth 구현  
**배포 가능 여부**: ✅ 사용자 등록/로그인 가능한 상태

---
구글 ,카카오, email 로그인 수파베이스 연동완료
우선 수파베이스랑 연동할 local env파일을 만들어

## 관련 파일
- `supabase/migrations/20251119_init.sql` - 초기 DB 스키마 및 RLS 정책
- `supabase/config.toml` - Supabase 로컬 설정
- `src/lib/supabase/client.ts` - 클라이언트용 Supabase 클라이언트
- `src/lib/supabase/server.ts` - 서버 컴포넌트용 Supabase 클라이언트
- `src/lib/supabase/middleware.ts` - 미들웨어용 Supabase 클라이언트
- `middleware.ts` - Next.js 미들웨어 (Auth 토큰 갱신)
- `src/types/database.types.ts` - Supabase 자동 생성 타입
- `src/app/login/page.tsx` - 로그인 페이지
- `src/app/signup/page.tsx` - 회원가입 페이지
- `src/app/api/auth/callback/route.ts` - OAuth 콜백 핸들러
- `src/components/auth/LoginForm.tsx` - 로그인 폼 컴포넌트
- `src/components/auth/SignupForm.tsx` - 회원가입 폼 컴포넌트
- `src/lib/hooks/useAuth.ts` - 인증 관련 커스텀 훅

---

## 작업

- [ ] 2.0 Supabase 프로젝트 초기화 및 로컬 개발 환경 설정 (Push 단위)
    - [ ] 2.1 Supabase 프로젝트 생성 및 CLI 설정 (커밋 단위)
        - [ ] 2.1.1 Supabase Cloud에서 새 프로젝트 생성
        - [ ] 2.1.2 Supabase CLI 설치: `npm install -g supabase`
        - [ ] 2.1.3 프로젝트 연동: `supabase link --project-ref [PROJECT_REF]`
        - [ ] 2.1.4 로컬 개발 환경 시작: `supabase start`
        - [ ] 2.1.5 `supabase/config.toml` 생성 및 설정
        - [ ] 2.1.6 테스트 코드 작성: Supabase CLI 연결 테스트
        - [ ] 2.1.7 테스트 실행 및 검증: `supabase status` 확인
        - [ ] 2.1.8 오류 수정 (필요 시): Docker 설정 문제 해결

    - [ ] 2.2 PostgreSQL 데이터베이스 스키마 설계 및 마이그레이션 (커밋 단위)
        - [ ] 2.2.1 마이그레이션 파일 생성: `supabase migration new init`
        - [ ] 2.2.2 `profiles` 테이블 생성
            - [ ] 2.2.2.1 SQL 작성: id, user_id, full_name, phone, emergency_contact, created_at, updated_at
            - [ ] 2.2.2.2 user_id를 auth.users와 FK 연결
            - [ ] 2.2.2.3 테스트 코드 작성: 테이블 생성 확인 쿼리
            - [ ] 2.2.2.4 테스트 실행 및 검증
            - [ ] 2.2.2.5 오류 수정 (필요 시)
        - [ ] 2.2.3 `reports` 테이블 생성
            - [ ] 2.2.3.1 SQL 작성: id, user_id, report_id, location_name, location_lat, location_lng, activity_type, start_time, end_time, participants, status, safety_score, analysis_data (JSONB), created_at, updated_at
            - [ ] 2.2.3.2 CHECK 제약조건 추가: status IN ('APPROVED', 'CAUTION', 'DENIED')
            - [ ] 2.2.3.3 CHECK 제약조건 추가: safety_score BETWEEN 0 AND 100
            - [ ] 2.2.3.4 테스트 코드 작성
            - [ ] 2.2.3.5 테스트 실행 및 검증
            - [ ] 2.2.3.6 오류 수정 (필요 시)
        - [ ] 2.2.4 `safety_zones` 테이블 생성
            - [ ] 2.2.4.1 SQL 작성: id, zone_name, zone_type, boundary (JSONB), restrictions (JSONB), created_at
            - [ ] 2.2.4.2 테스트 코드 작성
            - [ ] 2.2.4.3 테스트 실행 및 검증
            - [ ] 2.2.4.4 오류 수정 (필요 시)
        - [ ] 2.2.5 시퀀스 생성: `report_seq` (신고 ID 생성용)
            - [ ] 2.2.5.1 테스트 코드 작성
            - [ ] 2.2.5.2 테스트 실행 및 검증
            - [ ] 2.2.5.3 오류 수정 (필요 시)
        - [ ] 2.2.6 마이그레이션 적용: `supabase db push`
            - [ ] 2.2.6.1 테스트 코드 작성: 모든 테이블 존재 확인
            - [ ] 2.2.6.2 테스트 실행 및 검증
            - [ ] 2.2.6.3 오류 수정 (필요 시): 마이그레이션 실패 롤백

    - [ ] 2.3 Row Level Security (RLS) 정책 구현 (커밋 단위)
        - [ ] 2.3.1 `profiles` 테이블 RLS 활성화 및 정책 생성
            - [ ] 2.3.1.1 RLS 활성화: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`
            - [ ] 2.3.1.2 SELECT 정책: 사용자는 자신의 프로필만 조회 (`auth.uid() = user_id`)
            - [ ] 2.3.1.3 UPDATE 정책: 사용자는 자신의 프로필만 수정
            - [ ] 2.3.1.4 INSERT 정책: 인증된 사용자만 프로필 생성 가능
            - [ ] 2.3.1.5 테스트 코드 작성: RLS 정책 검증 SQL
            - [ ] 2.3.1.6 테스트 실행 및 검증
            - [ ] 2.3.1.7 오류 수정 (필요 시)
        - [ ] 2.3.2 `reports` 테이블 RLS 정책 생성
            - [ ] 2.3.2.1 RLS 활성화
            - [ ] 2.3.2.2 SELECT 정책: 사용자는 자신의 신고만 조회
            - [ ] 2.3.2.3 INSERT 정책: 인증된 사용자만 신고 생성
            - [ ] 2.3.2.4 테스트 코드 작성
            - [ ] 2.3.2.5 테스트 실행 및 검증
            - [ ] 2.3.2.6 오류 수정 (필요 시)
        - [ ] 2.3.3 `safety_zones` 테이블 RLS 정책 (공개 데이터)
            - [ ] 2.3.3.1 RLS 활성화
            - [ ] 2.3.3.2 SELECT 정책: 모든 인증 사용자 조회 가능 (`USING (true)`)
            - [ ] 2.3.3.3 테스트 코드 작성
            - [ ] 2.3.3.4 테스트 실행 및 검증
            - [ ] 2.3.3.5 오류 수정 (필요 시)

    - [ ] 2.4 Supabase 타입 생성 및 클라이언트 설정 (커밋 단위)
        - [ ] 2.4.1 TypeScript 타입 자동 생성: `supabase gen types typescript --local > src/types/database.types.ts`
        - [ ] 2.4.2 `src/lib/supabase/client.ts` 생성 - 클라이언트용 Supabase 클라이언트
            - [ ] 2.4.2.1 `createClientComponentClient` 사용
            - [ ] 2.4.2.2 타입 파라미터 추가 (Database)
            - [ ] 2.4.2.3 테스트 코드 작성
            - [ ] 2.4.2.4 테스트 실행 및 검증
            - [ ] 2.4.2.5 오류 수정 (필요 시)
        - [ ] 2.4.3 `src/lib/supabase/server.ts` 생성 - 서버 컴포넌트용
            - [ ] 2.4.3.1 `createServerComponentClient` 사용
            - [ ] 2.4.3.2 cookies 헬퍼 import
            - [ ] 2.4.3.3 테스트 코드 작성
            - [ ] 2.4.3.4 테스트 실행 및 검증
            - [ ] 2.4.3.5 오류 수정 (필요 시)
        - [ ] 2.4.4 `src/lib/supabase/middleware.ts` 생성 - 미들웨어용
            - [ ] 2.4.4.1 `createMiddlewareClient` 사용
            - [ ] 2.4.4.2 테스트 코드 작성
            - [ ] 2.4.4.3 테스트 실행 및 검증
            - [ ] 2.4.4.4 오류 수정 (필요 시)

    - [ ] 2.5 Next.js 미들웨어 구현 (Auth 토큰 갱신) (커밋 단위)
        - [ ] 2.5.1 `middleware.ts` 생성
        - [ ] 2.5.2 Supabase Auth 토큰 자동 갱신 로직 구현
        - [ ] 2.5.3 보호된 경로 설정 (`/dashboard`, `/report` 등)
        - [ ] 2.5.4 인증되지 않은 사용자 리다이렉트 처리
        - [ ] 2.5.5 테스트 코드 작성: 미들웨어 동작 테스트
        - [ ] 2.5.6 테스트 실행 및 검증
        - [ ] 2.5.7 오류 수정 (필요 시)

    - [ ] 2.6 회원가입 페이지 및 기능 구현 (커밋 단위)
        - [ ] 2.6.1 `src/app/signup/page.tsx` 생성
        - [ ] 2.6.2 `src/components/auth/SignupForm.tsx` 생성
            - [ ] 2.6.2.1 폼 필드: 이메일, 비밀번호, 비밀번호 확인, 이름, 전화번호
            - [ ] 2.6.2.2 React Hook Form + Zod 검증
            - [ ] 2.6.2.3 Supabase Auth signUp 호출
            - [ ] 2.6.2.4 에러 처리 및 사용자 피드백
            - [ ] 2.6.2.5 테스트 코드 작성: 회원가입 폼 제출 테스트
            - [ ] 2.6.2.6 테스트 실행 및 검증
            - [ ] 2.6.2.7 오류 수정 (필요 시)
        - [ ] 2.6.3 회원가입 성공 시 프로필 자동 생성 트리거 (SQL)
            - [ ] 2.6.3.1 `CREATE TRIGGER` 작성: auth.users INSERT 시 profiles 테이블에 레코드 생성
            - [ ] 2.6.3.2 테스트 코드 작성
            - [ ] 2.6.3.3 테스트 실행 및 검증
            - [ ] 2.6.3.4 오류 수정 (필요 시)

    - [ ] 2.7 로그인 페이지 및 기능 구현 (커밋 단위)
        - [ ] 2.7.1 `src/app/login/page.tsx` 생성
        - [ ] 2.7.2 `src/components/auth/LoginForm.tsx` 생성
            - [ ] 2.7.2.1 폼 필드: 이메일, 비밀번호
            - [ ] 2.7.2.2 Supabase Auth signInWithPassword 호출
            - [ ] 2.7.2.3 로그인 성공 시 대시보드로 리다이렉트
            - [ ] 2.7.2.4 에러 처리 (잘못된 자격증명)
            - [ ] 2.7.2.5 테스트 코드 작성
            - [ ] 2.7.2.6 테스트 실행 및 검증
            - [ ] 2.7.2.7 오류 수정 (필요 시)
        - [ ] 2.7.3 "비밀번호 찾기" 기능 추가
            - [ ] 2.7.3.1 Supabase Auth resetPasswordForEmail 호출
            - [ ] 2.7.3.2 테스트 코드 작성
            - [ ] 2.7.3.3 테스트 실행 및 검증
            - [ ] 2.7.3.4 오류 수정 (필요 시)

    - [ ] 2.8 OAuth 로그인 구현 (Google, Kakao) (커밋 단위)
        - [ ] 2.8.1 Supabase Dashboard에서 OAuth 제공자 설정
        - [ ] 2.8.2 `src/app/api/auth/callback/route.ts` 생성 - OAuth 콜백 핸들러
        - [ ] 2.8.3 로그인 폼에 OAuth 버튼 추가
            - [ ] 2.8.3.1 Google 로그인 버튼
            - [ ] 2.8.3.2 Kakao 로그인 버튼
            - [ ] 2.8.3.3 signInWithOAuth 호출
            - [ ] 2.8.3.4 테스트 코드 작성
            - [ ] 2.8.3.5 테스트 실행 및 검증
            - [ ] 2.8.3.6 오류 수정 (필요 시)

    - [ ] 2.9 로그아웃 기능 구현 (커밋 단위)
        - [ ] 2.9.1 `src/app/api/auth/logout/route.ts` 생성
        - [ ] 2.9.2 Supabase Auth signOut 호출
        - [ ] 2.9.3 헤더에 로그아웃 버튼 추가
        - [ ] 2.9.4 로그아웃 후 홈페이지로 리다이렉트
        - [ ] 2.9.5 테스트 코드 작성
        - [ ] 2.9.6 테스트 실행 및 검증
        - [ ] 2.9.7 오류 수정 (필요 시)

    - [ ] 2.10 인증 상태 관리 커스텀 훅 (커밋 단위)
        - [ ] 2.10.1 `src/lib/hooks/useAuth.ts` 생성
        - [ ] 2.10.2 현재 사용자 정보 반환 (`user`, `session`)
        - [ ] 2.10.3 로딩 상태 관리
        - [ ] 2.10.4 인증 상태 변경 감지 (onAuthStateChange)
        - [ ] 2.10.5 테스트 코드 작성
        - [ ] 2.10.6 테스트 실행 및 검증
        - [ ] 2.10.7 오류 수정 (필요 시)

    - [ ] 2.11 프로필 페이지 구현 (커밋 단위)
        - [ ] 2.11.1 `src/app/profile/page.tsx` 생성
        - [ ] 2.11.2 사용자 프로필 조회 (profiles 테이블)
        - [ ] 2.11.3 프로필 수정 폼
            - [ ] 2.11.3.1 이름, 전화번호, 응급연락처 수정
            - [ ] 2.11.3.2 Supabase UPDATE 쿼리
            - [ ] 2.11.3.3 낙관적 업데이트 (Optimistic Update)
            - [ ] 2.11.3.4 테스트 코드 작성
            - [ ] 2.11.3.5 테스트 실행 및 검증
            - [ ] 2.11.3.6 오류 수정 (필요 시)

    - [ ] 2.12 Supabase 프로덕션 배포 (커밋 단위)
        - [ ] 2.12.1 로컬 마이그레이션을 Supabase Cloud에 푸시: `supabase db push`
        - [ ] 2.12.2 Vercel 환경 변수 업데이트 (프로덕션 Supabase URL/Key)
        - [ ] 2.12.3 Vercel 재배포 및 인증 기능 테스트
        - [ ] 2.12.4 회원가입 → 로그인 → 프로필 수정 플로우 E2E 테스트
        - [ ] 2.12.5 테스트 코드 작성
        - [ ] 2.12.6 테스트 실행 및 검증
        - [ ] 2.12.7 오류 수정 (필요 시): 프로덕션 환경 이슈 해결

---

## 완료 조건
- [x] Supabase 프로젝트 생성 및 로컬 개발 환경 구축
- [x] PostgreSQL 스키마 (profiles, reports, safety_zones) 생성
- [x] Row Level Security 정책 적용
- [x] TypeScript 타입 자동 생성
- [x] Supabase 클라이언트 (client, server, middleware) 설정
- [x] Next.js 미들웨어로 Auth 토큰 자동 갱신
- [x] 회원가입/로그인/로그아웃 기능 구현
- [x] OAuth 로그인 (Google, Kakao) 지원
- [x] 프로필 조회 및 수정 기능
- [x] Supabase 프로덕션 배포 완료

---

## Git 작업 흐름
```
2.1 커밋 → 2.2 커밋 → ... → 2.12 커밋
                ↓
          Task 2 Push (인증 시스템 배포 가능한 상태)
```
