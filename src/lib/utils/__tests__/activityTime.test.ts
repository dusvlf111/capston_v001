import { describe, expect, it } from 'vitest';
import { ensureEndTimeAfterStart, getDefaultActivityTimes } from '../activityTime';

const ONE_HOUR_MS = 60 * 60 * 1000;

describe('getDefaultActivityTimes', () => {
  it('returns ISO strings spaced by one hour', () => {
    const fixedNow = new Date('2025-05-05T09:00:00.000Z');
    const { startTime, endTime } = getDefaultActivityTimes(fixedNow);

    expect(startTime).toBe(fixedNow.toISOString());
    expect(new Date(endTime).getTime()).toBe(new Date(startTime).getTime() + ONE_HOUR_MS);
  });
});

describe('ensureEndTimeAfterStart', () => {
  const start = '2025-05-05T09:00:00.000Z';

  it('returns fallback when endTime is missing', () => {
    const result = ensureEndTimeAfterStart(start, undefined);
    expect(result).toBeDefined();
    expect(new Date(result as string).getTime()).toBe(new Date(start).getTime() + ONE_HOUR_MS);
  });

  it('returns fallback when endTime is before start', () => {
    const result = ensureEndTimeAfterStart(start, '2025-05-05T08:30:00.000Z');
    expect(result).toBeDefined();
    expect(new Date(result as string).getTime()).toBe(new Date(start).getTime() + ONE_HOUR_MS);
  });

  it('keeps endTime when it is already valid', () => {
    const validEnd = '2025-05-05T10:30:00.000Z';
    const result = ensureEndTimeAfterStart(start, validEnd);
    expect(result).toBe(validEnd);
  });
});
