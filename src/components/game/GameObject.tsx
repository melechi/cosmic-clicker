/**
 * GameObject component - renders individual game objects (asteroids, debris, derelicts)
 * Displays object visual, HP bar when damaged, and handles click interaction
 */

import React from 'react';
import type { GameObject as GameObjectType } from '@/types';

interface GameObjectProps {
  /** The game object to render */
  object: GameObjectType;
  /** Click handler for laser targeting */
  onClick?: (object: GameObjectType) => void;
}

/**
 * Renders a single game object with visual representation and HP bar
 */
export const GameObject = React.memo<GameObjectProps>(({ object, onClick }) => {

  // Calculate HP percentage for health bar
  const hpPercent = (object.health / object.maxHealth) * 100;
  const isDamaged = object.health < object.maxHealth;

  // Determine visual representation based on object type
  const getVisualIcon = (): string => {
    // Try to use template icon if available
    // Otherwise use defaults based on type
    switch (object.type) {
      case 'asteroid':
        return '🪨'; // Default asteroid icon
      case 'debris':
        return '🛠️'; // Default debris icon
      case 'derelict':
        return '🛸'; // Default derelict icon
      case 'gate':
        return '🌀'; // Gate icon
      case 'anomaly':
        return '🌌'; // Anomaly icon
      default:
        return '⭐'; // Fallback
    }
  };

  // Get color based on object type and size
  const getColor = (): string => {
    switch (object.type) {
      case 'asteroid':
        return '#888';
      case 'debris':
        return '#666';
      case 'derelict':
        return '#aaa';
      case 'gate':
        return '#00f';
      case 'anomaly':
        return '#f0f';
      default:
        return '#fff';
    }
  };

  // Get size multiplier
  const getSizeMultiplier = (): number => {
    switch (object.size) {
      case 'small':
        return 0.8;
      case 'medium':
        return 1.0;
      case 'large':
        return 1.3;
      default:
        return 1.0;
    }
  };

  const icon = getVisualIcon();
  const color = getColor();
  const sizeMultiplier = getSizeMultiplier();

  // Handle click
  const handleClick = () => {
    if (onClick && !object.destroyed) {
      onClick(object);
    }
  };

  // Don't render destroyed objects (they'll be removed from state soon)
  if (object.destroyed) {
    return null;
  }

  return (
    <div
      className="absolute cursor-pointer transition-all duration-75 hover:scale-110"
      style={{
        left: `${object.position.x}px`,
        top: `${object.position.y}px`,
        width: `${object.width}px`,
        height: `${object.height}px`,
        transform: `translate(-50%, -50%) rotate(${object.rotation || 0}deg) scale(${sizeMultiplier})`,
        pointerEvents: object.destroyed ? 'none' : 'auto',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${object.type} ${object.size}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Object visual */}
      <div
        className="flex items-center justify-center w-full h-full text-4xl select-none"
        style={{
          filter: isDamaged ? 'brightness(0.8)' : 'brightness(1)',
        }}
      >
        <span
          style={{
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
        >
          {icon}
        </span>
      </div>

      {/* HP bar (only show when damaged) */}
      {isDamaged && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${-(object.rotation || 0)}deg)`,
            transformOrigin: 'center bottom',
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-red-600 to-green-500 transition-all duration-200"
            style={{
              width: `${hpPercent}%`,
              background:
                hpPercent > 66
                  ? 'linear-gradient(to right, #10b981, #34d399)'
                  : hpPercent > 33
                  ? 'linear-gradient(to right, #f59e0b, #fbbf24)'
                  : 'linear-gradient(to right, #ef4444, #f87171)',
            }}
          />
        </div>
      )}

      {/* Size indicator for debugging (can be removed) */}
      {import.meta.env.DEV && (
        <div
          className="absolute top-0 left-0 text-xs text-white bg-black bg-opacity-50 px-1 rounded"
          style={{
            transform: `rotate(${-(object.rotation || 0)}deg)`,
          }}
        >
          {object.size[0].toUpperCase()}
        </div>
      )}
    </div>
  );
});

GameObject.displayName = 'GameObject';
