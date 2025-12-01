export type ReportStatus = 'APPROVED' | 'CAUTION' | 'DENIED';

export const ACTIVITY_TYPES = [
  '패들보드',
  '카약',
  '윈드서핑',
  '서핑',
  '요트',
  '스쿠버다이빙',
  '스노클링',
  '수상오토바이',
  '카누',
  '세일링'
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface LocationPayload {
  name: string;
  coordinates: Coordinates;
}

export interface ActivityPayload {
  type: ActivityType;
  startTime: string;
  endTime: string;
  participants: number;
}

export interface ContactPayload {
  name: string;
  phone: string;
  emergencyContact: string;
}

export interface CompanionPayload {
  name: string;
  phone: string;
  emergencyContact: string;
}

export interface ReportRequest {
  location: LocationPayload;
  activity: ActivityPayload;
  contact: ContactPayload;
  notes?: string;
  companions?: CompanionPayload[];
}

export interface ReportResponse {
  id: string;
  reportId: string;
  userId: string;
  status: ReportStatus;
  safetyScore: number;
  submittedAt: string;
  location: LocationPayload;
  activity: ActivityPayload;
  contact: ContactPayload;
  notes?: string;
  analysis?: Record<string, unknown>;
  safety_analysis?: SafetyAnalysisResult;
}

export interface SafetyRiskFactor {
  type: 'WEATHER' | 'RESTRICTED_AREA' | 'TRAFFIC' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
}

export interface SafetyAnalysisResult {
  score: number;
  level: 'GREEN' | 'YELLOW' | 'RED';
  risk_factors: SafetyRiskFactor[];
  recommendations: string[];
}
