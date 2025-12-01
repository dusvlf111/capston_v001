// Windy API Types and Interfaces

export interface WindyOptions {
    key: string;
    lat: number;
    lon: number;
    zoom: number;
}

export interface WindyAPI {
    map: any; // Leaflet map instance
    store: any;
    picker: any;
    utils: any;
    broadcast: any;
}

export type WindyInitCallback = (windyAPI: WindyAPI) => void;

declare global {
    interface Window {
        windyInit: (options: WindyOptions, callback: WindyInitCallback) => void;
        L: any; // Leaflet global
    }
}

/**
 * Initialize Windy API
 * @param options Windy initialization options
 * @param callback Callback function called when Windy is ready
 */
export const initWindy = (
    options: WindyOptions,
    callback: WindyInitCallback
): void => {
    if (typeof window !== 'undefined' && window.windyInit) {
        window.windyInit(options, callback);
    } else {
        console.error('Windy API not loaded');
    }
};

/**
 * Load Windy API script
 * @returns Promise that resolves when the script is loaded
 */
export const loadWindyScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window is not defined'));
            return;
        }

        // Check if script already exists
        const existing = document.querySelector(
            'script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]'
        );
        if (existing) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Windy script'));
        document.body.appendChild(script);
    });
};

/**
 * Get Windy API key from environment
 */
export const getWindyApiKey = (): string => {
    const key = process.env.NEXT_PUBLIC_WINDY_API_KEY;
    if (!key) {
        console.warn('NEXT_PUBLIC_WINDY_API_KEY is not set');
        return '';
    }
    return key;
};
