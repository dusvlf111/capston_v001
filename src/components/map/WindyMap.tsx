'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';



type MapLayer = 'wind' | 'temp' | 'clouds' | 'rain' | 'waves';

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

export default function WindyMap() {
    const [showOSM, setShowOSM] = useState(false);
    const [showKHOA, setShowKHOA] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<MapLayer>('wind');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const osmLayerRef = useRef<any>(null);
    const khoaLayerRef = useRef<any>(null);
    const mapInstanceRef = useRef<any>(null);
    const windyAPIRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const isScriptLoadedRef = useRef(false);

    // Initialize Windy Map
    useEffect(() => {
        // Prevent double initialization
        if (isScriptLoadedRef.current) return;

        const existingScript = document.querySelector('script[src="https://api.windy.com/assets/map-forecast/libBoot.js"]');

        if (existingScript) {
            // Script already exists, try to initialize if windyInit is available
            if (window.windyInit && !mapInstanceRef.current) {
                initializeWindy();
            }
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
        script.async = true;
        script.onload = () => {
            isScriptLoadedRef.current = true;
            initializeWindy();
        };
        script.onerror = () => {
            console.error('Failed to load Windy script');
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup marker if exists
            if (markerRef.current && mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
            }
        };
    }, []);

    const initializeWindy = () => {
        if (!window.windyInit) return;

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

    // Toggle OSM Layer
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

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
        } else {
            if (osmLayerRef.current && mapInstanceRef.current.hasLayer(osmLayerRef.current)) {
                mapInstanceRef.current.removeLayer(osmLayerRef.current);
            }
        }
    }, [showOSM]);

    // Toggle KHOA Layer
    useEffect(() => {
        if (!mapInstanceRef.current || !window.L) return;

        if (showKHOA) {
            if (!khoaLayerRef.current) {
                const kjoKey = process.env.NEXT_PUBLIC_KHOA_OPENSEA_KEY;
                if (!kjoKey) {
                    console.warn('NEXT_PUBLIC_KHOA_OPENSEA_KEY is not set. Unable to render KHOA layer.');
                    return;
                }
                // Note: KHOA API might require HTTP or specific referrers. 
                // Using the URL pattern provided in the guide.
                const seaMapUrl = `http://www.khoa.go.kr/oceanmap/otile/tms/kov/{z}/{y}/{x}.png?apikey=${kjoKey}`;

                khoaLayerRef.current = window.L.tileLayer(seaMapUrl, {
                    maxZoom: 18,
                    opacity: 0.6,
                    zIndex: 100,
                    attribution: '© National Hydrographic and Oceanographic Agency'
                });
            }
            khoaLayerRef.current.addTo(mapInstanceRef.current);
        } else {
            if (khoaLayerRef.current && mapInstanceRef.current.hasLayer(khoaLayerRef.current)) {
                mapInstanceRef.current.removeLayer(khoaLayerRef.current);
            }
        }
    }, [showKHOA]);

    // Change Windy Layer
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

    // Address Search using Nominatim API
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

    // Navigate to selected location
    const handleSelectLocation = (result: SearchResult) => {
        if (!mapInstanceRef.current || !window.L) return;

        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Pan and zoom to location
        mapInstanceRef.current.setView([lat, lon], 12);

        // Remove existing marker if any
        if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = window.L.marker([lat, lon]).addTo(mapInstanceRef.current);
        markerRef.current.bindPopup(result.display_name).openPopup();

        // Clear search
        setSearchResults([]);
        setSearchQuery('');
    };

    // Get current location
    const handleCurrentLocation = () => {
        if (!mapInstanceRef.current) return;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    mapInstanceRef.current.setView([lat, lon], 12);

                    // Remove existing marker
                    if (markerRef.current) {
                        mapInstanceRef.current.removeLayer(markerRef.current);
                    }

                    // Add marker at current location
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
            {/* Windy map container - ID required by Windy API */}
            <div id="windy" className="w-full h-full" />

            {/* Layer Controls */}
            <div className="absolute bottom-8 right-4 z-1000 flex flex-col gap-2">
                <button
                    onClick={() => setShowKHOA(!showKHOA)}
                    className={`px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-colors ${showKHOA
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    🌊 바다지도 {showKHOA ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
    );
}
