import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    applySourceMapWarningFilter,
    shouldSuppressSourceMapWarning,
    __resetSourceMapWarningFilterForTest,
} from '../../instrumentation';

const ORIGINAL_EMIT = process.emitWarning;
const WARNING_SAMPLE = 'Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed';

describe('instrumentation source map warning filter', () => {
    afterEach(() => {
        __resetSourceMapWarningFilterForTest();
        process.emitWarning = ORIGINAL_EMIT;
    });

    it('detects patterns that should be suppressed', () => {
        expect(shouldSuppressSourceMapWarning(WARNING_SAMPLE)).toBe(true);
        expect(shouldSuppressSourceMapWarning(new Error(WARNING_SAMPLE))).toBe(true);
        expect(shouldSuppressSourceMapWarning({ message: WARNING_SAMPLE })).toBe(true);
        expect(shouldSuppressSourceMapWarning('benign warning')).toBe(false);
    });

    it('prevents invalid warnings from hitting the original emitter', () => {
        const forwarded = vi.fn();
        process.emitWarning = forwarded as unknown as typeof process.emitWarning;

        applySourceMapWarningFilter();

        process.emitWarning('benign warning');
        expect(forwarded).toHaveBeenCalledWith('benign warning');

        forwarded.mockClear();
        process.emitWarning(WARNING_SAMPLE);
        expect(forwarded).not.toHaveBeenCalled();

        forwarded.mockClear();
        process.emitWarning(new Error(WARNING_SAMPLE));
        expect(forwarded).not.toHaveBeenCalled();

        applySourceMapWarningFilter();
        process.emitWarning('still works');
        expect(forwarded).toHaveBeenCalledWith('still works');
    });
});
