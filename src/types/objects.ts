/**
 * Game object type definitions for Cosmic Clicker Phase 1
 * Includes asteroids, debris, derelicts, and special objects
 */

import type { ResourceType } from './resources';

/**
 * Types of objects that can appear in space
 */
export type ObjectType = 'asteroid' | 'debris' | 'derelict' | 'gate' | 'anomaly';

/**
 * Size categories for objects
 */
export type ObjectSize = 'small' | 'medium' | 'large';

/**
 * Asteroid variants based on resource type
 */
export type AsteroidVariant =
  | 'stone'
  | 'carbon'
  | 'iron'
  | 'ice'
  | 'gold'
  | 'platinum'
  | 'rich'; // Rich variant has 2x resources

/**
 * Debris variants
 */
export type DebrisVariant =
  | 'scrap' // Carbon, Iron
  | 'container' // Random resources (loot box)
  | 'fuelTank'; // Direct fuel bonus (no conversion)

/**
 * Derelict ship variants
 */
export type DerelictVariant =
  | 'escapePod'
  | 'shuttle'
  | 'cruiser'
  | 'station';

/**
 * 2D position in space
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 2D velocity vector
 */
export interface Velocity {
  x: number;
  y: number;
}

/**
 * Resource drop from an object
 */
export interface ResourceDrop {
  /** Type of resource */
  type: ResourceType;
  /** Amount of resource */
  amount: number;
}

/**
 * Special drop types from objects
 */
export interface SpecialDrop {
  /** Direct credits reward */
  credits?: number;
  /** Direct fuel reward */
  fuel?: number;
  /** Coordinate chip for secret zones */
  coordinateChip?: string;
  /** Blueprint ID to unlock upgrades early */
  blueprint?: string;
  /** Artifact ID for permanent bonuses */
  artifact?: string;
}

/**
 * Base game object interface
 */
export interface GameObject {
  /** Unique identifier for this object instance */
  id: string;
  /** Type of object */
  type: ObjectType;
  /** Current position in the game world */
  position: Position;
  /** Current velocity (movement per frame) */
  velocity: Velocity;
  /** Current health points (clicks/damage needed to destroy) */
  health: number;
  /** Maximum health points */
  maxHealth: number;
  /** Size category */
  size: ObjectSize;
  /** Visual width in pixels */
  width: number;
  /** Visual height in pixels */
  height: number;
  /** Resources contained in this object */
  resourceDrops: ResourceDrop[];
  /** Special drops (credits, fuel, artifacts, etc.) */
  specialDrops?: SpecialDrop;
  /** Whether this object has been destroyed */
  destroyed: boolean;
  /** Timestamp when object was created */
  createdAt: number;
  /** Rotation angle in degrees (for visual effect) */
  rotation?: number;
  /** Rotation speed in degrees per second */
  rotationSpeed?: number;
}

/**
 * Asteroid-specific object
 */
export interface AsteroidObject extends GameObject {
  type: 'asteroid';
  /** Asteroid variant determines appearance and resources */
  variant: AsteroidVariant;
}

/**
 * Debris-specific object
 */
export interface DebrisObject extends GameObject {
  type: 'debris';
  /** Debris variant determines resources and behavior */
  variant: DebrisVariant;
}

/**
 * Derelict ship-specific object
 */
export interface DerelictObject extends GameObject {
  type: 'derelict';
  /** Derelict variant determines size and rewards */
  variant: DerelictVariant;
}

/**
 * Gate-specific object (portal to secret zones)
 */
export interface GateObject extends GameObject {
  type: 'gate';
  /** Target zone ID this gate leads to */
  targetZone: string;
  /** Whether gate is currently active */
  active: boolean;
}

/**
 * Anomaly-specific object (Dark Matter sources)
 */
export interface AnomalyObject extends GameObject {
  type: 'anomaly';
  /** Danger level (affects damage/rewards) */
  dangerLevel: number;
}

/**
 * Union type of all specific object types
 */
export type AnyGameObject =
  | AsteroidObject
  | DebrisObject
  | DerelictObject
  | GateObject
  | AnomalyObject;

/**
 * Object spawn weight for spawn table
 */
export interface ObjectSpawnWeight {
  /** Object type */
  type: ObjectType;
  /** Object variant */
  variant?: AsteroidVariant | DebrisVariant | DerelictVariant;
  /** Object size */
  size: ObjectSize;
  /** Spawn weight (higher = more frequent) */
  weight: number;
}

/**
 * Object spawn configuration for a zone
 */
export interface ObjectSpawnConfig {
  /** Spawn table with weights */
  spawnTable: ObjectSpawnWeight[];
  /** Base spawn rate (objects per second) */
  baseSpawnRate: number;
  /** Spawn rate multiplier based on ship speed */
  speedMultiplier: boolean;
}
