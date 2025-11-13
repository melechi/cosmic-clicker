import { GAME_CONFIG } from '@/constants';

/**
 * Format a number with abbreviations (K, M, B, T, etc.)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with appropriate suffix
 *
 * @example
 * formatNumber(1234) // "1.23K"
 * formatNumber(1000000) // "1.00M"
 * formatNumber(1500000, 1) // "1.5M"
 */
export function formatNumber(value: number, decimals: number = 2): string {
  // Handle special cases
  if (value === 0) return '0';
  if (!isFinite(value)) return 'Infinity';
  if (value < 0) return '-' + formatNumber(-value, decimals);

  // For numbers less than 1000, show as-is with decimals
  if (value < 1000) {
    return value % 1 === 0 ? value.toString() : value.toFixed(decimals);
  }

  // Find the appropriate abbreviation
  const abbreviations = GAME_CONFIG.NUMBER_ABBREVIATIONS;

  // Iterate through abbreviations from largest to smallest
  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const { threshold, suffix } = abbreviations[i];
    if (value >= threshold) {
      const scaled = value / threshold;
      const formatted = scaled.toFixed(decimals);
      // Remove trailing zeros and decimal point if not needed
      const cleaned = formatted.replace(/\.?0+$/, '');
      return `${cleaned}${suffix}`;
    }
  }

  // Fallback (should never reach here due to 1000 check above)
  return value.toFixed(decimals);
}

/**
 * Format a number as a compact integer (no decimals, with abbreviations)
 * @param value - The number to format
 * @returns Formatted string with appropriate suffix
 *
 * @example
 * formatCompact(1234) // "1K"
 * formatCompact(1500000) // "2M"
 */
export function formatCompact(value: number): string {
  if (value === 0) return '0';
  if (!isFinite(value)) return 'Infinity';
  if (value < 0) return '-' + formatCompact(-value);

  // For numbers less than 1000, show as integer
  if (value < 1000) {
    return Math.floor(value).toString();
  }

  const abbreviations = GAME_CONFIG.NUMBER_ABBREVIATIONS;

  for (let i = abbreviations.length - 1; i >= 0; i--) {
    const { threshold, suffix } = abbreviations[i];
    if (value >= threshold) {
      const scaled = value / threshold;
      const rounded = Math.floor(scaled);
      return `${rounded}${suffix}`;
    }
  }

  return Math.floor(value).toString();
}

/**
 * Format time in seconds to a human-readable string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2h 30m", "45s")
 *
 * @example
 * formatTime(90) // "1m 30s"
 * formatTime(3665) // "1h 1m"
 * formatTime(45) // "45s"
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (remainingSeconds > 0 && hours === 0) {
    // Only show seconds if less than an hour
    parts.push(`${remainingSeconds}s`);
  }

  return parts.join(' ');
}

/**
 * Format a percentage value
 * @param value - The decimal value (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercent(0.15) // "15%"
 * formatPercent(0.5555, 2) // "55.55%"
 */
export function formatPercent(value: number, decimals: number = 0): string {
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Parse a formatted number string back to a number
 * @param str - The formatted string to parse
 * @returns The numeric value
 *
 * @example
 * parseFormattedNumber("1.5K") // 1500
 * parseFormattedNumber("2.3M") // 2300000
 */
export function parseFormattedNumber(str: string): number {
  const abbreviations = GAME_CONFIG.NUMBER_ABBREVIATIONS;

  for (const { threshold, suffix } of abbreviations) {
    if (str.endsWith(suffix)) {
      const numericPart = str.slice(0, -suffix.length);
      const value = parseFloat(numericPart);
      return value * threshold;
    }
  }

  // No suffix found, parse as regular number
  return parseFloat(str);
}
