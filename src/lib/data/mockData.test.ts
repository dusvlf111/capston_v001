import { describe, expect, it } from 'vitest';
import {
  matchRegionByLocation,
  mockSafetyZones,
  mockWeatherByRegion,
  mockFisheryNotices,
  mockShippingAlerts
} from '@/lib/data/mockData';

describe('mockData catalogues', () => {
  it('exposes multiple safety zones with coordinates', () => {
    expect(mockSafetyZones.length).toBeGreaterThanOrEqual(3);
    for (const zone of mockSafetyZones) {
      expect(zone.name.length).toBeGreaterThan(0);
      expect(typeof zone.coordinates.latitude).toBe('number');
      expect(typeof zone.coordinates.longitude).toBe('number');
      expect(zone.allowedActivities.length).toBeGreaterThan(0);
    }
  });

  it('contains regional snapshots for weather/fishery/shipping info', () => {
    const requiredRegions = ['부산', '제주', '강릉', '기본'];
    for (const region of requiredRegions) {
      expect(mockWeatherByRegion[region]).toBeDefined();
      expect(mockFisheryNotices[region]).toBeDefined();
      expect(mockShippingAlerts[region]).toBeDefined();
    }
  });

  it('matches regions by partial location text', () => {
    expect(matchRegionByLocation('부산 해운대 해수욕장')).toBe('부산');
    expect(matchRegionByLocation('제주 협재 포구 북측')).toBe('제주');
    expect(matchRegionByLocation('알 수 없는 지역')).toBe('기본');
  });
});
