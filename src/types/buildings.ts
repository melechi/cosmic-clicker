/**
 * Building definition interface
 */
export interface Building {
  /** Unique identifier for the building */
  id: string;
  /** Display name of the building */
  name: string;
  /** Flavor text description */
  description: string;
  /** Base cost in stardust for first purchase */
  baseCost: number;
  /** Cost multiplier for each subsequent purchase (typically 1.15) */
  costMultiplier: number;
  /** Production rate in stardust per second */
  production: number;
  /** Building tier (1-7) */
  tier: number;
}

/**
 * Building-specific upgrade interface
 */
export interface BuildingUpgrade {
  /** Unique identifier for the upgrade */
  id: string;
  /** ID of the building this upgrade affects */
  buildingId: string;
  /** Display name of the upgrade */
  name: string;
  /** Description of the upgrade effect */
  description: string;
  /** Cost in stardust */
  cost: number;
  /** Production multiplier applied (e.g., 2 for 2x) */
  multiplier: number;
  /** Number of buildings required to unlock */
  requiredCount: number;
}
