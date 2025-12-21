# Vercel 배포 가이드

## 필수 환경 변수

Vercel 프로젝트 설정 > Environment Variables에 다음을 추가하세요:

### Supabase 설정
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### API Keys (선택사항)
```
NEXT_PUBLIC_WINDY_MAP_KEY=your-windy-key
PUBLIC_DATA_API_KEY=your-public-data-key
```

## 배포 체크리스트

### 1. 환경 변수 확인
- [ ] Supabase URL과 Anon Key가 올바르게 설정되었는지 확인
- [ ] Production, Preview, Development 환경 모두 설정

### 2. Supabase 설정 확인
- [ ] RLS (Row Level Security) 정책이 활성화되었는지 확인
- [ ] `reports` 테이블에 사용자별 접근 권한이 올바른지 확인
- [ ] 인증 리디렉션 URL에 Vercel 도메인 추가

### 3. 빌드 확인
```bash
npm run build
```

### 4. 로컬 프로덕션 테스트
```bash
npm run start
```

## 일반적인 404 오류 해결

### 문제: 리포트 상세 페이지 404 오류

**원인 1: Supabase 환경 변수 미설정**
- Vercel 대시보드에서 환경 변수 확인
- 재배포 필요

**원인 2: RLS 정책 문제**
```sql
-- reports 테이블 RLS 확인
SELECT * FROM pg_policies WHERE tablename = 'reports';

-- 사용자별 조회 정책 확인
CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id);
```

**원인 3: 쿠키/세션 문제**
- 브라우저 캐시 및 쿠키 삭제
- 다시 로그인

**원인 4: 데이터베이스 연결 문제**
- Vercel 함수 로그 확인: `https://vercel.com/[your-username]/[project]/logs`
- Supabase 프로젝트 상태 확인

## 디버깅

### Vercel 로그 확인
```bash
vercel logs [deployment-url]
```

### 실시간 로그 모니터링
Vercel Dashboard > Deployments > [Latest] > Logs

### 브라우저 개발자 도구
1. Network 탭에서 API 호출 확인
2. Console에서 에러 메시지 확인
3. Application > Cookies에서 인증 토큰 확인

## 성능 최적화

### Edge Functions 설정
```typescript
export const runtime = 'edge'; // 빠른 응답
export const dynamic = 'force-dynamic'; // 동적 데이터
```

### 캐싱 전략
```typescript
export const revalidate = 60; // 60초마다 재검증
```

## 문제 해결 연락처

이슈 발생 시:
1. GitHub Issues에 버그 리포트 작성
2. Vercel 로그 스크린샷 첨부
3. 재현 단계 상세히 기술
