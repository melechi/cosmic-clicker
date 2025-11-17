import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import {
  SPEED_FUEL_MULTIPLIERS,
  SPEED_DISTANCE_MULTIPLIERS,
} from '@/utils/gameLogic/resourceConversion';
import type { ShipSpeed } from '@/types';

export interface ShipControlsProps {
  /** Current ship speed */
  currentSpeed: ShipSpeed;
  /** Current fuel amount */
  fuel: number;
  /** Fuel tank capacity */
  tankCapacity: number;
  /** Maximum speed unlocked */
  maxSpeedUnlocked: ShipSpeed;
  /** Fuel efficiency percentage (lower = less consumption) */
  fuelEfficiencyPercent: number;
  /** Callback when speed changes */
  onSpeedChange: (speed: ShipSpeed) => void;
  /** Optional CSS class names */
  className?: string;
}

/**
 * Speed configuration with display info
 */
interface SpeedOption {
  speed: ShipSpeed;
  name: string;
  emoji: string;
  fuelMultiplier: number;
  distanceMultiplier: number;
  description: string;
}

/**
 * All available speed options
 */
const SPEED_OPTIONS: SpeedOption[] = [
  {
    speed: 'stop',
    name: 'Stop',
    emoji: '⏸️',
    fuelMultiplier: 0,
    distanceMultiplier: 0,
    description: 'Emergency conservation, mining specific area',
  },
  {
    speed: 'slow',
    name: 'Slow',
    emoji: '🐌',
    fuelMultiplier: 0.5,
    distanceMultiplier: 0.5,
    description: 'Fuel efficient, more time to mine objects',
  },
  {
    speed: 'normal',
    name: 'Normal',
    emoji: '➡️',
    fuelMultiplier: 1.0,
    distanceMultiplier: 1.0,
    description: 'Balanced (default)',
  },
  {
    speed: 'fast',
    name: 'Fast',
    emoji: '⏩',
    fuelMultiplier: 2.0,
    distanceMultiplier: 2.0,
    description: 'Speed through empty areas',
  },
  {
    speed: 'boost',
    name: 'Boost',
    emoji: '🚀',
    fuelMultiplier: 5.0,
    distanceMultiplier: 3.0,
    description: 'Emergency escape, very inefficient',
  },
];

/**
 * Speed unlock order for checking if a speed is available
 */
const SPEED_UNLOCK_ORDER: ShipSpeed[] = ['stop', 'slow', 'normal', 'fast', 'boost'];

/**
 * Ship Controls component for managing ship speed and fuel consumption
 * Displays speed selector, fuel consumption rates, and fuel tank level
 */
