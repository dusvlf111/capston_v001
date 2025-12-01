import { test, expect } from '@playwright/test';

test.describe('Report Submission Flow', () => {
    test('should allow a user to submit a report', async ({ page }) => {
        // 1. Mock API responses
        await page.route('/api/report/submit', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'RPT-TEST-001',
                    reportId: 'RPT-TEST-001',
                    status: 'APPROVED',
                    safetyScore: 90,
                    location: { name: 'Test Beach', coordinates: { latitude: 35.0, longitude: 129.0 } },
                    activity: { type: '패들보드', startTime: '2023-01-01T10:00', endTime: '2023-01-01T12:00', participants: 2 },
                    contact: { name: 'Tester', phone: '010-0000-0000', emergencyContact: '010-1111-1111' }
                }),
            });
        });

        // 2. Navigate to the report page (using test route to bypass auth)
        await page.goto('/test-report');

        // 3. Fill out the form

        // Location
        await page.getByLabel('활동 위치').fill('Test Beach');

        // Mock geolocation for "Use Current Location" button
        await page.context().grantPermissions(['geolocation']);
        await page.context().setGeolocation({ latitude: 35.0, longitude: 129.0 });

        await page.getByTestId('use-current-location').click();
        // Wait for coordinates to be filled
        await expect(page.getByPlaceholder('위도')).not.toBeEmpty();

        // Activity
        await page.getByTestId('activity-패들보드').click();

        // Time inputs (datetime-local)
        const now = new Date();
        const start = new Date(now.getTime() + 3600000).toISOString().slice(0, 16); // 1 hour later
        const end = new Date(now.getTime() + 7200000).toISOString().slice(0, 16); // 2 hours later

        await page.getByTestId('activity-start').fill(start);
        await page.getByTestId('activity-end').fill(end);

        await page.getByTestId('activity-participants').fill('2');

        // Contact
        await page.getByLabel('신고자 이름').fill('Tester');
        await page.getByTestId('contact-phone').fill('010-0000-0000');
        await page.getByTestId('contact-emergency').fill('010-1111-1111');

        // 4. Submit
        await page.getByRole('button', { name: '신고 제출' }).click();

        // 5. Verify success
        await expect(page.getByText('신고가 접수되었습니다')).toBeVisible();
        await expect(page.getByText('RPT-TEST-001')).toBeVisible();
    });
});
