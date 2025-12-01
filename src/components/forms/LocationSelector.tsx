"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { ReportSchema } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

interface LocationSelectorProps {
  control: Control<ReportSchema>;
  className?: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const formatCoordinate = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(6) : "";

export default function LocationSelector({ control, className }: LocationSelectorProps) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const {
    field: locationNameField,
    fieldState: { error: locationNameError }
  } = useController({ name: "location.name", control });

  const {
    field: latitudeField,
    fieldState: { error: latitudeError }
  } = useController({
    name: "location.coordinates.latitude",
    control,
    defaultValue: undefined as unknown as number
  });

  const {
    field: longitudeField,
    fieldState: { error: longitudeError }
  } = useController({
    name: "location.coordinates.longitude",
    control,
    defaultValue: undefined as unknown as number
  });

  const hasCoordinates = useMemo(() => {
    return typeof latitudeField.value === "number" && typeof longitudeField.value === "number";
  }, [latitudeField.value, longitudeField.value]);

  // Initialize Leaflet Map directly (without Windy for report page)
  useEffect(() => {
    if (typeof window === "undefined" || !hasCoordinates || !mapContainerRef.current) return;

    // Load Leaflet CSS if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not already loaded
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!window.L || mapRef.current || !hasCoordinates) return;

      try {
        // Create map
        const map = window.L.map('report-leaflet-map', {
          center: [latitudeField.value, longitudeField.value],
          zoom: 13,
          zoomControl: true,
        });

        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Add marker
        const marker = window.L.marker([latitudeField.value, longitudeField.value])
          .addTo(map)
          .bindPopup(locationNameField.value || '활동 위치')
          .openPopup();

        markerRef.current = marker;
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setGeoError('지도를 로드하는 중 오류가 발생했습니다.');
      }
    }

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [hasCoordinates, latitudeField.value, longitudeField.value, locationNameField.value]);

  // Update map when coordinates change
  useEffect(() => {
    if (!mapRef.current || !hasCoordinates || !window.L) return;

    try {
      // Update map center
      mapRef.current.setView([latitudeField.value, longitudeField.value], 13);

      // Remove old marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const marker = window.L.marker([latitudeField.value, longitudeField.value])
        .addTo(mapRef.current)
        .bindPopup(locationNameField.value || '활동 위치')
        .openPopup();

      markerRef.current = marker;
    } catch (error) {
      console.error('Failed to update map:', error);
    }
  }, [latitudeField.value, longitudeField.value, locationNameField.value, hasCoordinates]);

  const handleUseCurrentLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError("현재 브라우저에서 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setGeoError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        latitudeField.onChange(lat);
        longitudeField.onChange(lng);

        if (!locationNameField.value) {
          locationNameField.onChange('현재 위치');
        }

        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "위치 접근이 거부되었습니다."
            : "현재 위치를 가져올 수 없습니다.";
        setGeoError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [latitudeField, longitudeField, locationNameField]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGeoError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setGeoError('위치 검색에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    latitudeField.onChange(lat);
    longitudeField.onChange(lon);
    locationNameField.onChange(result.display_name);

    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className={cn("space-y-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-300">신고 위치 정보</p>
          <p className="text-xs text-slate-500">주소를 검색하거나 현재 위치를 불러오세요.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleUseCurrentLocation}
          isLoading={isLocating}
          data-testid="use-current-location"
        >
          📍 현재 위치 사용
        </Button>
      </div>

      {/* Address Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">위치 검색</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 부산 해운대 해수욕장"
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSearch}
            isLoading={isSearching}
          >
            검색
          </Button>
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 border-b border-slate-800 last:border-b-0"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        label="활동 위치"
        placeholder="예: 부산 해운대 해수욕장"
        error={locationNameError?.message}
        {...locationNameField}
        value={locationNameField.value ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="위도"
          readOnly
          error={latitudeError?.message}
          value={formatCoordinate(latitudeField.value)}
          placeholder="위도"
        />
        <Input
          label="경도"
          readOnly
          error={longitudeError?.message}
          value={formatCoordinate(longitudeField.value)}
          placeholder="경도"
        />
      </div>

      {geoError && <p className="text-sm text-rose-400" role="alert">{geoError}</p>}

      {/* Map Preview */}
      <div
        aria-label="지도 미리보기"
        data-testid="map-preview"
        className={cn(
          "overflow-hidden rounded-2xl border border-slate-800",
          hasCoordinates ? "h-64" : "h-40 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950"
        )}
      >
        {hasCoordinates ? (
          <div
            id="report-leaflet-map"
            ref={mapContainerRef}
            className="w-full h-full"
          />
        ) : (
          <p className="text-sm text-slate-500">위치를 검색하거나 입력하면 지도가 표시됩니다.</p>
        )}
      </div>
    </section>
  );
}