export const ShipControls: React.FC<ShipControlsProps> = ({
  currentSpeed,
  fuel,
  tankCapacity,
  maxSpeedUnlocked,
  fuelEfficiencyPercent,
  onSpeedChange,
  className = '',
}) => {
  const fuelPercentage = (fuel / tankCapacity) * 100;
  const isLowFuel = fuelPercentage < 10 && fuelPercentage > 0;
  const isOutOfFuel = fuel <= 0;

  /**
   * Check if a speed is unlocked
   */
  const isSpeedUnlocked = (speed: ShipSpeed): boolean => {
    const maxIndex = SPEED_UNLOCK_ORDER.indexOf(maxSpeedUnlocked);
    const speedIndex = SPEED_UNLOCK_ORDER.indexOf(speed);
    return speedIndex <= maxIndex;
  };

  /**
   * Calculate actual fuel consumption per second for a speed
   */
  const calculateFuelConsumption = (speed: ShipSpeed): number => {
    const multiplier = SPEED_FUEL_MULTIPLIERS[speed] || 1.0;
    return multiplier * (fuelEfficiencyPercent / 100);
  };

  /**
   * Calculate distance traveled per second for a speed
   */
  const calculateDistancePerSecond = (speed: ShipSpeed): number => {
    return SPEED_DISTANCE_MULTIPLIERS[speed] || 1.0;
  };

  /**
   * Handle speed button click
   */
  const handleSpeedClick = (speed: ShipSpeed) => {
    if (isSpeedUnlocked(speed)) {
      onSpeedChange(speed);
    }
  };

  /**
   * Keyboard shortcuts for speed control
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case '1':
          handleSpeedClick('stop');
          break;
        case '2':
          handleSpeedClick('slow');
          break;
        case '3':
          handleSpeedClick('normal');
          break;
        case '4':
          handleSpeedClick('fast');
          break;
        case '5':
          handleSpeedClick('boost');
          break;
        case ' ':
          // Spacebar toggles between stop and previous speed
          event.preventDefault();
          if (currentSpeed === 'stop') {
            handleSpeedClick('normal');
          } else {
            handleSpeedClick('stop');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSpeed, maxSpeedUnlocked]);

  /**
   * Get button variant based on speed state
   */
  const getButtonVariant = (speed: ShipSpeed): 'primary' | 'secondary' | 'danger' => {
    if (speed === currentSpeed) {
      return speed === 'boost' ? 'danger' : 'primary';
    }
    return 'secondary';
  };

  /**
   * Render speed tooltip content
   */
  const renderSpeedTooltip = (option: SpeedOption) => {
    const fuelConsumption = calculateFuelConsumption(option.speed);
    const distance = calculateDistancePerSecond(option.speed);
    const isUnlocked = isSpeedUnlocked(option.speed);

    return (
      <div className="text-left">
        <div className="font-semibold mb-1">
          {option.emoji} {option.name}
        </div>
        <div className="text-xs space-y-1">
          {isUnlocked ? (
            <>
              <div>Fuel: {fuelConsumption.toFixed(2)}/sec</div>
              <div>Distance: {distance}x</div>
              <div className="text-gray-400 mt-1">{option.description}</div>
            </>
          ) : (
            <div className="text-yellow-400">🔒 Requires engine upgrade</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={className} title="⚙️ Ship Controls">
      {/* Out of Fuel Warning */}
      {isOutOfFuel && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-center">
          <div className="text-red-400 font-bold mb-1">⚠️ OUT OF FUEL</div>
          <div className="text-sm text-gray-300">
            Ship has stopped. Mine objects to collect resources and convert them to fuel.
          </div>
        </div>
      )}

      {/* Low Fuel Warning */}
      {isLowFuel && (
        <div className="mb-4 p-3 bg-yellow-900/50 border border-yellow-500 rounded-lg text-center">
          <div className="text-yellow-400 font-bold">⚠️ LOW FUEL ({fuelPercentage.toFixed(1)}%)</div>
        </div>
      )}

      {/* Fuel Tank Display */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300 font-semibold">⛽ Fuel Tank</span>
          <span className="text-sm font-mono text-blue-400">
            {formatNumber(fuel)} / {formatNumber(tankCapacity)}
          </span>
        </div>
        <ProgressBar
          value={fuel}
          max={tankCapacity}
          variant={isOutOfFuel ? 'danger' : isLowFuel ? 'warning' : 'primary'}
          showPercentage
        />
      </div>

      {/* Current Speed Info */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Current Speed</span>
          <span className="text-lg font-bold">
            {SPEED_OPTIONS.find((s) => s.speed === currentSpeed)?.emoji}{' '}
            {SPEED_OPTIONS.find((s) => s.speed === currentSpeed)?.name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Fuel consumption:</span>
            <span className="font-mono text-blue-400">
              {calculateFuelConsumption(currentSpeed).toFixed(2)}/sec
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Distance rate:</span>
            <span className="font-mono text-green-400">
              {calculateDistancePerSecond(currentSpeed)}x
            </span>
          </div>
        </div>
      </div>

      {/* Speed Selector Buttons */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Select Speed</div>
        <div className="grid grid-cols-5 gap-2">
          {SPEED_OPTIONS.map((option) => {
            const isUnlocked = isSpeedUnlocked(option.speed);
            const isActive = option.speed === currentSpeed;

            return (
              <Tooltip key={option.speed} content={renderSpeedTooltip(option)} position="top">
                <Button
                  variant={getButtonVariant(option.speed)}
                  size="small"
                  disabled={!isUnlocked}
                  onClick={() => handleSpeedClick(option.speed)}
                  className={`relative ${isActive ? 'ring-2 ring-white' : ''} ${!isUnlocked ? 'opacity-40' : ''}`}
                  aria-label={`${option.name} speed`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xl mb-1">{option.emoji}</span>
                    <span className="text-xs">{option.name}</span>
                    {!isUnlocked && (
                      <span className="absolute top-0 right-0 text-xs">🔒</span>
                    )}
                  </div>
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-xs text-gray-500 text-center border-t border-gray-700 pt-3">
        <div className="mb-1">Keyboard shortcuts:</div>
        <div className="font-mono">
          1-5: Select speed | Space: Toggle stop/resume
        </div>
      </div>
    </Card>
  );
};
