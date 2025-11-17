import React, { useState } from 'react';

export interface DebugPanelProps {
  onAddFuel: (amount: number) => void;
  onSetZone: (zone: number) => void;
  onAddBuilding: (buildingId: string, quantity: number) => void;
  onResetGame: () => void;
  currentFuel: number;
  currentZone: number;
}

/**
 * Debug panel for testing game mechanics
 * Only visible in development mode
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  onAddFuel,
  onSetZone,
  onAddBuilding,
  onResetGame,
  currentFuel,
  currentZone,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fuelAmount, setFuelAmount] = useState('1000');
  const [zoneNumber, setZoneNumber] = useState(String(currentZone));

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-sm z-50"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl p-4 z-50 max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg font-mono">🐛 Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Current State */}
        <div className="bg-gray-800 p-3 rounded text-sm font-mono">
          <div className="text-gray-400">Current Fuel:</div>
          <div className="text-blue-400">{Math.floor(currentFuel).toLocaleString()}</div>
          <div className="text-gray-400 mt-2">Current Zone:</div>
          <div className="text-purple-400">{currentZone}</div>
        </div>

        {/* Add Fuel */}
        <div className="bg-gray-800 p-3 rounded">
          <label className="text-white text-sm font-semibold block mb-2">Add Fuel</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fuelAmount}
              onChange={(e) => setFuelAmount(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Amount"
            />
            <button
              onClick={() => onAddFuel(Number(fuelAmount))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onAddFuel(1000)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
            >
              +1K
            </button>
            <button
              onClick={() => onAddFuel(10000)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
            >
              +10K
            </button>
            <button
              onClick={() => onAddFuel(100000)}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
            >
              +100K
            </button>
          </div>
        </div>

        {/* Change Zone */}
        <div className="bg-gray-800 p-3 rounded">
          <label className="text-white text-sm font-semibold block mb-2">Set Zone</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="6"
              value={zoneNumber}
              onChange={(e) => setZoneNumber(e.target.value)}
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Zone #"
            />
            <button
              onClick={() => onSetZone(Number(zoneNumber))}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
            >
              Set
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5, 6].map((zone) => (
              <button
                key={zone}
                onClick={() => onSetZone(zone)}
                className={`flex-1 px-2 py-1 rounded text-xs font-semibold ${
                  zone === currentZone
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Add Buildings */}
        <div className="bg-gray-800 p-3 rounded">
          <label className="text-white text-sm font-semibold block mb-2">Add Buildings</label>
          <button
            onClick={() => onAddBuilding('spaceMiner', 10)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm mb-2"
          >
            +10 Mining Drones
          </button>
          <button
            onClick={() => onAddBuilding('asteroidHarvester', 10)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
          >
            +10 Asteroid Harvesters
          </button>
        </div>

        {/* Reset Game */}
        <div className="bg-gray-800 p-3 rounded">
          <button
            onClick={() => {
              if (window.confirm('Reset entire game? This cannot be undone!')) {
                onResetGame();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold"
          >
            🗑️ Reset Game
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center font-mono">
        Debug mode - Development only
      </div>
    </div>
  );
};
