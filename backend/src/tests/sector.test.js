/**
 * Tests for backend/src/utils/sector.js
 */
import { describe, it, expect } from 'vitest';
import { sanitizeSector } from '../utils/sector.js';

describe('sanitizeSector', () => {
  it('should return array for a plain string', () => {
    expect(sanitizeSector('Secretaria de Saúde')).toEqual(['Secretaria de Saúde']);
  });

  it('should return the same array if already an array', () => {
    const input = ['Saúde', 'Educação'];
    expect(sanitizeSector(input)).toBe(input);
  });

  it('should parse a JSON string array', () => {
    expect(sanitizeSector('["Saúde", "Educação"]')).toEqual(['Saúde', 'Educação']);
  });

  it('should return [string] if JSON parsing gives a non-array', () => {
    expect(sanitizeSector('"Saúde"')).toEqual(['Saúde']);
  });

  it('should return empty array for null', () => {
    expect(sanitizeSector(null)).toEqual([]);
  });

  it('should return empty array for undefined', () => {
    expect(sanitizeSector(undefined)).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(sanitizeSector('')).toEqual([]);
  });

  it('should return [sector] if JSON parsing fails on malformed string', () => {
    expect(sanitizeSector('{broken json}')).toEqual(['{broken json}']);
  });
});
