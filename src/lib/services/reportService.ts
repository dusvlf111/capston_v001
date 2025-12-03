import { ReportRequest, ReportResponse } from '@/types/api';
import type { ReportInsights } from './reportInsightsService';
import type { ReportPayload } from '@/lib/services/types/reportPayload';

export interface ReportInsightsResponse {
    id: string;
    reportNo: string;
    location: ReportPayload['location'];
    activity: ReportPayload['activity'];
    contact: ReportPayload['contact'];
    notes?: string;
    companions?: ReportPayload['companions'];
    insights: ReportInsights;
}

class ReportServiceError extends Error {
    constructor(public message: string, public status?: number, public details?: unknown) {
        super(message);
        this.name = 'ReportServiceError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: '알 수 없는 오류가 발생했습니다.' };
        }
        throw new ReportServiceError(
            errorData.message || '요청 처리 중 오류가 발생했습니다.',
            response.status,
            errorData
        );
    }
    return response.json();
}

export const reportService = {
    /**
     * 새로운 신고를 제출합니다.
     */
    async submitReport(data: ReportRequest): Promise<ReportResponse> {
        const response = await fetch('/api/report/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse<ReportResponse>(response);
    },

    /**
     * ID로 신고 상세 정보를 조회합니다.
     */
    async getReportById(id: string): Promise<ReportResponse> {
        const response = await fetch(`/api/report/${id}`);
        return handleResponse<ReportResponse>(response);
    },

    /**
     * 사용자의 신고 이력을 조회합니다.
     */
    async getReportHistory(): Promise<ReportResponse[]> {
        const response = await fetch('/api/report/history');
        return handleResponse<ReportResponse[]>(response);
    },

    async getReportInsights(id: string): Promise<ReportInsightsResponse> {
        const response = await fetch(`/api/report/${id}/insights`, {
            cache: 'no-store'
        });
        return handleResponse<ReportInsightsResponse>(response);
    }
};

export type { ReportServiceError };
