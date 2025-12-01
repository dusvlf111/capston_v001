import axios from 'axios';

const PUBLIC_DATA_KEY = process.env.NEXT_PUBLIC_DATA_PORTAL_KEY;

// Base URLs
const WEATHER_WARNING_URL = 'https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList';

export interface WeatherWarning {
    title: string;
    content: string;
    tmFc: string; // Time of forecast
}

export interface CoastGuardStation {
    name: string;
    tel: string;
    lat: number;
    lon: number;
    distance?: number; // Distance from user in km
}

// Haversine formula to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
};

// Static list of major Coast Guard stations as fallback/primary for MVP
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
    { name: '서귀포해양경찰서', tel: '064-793-2000', lat: 33.245, lon: 126.511 }
];

export const fetchWeatherWarnings = async (stnId: number = 108): Promise<WeatherWarning[]> => {
    if (PUBLIC_DATA_KEY) {
        try {
            const response = await axios.get(WEATHER_WARNING_URL, {
                params: {
                    serviceKey: decodeURIComponent(PUBLIC_DATA_KEY),
                    dataType: 'JSON',
                    numOfRows: 10,
                    pageNo: 1,
                    stnId: stnId,
                }
            });

            const items = response.data?.response?.body?.items?.item;
            if (items) {
                const list = Array.isArray(items) ? items : [items];
                return list.map((item: any) => ({
                    title: item.title || '기상 특보',
                    content: item.warnVar || item.content || '',
                    tmFc: item.tmFc || new Date().toISOString()
                }));
            }
        } catch (error) {
            console.error('Failed to fetch weather warnings:', error);
            return [];
        }
    }

    return [];
};

export const fetchCoastGuardStations = async (currentLat?: number, currentLon?: number): Promise<CoastGuardStation[]> => {
    let stations = [...MAJOR_STATIONS];

    if (currentLat && currentLon) {
        stations = stations.map(station => ({
            ...station,
            distance: calculateDistance(currentLat, currentLon, station.lat, station.lon)
        }));

        // Sort by distance
        stations.sort((a, b) => (a.distance || 99999) - (b.distance || 99999));
    }

    return stations;
};
