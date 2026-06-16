import {
  formatBoundedNumericInput,
  normalizeMinesCount,
  parsePositiveInt,
  resolveDifficultyParameters,
} from './helpers.js';
import Glossary from './glossary.js';

describe('helpers', () => {
  describe('formatBoundedNumericInput', () => {
    test('should allow replacing a selected value with a shorter number', () => {
      expect(formatBoundedNumericInput('5', { max: 99, maxDigits: 2 })).toBe('5');
    });

    test('should limit field dimensions to two digits and 99', () => {
      expect(formatBoundedNumericInput('1234', { max: 99, maxDigits: 2 })).toBe('99');
      expect(formatBoundedNumericInput('99', { max: 99, maxDigits: 2 })).toBe('99');
    });

    test('should limit mines to three digits and 999', () => {
      expect(formatBoundedNumericInput('12345', { max: 999, maxDigits: 3 })).toBe('999');
      expect(formatBoundedNumericInput('150', { max: 999, maxDigits: 3 })).toBe('150');
    });

    test('should strip non-digit characters', () => {
      expect(formatBoundedNumericInput('1e2', { max: 99, maxDigits: 2 })).toBe('12');
    });
  });
  describe('parsePositiveInt', () => {
    test('should parse valid positive integers', () => {
      expect(parsePositiveInt('9')).toBe(9);
      expect(parsePositiveInt(16)).toBe(16);
    });

    test('should return null for empty or invalid values', () => {
      expect(parsePositiveInt('')).toBeNull();
      expect(parsePositiveInt(undefined)).toBeNull();
      expect(parsePositiveInt('abc')).toBeNull();
      expect(parsePositiveInt('0')).toBeNull();
    });
  });

  describe('normalizeMinesCount', () => {
    test('should keep requested mines when they fit the field', () => {
      expect(normalizeMinesCount(9, 9, 10)).toBe(10);
    });

    test('should clamp mines to field area minus one', () => {
      expect(normalizeMinesCount(2, 2, 5)).toBe(3);
    });
  });

  describe('resolveDifficultyParameters', () => {
    test('should resolve valid preset-like parameters', () => {
      const result = resolveDifficultyParameters(9, 9, 10);
      expect(result).toEqual({
        ok: true,
        width: 9,
        height: 9,
        mines: 10,
        requested: { width: 9, height: 9, mines: 10 },
        warnings: [],
      });
    });

    test('should reject incomplete custom parameters', () => {
      const result = resolveDifficultyParameters('', 5, 3);
      expect(result.ok).toBe(false);
      expect(result.message).toContain('filled in');
    });

    test('should reject field smaller than 2x2', () => {
      const result = resolveDifficultyParameters(1, 5, 3);
      expect(result.ok).toBe(false);
      expect(result.message).toContain('2x2');
    });

    test('should warn and adjust mines that do not fit the field', () => {
      const result = resolveDifficultyParameters(2, 2, 5);
      expect(result.ok).toBe(true);
      expect(result.mines).toBe(3);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('Using 3 mines instead');
    });

    test('should reject field dimensions above the maximum', () => {
      const result = resolveDifficultyParameters(100, 10, 5);
      expect(result.ok).toBe(false);
      expect(result.message).toContain(String(Glossary.maxFieldDimension));
    });

    test('should reject mines count above the maximum', () => {
      const result = resolveDifficultyParameters(10, 10, 1000);
      expect(result.ok).toBe(false);
      expect(result.message).toContain(String(Glossary.maxMinesCount));
    });
  });
});
