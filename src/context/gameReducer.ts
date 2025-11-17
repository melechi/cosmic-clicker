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
import {
  updateObjectPosition,
  updateObjectRotation,
  checkOutOfBounds,
  checkLaserHit,
  checkLaserMultipleHits,
} from '@/utils/gameLogic/objectPhysics';
import {
  updateBotState,
  getTargetedObjectIds,
} from '@/utils/gameLogic/botAI';
import {
  convertResourceToFuel,
  calculateResourceValue,
  calculateFuelConsumption,
  calculateTotalCargo,
  calculateMaxCargoAddition,
  SPEED_FUEL_MULTIPLIERS,
} from '@/utils/gameLogic/resourceConversion';
import {
  getUpgradeById as getModuleUpgradeById,
  canPurchaseUpgrade as canPurchaseModuleUpgrade,
} from '@/constants/modules';
import { applyUpgradeStatChanges } from '@/utils/gameLogic/moduleUpgrades';

/**
 * Main game reducer function
 * Handles all game state transitions
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CLICK': {
      return {
        ...state,
        fuel: state.fuel + state.clickPower,
        totalFuelEarned: state.totalFuelEarned + state.clickPower,
        zoneProgress: state.zoneProgress + state.clickPower,
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

      if (!canAfford(state.fuel, cost)) return state;

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
        fuel: state.fuel - cost,
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
      if (!canAfford(state.fuel, upgrade.cost)) return state;

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
        fuel: state.fuel - upgrade.cost,
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
      if (!canAfford(state.fuel, upgrade.cost)) return state;

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
        fuel: state.fuel - upgrade.cost,
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

      const newCrystals = calculatePrestigeReward(state.totalFuelEarned, prestigeBonus);

      if (newCrystals === 0) return state;

      // Keep prestige upgrades
      const prestigeUpgrades = state.upgrades.filter((id) =>
        PRESTIGE_UPGRADES.some((u) => u.id === id)
      );

      // Get starting resources from prestige upgrades
      const purchasedPrestigeUpgrades = PRESTIGE_UPGRADES.filter((u) =>
        prestigeUpgrades.includes(u.id)
      );
      const { fuel: startStardust, buildings: startBuildings } =
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
        fuel: startStardust,
        totalFuelEarned: startStardust,
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
      const fuelEarned = state.productionPerSecond * deltaTime;

      // Phase 1: Calculate fuel consumption based on ship speed
      const speedMultiplier = SPEED_FUEL_MULTIPLIERS[state.shipSpeed] || 1.0;
      const fuelConsumed = calculateFuelConsumption(
        1.0, // Base consumption rate
        speedMultiplier,
        state.modules.engine.fuelEfficiencyPercent,
        deltaTime
      );

      // Stop ship if out of fuel
      const newFuel = Math.max(0, state.fuel + fuelEarned - fuelConsumed);
      const actualSpeed = newFuel > 0 || speedMultiplier === 0 ? state.shipSpeed : 'stop';

      // Phase 1: Update object positions and remove out-of-bounds objects
      const screenHeight = 800; // TODO: Get from game config or window size
      const updatedObjects = state.objects
        .map((obj) => {
          if (obj.destroyed) return obj;

          // Update position
          const newPosition = updateObjectPosition(obj, deltaTime);

          // Update rotation if object has rotation
          const newRotation =
            obj.rotation !== undefined && obj.rotationSpeed !== undefined
              ? updateObjectRotation(obj.rotation, obj.rotationSpeed, deltaTime)
              : obj.rotation;

          return {
            ...obj,
            position: newPosition,
            rotation: newRotation,
          };
        })
        .filter((obj) => !checkOutOfBounds(obj, screenHeight)); // Remove out-of-bounds objects

      return {
        ...state,
        fuel: newFuel,
        totalFuelEarned: state.totalFuelEarned + fuelEarned,
        zoneProgress: state.zoneProgress + fuelEarned,
        shipSpeed: actualSpeed,
        fuelConsumptionRate: fuelConsumed / deltaTime,
        objects: updatedObjects,
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
      const { fuel, timeAway } = action.payload;

      return {
        ...state,
        fuel: state.fuel + fuel,
        totalFuelEarned: state.totalFuelEarned + fuel,
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

    case 'WARP_TO_NEXT_ZONE': {
      // Move to next zone and reset zone progress
      return {
        ...state,
        currentZone: state.currentZone + 1,
        zoneProgress: 0,
      };
    }

    case 'SET_ZONE': {
      // Debug action to set zone directly
      const { zone } = action.payload;
      return {
        ...state,
        currentZone: zone,
        zoneProgress: 0,
      };
    }

    case 'ADD_FUEL': {
      // Debug action to add fuel
      const { amount } = action.payload;
      return {
        ...state,
        fuel: state.fuel + amount,
        totalFuelEarned: state.totalFuelEarned + amount,
        zoneProgress: state.zoneProgress + amount,
      };
    }

    // ========================================
    // Phase 1: Object Interaction Actions
    // ========================================

    case 'SPAWN_OBJECT': {
      const { object } = action.payload;
      return {
        ...state,
        objects: [...state.objects, object],
      };
    }

    case 'DESPAWN_OBJECT': {
      const { objectId } = action.payload;
      return {
        ...state,
        objects: state.objects.filter((obj) => obj.id !== objectId),
      };
    }

    case 'UPDATE_OBJECTS': {
      const { deltaTime } = action.payload;
      const screenHeight = 800; // TODO: Get from game config

      const updatedObjects = state.objects
        .map((obj) => {
          if (obj.destroyed) return obj;

          const newPosition = updateObjectPosition(obj, deltaTime);
          const newRotation =
            obj.rotation !== undefined && obj.rotationSpeed !== undefined
              ? updateObjectRotation(obj.rotation, obj.rotationSpeed, deltaTime)
              : obj.rotation;

          return {
            ...obj,
            position: newPosition,
            rotation: newRotation,
          };
        })
        .filter((obj) => !checkOutOfBounds(obj, screenHeight));

      return {
        ...state,
        objects: updatedObjects,
      };
    }

    // ========================================
    // Phase 1: Laser & Mining Actions
    // ========================================

    case 'FIRE_LASER': {
      const { position } = action.payload;
      const { laser } = state.modules;

      // Check if laser can fire (within range)
      const hitObjects = laser.piercing
        ? checkLaserMultipleHits(position, state.objects, laser.range, laser.laserCount)
        : [checkLaserHit(position, state.objects, laser.range)].filter(Boolean);

      if (hitObjects.length === 0) {
        return state; // No hits
      }

      // Apply damage to hit objects
      let newState = state;
      for (const hitObject of hitObjects) {
        if (!hitObject) continue;

        const newHealth = hitObject.health - laser.damage;

        if (newHealth <= 0) {
          // Object destroyed - collect resources
          const updatedObjects = newState.objects.map((obj) =>
            obj.id === hitObject.id ? { ...obj, health: 0, destroyed: true } : obj
          );

          // Add resources to cargo
          let updatedResources = { ...newState.resources };
          const totalCargo = calculateTotalCargo(updatedResources);

          for (const drop of hitObject.resourceDrops) {
            const maxAddition = calculateMaxCargoAddition(
              totalCargo,
              state.modules.cargoHold.totalCapacity,
              drop.amount
            );

            if (maxAddition > 0) {
              updatedResources[drop.type] =
                (updatedResources[drop.type] || 0) + maxAddition;
            }
          }

          // Add special drops (fuel, credits)
          const fuelBonus = hitObject.specialDrops?.fuel || 0;
          const creditBonus = hitObject.specialDrops?.credits || 0;

          newState = {
            ...newState,
            objects: updatedObjects,
            resources: updatedResources,
            fuel: newState.fuel + fuelBonus,
            credits: newState.credits + creditBonus,
          };
        } else {
          // Just damage the object
          const updatedObjects = newState.objects.map((obj) =>
            obj.id === hitObject.id ? { ...obj, health: newHealth } : obj
          );

          newState = {
            ...newState,
            objects: updatedObjects,
          };
        }
      }

      return newState;
    }

    case 'DAMAGE_OBJECT': {
      const { objectId, damage } = action.payload;
      const targetObject = state.objects.find((obj) => obj.id === objectId);

      if (!targetObject || targetObject.destroyed) {
        return state;
      }

      const newHealth = Math.max(0, targetObject.health - damage);
      const isDestroyed = newHealth <= 0;

      const updatedObjects = state.objects.map((obj) =>
        obj.id === objectId
          ? { ...obj, health: newHealth, destroyed: isDestroyed }
          : obj
      );

      // If destroyed, collect resources
      if (isDestroyed) {
        let updatedResources = { ...state.resources };
        const totalCargo = calculateTotalCargo(updatedResources);

        for (const drop of targetObject.resourceDrops) {
          const maxAddition = calculateMaxCargoAddition(
            totalCargo,
            state.modules.cargoHold.totalCapacity,
            drop.amount
          );

          if (maxAddition > 0) {
            updatedResources[drop.type] = (updatedResources[drop.type] || 0) + maxAddition;
          }
        }

        const fuelBonus = targetObject.specialDrops?.fuel || 0;
        const creditBonus = targetObject.specialDrops?.credits || 0;

        return {
          ...state,
          objects: updatedObjects,
          resources: updatedResources,
          fuel: state.fuel + fuelBonus,
          credits: state.credits + creditBonus,
        };
      }

      return {
        ...state,
        objects: updatedObjects,
      };
    }

    case 'DESTROY_OBJECT': {
      const { objectId } = action.payload;
      const targetObject = state.objects.find((obj) => obj.id === objectId);

      if (!targetObject) {
        return state;
      }

      // Mark object as destroyed
      const updatedObjects = state.objects.map((obj) =>
        obj.id === objectId ? { ...obj, health: 0, destroyed: true } : obj
      );

      // Collect resources
      let updatedResources = { ...state.resources };
      const totalCargo = calculateTotalCargo(updatedResources);

      for (const drop of targetObject.resourceDrops) {
        const maxAddition = calculateMaxCargoAddition(
          totalCargo,
          state.modules.cargoHold.totalCapacity,
          drop.amount
        );

        if (maxAddition > 0) {
          updatedResources[drop.type] = (updatedResources[drop.type] || 0) + maxAddition;
        }
      }

      const fuelBonus = targetObject.specialDrops?.fuel || 0;
      const creditBonus = targetObject.specialDrops?.credits || 0;

      return {
        ...state,
        objects: updatedObjects,
        resources: updatedResources,
        fuel: state.fuel + fuelBonus,
        credits: state.credits + creditBonus,
      };
    }

    // ========================================
    // Phase 1: Resource Management Actions
    // ========================================

    case 'COLLECT_RESOURCE': {
      const { resourceType, amount } = action.payload;
      const totalCargo = calculateTotalCargo(state.resources);
      const maxAddition = calculateMaxCargoAddition(
        totalCargo,
        state.modules.cargoHold.totalCapacity,
        amount
      );

      if (maxAddition <= 0) {
        // Cargo is full - check if auto-sell is enabled
        if (state.modules.cargoHold.autoSell) {
          // Import auto-sell functions
          const {
            autoSellResources,
            calculateSpaceToFree,
          } = require('@/utils/gameLogic/cargoManagement');

          const spaceNeeded = calculateSpaceToFree(
            totalCargo,
            state.modules.cargoHold.totalCapacity,
            amount
          );

          if (spaceNeeded > 0) {
            const { updatedResources, soldResources } = autoSellResources(
              state.resources,
              state.modules.cargoHold.resourcePriority,
              spaceNeeded
            );

            // Calculate total credits gained
            const totalCredits = soldResources.reduce((sum, sale) => sum + sale.credits, 0);

            // Add the new resource after making space
            updatedResources[resourceType] = (updatedResources[resourceType] || 0) + amount;

            return {
              ...state,
              resources: updatedResources,
              credits: state.credits + totalCredits,
            };
          }
        }

        // If auto-sell is disabled or couldn't make space, return unchanged
        return state;
      }

      return {
        ...state,
        resources: {
          ...state.resources,
          [resourceType]: (state.resources[resourceType] || 0) + maxAddition,
        },
      };
    }

    case 'CONVERT_RESOURCES': {
      const { resourceType, amount } = action.payload;
      const currentAmount = state.resources[resourceType] || 0;

      if (currentAmount < amount) {
        return state; // Not enough resources
      }

      const fuelGained = convertResourceToFuel(
        resourceType,
        amount,
        state.modules.converter.efficiencyPercent
      );

      return {
        ...state,
        resources: {
          ...state.resources,
          [resourceType]: currentAmount - amount,
        },
        fuel: state.fuel + fuelGained,
        totalFuelEarned: state.totalFuelEarned + fuelGained,
      };
    }

    case 'SELL_RESOURCES': {
      const { resourceType, amount } = action.payload;
      const currentAmount = state.resources[resourceType] || 0;

      if (currentAmount < amount) {
        return state; // Not enough resources
      }

      const creditsGained = calculateResourceValue(resourceType, amount, 1.0);

      return {
        ...state,
        resources: {
          ...state.resources,
          [resourceType]: currentAmount - amount,
        },
        credits: state.credits + creditsGained,
      };
    }

    // ========================================
    // Phase 2: Cargo Management Actions
    // ========================================

    case 'SET_AUTO_SELL': {
      const { enabled } = action.payload;
      return {
        ...state,
        modules: {
          ...state.modules,
          cargoHold: {
            ...state.modules.cargoHold,
            autoSell: enabled,
          },
        },
      };
    }

    case 'SET_RESOURCE_PRIORITY': {
      const { priority } = action.payload;
      return {
        ...state,
        modules: {
          ...state.modules,
          cargoHold: {
            ...state.modules.cargoHold,
            resourcePriority: priority,
          },
        },
      };
    }

    case 'DISMISS_CARGO_WARNING': {
      return {
        ...state,
        modules: {
          ...state.modules,
          cargoHold: {
            ...state.modules.cargoHold,
            cargoFullWarningShown: true,
          },
        },
      };
    }

    // ========================================
    // Phase 1: Ship Control Actions
    // ========================================

    case 'SET_SHIP_SPEED': {
      const { speed } = action.payload;

      // Check if speed is unlocked
      const { engine } = state.modules;
      const speedOrder: Array<typeof speed> = ['stop', 'slow', 'normal', 'fast', 'boost'];
      const maxSpeedIndex = speedOrder.indexOf(engine.maxSpeedUnlocked);
      const requestedSpeedIndex = speedOrder.indexOf(speed);

      if (requestedSpeedIndex > maxSpeedIndex) {
        return state; // Speed not unlocked yet
      }

      // Calculate new fuel consumption rate
      const speedMultiplier = SPEED_FUEL_MULTIPLIERS[speed] || 1.0;
      const newConsumptionRate = speedMultiplier * (engine.fuelEfficiencyPercent / 100);

      return {
        ...state,
        shipSpeed: speed,
        fuelConsumptionRate: newConsumptionRate,
      };
    }

    case 'CONSUME_FUEL': {
      const { amount } = action.payload;
      const newFuel = Math.max(0, state.fuel - amount);

      // Stop ship if out of fuel
      const newSpeed = newFuel > 0 ? state.shipSpeed : 'stop';

      return {
        ...state,
        fuel: newFuel,
        shipSpeed: newSpeed,
      };
    }

    // ========================================
    // Phase 1: Module Upgrade Actions
    // ========================================

    case 'UPGRADE_MODULE': {
      const { moduleType, upgradeId, cost } = action.payload;

      if (state.credits < cost) {
        return state; // Not enough credits
      }

      // Check if already purchased
      const module = state.modules[moduleType];
      if (module.purchasedUpgrades.includes(upgradeId)) {
        return state;
      }

      // Add upgrade to purchased list
      const updatedModule = {
        ...module,
        purchasedUpgrades: [...module.purchasedUpgrades, upgradeId],
      };

      // Note: Actual stat changes should be applied by upgrade effects
      // This is a generic handler - specific upgrade effects should be
      // handled in a separate system or passed in the payload

      return {
        ...state,
        credits: state.credits - cost,
        modules: {
          ...state.modules,
          [moduleType]: updatedModule,
        },
        statistics: {
          ...state.statistics,
          upgradesPurchased: state.statistics.upgradesPurchased + 1,
        },
      };
    }

    // ========================================
    // Phase 2: Module Upgrade Purchase
    // ========================================

    case 'PURCHASE_MODULE_UPGRADE': {
      const { upgradeId } = action.payload;

      // Get upgrade from constants (module upgrades)
      const upgrade = getModuleUpgradeById(upgradeId);
      if (!upgrade) {
        console.error(`Upgrade ${upgradeId} not found`);
        return state;
      }

      const { moduleType } = upgrade;
      const module = state.modules[moduleType];

      // Validate purchase
      if (!canPurchaseModuleUpgrade(upgradeId, module.purchasedUpgrades, state.credits)) {
        return state;
      }

      // Add upgrade to purchased list
      const updatedPurchasedUpgrades = [...module.purchasedUpgrades, upgradeId];

      // Apply stat changes from upgrade
      const updatedModule = applyUpgradeStatChanges(
        {
          ...module,
          purchasedUpgrades: updatedPurchasedUpgrades,
        },
        upgrade as any
      );

      return {
        ...state,
        credits: state.credits - upgrade.cost,
        modules: {
          ...state.modules,
          [moduleType]: updatedModule,
        },
        statistics: {
          ...state.statistics,
          upgradesPurchased: state.statistics.upgradesPurchased + 1,
        },
      };
    }

    // ========================================
    // Phase 2: Bot System Actions
    // ========================================

    case 'UPDATE_BOTS': {
      const { deltaTime } = action.payload;
      const { botBay } = state.modules;

      // Get all currently targeted object IDs
      const targetedIds = getTargetedObjectIds(state.bots);

      // Update each bot's state
      const updatedBots = state.bots.map((bot) =>
        updateBotState(bot, state.objects, targetedIds, botBay, deltaTime)
      );

      // Collect resources from depositing bots
      let resourcesCollected = 0;
      for (const bot of updatedBots) {
        if (bot.state === 'depositing') {
          resourcesCollected += bot.cargoAmount;
        }
      }

      // Calculate total cargo space
      const currentCargo = calculateTotalCargo(state.resources);
      const maxCargo = state.modules.cargoHold.totalCapacity;
      const maxCanAdd = calculateMaxCargoAddition(currentCargo, maxCargo, resourcesCollected);

      // Add resources to random resource type (simplified for now)
      // In a real implementation, bots would track which resource they collected
      const newState: GameState = {
        ...state,
        bots: updatedBots,
      };

      if (maxCanAdd > 0 && resourcesCollected > 0) {
        // For now, add to stone as a placeholder
        // TODO: Track actual resource types collected by bots
        return {
          ...newState,
          resources: {
            ...newState.resources,
            stone: (newState.resources.stone || 0) + Math.min(resourcesCollected, maxCanAdd),
          },
        };
      }

      return newState;
    }

    case 'SPAWN_BOT': {
      const { bot } = action.payload;
      return {
        ...state,
        bots: [...state.bots, bot],
      };
    }

    case 'DESPAWN_BOT': {
      const { botId } = action.payload;
      return {
        ...state,
        bots: state.bots.filter((bot) => bot.id !== botId),
      };
    }

    default:
      return state;
  }
}
