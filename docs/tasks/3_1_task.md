# Task 3.1: Windy API Integration & Application Features

### Related Files
- `docs/prd.md` - Product Requirements Document
- `src/components/map/WindyMap.tsx` - Windy Map Component (implemented and tested)
- `src/components/map/WindyMap.test.tsx` - Test file (enhanced with 14 test cases)
- `src/app/page.tsx` - Main Page (Map display)
- `src/app/report/page.tsx` - Report Page (Activity reporting)
- `src/app/profile/page.tsx` - Profile Page (User profile)
- `src/components/forms/LocationSelector.tsx` - Location selection with search and map
- `src/components/forms/ActivitySelector.tsx` - Activity selection with datetime pickers
- `src/components/forms/ContactForm.tsx` - Contact form with profile integration

## Tasks

### Completed Tasks
- [x] 3.1.0 Windy API Setup and Basic Map
    - [x] 3.1.1 Initialize Windy API Client
        - [x] 3.1.1.1 Write test code (Mock/Unit test)
        - [x] 3.1.1.2 Run test and verify
        - [x] 3.1.1.3 Fix errors (if any)
    - [x] 3.1.2 Implement Basic Map Rendering with Windy
        - [x] 3.1.2.1 Write test code (Component test)
        - [x] 3.1.2.2 Run test and verify
        - [x] 3.1.2.3 Fix errors
- [x] 3.2.0 Enhanced Map Features
    - [x] 3.2.1 Fix map display issue
    - [x] 3.2.2 Add map layer selector
    - [x] 3.2.3 Add address search functionality
    - [x] 3.2.4 Add location markers
- [x] 3.3.0 Additional Map Features
    - [x] 3.3.1 Add current location button
    - [x] 3.3.2 Display place info on search
    - [x] 3.3.3 Improve UI/UX with controls panel

### New Tasks - Report Page Enhancements
- [x] 3.4.0 신고 페이지 활동위치 기능 구현
    - [x] 3.4.1 활동위치 검색 기능 추가
        - [x] 3.4.1.1 위치 검색 입력 필드 추가 (Nominatim API 사용)
        - [x] 3.4.1.2 검색 결과 드롭다운 표시
        - [x] 3.4.1.3 검색된 위치 선택 시 좌표 저장
        - [x] 3.4.1.4 테스트 코드 작성 (브라우저 테스트 완료)
        - [x] 3.4.1.5 테스트 실행 및 검증
        - [x] 3.4.1.6 오류 수정 (필요 시)
    - [x] 3.4.2 활동위치 지도 표시 기능
        - [x] 3.4.2.1 신고 페이지에 WindyMap 컴포넌트 통합
        - [x] 3.4.2.2 선택된 위치에 마커 표시
        - [x] 3.4.2.3 지도 중심을 선택된 위치로 이동
        - [x] 3.4.2.4 테스트 코드 작성 (브라우저 테스트 완료)
        - [x] 3.4.2.5 테스트 실행 및 검증
        - [x] 3.4.2.6 오류 수정 (필요 시)

- [x] 3.5.0 신고 페이지 시간 선택 기능 구현
    - [x] 3.5.1 시작시간 달력 선택기 추가 (기존 구현 확인)
        - [x] 3.5.1.1 날짜/시간 선택 컴포넌트 구현 (datetime-local)
        - [x] 3.5.1.2 선택된 시간 상태 관리
        - [x] 3.5.1.3 UI/UX 스타일링
        - [x] 3.5.1.4 테스트 코드 작성
        - [x] 3.5.1.5 테스트 실행 및 검증
        - [x] 3.5.1.6 오류 수정 (필요 시)
    - [x] 3.5.2 종료시간 달력 선택기 추가 (기존 구현 확인)
        - [x] 3.5.2.1 날짜/시간 선택 컴포넌트 구현
        - [x] 3.5.2.2 시작시간보다 이후 시간만 선택 가능하도록 검증
        - [x] 3.5.2.3 선택된 시간 상태 관리
        - [x] 3.5.2.4 UI/UX 스타일링
        - [x] 3.5.2.5 테스트 코드 작성
        - [x] 3.5.2.6 테스트 실행 및 검증
        - [x] 3.5.2.7 오류 수정 (필요 시)

- [x] 3.6.0 연락처 정보 프로필 연동 기능
    - [x] 3.6.1 프로필 데이터 불러오기 API 구현 (기존 구현 확인)
        - [x] 3.6.1.1 Supabase에서 사용자 프로필 정보 조회
        - [x] 3.6.1.2 연락처 정보 추출 (전화번호, 이메일 등)
        - [x] 3.6.1.3 테스트 코드 작성
        - [x] 3.6.1.4 테스트 실행 및 검증
        - [x] 3.6.1.5 오류 수정 (필요 시)
    - [x] 3.6.2 신고 페이지에 연락처 자동 입력
        - [x] 3.6.2.1 프로필 정보 불러오기 버튼 추가
        - [x] 3.6.2.2 버튼 클릭 시 연락처 필드 자동 채우기
        - [x] 3.6.2.3 수동 수정 가능하도록 구현
        - [x] 3.6.2.4 UI/UX 스타일링
        - [x] 3.6.2.5 테스트 코드 작성
        - [x] 3.6.2.6 테스트 실행 및 검증
        - [x] 3.6.2.7 오류 수정 (필요 시)

### New Tasks - Home Page Improvements
- [ ] 3.7.0 홈 페이지 버그 수정 및 개선
    - [ ] 3.7.1 타이틀 표시 버그 수정
        - [ ] 3.7.1.1 현재 타이틀 렌더링 이슈 조사 및 원인 파악
        - [ ] 3.7.1.2 타이틀 컴포넌트 수정 (겹침, 스타일 등)
        - [ ] 3.7.1.3 반응형 디자인 적용
        - [ ] 3.7.1.4 테스트 코드 작성
        - [ ] 3.7.1.5 테스트 실행 및 검증
        - [ ] 3.7.1.6 오류 수정 (필요 시)
    - [ ] 3.7.2 서비스 소개 섹션 작성
        - [ ] 3.7.2.1 서비스 소개 컨텐츠 기획 및 작성
        - [ ] 3.7.2.2 Hero Section 디자인 및 구현
        - [ ] 3.7.2.3 주요 기능 소개 카드 컴포넌트 제작
        - [ ] 3.7.2.4 사용 방법 안내 섹션 추가
        - [ ] 3.7.2.5 UI/UX 스타일링 (아이콘, 애니메이션 등)
        - [ ] 3.7.2.6 반응형 디자인 적용
        - [ ] 3.7.2.7 테스트 코드 작성
        - [ ] 3.7.2.8 테스트 실행 및 검증
        - [ ] 3.7.2.9 오류 수정 (필요 시)