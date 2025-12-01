import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { reportService } from '../reportService';
import type { ReportRequest, ReportResponse } from '@/types/api';

describe('reportService', () => {
    const mockReportRequest: ReportRequest = {
        location: {
            name: 'Test Location',
            coordinates: { latitude: 37.5, longitude: 129.0 },
        },
        activity: {
            type: '패들보드',
            startTime: '2023-01-01T10:00:00Z',
            endTime: '2023-01-01T12:00:00Z',
            participants: 2,
        },
        contact: {
            name: 'Test User',
            phone: '010-1234-5678',
            emergencyContact: '010-9876-5432',
        },
    };

    const mockReportResponse: ReportResponse = {
        id: 'RPT-20230101-001',
        reportId: 'RPT-20230101-001',
        userId: 'user-123',
        status: 'APPROVED',
        safetyScore: 85,
        submittedAt: '2023-01-01T09:00:00Z',
        ...mockReportRequest,
    };

    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('submitReport', () => {
        it('should submit a report successfully', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockReportResponse,
            });

            const result = await reportService.submitReport(mockReportRequest);

            expect(global.fetch).toHaveBeenCalledWith('/api/report/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockReportRequest),
            });
            expect(result).toEqual(mockReportResponse);
        });

        it('should throw an error when submission fails', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({ message: 'Invalid data' }),
            });

            await expect(reportService.submitReport(mockReportRequest)).rejects.toThrow('Invalid data');
        });
    });

    describe('getReportById', () => {
        it('should fetch a report by ID', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockReportResponse,
            });

            const result = await reportService.getReportById('RPT-20230101-001');

            expect(global.fetch).toHaveBeenCalledWith('/api/report/RPT-20230101-001');
            expect(result).toEqual(mockReportResponse);
        });

        it('should throw an error when fetch fails', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Report not found' }),
            });

            await expect(reportService.getReportById('invalid-id')).rejects.toThrow('Report not found');
        });
    });

    describe('getReportHistory', () => {
        it('should fetch report history', async () => {
            const mockHistory = [mockReportResponse];
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockHistory,
            });

            const result = await reportService.getReportHistory();

            expect(global.fetch).toHaveBeenCalledWith('/api/report/history');
            expect(result).toEqual(mockHistory);
        });

        it('should throw an error when fetch fails', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ message: 'Server error' }),
            });

            await expect(reportService.getReportHistory()).rejects.toThrow('Server error');
        });
    });
});
