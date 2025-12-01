# 해양레저스포츠 자율신고 MVP - Task 4: 지도 및 안전도 분석 시스템 (OpenStreetMap 버전)

OpenStreetMap과 Leaflet 라이브러리로 변경한 Task 4 문서입니다. Leaflet은 오픈소스 JavaScript 지도 라이브러리로, Next.js 프로젝트에서 react-leaflet을 통해 쉽게 통합할 수 있습니다.[1][2][3]

**Push 단위**: 지도 연동 및 안전도 분석 완료  
**목표**: OpenStreetMap + Leaflet 연동, 안전구역 표시, AI 기반 안전도 계산  
**배포 가능 여부**: ✅ 지도에서 안전 정보를 시각적으로 확인 가능한 상태

***

## 관련 파일
- `src/components/map/MapView.tsx` - 메인 지도 컴포넌트
- `src/components/map/SafetyZones.tsx` - 안전구역 오버레이
- `src/components/map/MarkerManager.tsx` - 마커 관리
- `src/lib/config/map.ts` - Leaflet 지도 설정
- `src/lib/hooks/useMap.ts` - 지도 관련 훅
- `src/app/api/map/safety-zones/route.ts` - 안전구역 API
- `supabase/functions/analyze-safety/index.ts` - 안전도 분석 Edge Function
- `src/components/safety/SafetyAnalysis.tsx` - 안전도 분석 결과 UI
- `src/lib/services/safetyService.ts` - 안전도 계산 로직

***

## 작업

