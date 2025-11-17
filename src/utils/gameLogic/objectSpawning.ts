/**
 * Object spawning utilities for Cosmic Clicker Phase 1
 * Handles creation and initialization of game objects
 */

import type { GameObject, Position, Velocity, ResourceDrop } from '@/types';
import type { ObjectTemplate, LootEntry } from '@/constants/objects';

/**
 * Generate a unique ID for a game object
 */
let objectIdCounter = 0;
export function generateObjectId(): string {
  return `obj_${Date.now()}_${++objectIdCounter}`;
}

/**
 * Calculate object velocity based on zone difficulty
 * Objects fall downward (positive Y velocity)
 */
export function calculateObjectVelocity(zone: number, baseFallSpeed: number = 100): Velocity {
  // Slight horizontal drift for visual variety (-20 to +20 pixels/second)
  const x = (Math.random() - 0.5) * 40;

  // Vertical speed increases slightly with zone difficulty
  const y = baseFallSpeed * (1 + zone * 0.1);

  return { x, y };
}

/**
 * Generate resource drops from a loot table
 * Uses probability and random amounts within min/max range
 */
export function generateResourceDrops(lootTable: LootEntry[]): ResourceDrop[] {
  const drops: ResourceDrop[] = [];

  for (const entry of lootTable) {
    // Check probability
    if (Math.random() > entry.probability) {
      continue;
    }

    // Generate random amount within range
    const amount =
      Math.floor(Math.random() * (entry.maxAmount - entry.minAmount + 1)) + entry.minAmount;

    drops.push({
      type: entry.resourceId as any, // Type assertion needed here
      amount,
    });
  }

  return drops;
}

/**
 * Calculate random rotation speed for visual effect
 */
function calculateRotationSpeed(): number {
  // -90 to +90 degrees per second
  return (Math.random() - 0.5) * 180;
}

/**
 * Generate spawn position at top of screen
 * X position is random within game area width
 */
export function generateSpawnPosition(gameWidth: number = 800): Position {
  // Spawn slightly above screen (negative Y)
  const y = -100;

  // Random X position within game area (with padding for object size)
  const padding = 100;
  const x = Math.random() * (gameWidth - padding * 2) + padding;

  return { x, y };
}

/**
 * Create a GameObject instance from a template
 * Applies zone difficulty scaling and randomization
 */
export function createObjectFromTemplate(
  template: ObjectTemplate,
  position: Position,
  zone: number,
  baseFallSpeed: number = 100
): GameObject {
  const velocity = calculateObjectVelocity(zone, baseFallSpeed);
  const resourceDrops = generateResourceDrops(template.lootTable);

  // Scale HP based on zone difficulty (increases by 30% per zone)
  const difficultyMultiplier = Math.pow(1.3, zone - 1);
  const hp = Math.floor(template.hp * difficultyMultiplier);

  // Create base object
  const baseObject: GameObject = {
    id: generateObjectId(),
    type: template.type as any, // Type assertion for template type
    position,
    velocity,
    health: hp,
    maxHealth: hp,
    size: template.size,
    width: template.visual.width,
    height: template.visual.height,
    resourceDrops,
    destroyed: false,
    createdAt: Date.now(),
    rotation: Math.random() * 360, // Random initial rotation
    rotationSpeed: calculateRotationSpeed(),
  };

  return baseObject;
}

/**
 * Select a random object template from a spawn table using weighted selection
 * Higher weight = more likely to be selected
 */
export function selectSpawnTemplate(
  spawnEntries: Array<{ templateId: string; weight: number }>
): string | undefined {
  if (spawnEntries.length === 0) return undefined;

  // Calculate total weight
  const totalWeight = spawnEntries.reduce((sum, entry) => sum + entry.weight, 0);

  // Select random value within total weight
  let random = Math.random() * totalWeight;

  // Find the selected entry
  for (const entry of spawnEntries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.templateId;
    }
  }

  // Fallback to first entry
  return spawnEntries[0].templateId;
}
