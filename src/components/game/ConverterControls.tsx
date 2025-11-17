import React, { useState, useMemo } from 'react';
import { useGame } from '@/context';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting/numberFormat';
import {
  convertResourceToFuel,
  calculateTotalCargo,
} from '@/utils/gameLogic/resourceConversion';
import { RESOURCES } from '@/constants/resources';
import type { ResourceType } from '@/types';

/**
 * Converter Controls - Settings for auto-conversion and conversion efficiency
 */
export const ConverterControls: React.FC = () => {
  const { state } = useGame();
  const toast = useToast();

  // Get converter module state
  const converter = state.modules.converter;
  const [autoConvertPercent, setAutoConvertPercent] = useState(converter.autoConvertPercent);

  // Calculate conversion preview
  const conversionPreview = useMemo(() => {
    let totalResources = 0;
    let totalFuel = 0;

    RESOURCES.forEach((resource) => {
      const resourceType = resource.id as ResourceType;
      const amount = state.resources[resourceType] || 0;

      if (amount > 0) {
        // Calculate how many would be converted based on auto-convert percent
        const toConvert = Math.floor(amount * (autoConvertPercent / 100));
        if (toConvert > 0) {
          totalResources += toConvert;
          totalFuel += convertResourceToFuel(resourceType, toConvert, converter.efficiencyPercent);
        }
      }
    });

    return { totalResources, totalFuel };
  }, [state.resources, autoConvertPercent, converter.efficiencyPercent]);

  // Calculate conversion speed (resources per second)
  const conversionSpeed = converter.conversionSpeed;
  const conversionTimeEstimate = conversionPreview.totalResources > 0
    ? conversionPreview.totalResources / conversionSpeed
    : 0;

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setAutoConvertPercent(value);

    // TODO: When we have SET_AUTO_CONVERT_PERCENT action, dispatch it here
    // dispatch(actions.setAutoConvertPercent(value));

    if (value === 0) {
      toast.info('Auto-conversion disabled');
    } else if (value === 100) {
      toast.info('Auto-converting all resources');
    }
  };

  // Get slider color based on value
  const getSliderColor = (value: number) => {
    if (value === 0) return '#6b7280'; // gray
    if (value < 50) return '#3b82f6'; // blue
    if (value < 80) return '#10b981'; // green
    return '#f59e0b'; // yellow/orange
  };

  const currentCargo = calculateTotalCargo(state.resources);

  return (
    <Card title="Converter Controls" className="h-full">
      <div className="space-y-6">
        {/* Auto-convert slider */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label htmlFor="auto-convert-slider" className="text-sm font-semibold text-gray-300">
              Auto-Convert Percentage
            </label>
            <span
              className="text-lg font-bold"
              style={{ color: getSliderColor(autoConvertPercent) }}
            >
              {autoConvertPercent}%
            </span>
          </div>

          <input
            id="auto-convert-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={autoConvertPercent}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${getSliderColor(autoConvertPercent)} 0%, ${getSliderColor(autoConvertPercent)} ${autoConvertPercent}%, #374151 ${autoConvertPercent}%, #374151 100%)`,
            }}
            aria-label="Auto-convert percentage slider"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {autoConvertPercent === 0 && 'Auto-conversion is disabled. Convert resources manually.'}
            {autoConvertPercent > 0 && autoConvertPercent < 100 &&
              `Automatically convert ${autoConvertPercent}% of collected resources to fuel.`}
            {autoConvertPercent === 100 && 'All collected resources will be automatically converted to fuel.'}
          </p>
        </div>

        {/* Conversion stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Conversion Speed</div>
            <div className="text-lg font-bold text-blue-400">
              {conversionSpeed.toFixed(1)}
              <span className="text-xs text-gray-400 ml-1">res/sec</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Efficiency</div>
            <div className="text-lg font-bold text-green-400">
              {converter.efficiencyPercent}%
            </div>
          </div>
        </div>

        {/* Unlocked tiers */}
        <div>
          <div className="text-xs text-gray-500 mb-2">Unlocked Resource Tiers</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((tier) => (
              <div
                key={tier}
                className={`flex-1 text-center py-2 rounded ${
                  converter.unlockedTiers.includes(tier)
                    ? 'bg-blue-900/30 border-blue-700 text-blue-400'
                    : 'bg-gray-800 border-gray-700 text-gray-600'
                } border`}
              >
                <div className="text-xs font-semibold">Tier {tier}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {converter.unlockedTiers.length === 1 && 'Upgrade to unlock higher tier resource conversion.'}
            {converter.unlockedTiers.length === 4 && 'All resource tiers unlocked!'}
            {converter.unlockedTiers.length > 1 && converter.unlockedTiers.length < 4 &&
              `Tier ${converter.unlockedTiers[converter.unlockedTiers.length - 1]} resources unlocked.`}
          </p>
        </div>

        {/* Conversion preview */}
        {currentCargo > 0 && autoConvertPercent > 0 && (
          <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
            <div className="text-sm font-semibold text-purple-300 mb-2">
              Conversion Preview
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Resources to convert:</span>
                <span className="text-white font-semibold">
                  {formatNumber(conversionPreview.totalResources, 0)} units
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Fuel produced:</span>
                <span className="text-green-400 font-bold">
                  {formatNumber(conversionPreview.totalFuel, 0)} ⚡
                </span>
              </div>
              {conversionTimeEstimate > 0 && (
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-purple-800">
                  <span>Est. conversion time:</span>
                  <span>{conversionTimeEstimate.toFixed(1)}s</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Module upgrades hint */}
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400">
            <div className="font-semibold text-gray-300 mb-1">Converter Upgrades</div>
            <ul className="space-y-1 list-disc list-inside">
              {!converter.parallelProcessing && (
                <li>Parallel Processing: Convert multiple resource types simultaneously</li>
              )}
              {!converter.smartMode && (
                <li>Smart Mode: Auto-adjust conversion based on fuel levels</li>
              )}
              {converter.efficiencyPercent === 100 && (
                <li>Efficiency Upgrades: Increase fuel output per resource</li>
              )}
              {converter.conversionSpeed < 2 && (
                <li>Speed Upgrades: Convert resources faster</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
