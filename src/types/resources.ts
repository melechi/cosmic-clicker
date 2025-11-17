/**
 * Resource system type definitions for Cosmic Clicker Phase 1
 */

/**
 * All available resource types in the game
 */
export type ResourceType =
  // Tier 1 (Early Zones 1-2)
  | 'stone'
  | 'carbon'
  // Tier 2 (Zones 2-4)
  | 'iron'
  | 'ice'
  // Tier 3 (Zones 4-6)
  | 'gold'
  | 'titanium'
  // Tier 4 (Zones 6+)
  | 'platinum'
  | 'iridium'
  | 'darkMatter';

/**
 * Resource rarity levels
 */
export type ResourceRarity = 'common' | 'uncommon' | 'rare' | 'veryRare' | 'legendary';

/**
 * Resource tier levels
 */
export type ResourceTier = 1 | 2 | 3 | 4;

/**
 * Resource definition interface
 */
export interface Resource {
  /** Unique identifier for the resource */
  id: ResourceType;
  /** Display name of the resource */
  name: string;
  /** Emoji icon for the resource */
  emoji: string;
  /** Fuel conversion rate (1 resource = X fuel) */
  fuelConversionRate: number;
  /** Base credit value when sold */
  creditValue: number;
  /** Resource tier (1-4) */
  tier: ResourceTier;
  /** Rarity level affects spawn frequency */
  rarity: ResourceRarity;
  /** Description of the resource */
  description?: string;
}

/**
 * Resource inventory - tracks collected resources
 */
export type ResourceInventory = Record<ResourceType, number>;

/**
 * Resource conversion settings
 */
export interface ResourceConversionSettings {
  /** Auto-conversion percentage (0-100) */
  autoConvertPercent: number;
  /** Priority order for resource conversion */
  conversionPriority: ResourceType[];
  /** Which resource tiers are unlocked for conversion */
  unlockedTiers: ResourceTier[];
}
