/**
 * ObjectSpawner component - manages object lifecycle and rendering
 * Spawns objects at intervals, updates positions, and renders all active objects
 */

import React, { useEffect, useCallback } from 'react';
import { useGame } from '@/context';
import { actions } from '@/context/actions';
import { useObjectSpawner } from '@/hooks/useObjectSpawner';
import { GameObject } from './GameObject';
import type { GameObject as GameObjectType, Position } from '@/types';

interface ObjectSpawnerProps {
  /** Width of the game area */
  gameWidth?: number;
  /** Height of the game area */
  gameHeight?: number;
  /** Enable/disable spawning */
  enabled?: boolean;
  /** Handler for laser firing */
  onObjectClick?: (object: GameObjectType, position: Position) => void;
}

/**
 * Manages spawning, updating, and rendering of all game objects
 */
export const ObjectSpawner = React.memo<ObjectSpawnerProps>(
  ({ gameWidth = 800, gameHeight = 600, enabled = true, onObjectClick }) => {
    const { state, dispatch } = useGame();
    const { spawnTick, resetSpawnTimer } = useObjectSpawner({
      gameWidth,
      enabled,
    });

    // Handle object click - fires laser at clicked object
    const handleObjectClick = useCallback(
      (object: GameObjectType) => {
        if (!enabled) return;

        // Fire laser at object position
        dispatch(
          actions.fireLaser({
            x: object.position.x,
            y: object.position.y,
          })
        );

        // Call optional callback
        if (onObjectClick) {
          onObjectClick(object, object.position);
        }
      },
      [enabled, dispatch, onObjectClick]
    );

    // Update objects on every frame
    useEffect(() => {
      if (!enabled) return;

      let animationId: number;
      let lastTime = performance.now();

      const updateLoop = (currentTime: number) => {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // Update object positions
        dispatch(actions.updateObjects(deltaTime));

        // Handle spawning
        spawnTick(deltaTime);

        animationId = requestAnimationFrame(updateLoop);
      };

      animationId = requestAnimationFrame(updateLoop);

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }, [enabled, dispatch, spawnTick]);

    // Reset spawn timer when zone changes
    useEffect(() => {
      resetSpawnTimer();
    }, [state.currentZone, resetSpawnTimer]);

    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          width: `${gameWidth}px`,
          height: `${gameHeight}px`,
        }}
        role="region"
        aria-label="Game objects area"
      >
        {/* Render all active objects */}
        {state.objects.map((object) => (
          <GameObject key={object.id} object={object} onClick={handleObjectClick} />
        ))}

        {/* Debug info (can be removed) */}
        {import.meta.env.DEV && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded pointer-events-none">
            <div>Active Objects: {state.objects.length}</div>
            <div>Current Zone: {state.currentZone}</div>
            <div>Ship Speed: {state.shipSpeed}</div>
          </div>
        )}
      </div>
    );
  }
);

ObjectSpawner.displayName = 'ObjectSpawner';
