/**
 * Tests for public/js/color-utils.js
 */
import { describe, it, expect } from 'vitest';
import { hexToRgb } from '../public/js/color-utils.js';

describe('hexToRgb', () => {
  it('should convert full hex #3b82f6 to RGB', () => {
    const result = hexToRgb('#3b82f6');
    expect(result).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('should convert shorthand hex #fff to RGB', () => {
    const result = hexToRgb('#fff');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should convert shorthand hex #000 to RGB', () => {
    const result = hexToRgb('#000');
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('should handle hex without # prefix', () => {
    const result = hexToRgb('ff0000');
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should return fallback for null/undefined', () => {
    expect(hexToRgb(null)).toEqual({ r: 59, g: 130, b: 246 });
    expect(hexToRgb(undefined)).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('should return fallback for invalid hex', () => {
    expect(hexToRgb('#xyz')).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('should convert #0f0 (shorthand green)', () => {
    const result = hexToRgb('#0f0');
    expect(result).toEqual({ r: 0, g: 255, b: 0 });
  });
});
