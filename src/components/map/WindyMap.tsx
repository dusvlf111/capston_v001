'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type MapLayer = 'wind' | 'temp' | 'clouds' | 'rain' | 'waves';

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

// Import Windy types
import type { WindyOptions, WindyInitCallback } from '@/lib/windy';

const WINDY_SCRIPT_SRC = 'https://api.windy.com/assets/map-forecast/libBoot.js';
const isBrowser = typeof window !== 'undefined';

const loadLeafletLibrary = async (): Promise<any | null> => {
    if (!isBrowser) return null;
    if ((window as any).L) return (window as any).L;
    try {
        const leafletModule = await import('leaflet');
        const LeafletLib = leafletModule.default ?? leafletModule;
        (window as any).L = LeafletLib;
        return LeafletLib;
    } catch (error) {
        console.error('Failed to load Leaflet library', error);
        return null;
    }
};

export default function WindyMap() {
    const [showOSM, setShowOSM] = useState(false);
    const [showKHOA, setShowKHOA] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<MapLayer>('wind');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [leafletReady, setLeafletReady] = useState(false);

    const osmLayerRef = useRef<any>(null);
    const khoaLayerRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);
    const windyAPIRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
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
        let disposed = false;

        const setup = async () => {
            const leaflet = await loadLeafletLibrary();
            if (!leaflet || disposed) {
                return;
            }
            setLeafletReady(true);
            loadWindyScript();
        };

        setup();

        return () => {
            disposed = true;
            if (markerRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current || !leafletReady || !window.L) return;

        if (showOSM) {
            if (!osmLayerRef.current) {
                osmLayerRef.current = window.L.tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '&copy; OpenStreetMap contributors',
                        opacity: 0.6,
                        maxZoom: 19,
                    }
                );
            }
            osmLayerRef.current.addTo(mapInstanceRef.current);
        } else if (osmLayerRef.current && mapInstanceRef.current.hasLayer(osmLayerRef.current)) {
            mapInstanceRef.current.removeLayer(osmLayerRef.current);
        }
    }, [showOSM, leafletReady]);

    useEffect(() => {
        if (!mapInstanceRef.current || !leafletReady || !window.L) return;

        if (showKHOA) {
            if (!khoaLayerRef.current) {
                const kjoKey = process.env.NEXT_PUBLIC_KHOA_OPENSEA_KEY;
                if (!kjoKey) {
                    console.warn('NEXT_PUBLIC_KHOA_OPENSEA_KEY is not set. Unable to render KHOA layer.');
                    return;
                }
                const seaMapUrl = `http://www.khoa.go.kr/oceanmap/otile/tms/kov/{z}/{y}/{x}.png?apikey=${kjoKey}`;

                khoaLayerRef.current = window.L.tileLayer(seaMapUrl, {
                    maxZoom: 18,
                    opacity: 0.6,
                    zIndex: 100,
                    attribution: '© National Hydrographic and Oceanographic Agency',
                });
            }
            khoaLayerRef.current.addTo(mapInstanceRef.current);
        } else if (khoaLayerRef.current && mapInstanceRef.current.hasLayer(khoaLayerRef.current)) {
            mapInstanceRef.current.removeLayer(khoaLayerRef.current);
        }
    }, [showKHOA, leafletReady]);

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

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (result: SearchResult) => {
        if (!mapInstanceRef.current || !leafletReady || !window.L) return;

        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        mapInstanceRef.current.setView([lat, lon], 12);

        if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
        }

        markerRef.current = window.L.marker([lat, lon]).addTo(mapInstanceRef.current);
        markerRef.current.bindPopup(result.display_name).openPopup();

        setSearchResults([]);
        setSearchQuery('');
    };

    const handleCurrentLocation = () => {
        if (!mapInstanceRef.current || !leafletReady) return;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    mapInstanceRef.current.setView([lat, lon], 12);

                    if (markerRef.current) {
                        mapInstanceRef.current.removeLayer(markerRef.current);
                    }

                    if (window.L) {
                        markerRef.current = window.L.marker([lat, lon]).addTo(mapInstanceRef.current);
                        markerRef.current.bindPopup('Your Current Location').openPopup();
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Unable to get your location');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <div className="relative w-full h-full">
            <div id="windy" className="w-full h-full" />
            {!leafletReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-sm text-slate-200">
                    지도 데이터를 불러오는 중입니다...
                </div>
            )}

            <div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => setShowKHOA(!showKHOA)}
                    className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-colors ${
                        showKHOA ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    🌊 바다지도 {showKHOA ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={() => setShowOSM(!showOSM)}
                    className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-colors ${
                        showOSM ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    🗺️ OSM {showOSM ? 'ON' : 'OFF'}
                </button>
                <button
                    onClick={handleCurrentLocation}
                    className="px-4 py-2 rounded-lg shadow-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                    disabled={!leafletReady}
                >
                    📍 현재 위치로 이동
                </button>
            </div>
        </div>
    );
}
