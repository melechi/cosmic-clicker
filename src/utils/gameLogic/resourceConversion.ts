/**
 * Resource conversion utility functions for Cosmic Clicker Phase 1
 * All functions are pure (no side effects)
 */

import type { ResourceType, ResourceTier } from '@/types';

/**
 * Base fuel conversion rates for each resource type
 * Format: 1 resource = X fuel
 */
const FUEL_CONVERSION_RATES: Record<ResourceType, number> = {
  // Tier 1 (Early Zones 1-2)
  stone: 1,
  carbon: 1,
  // Tier 2 (Zones 2-4)
  iron: 2,
  ice: 1.5,
  // Tier 3 (Zones 4-6)
  gold: 5,
  titanium: 4,
  // Tier 4 (Zones 6+)
  platinum: 10,
  iridium: 15,
  darkMatter: 50,
};

/**
 * Base credit values for each resource type when sold
 * Higher tier resources sell for more credits
 */
const CREDIT_VALUES: Record<ResourceType, number> = {
  // Tier 1 (Early Zones 1-2)
  stone: 2, // Low value
  carbon: 3,
  // Tier 2 (Zones 2-4)
  iron: 8,
  ice: 6,
  // Tier 3 (Zones 4-6)
  gold: 25,
  titanium: 20,
  // Tier 4 (Zones 6+)
  platinum: 75,
  iridium: 150,
  darkMatter: 500,
};

/**
 * Resource tier mapping
 */
const RESOURCE_TIERS: Record<ResourceType, ResourceTier> = {
  stone: 1,
  carbon: 1,
  iron: 2,
  ice: 2,
  gold: 3,
  titanium: 3,
  platinum: 4,
  iridium: 4,
  darkMatter: 4,
};

/**
 * Get the base fuel conversion rate for a resource type
 * @param resourceType - Type of resource
 * @returns Fuel conversion rate (1 resource = X fuel)
 */
export function getConversionRate(resourceType: ResourceType): number {
  return FUEL_CONVERSION_RATES[resourceType] || 1;
}

/**
 * Get the tier level for a resource type
 * @param resourceType - Type of resource
 * @returns Resource tier (1-4)
 */
export function getResourceTier(resourceType: ResourceType): ResourceTier {
  return RESOURCE_TIERS[resourceType] || 1;
}

/**
 * Get the base credit value for a resource type
 * @param resourceType - Type of resource
 * @returns Credit value per resource
 */
export function getResourceCreditValue(resourceType: ResourceType): number {
  return CREDIT_VALUES[resourceType] || 1;
}

/**
 * Convert resources to fuel
 * @param resourceType - Type of resource to convert
 * @param amount - Amount of resources to convert
 * @param efficiencyPercent - Converter efficiency percentage (100 = base rate, 150 = 1.5x fuel)
 * @returns Amount of fuel produced
 */
export function convertResourceToFuel(
  resourceType: ResourceType,
  amount: number,
  efficiencyPercent: number = 100
): number {
  const baseRate = getConversionRate(resourceType);
  const efficiencyMultiplier = efficiencyPercent / 100;
  return Math.floor(amount * baseRate * efficiencyMultiplier);
}

/**
 * Calculate credit value of resources when sold
 * @param resourceType - Type of resource
 * @param amount - Amount of resources to sell
 * @param marketMultiplier - Market price multiplier (1.0 = normal, 1.5 = 50% bonus from upgrades/cards)
 * @returns Credits earned from selling
 */
export function calculateResourceValue(
  resourceType: ResourceType,
  amount: number,
  marketMultiplier: number = 1.0
): number {
  const baseValue = getResourceCreditValue(resourceType);
  return Math.floor(amount * baseValue * marketMultiplier);
}

/**
 * Calculate how many resources can be converted in a given time period
 * @param conversionSpeed - Resources converted per second
 * @param deltaTime - Time elapsed in seconds
 * @param availableAmount - Amount of resources available to convert
 * @returns Number of resources that can be converted
 */
export function calculateConversionAmount(
  conversionSpeed: number,
  deltaTime: number,
  availableAmount: number
): number {
  const maxConversion = conversionSpeed * deltaTime;
  return Math.min(Math.floor(maxConversion), availableAmount);
}

