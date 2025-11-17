import React from 'react';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import { getResourceById } from '@/constants/resources';
import type { ResourceType } from '@/types';

export interface ResourceDisplayProps {
  /** Type of resource to display */
  resourceType: ResourceType;
  /** Amount of this resource */
  amount: number;
  /** Show detailed info (conversion rate, credit value) */
  showDetails?: boolean;
  /** Compact mode (smaller display) */
  compact?: boolean;
  /** Optional CSS class names */
  className?: string;
}

/**
 * Reusable component for displaying a single resource with icon and amount
 */
export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  resourceType,
  amount,
  showDetails = false,
  compact = false,
  className = '',
}) => {
  const resource = getResourceById(resourceType);

  if (!resource) {
    return null;
  }

  const rarityColors = {
    common: 'text-gray-400',
    uncommon: 'text-green-400',
    rare: 'text-blue-400',
    very_rare: 'text-purple-400',
    legendary: 'text-yellow-400',
  };

  const rarityBgColors = {
    common: 'bg-gray-800',
    uncommon: 'bg-green-900/20',
    rare: 'bg-blue-900/20',
    very_rare: 'bg-purple-900/20',
    legendary: 'bg-yellow-900/20',
  };

  const rarityBorderColors = {
    common: 'border-gray-700',
    uncommon: 'border-green-700',
    rare: 'border-blue-700',
    very_rare: 'border-purple-700',
    legendary: 'border-yellow-700',
  };

  const tooltipContent = (
    <div className="text-left space-y-1">
      <div className="font-semibold">{resource.name}</div>
      <div className="text-xs text-gray-300">{resource.description}</div>
      <div className="text-xs border-t border-gray-600 pt-1 mt-1">
        <div>Tier {resource.tier} • {resource.rarity}</div>
        <div>1 {resource.name} → {resource.fuelConversionRate} Fuel</div>
        <div>Sells for {resource.creditValue} Credits</div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <Tooltip content={tooltipContent}>
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded ${rarityBgColors[resource.rarity]} ${rarityBorderColors[resource.rarity]} border ${className}`}
        >
          <span className="text-lg">{resource.icon}</span>
          <span className={`text-sm font-semibold ${rarityColors[resource.rarity]}`}>
            {formatNumber(amount, 0)}
          </span>
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${rarityBgColors[resource.rarity]} ${rarityBorderColors[resource.rarity]} border ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{resource.icon}</span>
        <div>
          <div className={`font-semibold ${rarityColors[resource.rarity]}`}>
            {resource.name}
          </div>
          {showDetails && (
            <div className="text-xs text-gray-400 mt-1 space-y-0.5">
              <div>→ {resource.fuelConversionRate} Fuel/unit</div>
              <div>Sell: {resource.creditValue} Credits/unit</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${rarityColors[resource.rarity]}`}>
          {formatNumber(amount, 0)}
        </div>
        {showDetails && (
          <div className="text-xs text-gray-500">Tier {resource.tier}</div>
        )}
      </div>
    </div>
  );
};
