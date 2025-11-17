import React from 'react';
import { formatNumber } from '@/utils/formatting/numberFormat';
import { Tooltip } from '@/components/ui/Tooltip';
import type { ResourceInventory } from '@/types/resources';

export interface HeaderProps {
  fuel: number;
  tankCapacity: number;
  credits: number;
  productionPerSecond: number;
  nebulaCrystals: number;
  clickPower: number;
  resources?: ResourceInventory; // Optional resource display
}

/**
 * Header component displaying game resources and stats
 */
export const Header: React.FC<HeaderProps> = ({
  fuel,
  tankCapacity,
  credits,
  productionPerSecond,
  nebulaCrystals,
  clickPower: _clickPower,
  resources,
}) => {
  // Calculate which key resources to display (only if player has any)
  const keyResources = resources
    ? [
        { id: 'stone', emoji: '🪨', count: resources.stone },
        { id: 'carbon', emoji: '⚫', count: resources.carbon },
        { id: 'iron', emoji: '🔩', count: resources.iron },
      ].filter((r) => r.count > 0)
    : [];

  return (
    <header className="bg-gray-900 border-b border-gray-700 py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Top Row: Logo and Primary Resources */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚀</div>
            <h1 className="text-2xl font-bold text-white">Cosmic Clicker</h1>
          </div>

          {/* Primary Resource Display */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Fuel with Tank Capacity */}
            <Tooltip
              content={`Current fuel: ${fuel.toFixed(1)} / Tank capacity: ${tankCapacity.toFixed(0)}`}
            >
              <div className="flex flex-col items-end">
                <div className="text-xs text-gray-400 uppercase tracking-wide">⛽ Fuel</div>
                <div
                  className="text-2xl font-bold text-blue-400"
                  aria-label={`Fuel: ${formatNumber(fuel)} of ${formatNumber(tankCapacity)}`}
                >
                  {formatNumber(fuel)}
                  <span className="text-sm text-gray-500">/{formatNumber(tankCapacity)}</span>
                </div>
              </div>
            </Tooltip>

            {/* Credits (Main upgrade currency) */}
            <Tooltip content="Main currency for purchasing upgrades and ship modules">
              <div className="flex flex-col items-end bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-500/50">
                <div className="text-xs text-yellow-300 uppercase tracking-wide">💰 Credits</div>
                <div
                  className="text-2xl font-bold text-yellow-400"
                  aria-label={`Credits: ${formatNumber(credits)}`}
                >
                  {formatNumber(credits)}
                </div>
              </div>
            </Tooltip>

            {/* Production Rate (if applicable) */}
            {productionPerSecond > 0 && (
              <Tooltip
                content={`You generate ${productionPerSecond.toFixed(2)} fuel every second`}
              >
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Per Second</div>
                  <div
                    className="text-lg font-semibold text-green-400"
                    aria-label={`Production rate: ${formatNumber(productionPerSecond)} per second`}
                  >
                    {formatNumber(productionPerSecond)}/s
                  </div>
                </div>
              </Tooltip>
            )}

            {/* Nebula Crystals */}
            {nebulaCrystals > 0 && (
              <Tooltip content="Prestige currency - provides permanent production bonus">
                <div className="flex flex-col items-end bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-500/50">
                  <div className="text-xs text-purple-300 uppercase tracking-wide">
                    💫 Nebula Crystals
                  </div>
                  <div
                    className="text-xl font-bold text-purple-400"
                    aria-label={`Nebula crystals: ${formatNumber(nebulaCrystals)}`}
                  >
                    {formatNumber(nebulaCrystals)}
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Bottom Row: Key Resources (optional, compact) */}
        {keyResources.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Resources:</div>
            {keyResources.map((resource) => (
              <Tooltip
                key={resource.id}
                content={`${resource.id.charAt(0).toUpperCase() + resource.id.slice(1)}: ${resource.count}`}
              >
                <div
                  className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-sm"
                  aria-label={`${resource.id}: ${resource.count}`}
                >
                  <span>{resource.emoji}</span>
                  <span className="text-white font-medium">{formatNumber(resource.count)}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
