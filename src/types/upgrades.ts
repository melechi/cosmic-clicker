/**
 * Base upgrade interface
 */
export interface Upgrade {
  /** Unique identifier for the upgrade */
  id: string;
  /** Display name of the upgrade */
  name: string;
  /** Description of the upgrade effect */
  description: string;
  /** Cost in stardust or nebula crystals */
  cost: number;
  /** Type of upgrade */
  type: 'click' | 'production' | 'prestige' | 'autoClick';
}

/**
 * Click power upgrade
 */
export interface ClickUpgrade extends Upgrade {
  type: 'click';
  /** Multiplier for click power */
  multiplier: number;
}

/**
 * Production multiplier upgrade
 */
export interface ProductionUpgrade extends Upgrade {
  type: 'production';
  /** Multiplier for all production */
  multiplier: number;
}

/**
 * Auto-clicker upgrade
 */
export interface AutoClickUpgrade extends Upgrade {
  type: 'autoClick';
  /** Clicks per second */
  clicksPerSecond: number;
}

/**
 * Prestige upgrade (purchased with Nebula Crystals)
 */
export interface PrestigeUpgrade extends Upgrade {
  type: 'prestige';
  /** Cost is in Nebula Crystals */
  cost: number;
  /** Effect type */
  effect: 'startStardust' | 'startBuildings' | 'clickMultiplier' | 'productionMultiplier' | 'autoClickStart' | 'prestigeBonus';
  /** Effect value (amount of stardust, number of buildings, multiplier, etc.) */
  value: number;
}

/**
 * Union type for all upgrade types
 */
export type AnyUpgrade = ClickUpgrade | ProductionUpgrade | AutoClickUpgrade | PrestigeUpgrade;
