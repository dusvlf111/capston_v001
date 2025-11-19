export type ReportStatus = 'APPROVED' | 'CAUTION' | 'DENIED';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export interface LocationPayload {
  name: string;
  coordinates: Coordinates;
}

export interface ActivityPayload {
  type: string;
  startTime: string;
  endTime: string;
  participants: number;
}

export interface ContactPayload {
  name: string;
  phone: string;
  emergencyContact: string;
}

export interface ReportRequest {
  location: LocationPayload;
  activity: ActivityPayload;
  contact: ContactPayload;
  notes?: string;
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
  analysis?: Record<string, unknown>;
}
