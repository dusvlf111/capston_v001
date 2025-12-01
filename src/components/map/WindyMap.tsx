'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

declare global {
    interface Window {
        windyInit: (options: any, callback: (windyAPI: any) => void) => void;
        L: any;
    }
}

type MapLayer = 'wind' | 'temp' | 'clouds' | 'rain' | 'waves';

interface SearchResult {
    display_name: string;
    lat: string;
    lon: string;
}

export default function WindyMap() {
    const [showOSM, setShowOSM] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState<MapLayer>('wind');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const osmLayerRef = useRef<any>(null);
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

        const options = {
            key: process.env.NEXT_PUBLIC_WINDY_API_KEY || 'Vn7KpbPckxNX0xdXrX3FLmFmevs8aL8C',
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

            {/* Search Panel */}
            <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-80">
                <div className="space-y-3">
                    {/* Search Input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search location..."
                            className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
                        >
                            {isSearching ? '...' : '검색'}
                        </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto border rounded">
                            {searchResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleSelectLocation(result)}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-b-0"
                                >
                                    {result.display_name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Current Location Button */}
                    <button
                        onClick={handleCurrentLocation}
                        className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <span>📍</span>
                        <span>내 위치</span>
                    </button>
                </div>
            </div>

            {/* Controls Panel */}
            <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 space-y-4">
                {/* Layer Selector */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">
                        지도 레이어
                    </label>
                    <select
                        value={selectedLayer}
                        onChange={(e) => setSelectedLayer(e.target.value as MapLayer)}
                        className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="wind">바람</option>
                        <option value="temp">온도</option>
                        <option value="clouds">구름</option>
                        <option value="rain">강수량</option>
                        <option value="waves">파도</option>
                    </select>
                </div>

                {/* OSM Toggle */}
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showOSM}
                        onChange={(e) => setShowOSM(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">OpenStreetMap 표시</span>
                </label>
            </div>
        </div>
    );
}