- [ ] 4.0 OpenStreetMap 연동 및 지도 시스템 구축 (Push 단위)
    - [ ] 4.1 Leaflet 라이브러리 설정 (커밋 단위)
        - [ ] 4.1.1 패키지 설치: `npm i leaflet react-leaflet`
        - [ ] 4.1.2 TypeScript 타입 설치: `npm i -D @types/leaflet`
        - [ ] 4.1.3 `src/lib/config/map.ts` 생성 - 지도 설정 (기본 중심좌표: 부산 해운대 [35.1586, 129.1603], 줌 레벨: 12)
        - [ ] 4.1.4 `next.config.js`에 Leaflet CSS 로딩 설정 추가
        - [ ] 4.1.5 테스트 코드 작성: 환경 변수 및 설정 로딩 확인
        - [ ] 4.1.6 테스트 실행 및 검증
        - [ ] 4.1.7 오류 수정 (필요 시)

    - [ ] 4.2 메인 지도 컴포넌트 구현 (커밋 단위)
        - [ ] 4.2.1 `src/components/map/MapView.tsx` 생성
        - [ ] 4.2.2 Leaflet 지도 초기화[2][3]
            - [ ] 4.2.2.1 dynamic import로 SSR 비활성화 (`ssr: false`)
            - [ ] 4.2.2.2 MapContainer 컴포넌트 생성
            - [ ] 4.2.2.3 TileLayer 추가: OpenStreetMap 타일 (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
            - [ ] 4.2.2.4 기본 중심좌표 설정 (부산 해운대)
            - [ ] 4.2.2.5 `leaflet/dist/leaflet.css` import
            - [ ] 4.2.2.6 테스트 코드 작성
            - [ ] 4.2.2.7 테스트 실행 및 검증
            - [ ] 4.2.2.8 오류 수정 (필요 시)
        - [ ] 4.2.3 지도 줌 컨트롤 추가 (Leaflet 기본 제공)
        - [ ] 4.2.4 현재 위치 버튼 추가[4][5]
            - [ ] 4.2.4.1 `navigator.geolocation.getCurrentPosition` API 사용
            - [ ] 4.2.4.2 `map.setView([lat, lng], zoom)` 또는 `map.locate({setView: true})` 사용
            - [ ] 4.2.4.3 현재 위치에 마커 표시
            - [ ] 4.2.4.4 테스트 코드 작성
            - [ ] 4.2.4.5 테스트 실행 및 검증
            - [ ] 4.2.4.6 오류 수정 (필요 시)

    - [ ] 4.3 마커 관리 시스템 (커밋 단위)
        - [ ] 4.3.1 `src/components/map/MarkerManager.tsx` 생성
        - [ ] 4.3.2 Marker 컴포넌트 사용하여 마커 추가/제거 함수 구현
        - [ ] 4.3.3 커스텀 마커 아이콘 구현[6]
    - [ ] 4.4 안전구역 오버레이 구현 (커밋 단위)
        - [ ] 4.4.1 `src/components/map/SafetyZones.tsx` 생성
        - [ ] 4.4.2 Polygon 오버레이로 안전구역 표시[8][9]
            - [ ] 4.4.2.1 boundary JSONB 데이터를 `[[lat, lng], ...]` 좌표 배열로 변환
            - [ ] 4.4.2.2 `<Polygon>` 컴포넌트 사용
            - [ ] 4.4.2.3 pathOptions로 색상 설정: `{color: 'green', fillColor: 'green', fillOpacity: 0.3}`
            - [ ] 4.4.2.4 안전(초록 투명), 주의(노랑 투명), 위험(빨강 투명) 구분
            - [ ] 4.4.2.5 테스트 코드 작성
            - [ ] 4.4.2.6 테스트 실행 및 검증
            - [ ] 4.4.2.7 오류 수정 (필요 시)
        - [ ] 4.4.3 안전구역 데이터 로딩 (Supabase safety_zones 테이블)
            - [ ] 4.4.3.1 테스트 코드 작성
            - [ ] 4.4.3.2 테스트 실행 및 검증
            - [ ] 4.4.3.3 오류 수정 (필요 시)

    - [ ] 4.5 안전구역 API 구현 (커밋 단위)
        - [ ] 4.5.1 `src/app/api/map/safety-zones/route.ts` 생성
        - [ ] 4.5.2 GET 핸들러: 모든 안전구역 조회
        - [ ] 4.5.3 쿼리 파라미터로 지역 필터링 지원
        - [ ] 4.8.3 안전도 등급 배지 (GREEN/YELLOW/RED)
        - [ ] 4.8.4 위험 요소 목록
            - [ ] 4.8.4.1 기상 상태
            - [ ] 4.8.4.2 어업권 충돌
            - [ ] 4.8.4.3 항로 근접
            - [ ] 4.8.4.4 테스트 코드 작성
            - [ ] 4.8.4.5 테스트 실행 및 검증
            - [ ] 4.8.4.6 오류 수정 (필요 시)
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

**SSR 이슈**: Next.js에서 Leaflet은 window 객체를 사용하므로 반드시 dynamic import로 SSR 비활성화 필요[3][10]

**마커 아이콘**: `L.Icon` 또는 `L.DivIcon`으로 커스텀 아이콘 생성[6]

**Polygon 오버레이**: `<Polygon>` 컴포넌트로 안전구역 표시, pathOptions로 색상 및 투명도 설정[9][8]

**현재 위치**: `navigator.geolocation` + `map.locate({setView: true})` 또는 `map.setView()`[4]

***

## Git 작업 흐름
```
4.1 커밋 → 4.2 커밋 → ... → 4.10 커밋
                ↓
          Task 4 Push (지도 및 안전도 분석 배포 가능)
```

[1](https://choonse.com/2022/07/28/1321/)
[2](https://velog.io/@support/Next.js-%EC%97%90%EC%84%9C-Leaflet-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)
[3](https://dev.to/tsaxena4k/integrating-next-js-with-leaflet-js-mapbox-1351)
[4](https://stackoverflow.com/questions/31389586/set-leaflet-js-map-to-display-users-current-location)
[5](https://www.youtube.com/watch?v=PGGUfnYD_xo)
[6](https://stackoverflow.com/questions/47723812/custom-marker-icon-with-react-leaflet)
[7](https://github.com/PaulLeCam/react-leaflet/issues/563)
[8](https://stackoverflow.com/questions/59303421/polygon-overlay-in-leaflet-map)
[9](https://www.syncfusion.com/succinctly-free-ebooks/leafletjs/adding-overlays)
[10](https://stackoverflow.com/questions/77978480/nextjs-with-react-leaflet-ssr-webpack-window-not-defined-icon-not-found)
[11](https://www.reddit.com/r/react/comments/1ct9nh1/add_maps_to_a_reactjs_application_using_leafletjs/)
[12](https://tech-talk.the-experts.nl/how-to-integrate-leaflet-maps-into-your-next-js-app-with-typescript-efa9411cc493)
[13](https://andrewpwheeler.com/2020/08/31/notes-on-making-leaflet-maps-in-r/)
[14](https://www.reddit.com/r/koreatravel/comments/1kf2fyi/is_there_any_touristfriendly_map_app_that/)
[15](https://stackoverflow.com/questions/65676884/leaflet-how-can-i-show-layer-only-inside-a-polygon)
[16](https://www.koreatravelpost.com/south-korea-navigation-apps-google-naver-kakao-maps/)
[17](https://docs.maptiler.com/leaflet/examples/)
[18](https://leafletjs.com/reference.html)
[19](https://support.safe.com/hc/en-us/articles/25407484760333-Polygon-in-Polygon-Overlay)
[20](https://leanpub.com/leaflet-tips-and-tricks/read)