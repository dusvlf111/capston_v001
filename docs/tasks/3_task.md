# Tasks_251119_03.md
# 해양레저스포츠 자율신고 MVP - Task 3: 자율신고 핵심 기능 구현

**Push 단위**: 자율신고 핵심 기능 완료  
**목표**: 신고 입력 폼, API 연동, 데이터 저장 기능  
**배포 가능 여부**: ✅ 사용자가 신고를 제출하고 저장할 수 있는 상태

---

## 관련 파일
- `src/components/forms/ReportForm.tsx` - 자율신고 메인 폼
- `src/components/forms/LocationSelector.tsx` - 위치 선택 컴포넌트
- `src/components/forms/ActivitySelector.tsx` - 활동 선택 컴포넌트
- `src/components/forms/ContactForm.tsx` - 연락처 입력 폼
- `src/app/api/report/submit/route.ts` - 신고 제출 API
- `src/app/api/report/[id]/route.ts` - 신고 조회 API
- `src/app/api/report/history/route.ts` - 신고 이력 API
- `src/lib/services/reportService.ts` - 신고 비즈니스 로직
- `src/lib/utils/validators.ts` - 입력 검증 함수
- `src/types/api.ts` - API 타입 정의
- `src/app/report/[id]/page.tsx` - 신고 결과 페이지
- `src/app/report/history/page.tsx` - 신고 이력 페이지
- `supabase/functions/analyze-safety/index.ts` - 안전도 분석 Edge Function
- `src/lib/data/mockData.ts` - 목 데이터

---

## 작업

