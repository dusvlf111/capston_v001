import { describe, expect, it } from 'vitest';
import { ACTIVITY_TYPES } from '@/types/api';

describe('ACTIVITY_TYPES', () => {
  it('contains the minimum supported activities', () => {
    expect(ACTIVITY_TYPES).toContain('패들보드');
    expect(ACTIVITY_TYPES).toContain('카약');
    expect(ACTIVITY_TYPES.length).toBeGreaterThanOrEqual(5);
  });

  it('has no duplicated entries', () => {
    const unique = new Set(ACTIVITY_TYPES);
    expect(unique.size).toBe(ACTIVITY_TYPES.length);
  });
});
