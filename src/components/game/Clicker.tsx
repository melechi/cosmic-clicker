import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { LaserBeam } from '../effects/LaserBeam';
import { Spaceship } from '../effects/Spaceship';
import { useGame } from '@/context/GameContext';
import { actions } from '@/context/actions';
import { findNearestObject, checkLaserHit } from '@/utils/gameLogic/objectPhysics';
import type { Position } from '@/types';

export interface ClickerProps {
  disabled?: boolean;
}

interface LaserFire {
  id: number;
  from: Position;
  to: Position;
  hit: boolean;
}

/**
 * Main game area for laser mining
 * Click anywhere to fire laser at objects
 */
export const Clicker: React.FC<ClickerProps> = ({ disabled = false }) => {
  const { state, dispatch } = useGame();
  const [laserFires, setLaserFires] = useState<LaserFire[]>([]);
  const [nextLaserId, setNextLaserId] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const cooldownTimerRef = useRef<number>();

  const { laser } = state.modules;
  const shipPosition: Position = useMemo(() => ({ x: 400, y: 700 }), []); // Bottom center

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      cooldownTimerRef.current = window.setTimeout(() => {
        setCooldownRemaining(Math.max(0, cooldownRemaining - 0.016)); // ~60fps
      }, 16);
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [cooldownRemaining]);

  const handleAreaClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || cooldownRemaining > 0) return;

      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Get click position relative to game area
      const clickPos: Position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // Determine target position (auto-target or click position)
      let targetPos = clickPos;
      if (laser.autoTarget) {
        const nearestObj = findNearestObject(shipPosition, state.objects, laser.range);
        if (nearestObj) {
          targetPos = nearestObj.position;
        }
      }

      // Check if laser hits any objects
      const hitObject = checkLaserHit(targetPos, state.objects, laser.range);
      const didHit = hitObject !== null;

      // Fire laser action
      if (didHit || !laser.autoTarget) {
        dispatch(actions.fireLaser(targetPos));

        // Create visual laser beam
        setLaserFires((prev) => [
          ...prev,
          {
            id: nextLaserId,
            from: shipPosition,
            to: targetPos,
            hit: didHit,
          },
        ]);
        setNextLaserId((id) => id + 1);

        // Start cooldown
        setCooldownRemaining(laser.cooldown);
      }
    },
    [
      disabled,
      cooldownRemaining,
      laser.autoTarget,
      laser.range,
      laser.cooldown,
      shipPosition,
      state.objects,
      dispatch,
      nextLaserId,
    ]
  );

  const removeLaserFire = useCallback((id: number) => {
    setLaserFires((prev) => prev.filter((fire) => fire.id !== id));
  }, []);

  // Cursor style based on cooldown and range
  const cursorStyle = useMemo(() => {
    if (disabled) return 'not-allowed';
    if (cooldownRemaining > 0) return 'wait';
    return 'crosshair';
  }, [disabled, cooldownRemaining]);

  // Calculate cooldown percentage for UI
  const cooldownPercent = useMemo(() => {
    return ((laser.cooldown - cooldownRemaining) / laser.cooldown) * 100;
  }, [cooldownRemaining, laser.cooldown]);

  return (
    <div
      ref={gameAreaRef}
      onClick={handleAreaClick}
      className={`
        relative w-full h-full min-h-[800px] overflow-hidden
        bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900
        ${disabled ? 'opacity-50' : ''}
      `}
      style={{ cursor: cursorStyle }}
      role="button"
      tabIndex={0}
      aria-label="Game area - Click to fire laser"
      aria-disabled={disabled || cooldownRemaining > 0}
      onKeyDown={(e) => {
        // Allow firing with spacebar
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          // Fire at center of screen
          const rect = gameAreaRef.current?.getBoundingClientRect();
          if (rect) {
            const centerPos: Position = {
              x: rect.width / 2,
              y: rect.height / 2,
            };
            handleAreaClick({
              clientX: rect.left + centerPos.x,
              clientY: rect.top + centerPos.y,
            } as React.MouseEvent<HTMLDivElement>);
          }
        }
      }}
    >
      {/* Laser range indicator (optional visual) */}
      {!disabled && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${shipPosition.x}px`,
            top: `${shipPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="border border-blue-500/20 rounded-full"
            style={{
              width: `${laser.range * 2}px`,
              height: `${laser.range * 2}px`,
              transition: 'all 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Spaceship at bottom center */}
      <div
        className="absolute z-20"
        style={{
          left: `${shipPosition.x}px`,
          top: `${shipPosition.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Spaceship size={120} />
      </div>

      {/* Laser beams */}
      {laserFires.map((fire) => (
        <LaserBeam
          key={fire.id}
          from={fire.from}
          to={fire.to}
          active={true}
          hit={fire.hit}
          color="#60a5fa"
          duration={200}
          onComplete={() => removeLaserFire(fire.id)}
        />
      ))}

      {/* Cooldown indicator */}
      {cooldownRemaining > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-gray-800/80 rounded-full px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-75"
                  style={{ width: `${cooldownPercent}%` }}
                />
              </div>
              <span className="text-blue-400 text-sm font-mono">
                {cooldownRemaining.toFixed(2)}s
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Instruction text */}
      {state.objects.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
          <p className="text-gray-400 text-lg mb-2">Waiting for objects to mine...</p>
          <p className="text-gray-500 text-sm">Click to fire laser when objects appear</p>
        </div>
      )}

      {!disabled && state.objects.length > 0 && cooldownRemaining === 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none">
          <p className="text-gray-400 text-sm">Click anywhere to fire laser!</p>
        </div>
      )}

      {/* Laser stats display */}
      <div className="absolute top-4 left-4 bg-gray-800/80 rounded-lg px-4 py-2 backdrop-blur-sm z-30 pointer-events-none">
        <div className="text-xs text-gray-300 space-y-1">
          <div className="flex justify-between gap-4">
            <span>Damage:</span>
            <span className="text-blue-400 font-mono">{laser.damage}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Range:</span>
            <span className="text-blue-400 font-mono">{laser.range}px</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Cooldown:</span>
            <span className="text-blue-400 font-mono">{laser.cooldown}s</span>
          </div>
          {laser.autoTarget && (
            <div className="text-green-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Auto-Target
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
