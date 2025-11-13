import { describe, it, expect } from 'vitest';
import {
  calculateBuildingCost,
  calculateBulkBuildingCost,
  calculateBuildingProduction,
  calculateTotalProduction,
  calculateClickPower,
  calculatePrestigeReward,
  calculateProductionMultiplier,
  canAfford,
  canPrestige,
  calculateMaxAffordable,
  calculateAutoClickProduction,
  getPrestigeStartingResources,
  checkAchievementUnlocked,
} from './calculations';
import type { Building, BuildingUpgrade, PrestigeUpgrade } from '@/types';
import { initialGameState } from '@/types';

describe('calculateBuildingCost', () => {
  it('should calculate correct cost for first purchase', () => {
    expect(calculateBuildingCost(10, 1.15, 0)).toBe(10);
    expect(calculateBuildingCost(100, 1.15, 0)).toBe(100);
  });

  it('should calculate correct cost for subsequent purchases', () => {
    // Second purchase (index 1): 10 * 1.15^1 = 11.5 -> 11
    expect(calculateBuildingCost(10, 1.15, 1)).toBe(11);
    // Third purchase (index 2): 10 * 1.15^2 = 13.225 -> 13
    expect(calculateBuildingCost(10, 1.15, 2)).toBe(13);
  });

  it('should handle large counts', () => {
    const cost = calculateBuildingCost(10, 1.15, 50);
    expect(cost).toBeGreaterThan(1000);
    expect(Number.isInteger(cost)).toBe(true);
  });

  it('should match game design building costs', () => {
    // Space Miner: base 10
    expect(calculateBuildingCost(10, 1.15, 0)).toBe(10);
    // Asteroid Harvester: base 100
    expect(calculateBuildingCost(100, 1.15, 0)).toBe(100);
    // Lunar Refinery: base 1100
    expect(calculateBuildingCost(1100, 1.15, 0)).toBe(1100);
  });
});

describe('calculateBulkBuildingCost', () => {
  it('should calculate cost for buying multiple buildings', () => {
    // Buying 1 should equal single cost
    expect(calculateBulkBuildingCost(10, 1.15, 0, 1)).toBe(10);

    // Buying 2: 10 + 11 = 21
    expect(calculateBulkBuildingCost(10, 1.15, 0, 2)).toBe(21);

    // Buying 3: 10 + 11 + 13 = 34
    expect(calculateBulkBuildingCost(10, 1.15, 0, 3)).toBe(34);
  });

  it('should handle buying from non-zero count', () => {
    const cost = calculateBulkBuildingCost(10, 1.15, 5, 3);
    expect(cost).toBeGreaterThan(0);
    expect(Number.isInteger(cost)).toBe(true);
  });
});

describe('calculateBuildingProduction', () => {
  const building: Building = {
    id: 'spaceMiner',
    name: 'Space Miner',
    description: 'Test',
    baseCost: 10,
    costMultiplier: 1.15,
    production: 0.1,
    tier: 1,
  };

  it('should return 0 for no buildings', () => {
    expect(calculateBuildingProduction(building, 0, [])).toBe(0);
  });

  it('should calculate base production without upgrades', () => {
    expect(calculateBuildingProduction(building, 1, [])).toBe(0.1);
    expect(calculateBuildingProduction(building, 10, [])).toBe(1);
  });

  it('should apply building-specific upgrade multipliers', () => {
    const upgrades: BuildingUpgrade[] = [
      {
        id: 'upgrade1',
        buildingId: 'spaceMiner',
        name: 'Test',
        description: 'Test',
        cost: 100,
        multiplier: 2,
        requiredCount: 10,
      },
    ];

    expect(calculateBuildingProduction(building, 10, upgrades)).toBe(2);
  });

  it('should apply multiple upgrade multipliers', () => {
    const upgrades: BuildingUpgrade[] = [
      {
        id: 'upgrade1',
        buildingId: 'spaceMiner',
        name: 'Test',
        description: 'Test',
        cost: 100,
        multiplier: 2,
        requiredCount: 10,
      },
      {
        id: 'upgrade2',
        buildingId: 'spaceMiner',
        name: 'Test',
        description: 'Test',
        cost: 1000,
        multiplier: 3,
        requiredCount: 25,
      },
    ];

    // 10 buildings * 0.1 * 2 * 3 = 6
    expect(calculateBuildingProduction(building, 10, upgrades)).toBe(6);
  });

  it('should ignore upgrades for other buildings', () => {
    const upgrades: BuildingUpgrade[] = [
      {
        id: 'upgrade1',
        buildingId: 'otherBuilding',
        name: 'Test',
        description: 'Test',
        cost: 100,
        multiplier: 2,
        requiredCount: 10,
      },
    ];

    expect(calculateBuildingProduction(building, 10, upgrades)).toBe(1);
  });
});

