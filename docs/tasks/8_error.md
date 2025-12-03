## Runtime ZodError (해결됨)

**증상**
- 보고서 히스토리/상세 페이지에서 `location.coordinates.*` 및 `activity.*` 필드가 `undefined` 로 파싱되며 Zod가 런타임 예외를 발생시켰다.
- 기존 신고 데이터 중 위·경도/시간 정보가 비어 있거나 문자열 형식(예: `2025-11-20T03:30:00`)으로 저장되어 신규 엄격 스키마(`reportSchema`)와 충돌했다.

**원인**
- 초기 버전에서 `reports.location_data` JSON이 부분 필드만 저장했고, 나중에 스키마가 강화되면서 기존 데이터가 더 이상 유효하지 않음.
- 히스토리/상세/인사이트 로직이 DB 페이로드를 그대로 신뢰하여 검증 단계에서 예외 발생.

**조치**
1. `normalizeReportPayload` 유틸을 추가해 저장된 JSON을 강건하게 정규화하고, 누락된 값은 보수적인 기본값과 `metadata` 플래그로 표시 (`src/lib/utils/reportPayload.ts`).
2. `mapReportRowToResponse`, `buildReportInsights` 등 모든 소비자가 정규화된 페이로드를 사용하도록 경로 통합.
3. 좌표가 없거나 시간이 손상된 경우에는 실시간 기상/AI 요청을 건너뛰고 UI에 안전하게 노출할 수 있는 기본 데이터만 유지.

**검증**
- Unit: `npm run test -- src/lib/utils/reportTransform.test.ts src/lib/services/__tests__/reportInsightsService.test.ts`.
- 수동: legacy 신고 레코드로 히스토리/결과 페이지 확인 시 예외 미발생 및 “실시간 데이터 없음” 처리 확인.

**추가 메모**
- 정규화 과정에서 자동보정(ISO 포맷 변환, 문자열 좌표 → 숫자) 시 DB에 최신 구조가 재저장되며, 누락 플래그(`metadata.missingCoordinates`)는 후속 분석에서 참고한다.

---

## OpenAI Console Errors · source map & 429 (해결됨)

**증상**
- Next.js dev 서버가 `openai` SDK의 비표준 소스맵을 파싱하지 못해 `Invalid source map` 경고 다수 발생.
- 동일 호출에서 API 한도 초과(429) 시 반복적으로 콘솔 에러가 출력되고, 보고서 결과 페이지가 노이즈로 가득 찼다.

**원인**
- 서버 번들에 `openai` SDK 전체가 포함되며 Turbopack이 inlined sourcemap URI를 해석하지 못함.
- 신고 결과 진입 시마다 좌표/시간 유효성과 상관없이 AI 호출을 재시도하여 불필요한 요청 및 rate limit 노출.

**조치**
1. `src/lib/services/aiService.ts`에서 SDK 의존성을 제거하고 `fetch` 기반 경량 클라이언트로 교체, 1차/2차 모델 순차 호출 및 JSON 응답 파서 추가.
2. 좌표/시간이 유효하지 않은 신고는 AI 요청 자체를 건너뛰어 (a) 잘못된 데이터로 호출되지 않도록 하고 (b) 호출 수를 줄여 한도 초과를 방지.
3. 429, 파싱 실패 등은 사용자 영향 없이 `null`을 반환하도록 처리하며, 로그는 요약 메시지로 축소.

**검증**
- Unit: `npm run test -- src/lib/services/__tests__/aiService.test.ts` (fetch mock 기반으로 OpenAI 호출 로직 검증).
- 통합: 신고 결과 페이지 로드 시 콘솔 경고가 사라졌고, API Key 미설정/Quota 초과 상황에서도 UI는 기존 데이터만 노출.

**운영 참고**
- AI 호출은 `PRIMARY_MODEL = gpt-5-mini-2025-08-07`, `FALLBACK_MODEL = gpt-4o-mini` 순으로 수행된다.
- `metadata.missingCoordinates` 또는 `missingSchedule`이 true인 신고는 AI/환경 데이터 생성을 생략하므로, 필드 보완 후 다시 열람하면 자동 재계산된다.
