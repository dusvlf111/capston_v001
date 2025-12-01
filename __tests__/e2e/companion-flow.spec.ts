import { test, expect } from '@playwright/test';

test.describe('Report Companion Flow', () => {
    test('should allow adding and submitting companion details', async ({ page }) => {
        // 1. Mock API responses
        await page.route('/api/report/submit', async (route) => {
            const requestBody = JSON.parse(route.request().postData() || '{}');

            // Verify companions data is sent correctly
            if (!requestBody.companions || requestBody.companions.length !== 1) {
                await route.fulfill({ status: 400, body: JSON.stringify({ message: 'Companions data missing or incorrect' }) });
                return;
            }

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'RPT-COMP-001',
                    reportId: 'RPT-COMP-001',
                    status: 'APPROVED',
                    safetyScore: 90,
                    location: requestBody.location,
                    activity: requestBody.activity,
                    contact: requestBody.contact,
                    companions: requestBody.companions
                }),
            });
        });

        // 2. Navigate to the test report page (bypass auth)
        await page.goto('/test-report');

        // 3. Fill Location
        await page.fill('input[placeholder="장소명을 입력하세요"]', 'Test Beach');

        // 4. Fill Activity
        await page.fill('input[name="activity.startTime"]', '2024-01-01T10:00');
        await page.fill('input[name="activity.endTime"]', '2024-01-01T12:00');

        // 5. Fill Contact
        await page.fill('input[name="contact.name"]', 'Reporter Name');
        await page.fill('input[name="contact.phone"]', '010-1234-5678');
        await page.fill('input[name="contact.emergencyContact"]', '010-9876-5432');

        // 6. Add Companion
        await page.click('button:has-text("함께하는 사람 추가")');

        // Check if fields appear
        await expect(page.locator('input[name="companions.0.name"]')).toBeVisible();

        // Fill Companion Details
        await page.fill('input[name="companions.0.name"]', 'Companion One');
        await page.fill('input[name="companions.0.phone"]', '010-1111-2222');
        await page.fill('input[name="companions.0.emergencyContact"]', '010-3333-4444');

        // 7. Submit
        await page.click('button[type="submit"]');

        // 8. Verify Success
        await expect(page.locator('text=신고가 접수되었습니다')).toBeVisible();
        await expect(page.locator('text=RPT-COMP-001')).toBeVisible();
    });
});
