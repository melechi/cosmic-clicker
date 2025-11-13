import { describe, it, expect } from 'vitest';
import {
  calculateOfflineProgress,
  getOfflineProgressInfo,
  shouldShowOfflinePopup,
} from './offlineProgress';
import { GAME_CONFIG } from '@/constants';

describe('calculateOfflineProgress', () => {
  it('should return 0 for no time elapsed', () => {
    const now = Date.now();
    const result = calculateOfflineProgress(now, now, 10);
    expect(result).toBe(0);
  });

  it('should calculate offline progress for short duration', () => {
    const lastSave = Date.now() - 60000; // 1 minute ago
    const now = Date.now();
    const productionPerSecond = 10;

    // 60 seconds * 10 per second * 0.5 multiplier = 300
    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(result).toBe(300);
  });

  it('should calculate offline progress for 1 hour', () => {
    const lastSave = Date.now() - 3600000; // 1 hour ago
    const now = Date.now();
    const productionPerSecond = 10;

    // 3600 seconds * 10 per second * 0.5 multiplier = 18000
    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(result).toBe(18000);
  });

  it('should cap offline progress at max hours', () => {
    const maxHours = GAME_CONFIG.MAX_OFFLINE_HOURS;
    const overMaxTime = Date.now() - (maxHours + 2) * 3600000; // 2 hours over max
    const now = Date.now();
    const productionPerSecond = 10;

    // Should be capped at 8 hours: 8 * 3600 * 10 * 0.5 = 144000
    const result = calculateOfflineProgress(overMaxTime, now, productionPerSecond);
    const expected = maxHours * 3600 * productionPerSecond * 0.5;
    expect(result).toBe(expected);
  });

  it('should apply 50% production multiplier', () => {
    const lastSave = Date.now() - 60000; // 1 minute ago
    const now = Date.now();
    const productionPerSecond = 100;

    // 60 seconds * 100 per second * 0.5 = 3000
    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(result).toBe(3000);
  });

  it('should return integer value', () => {
    const lastSave = Date.now() - 12345; // Odd milliseconds
    const now = Date.now();
    const productionPerSecond = 7.777;

    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle zero production', () => {
    const lastSave = Date.now() - 3600000;
    const now = Date.now();
    const result = calculateOfflineProgress(lastSave, now, 0);
    expect(result).toBe(0);
  });

  it('should handle very large production values', () => {
    const lastSave = Date.now() - 60000;
    const now = Date.now();
    const productionPerSecond = 1000000;

    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('getOfflineProgressInfo', () => {
  it('should return complete offline progress info', () => {
    const lastSave = Date.now() - 3600000; // 1 hour ago
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.stardustEarned).toBe(18000);
    expect(result.timeAway).toBeCloseTo(3600, 0);
    expect(result.timeAwayDisplay).toContain('hour');
    expect(result.wasCapped).toBe(false);
  });

  it('should indicate when time was capped', () => {
    const maxHours = GAME_CONFIG.MAX_OFFLINE_HOURS;
    const overMaxTime = Date.now() - (maxHours + 2) * 3600000;
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(overMaxTime, now, productionPerSecond);

    expect(result.wasCapped).toBe(true);
  });

  it('should format time away for less than a minute', () => {
    const lastSave = Date.now() - 30000; // 30 seconds
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.timeAwayDisplay).toBe('less than a minute');
  });

  it('should format time away for minutes', () => {
    const lastSave = Date.now() - 300000; // 5 minutes
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.timeAwayDisplay).toContain('minute');
  });

  it('should format time away for hours', () => {
    const lastSave = Date.now() - 7200000; // 2 hours
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.timeAwayDisplay).toContain('hour');
  });

  it('should format time away for days', () => {
    const lastSave = Date.now() - 172800000; // 2 days
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.timeAwayDisplay).toContain('day');
  });

  it('should format time with both days and hours', () => {
    const lastSave = Date.now() - 90000000; // ~1 day 1 hour
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(lastSave, now, productionPerSecond);

    expect(result.timeAwayDisplay).toContain('day');
    expect(result.timeAwayDisplay).toContain('hour');
  });
});

describe('shouldShowOfflinePopup', () => {
  it('should return false if less than minimum time', () => {
    const lastSave = Date.now() - 30000; // 30 seconds
    const now = Date.now();

    expect(shouldShowOfflinePopup(lastSave, now, 60)).toBe(false);
  });

  it('should return true if exactly minimum time', () => {
    const lastSave = Date.now() - 60000; // 60 seconds
    const now = Date.now();

    expect(shouldShowOfflinePopup(lastSave, now, 60)).toBe(true);
  });

  it('should return true if more than minimum time', () => {
    const lastSave = Date.now() - 120000; // 2 minutes
    const now = Date.now();

    expect(shouldShowOfflinePopup(lastSave, now, 60)).toBe(true);
  });

  it('should use default minimum of 60 seconds', () => {
    const lastSave = Date.now() - 70000; // 70 seconds
    const now = Date.now();

    expect(shouldShowOfflinePopup(lastSave, now)).toBe(true);
  });

  it('should work with custom minimum', () => {
    const lastSave = Date.now() - 10000; // 10 seconds
    const now = Date.now();

    expect(shouldShowOfflinePopup(lastSave, now, 5)).toBe(true);
    expect(shouldShowOfflinePopup(lastSave, now, 15)).toBe(false);
  });

  it('should return false for no time elapsed', () => {
    const now = Date.now();

    expect(shouldShowOfflinePopup(now, now, 60)).toBe(false);
  });
});

describe('offline progress edge cases', () => {
  it('should handle last save time in the future (clock skew)', () => {
    const now = Date.now();
    const lastSave = now + 60000; // 1 minute in future
    const productionPerSecond = 10;

    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    // With clock skew (negative elapsed time), floor will still work, just return 0 or negative floored to 0
    // The function will calculate negative progress and floor it
    expect(typeof result).toBe('number');
    expect(Number.isInteger(result)).toBe(true);
  });

  it('should handle exactly at max offline threshold', () => {
    const maxHours = GAME_CONFIG.MAX_OFFLINE_HOURS;
    const exactMaxTime = Date.now() - maxHours * 3600000;
    const now = Date.now();
    const productionPerSecond = 10;

    const result = getOfflineProgressInfo(exactMaxTime, now, productionPerSecond);

    expect(result.wasCapped).toBe(false);
    expect(result.stardustEarned).toBeGreaterThan(0);
  });

  it('should handle fractional production rates', () => {
    const lastSave = Date.now() - 60000;
    const now = Date.now();
    const productionPerSecond = 0.123;

    const result = calculateOfflineProgress(lastSave, now, productionPerSecond);
    expect(Number.isInteger(result)).toBe(true);
  });
});
