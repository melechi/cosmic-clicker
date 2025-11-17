import { GAME_CONFIG } from '@/constants';

/**
 * Calculate offline progress earned while player was away
 * @param lastSaveTime - Timestamp of last save (milliseconds)
 * @param currentTime - Current timestamp (milliseconds)
 * @param productionPerSecond - Current production rate per second
 * @returns Amount of fuel earned offline
 */
export function calculateOfflineProgress(
  lastSaveTime: number,
  currentTime: number,
  productionPerSecond: number
): number {
  // Calculate elapsed time in seconds
  const elapsedMilliseconds = currentTime - lastSaveTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;

  // Cap at maximum offline hours
  const maxOfflineSeconds = GAME_CONFIG.MAX_OFFLINE_HOURS * 3600;
  const cappedSeconds = Math.min(elapsedSeconds, maxOfflineSeconds);

  // Apply offline production multiplier (50% of normal production)
  const offlineProduction =
    productionPerSecond * cappedSeconds * GAME_CONFIG.OFFLINE_PRODUCTION_MULTIPLIER;

  return Math.floor(offlineProduction);
}

/**
 * Get offline progress info for display
 * @param lastSaveTime - Timestamp of last save (milliseconds)
 * @param currentTime - Current timestamp (milliseconds)
 * @param productionPerSecond - Current production rate per second
 * @returns Object with offline progress details
 */
export function getOfflineProgressInfo(
  lastSaveTime: number,
  currentTime: number,
  productionPerSecond: number
): {
  fuelEarned: number;
  timeAway: number;
  timeAwayDisplay: string;
  wasCapped: boolean;
} {
  const elapsedMilliseconds = currentTime - lastSaveTime;
  const elapsedSeconds = elapsedMilliseconds / 1000;

  const maxOfflineSeconds = GAME_CONFIG.MAX_OFFLINE_HOURS * 3600;
  const wasCapped = elapsedSeconds > maxOfflineSeconds;

  const fuelEarned = calculateOfflineProgress(lastSaveTime, currentTime, productionPerSecond);

  // Format time away for display
  const timeAwayDisplay = formatOfflineTime(elapsedSeconds);

  return {
    fuelEarned,
    timeAway: elapsedSeconds,
    timeAwayDisplay,
    wasCapped,
  };
}

/**
 * Format offline time for display
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
function formatOfflineTime(seconds: number): string {
  if (seconds < 60) {
    return 'less than a minute';
  }

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    if (remainingHours > 0) {
      return `${days} day${days > 1 ? 's' : ''} and ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    if (remainingMinutes > 0 && hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Check if enough time has passed to show offline progress popup
 * @param lastSaveTime - Timestamp of last save (milliseconds)
 * @param currentTime - Current timestamp (milliseconds)
 * @param minimumSeconds - Minimum seconds away to show popup (default: 60)
 * @returns True if popup should be shown
 */
export function shouldShowOfflinePopup(
  lastSaveTime: number,
  currentTime: number,
  minimumSeconds: number = 60
): boolean {
  const elapsedSeconds = (currentTime - lastSaveTime) / 1000;
  return elapsedSeconds >= minimumSeconds;
}
