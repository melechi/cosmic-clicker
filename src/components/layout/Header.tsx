import React from 'react';
import { formatNumber } from '@/utils/formatting/numberFormat';
import { Tooltip } from '@/components/ui/Tooltip';

export interface HeaderProps {
  fuel: number;
  productionPerSecond: number;
  nebulaCrystals: number;
  clickPower: number;
}

/**
 * Header component displaying game resources and stats
 */
export const Header: React.FC<HeaderProps> = ({
  fuel,
  productionPerSecond,
  nebulaCrystals,
  clickPower,
}) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 py-4 px-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">✨</div>
          <h1 className="text-2xl font-bold text-white">Cosmic Clicker</h1>
        </div>

        {/* Resource Display */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Fuel */}
          <Tooltip content={`Total fuel: ${fuel.toFixed(1)}`}>
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400 uppercase tracking-wide">⛽ Fuel</div>
              <div
                className="text-2xl font-bold text-blue-400"
                aria-label={`Fuel: ${formatNumber(fuel)}`}
              >
                {formatNumber(fuel)}
              </div>
            </div>
          </Tooltip>

          {/* Production Rate */}
          <Tooltip content={`You generate ${productionPerSecond.toFixed(2)} fuel every second`}>
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

          {/* Click Power */}
          <Tooltip content="Fuel gained per click">
            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Per Click</div>
              <div
                className="text-lg font-semibold text-yellow-400"
                aria-label={`Click power: ${formatNumber(clickPower)}`}
              >
                {formatNumber(clickPower)}
              </div>
            </div>
          </Tooltip>

          {/* Nebula Crystals */}
          {nebulaCrystals > 0 && (
            <Tooltip content="Prestige currency - provides permanent production bonus">
              <div className="flex flex-col items-end bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-500/50">
                <div className="text-xs text-purple-300 uppercase tracking-wide">Nebula Crystals</div>
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
    </header>
  );
};
