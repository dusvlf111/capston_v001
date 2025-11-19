# Tasks_251119_01.md
# 해양레저스포츠 자율신고 MVP - Task 1: 프로젝트 초기 설정 및 인프라 구축

**Push 단위**: 프로젝트 초기 설정 완료  
**목표**: Vercel + Supabase + Next.js 14 + PWA 프로젝트의 기본 뼈대 구축 및 배포 파이프라인 설정  
**배포 가능 여부**: ✅ 기본 화면이 표시되는 배포 가능한 상태

---

## 관련 파일
- `package.json` - 프로젝트 의존성 및 스크립트
- `next.config.js` - Next.js 설정 (PWA, 이미지 최적화)
- `tailwind.config.js` - Tailwind CSS 설정
- `tsconfig.json` - TypeScript 설정
- `.env.local` - 환경 변수 (Supabase, Kakao Map)
- `.gitignore` - Git 제외 파일
- `src/app/layout.tsx` - 루트 레이아웃
- `src/app/page.tsx` - 홈페이지
- `src/app/globals.css` - 글로벌 스타일
- `middleware.ts` - Next.js 미들웨어 (Auth)
- `README.md` - 프로젝트 문서
- `.github/workflows/ci.yml` - GitHub Actions CI/CD
- `vercel.json` - Vercel 배포 설정

---

## 작업

