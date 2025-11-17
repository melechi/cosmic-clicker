import type { ResourceInventory } from './resources';
import type { GameObject, Bot } from './objects';
import type { ShipModules, ShipSpeed } from './modules';

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
  // Currency & Resources
  fuel: number; // Renamed from stardust
  totalFuelEarned: number; // Renamed from totalStardustEarned
  credits: number; // Main upgrade currency (Phase 1)
  resources: ResourceInventory; // Collected resources in cargo (Phase 1)

  // Prestige
  nebulaCrystals: number; // Keep for prestige system

  // Legacy clicker mechanics (will be replaced by modules)
  clickPower: number;
  productionPerSecond: number;
  buildings: Record<string, number>;
  upgrades: string[];

  // Ship Systems (Phase 1)
  modules: ShipModules; // All 7 ship modules
  shipSpeed: ShipSpeed; // Current speed setting
  fuelConsumptionRate: number; // Current fuel consumption per second

  // Game Objects (Phase 1)
  objects: GameObject[]; // Active objects in current zone
  bots: Bot[]; // Active mining bots

  // Progression
  achievements: string[];
  statistics: GameStatistics;

  // System
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
  // Currency & Resources
  fuel: 0,
  totalFuelEarned: 0,
  credits: 0,
  resources: {
    stone: 0,
    carbon: 0,
    iron: 0,
    ice: 0,
    gold: 0,
    titanium: 0,
    platinum: 0,
    iridium: 0,
    darkMatter: 0,
  },

  // Prestige
  nebulaCrystals: 0,

  // Legacy clicker mechanics
  clickPower: 1,
  productionPerSecond: 0,
  buildings: {},
  upgrades: [],

  // Ship Systems (Phase 1)
  modules: {
    laser: {
      type: 'laser',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      damage: 1,
      range: 100,
      cooldown: 0.5,
      laserCount: 1,
      piercing: false,
      autoTarget: false,
    },
    botBay: {
      type: 'botBay',
      tier: 0,
      unlocked: false,
      purchasedUpgrades: [],
      botCount: 0,
      miningSpeed: 0.2, // 1 resource per 5 seconds
      range: 80,
      botCapacity: 10,
      intelligentTargeting: false,
      repairCapability: false,
    },
    converter: {
      type: 'converter',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      conversionSpeed: 0.5, // 1 resource per 2 seconds
      efficiencyPercent: 100,
      autoConvertPercent: 50,
      unlockedTiers: [1], // Only Tier 1 resources (Stone, Carbon)
      parallelProcessing: false,
      smartMode: false,
    },
    cargoHold: {
      type: 'cargoHold',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      totalCapacity: 100,
      resourceSlots: 3,
      compressionRatio: 1,
      quickSell: false,
      priceScanner: false,
      autoSell: false,
      resourcePriority: [
        'darkMatter',
        'iridium',
        'platinum',
        'gold',
        'titanium',
        'iron',
        'ice',
        'carbon',
        'stone',
      ],
      cargoFullWarningShown: false,
    },
    engine: {
      type: 'engine',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      fuelEfficiencyPercent: 100,
      maxSpeedUnlocked: 'normal',
      tankCapacity: 1000,
      regenerativeBraking: false,
      regenerativeBrakingPercent: 0,
      emergencyTank: false,
      emergencyTankPercent: 0,
      fuelSynthesisRate: 0,
    },
    jumpDrive: {
      type: 'jumpDrive',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      maxZoneTier: 1,
      chargeTime: 10,
      fuelCostPercent: 100,
      emergencyJump: false,
      coordinateSystem: false,
      gateDetector: false,
    },
    scanner: {
      type: 'scanner',
      tier: 1,
      unlocked: true,
      purchasedUpgrades: [],
      detectionRange: 300,
      resourceScanner: false,
      artifactDetector: false,
      gateFinder: false,
      valueDisplay: false,
      rarityFilter: false,
      predictivePath: false,
      anomalySensor: false,
    },
  },
  shipSpeed: 'normal',
  fuelConsumptionRate: 1.0,

  // Game Objects
  objects: [],
  bots: [],

  // Progression
  achievements: [],
  statistics: {
    totalClicks: 0,
    totalPlayTime: 0,
    currentSessionTime: 0,
    totalPrestiges: 0,
    buildingsPurchased: 0,
    upgradesPurchased: 0,
  },

  // System
  lastSaveTime: Date.now(),
  version: '2.0.0', // Updated for Phase 1

  // Zone system
  currentZone: 1,
  zoneProgress: 0,
};
