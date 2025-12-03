import { ACTIVITY_TYPES, type ActivityType, type ContactPayload } from '@/types/api';
import type { ReportPayload, ReportPayloadMetadata } from '@/lib/services/types/reportPayload';

interface NormalizeResult {
    payload: ReportPayload;
    changed: boolean;
    issues: string[];
}

const DEFAULT_COORDINATES = { latitude: 37.5665, longitude: 126.9780 };
const ONE_HOUR_MS = 60 * 60 * 1000;

const toNumber = (value: unknown): { value: number | null; coerced: boolean } => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { value, coerced: false };
    }
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return { value: null, coerced: false };
        const parsed = Number(trimmed);
        if (!Number.isNaN(parsed)) {
            return { value: parsed, coerced: true };
        }
    }
    return { value: null, coerced: false };
};

const clampParticipants = (value: number | null): number => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.min(200, Math.max(1, Math.round(value)));
    }
    return 1;
};

const toActivityType = (value: unknown): ActivityType => {
    if (typeof value === 'string' && ACTIVITY_TYPES.includes(value as ActivityType)) {
        return value as ActivityType;
    }
    return ACTIVITY_TYPES[0];
};

const toIsoString = (value: unknown): { value: string | null; coerced: boolean } => {
    if (typeof value !== 'string') return { value: null, coerced: false };
    const trimmed = value.trim();
    if (!trimmed) return { value: null, coerced: false };

    const tryParse = (input: string): string | null => {
        const parsed = new Date(input);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toISOString();
    };

    const direct = tryParse(trimmed);
    if (direct) {
        // If original string already looked like ISO, treat as not coerced
        const looksIso = /\dT\d/.test(trimmed) && /Z$/.test(trimmed);
        return { value: direct, coerced: !looksIso };
    }

    // Attempt to append Z when missing timezone
    if (!trimmed.endsWith('Z')) {
        const appended = tryParse(`${trimmed}Z`);
        if (appended) {
            return { value: appended, coerced: true };
        }
    }

    return { value: null, coerced: false };
};

const sanitizeContactField = (value: unknown, fallback: string): { value: string; changed: boolean } => {
    if (typeof value === 'string' && value.trim().length >= 2) {
        return { value: value.trim(), changed: false };
    }
    return { value: fallback, changed: true };
};

const DEFAULT_CONTACT: ContactPayload = {
    name: '미등록 신고자',
    phone: '010-0000-0000',
    emergencyContact: '010-0000-0000',
};

const buildMetadata = (partial: ReportPayloadMetadata | undefined, issues: string[], missingCoordinates: boolean, missingSchedule: boolean, changed: boolean): ReportPayloadMetadata | undefined => {
    if (!issues.length && !missingCoordinates && !missingSchedule && !changed) {
        return partial;
    }

    return {
        ...partial,
        issues: issues.length ? issues : partial?.issues,
        missingCoordinates: missingCoordinates || partial?.missingCoordinates,
        missingSchedule: missingSchedule || partial?.missingSchedule,
        sanitizedAt: new Date().toISOString(),
    };
};

const toRecord = (value: unknown): Record<string, unknown> => {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
};

export const normalizeReportPayload = (input: unknown): NormalizeResult => {
    const stored = (typeof input === 'object' && input !== null ? (input as Partial<ReportPayload>) : {}) as Partial<ReportPayload>;
    let changed = false;
    const issues: string[] = [];

    const rawLocation = toRecord(stored.location);
    const coordinatesSource = toRecord(rawLocation.coordinates ?? rawLocation);
    const latResult = toNumber(coordinatesSource.latitude ?? coordinatesSource.lat);
    const lonResult = toNumber(coordinatesSource.longitude ?? coordinatesSource.lon);
    const hasValidCoordinates = latResult.value !== null && lonResult.value !== null;
    if (latResult.coerced || lonResult.coerced) {
        changed = true;
    }
    if (!hasValidCoordinates) {
        issues.push('missing-coordinates');
    }

    const activitySource = toRecord(stored.activity);
    const startResult = toIsoString(activitySource.startTime ?? stored.activity?.startTime);
    const endResult = toIsoString(activitySource.endTime ?? stored.activity?.endTime);

    const fallbackStart = new Date().toISOString();
    const startTime = startResult.value ?? fallbackStart;
    let endTime = endResult.value ?? new Date(new Date(startTime).getTime() + ONE_HOUR_MS).toISOString();
    let missingSchedule = false;

    if (!startResult.value || startResult.coerced) {
        changed = changed || Boolean(startResult.value);
        missingSchedule = missingSchedule || !startResult.value;
    }
    if (!endResult.value || endResult.coerced) {
        changed = changed || Boolean(endResult.value);
        missingSchedule = missingSchedule || !endResult.value;
    }

    if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
        endTime = new Date(new Date(startTime).getTime() + ONE_HOUR_MS).toISOString();
        missingSchedule = true;
        issues.push('end-time-before-start');
    }

    const participantsResult = toNumber(activitySource.participants ?? stored.activity?.participants);
    if (participantsResult.coerced) changed = true;
    const participants = clampParticipants(participantsResult.value);

    const locationName = typeof rawLocation.name === 'string' && rawLocation.name.trim().length > 0
        ? rawLocation.name.trim()
        : '미등록 위치';
    if (!rawLocation.name) {
        issues.push('missing-location-name');
    }

    const contactSource = toRecord(stored.contact);
    const nameField = sanitizeContactField(contactSource.name, DEFAULT_CONTACT.name);
    const phoneField = sanitizeContactField(contactSource.phone, DEFAULT_CONTACT.phone);
    const emergencyField = sanitizeContactField(contactSource.emergencyContact, DEFAULT_CONTACT.emergencyContact);
    if (nameField.changed || phoneField.changed || emergencyField.changed) {
        changed = true;
        issues.push('missing-contact');
    }

    const rawCompanions = stored.companions as unknown;
    const companions = Array.isArray(rawCompanions)
        ? rawCompanions
            .map((companion) => {
                if (typeof companion !== 'object' || companion === null) return null;
                const record = companion as Record<string, unknown>;
                const name = typeof record.name === 'string' ? record.name.trim() : '';
                const phone = typeof record.phone === 'string' ? record.phone.trim() : '';
                const emergency = typeof record.emergencyContact === 'string' ? record.emergencyContact.trim() : '';
                if (!name || !phone || !emergency) return null;
                return { name, phone, emergencyContact: emergency };
            })
            .filter((companion): companion is NonNullable<typeof companion> => Boolean(companion))
        : undefined;

    const payload: ReportPayload = {
        location: {
            name: locationName,
            coordinates: {
                latitude: hasValidCoordinates ? (latResult.value as number) : DEFAULT_COORDINATES.latitude,
                longitude: hasValidCoordinates ? (lonResult.value as number) : DEFAULT_COORDINATES.longitude,
            },
            weatherStationId: typeof rawLocation.weatherStationId === 'number' ? rawLocation.weatherStationId : undefined,
        },
        activity: {
            type: toActivityType(activitySource.type),
            startTime,
            endTime,
            participants,
        },
        contact: {
            name: nameField.value,
            phone: phoneField.value,
            emergencyContact: emergencyField.value,
        },
        notes: typeof stored.notes === 'string' ? stored.notes : undefined,
        companions,
        safety_analysis: stored.safety_analysis,
        environmental_data: stored.environmental_data,
        ai_report: stored.ai_report ?? null,
        metadata: buildMetadata(stored.metadata, issues, !hasValidCoordinates, missingSchedule, changed),
    };

    return {
        payload,
        changed: changed || issues.length > 0,
        issues,
    };
};
