/**
 * Bot component - renders individual mining bot
 * Shows bot position, state, and cargo
 */

import React from 'react';
import type { Bot as BotType } from '@/types';

interface BotProps {
  /** The bot to render */
  bot: BotType;
}

/**
 * Renders a single mining bot with visual representation
 */
export const Bot = React.memo<BotProps>(({ bot }) => {
  // Get color based on bot state
  const getStateColor = (): string => {
    switch (bot.state) {
      case 'idle':
        return '#60a5fa'; // Blue
      case 'moving_to_target':
        return '#a78bfa'; // Purple
      case 'mining':
        return '#34d399'; // Green (pulsing)
      case 'returning':
        return '#fbbf24'; // Yellow
      case 'depositing':
        return '#f472b6'; // Pink
      default:
        return '#9ca3af'; // Gray
    }
  };

  // Get glow effect for mining state
  const shouldPulse = bot.state === 'mining';

  const color = getStateColor();
  const size = 20; // Bot size in pixels

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${bot.position.x}px`,
        top: `${bot.position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
      aria-label={`Mining bot - ${bot.state}`}
    >
      {/* Bot SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: shouldPulse
            ? `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`
            : `drop-shadow(0 0 2px ${color})`,
          animation: shouldPulse ? 'pulse 1s ease-in-out infinite' : 'none',
        }}
      >
        {/* Bot body - simple robot icon */}
        <circle cx="12" cy="12" r="8" fill={color} opacity="0.9" />
        <circle cx="12" cy="12" r="5" fill="white" opacity="0.3" />
        {/* Bot eyes */}
        <circle cx="9" cy="10" r="1.5" fill="white" />
        <circle cx="15" cy="10" r="1.5" fill="white" />
        {/* Bot antenna */}
        <line x1="12" y1="4" x2="12" y2="7" stroke={color} strokeWidth="2" />
        <circle cx="12" cy="3" r="1" fill={color} />
      </svg>

      {/* Cargo indicator (only show if carrying resources) */}
      {bot.cargoAmount > 0 && (
        <div
          className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
          style={{
            fontSize: '8px',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          }}
        >
          {bot.cargoAmount}
        </div>
      )}

      {/* Mining progress bar (only show when mining) */}
      {bot.state === 'mining' && (
        <div
          className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden"
          style={{
            width: `${size}px`,
          }}
        >
          <div
            className="h-full bg-green-500 transition-all duration-100"
            style={{
              width: `${bot.miningProgress * 100}%`,
            }}
          />
        </div>
      )}

      {/* State label (dev mode only) */}
      {import.meta.env.DEV && (
        <div
          className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black bg-opacity-75 px-1 rounded whitespace-nowrap"
          style={{
            fontSize: '8px',
          }}
        >
          {bot.state}
        </div>
      )}

      {/* CSS animation for pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
});

Bot.displayName = 'Bot';
