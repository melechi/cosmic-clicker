/**
 * Ship module type definitions for Cosmic Clicker Phase 1
 * Includes all 7 core modules and their upgrade systems
 */

/**
 * All ship module types
 */
export type ModuleType =
  | 'laser'
  | 'botBay'
  | 'converter'
  | 'cargoHold'
  | 'engine'
  | 'jumpDrive'
  | 'scanner';

/**
 * Ship speed settings
 */
export type ShipSpeed = 'stop' | 'slow' | 'normal' | 'fast' | 'boost';

/**
 * Base module interface
 */
export interface BaseModule {
  /** Module type identifier */
  type: ModuleType;
  /** Current tier/level */
  tier: number;
  /** Whether module is unlocked */
  unlocked: boolean;
  /** List of purchased upgrade IDs */
  purchasedUpgrades: string[];
}

/**
 * Laser System Module
 * Purpose: Active mining tool - fire at objects to extract resources
 */
export interface LaserModule extends BaseModule {
  type: 'laser';
  /** Damage dealt per shot (resources extracted per click) */
  damage: number;
  /** Range in pixels (can hit objects within this radius) */
  range: number;
  /** Cooldown in seconds (time between shots) */
  cooldown: number;
  /** Number of simultaneous laser beams */
  laserCount: number;
  /** Whether laser can pierce through multiple objects */
  piercing: boolean;
  /** Whether laser auto-targets nearest object */
  autoTarget: boolean;
}

/**
 * Bot Bay Module
 * Purpose: Idle mining - bots autonomously collect resources
 */
export interface BotBayModule extends BaseModule {
  type: 'botBay';
  /** Number of active bots */
  botCount: number;
  /** Resources collected per second per bot */
  miningSpeed: number;
  /** Range in pixels from ship where bots can operate */
  range: number;
  /** Resources each bot can carry before returning */
  botCapacity: number;
  /** Whether bots prioritize high-value resources */
  intelligentTargeting: boolean;
  /** Whether bots can repair ship hull */
  repairCapability: boolean;
}

/**
 * Converter Module
 * Purpose: Transform resources into fuel
 */
export interface ConverterModule extends BaseModule {
  type: 'converter';
  /** Resources converted per second */
  conversionSpeed: number;
  /** Efficiency multiplier (100% = base conversion rates) */
  efficiencyPercent: number;
  /** Auto-convert percentage (0-100) */
  autoConvertPercent: number;
  /** Which resource tiers are unlocked (1-4) */
  unlockedTiers: number[];
  /** Whether can convert multiple resource types simultaneously */
  parallelProcessing: boolean;
  /** Whether converter auto-adjusts based on fuel levels */
  smartMode: boolean;
}

/**
 * Cargo Hold Module
 * Purpose: Store collected resources before conversion/selling
 */
export interface CargoHoldModule extends BaseModule {
  type: 'cargoHold';
  /** Total resource capacity */
  totalCapacity: number;
  /** Number of different resource types that can be stored */
  resourceSlots: number;
  /** Compression ratio (higher = more resources per slot) */
  compressionRatio: number;
  /** Whether can sell all cargo with one click */
  quickSell: boolean;
  /** Whether displays market value before selling */
  priceScanner: boolean;
  /** Whether auto-sells specific resources when cargo full */
  autoSell: boolean;
}

/**
 * Engine & Fuel System Module
 * Purpose: Ship movement and fuel efficiency
 */
export interface EngineModule extends BaseModule {
  type: 'engine';
  /** Fuel efficiency percentage (lower = less consumption) */
  fuelEfficiencyPercent: number;
  /** Maximum speed setting available */
  maxSpeedUnlocked: ShipSpeed;
  /** Fuel tank capacity */
  tankCapacity: number;
  /** Whether recovers fuel when slowing down */
  regenerativeBraking: boolean;
  /** Fuel regeneration percentage (0-100) */
  regenerativeBrakingPercent: number;
  /** Whether has emergency fuel reserve */
  emergencyTank: boolean;
  /** Emergency tank percentage (0-100) */
  emergencyTankPercent: number;
  /** Fuel generation per second when stopped */
  fuelSynthesisRate: number;
}

/**
 * Jump Drive Module
 * Purpose: Warp between zones
 */
export interface JumpDriveModule extends BaseModule {
  type: 'jumpDrive';
  /** Maximum zone tier accessible (1-4) */
  maxZoneTier: number;
  /** Charge time in seconds before jump */
  chargeTime: number;
  /** Fuel cost efficiency percentage (lower = less fuel needed) */
  fuelCostPercent: number;
  /** Whether can jump backwards to previous zones */
  emergencyJump: boolean;
  /** Whether coordinate system is unlocked */
  coordinateSystem: boolean;
  /** Whether gate detector is active */
  gateDetector: boolean;
}

/**
 * Scanner & Sensors Module
 * Purpose: Detect objects, resources, and secrets
 */
export interface ScannerModule extends BaseModule {
  type: 'scanner';
  /** Detection range in pixels */
  detectionRange: number;
  /** Whether can see resources inside objects */
  resourceScanner: boolean;
  /** Whether highlights objects containing artifacts */
  artifactDetector: boolean;
  /** Whether can detect hidden gates */
  gateFinder: boolean;
  /** Whether shows credit value of objects */
  valueDisplay: boolean;
  /** Whether can filter objects by rarity */
  rarityFilter: boolean;
  /** Whether shows object movement trajectories */
  predictivePath: boolean;
  /** Whether can detect anomalies */
  anomalySensor: boolean;
}

/**
 * Complete ship modules state
 */
export interface ShipModules {
  laser: LaserModule;
  botBay: BotBayModule;
  converter: ConverterModule;
  cargoHold: CargoHoldModule;
  engine: EngineModule;
  jumpDrive: JumpDriveModule;
  scanner: ScannerModule;
}

/**
 * Module upgrade definition
 */
export interface ModuleUpgrade {
  /** Unique upgrade ID */
  id: string;
  /** Module this upgrade applies to */
  moduleType: ModuleType;
  /** Display name */
  name: string;
  /** Description of what this upgrade does */
  description: string;
  /** Cost in credits */
  cost: number;
  /** Prerequisite upgrade IDs (must own these first) */
  prerequisites: string[];
  /** Stat changes applied by this upgrade */
  effects: ModuleUpgradeEffect[];
  /** Tier/level of the upgrade */
  tier: number;
}

/**
 * Individual stat effect from an upgrade
 */
export interface ModuleUpgradeEffect {
  /** Stat to modify */
  stat: string;
  /** Type of modification */
  type: 'add' | 'multiply' | 'set' | 'unlock';
  /** Value to apply */
  value: number | boolean | string;
}

/**
 * Speed setting configuration
 */
export interface SpeedConfig {
  /** Speed identifier */
  speed: ShipSpeed;
  /** Display name */
  name: string;
  /** Fuel consumption multiplier */
  fuelMultiplier: number;
  /** Distance traveled multiplier */
  distanceMultiplier: number;
  /** Description of use case */
  description: string;
  /** Emoji icon */
  emoji: string;
}
