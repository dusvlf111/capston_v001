import axios from 'axios';
import { externalApiConfig, decodeDataPortalKey } from '@/lib/config/externalApis';

export interface WeatherWarning {
    title: string;
    content: string;
    tmFc: string;
}

export interface CoastGuardStation {
    name: string;
    tel: string;
    lat: number;
    lon: number;
    distance?: number;
}

const WARNING_CACHE_TTL_MS = 5 * 60 * 1000;
const STATION_CACHE_TTL_MS = 10 * 60 * 1000;

type CacheEntry<T> = {
    expiresAt: number;
    data: T;
};

const warningCache = new Map<number, CacheEntry<WeatherWarning[]>>();
let stationCache: CacheEntry<CoastGuardStation[]> | null = null;

const MAJOR_STATIONS: CoastGuardStation[] = [
    { name: '속초해양경찰서', tel: '033-634-2000', lat: 38.207, lon: 128.591 },
    { name: '동해해양경찰서', tel: '033-520-2000', lat: 37.522, lon: 129.117 },
    { name: '포항해양경찰서', tel: '054-245-2000', lat: 36.019, lon: 129.376 },
    { name: '울산해양경찰서', tel: '052-230-2000', lat: 35.519, lon: 129.376 },
    { name: '부산해양경찰서', tel: '051-664-2000', lat: 35.097, lon: 129.037 },
    { name: '창원해양경찰서', tel: '055-981-2000', lat: 35.163, lon: 128.598 },
    { name: '통영해양경찰서', tel: '055-647-2000', lat: 34.854, lon: 128.433 },
    { name: '여수해양경찰서', tel: '061-840-2000', lat: 34.738, lon: 127.738 },
    { name: '완도해양경찰서', tel: '061-550-2000', lat: 34.311, lon: 126.755 },
    { name: '목포해양경찰서', tel: '061-241-2000', lat: 34.793, lon: 126.393 },
    { name: '군산해양경찰서', tel: '063-539-2000', lat: 35.976, lon: 126.709 },
    { name: '보령해양경찰서', tel: '041-939-2000', lat: 36.333, lon: 126.544 },
    { name: '태안해양경찰서', tel: '041-950-2000', lat: 36.738, lon: 126.296 },
    { name: '평택해양경찰서', tel: '031-8046-2000', lat: 36.963, lon: 126.837 },
    { name: '인천해양경찰서', tel: '032-650-2000', lat: 37.447, lon: 126.602 },
    { name: '제주해양경찰서', tel: '064-766-2000', lat: 33.522, lon: 126.544 },
    { name: '서귀포해양경찰서', tel: '064-793-2000', lat: 33.245, lon: 126.511 },
];

const deg2rad = (deg: number) => deg * (Math.PI / 180);

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const nowIso = () => new Date().toISOString();

const coerceWarningValue = (value: unknown): string | null => {
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'number') {
        return String(value);
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    return null;
};

const normalizeWarningTime = (value?: unknown): string => {
    const source = coerceWarningValue(value);
    if (!source) {
        return nowIso();
    }

    if (/^\d{12}$/.test(source)) {
        const year = source.slice(0, 4);
        const month = source.slice(4, 6);
        const day = source.slice(6, 8);
        const hour = source.slice(8, 10);
        const minute = source.slice(10, 12);
        const iso = `${year}-${month}-${day}T${hour}:${minute}:00+09:00`;
        const date = new Date(iso);
        return Number.isNaN(date.getTime()) ? nowIso() : date.toISOString();
    }

    const parsed = new Date(source);
    return Number.isNaN(parsed.getTime()) ? nowIso() : parsed.toISOString();
};

const parseWarningItems = (items: any): WeatherWarning[] => {
    if (!items) return [];
    const list = Array.isArray(items) ? items : [items];
    return list
        .map((item: any) => ({
            title: item.title || item.warnVar || '기상 특보',
            content: item.msg || item.warnVar || item.content || '',
            tmFc: normalizeWarningTime(item.tmFc),
        }))
        .filter(Boolean);
};

const parseStationItems = (items: any): CoastGuardStation[] => {
    if (!items) return [];
    const list = Array.isArray(items) ? items : [items];
    return list
        .map((item: any) => {
            const lat = Number(item.lat ?? item.obsLctnLa);
            const lon = Number(item.lon ?? item.obsLctnLo);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                return null;
            }
            return {
                name: item.stationNm ?? item.observatoryName ?? '해양경찰 파출소',
                tel: item.tel ?? item.telNo ?? item.phone ?? '',
                lat,
                lon,
            } as CoastGuardStation;
        })
        .filter((station): station is CoastGuardStation => Boolean(station));
};

const getDataPortalKey = (): string => {
    const raw = externalApiConfig.publicData.apiKey;
    return decodeDataPortalKey(raw);
};

export const fetchWeatherWarnings = async (stnId: number = 108): Promise<WeatherWarning[]> => {
    const cached = warningCache.get(stnId);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.data;
    }

    const apiKey = getDataPortalKey();
    if (!apiKey) {
        return [];
    }

    try {
        const response = await axios.get(externalApiConfig.publicData.weatherWarningUrl, {
            params: {
                serviceKey: apiKey,
                dataType: 'JSON',
                numOfRows: 10,
                pageNo: 1,
                stnId,
            },
        });

        const warnings = parseWarningItems(response.data?.response?.body?.items?.item);
        warningCache.set(stnId, {
            data: warnings,
            expiresAt: Date.now() + WARNING_CACHE_TTL_MS,
        });
        return warnings;
    } catch (error) {
        console.error('Failed to fetch weather warnings:', error);
        return [];
    }
};

const fetchBaseStations = async (): Promise<CoastGuardStation[]> => {
    if (stationCache && stationCache.expiresAt > Date.now()) {
        return stationCache.data;
    }

    const apiKey = getDataPortalKey();
    if (!apiKey) {
        stationCache = {
            data: MAJOR_STATIONS,
            expiresAt: Date.now() + STATION_CACHE_TTL_MS,
        };
        return stationCache.data;
    }

    try {
        const response = await axios.get(externalApiConfig.publicData.coastGuardUrl, {
            params: {
                serviceKey: apiKey,
                dataType: 'JSON',
                numOfRows: 200,
                pageNo: 1,
            },
        });

        const stations = parseStationItems(response.data?.response?.body?.items?.item);
        const dataset = stations.length > 0 ? stations : MAJOR_STATIONS;
        stationCache = {
            data: dataset,
            expiresAt: Date.now() + STATION_CACHE_TTL_MS,
        };
        return dataset;
    } catch (error) {
        console.error('Failed to fetch coast guard stations:', error);
        stationCache = {
            data: MAJOR_STATIONS,
            expiresAt: Date.now() + STATION_CACHE_TTL_MS,
        };
        return stationCache.data;
    }
};

export const fetchCoastGuardStations = async (
    currentLat?: number,
    currentLon?: number
): Promise<CoastGuardStation[]> => {
    const baseStations = await fetchBaseStations();

    if (currentLat === undefined || currentLon === undefined) {
        return baseStations;
    }

    return baseStations
        .map(station => ({
            ...station,
            distance: calculateDistance(currentLat, currentLon, station.lat, station.lon),
        }))
        .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
};

export const __resetPublicDataCache = (): void => {
    warningCache.clear();
    stationCache = null;
};
