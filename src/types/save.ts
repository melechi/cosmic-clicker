import type { GameState } from './game';

/**
 * Save data structure stored in localStorage
 */
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
}

/**
 * Result of save import operation
 */
export interface ImportResult {
  success: boolean;
  gameState?: GameState;
  error?: string;
}
