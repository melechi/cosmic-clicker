/**
 * Zone information
 */
export interface ZoneConfig {
  number: number;
  name: string;
  fuelRequired: number; // Fuel needed to complete this zone
  color: string;
  bgColor: string;
}

/**
 * Core game state interface
 */
export interface GameState {
  fuel: number; // Renamed from stardust
  totalFuelEarned: number; // Renamed from totalStardustEarned
  nebulaCrystals: number; // Keep for prestige system
  clickPower: number;
  productionPerSecond: number;
  buildings: Record<string, number>;
  upgrades: string[];
  achievements: string[];
  statistics: GameStatistics;
  lastSaveTime: number;
  version: string;
  // Zone system
  currentZone: number;
  zoneProgress: number; // Fuel collected in current zone
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
  fuel: 0,
  totalFuelEarned: 0,
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
  currentZone: 1,
  zoneProgress: 0,
};
