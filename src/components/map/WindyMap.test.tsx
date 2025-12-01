import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WindyMap from './WindyMap';

describe('WindyMap', () => {
    let mockMap: any;
    let mockWindyAPI: any;
    let mockTileLayer: any;

    beforeEach(() => {
        // Clean up any existing scripts
        const existingScripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        existingScripts.forEach(script => script.remove());

        // Mock map instance
        mockMap = {
            removeLayer: vi.fn(),
        };

        // Mock Windy API
        mockWindyAPI = {
            map: mockMap,
        };

        // Mock window.windyInit with callback execution
        window.windyInit = vi.fn((options, callback) => {
            // Simulate successful initialization
            callback(mockWindyAPI);
        });

        // Mock Leaflet tile layer
        mockTileLayer = {
            addTo: vi.fn(),
            remove: vi.fn(),
        };

        // Mock window.L
        window.L = {
            tileLayer: vi.fn().mockReturnValue(mockTileLayer),
        };

        // Mock environment variable
        process.env.NEXT_PUBLIC_WINDY_API_KEY = 'test-api-key';
    });

    afterEach(() => {
        vi.restoreAllMocks();
        // Clean up scripts
        const scripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        scripts.forEach(script => script.remove());
    });

    it('renders the map container', () => {
        const { container } = render(<WindyMap />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders OpenStreetMap toggle checkbox', () => {
        const { getByRole } = render(<WindyMap />);
        const checkbox = getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it('adds Windy API script to document', () => {
        render(<WindyMap />);

        const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        expect(script).toBeTruthy();
        expect(script?.getAttribute('async')).toBe('');
    });

    it('does not add duplicate scripts', () => {
        const { rerender } = render(<WindyMap />);
        rerender(<WindyMap />);

        const scripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        expect(scripts.length).toBe(1);
    });

    it('initializes Windy API with correct options on script load', () => {
        render(<WindyMap />);

        const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');

        // Simulate script load
        if (script) {
            fireEvent.load(script);
        }

        expect(window.windyInit).toHaveBeenCalledWith(
            expect.objectContaining({
                key: 'test-api-key',
                lat: 36.5,
                lon: 127.5,
                zoom: 7,
            }),
            expect.any(Function)
        );
    });

    it('stores map instance after initialization', () => {
        const { container } = render(<WindyMap />);

        const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');

        if (script) {
            fireEvent.load(script);
        }

        // Map instance should be stored in ref (not directly testable, but windyInit was called)
        expect(window.windyInit).toHaveBeenCalled();
    });

    it('toggles OpenStreetMap layer on checkbox change', async () => {
        const { getByRole } = render(<WindyMap />);

        // Initialize the map first
        const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        if (script) {
            fireEvent.load(script);
        }

        const checkbox = getByRole('checkbox');

        // Enable OSM layer
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(window.L.tileLayer).toHaveBeenCalledWith(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                expect.objectContaining({
                    attribution: '&copy; OpenStreetMap contributors',
                    opacity: 0.7
                })
            );
            expect(mockTileLayer.addTo).toHaveBeenCalledWith(mockMap);
        });

        // Disable OSM layer
        fireEvent.click(checkbox);

        await waitFor(() => {
            expect(mockMap.removeLayer).toHaveBeenCalledWith(mockTileLayer);
        });
    });

    it('creates OSM layer only once', async () => {
        const { getByRole } = render(<WindyMap />);

        // Initialize the map
        const script = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        if (script) {
            fireEvent.load(script);
        }

        const checkbox = getByRole('checkbox');

        // Toggle on/off/on
        fireEvent.click(checkbox); // on
        await waitFor(() => expect(mockTileLayer.addTo).toHaveBeenCalledTimes(1));

        fireEvent.click(checkbox); // off
        fireEvent.click(checkbox); // on again

        await waitFor(() => {
            // tileLayer should be called only once (reused)
            expect(window.L.tileLayer).toHaveBeenCalledTimes(1);
            // But addTo should be called twice (on, then on again)
            expect(mockTileLayer.addTo).toHaveBeenCalledTimes(2);
        });
    });
});
