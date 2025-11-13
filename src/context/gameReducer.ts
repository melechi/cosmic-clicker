import type { GameState } from '@/types';
import type { GameAction } from './actions';
import { initialGameState } from '@/types';
import {
  BUILDINGS,
  BUILDING_UPGRADES,
  CLICK_UPGRADES,
  PRODUCTION_UPGRADES,
  AUTO_CLICK_UPGRADES,
  PRESTIGE_UPGRADES,
  getBuildingById,
  getUpgradeById,
} from '@/constants';
import {
  calculateBuildingCost,
  calculateBulkBuildingCost,
  calculateTotalProduction,
  calculateClickPower,
  calculatePrestigeReward,
  calculateProductionMultiplier,
  calculateAutoClickProduction,
  getPrestigeStartingResources,
  canAfford,
} from '@/utils/gameLogic/calculations';

/**
 * Main game reducer function
 * Handles all game state transitions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CLICK': {
      return {
        ...state,
        stardust: state.stardust + state.clickPower,
        totalStardustEarned: state.totalStardustEarned + state.clickPower,
        statistics: {
          ...state.statistics,
          totalClicks: state.statistics.totalClicks + 1,
        },
      };
    }

    case 'BUY_BUILDING': {
      const { buildingId, quantity = 1 } = action.payload;
      const building = getBuildingById(buildingId);

      if (!building) return state;

      const currentCount = state.buildings[buildingId] || 0;
      const cost =
        quantity === 1
          ? calculateBuildingCost(building.baseCost, building.costMultiplier, currentCount)
          : calculateBulkBuildingCost(
              building.baseCost,
              building.costMultiplier,
              currentCount,
              quantity
            );

      if (!canAfford(state.stardust, cost)) return state;

      // Update production after purchase
      const newBuildingCounts = {
        ...state.buildings,
        [buildingId]: currentCount + quantity,
      };

      const purchasedBuildingUpgrades = BUILDING_UPGRADES.filter((upgrade) =>
        state.upgrades.includes(upgrade.id)
      );

      const clickMultipliers = CLICK_UPGRADES.filter((u) => state.upgrades.includes(u.id)).map(
        (u) => u.multiplier
      );

      const productionMultipliers = PRODUCTION_UPGRADES.filter((u) =>
        state.upgrades.includes(u.id)
      ).map((u) => u.multiplier);

      const prestigeClickMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => state.upgrades.includes(u.id) && u.effect === 'clickMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const prestigeProductionMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => state.upgrades.includes(u.id) && u.effect === 'productionMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const productionMultiplier = calculateProductionMultiplier(
        productionMultipliers,
        prestigeProductionMultiplier
      );

      const autoClickCPS = AUTO_CLICK_UPGRADES.filter((u) => state.upgrades.includes(u.id)).map(
        (u) => u.clicksPerSecond
      );

      const clickPower = calculateClickPower(1, clickMultipliers, prestigeClickMultiplier);

      const autoClickProduction = calculateAutoClickProduction(autoClickCPS, clickPower);

      const buildingProduction = calculateTotalProduction(
        { ...state, buildings: newBuildingCounts },
        BUILDINGS,
        purchasedBuildingUpgrades,
        productionMultiplier
      );

      return {
        ...state,
        stardust: state.stardust - cost,
        buildings: newBuildingCounts,
        productionPerSecond: buildingProduction + autoClickProduction,
        statistics: {
          ...state.statistics,
          buildingsPurchased: state.statistics.buildingsPurchased + quantity,
        },
      };
    }

    case 'BUY_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = getUpgradeById(upgradeId);

      if (!upgrade) return state;
      if (state.upgrades.includes(upgradeId)) return state; // Already purchased
      if (!canAfford(state.stardust, upgrade.cost)) return state;

      const newUpgrades = [...state.upgrades, upgradeId];

      // Recalculate click power and production
      const clickMultipliers = CLICK_UPGRADES.filter((u) => newUpgrades.includes(u.id)).map(
        (u) => u.multiplier
      );

      const productionMultipliers = PRODUCTION_UPGRADES.filter((u) =>
        newUpgrades.includes(u.id)
      ).map((u) => u.multiplier);

      const autoClickCPS = AUTO_CLICK_UPGRADES.filter((u) => newUpgrades.includes(u.id)).map(
        (u) => u.clicksPerSecond
      );

      const prestigeClickMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => newUpgrades.includes(u.id) && u.effect === 'clickMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const prestigeProductionMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => newUpgrades.includes(u.id) && u.effect === 'productionMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const productionMultiplier = calculateProductionMultiplier(
        productionMultipliers,
        prestigeProductionMultiplier
      );

      const clickPower = calculateClickPower(1, clickMultipliers, prestigeClickMultiplier);

      const purchasedBuildingUpgrades = BUILDING_UPGRADES.filter((upgrade) =>
        newUpgrades.includes(upgrade.id)
      );

      const autoClickProduction = calculateAutoClickProduction(autoClickCPS, clickPower);

      const buildingProduction = calculateTotalProduction(
        { ...state, upgrades: newUpgrades },
        BUILDINGS,
        purchasedBuildingUpgrades,
        productionMultiplier
      );

      return {
        ...state,
        stardust: state.stardust - upgrade.cost,
        upgrades: newUpgrades,
        clickPower,
        productionPerSecond: buildingProduction + autoClickProduction,
        statistics: {
          ...state.statistics,
          upgradesPurchased: state.statistics.upgradesPurchased + 1,
        },
      };
    }

    case 'BUY_BUILDING_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = BUILDING_UPGRADES.find((u) => u.id === upgradeId);

      if (!upgrade) return state;
      if (state.upgrades.includes(upgradeId)) return state;

      const buildingCount = state.buildings[upgrade.buildingId] || 0;
      if (buildingCount < upgrade.requiredCount) return state;
      if (!canAfford(state.stardust, upgrade.cost)) return state;

      const newUpgrades = [...state.upgrades, upgradeId];

      const purchasedBuildingUpgrades = BUILDING_UPGRADES.filter((u) =>
        newUpgrades.includes(u.id)
      );

      const productionMultipliers = PRODUCTION_UPGRADES.filter((u) =>
        newUpgrades.includes(u.id)
      ).map((u) => u.multiplier);

      const prestigeProductionMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => newUpgrades.includes(u.id) && u.effect === 'productionMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const productionMultiplier = calculateProductionMultiplier(
        productionMultipliers,
        prestigeProductionMultiplier
      );

      const clickMultipliers = CLICK_UPGRADES.filter((u) => newUpgrades.includes(u.id)).map(
        (u) => u.multiplier
      );

      const autoClickCPS = AUTO_CLICK_UPGRADES.filter((u) => newUpgrades.includes(u.id)).map(
        (u) => u.clicksPerSecond
      );

      const prestigeClickMultiplier = PRESTIGE_UPGRADES.filter(
        (u) => newUpgrades.includes(u.id) && u.effect === 'clickMultiplier'
      ).reduce((acc, u) => acc * u.value, 1);

      const clickPower = calculateClickPower(1, clickMultipliers, prestigeClickMultiplier);

      const autoClickProduction = calculateAutoClickProduction(autoClickCPS, clickPower);

      const buildingProduction = calculateTotalProduction(
        { ...state, upgrades: newUpgrades },
        BUILDINGS,
        purchasedBuildingUpgrades,
        productionMultiplier
      );

      return {
        ...state,
        stardust: state.stardust - upgrade.cost,
        upgrades: newUpgrades,
        productionPerSecond: buildingProduction + autoClickProduction,
        statistics: {
          ...state.statistics,
          upgradesPurchased: state.statistics.upgradesPurchased + 1,
        },
      };
    }

    case 'BUY_PRESTIGE_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgrade = PRESTIGE_UPGRADES.find((u) => u.id === upgradeId);

      if (!upgrade) return state;
      if (state.upgrades.includes(upgradeId)) return state;
      if (state.nebulaCrystals < upgrade.cost) return state;

      return {
        ...state,
        nebulaCrystals: state.nebulaCrystals - upgrade.cost,
        upgrades: [...state.upgrades, upgradeId],
        statistics: {
          ...state.statistics,
          upgradesPurchased: state.statistics.upgradesPurchased + 1,
        },
      };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const { achievementId } = action.payload;

      if (state.achievements.includes(achievementId)) return state;

      return {
        ...state,
        achievements: [...state.achievements, achievementId],
      };
    }

    case 'PRESTIGE': {
      const prestigeBonus = PRESTIGE_UPGRADES.filter(
        (u) => state.upgrades.includes(u.id) && u.effect === 'prestigeBonus'
      ).reduce((acc, u) => acc + u.value, 0);

      const newCrystals = calculatePrestigeReward(state.totalStardustEarned, prestigeBonus);

      if (newCrystals === 0) return state;

      // Keep prestige upgrades
      const prestigeUpgrades = state.upgrades.filter((id) =>
        PRESTIGE_UPGRADES.some((u) => u.id === id)
      );

      // Get starting resources from prestige upgrades
      const purchasedPrestigeUpgrades = PRESTIGE_UPGRADES.filter((u) =>
        prestigeUpgrades.includes(u.id)
      );
      const { stardust: startStardust, buildings: startBuildings } =
        getPrestigeStartingResources(purchasedPrestigeUpgrades);

      // Check if auto-clicker should be unlocked at start
      const hasAutoClickStart = purchasedPrestigeUpgrades.some(
        (u) => u.effect === 'autoClickStart'
      );

      const autoClickUpgrades = hasAutoClickStart ? [AUTO_CLICK_UPGRADES[0].id] : [];

      return {
        ...initialGameState,
        nebulaCrystals: state.nebulaCrystals + newCrystals,
        upgrades: [...prestigeUpgrades, ...autoClickUpgrades],
        achievements: state.achievements, // Keep achievements
        stardust: startStardust,
        totalStardustEarned: startStardust,
        buildings: startBuildings,
        statistics: {
          ...initialGameState.statistics,
          totalPrestiges: state.statistics.totalPrestiges + 1,
        },
        lastSaveTime: Date.now(),
      };
    }

    case 'TICK': {
      const { deltaTime } = action.payload;

      return {
        ...state,
        stardust: state.stardust + state.productionPerSecond * deltaTime,
        totalStardustEarned: state.totalStardustEarned + state.productionPerSecond * deltaTime,
        statistics: {
          ...state.statistics,
          currentSessionTime: state.statistics.currentSessionTime + deltaTime,
          totalPlayTime: state.statistics.totalPlayTime + deltaTime,
        },
      };
    }

    case 'LOAD_SAVE': {
      return {
        ...action.payload,
        lastSaveTime: Date.now(),
      };
    }

    case 'APPLY_OFFLINE_PROGRESS': {
      const { stardust, timeAway } = action.payload;

      return {
        ...state,
        stardust: state.stardust + stardust,
        totalStardustEarned: state.totalStardustEarned + stardust,
        statistics: {
          ...state.statistics,
          totalPlayTime: state.statistics.totalPlayTime + timeAway,
        },
      };
    }

    case 'HARD_RESET': {
      return {
        ...initialGameState,
        lastSaveTime: Date.now(),
      };
    }

    default:
      return state;
  }
}
