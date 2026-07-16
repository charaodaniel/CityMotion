/**
 * Tests for public/js/format-utils.js
 */
import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, formatNumber, formatDateTime } from '../public/js/format-utils.js';

describe('formatDate', () => {
  it('should format a valid date string', () => {
    expect(formatDate(new Date(2026, 6, 15))).toBe('15/07/2026');
  });

  it('should format a Date object', () => {
    expect(formatDate(new Date(2026, 0, 1))).toBe('01/01/2026');
  });

  it('should return "-" for null', () => {
    expect(formatDate(null)).toBe('-');
  });

  it('should return "-" for undefined', () => {
    expect(formatDate(undefined)).toBe('-');
  });

  it('should return "-" for empty string', () => {
    expect(formatDate('')).toBe('-');
  });

  it('should return "-" for invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('-');
  });

  it('should accept custom toLocaleDateString options', () => {
    const result = formatDate('2026-07-15', { month: 'long', year: 'numeric' });
    expect(result).toContain('julho');
    expect(result).toContain('2026');
  });
});

describe('formatCurrency', () => {
  it('should format a number as BRL currency', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });

  it('should format zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('should handle string numbers', () => {
    expect(formatCurrency('500')).toBe('R$ 500,00');
  });

  it('should handle null/undefined', () => {
    expect(formatCurrency(null)).toBe('R$ 0,00');
    expect(formatCurrency(undefined)).toBe('R$ 0,00');
  });

  it('should format negative values', () => {
    const result = formatCurrency(-100);
    expect(result).toContain('R$');
    expect(result).toContain('100');
  });
});

describe('formatNumber', () => {
  it('should format a number with 2 decimal places', () => {
    expect(formatNumber(1234.5)).toBe('1.234,50');
  });

  it('should format zero', () => {
    expect(formatNumber(0)).toBe('0,00');
  });

  it('should handle null/undefined', () => {
    expect(formatNumber(null)).toBe('0,00');
    expect(formatNumber(undefined)).toBe('0,00');
  });
});

describe('formatDateTime', () => {
  it('should format a valid date string', () => {
    const result = formatDateTime('2026-07-15T10:30:00');
    expect(result).toContain('15/07/2026');
    expect(result).toContain('10:30');
  });

  it('should return "-" for null', () => {
    expect(formatDateTime(null)).toBe('-');
  });

  it('should return "-" for undefined', () => {
    expect(formatDateTime(undefined)).toBe('-');
  });

  it('should return "-" for invalid date', () => {
    expect(formatDateTime('garbage')).toBe('-');
  });
});
