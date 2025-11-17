import type { GameState, Building, BuildingUpgrade, PrestigeUpgrade } from '@/types';
import { GAME_CONFIG } from '@/constants';

/**
 * Calculate the cost of a building based on current ownership
 * @param baseCost - Base cost of the building
 * @param multiplier - Cost multiplier per purchase (typically 1.15)
 * @param currentCount - Number of buildings currently owned
 * @returns The cost for the next purchase
 */
export function calculateBuildingCost(
  baseCost: number,
  multiplier: number,
  currentCount: number
): number {
  return Math.floor(baseCost * Math.pow(multiplier, currentCount));
}

/**
 * Calculate the total cost to buy multiple buildings at once
 * @param baseCost - Base cost of the building
 * @param multiplier - Cost multiplier per purchase
 * @param currentCount - Current number owned
 * @param quantity - Number to purchase
 * @returns Total cost for all buildings
 */
export function calculateBulkBuildingCost(
  baseCost: number,
  multiplier: number,
  currentCount: number,
  quantity: number
): number {
  let totalCost = 0;
  for (let i = 0; i < quantity; i++) {
    totalCost += calculateBuildingCost(baseCost, multiplier, currentCount + i);
  }
  return Math.floor(totalCost);
}

/**
 * Calculate production per second for a single building type
 * @param building - The building definition
 * @param count - Number of buildings owned
 * @param buildingUpgrades - Array of purchased building-specific upgrades
 * @returns Production per second for this building type
 */
export function calculateBuildingProduction(
  building: Building,
  count: number,
  buildingUpgrades: BuildingUpgrade[]
): number {
  if (count === 0) return 0;

  let baseProduction = building.production * count;

  // Apply building-specific upgrade multipliers
  const relevantUpgrades = buildingUpgrades.filter(
    (upgrade) => upgrade.buildingId === building.id
  );

  for (const upgrade of relevantUpgrades) {
    baseProduction *= upgrade.multiplier;
  }

  return baseProduction;
}

/**
 * Calculate total production per second from all sources
 * @param gameState - Current game state
 * @param buildings - Array of all building definitions
 * @param buildingUpgrades - Array of purchased building-specific upgrades
 * @param productionMultiplier - Global production multiplier from upgrades
 * @returns Total production per second
 */
export function calculateTotalProduction(
  gameState: GameState,
  buildings: Building[],
  buildingUpgrades: BuildingUpgrade[],
  productionMultiplier: number
): number {
  let totalProduction = 0;

  // Sum production from all buildings
  for (const building of buildings) {
    const count = gameState.buildings[building.id] || 0;
    totalProduction += calculateBuildingProduction(building, count, buildingUpgrades);
  }

  // Apply global production multiplier
  totalProduction *= productionMultiplier;

  // Apply Nebula Crystal bonus (1% per crystal)
  const crystalBonus = 1 + gameState.nebulaCrystals * GAME_CONFIG.NEBULA_CRYSTAL_BONUS;
  totalProduction *= crystalBonus;

  // Apply achievement bonuses (1% per achievement)
  const achievementBonus = 1 + gameState.achievements.length * GAME_CONFIG.ACHIEVEMENT_BONUS;
  totalProduction *= achievementBonus;

  return totalProduction;
}

/**
 * Calculate click power
 * @param baseClickPower - Base click power (typically 1)
 * @param clickMultipliers - Array of click multipliers from upgrades
 * @param prestigeClickMultiplier - Permanent click multiplier from prestige upgrades
 * @returns Total click power
 */
export function calculateClickPower(
  baseClickPower: number,
  clickMultipliers: number[],
  prestigeClickMultiplier: number = 1
): number {
  let clickPower = baseClickPower;

  // Apply all click upgrade multipliers
  for (const multiplier of clickMultipliers) {
    clickPower *= multiplier;
  }

  // Apply prestige multiplier
  clickPower *= prestigeClickMultiplier;

  return clickPower;
}

/**
 * Calculate Nebula Crystals earned from prestige
 * @param totalStardustEarned - Total fuel earned in current run
 * @param prestigeBonus - Bonus from prestige upgrades (e.g., 0.1 for 10% bonus)
 * @returns Number of Nebula Crystals that would be earned
 */
export function calculatePrestigeReward(
  totalStardustEarned: number,
  prestigeBonus: number = 0
): number {
  if (totalStardustEarned < GAME_CONFIG.MIN_PRESTIGE_STARDUST) {
    return 0;
  }

  // Base calculation: floor(sqrt(totalStardust / 1,000,000))
  const baseReward = Math.floor(
    Math.sqrt(totalStardustEarned / GAME_CONFIG.PRESTIGE_DIVISOR)
  );

  // Apply prestige bonus
  const bonusMultiplier = 1 + prestigeBonus;
  const totalReward = Math.floor(baseReward * bonusMultiplier);

  return totalReward;
}

