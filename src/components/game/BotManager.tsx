/**
 * BotManager component - manages bot lifecycle and rendering
 * Spawns/despawns bots based on botBay module configuration
 * Updates all bots every frame and renders them
 */

import React, { useEffect, useRef } from 'react';
import { useGame } from '@/context';
import { actions } from '@/context/actions';
import { createBot } from '@/utils/gameLogic/botAI';
import { Bot } from './Bot';

interface BotManagerProps {
  /** Enable/disable bot system */
  enabled?: boolean;
}

/**
 * Manages spawning, updating, and rendering of all mining bots
 */
export const BotManager = React.memo<BotManagerProps>(({ enabled = true }) => {
  const { state, dispatch } = useGame();
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());

  // Manage bot count - spawn/despawn bots based on botBay.botCount
  useEffect(() => {
    if (!enabled) return;

    const targetBotCount = state.modules.botBay.botCount;
    const currentBotCount = state.bots.length;

    if (currentBotCount < targetBotCount) {
      // Spawn new bots
      const botsToSpawn = targetBotCount - currentBotCount;
      for (let i = 0; i < botsToSpawn; i++) {
        const botId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newBot = createBot(botId);
        dispatch(actions.spawnBot(newBot));
      }
    } else if (currentBotCount > targetBotCount) {
      // Despawn excess bots (remove from the end)
      const botsToDespawn = currentBotCount - targetBotCount;
      for (let i = 0; i < botsToDespawn; i++) {
        const lastBot = state.bots[state.bots.length - 1 - i];
        if (lastBot) {
          dispatch(actions.despawnBot(lastBot.id));
        }
      }
    }
  }, [state.modules.botBay.botCount, state.bots.length, enabled, dispatch]);

  // Update all bots every frame
  useEffect(() => {
    if (!enabled) return;

    const updateLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Only update if there are bots
      if (state.bots.length > 0) {
        dispatch(actions.updateBots(deltaTime));
      }

      frameRef.current = requestAnimationFrame(updateLoop);
    };

    frameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, dispatch, state.bots.length]);

  // Don't render if disabled or no bots
  if (!enabled || state.bots.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      role="region"
      aria-label="Mining bots area"
      style={{
        zIndex: 15, // Above objects but below UI
      }}
    >
      {/* Render all active bots */}
      {state.bots.map((bot) => (
        <Bot key={bot.id} bot={bot} />
      ))}

      {/* Debug info (dev mode only) */}
      {import.meta.env.DEV && state.bots.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded pointer-events-auto">
          <div className="font-bold mb-1">Bot System</div>
          <div>Active Bots: {state.bots.length}</div>
          <div>Target Count: {state.modules.botBay.botCount}</div>
          <div className="mt-1 text-xs opacity-75">
            {state.bots.map((bot) => (
              <div key={bot.id}>
                {bot.id.slice(-8)}: {bot.state} ({bot.cargoAmount})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

BotManager.displayName = 'BotManager';
