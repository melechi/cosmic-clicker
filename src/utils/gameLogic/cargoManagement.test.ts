/**
 * Unit tests for cargo management utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCargoUtilization,
  shouldShowCargoWarning,
  getLowestPriorityResource,
  calculateSpaceToFree,
  autoSellResources,
  getDefaultResourcePriority,
  validateResourcePriority,
} from './cargoManagement';
import type { ResourceInventory, ResourceType } from '@/types';

describe('calculateCargoUtilization', () => {
  it('should calculate correct utilization percentage', () => {
    expect(calculateCargoUtilization(50, 100)).toBe(50);
    expect(calculateCargoUtilization(80, 100)).toBe(80);
    expect(calculateCargoUtilization(100, 100)).toBe(100);
  });

  it('should handle zero max cargo', () => {
    expect(calculateCargoUtilization(50, 0)).toBe(0);
  });

  it('should cap at 100%', () => {
    expect(calculateCargoUtilization(150, 100)).toBe(100);
  });

  it('should handle decimal values correctly', () => {
    expect(calculateCargoUtilization(33, 100)).toBe(33);
    expect(calculateCargoUtilization(66.67, 100)).toBe(66.67);
  });
});

describe('shouldShowCargoWarning', () => {
  it('should return true when utilization meets threshold', () => {
    expect(shouldShowCargoWarning(80, 80)).toBe(true);
    expect(shouldShowCargoWarning(90, 80)).toBe(true);
    expect(shouldShowCargoWarning(100, 80)).toBe(true);
  });

  it('should return false when utilization is below threshold', () => {
    expect(shouldShowCargoWarning(79, 80)).toBe(false);
    expect(shouldShowCargoWarning(50, 80)).toBe(false);
    expect(shouldShowCargoWarning(0, 80)).toBe(false);
  });
});

describe('getLowestPriorityResource', () => {
  const priority: ResourceType[] = ['darkMatter', 'gold', 'iron', 'stone'];

  it('should return lowest priority resource with quantity', () => {
    const resources: ResourceInventory = {
      stone: 10,
      carbon: 0,
      iron: 5,
      ice: 0,
      gold: 2,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 1,
    };

    expect(getLowestPriorityResource(resources, priority)).toBe('stone');
  });

  it('should skip resources with zero quantity', () => {
    const resources: ResourceInventory = {
      stone: 0,
      carbon: 0,
      iron: 10,
      ice: 0,
      gold: 2,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 1,
    };

    expect(getLowestPriorityResource(resources, priority)).toBe('iron');
  });

  it('should return null when no resources available', () => {
    const resources: ResourceInventory = {
      stone: 0,
      carbon: 0,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    expect(getLowestPriorityResource(resources, priority)).toBeNull();
  });

  it('should handle resources not in priority list', () => {
    const resources: ResourceInventory = {
      stone: 0,
      carbon: 10, // Not in priority list
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    expect(getLowestPriorityResource(resources, priority)).toBe('carbon');
  });
});

describe('calculateSpaceToFree', () => {
  it('should return 0 when enough space available', () => {
    expect(calculateSpaceToFree(50, 100, 30)).toBe(0);
    expect(calculateSpaceToFree(0, 100, 50)).toBe(0);
  });

  it('should calculate correct space needed', () => {
    expect(calculateSpaceToFree(90, 100, 20)).toBe(10);
    expect(calculateSpaceToFree(95, 100, 10)).toBe(5);
    expect(calculateSpaceToFree(100, 100, 10)).toBe(10);
  });

  it('should handle exact capacity scenarios', () => {
    expect(calculateSpaceToFree(100, 100, 0)).toBe(0);
    expect(calculateSpaceToFree(100, 100, 1)).toBe(1);
  });
});

describe('autoSellResources', () => {
  const priority: ResourceType[] = ['darkMatter', 'platinum', 'gold', 'iron', 'stone'];

  it('should sell lowest priority resources first', () => {
    const resources: ResourceInventory = {
      stone: 20,
      carbon: 0,
      iron: 10,
      ice: 0,
      gold: 5,
      titanium: 0,
      platinum: 2,
      iridium: 0,
      darkMatter: 1,
    };

    const result = autoSellResources(resources, priority, 15);

    expect(result.soldResources).toHaveLength(1);
    expect(result.soldResources[0].type).toBe('stone');
    expect(result.soldResources[0].amount).toBe(15);
    expect(result.updatedResources.stone).toBe(5);
  });

  it('should sell multiple resource types if needed', () => {
    const resources: ResourceInventory = {
      stone: 10,
      carbon: 0,
      iron: 10,
      ice: 0,
      gold: 5,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    const result = autoSellResources(resources, priority, 15);

    expect(result.soldResources.length).toBeGreaterThan(1);
    expect(result.soldResources[0].type).toBe('stone');
    expect(result.soldResources[0].amount).toBe(10);
    expect(result.soldResources[1].type).toBe('iron');
    expect(result.soldResources[1].amount).toBe(5);
  });

  it('should calculate correct credit values', () => {
    const resources: ResourceInventory = {
      stone: 10, // stone creditValue = 1, so 10 stone = 10 credits
      carbon: 0,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    const result = autoSellResources(resources, priority, 5);

    expect(result.soldResources[0].credits).toBe(5); // 5 stone * 1 credit each
  });

  it('should not modify original resources object', () => {
    const resources: ResourceInventory = {
      stone: 20,
      carbon: 0,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    const originalStone = resources.stone;
    autoSellResources(resources, priority, 10);

    expect(resources.stone).toBe(originalStone); // Original unchanged
  });

  it('should handle case when not enough resources to sell', () => {
    const resources: ResourceInventory = {
      stone: 5,
      carbon: 0,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    const result = autoSellResources(resources, priority, 10);

    expect(result.soldResources[0].amount).toBe(5); // Only sold what's available
    expect(result.updatedResources.stone).toBe(0);
  });
});

describe('getDefaultResourcePriority', () => {
  it('should return all resource types', () => {
    const priority = getDefaultResourcePriority();
    expect(priority).toHaveLength(9);
  });

  it('should order by tier and value (highest first)', () => {
    const priority = getDefaultResourcePriority();

    // Dark matter should be first (Tier 4, highest value)
    expect(priority[0]).toBe('darkMatter');

    // Stone should be last (Tier 1, lowest value)
    expect(priority[priority.length - 1]).toBe('stone');
  });

  it('should not contain duplicates', () => {
    const priority = getDefaultResourcePriority();
    const uniquePriority = Array.from(new Set(priority));
    expect(priority.length).toBe(uniquePriority.length);
  });
});

describe('validateResourcePriority', () => {
  it('should return valid priority unchanged', () => {
    const priority: ResourceType[] = [
      'darkMatter',
      'platinum',
      'gold',
      'iron',
      'stone',
      'carbon',
      'ice',
      'titanium',
      'iridium',
    ];

    const result = validateResourcePriority(priority);
    expect(result).toEqual(priority);
  });

  it('should remove duplicates', () => {
    const priority: ResourceType[] = [
      'darkMatter',
      'stone',
      'stone', // duplicate
      'iron',
    ];

    const result = validateResourcePriority(priority);
    expect(result.filter((r) => r === 'stone')).toHaveLength(1);
  });

  it('should add missing resources', () => {
    const priority: ResourceType[] = ['darkMatter', 'stone'];

    const result = validateResourcePriority(priority);
    expect(result).toHaveLength(9); // All 9 resource types
  });

  it('should preserve order of existing resources', () => {
    const priority: ResourceType[] = ['stone', 'iron', 'gold'];

    const result = validateResourcePriority(priority);
    expect(result[0]).toBe('stone');
    expect(result[1]).toBe('iron');
    expect(result[2]).toBe('gold');
  });

  it('should add missing resources at the end', () => {
    const priority: ResourceType[] = ['darkMatter', 'stone'];

    const result = validateResourcePriority(priority);
    expect(result[0]).toBe('darkMatter');
    expect(result[1]).toBe('stone');
    // Remaining resources added at end
    expect(result.length).toBe(9);
  });
});
