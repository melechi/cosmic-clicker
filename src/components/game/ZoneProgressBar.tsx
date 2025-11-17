import React from 'react';
import { formatNumber } from '@/utils/formatting/numberFormat';

export interface ZoneProgressBarProps {
  currentZone: number;
  currentFuel: number;
  fuelRequired: number;
  onWarpToNextZone?: () => void;
}

interface ZoneInfo {
  number: number;
  name: string;
  color: string;
  bgColor: string;
}

const ZONES: ZoneInfo[] = [
  { number: 1, name: 'Asteroid Belt', color: '#a16207', bgColor: '#fef3c7' },
  { number: 2, name: 'Ice Field', color: '#0369a1', bgColor: '#e0f2fe' },
  { number: 3, name: 'Nebula Cloud', color: '#a21caf', bgColor: '#fae8ff' },
  { number: 4, name: 'Debris Field', color: '#ea580c', bgColor: '#ffedd5' },
  { number: 5, name: 'Dark Matter', color: '#4c1d95', bgColor: '#ede9fe' },
  { number: 6, name: '???', color: '#64748b', bgColor: '#f1f5f9' },
];

/**
 * Zone progress bar showing current zone and progress to next zone
 */
export const ZoneProgressBar: React.FC<ZoneProgressBarProps> = ({
  currentZone,
  currentFuel,
  fuelRequired,
  onWarpToNextZone,
}) => {
  const progress = Math.min((currentFuel / fuelRequired) * 100, 100);
  const canWarp = currentFuel >= fuelRequired;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-center">Zone Progress</h2>

      {/* Current Zone */}
      <div className="mb-6 p-4 rounded-lg bg-gray-800 border-2 border-blue-500">
        <div className="text-sm text-gray-400 mb-1">Current Zone</div>
        <div className="text-2xl font-bold" style={{ color: ZONES[currentZone - 1]?.color || '#fff' }}>
          Zone {currentZone}
        </div>
        <div className="text-sm text-gray-300">{ZONES[currentZone - 1]?.name || 'Unknown'}</div>
      </div>

      {/* Progress to Next Zone */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Fuel Progress</span>
          <span className="text-blue-400 font-semibold">{progress.toFixed(1)}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-8 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${progress}%` }}
          >
            {progress > 10 && (
              <span className="text-xs font-bold text-white drop-shadow">
                {formatNumber(currentFuel)}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-1 text-right">
          {formatNumber(currentFuel)} / {formatNumber(fuelRequired)} fuel
        </div>
      </div>

      {/* Warp Button */}
      {canWarp && onWarpToNextZone && (
        <button
          onClick={onWarpToNextZone}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 animate-pulse"
        >
          🚀 WARP TO ZONE {currentZone + 1}
        </button>
      )}

      {/* Zone List */}
      <div className="mt-6 space-y-2">
        <div className="text-sm text-gray-400 mb-3">All Zones</div>
        {ZONES.map((zone) => {
          const isCurrentZone = zone.number === currentZone;
          const isCompleted = zone.number < currentZone;
          const isLocked = zone.number > currentZone;

          return (
            <div
              key={zone.number}
              className={`p-3 rounded-lg border-2 transition-all ${
                isCurrentZone
                  ? 'border-blue-500 bg-gray-800'
                  : isCompleted
                  ? 'border-green-600 bg-gray-800 opacity-60'
                  : 'border-gray-700 bg-gray-800 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted && <span className="text-green-500">✓</span>}
                  {isCurrentZone && <span className="text-blue-500">➤</span>}
                  {isLocked && <span className="text-gray-600">🔒</span>}
                  <span className="font-semibold" style={{ color: isLocked ? '#64748b' : zone.color }}>
                    Zone {zone.number}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{zone.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
