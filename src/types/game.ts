/**
 * Core game state interface
 */
export interface GameState {
  stardust: number;
  totalStardustEarned: number;
  nebulaCrystals: number;
  clickPower: number;
  productionPerSecond: number;
  buildings: Record<string, number>;
  upgrades: string[];
  achievements: string[];
  statistics: GameStatistics;
  lastSaveTime: number;
  version: string;
}

/**
 * Game statistics tracking
 */
export interface GameStatistics {
  totalClicks: number;
  totalPlayTime: number;
  currentSessionTime: number;
  totalPrestiges: number;
  buildingsPurchased: number;
  upgradesPurchased: number;
}

/**
 * Initial game state
 */
export const initialGameState: GameState = {
  stardust: 0,
  totalStardustEarned: 0,
  nebulaCrystals: 0,
  clickPower: 1,
  productionPerSecond: 0,
  buildings: {},
  upgrades: [],
  achievements: [],
  statistics: {
    totalClicks: 0,
    totalPlayTime: 0,
    currentSessionTime: 0,
    totalPrestiges: 0,
    buildingsPurchased: 0,
    upgradesPurchased: 0,
  },
  lastSaveTime: Date.now(),
  version: '1.0.0',
};
