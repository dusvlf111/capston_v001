import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    applySourceMapWarningFilter,
    shouldSuppressSourceMapWarning,
    __resetSourceMapWarningFilterForTest,
} from '../instrumentation';

const REAL_EMIT = process.emitWarning;
const WARNING_TEXT = 'Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed';

describe('source map warning filter', () => {
    afterEach(() => {
        __resetSourceMapWarningFilterForTest();
        process.emitWarning = REAL_EMIT;
    });

    it('detects source map warnings from different inputs', () => {
        expect(shouldSuppressSourceMapWarning(WARNING_TEXT)).toBe(true);
        expect(shouldSuppressSourceMapWarning(new Error(WARNING_TEXT))).toBe(true);
        expect(shouldSuppressSourceMapWarning({ message: WARNING_TEXT })).toBe(true);
        expect(shouldSuppressSourceMapWarning('benign warning')).toBe(false);
    });

    it('prevents noisy warnings from reaching the original emitter', () => {
        const forwarded = vi.fn();
        process.emitWarning = forwarded as unknown as typeof process.emitWarning;

        applySourceMapWarningFilter();

        process.emitWarning('benign warning');
        expect(forwarded).toHaveBeenCalledWith('benign warning');

        forwarded.mockClear();
        process.emitWarning(WARNING_TEXT);
        expect(forwarded).not.toHaveBeenCalled();

        forwarded.mockClear();
        process.emitWarning(new Error(WARNING_TEXT));
        expect(forwarded).not.toHaveBeenCalled();

        // calling again should be a no-op because the filter is already installed
        applySourceMapWarningFilter();
        process.emitWarning('still works');
        expect(forwarded).toHaveBeenCalledWith('still works');
    });
});