describe('calculateTotalProduction', () => {
  const buildings: Building[] = [
    {
      id: 'spaceMiner',
      name: 'Space Miner',
      description: 'Test',
      baseCost: 10,
      costMultiplier: 1.15,
      production: 0.1,
      tier: 1,
    },
    {
      id: 'asteroidHarvester',
      name: 'Asteroid Harvester',
      description: 'Test',
      baseCost: 100,
      costMultiplier: 1.15,
      production: 1,
      tier: 2,
    },
  ];

  it('should return 0 for no buildings', () => {
    const gameState = { ...initialGameState, buildings: {} };
    expect(calculateTotalProduction(gameState, buildings, [], 1)).toBe(0);
  });

  it('should calculate production from single building type', () => {
    const gameState = { ...initialGameState, buildings: { spaceMiner: 10 } };
    // 10 * 0.1 * 1 (global) * 1 (crystals) * 1 (achievements) = 1
    expect(calculateTotalProduction(gameState, buildings, [], 1)).toBe(1);
  });

  it('should calculate production from multiple building types', () => {
    const gameState = {
      ...initialGameState,
      buildings: { spaceMiner: 10, asteroidHarvester: 5 },
    };
    // (10 * 0.1) + (5 * 1) = 1 + 5 = 6
    expect(calculateTotalProduction(gameState, buildings, [], 1)).toBe(6);
  });

  it('should apply global production multiplier', () => {
    const gameState = { ...initialGameState, buildings: { spaceMiner: 10 } };
    // 10 * 0.1 * 2 (global) * 1 (crystals) * 1 (achievements) = 2
    expect(calculateTotalProduction(gameState, buildings, [], 2)).toBe(2);
  });

  it('should apply Nebula Crystal bonus', () => {
    const gameState = {
      ...initialGameState,
      buildings: { spaceMiner: 10 },
      nebulaCrystals: 100,
    };
    // 10 * 0.1 * 1 * (1 + 100 * 0.01) * 1 = 1 * 2 = 2
    expect(calculateTotalProduction(gameState, buildings, [], 1)).toBe(2);
  });

  it('should apply achievement bonus', () => {
    const gameState = {
      ...initialGameState,
      buildings: { spaceMiner: 10 },
      achievements: ['ach1', 'ach2', 'ach3'],
    };
    // 10 * 0.1 * 1 * 1 * (1 + 3 * 0.01) = 1 * 1.03 = 1.03
    expect(calculateTotalProduction(gameState, buildings, [], 1)).toBe(1.03);
  });

  it('should apply all multipliers together', () => {
    const gameState = {
      ...initialGameState,
      buildings: { spaceMiner: 10 },
      nebulaCrystals: 100,
      achievements: ['ach1', 'ach2'],
    };
    // 10 * 0.1 * 2 (global) * 2 (crystals) * 1.02 (achievements) = 4.08
    expect(calculateTotalProduction(gameState, buildings, [], 2)).toBeCloseTo(4.08);
  });
});

describe('calculateClickPower', () => {
  it('should return base click power with no multipliers', () => {
    expect(calculateClickPower(1, [])).toBe(1);
  });

  it('should apply single multiplier', () => {
    expect(calculateClickPower(1, [2])).toBe(2);
  });

  it('should apply multiple multipliers', () => {
    expect(calculateClickPower(1, [2, 2, 3])).toBe(12);
  });

  it('should apply prestige multiplier', () => {
    expect(calculateClickPower(1, [2], 2)).toBe(4);
  });

  it('should handle fractional base click power', () => {
    expect(calculateClickPower(0.5, [2])).toBe(1);
  });
});

