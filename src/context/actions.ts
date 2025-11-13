import type { GameState } from '@/types';

/**
 * Game action types
 */
export type GameAction =
  | { type: 'CLICK' }
  | { type: 'BUY_BUILDING'; payload: { buildingId: string; quantity?: number } }
  | { type: 'BUY_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'BUY_BUILDING_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'BUY_PRESTIGE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'PRESTIGE' }
  | { type: 'TICK'; payload: { deltaTime: number } }
  | { type: 'LOAD_SAVE'; payload: GameState }
  | { type: 'APPLY_OFFLINE_PROGRESS'; payload: { stardust: number; timeAway: number } }
  | { type: 'HARD_RESET' };

/**
 * Action creators for type-safe dispatch
 */
export const actions = {
  click: (): GameAction => ({ type: 'CLICK' }),

  buyBuilding: (buildingId: string, quantity: number = 1): GameAction => ({
    type: 'BUY_BUILDING',
    payload: { buildingId, quantity },
  }),

  buyUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_UPGRADE',
    payload: { upgradeId },
  }),

  buyBuildingUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_BUILDING_UPGRADE',
    payload: { upgradeId },
  }),

  buyPrestigeUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_PRESTIGE_UPGRADE',
    payload: { upgradeId },
  }),

  unlockAchievement: (achievementId: string): GameAction => ({
    type: 'UNLOCK_ACHIEVEMENT',
    payload: { achievementId },
  }),

  prestige: (): GameAction => ({ type: 'PRESTIGE' }),

  tick: (deltaTime: number): GameAction => ({
    type: 'TICK',
    payload: { deltaTime },
  }),

  loadSave: (gameState: GameState): GameAction => ({
    type: 'LOAD_SAVE',
    payload: gameState,
  }),

  applyOfflineProgress: (stardust: number, timeAway: number): GameAction => ({
    type: 'APPLY_OFFLINE_PROGRESS',
    payload: { stardust, timeAway },
  }),

  hardReset: (): GameAction => ({ type: 'HARD_RESET' }),
};
