const SOURCE_MAP_SIGNATURE = 'sourceMapURL could not be parsed';
const PATCH_FLAG = Symbol.for('capston.sourceMapWarningPatched');

type PatchedProcess = NodeJS.Process & {
    [PATCH_FLAG]?: {
        originalEmitWarning: typeof process.emitWarning;
    };
};

const extractMessage = (warning: unknown): string | null => {
    if (typeof warning === 'string') {
        return warning;
    }
    if (warning instanceof Error) {
        return warning.message;
    }
    if (typeof warning === 'object' && warning !== null && 'message' in warning) {
        const candidate = (warning as { message?: unknown }).message;
        return typeof candidate === 'string' ? candidate : null;
    }
    return null;
};

export const shouldSuppressSourceMapWarning = (warning: unknown): boolean => {
    const message = extractMessage(warning);
    return Boolean(message && message.includes(SOURCE_MAP_SIGNATURE));
};

export const applySourceMapWarningFilter = (): void => {
    // Skip in Edge Runtime where process.emitWarning is not available
    if (typeof process === 'undefined' || typeof process.emitWarning !== 'function') {
        return;
    }

    const proc = process as PatchedProcess;
    if (proc[PATCH_FLAG]) {
        return;
    }

    try {
        const originalEmit = process.emitWarning.bind(process);
        const filteredEmit: typeof process.emitWarning = ((warning: any, ...args: any[]) => {
            if (shouldSuppressSourceMapWarning(warning)) {
                if (process.env.NODE_ENV !== 'production') {
                    console.debug?.('[source-map]', 'Suppressed invalid source map warning');
                }
                return false;
            }
            return originalEmit(warning, ...args);
        }) as typeof process.emitWarning;

        proc[PATCH_FLAG] = { originalEmitWarning: originalEmit };
        (process as any).emitWarning = filteredEmit;
    } catch (error) {
        // Silently fail in environments where this is not supported
        console.warn('Could not apply source map warning filter:', error);
    }
};

export async function register(): Promise<void> {
    applySourceMapWarningFilter();
}

export const __resetSourceMapWarningFilterForTest = (): void => {
    const proc = process as PatchedProcess;
    const snapshot = proc[PATCH_FLAG];
    if (!snapshot) {
        return;
    }
    (process as any).emitWarning = snapshot.originalEmitWarning;
    delete proc[PATCH_FLAG];
};