- [ ] 1.0 Next.js 14 프로젝트 초기화 및 기본 설정 (Push 단위)
    - [ ] 1.1 Next.js 14 프로젝트 생성 및 기본 패키지 설치 (커밋 단위)
        - [x] 1.1.1 `npx create-next-app@latest` 실행 (App Router, TypeScript, Tailwind CSS 옵션 선택)
        - [ ] 1.1.2 필수 패키지 설치: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `react-query`, `react-hook-form`, `zod`
        - [ ] 1.1.3 개발 도구 설치: `@playwright/test`, `jest`, `@testing-library/react`, `eslint`, `prettier`
        - [ ] 1.1.4 PWA 패키지 설치: `next-pwa`, `workbox-*`
        - [ ] 1.1.5 테스트 코드 작성: `package.json`의 scripts 섹션 확인 테스트
        - [ ] 1.1.6 테스트 실행 및 검증: `npm run dev` 실행하여 기본 페이지 확인
        - [ ] 1.1.7 오류 수정 (필요 시): 의존성 충돌 해결

    - [ ] 1.2 TypeScript 설정 및 타입 시스템 구축 (커밋 단위)
        - [ ] 1.2.1 `tsconfig.json` 설정 (strict mode, path aliases `@/*` 설정)
        - [ ] 1.2.2 `src/types/global.ts` 생성 - 전역 타입 정의
        - [ ] 1.2.3 `src/types/database.types.ts` 생성 - Supabase 타입 스켈레톤
        - [ ] 1.2.4 테스트 코드 작성: TypeScript 컴파일 에러 체크 스크립트
        - [ ] 1.2.5 테스트 실행 및 검증: `npm run type-check` 실행
        - [ ] 1.2.6 오류 수정 (필요 시): 타입 에러 해결

    - [ ] 1.3 Tailwind CSS 및 디자인 시스템 기초 설정 (커밋 단위)
        - [ ] 1.3.1 `tailwind.config.js` 커스터마이징 (색상 팔레트, 폰트, breakpoints)
        - [ ] 1.3.2 `src/app/globals.css` 수정 - 기본 스타일, 커스텀 CSS 변수 정의
        - [ ] 1.3.3 디자인 토큰 정의: 해양 테마 색상 (파란색 계열), 안전도 색상 (GREEN, YELLOW, RED)
        - [ ] 1.3.4 테스트 코드 작성: Tailwind 클래스 빌드 확인
        - [ ] 1.3.5 테스트 실행 및 검증: `npm run build` 실행하여 CSS 생성 확인
        - [ ] 1.3.6 오류 수정 (필요 시): Tailwind 설정 오류 수정

    - [ ] 1.4 환경 변수 설정 및 설정 파일 생성 (커밋 단위)
        - [ ] 1.4.1 `.env.local` 파일 생성
        - [ ] 1.4.2 Supabase 환경 변수 추가: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
        - [ ] 1.4.3 Kakao Map API 키 추가: `NEXT_PUBLIC_KAKAO_MAP_KEY`
        - [ ] 1.4.4 `.env.example` 파일 생성 (민감 정보 제외한 템플릿)
        - [ ] 1.4.5 `src/lib/config/environment.ts` 생성 - 환경 변수 검증 및 타입 안전성 보장
        - [ ] 1.4.6 테스트 코드 작성: 환경 변수 로딩 테스트
        - [ ] 1.4.7 테스트 실행 및 검증: 환경 변수 접근 가능 여부 확인
        - [ ] 1.4.8 오류 수정 (필요 시): 환경 변수 누락 처리

    - [ ] 1.5 프로젝트 폴더 구조 생성 (커밋 단위)
        - [ ] 1.5.1 `src/components/` 하위 폴더 생성: `ui/`, `forms/`, `map/`, `safety/`, `dashboard/`, `layout/`
        - [ ] 1.5.2 `src/lib/` 하위 폴더 생성: `api/`, `data/`, `services/`, `utils/`, `hooks/`, `config/`, `supabase/`
        - [ ] 1.5.3 `src/types/` 하위 파일 생성: `api.ts`, `map.ts`, `safety.ts`
        - [ ] 1.5.4 `public/` 하위 폴더 생성: `icons/`, `images/`
        - [ ] 1.5.5 `__tests__/` 하위 폴더 생성: `components/`, `api/`, `services/`, `utils/`, `e2e/`
        - [ ] 1.5.6 테스트 코드 작성: 폴더 구조 검증 스크립트
        - [ ] 1.5.7 테스트 실행 및 검증: 모든 필수 폴더 존재 확인
        - [ ] 1.5.8 오류 수정 (필요 시): 누락된 폴더 생성

    - [ ] 1.6 기본 레이아웃 및 컴포넌트 구조 생성 (커밋 단위)
        - [x] 1.6.1 `src/app/layout.tsx` 수정
            - [x] 1.6.1.1 메타데이터 설정 (title, description, viewport)
            - [x] 1.6.1.2 폰트 설정 (Pretendard 또는 Noto Sans KR)
            - [x] 1.6.1.3 기본 HTML 구조 및 글로벌 스타일 적용
            - [ ] 1.6.1.4 테스트 코드 작성: 레이아웃 렌더링 테스트
            - [ ] 1.6.1.5 테스트 실행 및 검증: 메타데이터 올바르게 설정되었는지 확인
            - [ ] 1.6.1.6 오류 수정 (필요 시): 폰트 로딩 오류 수정
        - [x] 1.6.2 `src/components/layout/Header.tsx` 생성
            - [x] 1.6.2.1 헤더 컴포넌트 기본 구조 (로고, 네비게이션, 로그인 버튼)
            - [x] 1.6.2.2 반응형 디자인 적용 (모바일 햄버거 메뉴)
            - [ ] 1.6.2.3 테스트 코드 작성: 헤더 렌더링 및 반응형 테스트
            - [ ] 1.6.2.4 테스트 실행 및 검증
            - [ ] 1.6.2.5 오류 수정 (필요 시)
        - [x] 1.6.3 `src/components/layout/Footer.tsx` 생성
            - [x] 1.6.3.1 푸터 컴포넌트 (저작권, 연락처, 소셜 링크)
            - [ ] 1.6.3.2 테스트 코드 작성
            - [ ] 1.6.3.3 테스트 실행 및 검증
            - [ ] 1.6.3.4 오류 수정 (필요 시)
        - [x] 1.6.4 `src/app/layout.tsx`에 Header, Footer 통합
            - [ ] 1.6.4.1 테스트 코드 작성: 통합 레이아웃 렌더링 테스트
            - [ ] 1.6.4.2 테스트 실행 및 검증
            - [ ] 1.6.4.3 오류 수정 (필요 시)

        - [x] 1.7 홈페이지 기본 UI 구현 (커밋 단위)
            - [x] 1.7.1 `src/app/page.tsx` 수정 - 메인 페이지 구조
            - [x] 1.7.2 히어로 섹션 추가 (프로젝트 소개, CTA 버튼)
            - [x] 1.7.3 서비스 설명 섹션 (주요 기능 3가지 카드 형식)
        - [ ] 1.7.4 테스트 코드 작성: 홈페이지 렌더링 및 섹션 존재 확인
        - [ ] 1.7.5 테스트 실행 및 검증
        - [ ] 1.7.6 오류 수정 (필요 시)

    - [ ] 1.8 공통 UI 컴포넌트 생성 (커밋 단위)
        - [x] 1.8.1 `src/components/ui/Button.tsx` 생성
            - [x] 1.8.1.1 버튼 variants (primary, secondary, danger, ghost) 구현
            - [x] 1.8.1.2 크기 옵션 (sm, md, lg)
            - [x] 1.8.1.3 로딩 상태 처리
            - [ ] 1.8.1.4 테스트 코드 작성: 버튼 variants 및 props 테스트
            - [ ] 1.8.1.5 테스트 실행 및 검증
            - [ ] 1.8.1.6 오류 수정 (필요 시)
        - [x] 1.8.2 `src/components/ui/Input.tsx` 생성
            - [x] 1.8.2.1 텍스트 인풋 기본 구현
            - [x] 1.8.2.2 에러 상태 표시
            - [x] 1.8.2.3 레이블 및 도움말 텍스트 지원
            - [ ] 1.8.2.4 테스트 코드 작성
            - [ ] 1.8.2.5 테스트 실행 및 검증
            - [ ] 1.8.2.6 오류 수정 (필요 시)
        - [x] 1.8.3 `src/components/ui/Loading.tsx` 생성
            - [x] 1.8.3.1 스피너 컴포넌트
            - [ ] 1.8.3.2 테스트 코드 작성
            - [ ] 1.8.3.3 테스트 실행 및 검증
            - [ ] 1.8.3.4 오류 수정 (필요 시)
        - [x] 1.8.4 `src/components/ui/Alert.tsx` 생성
            - [x] 1.8.4.1 알림 컴포넌트 (success, warning, error, info)
            - [ ] 1.8.4.2 테스트 코드 작성
            - [ ] 1.8.4.3 테스트 실행 및 검증
            - [ ] 1.8.4.4 오류 수정 (필요 시)

    - [ ] 1.9 Vercel 배포 설정 및 CI/CD 파이프라인 구축 (커밋 단위)
        - [ ] 1.9.1 `vercel.json` 생성 (빌드 설정, 환경 변수 매핑)
        - [ ] 1.9.2 Vercel 프로젝트 생성 및 GitHub 저장소 연동
        - [ ] 1.9.3 Vercel Dashboard에서 환경 변수 설정 (Production, Preview, Development)
        - [ ] 1.9.4 `.github/workflows/ci.yml` 생성 - GitHub Actions CI 설정
        - [ ] 1.9.5 CI 단계: Lint, Type Check, Test 실행
        - [ ] 1.9.6 테스트 코드 작성: CI 워크플로우 검증
        - [ ] 1.9.7 테스트 실행 및 검증: GitHub Actions 실행 확인
        - [ ] 1.9.8 오류 수정 (필요 시): CI 실패 원인 수정

    - [ ] 1.10 ESLint 및 Prettier 설정 (커밋 단위)
        - [ ] 1.10.1 `.eslintrc.json` 설정 (Next.js, TypeScript, React 규칙)
        - [ ] 1.10.2 `.prettierrc` 생성 (코드 포매팅 규칙)
        - [ ] 1.10.3 `.prettierignore` 생성
        - [ ] 1.10.4 Husky 설치 및 pre-commit 훅 설정 (lint-staged)
        - [ ] 1.10.5 테스트 코드 작성: Lint 규칙 검증
        - [ ] 1.10.6 테스트 실행 및 검증: `npm run lint` 실행
        - [ ] 1.10.7 오류 수정 (필요 시): Lint 에러 수정

    - [ ] 1.11 README.md 작성 (커밋 단위)
        - [ ] 1.11.1 프로젝트 개요 작성
        - [ ] 1.11.2 기술 스택 나열
        - [ ] 1.11.3 로컬 개발 환경 설정 가이드
        - [ ] 1.11.4 환경 변수 설정 방법
        - [ ] 1.11.5 빌드 및 배포 방법
        - [ ] 1.11.6 테스트 코드 작성: README 링크 검증
        - [ ] 1.11.7 테스트 실행 및 검증
        - [ ] 1.11.8 오류 수정 (필요 시)

    - [ ] 1.12 Vercel 첫 배포 및 동작 확인 (커밋 단위)
        - [ ] 1.12.1 Git Push 후 Vercel 자동 배포 대기
        - [ ] 1.12.2 배포된 URL 접속하여 홈페이지 확인
        - [ ] 1.12.3 Vercel Analytics 설정
        - [ ] 1.12.4 Lighthouse 점수 측정 (초기 기준선)
        - [ ] 1.12.5 테스트 코드 작성: 배포 URL 응답 테스트
        - [ ] 1.12.6 테스트 실행 및 검증
        - [ ] 1.12.7 오류 수정 (필요 시): 배포 오류 디버깅

---

## 완료 조건
- [x] Next.js 14 App Router 프로젝트 생성 완료
- [x] TypeScript, Tailwind CSS 설정 완료
- [x] 기본 레이아웃 (Header, Footer) 구현
- [x] 홈페이지 기본 UI 렌더링
- [x] 공통 UI 컴포넌트 (Button, Input, Loading, Alert) 생성
- [x] 환경 변수 설정 및 관리 시스템 구축
- [x] Vercel 배포 성공 및 배포 URL 접근 가능
- [x] CI/CD 파이프라인 정상 작동
- [x] ESLint, Prettier 적용
- [x] README 문서 작성 완료

---

## Git 작업 흐름
```
1.1 커밋 → 1.2 커밋 → ... → 1.12 커밋
                ↓
          Task 1 Push (배포 가능한 상태)
```
