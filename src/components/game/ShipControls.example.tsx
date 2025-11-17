/**
 * Example integration of ShipControls component with GameContext
 *
 * This file demonstrates how to use the ShipControls component
 * within the game's state management system.
 */

import React from 'react';
import { ShipControls } from './ShipControls';
import { useGame } from '@/context/GameContext';
import { actions } from '@/context/actions';

/**
 * Example 1: Basic integration with GameContext
 *
 * This is the recommended way to use ShipControls in your game.
 * It automatically connects to the global game state.
 */
export const ShipControlsExample: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleSpeedChange = (speed: string) => {
    // Dispatch the SET_SHIP_SPEED action
    dispatch(actions.setShipSpeed(speed as any));
  };

  return (
    <ShipControls
      currentSpeed={state.shipSpeed}
      fuel={state.fuel}
      tankCapacity={state.modules.engine.tankCapacity}
      maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
      fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
      onSpeedChange={handleSpeedChange}
    />
  );
};

/**
 * Example 2: Integration in a Ship Management Panel
 *
 * Shows how to combine ShipControls with other ship-related components
 */
export const ShipManagementPanel: React.FC = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Ship Controls */}
      <ShipControls
        currentSpeed={state.shipSpeed}
        fuel={state.fuel}
        tankCapacity={state.modules.engine.tankCapacity}
        maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
        fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
        onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed as any))}
      />

      {/* Other ship components could go here */}
      {/* Example: Engine Module Upgrades Panel */}
      {/* Example: Fuel Conversion Status */}
    </div>
  );
};

/**
 * Example 3: Integration in a Tab-Based Layout
 *
 * Shows how to use ShipControls as part of a tabbed interface
 */
export const GameTabsWithShipControls: React.FC = () => {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = React.useState<'ship' | 'mining' | 'cargo'>('ship');

  return (
    <div className="bg-gray-900 rounded-lg">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'ship' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('ship')}
        >
          🚀 Ship
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'mining' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('mining')}
        >
          ⛏️ Mining
        </button>
        <button
          className={`px-6 py-3 font-semibold ${activeTab === 'cargo' ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('cargo')}
        >
          📦 Cargo
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'ship' && (
          <ShipControls
            currentSpeed={state.shipSpeed}
            fuel={state.fuel}
            tankCapacity={state.modules.engine.tankCapacity}
            maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
            fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
            onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed as any))}
          />
        )}
        {activeTab === 'mining' && (
          <div className="text-white">Mining controls would go here...</div>
        )}
        {activeTab === 'cargo' && (
          <div className="text-white">Cargo management would go here...</div>
        )}
      </div>
    </div>
  );
};

/**
 * Example 4: Floating Control Panel
 *
 * Shows how to use ShipControls as a floating overlay
 */
export const FloatingShipControls: React.FC = () => {
  const { state, dispatch } = useGame();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        ⚙️ Ship Controls
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md shadow-2xl">
      <div className="relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10"
          onClick={() => setIsVisible(false)}
          aria-label="Minimize controls"
        >
          ✕
        </button>
        <ShipControls
          currentSpeed={state.shipSpeed}
          fuel={state.fuel}
          tankCapacity={state.modules.engine.tankCapacity}
          maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
          fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
          onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed as any))}
        />
      </div>
    </div>
  );
};

/**
 * Example 5: Mobile-Optimized Layout
 *
 * Shows how to make ShipControls responsive for mobile devices
 */
export const MobileShipControls: React.FC = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="w-full max-w-screen-sm mx-auto px-2">
      <ShipControls
        currentSpeed={state.shipSpeed}
        fuel={state.fuel}
        tankCapacity={state.modules.engine.tankCapacity}
        maxSpeedUnlocked={state.modules.engine.maxSpeedUnlocked}
        fuelEfficiencyPercent={state.modules.engine.fuelEfficiencyPercent}
        onSpeedChange={(speed) => dispatch(actions.setShipSpeed(speed as any))}
        className="text-sm" // Smaller text for mobile
      />
    </div>
  );
};

/**
 * Where to integrate ShipControls:
 *
 * 1. Main Game View (Recommended)
 *    - Add to the bottom navigation tabs alongside Resources, Upgrades, etc.
 *    - Or place in a dedicated "Ship" tab
 *
 * 2. Sidebar Panel
 *    - Fixed position on the right or left side of the screen
 *    - Always visible while playing
 *
 * 3. Floating Overlay
 *    - Draggable or fixed position overlay
 *    - Can be minimized when not needed
 *
 * 4. Ship Management Screen
 *    - Combine with other ship modules (Laser, Bots, etc.)
 *    - Part of a comprehensive ship upgrade/management interface
 */

/**
 * Integration Tips:
 *
 * 1. Always use GameContext for state management
 *    - Don't maintain local state for ship speed or fuel
 *    - Use dispatch to update the global game state
 *
 * 2. Consider mobile users
 *    - The component is responsive but test on smaller screens
 *    - Touch targets should be at least 44x44 pixels
 *
 * 3. Keyboard shortcuts work globally
 *    - Users can control speed from anywhere in the game
 *    - No need to focus the component first
 *
 * 4. Visual feedback
 *    - The component automatically shows fuel warnings
 *    - Consider adding toast notifications for speed changes
 *
 * 5. Accessibility
 *    - The component has proper ARIA labels
 *    - Keyboard navigation works out of the box
 */
