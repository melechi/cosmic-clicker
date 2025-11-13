import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCompact,
  formatTime,
  formatPercent,
  parseFormattedNumber,
} from './numberFormat';

describe('formatNumber', () => {
  it('should format zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should format small numbers without abbreviation', () => {
    expect(formatNumber(5)).toBe('5');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('should format decimal numbers less than 1000', () => {
    expect(formatNumber(5.5)).toBe('5.50');
    expect(formatNumber(42.123)).toBe('42.12');
    expect(formatNumber(999.99)).toBe('999.99');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(1234)).toBe('1.23K');
    expect(formatNumber(9999)).toBe('10K'); // 9999 rounds to 10K with 2 decimals
    expect(formatNumber(50000)).toBe('50K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1M');
    expect(formatNumber(1234567)).toBe('1.23M');
    expect(formatNumber(50000000)).toBe('50M');
  });

  it('should format billions with B suffix', () => {
    expect(formatNumber(1000000000)).toBe('1B');
    expect(formatNumber(1234567890)).toBe('1.23B');
    expect(formatNumber(50000000000)).toBe('50B');
  });

  it('should format trillions with T suffix', () => {
    expect(formatNumber(1000000000000)).toBe('1T');
    expect(formatNumber(1234567890123)).toBe('1.23T');
  });

  it('should format quadrillions with Qa suffix', () => {
    expect(formatNumber(1e15)).toBe('1Qa');
    expect(formatNumber(1.5e15)).toBe('1.5Qa');
  });

  it('should format quintillions with Qi suffix', () => {
    expect(formatNumber(1e18)).toBe('1Qi');
  });

  it('should handle very large numbers', () => {
    expect(formatNumber(1e21)).toBe('1Sx');
    expect(formatNumber(1e24)).toBe('1Sp');
    expect(formatNumber(1e27)).toBe('1Oc');
    expect(formatNumber(1e30)).toBe('1No');
    expect(formatNumber(1e99)).toBe('1DTg');
  });

  it('should respect custom decimal places', () => {
    expect(formatNumber(1234, 0)).toBe('1K');
    expect(formatNumber(1234, 1)).toBe('1.2K');
    expect(formatNumber(1234, 3)).toBe('1.234K');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1.23K');
    expect(formatNumber(-1000000)).toBe('-1M');
  });

  it('should handle infinity', () => {
    expect(formatNumber(Infinity)).toBe('Infinity');
    expect(formatNumber(-Infinity)).toBe('Infinity');
  });

  it('should remove trailing zeros', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(2500)).toBe('2.5K');
    expect(formatNumber(3000000)).toBe('3M');
  });
});

describe('formatCompact', () => {
  it('should format zero', () => {
    expect(formatCompact(0)).toBe('0');
  });

  it('should format small numbers as integers', () => {
    expect(formatCompact(5)).toBe('5');
    expect(formatCompact(42.7)).toBe('42');
    expect(formatCompact(999)).toBe('999');
  });

  it('should format thousands with K suffix (rounded)', () => {
    expect(formatCompact(1000)).toBe('1K');
    expect(formatCompact(1234)).toBe('1K');
    expect(formatCompact(1999)).toBe('1K');
    expect(formatCompact(9999)).toBe('9K');
  });

  it('should format millions with M suffix (rounded)', () => {
    expect(formatCompact(1000000)).toBe('1M');
    expect(formatCompact(1499999)).toBe('1M');
    expect(formatCompact(1500000)).toBe('1M');
  });

  it('should handle negative numbers', () => {
    expect(formatCompact(-1234)).toBe('-1K');
  });

  it('should handle infinity', () => {
    expect(formatCompact(Infinity)).toBe('Infinity');
  });
});

