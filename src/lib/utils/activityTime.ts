const DEFAULT_DURATION_MS = 60 * 60 * 1000;

export interface ActivityTimes {
  startTime: string;
  endTime: string;
}

export const getDefaultActivityTimes = (now: Date = new Date()): ActivityTimes => {
  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + DEFAULT_DURATION_MS).toISOString();
  return { startTime, endTime };
};

export const ensureEndTimeAfterStart = (
  startTime?: string,
  endTime?: string | null,
  durationMs = DEFAULT_DURATION_MS
): string | undefined => {
  if (!startTime) return endTime ?? undefined;

  const startMs = new Date(startTime).getTime();
  if (!Number.isFinite(startMs)) {
    return endTime ?? undefined;
  }

  const fallbackIso = new Date(startMs + durationMs).toISOString();

  if (!endTime) {
    return fallbackIso;
  }

  const endMs = new Date(endTime).getTime();
  if (!Number.isFinite(endMs) || endMs <= startMs) {
    return fallbackIso;
  }

  return endTime;
};
