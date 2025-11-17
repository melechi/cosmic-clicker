/**
 * Object physics utility functions for Cosmic Clicker Phase 1
 * All functions are pure (no side effects)
 */

import type { GameObject, Position } from '@/types';

/**
 * Update object position based on velocity and deltaTime
 * @param obj - The game object to update
 * @param deltaTime - Time elapsed in seconds
 * @returns New position for the object
 */
export function updateObjectPosition(obj: GameObject, deltaTime: number): Position {
  return {
    x: obj.position.x + obj.velocity.x * deltaTime,
    y: obj.position.y + obj.velocity.y * deltaTime,
  };
}

/**
 * Update object rotation based on rotation speed and deltaTime
 * @param currentRotation - Current rotation angle in degrees
 * @param rotationSpeed - Rotation speed in degrees per second
 * @param deltaTime - Time elapsed in seconds
 * @returns New rotation angle in degrees (0-360)
 */
export function updateObjectRotation(
  currentRotation: number,
  rotationSpeed: number,
  deltaTime: number
): number {
  const newRotation = currentRotation + rotationSpeed * deltaTime;
  // Keep rotation between 0-360 degrees
  return newRotation % 360;
}

/**
 * Check if object is out of bounds (off-screen)
 * Objects are considered out of bounds if they drift past the bottom of the screen
 * @param obj - The game object to check
 * @param screenHeight - Height of the game screen in pixels
 * @returns True if object is out of bounds
 */
export function checkOutOfBounds(obj: GameObject, screenHeight: number): boolean {
  // Object is out of bounds if its top edge is below the screen
  return obj.position.y - obj.height / 2 > screenHeight;
}

/**
 * Calculate distance between two points using Euclidean distance formula
 * @param p1 - First position
 * @param p2 - Second position
 * @returns Distance in pixels
 */
export function calculateDistance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a point is within a circular area (collision detection)
 * @param point - Point to check
 * @param center - Center of the circle
 * @param radius - Radius of the circle
 * @returns True if point is within the circle
 */
export function isPointInCircle(point: Position, center: Position, radius: number): boolean {
  return calculateDistance(point, center) <= radius;
}

/**
 * Check if laser hit any objects
 * Finds the closest object within laser range
 * @param clickPos - Position where laser was fired
 * @param objects - Array of active game objects
 * @param laserRange - Maximum range of the laser in pixels
 * @returns The closest object within range, or null if no hit
 */
export function checkLaserHit(
  clickPos: Position,
  objects: GameObject[],
  laserRange: number
): GameObject | null {
  let closestObject: GameObject | null = null;
  let closestDistance = laserRange;

  for (const obj of objects) {
    // Skip destroyed objects
    if (obj.destroyed) continue;

    // Calculate distance from click to object center
    const distance = calculateDistance(clickPos, obj.position);

    // Check if within laser range and object's hitbox
    const hitboxRadius = Math.max(obj.width, obj.height) / 2;
    if (distance <= closestDistance && distance <= hitboxRadius + laserRange) {
      closestDistance = distance;
      closestObject = obj;
    }
  }

  return closestObject;
}

/**
 * Check if laser hit multiple objects (for piercing laser upgrades)
 * Returns all objects hit in order of distance
 * @param clickPos - Position where laser was fired
 * @param objects - Array of active game objects
 * @param laserRange - Maximum range of the laser in pixels
 * @param maxHits - Maximum number of objects to hit (for piercing)
 * @returns Array of objects hit, sorted by distance (closest first)
 */
export function checkLaserMultipleHits(
  clickPos: Position,
  objects: GameObject[],
  laserRange: number,
  maxHits: number = 1
): GameObject[] {
  const hits: Array<{ object: GameObject; distance: number }> = [];

  for (const obj of objects) {
    // Skip destroyed objects
    if (obj.destroyed) continue;

    // Calculate distance from click to object center
    const distance = calculateDistance(clickPos, obj.position);

    // Check if within laser range and object's hitbox
    const hitboxRadius = Math.max(obj.width, obj.height) / 2;
    if (distance <= laserRange + hitboxRadius) {
      hits.push({ object: obj, distance });
    }
  }

  // Sort by distance (closest first) and return up to maxHits
  return hits
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxHits)
    .map((hit) => hit.object);
}

/**
 * Find nearest object to a given position (for auto-targeting)
 * @param position - Position to search from (usually ship position)
 * @param objects - Array of active game objects
 * @param maxRange - Maximum range to search in pixels
 * @returns The nearest object within range, or null if none found
 */
export function findNearestObject(
  position: Position,
  objects: GameObject[],
  maxRange: number
): GameObject | null {
  let nearestObject: GameObject | null = null;
  let nearestDistance = maxRange;

  for (const obj of objects) {
    // Skip destroyed objects
    if (obj.destroyed) continue;

    const distance = calculateDistance(position, obj.position);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestObject = obj;
    }
  }

  return nearestObject;
}

/**
 * Check if two objects are colliding (circular collision detection)
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns True if objects are colliding
 */
export function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  const radius1 = Math.max(obj1.width, obj1.height) / 2;
  const radius2 = Math.max(obj2.width, obj2.height) / 2;
  const distance = calculateDistance(obj1.position, obj2.position);

  return distance <= radius1 + radius2;
}

/**
 * Calculate screen bounds for object spawning
 * @param screenWidth - Width of the game screen in pixels
 * @param objectWidth - Width of the object to spawn
 * @returns Object with min and max x positions for safe spawning
 */
export function calculateSpawnBounds(
  screenWidth: number,
  objectWidth: number
): { minX: number; maxX: number } {
  const margin = objectWidth / 2;
  return {
    minX: margin,
    maxX: screenWidth - margin,
  };
}

/**
 * Generate random spawn position for an object
 * @param screenWidth - Width of the game screen in pixels
 * @param objectWidth - Width of the object to spawn
 * @returns Random position at the top of the screen
 */
export function generateRandomSpawnPosition(screenWidth: number, objectWidth: number): Position {
  const bounds = calculateSpawnBounds(screenWidth, objectWidth);
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    y: -objectWidth / 2, // Start just above the screen
  };
}
