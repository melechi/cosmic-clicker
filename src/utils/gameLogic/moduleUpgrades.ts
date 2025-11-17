/**
 * Module upgrade utility functions
 * Pure functions for module upgrade calculations and validation
 */

import type { ModuleUpgrade } from '@/constants/modules';
import type { ModuleType, BaseModule } from '@/types';

/**
 * Check if a module upgrade can be purchased
 */
export function canPurchaseUpgrade(
  upgrade: ModuleUpgrade,
  module: BaseModule,
  credits: number
): boolean {
  // Check if already purchased
  if (module.purchasedUpgrades.includes(upgrade.id)) {
    return false;
  }

  // Check if can afford
  if (credits < upgrade.cost) {
    return false;
  }

  // Check prerequisites
  if (upgrade.prerequisiteIds && upgrade.prerequisiteIds.length > 0) {
    const hasAllPrerequisites = upgrade.prerequisiteIds.every((prereqId) =>
      module.purchasedUpgrades.includes(prereqId)
    );
    if (!hasAllPrerequisites) {
      return false;
    }
  }

  return true;
}

/**
 * Check if upgrade prerequisites are met
 */
export function hasPrerequisites(
  upgrade: ModuleUpgrade,
  purchasedUpgradeIds: string[]
): boolean {
  if (!upgrade.prerequisiteIds || upgrade.prerequisiteIds.length === 0) {
    return true;
  }

  return upgrade.prerequisiteIds.every((prereqId) =>
    purchasedUpgradeIds.includes(prereqId)
  );
}

/**
 * Check if upgrade is already purchased
 */
export function isUpgradePurchased(
  upgradeId: string,
  module: BaseModule
): boolean {
  return module.purchasedUpgrades.includes(upgradeId);
}

/**
 * Get available upgrades for a module
 * Filters upgrades based on whether they can be purchased or are locked
 */
export function getAvailableUpgrades(
  moduleType: ModuleType,
  allUpgrades: ModuleUpgrade[]
): ModuleUpgrade[] {
  return allUpgrades.filter((upgrade) => upgrade.moduleType === moduleType);
}

/**
 * Get prerequisite upgrade names
 */
export function getPrerequisiteNames(
  upgrade: ModuleUpgrade,
  allUpgrades: ModuleUpgrade[]
): string[] {
  if (!upgrade.prerequisiteIds || upgrade.prerequisiteIds.length === 0) {
    return [];
  }

  return upgrade.prerequisiteIds
    .map((prereqId) => {
      const prereq = allUpgrades.find((u) => u.id === prereqId);
      return prereq ? prereq.name : prereqId;
    })
    .filter(Boolean);
}

/**
 * Format stat change for display
 * Shows the effect of an upgrade (e.g., "Damage: 1 → 2")
 */
export function formatStatChange(
  statName: string,
  currentValue: number | boolean | string | number[] | string[] | undefined,
  newValue: number | boolean | string | number[] | string[] | undefined
): string {
  // Handle boolean values
  if (typeof newValue === 'boolean') {
    return `${statName}: ${newValue ? 'Enabled' : 'Disabled'}`;
  }

  // Handle array values (like unlockedTiers or unlockedSpeeds)
  if (Array.isArray(newValue)) {
    return `${statName}: ${newValue.length} unlocked`;
  }

  // Handle numeric values
  if (typeof newValue === 'number' && typeof currentValue === 'number') {
    // Determine if this is a percentage stat
    const isPercentage = statName.toLowerCase().includes('efficiency') ||
                        statName.toLowerCase().includes('percent');

    if (isPercentage) {
      return `${statName}: ${(currentValue * 100).toFixed(0)}% → ${(newValue * 100).toFixed(0)}%`;
    }

    return `${statName}: ${currentValue} → ${newValue}`;
  }

  // Handle string values
  if (typeof newValue === 'string') {
    return `${statName}: ${newValue}`;
  }

  return `${statName}: Upgraded`;
}

/**
 * Get human-readable stat name
 */
export function getStatDisplayName(statKey: string): string {
  const nameMap: Record<string, string> = {
    damage: 'Damage',
    range: 'Range',
    cooldown: 'Cooldown',
    laserCount: 'Laser Count',
    autoTarget: 'Auto-Targeting',
    piercing: 'Piercing',
    botCount: 'Bot Count',
    botMiningSpeed: 'Mining Speed',
    botRange: 'Bot Range',
    botCapacity: 'Bot Capacity',
    conversionSpeed: 'Conversion Speed',
    conversionEfficiency: 'Efficiency',
    autoConvertPercent: 'Auto-Convert',
    unlockedTiers: 'Unlocked Tiers',
    cargoCapacity: 'Capacity',
    cargoSlots: 'Slots',
    fuelEfficiency: 'Fuel Efficiency',
    tankCapacity: 'Tank Capacity',
    unlockedSpeeds: 'Speed Modes',
    jumpTier: 'Jump Tier',
    chargeTime: 'Charge Time',
    jumpEfficiency: 'Jump Efficiency',
    scannerRange: 'Detection Range',
    resourceScanner: 'Resource Scanner',
    artifactDetector: 'Artifact Detector',
  };

  return nameMap[statKey] || statKey;
}

/**
 * Apply upgrade stat changes to module
 * Returns the updated module with stat changes applied
 */
export function applyUpgradeStatChanges<T extends BaseModule>(
  module: T,
  upgrade: ModuleUpgrade
): T {
  // Create a shallow copy of the module
  const updatedModule = { ...module };

  // Apply each stat change from the upgrade
  Object.entries(upgrade.statChanges).forEach(([statKey, newValue]) => {
    // Type assertion since we know the structure
    (updatedModule as Record<string, unknown>)[statKey] = newValue;
  });

  return updatedModule;
}

/**
 * Get upgrade status for display
 */
export function getUpgradeStatus(
  upgrade: ModuleUpgrade,
  module: BaseModule,
  credits: number
): {
  isPurchased: boolean;
  isAffordable: boolean;
  isLocked: boolean;
  canPurchase: boolean;
} {
  const isPurchased = isUpgradePurchased(upgrade.id, module);
  const isAffordable = credits >= upgrade.cost;
  const isLocked = !hasPrerequisites(upgrade, module.purchasedUpgrades);
  const canPurchase = canPurchaseUpgrade(upgrade, module, credits);

  return {
    isPurchased,
    isAffordable,
    isLocked,
    canPurchase,
  };
}

/**
 * Group upgrades by category based on stat changes
 */
export function groupUpgradesByCategory(
  upgrades: ModuleUpgrade[]
): Record<string, ModuleUpgrade[]> {
  const categories: Record<string, ModuleUpgrade[]> = {};

  upgrades.forEach((upgrade) => {
    // Determine category based on the first stat changed
    const firstStatKey = Object.keys(upgrade.statChanges)[0];
    const category = getStatDisplayName(firstStatKey);

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push(upgrade);
  });

  return categories;
}

/**
 * Sort upgrades by tier/progression
 * Ensures upgrades appear in a logical order
 */
export function sortUpgradesByTier(upgrades: ModuleUpgrade[]): ModuleUpgrade[] {
  return [...upgrades].sort((a, b) => {
    // Sort by cost as a proxy for tier
    return a.cost - b.cost;
  });
}
