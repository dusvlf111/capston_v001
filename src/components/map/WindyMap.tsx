'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

declare global {
    interface Window {
        windyInit: (options: any, callback: (windyAPI: any) => void) => void;
        L: any;
    }
}

export default function WindyMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [showOSM, setShowOSM] = useState(false);
    const osmLayerRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Check if script is already added
        if (document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]')) {
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
        script.async = true;
        script.onload = () => {
            if (window.windyInit) {
                const options = {
                    key: process.env.NEXT_PUBLIC_WINDY_API_KEY,
                    lat: 36.5,
                    lon: 127.5,
                    zoom: 7,
                };

                window.windyInit(options, (windyAPI: any) => {
                    const { map } = windyAPI;
                    mapInstanceRef.current = map;
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup script if needed, but usually we keep it for SPA navigation
            // if (script.parentNode) {
            //   script.parentNode.removeChild(script);
            // }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        if (showOSM) {
            if (!osmLayerRef.current) {
                osmLayerRef.current = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                    opacity: 0.7
                });
            }
            osmLayerRef.current.addTo(mapInstanceRef.current);
        } else {
            if (osmLayerRef.current) {
                mapInstanceRef.current.removeLayer(osmLayerRef.current);
            }
        }
    }, [showOSM]);

    return (
        <div className="relative w-full h-screen">
            <div ref={mapRef} className="w-full h-full" />
            <div className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded shadow">
                <label className="flex items-center space-x-2 cursor-pointer text-black">
                    <input
                        type="checkbox"
                        checked={showOSM}
                        onChange={(e) => setShowOSM(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span>Show OpenStreetMap</span>
                </label>
            </div>
        </div>
    );
}
