# 4차 오류 리포트 (2025-12-03)

## 1. `manifest.webmanifest` 404
- **증상**: `http://localhost:3000/manifest.webmanifest failed, code 404` 가 반복적으로 발생.
- **영향**: PWA 구성요소가 로딩되지 않아 설치/아이콘 기능 미동작 가능.
- **추정 원인**: `public/manifest.webmanifest` 누락 또는 Next.js 설정(`next.config.ts`, `app/manifest.ts`) 미구현.
- **조치 제안**: 매니페스트 파일 생성 후 `app/manifest.ts` 혹은 `next.config.ts`에 경로 매핑.

## 2. Zod 폼 검증 오류 (activity.endTime)
- **증상**: `종료 시간을 입력하세요 / ISO 형식 / 시작 시간 이후여야 합니다` 메시지와 함께 `ZodError` 발생.
- **영향**: 보고서 작성 폼 제출 불가.
- **추정 원인**: 종료 시간 필드가 미입력 상태로 제출되거나, ISO8601 변환 로직 누락.
- **조치 제안**: 기본값/자동완성 제공, ISO 포맷 변환 유틸 추가, 시작/종료 시각 검증 순서 재검토 (`src/components/forms/ReportForm.tsx` 등).

## 3. Windy Point Forecast API 400
- **증상**: `fetchWindyPointForecast`에서 `AxiosError: Request failed with status code 400`.
- **영향**: 보고서 결과 페이지의 해양 기상 데이터가 비어 있거나 대체 문구 노출.
- **추정 원인**: 위경도/키 파라미터가 Windy API 규격과 불일치하거나 테스트 키 권한 부족.
- **조치 제안**: `externalApiConfig.windy.pointForecastUrl` 요청 payload 확인, lat/lon 단위 및 키 값 환경변수 점검, 실패 시 fallback 데이터 처리 추가.

## 4. 공공데이터 경보 파서 TypeError
- **증상**: `value.slice is not a function` (`src/lib/services/publicDataService.ts:66`).
- **영향**: 기상 특보 정보 파싱 중단 → 환경 인사이트 생성 실패.
- **추정 원인**: `value`가 문자열이 아닌 객체/숫자로 수신되는데도 문자열 가정 slice 실행.
- **조치 제안**: `typeof value === 'string'` 체크 후 포맷 분기, 또는 API 응답 스키마에 맞춰 전처리.

## 5. 해양경찰 관측소 API 404
- **증상**: `fetchBaseStations -> AxiosError 404` (`src/lib/services/publicDataService.ts:165`).
- **영향**: 관측소 데이터 캐시 실패, 기본 스테이션 목록으로 강제 폴백.
- **추정 원인**: `externalApiConfig.publicData.coastGuardUrl` 경로/쿼리 파라미터 오타 혹은 서비스키 권한 문제.
- **조치 제안**: 실제 공공데이터포털 요청 URL과 비교, `serviceKey` 인코딩 여부 확인, 실패 시 사용자에게 안내.

## 6. Windy/공공데이터 호출 실패에 따른 연쇄 오류
- **증상**: `fetchEnvironmentalInsights` 경로 전체가 null을 반환하며 보고서 결과 생성 중 예외 발생.
- **영향**: `ReportResultPage`에서 빌드 실패 및 사용자 경험 저하.
- **조치 제안**: 각 서비스 호출 실패를 개별적으로 감싸고 UI에서 graceful degrade 처리.

## 7. Source Map 파싱 오류
- **증상**: `.next/dev/server/chunks/...: Invalid source map. sourceMapURL could not be parsed`.
- **영향**: 디버깅 시 원본 추적 불가, 빌드 자체에는 영향 제한적.
- **추정 원인**: 외부 패키지 번들(source map 주석) 손상, Turbopack 버그.
- **조치 제안**: 문제 패키지 버전 업데이트, `next.config.ts`에서 `productionBrowserSourceMaps` 설정 재확인.

## 8. `libBoot.js: L is not defined`
- **증상**: 클라이언트 콘솔에 `ReferenceError: L is not defined`.
- **영향**: 지도/시각화 컴포넌트 초기화 실패 가능 (`L`은 Leaflet global로 추정).
- **추정 원인**: Leaflet 스크립트를 SSR 환경에서 사용하면서 window 가드 없음.
- **조치 제안**: 동적 import 또는 `typeof window !== 'undefined'` 체크 후 Leaflet 로드, 필요 시 `next/dynamic` 사용.

## 9. Supabase 세션 객체 보안 경고
- **증상**: `Using the user object as returned from supabase.auth.getSession() ... could be insecure`.
- **영향**: 서버/클라이언트 인증 데이터 신뢰도 저하 가능성.
- **조치 제안**: 민감 로직에서는 `supabase.auth.getUser()`로 재검증.

## 10. 리소스 Preload 미사용 경고
- **증상**: preload된 리소스가 로드 후 즉시 사용되지 않는다는 브라우저 경고 다수.
- **영향**: 성능 저하 및 경고 스팸.
- **조치 제안**: 실제 필요 없으면 preload 삭제, 필요한 경우 `as` 속성 값과 사용 타이밍 조정.

## 부록: 공통 관찰 사항
- Fast Refresh가 빈번히 재빌드되고 있어 개발자 경험에 영향. 파일 변경 이벤트/의존성 루프 여부 점검 필요.
- Vercel Web Analytics가 개발 모드에서 디버그 로그를 남기므로 노이즈가 될 수 있음. 필요 시 비활성화.
