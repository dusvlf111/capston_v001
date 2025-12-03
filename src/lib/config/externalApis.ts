export const externalApiConfig = {
    windy: {
        pointForecastUrl: 'https://api.windy.com/api/point-forecast/v2',
        defaultModel: 'gfs',
        get mapKey() {
            return process.env.WINDY_API_KEY ?? '';
        },
        get pointForecastKey() {
            return process.env.WINDY_POINT_FORECAST_KEY ?? '';
        },
    },
    khoa: {
        tileUrl: 'http://www.khoa.go.kr/oceanmap/otile/tms/kov/{z}/{y}/{x}.png',
        get openSeaKey() {
            return process.env.KHOA_OPENSEA_KEY ?? '';
        },
    },
    publicData: {
        weatherWarningUrl: 'https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList',
        coastGuardUrl: 'https://apis.data.go.kr/1532000/KCG_Station_Position/getKCGStationPosition',
        get apiKey() {
            return process.env.DATA_PORTAL_KEY
                ?? process.env.DATA_PORTAL_API_KEY
                ?? '';
        },
    },
} as const;

export const decodeDataPortalKey = (key: string): string => {
    if (!key) {
        return '';
    }

    try {
        return decodeURIComponent(key);
    } catch {
        return key;
    }
};