/**
 * Calculate global production multiplier from production upgrades
 * @param purchasedUpgradeMultipliers - Array of multipliers from purchased production upgrades
 * @param prestigeProductionMultiplier - Permanent production multiplier from prestige upgrades
 * @returns Total production multiplier
 */
export function calculateProductionMultiplier(
  purchasedUpgradeMultipliers: number[],
  prestigeProductionMultiplier: number = 1
): number {
  let multiplier = 1;

  // Apply all purchased production upgrade multipliers
  for (const upgradeMultiplier of purchasedUpgradeMultipliers) {
    multiplier *= upgradeMultiplier;
  }

  // Apply prestige multiplier
  multiplier *= prestigeProductionMultiplier;

  return multiplier;
}

/**
 * Check if player can afford a cost
 * @param currentStardust - Current fuel amount
 * @param cost - Cost of the item
 * @returns True if player can afford
 */
export function canAfford(currentStardust: number, cost: number): boolean {
  return currentStardust >= cost;
}

/**
 * Check if player can prestige
 * @param totalStardustEarned - Total fuel earned in current run
 * @returns True if player can prestige
 */
export function canPrestige(totalStardustEarned: number): boolean {
  return totalStardustEarned >= GAME_CONFIG.MIN_PRESTIGE_STARDUST;
}

/**
 * Calculate the maximum number of buildings that can be purchased
 * @param currentStardust - Available fuel
 * @param baseCost - Base cost of the building
 * @param multiplier - Cost multiplier
 * @param currentCount - Current number owned
 * @returns Maximum number that can be purchased
 */
export function calculateMaxAffordable(
  currentStardust: number,
  baseCost: number,
  multiplier: number,
  currentCount: number
): number {
  let count = 0;
  let totalCost = 0;

  // Iteratively calculate until we can't afford more
  while (
    totalCost + calculateBuildingCost(baseCost, multiplier, currentCount + count) <=
    currentStardust
  ) {
    totalCost += calculateBuildingCost(baseCost, multiplier, currentCount + count);
    count++;

    // Safety limit to prevent infinite loops
    if (count >= 1000) break;
  }

  return count;
}

/**
 * Calculate auto-click production (clicks per second)
 * @param autoClickUpgrades - Array of purchased auto-click upgrades with their clicks per second
 * @param clickPower - Current click power
 * @returns Total fuel per second from auto-clicking
 */
export function calculateAutoClickProduction(
  autoClickUpgrades: number[],
  clickPower: number
): number {
  const totalClicksPerSecond = autoClickUpgrades.reduce((sum, cps) => sum + cps, 0);
  return totalClicksPerSecond * clickPower;
}

/**
 * Apply prestige upgrades to get starting resources
 * @param prestigeUpgrades - Array of purchased prestige upgrades
 * @returns Object with starting fuel and buildings
 */
export function getPrestigeStartingResources(prestigeUpgrades: PrestigeUpgrade[]): {
  fuel: number;
  buildings: Record<string, number>;
} {
  let fuel = 0;
  const buildings: Record<string, number> = {};

  for (const upgrade of prestigeUpgrades) {
    if (upgrade.effect === 'startStardust') {
      fuel += upgrade.value;
    } else if (upgrade.effect === 'startBuildings') {
      // Assuming first building (Space Miner) for Mining Experience upgrade
      buildings.spaceMiner = (buildings.spaceMiner || 0) + upgrade.value;
    }
  }

  return { fuel, buildings };
}

/**
 * Check if an achievement is unlocked
 * @param condition - The achievement condition type
 * @param threshold - The threshold value
 * @param currentValue - Current value to check against
 * @param buildingId - Optional building ID for building-specific achievements
 * @param buildings - Optional buildings record for building count checks
 * @returns True if achievement is unlocked
 */
export function checkAchievementUnlocked(
  condition: 'totalClicks' | 'buildingCount' | 'totalStardustEarned' | 'totalPrestiges' | 'totalNebulaCrystals',
  threshold: number,
  currentValue: number,
  buildingId?: string,
  buildings?: Record<string, number>
): boolean {
  if (condition === 'buildingCount' && buildingId && buildings) {
    return (buildings[buildingId] || 0) >= threshold;
  }

  return currentValue >= threshold;
}