describe('formatTime', () => {
  it('should format seconds only', () => {
    expect(formatTime(0)).toBe('0s');
    expect(formatTime(30)).toBe('30s');
    expect(formatTime(59)).toBe('59s');
  });

  it('should format minutes and seconds', () => {
    expect(formatTime(60)).toBe('1m');
    expect(formatTime(90)).toBe('1m 30s');
    expect(formatTime(119)).toBe('1m 59s');
  });

  it('should format hours and minutes (no seconds)', () => {
    expect(formatTime(3600)).toBe('1h');
    expect(formatTime(3660)).toBe('1h 1m');
    expect(formatTime(7200)).toBe('2h');
    expect(formatTime(7260)).toBe('2h 1m');
  });

  it('should not show seconds when hours are present', () => {
    expect(formatTime(3661)).toBe('1h 1m');
  });

  it('should handle large time values', () => {
    expect(formatTime(86400)).toBe('24h');
    expect(formatTime(90000)).toBe('25h');
  });
});

describe('formatPercent', () => {
  it('should format percentage with default 0 decimals', () => {
    expect(formatPercent(0)).toBe('0%');
    expect(formatPercent(0.5)).toBe('50%');
    expect(formatPercent(1)).toBe('100%');
    expect(formatPercent(0.15)).toBe('15%');
  });

  it('should format percentage with custom decimals', () => {
    expect(formatPercent(0.1234, 2)).toBe('12.34%');
    expect(formatPercent(0.5555, 2)).toBe('55.55%');
    expect(formatPercent(0.123456, 4)).toBe('12.3456%');
  });

  it('should handle values greater than 1', () => {
    expect(formatPercent(2)).toBe('200%');
    expect(formatPercent(10.5, 1)).toBe('1050.0%');
  });

  it('should handle negative percentages', () => {
    expect(formatPercent(-0.5)).toBe('-50%');
  });
});

describe('parseFormattedNumber', () => {
  it('should parse plain numbers', () => {
    expect(parseFormattedNumber('42')).toBe(42);
    expect(parseFormattedNumber('123.45')).toBe(123.45);
  });

  it('should parse K suffix', () => {
    expect(parseFormattedNumber('1K')).toBe(1000);
    expect(parseFormattedNumber('1.5K')).toBe(1500);
    expect(parseFormattedNumber('10K')).toBe(10000);
  });

  it('should parse M suffix', () => {
    expect(parseFormattedNumber('1M')).toBe(1000000);
    expect(parseFormattedNumber('2.5M')).toBe(2500000);
  });

  it('should parse B suffix', () => {
    expect(parseFormattedNumber('1B')).toBe(1000000000);
    expect(parseFormattedNumber('3.7B')).toBe(3700000000);
  });

  it('should parse T suffix', () => {
    expect(parseFormattedNumber('1T')).toBe(1000000000000);
  });

  it('should parse large suffixes', () => {
    expect(parseFormattedNumber('1Qa')).toBe(1e15);
    expect(parseFormattedNumber('1Qi')).toBe(1e18);
    expect(parseFormattedNumber('1Sx')).toBe(1e21);
  });

  it('should be inverse of formatNumber for common values', () => {
    const values = [1000, 1500, 1000000, 5000000000];
    values.forEach((value) => {
      const formatted = formatNumber(value, 2);
      const parsed = parseFormattedNumber(formatted);
      // Allow small floating point errors
      expect(Math.abs(parsed - value)).toBeLessThan(value * 0.01);
    });
  });
});

describe('formatNumber edge cases', () => {
  it('should handle numbers at threshold boundaries', () => {
    expect(formatNumber(999.99)).toBe('999.99');
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(999999)).toBe('1000K'); // 999999 / 1000 = 999.999, rounds to 1000
    expect(formatNumber(1000000)).toBe('1M');
  });

  it('should handle very small positive numbers', () => {
    expect(formatNumber(0.001)).toBe('0.00');
    expect(formatNumber(0.5)).toBe('0.50');
  });

  it('should maintain precision for game-relevant numbers', () => {
    // Building costs
    expect(formatNumber(10)).toBe('10');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(1100)).toBe('1.1K');
    expect(formatNumber(12000)).toBe('12K');
    expect(formatNumber(130000)).toBe('130K');
    expect(formatNumber(1400000)).toBe('1.4M');
    expect(formatNumber(20000000)).toBe('20M');
  });
});
