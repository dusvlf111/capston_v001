import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initWindy, loadWindyScript, getWindyApiKey } from './windy';

describe('Windy API Library', () => {
    beforeEach(() => {
        // Clean up scripts
        const scripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        scripts.forEach(script => script.remove());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getWindyApiKey', () => {
        it('returns API key from environment', () => {
            process.env.NEXT_PUBLIC_WINDY_API_KEY = 'test-key-123';
            const key = getWindyApiKey();
            expect(key).toBe('test-key-123');
        });

        it('returns empty string if API key is not set', () => {
            delete process.env.NEXT_PUBLIC_WINDY_API_KEY;
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const key = getWindyApiKey();
            expect(key).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith('NEXT_PUBLIC_WINDY_API_KEY is not set');
        });
    });

    describe('loadWindyScript', () => {
        it('loads Windy script successfully', async () => {
            // Mock appendChild to simulate successful load
            const originalAppendChild = document.body.appendChild;
            document.body.appendChild = vi.fn((node: any) => {
                originalAppendChild.call(document.body, node);
                // Simulate successful load immediately
                setTimeout(() => {
                    if (node.onload) node.onload();
                }, 0);
                return node;
            }) as any;

            const promise = loadWindyScript();

            await expect(promise).resolves.toBeUndefined();

            const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
            expect(script).toBeTruthy();
            expect(script?.getAttribute('async')).toBe('');

            document.body.appendChild = originalAppendChild;
        });

        it('does not load duplicate scripts', async () => {
            // Create existing script
            const existingScript = document.createElement('script');
            existingScript.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
            document.body.appendChild(existingScript);

            await loadWindyScript();

            const scripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
            expect(scripts.length).toBe(1);
        });

        it('rejects on script load error', async () => {
            // Mock appendChild to simulate error
            const originalAppendChild = document.body.appendChild;
            document.body.appendChild = vi.fn((node: any) => {
                originalAppendChild.call(document.body, node);
                // Simulate error immediately
                setTimeout(() => {
                    if (node.onerror) node.onerror();
                }, 0);
                return node;
            }) as any;

            const promise = loadWindyScript();

            await expect(promise).rejects.toThrow('Failed to load Windy script');

            document.body.appendChild = originalAppendChild;
        });
    });

    describe('initWindy', () => {
        it('calls window.windyInit with correct parameters', () => {
            const mockCallback = vi.fn();
            const mockWindyInit = vi.fn();
            window.windyInit = mockWindyInit;

            const options = {
                key: 'test-key',
                lat: 36.5,
                lon: 127.5,
                zoom: 7,
            };

            initWindy(options, mockCallback);

            expect(mockWindyInit).toHaveBeenCalledWith(options, mockCallback);
        });

        it('logs error if windyInit is not available', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            // @ts-ignore
            delete window.windyInit;

            const mockCallback = vi.fn();
            const options = {
                key: 'test-key',
                lat: 36.5,
                lon: 127.5,
                zoom: 7,
            };

            initWindy(options, mockCallback);

            expect(consoleSpy).toHaveBeenCalledWith('Windy API not loaded');
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