- [ ] 3.0 자율신고 폼 및 제출 기능 구현 (Push 단위)
    - [ ] 3.1 자율신고 폼 데이터 타입 및 스키마 정의 (커밋 단위)
        - [x] 3.1.1 `src/types/api.ts`에 `ReportRequest`, `ReportResponse` 인터페이스 추가
        - [x] 3.1.2 Zod 스키마 정의: `reportSchema`
            - [x] 3.1.2.1 location 검증 (name, coordinates)
            - [x] 3.1.2.2 activity 검증 (type, startTime, endTime, participants)
            - [x] 3.1.2.3 contact 검증 (name, phone, emergency)
            - [x] 3.1.2.4 테스트 코드 작성: Zod 스키마 검증 테스트
            - [x] 3.1.2.5 테스트 실행 및 검증
            - [x] 3.1.2.6 오류 수정 (필요 시)
        - [x] 3.1.3 활동 타입 상수 정의: `ACTIVITY_TYPES = ['패들보드', '카약', '윈드서핑', ...]`
            - [x] 3.1.3.1 테스트 코드 작성
            - [x] 3.1.3.2 테스트 실행 및 검증
            - [x] 3.1.3.3 오류 수정 (필요 시)

    - [x] 3.2 위치 선택 컴포넌트 구현 (커밋 단위)
        - [x] 3.2.1 `src/components/forms/LocationSelector.tsx` 생성
        - [x] 3.2.2 주소 입력 필드 (텍스트 인풋)
        - [x] 3.2.3 "현재 위치 사용" 버튼 (Geolocation API)
            - [x] 3.2.3.1 navigator.geolocation.getCurrentPosition 호출
            - [x] 3.2.3.2 위도/경도 자동 입력
            - [x] 3.2.3.3 에러 처리 (위치 권한 거부)
            - [x] 3.2.3.4 테스트 코드 작성
            - [x] 3.2.3.5 테스트 실행 및 검증
            - [x] 3.2.3.6 오류 수정 (필요 시)
        - [x] 3.2.4 위도/경도 표시 (읽기 전용)
        - [x] 3.2.5 지도 미리보기 (간단한 정적 지도 또는 플레이스홀더)
            - [x] 3.2.5.1 테스트 코드 작성
            - [x] 3.2.5.2 테스트 실행 및 검증
            - [x] 3.2.5.3 오류 수정 (필요 시)

    - [x] 3.3 활동 선택 컴포넌트 구현 (커밋 단위)
        - [x] 3.3.1 `src/components/forms/ActivitySelector.tsx` 생성
        - [x] 3.3.2 활동 타입 선택 (Select 또는 Radio 버튼)
        - [x] 3.3.3 시작 시간 선택 (DateTime Picker)
        - [x] 3.3.4 종료 시간 선택 (DateTime Picker)
        - [x] 3.3.5 참가자 수 입력 (Number Input)
        - [x] 3.3.6 시간 검증: 종료 시간이 시작 시간보다 늦어야 함
            - [x] 3.3.6.1 테스트 코드 작성
            - [x] 3.3.6.2 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.3.6.3 오류 수정 (필요 시)

    - [x] 3.4 연락처 입력 폼 구현 (커밋 단위)
        - [x] 3.4.1 `src/components/forms/ContactForm.tsx` 생성
        - [x] 3.4.2 이름 입력 필드
        - [x] 3.4.3 전화번호 입력 (포맷 검증: 010-XXXX-XXXX)
        - [x] 3.4.4 응급연락처 입력
        - [x] 3.4.5 프로필 정보 자동 채우기 (useAuth 훅 활용)
            - [x] 3.4.5.1 테스트 코드 작성
            - [x] 3.4.5.2 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.4.5.3 오류 수정 (필요 시)

    - [x] 3.5 메인 자율신고 폼 통합 (커밋 단위)
        - [x] 3.5.1 `src/components/forms/ReportForm.tsx` 생성
        - [x] 3.5.2 React Hook Form 설정 (useForm)
        - [x] 3.5.3 LocationSelector, ActivitySelector, ContactForm 통합
        - [x] 3.5.4 폼 제출 핸들러 구현
            - [x] 3.5.4.1 onSubmit 함수 작성
            - [x] 3.5.4.2 API 호출 로직
            - [x] 3.5.4.3 로딩 상태 관리
            - [x] 3.5.4.4 성공/실패 메시지 표시
            - [x] 3.5.4.5 테스트 코드 작성
            - [x] 3.5.4.6 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.5.4.7 오류 수정 (필요 시)
        - [x] 3.5.5 폼 초기화 기능
            - [x] 3.5.5.1 테스트 코드 작성
            - [x] 3.5.5.2 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.5.5.3 오류 수정 (필요 시)

    - [x] 3.6 Supabase RPC Function 구현 (submit_report) (커밋 단위)
        - [x] 3.6.1 마이그레이션 파일 생성: `supabase migration new submit_report_function`
        - [x] 3.6.2 `submit_report` 함수 작성 (SQL)
            - [x] 3.6.2.1 파라미터: location_name, location_lat, location_lng, activity_type, start_time, end_time, participants
            - [x] 3.6.2.2 신고 ID 생성: 'RPT-' + YYYYMMDD + '-' + SEQ
            - [x] 3.6.2.3 기본 안전도 계산 로직 (임시, 나중에 Edge Function으로 대체)
            - [x] 3.6.2.4 reports 테이블에 INSERT
            - [x] 3.6.2.5 JSONB 응답 반환
            - [x] 3.6.2.6 테스트 코드 작성: RPC SQL 구조 검증
            - [x] 3.6.2.7 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.6.2.8 오류 수정 (필요 시)
        - [x] 3.6.3 마이그레이션 적용: `supabase db push`
            - [x] 3.6.3.1 테스트 코드 작성
            - [x] 3.6.3.2 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.6.3.3 오류 수정 (필요 시)

    - [x] 3.7 신고 제출 API 구현 (커밋 단위)
        - [x] 3.7.1 `src/app/api/report/submit/route.ts` 생성
        - [x] 3.7.2 POST 핸들러 구현
            - [x] 3.7.2.1 Supabase 클라이언트 생성 (createRouteHandlerClient)
            - [x] 3.7.2.2 사용자 인증 확인 (getUser)
            - [x] 3.7.2.3 요청 본문 파싱 및 검증
            - [x] 3.7.2.4 Supabase RPC 호출: `supabase.rpc('submit_report', {...})`
            - [x] 3.7.2.5 에러 처리 (401, 400, 500)
            - [x] 3.7.2.6 성공 응답 반환
            - [x] 3.7.2.7 테스트 코드 작성: API 엔드포인트 통합 테스트
            - [x] 3.7.2.8 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.7.2.9 오류 수정 (필요 시)

    - [x] 3.8 신고 결과 페이지 구현 (커밋 단위)
        - [x] 3.8.1 `src/app/report/[id]/page.tsx` 생성
        - [x] 3.8.2 신고 ID로 데이터 조회 (Supabase SELECT)
            - [x] 3.8.2.1 Server Component에서 데이터 페칭
            - [x] 3.8.2.2 RLS 정책으로 본인 신고만 조회 가능
            - [x] 3.8.2.3 테스트 코드 작성 (데이터 매핑 유틸)
            - [x] 3.8.2.4 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.8.2.5 오류 수정 (필요 시)
        - [x] 3.8.3 신고 정보 표시
            - [x] 3.8.3.1 신고 ID, 상태 (APPROVED/CAUTION/DENIED)
            - [x] 3.8.3.2 위치 정보
            - [x] 3.8.3.3 활동 정보
            - [x] 3.8.3.4 안전도 점수 (색상 코드: GREEN/YELLOW/RED)
            - [x] 3.8.3.5 테스트 코드 작성 (reportTransform)
            - [x] 3.8.3.6 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.8.3.7 오류 수정 (필요 시)
        - [x] 3.8.4 안전 정보 섹션
            - [x] 3.8.4.1 기상 상태 (목 데이터)
            - [x] 3.8.4.2 어업권 정보 (목 데이터)
            - [x] 3.8.4.3 항로 정보 (목 데이터)
            - [x] 3.8.4.4 테스트 코드 작성 (mockData)
            - [x] 3.8.4.5 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.8.4.6 오류 수정 (필요 시)
        - [x] 3.8.5 응급연락처 표시
            - [x] 3.8.5.1 해양경찰 122, 119, 지역 관청
            - [x] 3.8.5.2 테스트 코드 작성
            - [x] 3.8.5.3 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.8.5.4 오류 수정 (필요 시)

    - [x] 3.9 신고 이력 페이지 구현 (커밋 단위)
        - [x] 3.9.1 `src/app/report/history/page.tsx` 생성
        - [x] 3.9.2 사용자의 모든 신고 조회
            - [x] 3.9.2.1 Supabase SELECT WHERE user_id = auth.uid()
            - [x] 3.9.2.2 최신순 정렬
            - [x] 3.9.2.3 테스트 코드 작성 (데이터 매핑 재사용)
            - [x] 3.9.2.4 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.9.2.5 오류 수정 (필요 시)
        - [x] 3.9.3 신고 목록 렌더링
            - [x] 3.9.3.1 카드 형식으로 표시
            - [x] 3.9.3.2 신고 ID, 날짜, 위치, 상태 표시
            - [x] 3.9.3.3 클릭 시 상세 페이지로 이동
            - [x] 3.9.3.4 테스트 코드 작성
            - [x] 3.9.3.5 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.9.3.6 오류 수정 (필요 시)
        - [x] 3.9.4 빈 상태 처리 (신고 이력 없음)
            - [x] 3.9.4.1 테스트 코드 작성
            - [x] 3.9.4.2 테스트 실행 및 검증 (`npm run test`)
            - [x] 3.9.4.3 오류 수정 (필요 시)

    - [x] 3.10 목 데이터 생성 (커밋 단위)
        - [x] 3.10.1 `src/lib/data/mockData.ts` 생성
        - [x] 3.10.2 안전구역 목 데이터 (부산 해운대, 강릉, 제주 등)
        - [x] 3.10.3 기상 정보 목 데이터 (풍속, 파고, 시정)
        - [x] 3.10.4 어업권 정보 목 데이터
        - [x] 3.10.5 항로 정보 목 데이터
        - [x] 3.10.6 테스트 코드 작성: 목 데이터 구조 검증
        - [x] 3.10.7 테스트 실행 및 검증 (`npm run test`)
        - [x] 3.10.8 오류 수정 (필요 시)

    - [x] 3.11 신고 서비스 로직 분리 (커밋 단위)
        - [x] 3.11.1 `src/lib/services/reportService.ts` 생성
        - [x] 3.11.2 `submitReport` 함수 (API 호출 래퍼)
        - [x] 3.11.3 `getReportById` 함수
        - [x] 3.11.4 `getReportHistory` 함수
        - [x] 3.11.5 에러 처리 및 타입 안전성
        - [x] 3.11.6 테스트 코드 작성: 서비스 함수 단위 테스트
        - [x] 3.11.7 테스트 실행 및 검증
        - [x] 3.11.8 오류 수정 (필요 시)

    - [x] 3.12 E2E 테스트: 신고 제출 플로우 (커밋 단위)
        - [x] 3.12.1 `__tests__/e2e/report-flow.spec.ts` 생성
        - [x] 3.12.2 Playwright 테스트 작성
            - [x] 3.12.2.1 로그인
            - [x] 3.12.2.2 신고 폼 작성
            - [x] 3.12.2.3 제출
            - [x] 3.12.2.4 결과 페이지 확인
            - [x] 3.12.2.5 이력 페이지에서 신고 확인
            - [x] 3.12.2.6 테스트 실행: `npx playwright test`
            - [x] 3.12.2.7 오류 수정 (필요 시)

---

## 완료 조건
- [x] 자율신고 폼 (위치, 활동, 연락처) 구현
- [x] 폼 검증 (Zod 스키마)
- [x] Supabase RPC Function (submit_report) 생성
- [x] 신고 제출 API (/api/report/submit) 구현
- [x] 신고 결과 페이지 렌더링
- [x] 신고 이력 페이지 구현
- [x] 목 데이터 생성
- [x] E2E 테스트 통과

---

## Git 작업 흐름
```
3.1 커밋 → 3.2 커밋 → ... → 3.12 커밋
                ↓
          Task 3 Push (신고 제출 기능 배포 가능)
```
