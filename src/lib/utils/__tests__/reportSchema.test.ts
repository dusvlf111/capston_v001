import { describe, expect, it } from 'vitest';
import { parseReport, reportSchema } from '../validators';

const basePayload = {
  location: {
    name: '부산 해운대',
    coordinates: {
      latitude: 35.1587,
      longitude: 129.1604
    }
  },
  activity: {
    type: '패들보드',
    startTime: new Date('2025-05-05T09:00:00Z').toISOString(),
    endTime: new Date('2025-05-05T11:00:00Z').toISOString(),
    participants: 4
  },
  contact: {
    name: '홍길동',
    phone: '010-1234-5678',
    emergencyContact: '010-8765-4321'
  },
  notes: '파고 0.5m, 기상 문제 없음'
};

describe('reportSchema', () => {
  it('accepts valid payloads', () => {
    const parsed = reportSchema.parse(basePayload);
    expect(parsed).toEqual(basePayload);
  });

  it('rejects out-of-range coordinates', () => {
    const invalid = {
      ...basePayload,
      location: {
        ...basePayload.location,
        coordinates: { latitude: 120, longitude: 200 }
      }
    };

    expect(() => reportSchema.parse(invalid)).toThrowError();
  });

  it('rejects when endTime is before startTime', () => {
    const invalid = {
      ...basePayload,
      activity: {
        ...basePayload.activity,
        endTime: new Date('2025-05-05T08:00:00Z').toISOString()
      }
    };

    expect(() => reportSchema.parse(invalid)).toThrowError(/종료 시간은 시작 시간 이후여야 합니다/);
  });

  it('rejects invalid phone formats', () => {
    const invalid = {
      ...basePayload,
      contact: {
        ...basePayload.contact,
        phone: '01012345678'
      }
    };

    expect(() => reportSchema.parse(invalid)).toThrowError(/전화번호는 010-XXXX-XXXX/);
  });

  it('rejects unsupported activity types', () => {
    const invalid = {
      ...basePayload,
      activity: {
        ...basePayload.activity,
        type: '드론서핑'
      }
    };

    expect(() => reportSchema.parse(invalid)).toThrowError();
  });
});

describe('parseReport', () => {
  it('returns typed payload', () => {
    const parsed = parseReport(basePayload);
    expect(parsed.contact.name).toBe(basePayload.contact.name);
  });
});
