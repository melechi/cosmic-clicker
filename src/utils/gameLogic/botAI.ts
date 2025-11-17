/**
 * Bot AI utility functions for Cosmic Clicker Phase 2
 * Pure functions for bot behavior, targeting, movement, and mining
 */

import type { Bot, GameObject, Position, Velocity } from '@/types';
import { GAME_CONFIG } from '@/constants/gameConfig';

/**
 * Calculate distance between two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalize a vector to unit length
 */
export function normalizeVector(velocity: Velocity): Velocity {
  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: velocity.x / magnitude,
    y: velocity.y / magnitude,
  };
}

/**
 * Select the nearest unmined object within bot range
 * Returns object ID or null if no valid target
 */
export function selectTargetObject(
  bot: Bot,
  objects: GameObject[],
  range: number,
  alreadyTargetedIds: Set<string>
): string | null {
  let nearestObject: GameObject | null = null;
  let nearestDistance = Infinity;

  for (const obj of objects) {
    // Skip destroyed objects
    if (obj.destroyed) continue;

    // Skip objects already targeted by other bots
    if (alreadyTargetedIds.has(obj.id)) continue;

    // Skip objects with no resources (empty)
    if (obj.health <= 0) continue;

    // Calculate distance to object
    const distance = calculateDistance(bot.position, obj.position);

    // Check if within range
    if (distance > range) continue;

    // Check if this is the nearest object so far
    if (distance < nearestDistance) {
      nearestObject = obj;
      nearestDistance = distance;
    }
  }

  return nearestObject ? nearestObject.id : null;
}

/**
 * Update bot movement toward a target position
 * Returns updated position and velocity
 */
export function updateBotMovement(
  bot: Bot,
  targetPosition: Position,
  deltaTime: number,
  speed: number
): { position: Position; velocity: Velocity } {
  // Calculate direction to target
  const direction = {
    x: targetPosition.x - bot.position.x,
    y: targetPosition.y - bot.position.y,
  };

  // Normalize direction
  const normalized = normalizeVector(direction);

  // Calculate velocity
  const velocity: Velocity = {
    x: normalized.x * speed,
    y: normalized.y * speed,
  };

  // Calculate new position
  const newPosition: Position = {
    x: bot.position.x + velocity.x * deltaTime,
    y: bot.position.y + velocity.y * deltaTime,
  };

  return { position: newPosition, velocity };
}

/**
 * Check if bot has reached target position
 */
export function checkBotReachedTarget(bot: Bot, targetPosition: Position): boolean {
  const distance = calculateDistance(bot.position, targetPosition);
  return distance <= GAME_CONFIG.BOT_REACH_DISTANCE;
}

/**
 * Mine resources from an object
 * Returns updated mining progress and whether a resource was extracted
 */
export function mineObject(
  bot: Bot,
  miningSpeed: number, // Resources per second
  deltaTime: number
): { miningProgress: number; resourceExtracted: boolean } {
  // Update mining progress
  const progressGain = miningSpeed * deltaTime;
  const newProgress = bot.miningProgress + progressGain;

  // Check if a full resource was mined
  if (newProgress >= 1.0) {
    return {
      miningProgress: newProgress - 1.0, // Keep remainder for next resource
      resourceExtracted: true,
    };
  }

  return {
    miningProgress: newProgress,
    resourceExtracted: false,
  };
}

/**
 * Check if bot should return to ship
 * Returns true if cargo is full or target object is destroyed
 */
export function shouldBotReturn(
  bot: Bot,
  botCapacity: number,
  targetObject: GameObject | null
): boolean {
  // Return if cargo full
  if (bot.cargoAmount >= botCapacity) {
    return true;
  }

  // Return if target object is destroyed or doesn't exist
  if (!targetObject || targetObject.destroyed || targetObject.health <= 0) {
    return true;
  }

  return false;
}

/**
 * Get ship position for bot return
 */
export function getShipPosition(): Position {
  return GAME_CONFIG.SHIP_POSITION;
}

/**
 * Create a new bot at ship position
 */
export function createBot(id: string): Bot {
  const shipPosition = getShipPosition();
  return {
    id,
    position: { ...shipPosition },
    velocity: { x: 0, y: 0 },
    state: 'idle',
    targetObjectId: null,
    cargoAmount: 0,
    miningProgress: 0,
    createdAt: Date.now(),
  };
}

/**
 * Update a single bot's state based on current conditions
 * This is the main bot AI state machine
 */
export function updateBotState(
  bot: Bot,
  objects: GameObject[],
  alreadyTargetedIds: Set<string>,
  botBayConfig: {
    miningSpeed: number;
    range: number;
    botCapacity: number;
  },
  deltaTime: number
): Bot {
  const { miningSpeed, range, botCapacity } = botBayConfig;

  switch (bot.state) {
    case 'idle': {
      // Look for a target object
      const targetId = selectTargetObject(bot, objects, range, alreadyTargetedIds);

      if (targetId) {
        return {
          ...bot,
          state: 'moving_to_target',
          targetObjectId: targetId,
        };
      }

      // No target found, stay idle
      return bot;
    }

    case 'moving_to_target': {
      const targetObject = objects.find((obj) => obj.id === bot.targetObjectId);

      // Check if target is still valid
      if (!targetObject || targetObject.destroyed || targetObject.health <= 0) {
        return {
          ...bot,
          state: 'idle',
          targetObjectId: null,
        };
      }

      // Move toward target
      const { position, velocity } = updateBotMovement(
        bot,
        targetObject.position,
        deltaTime,
        GAME_CONFIG.BOT_MOVE_SPEED
      );

      // Check if reached target
      if (checkBotReachedTarget({ ...bot, position }, targetObject.position)) {
        return {
          ...bot,
          position,
          velocity,
          state: 'mining',
          miningProgress: 0,
        };
      }

      return {
        ...bot,
        position,
        velocity,
      };
    }

    case 'mining': {
      const targetObject = objects.find((obj) => obj.id === bot.targetObjectId);

      // Check if should return
      if (shouldBotReturn(bot, botCapacity, targetObject || null)) {
        return {
          ...bot,
          state: 'returning',
          targetObjectId: null,
          miningProgress: 0,
        };
      }

      // Continue mining
      const { miningProgress, resourceExtracted } = mineObject(bot, miningSpeed, deltaTime);

      return {
        ...bot,
        miningProgress,
        cargoAmount: bot.cargoAmount + (resourceExtracted ? 1 : 0),
      };
    }

    case 'returning': {
      const shipPosition = getShipPosition();

      // Move toward ship
      const { position, velocity } = updateBotMovement(
        bot,
        shipPosition,
        deltaTime,
        GAME_CONFIG.BOT_MOVE_SPEED
      );

      // Check if reached ship
      if (checkBotReachedTarget({ ...bot, position }, shipPosition)) {
        return {
          ...bot,
          position,
          velocity,
          state: 'depositing',
        };
      }

      return {
        ...bot,
        position,
        velocity,
      };
    }

    case 'depositing': {
      // Deposit cargo and return to idle
      return {
        ...bot,
        state: 'idle',
        cargoAmount: 0,
        miningProgress: 0,
      };
    }

    default:
      return bot;
  }
}

/**
 * Get all currently targeted object IDs to avoid multiple bots targeting the same object
 */
export function getTargetedObjectIds(bots: Bot[]): Set<string> {
  const targetedIds = new Set<string>();
  for (const bot of bots) {
    if (bot.targetObjectId && bot.state !== 'returning' && bot.state !== 'depositing') {
      targetedIds.add(bot.targetObjectId);
    }
  }
  return targetedIds;
}
