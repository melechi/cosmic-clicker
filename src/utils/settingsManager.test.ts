import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadSettings,
  saveSettings,
  resetSettings,
  updateSetting,
  validateSettings,
  defaultSettings,
  type GameSettings,
} from './settingsManager';

describe('settingsManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadSettings', () => {
    it('should return default settings when nothing is saved', () => {
      const settings = loadSettings();
      expect(settings).toEqual(defaultSettings);
    });

    it('should load settings from localStorage', () => {
      const customSettings: GameSettings = {
        ...defaultSettings,
        autoSaveEnabled: false,
        showParticles: false,
      };

      localStorage.setItem('cosmicClicker_settings', JSON.stringify(customSettings));

      const loaded = loadSettings();
      expect(loaded.autoSaveEnabled).toBe(false);
      expect(loaded.showParticles).toBe(false);
    });

    it('should merge with defaults for missing fields', () => {
      const partialSettings = {
        autoSaveEnabled: false,
      };

      localStorage.setItem(
        'cosmicClicker_settings',
        JSON.stringify(partialSettings)
      );

      const loaded = loadSettings();
      expect(loaded.autoSaveEnabled).toBe(false);
      expect(loaded.autoSaveInterval).toBe(defaultSettings.autoSaveInterval);
      expect(loaded.showParticles).toBe(defaultSettings.showParticles);
    });

    it('should return defaults when localStorage data is corrupted', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      localStorage.setItem('cosmicClicker_settings', 'invalid json');

      const loaded = loadSettings();
      expect(loaded).toEqual(defaultSettings);

      consoleErrorSpy.mockRestore();
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.getItem to throw an error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const loaded = loadSettings();
      expect(loaded).toEqual(defaultSettings);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('saveSettings', () => {
    it('should save settings to localStorage', () => {
      const settings: GameSettings = {
        ...defaultSettings,
        autoSaveEnabled: false,
      };

      saveSettings(settings);

      const saved = localStorage.getItem('cosmicClicker_settings');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.autoSaveEnabled).toBe(false);
    });

    it('should throw error when localStorage fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => saveSettings(defaultSettings)).toThrow('Failed to save settings');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });

    it('should save all settings fields correctly', () => {
      const customSettings: GameSettings = {
        autoSaveEnabled: false,
        autoSaveInterval: 60,
        showParticles: false,
        reduceMotion: true,
        numberNotation: 'scientific',
        showTooltips: false,
        soundEnabled: true,
        musicEnabled: true,
      };

      saveSettings(customSettings);

      const loaded = loadSettings();
      expect(loaded).toEqual(customSettings);
    });
  });

  describe('resetSettings', () => {
    it('should remove settings from localStorage', () => {
      saveSettings({ ...defaultSettings, autoSaveEnabled: false });

      resetSettings();

      const saved = localStorage.getItem('cosmicClicker_settings');
      expect(saved).toBeNull();
    });

    it('should return default settings', () => {
      saveSettings({ ...defaultSettings, autoSaveEnabled: false });

      const reset = resetSettings();
      expect(reset).toEqual(defaultSettings);
    });

    it('should handle localStorage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const reset = resetSettings();
      expect(reset).toEqual(defaultSettings);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      removeItemSpy.mockRestore();
    });
  });

  describe('updateSetting', () => {
    it('should update a specific setting', () => {
      saveSettings(defaultSettings);

      const updated = updateSetting('autoSaveEnabled', false);

      expect(updated.autoSaveEnabled).toBe(false);
      expect(updated.autoSaveInterval).toBe(defaultSettings.autoSaveInterval);
    });

    it('should save updated settings to localStorage', () => {
      saveSettings(defaultSettings);

      updateSetting('showParticles', false);

      const loaded = loadSettings();
      expect(loaded.showParticles).toBe(false);
    });

    it('should update number notation', () => {
      saveSettings(defaultSettings);

      const updated = updateSetting('numberNotation', 'scientific');

      expect(updated.numberNotation).toBe('scientific');
    });

    it('should update auto-save interval', () => {
      saveSettings(defaultSettings);

      const updated = updateSetting('autoSaveInterval', 60);

      expect(updated.autoSaveInterval).toBe(60);
    });
  });

  describe('validateSettings', () => {
    it('should validate correct settings', () => {
      expect(validateSettings(defaultSettings)).toBe(true);
    });

    it('should reject null', () => {
      expect(validateSettings(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(validateSettings(undefined)).toBe(false);
    });

    it('should reject non-object', () => {
      expect(validateSettings('string')).toBe(false);
      expect(validateSettings(123)).toBe(false);
      expect(validateSettings(true)).toBe(false);
    });

    it('should reject settings with wrong types', () => {
      const invalidSettings = {
        ...defaultSettings,
        autoSaveEnabled: 'true', // should be boolean
      };

      expect(validateSettings(invalidSettings)).toBe(false);
    });

    it('should reject settings with invalid numberNotation', () => {
      const invalidSettings = {
        ...defaultSettings,
        numberNotation: 'invalid',
      };

      expect(validateSettings(invalidSettings)).toBe(false);
    });

    it('should validate all valid numberNotation values', () => {
      const standardSettings = { ...defaultSettings, numberNotation: 'standard' as const };
      const scientificSettings = {
        ...defaultSettings,
        numberNotation: 'scientific' as const,
      };
      const engineeringSettings = {
        ...defaultSettings,
        numberNotation: 'engineering' as const,
      };

      expect(validateSettings(standardSettings)).toBe(true);
      expect(validateSettings(scientificSettings)).toBe(true);
      expect(validateSettings(engineeringSettings)).toBe(true);
    });

    it('should reject settings with missing fields', () => {
      const incompleteSettings = {
        autoSaveEnabled: true,
        // missing other fields
      };

      expect(validateSettings(incompleteSettings)).toBe(false);
    });
  });

  describe('defaultSettings', () => {
    it('should have correct default values', () => {
      expect(defaultSettings.autoSaveEnabled).toBe(true);
      expect(defaultSettings.autoSaveInterval).toBe(30);
      expect(defaultSettings.showParticles).toBe(true);
      expect(defaultSettings.reduceMotion).toBe(false);
      expect(defaultSettings.numberNotation).toBe('standard');
      expect(defaultSettings.showTooltips).toBe(true);
      expect(defaultSettings.soundEnabled).toBe(false);
      expect(defaultSettings.musicEnabled).toBe(false);
    });

    it('should be a valid settings object', () => {
      expect(validateSettings(defaultSettings)).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should handle full save/load/update cycle', () => {
      // Save initial settings
      saveSettings(defaultSettings);

      // Update a setting
      updateSetting('autoSaveEnabled', false);

      // Load settings
      const loaded1 = loadSettings();
      expect(loaded1.autoSaveEnabled).toBe(false);

      // Update another setting
      updateSetting('showParticles', false);

      // Load again
      const loaded2 = loadSettings();
      expect(loaded2.autoSaveEnabled).toBe(false);
      expect(loaded2.showParticles).toBe(false);

      // Reset
      resetSettings();

      // Load after reset
      const loaded3 = loadSettings();
      expect(loaded3).toEqual(defaultSettings);
    });
  });
});
