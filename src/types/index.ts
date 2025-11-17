// Game state and core types
export type { GameState, GameStatistics, ZoneConfig } from './game';
export { initialGameState } from './game';

// Save system
export type { SaveData, ImportResult } from './save';

// Legacy types (will be phased out)
export type { Building, BuildingUpgrade } from './buildings';
export type { Upgrade, ClickUpgrade, ProductionUpgrade, AutoClickUpgrade, PrestigeUpgrade, AnyUpgrade } from './upgrades';
export type { Achievement, AchievementCategory } from './achievements';

// Phase 1: Resource system
export type {
  ResourceType,
  ResourceRarity,
  ResourceTier,
  Resource,
  ResourceInventory,
  ResourceConversionSettings,
} from './resources';

// Phase 1: Game objects
export type {
  ObjectType,
  ObjectSize,
  AsteroidVariant,
  DebrisVariant,
  DerelictVariant,
  Position,
  Velocity,
  ResourceDrop,
  SpecialDrop,
  GameObject,
  AsteroidObject,
  DebrisObject,
  DerelictObject,
  GateObject,
  AnomalyObject,
  AnyGameObject,
  ObjectSpawnWeight,
  ObjectSpawnConfig,
  Bot,
  BotState,
} from './objects';

// Phase 1: Ship modules
export type {
  ModuleType,
  ShipSpeed,
  BaseModule,
  LaserModule,
  BotBayModule,
  ConverterModule,
  CargoHoldModule,
  EngineModule,
  JumpDriveModule,
  ScannerModule,
  ShipModules,
  ModuleUpgrade,
  ModuleUpgradeEffect,
  SpeedConfig,
} from './modules';
