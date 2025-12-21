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
    // Skip in Edge Runtime or when process is not available
    if (typeof process === 'undefined' || !process) {
        return;
    }

    try {
        // Dynamically access emitWarning to avoid Edge Runtime static analysis
        const emitWarningProp = 'emitWarning';
        const emitWarning = (process as any)[emitWarningProp];
        
        // Check if emitWarning exists
        if (typeof emitWarning !== 'function') {
            return;
        }

        const proc = process as PatchedProcess;
        if (proc[PATCH_FLAG]) {
            return;
        }

        const originalEmit = emitWarning.bind(process);
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
        (process as any)[emitWarningProp] = filteredEmit;
    } catch (error) {
        // Silently fail in Edge Runtime or other environments where this is not supported
        // Don't log in production to avoid noise
        if (process?.env?.NODE_ENV !== 'production') {
            console.debug?.('[instrumentation]', 'Skipped source map warning filter (not supported in this runtime)');
        }
    }
};

export async function register(): Promise<void> {
    // Wrap in try-catch to handle Edge Runtime gracefully
    try {
        // Dynamically check for emitWarning to avoid static analysis
        const emitWarningProp = 'emitWarning';
        if (typeof process !== 'undefined' && process && typeof (process as any)[emitWarningProp] === 'function') {
            applySourceMapWarningFilter();
        }
    } catch (error) {
        // Silently fail in Edge Runtime
    }
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
