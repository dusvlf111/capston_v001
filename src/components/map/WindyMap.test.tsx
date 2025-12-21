import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockTileLayerInstance = {
    addTo: vi.fn(),
    remove: vi.fn(),
};

const mockLeaflet = {
    tileLayer: vi.fn(() => mockTileLayerInstance),
    marker: vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        bindPopup: vi.fn().mockReturnThis(),
        openPopup: vi.fn(),
    })),
};

import WindyMap from './WindyMap';

describe('WindyMap', () => {
    let mockMap: any;
    let mockWindyAPI: any;

    beforeEach(() => {
        // Clean up any existing scripts
        const existingScripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        existingScripts.forEach(script => script.remove());

        // Mock map instance
        mockMap = {
            removeLayer: vi.fn(),
            hasLayer: vi.fn(),
            setView: vi.fn(),
        };

        // Mock Windy API
        mockWindyAPI = {
            map: mockMap,
            store: {
                set: vi.fn(),
            },
        };

        // Mock window.windyInit with callback execution
        window.windyInit = vi.fn((options, callback) => {
            // Simulate successful initialization
            callback(mockWindyAPI);
        });

        // Mock Leaflet (provided by Windy's libBoot.js)
        (window as any).L = mockLeaflet;

        // Mock environment variable
        process.env.NEXT_PUBLIC_WINDY_MAP_KEY = 'test-api-key';
        mockLeaflet.tileLayer.mockClear();
        mockTileLayerInstance.addTo.mockClear();
        mockTileLayerInstance.remove.mockClear();

    });

    afterEach(() => {
        vi.restoreAllMocks();
        const scripts = document.querySelectorAll('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');
        scripts.forEach(script => script.remove());
        delete window.windyInit;
    });

    it('renders the map container', () => {
        const { container } = render(<WindyMap />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders map ref div with correct structure', () => {
        const { container } = render(<WindyMap />);

        const mapRefDiv = container.querySelector('#windy');
        expect(mapRefDiv).toBeInTheDocument();
        expect(mapRefDiv?.parentElement).toHaveClass('relative', 'w-full', 'h-full');
    });

    it('shows loading overlay while Leaflet is preparing', () => {
        const { getByText } = render(<WindyMap />);
        expect(getByText('지도 데이터를 불러오는 중입니다...')).toBeInTheDocument();
    });
});
