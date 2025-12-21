'use client';

import { useEffect, useRef, useState } from 'react';

type MapLayer = 'wind' | 'temp' | 'clouds' | 'rain' | 'waves';

// Import Windy types
import type { WindyOptions, WindyInitCallback } from '@/lib/windy';

const WINDY_SCRIPT_SRC = 'https://api.windy.com/assets/map-forecast/libBoot.js';
const isBrowser = typeof window !== 'undefined';

export default function WindyMap() {
    const [selectedLayer, setSelectedLayer] = useState<MapLayer>('wind');
    const mapInstanceRef = useRef<any>(null);
    const windyAPIRef = useRef<any>(null);
    const isScriptLoadedRef = useRef(false);

    const initializeWindy = () => {
        if (!isBrowser || mapInstanceRef.current || !window.windyInit) {
            return;
        }

        const windyKey = process.env.NEXT_PUBLIC_WINDY_MAP_KEY;
        if (!windyKey) {
            console.warn('NEXT_PUBLIC_WINDY_MAP_KEY is not set. Windy map cannot initialize.');
            return;
        }

        const options = {
            key: windyKey,
            lat: 36.5,
            lon: 127.5,
            zoom: 7,
        };

        window.windyInit(options, (windyAPI: any) => {
            windyAPIRef.current = windyAPI;
            mapInstanceRef.current = windyAPI.map;
            console.log('Windy map initialized successfully');
        });
    };

    const loadWindyScript = () => {
        if (!isBrowser || mapInstanceRef.current) return;

        const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${WINDY_SCRIPT_SRC}"]`);
        if (existingScript) {
            if (window.windyInit) {
                initializeWindy();
            } else {
                existingScript.addEventListener('load', () => initializeWindy(), { once: true });
            }
            return;
        }

        const script = document.createElement('script');
        script.src = WINDY_SCRIPT_SRC;
        script.async = true;
        script.onload = () => {
            isScriptLoadedRef.current = true;
            initializeWindy();
        };
        script.onerror = () => {
            console.error('Failed to load Windy script');
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!isBrowser) return;

        const setup = () => {
            loadWindyScript();
        };

        setup();
    }, []);

    useEffect(() => {
        if (!windyAPIRef.current || !windyAPIRef.current.store) return;

        const layerMap: Record<MapLayer, string> = {
            wind: 'wind',
            temp: 'temp',
            clouds: 'clouds',
            rain: 'rain',
            waves: 'waves',
        };

        windyAPIRef.current.store.set('overlay', layerMap[selectedLayer]);
    }, [selectedLayer]);

    return (
        <div className="relative w-full h-full">
            <div id="windy" className="w-full h-full" />
        </div>
    );
}
