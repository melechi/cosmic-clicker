/**
 * Settings Manager
 *
 * Manages user preferences and settings persistence to localStorage.
 */

const SETTINGS_KEY = 'cosmicClicker_settings';

/**
 * Game settings interface
 */
export interface GameSettings {
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // seconds (15, 30, 60)
  showParticles: boolean;
  reduceMotion: boolean;
  numberNotation: 'standard' | 'scientific' | 'engineering';
  showTooltips: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

/**
 * Default settings
 */
export const defaultSettings: GameSettings = {
  autoSaveEnabled: true,
  autoSaveInterval: 30,
  showParticles: true,
  reduceMotion: false,
  numberNotation: 'standard',
  showTooltips: true,
  soundEnabled: false,
  musicEnabled: false,
};

/**
 * Load settings from localStorage
 * Returns default settings if none exist or if loading fails
 */
export function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) {
      return defaultSettings;
    }

    const parsed = JSON.parse(saved);

    // Merge with defaults to ensure all fields exist
    return { ...defaultSettings, ...parsed };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw new Error('Failed to save settings');
  }
}

/**
 * Reset settings to defaults
 */
export function resetSettings(): GameSettings {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return defaultSettings;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return defaultSettings;
  }
}

/**
 * Update a specific setting
 */
export function updateSetting<K extends keyof GameSettings>(
  key: K,
  value: GameSettings[K]
): GameSettings {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, [key]: value };
  saveSettings(newSettings);
  return newSettings;
}

/**
 * Validate settings object
 */
export function validateSettings(settings: unknown): settings is GameSettings {
  if (!settings || typeof settings !== 'object') {
    return false;
  }

  const s = settings as GameSettings;

  return (
    typeof s.autoSaveEnabled === 'boolean' &&
    typeof s.autoSaveInterval === 'number' &&
    typeof s.showParticles === 'boolean' &&
    typeof s.reduceMotion === 'boolean' &&
    (s.numberNotation === 'standard' ||
      s.numberNotation === 'scientific' ||
      s.numberNotation === 'engineering') &&
    typeof s.showTooltips === 'boolean' &&
    typeof s.soundEnabled === 'boolean' &&
    typeof s.musicEnabled === 'boolean'
  );
}