describe('calculatePrestigeReward', () => {
  it('should return 0 if below minimum threshold', () => {
    expect(calculatePrestigeReward(999999)).toBe(0);
    expect(calculatePrestigeReward(500000)).toBe(0);
  });

  it('should calculate correct reward at minimum threshold', () => {
    // sqrt(1000000 / 1000000) = sqrt(1) = 1
    expect(calculatePrestigeReward(1000000)).toBe(1);
  });

  it('should calculate correct reward for larger values', () => {
    // sqrt(4000000 / 1000000) = sqrt(4) = 2
    expect(calculatePrestigeReward(4000000)).toBe(2);

    // sqrt(9000000 / 1000000) = sqrt(9) = 3
    expect(calculatePrestigeReward(9000000)).toBe(3);
  });

  it('should apply prestige bonus', () => {
    // Base: sqrt(4000000 / 1000000) = 2
    // With 10% bonus: 2 * 1.1 = 2.2 -> floor = 2
    expect(calculatePrestigeReward(4000000, 0.1)).toBe(2);

    // Base: sqrt(10000000 / 1000000) = 3.16... -> 3
    // With 10% bonus: 3 * 1.1 = 3.3 -> floor = 3
    expect(calculatePrestigeReward(10000000, 0.1)).toBe(3);

    // Base: sqrt(16000000 / 1000000) = 4
    // With 10% bonus: 4 * 1.1 = 4.4 -> floor = 4
    expect(calculatePrestigeReward(16000000, 0.1)).toBe(4);
  });

  it('should handle very large values', () => {
    const reward = calculatePrestigeReward(1e12);
    expect(reward).toBeGreaterThan(0);
    expect(Number.isInteger(reward)).toBe(true);
  });
});

describe('calculateProductionMultiplier', () => {
  it('should return 1 with no upgrades', () => {
    expect(calculateProductionMultiplier([])).toBe(1);
  });

  it('should apply single multiplier', () => {
    expect(calculateProductionMultiplier([2])).toBe(2);
  });

  it('should apply multiple multipliers', () => {
    expect(calculateProductionMultiplier([2, 2, 3])).toBe(12);
  });

  it('should apply prestige multiplier', () => {
    expect(calculateProductionMultiplier([2], 2)).toBe(4);
  });
});

describe('canAfford', () => {
  it('should return true when player can afford', () => {
    expect(canAfford(100, 50)).toBe(true);
    expect(canAfford(100, 100)).toBe(true);
  });

  it('should return false when player cannot afford', () => {
    expect(canAfford(50, 100)).toBe(false);
    expect(canAfford(99, 100)).toBe(false);
  });

  it('should handle exact amounts', () => {
    expect(canAfford(1000, 1000)).toBe(true);
  });
});

describe('canPrestige', () => {
  it('should return false below minimum', () => {
    expect(canPrestige(999999)).toBe(false);
    expect(canPrestige(0)).toBe(false);
  });

  it('should return true at minimum', () => {
    expect(canPrestige(1000000)).toBe(true);
  });

  it('should return true above minimum', () => {
    expect(canPrestige(5000000)).toBe(true);
  });
});

describe('calculateMaxAffordable', () => {
  it('should return 0 if cannot afford any', () => {
    expect(calculateMaxAffordable(5, 10, 1.15, 0)).toBe(0);
  });

  it('should calculate max affordable for first purchases', () => {
    // Can afford 1 at cost 10
    expect(calculateMaxAffordable(10, 10, 1.15, 0)).toBe(1);

    // Can afford 2 (10 + 11 = 21, but only have 20)
    expect(calculateMaxAffordable(20, 10, 1.15, 0)).toBe(1);

    // Can afford 2 (10 + 11 = 21)
    expect(calculateMaxAffordable(21, 10, 1.15, 0)).toBe(2);
  });

  it('should handle large affordable amounts', () => {
    const max = calculateMaxAffordable(100000, 10, 1.15, 0);
    expect(max).toBeGreaterThan(0);
    expect(max).toBeLessThanOrEqual(1000); // Safety limit
  });

  it('should respect safety limit', () => {
    const max = calculateMaxAffordable(1e100, 1, 1.01, 0);
    expect(max).toBe(1000); // Exact safety limit
  });
});

