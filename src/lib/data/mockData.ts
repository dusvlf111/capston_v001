import type { Coordinates } from '@/types/api';

type AdvisoryLevel = 'GREEN' | 'YELLOW' | 'RED';

type SafetyZone = {
  id: string;
  name: string;
  region: string;
  level: AdvisoryLevel;
  coordinates: Coordinates;
  allowedActivities: string[];
  restrictions: string[];
  notes: string;
};

export const mockSafetyZones: SafetyZone[] = [
  {
    id: 'zone-haeundae',
    name: '부산 해운대 안전관리 구역',
    region: '부산',
    level: 'GREEN',
    coordinates: { latitude: 35.1587, longitude: 129.1604 },
    allowedActivities: ['패들보드', '카약', '요트'],
    restrictions: ['야간(21시~) 운항 금지', '풍속 12m/s 이상 시 즉시 통제'],
    notes: '부산 해양경찰서 통제 구역, 해운대구청과 합동 모니터링'
  },
  {
    id: 'zone-jeju',
    name: '제주 협재 연안 완충구역',
    region: '제주',
    level: 'YELLOW',
    coordinates: { latitude: 33.3936, longitude: 126.2391 },
    allowedActivities: ['스노클링', '카약'],
    restrictions: ['어업권 보호 구역 통과 금지', '파고 2m 초과 시 전면 금지'],
    notes: '한림어촌계 협의 필요, 조류 변화가 잦음'
  },
  {
    id: 'zone-gangneung',
    name: '강릉 주문진 안전 감시 구역',
    region: '강릉',
    level: 'YELLOW',
    coordinates: { latitude: 37.8923, longitude: 128.8246 },
    allowedActivities: ['윈드서핑', '패들보드'],
    restrictions: ['북동풍 14m/s 이상 시 운항 금지', '어선 항로와 교차 시 감속 필수'],
    notes: '주문진항 어선 출입 집중 시간(04~06시) 회피 권장'
  }
];

type WeatherSnapshot = {
  region: string;
  summary: string;
  windSpeed: number;
  waveHeight: number;
  visibility: number;
  advisoryLevel: AdvisoryLevel;
  timestamp: string;
};

export const mockWeatherByRegion: Record<string, WeatherSnapshot> = {
  부산: {
    region: '부산',
    summary: '약한 남동풍과 잔잔한 해수면',
    windSpeed: 8,
    waveHeight: 0.7,
    visibility: 14,
    advisoryLevel: 'GREEN',
    timestamp: '2025-11-20T08:00:00+09:00'
  },
  제주: {
    region: '제주',
    summary: '국지성 돌풍과 1.5m 파고',
    windSpeed: 14,
    waveHeight: 1.5,
    visibility: 10,
    advisoryLevel: 'YELLOW',
    timestamp: '2025-11-20T08:00:00+09:00'
  },
  강릉: {
    region: '강릉',
    summary: '북동풍이 강해 체감 풍속 증가',
    windSpeed: 16,
    waveHeight: 1.2,
    visibility: 12,
    advisoryLevel: 'YELLOW',
    timestamp: '2025-11-20T08:00:00+09:00'
  },
  기본: {
    region: '전국 공통',
    summary: '특이사항 없음',
    windSpeed: 6,
    waveHeight: 0.5,
    visibility: 15,
    advisoryLevel: 'GREEN',
    timestamp: '2025-11-20T08:00:00+09:00'
  }
};

type FisheryNotice = {
  hasRestriction: boolean;
  message: string;
  updatedAt: string;
};

export const mockFisheryNotices: Record<string, FisheryNotice> = {
  부산: {
    hasRestriction: false,
    message: '11월 3주차 별도 어업권 통제 없음',
    updatedAt: '2025-11-18T00:00:00+09:00'
  },
  제주: {
    hasRestriction: true,
    message: '11/20~11/24 협재 연안 전복양식장 접근 금지',
    updatedAt: '2025-11-19T00:00:00+09:00'
  },
  강릉: {
    hasRestriction: true,
    message: '주문진 연안 통발 어선 작업 구간 접근 제한',
    updatedAt: '2025-11-19T00:00:00+09:00'
  },
  기본: {
    hasRestriction: false,
    message: '등록된 어업권 통제 정보가 없습니다.',
    updatedAt: '2025-11-15T00:00:00+09:00'
  }
};

type ShippingAlert = {
  routes: string[];
  caution: string;
  updatedAt: string;
};

export const mockShippingAlerts: Record<string, ShippingAlert> = {
  부산: {
    routes: ['해운대 ↔ 수영만 요트경기장', '오륙도 ↔ 동백섬 순환 항로'],
    caution: '관광 유람선 혼잡 시간(13~17시) 충돌 회피 주의',
    updatedAt: '2025-11-20T06:00:00+09:00'
  },
  제주: {
    routes: ['한림항 ↔ 협재 포구', '차귀도 낚시 전용 항로'],
    caution: '서북서풍 영향으로 왕복 속도 저하 예상',
    updatedAt: '2025-11-20T06:00:00+09:00'
  },
  강릉: {
    routes: ['주문진항 ↔ 연곡천 하구', '안목항 ↔ 남항진 해수욕장'],
    caution: '어선 입출항 집중 시간(04~07시) 감속 권장',
    updatedAt: '2025-11-20T06:00:00+09:00'
  },
  기본: {
    routes: ['전국 연안 항로 정보 없음'],
    caution: '등록된 항로 주의 정보가 없습니다.',
    updatedAt: '2025-11-18T06:00:00+09:00'
  }
};

export function matchRegionByLocation(locationName: string): string {
  const regions = Object.keys(mockWeatherByRegion);
  const found = regions.find((region) => region !== '기본' && locationName.includes(region));
  return found ?? '기본';
}
