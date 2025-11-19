# Tasks_251119_05.md
# 해양레저스포츠 자율신고 MVP - Task 5: PWA 오프라인 지원 및 실시간 기능

**Push 단위**: PWA 및 실시간 기능 완료  
**목표**: Service Worker, 오프라인 캐싱, Realtime Subscriptions  
**배포 가능 여부**: ✅ 오프라인에서도 동작하고 실시간 알림을 받을 수 있는 상태

---

## 관련 파일
- `public/manifest.json` - PWA 매니페스트
- `public/sw.js` - Service Worker
- `src/lib/utils/pwa.ts` - PWA 유틸리티
- `next.config.js` - PWA 설정 추가
- `src/components/realtime/RealtimeAlerts.tsx` - 실시간 알림
- `src/lib/hooks/useRealtimeReports.ts` - Realtime Subscriptions 훅
- `src/lib/utils/storage.ts` - IndexedDB 관리

---

## 작업

- [ ] 5.0 PWA 오프라인 지원 및 실시간 기능 구축 (Push 단위)
    - [ ] 5.1 PWA 매니페스트 생성 (커밋 단위)
        - [ ] 5.1.1 `public/manifest.json` 생성
        - [ ] 5.1.2 앱 이름, 설명, 테마 색상 설정
        - [ ] 5.1.3 아이콘 설정 (192x192, 512x512)
        - [ ] 5.1.4 display: "standalone" 설정
        - [ ] 5.1.5 start_url 설정
        - [ ] 5.1.6 테스트 코드 작성: 매니페스트 JSON 유효성 검증
        - [ ] 5.1.7 테스트 실행 및 검증
        - [ ] 5.1.8 오류 수정 (필요 시)

    - [ ] 5.2 PWA 아이콘 생성 (커밋 단위)
        - [ ] 5.2.1 `public/icons/icon-192.png` 생성
        - [ ] 5.2.2 `public/icons/icon-512.png` 생성
        - [ ] 5.2.3 favicon 업데이트
        - [ ] 5.2.4 테스트 코드 작성: 아이콘 파일 존재 확인
        - [ ] 5.2.5 테스트 실행 및 검증
        - [ ] 5.2.6 오류 수정 (필요 시)

    - [ ] 5.3 Service Worker 구현 (커밋 단위)
        - [ ] 5.3.1 `public/sw.js` 생성
        - [ ] 5.3.2 캐싱 전략 구현
            - [ ] 5.3.2.1 Cache First: 정적 자산 (CSS, JS, 이미지)
            - [ ] 5.3.2.2 Network First: API 요청
            - [ ] 5.3.2.3 Stale While Revalidate: 페이지 HTML
            - [ ] 5.3.2.4 테스트 코드 작성
            - [ ] 5.3.2.5 테스트 실행 및 검증
            - [ ] 5.3.2.6 오류 수정 (필요 시)
        - [ ] 5.3.3 오프라인 폴백 페이지 구현
            - [ ] 5.3.3.1 `/offline.html` 생성
            - [ ] 5.3.3.2 Service Worker에서 폴백 처리
            - [ ] 5.3.3.3 테스트 코드 작성
            - [ ] 5.3.3.4 테스트 실행 및 검증
            - [ ] 5.3.3.5 오류 수정 (필요 시)

    - [ ] 5.4 Service Worker 등록 (커밋 단위)
        - [ ] 5.4.1 `src/lib/utils/pwa.ts` 생성
        - [ ] 5.4.2 Service Worker 등록 함수 구현
        - [ ] 5.4.3 `src/app/layout.tsx`에서 Service Worker 등록
        - [ ] 5.4.4 업데이트 감지 및 알림
        - [ ] 5.4.5 테스트 코드 작성: Service Worker 등록 확인
        - [ ] 5.4.6 테스트 실행 및 검증
        - [ ] 5.4.7 오류 수정 (필요 시)

    - [ ] 5.5 IndexedDB 오프라인 저장소 구현 (커밋 단위)
        - [ ] 5.5.1 `src/lib/utils/storage.ts` 생성
        - [ ] 5.5.2 IndexedDB 초기화 함수
        - [ ] 5.5.3 신고 데이터 저장 함수 (오프라인용)
        - [ ] 5.5.4 신고 데이터 조회 함수
        - [ ] 5.5.5 동기화 큐 관리
            - [ ] 5.5.5.1 오프라인에서 제출한 신고를 큐에 저장
            - [ ] 5.5.5.2 온라인 복귀 시 자동 동기화
            - [ ] 5.5.5.3 테스트 코드 작성
            - [ ] 5.5.5.4 테스트 실행 및 검증
            - [ ] 5.5.5.5 오류 수정 (필요 시)

    - [ ] 5.6 오프라인 신고 제출 기능 (커밋 단위)
        - [ ] 5.6.1 `src/components/forms/ReportForm.tsx` 수정
        - [ ] 5.6.2 네트워크 상태 감지
            - [ ] 5.6.2.1 navigator.onLine 체크
            - [ ] 5.6.2.2 온라인/오프라인 이벤트 리스너
            - [ ] 5.6.2.3 테스트 코드 작성
            - [ ] 5.6.2.4 테스트 실행 및 검증
            - [ ] 5.6.2.5 오류 수정 (필요 시)
        - [ ] 5.6.3 오프라인일 때 IndexedDB에 저장
        - [ ] 5.6.4 "오프라인 저장됨" 메시지 표시
        - [ ] 5.6.5 온라인 복귀 시 자동 제출
            - [ ] 5.6.5.1 테스트 코드 작성
            - [ ] 5.6.5.2 테스트 실행 및 검증
            - [ ] 5.6.5.3 오류 수정 (필요 시)

    - [ ] 5.7 Supabase Realtime Subscriptions 구현 (커밋 단위)
        - [ ] 5.7.1 `src/lib/hooks/useRealtimeReports.ts` 생성
        - [ ] 5.7.2 reports 테이블 변경 구독
            - [ ] 5.7.2.1 INSERT 이벤트 리스닝
            - [ ] 5.7.2.2 UPDATE 이벤트 리스닝
            - [ ] 5.7.2.3 상태 업데이트 (React State)
            - [ ] 5.7.2.4 테스트 코드 작성
            - [ ] 5.7.2.5 테스트 실행 및 검증
            - [ ] 5.7.2.6 오류 수정 (필요 시)
        - [ ] 5.7.3 Realtime 채널 정리 (cleanup)
            - [ ] 5.7.3.1 테스트 코드 작성
            - [ ] 5.7.3.2 테스트 실행 및 검증
            - [ ] 5.7.3.3 오류 수정 (필요 시)

    - [ ] 5.8 실시간 알림 컴포넌트 구현 (커밋 단위)
        - [ ] 5.8.1 `src/components/realtime/RealtimeAlerts.tsx` 생성
        - [ ] 5.8.2 Realtime 훅 연동
        - [ ] 5.8.3 새 신고 알림 표시 (Toast)
        - [ ] 5.8.4 신고 상태 변경 알림
        - [ ] 5.8.5 테스트 코드 작성: 알림 렌더링 테스트
        - [ ] 5.8.6 테스트 실행 및 검증
        - [ ] 5.8.7 오류 수정 (필요 시)

    - [ ] 5.9 Web Push 알림 구현 (선택 사항) (커밋 단위)
        - [ ] 5.9.1 브라우저 알림 권한 요청
        - [ ] 5.9.2 Push Subscription 생성
        - [ ] 5.9.3 Supabase에 구독 정보 저장
        - [ ] 5.9.4 Edge Function으로 Push 알림 전송
        - [ ] 5.9.5 테스트 코드 작성
        - [ ] 5.9.6 테스트 실행 및 검증
        - [ ] 5.9.7 오류 수정 (필요 시)

    - [ ] 5.10 PWA 설치 프롬프트 구현 (커밋 단위)
        - [ ] 5.10.1 beforeinstallprompt 이벤트 리스닝
        - [ ] 5.10.2 "앱 설치" 배너 표시
        - [ ] 5.10.3 사용자 클릭 시 설치 프롬프트 표시
        - [ ] 5.10.4 테스트 코드 작성
        - [ ] 5.10.5 테스트 실행 및 검증
        - [ ] 5.10.6 오류 수정 (필요 시)

    - [ ] 5.11 E2E 테스트: 오프라인 기능 (커밋 단위)
        - [ ] 5.11.1 `__tests__/e2e/offline.spec.ts` 생성
        - [ ] 5.11.2 Playwright로 오프라인 모드 테스트
            - [ ] 5.11.2.1 네트워크 차단
            - [ ] 5.11.2.2 신고 작성
            - [ ] 5.11.2.3 IndexedDB 저장 확인
            - [ ] 5.11.2.4 네트워크 복구
            - [ ] 5.11.2.5 자동 동기화 확인
            - [ ] 5.11.2.6 테스트 실행
            - [ ] 5.11.2.7 오류 수정 (필요 시)

---

## 완료 조건
- [x] PWA 매니페스트 및 아이콘 생성
- [x] Service Worker 구현 (캐싱 전략)
- [x] 오프라인 신고 제출 기능
- [x] IndexedDB 동기화 큐
- [x] Supabase Realtime Subscriptions 구현
- [x] 실시간 알림 표시
- [x] PWA 설치 프롬프트
- [x] E2E 테스트 통과

---

## Git 작업 흐름
```
5.1 커밋 → 5.2 커밋 → ... → 5.11 커밋
                ↓
          Task 5 Push (PWA 및 실시간 기능 배포 가능)
```
