/**
 * Cargo management utilities for auto-sell and resource prioritization
 * All functions are pure - no side effects
 */

import type { ResourceInventory, ResourceType } from '@/types';
import { RESOURCES } from '@/constants/resources';

/**
 * Calculate cargo utilization percentage
 * @param current - Current cargo amount
 * @param max - Maximum cargo capacity
 * @returns Percentage (0-100)
 */
export function calculateCargoUtilization(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min((current / max) * 100, 100);
}

/**
 * Check if cargo warning should be shown
 * @param utilization - Current cargo utilization percentage
 * @param threshold - Warning threshold percentage
 * @returns True if warning should be shown
 */
export function shouldShowCargoWarning(utilization: number, threshold: number): boolean {
  return utilization >= threshold;
}

/**
 * Get the lowest priority resource that has available quantity
 * @param resources - Current resource inventory
 * @param priority - Resource priority list (highest priority first)
 * @returns ResourceType to sell, or null if no resources available
 */
export function getLowestPriorityResource(
  resources: ResourceInventory,
  priority: ResourceType[]
): ResourceType | null {
  // Iterate from end of priority list (lowest priority)
  for (let i = priority.length - 1; i >= 0; i--) {
    const resourceType = priority[i];
    if (resources[resourceType] > 0) {
      return resourceType;
    }
  }

  // If no prioritized resources found, check for any resources not in priority list
  const allResourceTypes = RESOURCES.map((r) => r.id as ResourceType);
  for (const resourceType of allResourceTypes) {
    if (!priority.includes(resourceType) && resources[resourceType] > 0) {
      return resourceType;
    }
  }

  return null;
}

/**
 * Calculate how many resources need to be sold to make space
 * @param currentCargo - Current cargo amount
 * @param maxCargo - Maximum cargo capacity
 * @param spaceNeeded - Amount of space needed for new resources
 * @returns Number of units to sell
 */
export function calculateSpaceToFree(
  currentCargo: number,
  maxCargo: number,
  spaceNeeded: number
): number {
  const availableSpace = maxCargo - currentCargo;
  if (availableSpace >= spaceNeeded) return 0;
  return spaceNeeded - availableSpace;
}

/**
 * Auto-sell resources to make space for new items
 * Returns the updated resource inventory and list of resources sold
 * @param resources - Current resource inventory
 * @param priority - Resource priority list (highest priority first)
 * @param spaceNeeded - Amount of space needed
 * @returns Object with updatedResources and soldResources
 */
export function autoSellResources(
  resources: ResourceInventory,
  priority: ResourceType[],
  spaceNeeded: number
): {
  updatedResources: ResourceInventory;
  soldResources: Array<{ type: ResourceType; amount: number; credits: number }>;
} {
  const updatedResources = { ...resources };
  const soldResources: Array<{ type: ResourceType; amount: number; credits: number }> = [];
  let spaceFreed = 0;

  // Keep selling lowest priority resources until we have enough space
  while (spaceFreed < spaceNeeded) {
    const lowestPriorityResource = getLowestPriorityResource(updatedResources, priority);

    if (!lowestPriorityResource) {
      // No more resources to sell
      break;
    }

    const amountAvailable = updatedResources[lowestPriorityResource];
    const amountToSell = Math.min(amountAvailable, spaceNeeded - spaceFreed);

    // Find resource data for credit calculation
    const resourceData = RESOURCES.find((r) => r.id === lowestPriorityResource);
    const creditValue = resourceData ? resourceData.creditValue * amountToSell : 0;

    // Update inventory
    updatedResources[lowestPriorityResource] -= amountToSell;
    spaceFreed += amountToSell;

    // Track what was sold
    soldResources.push({
      type: lowestPriorityResource,
      amount: amountToSell,
      credits: creditValue,
    });
  }

  return {
    updatedResources,
    soldResources,
  };
}

/**
 * Get default resource priority order (rarest/most valuable first)
 * @returns Ordered array of ResourceType
 */
export function getDefaultResourcePriority(): ResourceType[] {
  // Sort by tier (descending) and then by credit value (descending)
  return [...RESOURCES]
    .sort((a, b) => {
      if (a.tier !== b.tier) {
        return b.tier - a.tier; // Higher tier first
      }
      return b.creditValue - a.creditValue; // Higher value first
    })
    .map((r) => r.id as ResourceType);
}

/**
 * Validate and fix resource priority list
 * Ensures all resources are included and no duplicates
 * @param priority - User's priority list
 * @returns Fixed priority list
 */
export function validateResourcePriority(priority: ResourceType[]): ResourceType[] {
  const allResourceTypes = RESOURCES.map((r) => r.id as ResourceType);
  const uniquePriority = Array.from(new Set(priority));

  // Add missing resources at the end
  const missingResources = allResourceTypes.filter((r) => !uniquePriority.includes(r));

  return [...uniquePriority, ...missingResources];
}
