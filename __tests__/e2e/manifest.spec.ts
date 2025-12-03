import { test, expect } from '@playwright/test';

const MANIFEST_URL = '/manifest.webmanifest';

function hasIcon(icons: Array<{ src: string; sizes: string }>, size: string) {
    return icons.some((icon) => icon.sizes === size);
}

test.describe('PWA manifest availability', () => {
    test('should respond with valid manifest metadata', async ({ request }) => {
        const response = await request.get(MANIFEST_URL);
        expect(response.status(), 'manifest should load successfully').toBe(200);

        const manifest = await response.json();
        expect(manifest.name).toContain('Capston');
        expect(manifest.start_url).toBe('/');
        expect(Array.isArray(manifest.icons)).toBeTruthy();
        expect(hasIcon(manifest.icons, '192x192')).toBeTruthy();
        expect(hasIcon(manifest.icons, '512x512')).toBeTruthy();
    });
});
