import type { GameState, SaveData, ImportResult } from '@/types';
import { initialGameState } from '@/types';

const SAVE_KEY = 'cosmicClicker_save';
const CURRENT_VERSION = '1.0.0';

/**
 * Save game state to localStorage
 */
export function saveGame(gameState: GameState): void {
  try {
    const saveData: SaveData = {
      version: CURRENT_VERSION,
      timestamp: Date.now(),
      gameState: {
        ...gameState,
        lastSaveTime: Date.now(),
      },
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (error) {
    console.error('Failed to save game:', error);
    throw new Error('Failed to save game');
  }
}

/**
 * Load game state from localStorage
 */
export function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      return null;
    }

    const saveData: SaveData = JSON.parse(saved);

    // Validate save data
    if (!validateSaveData(saveData)) {
      console.warn('Invalid save data, starting fresh');
      return null;
    }

    // Migrate if needed
    const migratedState = migrateSaveData(saveData);

    return migratedState.gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

/**
 * Delete save from localStorage
 */
export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Failed to delete save:', error);
  }
}

/**
 * Export save as JSON string
 */
export function exportSave(gameState: GameState): string {
  const saveData: SaveData = {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    gameState,
  };

  return JSON.stringify(saveData, null, 2);
}

/**
 * Import save from JSON string
 */
export function importSave(jsonString: string): ImportResult {
  try {
    const saveData: SaveData = JSON.parse(jsonString);

    if (!validateSaveData(saveData)) {
      return {
        success: false,
        error: 'Invalid save data format',
      };
    }

    const migratedData = migrateSaveData(saveData);

    return {
      success: true,
      gameState: migratedData.gameState,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate save data structure
 */
function validateSaveData(data: unknown): data is SaveData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const saveData = data as SaveData;

  return (
    typeof saveData.version === 'string' &&
    typeof saveData.timestamp === 'number' &&
    saveData.gameState !== null &&
    typeof saveData.gameState === 'object'
  );
}

/**
 * Migrate save data to current version
 */
function migrateSaveData(saveData: SaveData): SaveData {
  // For now, just ensure all fields exist with defaults
  const migratedState: GameState = {
    ...initialGameState,
    ...saveData.gameState,
    version: CURRENT_VERSION,
  };

  return {
    ...saveData,
    version: CURRENT_VERSION,
    gameState: migratedState,
  };
}

/**
 * Get last save time
 */
export function getLastSaveTime(): number | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) {
      return null;
    }

    const saveData: SaveData = JSON.parse(saved);
    return saveData.timestamp;
  } catch {
    return null;
  }
}
