/**
 * Custom hook for managing object spawning
 * Handles spawn timers and zone-based spawn rates
 */

import { useRef, useCallback } from 'react';
import { useGame } from '@/context';
import { actions } from '@/context/actions';
import { getSpawnTableByZoneId } from '@/constants';
import { getObjectTemplateById } from '@/constants/objects';
import { GAME_CONFIG } from '@/constants/gameConfig';
import {
  createObjectFromTemplate,
  selectSpawnTemplate,
  generateSpawnPosition,
} from '@/utils/gameLogic/objectSpawning';

interface UseObjectSpawnerOptions {
  /** Width of the game area for spawn positioning */
  gameWidth?: number;
  /** Enable/disable spawning */
  enabled?: boolean;
}

/**
 * Hook that manages object spawning logic
 * Call spawnTick on each game loop iteration
 */
export function useObjectSpawner(options: UseObjectSpawnerOptions = {}) {
  const { gameWidth = 800, enabled = true } = options;
  const { state, dispatch } = useGame();
  const spawnTimerRef = useRef(0);

  /**
   * Spawn a new object based on current zone spawn table
   */
  const spawnObject = useCallback(() => {
    if (!enabled) return;

    // Get spawn table for current zone
    const spawnTable = getSpawnTableByZoneId(state.currentZone);
    if (!spawnTable) {
      console.warn(`No spawn table found for zone ${state.currentZone}`);
      return;
    }

    // Select random template based on weights
    const templateId = selectSpawnTemplate(spawnTable.spawnEntries);
    if (!templateId) return;

    // Get template
    const template = getObjectTemplateById(templateId);
    if (!template) {
      console.warn(`Template not found: ${templateId}`);
      return;
    }

    // Generate spawn position
    const position = generateSpawnPosition(gameWidth);

    // Create object from template
    const object = createObjectFromTemplate(
      template,
      position,
      state.currentZone,
      GAME_CONFIG.OBJECT_FALL_SPEED
    );

    // Dispatch spawn action
    dispatch(actions.spawnObject(object));
  }, [enabled, state.currentZone, gameWidth, dispatch]);

  /**
   * Update spawn timer and spawn objects when timer reaches threshold
   * Call this on every game loop tick
   */
  const spawnTick = useCallback(
    (deltaTime: number) => {
      if (!enabled) return;

      // Get spawn rate for current zone
      const spawnTable = getSpawnTableByZoneId(state.currentZone);
      if (!spawnTable) return;

      // Calculate spawn rate (base rate * zone multiplier * speed multiplier)
      let spawnRate = GAME_CONFIG.OBJECT_SPAWN_RATE * spawnTable.spawnRate;

      // Adjust spawn rate based on ship speed (faster = more objects)
      if (state.shipSpeed === 'slow') {
        spawnRate *= 0.7;
      } else if (state.shipSpeed === 'fast') {
        spawnRate *= 1.3;
      } else if (state.shipSpeed === 'boost') {
        spawnRate *= 1.6;
      }
      // 'normal' and 'stop' use base rate (stop still spawns objects)

      // Update timer
      spawnTimerRef.current += deltaTime;

      // Check if we should spawn an object
      const spawnInterval = 1 / spawnRate; // Convert rate to interval in seconds

      if (spawnTimerRef.current >= spawnInterval) {
        spawnObject();
        spawnTimerRef.current = 0; // Reset timer
      }
    },
    [enabled, state.currentZone, state.shipSpeed, spawnObject]
  );

  /**
   * Reset the spawn timer (useful when changing zones)
   */
  const resetSpawnTimer = useCallback(() => {
    spawnTimerRef.current = 0;
  }, []);

  return {
    spawnObject,
    spawnTick,
    resetSpawnTimer,
  };
}
