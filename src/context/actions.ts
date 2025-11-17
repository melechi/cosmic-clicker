import type { GameState, GameObject, Position, ResourceType, ShipSpeed, ModuleType } from '@/types';

/**
 * Game action types
 */
export type GameAction =
  // Legacy actions (Phase 0)
  | { type: 'CLICK' }
  | { type: 'BUY_BUILDING'; payload: { buildingId: string; quantity?: number } }
  | { type: 'BUY_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'BUY_BUILDING_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'BUY_PRESTIGE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'PRESTIGE' }
  | { type: 'TICK'; payload: { deltaTime: number } }
  | { type: 'LOAD_SAVE'; payload: GameState }
  | { type: 'APPLY_OFFLINE_PROGRESS'; payload: { fuel: number; timeAway: number } }
  | { type: 'HARD_RESET' }
  | { type: 'WARP_TO_NEXT_ZONE' }
  | { type: 'SET_ZONE'; payload: { zone: number } }
  | { type: 'ADD_FUEL'; payload: { amount: number } }
  // Phase 1: Object interactions
  | { type: 'SPAWN_OBJECT'; payload: { object: GameObject } }
  | { type: 'DESPAWN_OBJECT'; payload: { objectId: string } }
  | { type: 'UPDATE_OBJECTS'; payload: { deltaTime: number } }
  // Phase 1: Laser & Mining
  | { type: 'FIRE_LASER'; payload: { position: Position } }
  | { type: 'DAMAGE_OBJECT'; payload: { objectId: string; damage: number } }
  | { type: 'DESTROY_OBJECT'; payload: { objectId: string } }
  // Phase 1: Resource management
  | { type: 'COLLECT_RESOURCE'; payload: { resourceType: ResourceType; amount: number } }
  | { type: 'CONVERT_RESOURCES'; payload: { resourceType: ResourceType; amount: number } }
  | { type: 'SELL_RESOURCES'; payload: { resourceType: ResourceType; amount: number } }
  // Phase 1: Ship controls
  | { type: 'SET_SHIP_SPEED'; payload: { speed: ShipSpeed } }
  | { type: 'CONSUME_FUEL'; payload: { amount: number } }
  // Phase 1: Module upgrades
  | { type: 'UPGRADE_MODULE'; payload: { moduleType: ModuleType; upgradeId: string; cost: number } };

/**
 * Action creators for type-safe dispatch
 */
export const actions = {
  // Legacy actions (Phase 0)
  click: (): GameAction => ({ type: 'CLICK' }),

  buyBuilding: (buildingId: string, quantity: number = 1): GameAction => ({
    type: 'BUY_BUILDING',
    payload: { buildingId, quantity },
  }),

  buyUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_UPGRADE',
    payload: { upgradeId },
  }),

  buyBuildingUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_BUILDING_UPGRADE',
    payload: { upgradeId },
  }),

  buyPrestigeUpgrade: (upgradeId: string): GameAction => ({
    type: 'BUY_PRESTIGE_UPGRADE',
    payload: { upgradeId },
  }),

  unlockAchievement: (achievementId: string): GameAction => ({
    type: 'UNLOCK_ACHIEVEMENT',
    payload: { achievementId },
  }),

  prestige: (): GameAction => ({ type: 'PRESTIGE' }),

  tick: (deltaTime: number): GameAction => ({
    type: 'TICK',
    payload: { deltaTime },
  }),

  loadSave: (gameState: GameState): GameAction => ({
    type: 'LOAD_SAVE',
    payload: gameState,
  }),

  applyOfflineProgress: (fuel: number, timeAway: number): GameAction => ({
    type: 'APPLY_OFFLINE_PROGRESS',
    payload: { fuel, timeAway },
  }),

  hardReset: (): GameAction => ({ type: 'HARD_RESET' }),

  // Zone actions
  warpToNextZone: (): GameAction => ({ type: 'WARP_TO_NEXT_ZONE' }),

  setZone: (zone: number): GameAction => ({
    type: 'SET_ZONE',
    payload: { zone },
  }),

  // Debug action
  addFuel: (amount: number): GameAction => ({
    type: 'ADD_FUEL',
    payload: { amount },
  }),

  // Phase 1: Object interactions
  spawnObject: (object: GameObject): GameAction => ({
    type: 'SPAWN_OBJECT',
    payload: { object },
  }),

  despawnObject: (objectId: string): GameAction => ({
    type: 'DESPAWN_OBJECT',
    payload: { objectId },
  }),

  updateObjects: (deltaTime: number): GameAction => ({
    type: 'UPDATE_OBJECTS',
    payload: { deltaTime },
  }),

  // Phase 1: Laser & Mining
  fireLaser: (position: Position): GameAction => ({
    type: 'FIRE_LASER',
    payload: { position },
  }),

  damageObject: (objectId: string, damage: number): GameAction => ({
    type: 'DAMAGE_OBJECT',
    payload: { objectId, damage },
  }),

  destroyObject: (objectId: string): GameAction => ({
    type: 'DESTROY_OBJECT',
    payload: { objectId },
  }),

  // Phase 1: Resource management
  collectResource: (resourceType: ResourceType, amount: number): GameAction => ({
    type: 'COLLECT_RESOURCE',
    payload: { resourceType, amount },
  }),

  convertResources: (resourceType: ResourceType, amount: number): GameAction => ({
    type: 'CONVERT_RESOURCES',
    payload: { resourceType, amount },
  }),

  sellResources: (resourceType: ResourceType, amount: number): GameAction => ({
    type: 'SELL_RESOURCES',
    payload: { resourceType, amount },
  }),

  // Phase 1: Ship controls
  setShipSpeed: (speed: ShipSpeed): GameAction => ({
    type: 'SET_SHIP_SPEED',
    payload: { speed },
  }),

  consumeFuel: (amount: number): GameAction => ({
    type: 'CONSUME_FUEL',
    payload: { amount },
  }),

  // Phase 1: Module upgrades
  upgradeModule: (moduleType: ModuleType, upgradeId: string, cost: number): GameAction => ({
    type: 'UPGRADE_MODULE',
    payload: { moduleType, upgradeId, cost },
  }),
};