describe('calculateAutoClickProduction', () => {
  it('should return 0 with no auto-click upgrades', () => {
    expect(calculateAutoClickProduction([], 1)).toBe(0);
  });

  it('should calculate production from single auto-clicker', () => {
    expect(calculateAutoClickProduction([1], 5)).toBe(5);
  });

  it('should sum multiple auto-clickers', () => {
    expect(calculateAutoClickProduction([1, 2, 5], 10)).toBe(80);
  });

  it('should apply click power to auto-clicks', () => {
    expect(calculateAutoClickProduction([10], 2)).toBe(20);
  });
});

describe('getPrestigeStartingResources', () => {
  it('should return empty resources with no upgrades', () => {
    const result = getPrestigeStartingResources([]);
    expect(result.stardust).toBe(0);
    expect(result.buildings).toEqual({});
  });

  it('should handle startStardust upgrade', () => {
    const upgrades: PrestigeUpgrade[] = [
      {
        id: 'test',
        name: 'Test',
        description: 'Test',
        cost: 5,
        type: 'prestige',
        effect: 'startStardust',
        value: 100,
      },
    ];

    const result = getPrestigeStartingResources(upgrades);
    expect(result.stardust).toBe(100);
  });

  it('should handle startBuildings upgrade', () => {
    const upgrades: PrestigeUpgrade[] = [
      {
        id: 'test',
        name: 'Test',
        description: 'Test',
        cost: 10,
        type: 'prestige',
        effect: 'startBuildings',
        value: 5,
      },
    ];

    const result = getPrestigeStartingResources(upgrades);
    expect(result.buildings.spaceMiner).toBe(5);
  });

  it('should combine multiple upgrades', () => {
    const upgrades: PrestigeUpgrade[] = [
      {
        id: 'test1',
        name: 'Test',
        description: 'Test',
        cost: 5,
        type: 'prestige',
        effect: 'startStardust',
        value: 100,
      },
      {
        id: 'test2',
        name: 'Test',
        description: 'Test',
        cost: 10,
        type: 'prestige',
        effect: 'startBuildings',
        value: 5,
      },
    ];

    const result = getPrestigeStartingResources(upgrades);
    expect(result.stardust).toBe(100);
    expect(result.buildings.spaceMiner).toBe(5);
  });
});

describe('checkAchievementUnlocked', () => {
  it('should check totalClicks condition', () => {
    expect(checkAchievementUnlocked('totalClicks', 100, 150)).toBe(true);
    expect(checkAchievementUnlocked('totalClicks', 100, 50)).toBe(false);
    expect(checkAchievementUnlocked('totalClicks', 100, 100)).toBe(true);
  });

  it('should check totalStardustEarned condition', () => {
    expect(checkAchievementUnlocked('totalStardustEarned', 1000000, 2000000)).toBe(true);
    expect(checkAchievementUnlocked('totalStardustEarned', 1000000, 500000)).toBe(false);
  });

  it('should check buildingCount condition', () => {
    const buildings = { spaceMiner: 50, asteroidHarvester: 10 };

    expect(
      checkAchievementUnlocked('buildingCount', 50, 0, 'spaceMiner', buildings)
    ).toBe(true);
    expect(
      checkAchievementUnlocked('buildingCount', 25, 0, 'asteroidHarvester', buildings)
    ).toBe(false);
    expect(
      checkAchievementUnlocked('buildingCount', 10, 0, 'asteroidHarvester', buildings)
    ).toBe(true);
  });

  it('should handle missing building', () => {
    const buildings = { spaceMiner: 10 };

    expect(
      checkAchievementUnlocked('buildingCount', 1, 0, 'nonExistent', buildings)
    ).toBe(false);
  });
});