/**
 * Calculate fuel consumption based on ship speed setting
 * @param baseConsumption - Base fuel consumption rate (1.0 at normal speed)
 * @param speedMultiplier - Speed setting multiplier (0 = stopped, 0.5 = slow, 1 = normal, 2 = fast, 5 = boost)
 * @param efficiencyPercent - Engine efficiency percentage (100 = normal, 50 = half consumption)
 * @param deltaTime - Time elapsed in seconds
 * @returns Fuel consumed
 */
export function calculateFuelConsumption(
  baseConsumption: number,
  speedMultiplier: number,
  efficiencyPercent: number,
  deltaTime: number
): number {
  if (speedMultiplier === 0) return 0; // No fuel consumption when stopped

  const efficiencyMultiplier = efficiencyPercent / 100;
  const fuelConsumed = baseConsumption * speedMultiplier * efficiencyMultiplier * deltaTime;

  // Return positive value (will be subtracted from fuel)
  return Math.max(0, fuelConsumed);
}

/**
 * Get speed multipliers for fuel consumption
 */
export const SPEED_FUEL_MULTIPLIERS: Record<string, number> = {
  stop: 0,
  slow: 0.5,
  normal: 1.0,
  fast: 2.0,
  boost: 5.0,
};

/**
 * Get distance multipliers for ship speed
 */
export const SPEED_DISTANCE_MULTIPLIERS: Record<string, number> = {
  stop: 0,
  slow: 0.5,
  normal: 1.0,
  fast: 2.0,
  boost: 3.0, // Boost is less efficient (5x fuel for 3x speed)
};

/**
 * Calculate total cargo capacity used
 * @param resources - Current resource inventory
 * @returns Total resources in cargo
 */
export function calculateTotalCargo(resources: Record<ResourceType, number>): number {
  return Object.values(resources).reduce((sum, amount) => sum + amount, 0);
}

/**
 * Check if cargo has space for additional resources
 * @param currentCargo - Current total cargo used
 * @param cargoCapacity - Maximum cargo capacity
 * @param amountToAdd - Amount of resources to add
 * @returns True if there is enough space
 */
export function hasCargoSpace(
  currentCargo: number,
  cargoCapacity: number,
  amountToAdd: number
): boolean {
  return currentCargo + amountToAdd <= cargoCapacity;
}

/**
 * Calculate how many resources can fit in cargo
 * @param currentCargo - Current total cargo used
 * @param cargoCapacity - Maximum cargo capacity
 * @param requestedAmount - Requested amount to add
 * @returns Maximum amount that can fit
 */
export function calculateMaxCargoAddition(
  currentCargo: number,
  cargoCapacity: number,
  requestedAmount: number
): number {
  const availableSpace = cargoCapacity - currentCargo;
  return Math.min(requestedAmount, Math.max(0, availableSpace));
}

/**
 * Check if a resource tier is unlocked for conversion
 * @param resourceType - Type of resource
 * @param unlockedTiers - Array of unlocked tier numbers
 * @returns True if the resource's tier is unlocked
 */
export function isResourceTierUnlocked(
  resourceType: ResourceType,
  unlockedTiers: number[]
): boolean {
  const tier = getResourceTier(resourceType);
  return unlockedTiers.includes(tier);
}

/**
 * Get all resource types for a given tier
 * @param tier - Resource tier (1-4)
 * @returns Array of resource types in that tier
 */
export function getResourcesInTier(tier: ResourceTier): ResourceType[] {
  return Object.entries(RESOURCE_TIERS)
    .filter(([, resourceTier]) => resourceTier === tier)
    .map(([resourceType]) => resourceType as ResourceType);
}

/**
 * Calculate auto-conversion percentage based on fuel level (for Smart Mode)
 * @param currentFuel - Current fuel amount
 * @param maxFuel - Maximum fuel capacity
 * @param minPercent - Minimum auto-convert percent when fuel is full
 * @param maxPercent - Maximum auto-convert percent when fuel is empty
 * @returns Auto-convert percentage (0-100)
 */
export function calculateSmartConversionPercent(
  currentFuel: number,
  maxFuel: number,
  minPercent: number = 0,
  maxPercent: number = 100
): number {
  const fuelPercent = Math.min(100, (currentFuel / maxFuel) * 100);

  // When fuel is low, convert more resources
  // When fuel is high, convert fewer resources (save for selling)
  const conversionPercent = maxPercent - (fuelPercent / 100) * (maxPercent - minPercent);

  return Math.max(minPercent, Math.min(maxPercent, Math.floor(conversionPercent)));
}
