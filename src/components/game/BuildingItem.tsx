import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { Building } from '@/types';

export interface BuildingItemProps {
  building: Building;
  owned: number;
  currentCost: number;
  canAfford: boolean;
  onPurchase: (buildingId: string) => void;
  totalProduction: number;
}

/**
 * Individual building item with purchase button
 */
export const BuildingItem: React.FC<BuildingItemProps> = ({
  building,
  owned,
  currentCost,
  canAfford,
  onPurchase,
  totalProduction,
}) => {
  const handlePurchase = () => {
    onPurchase(building.id);
  };

  return (
    <Card className="flex items-center gap-4 p-4 hover:border-blue-500/50 transition-colors">
      {/* Building Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-bold text-white">{building.name}</h3>
          <span className="text-sm text-gray-400">({owned})</span>
        </div>
        <p className="text-sm text-gray-400 mb-2">{building.description}</p>

        <div className="flex gap-4 text-xs">
          <Tooltip content="Base production per building per second">
            <div className="text-green-400">
              +{formatNumber(building.production)}/s each
            </div>
          </Tooltip>
          {owned > 0 && (
            <Tooltip content="Total production from all owned buildings">
              <div className="text-blue-400">
                Total: {formatNumber(totalProduction)}/s
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Purchase Button */}
      <div className="flex flex-col items-end gap-2">
        <Tooltip content={canAfford ? 'Click to purchase' : 'Not enough fuel'}>
          <Button
            variant={canAfford ? 'primary' : 'secondary'}
            size="medium"
            onClick={handlePurchase}
            disabled={!canAfford}
            aria-label={`Purchase ${building.name} for {formatNumber(currentCost)} fuel`}
          >
            <div className="flex flex-col items-center min-w-24">
              <span className="text-xs text-gray-300">Buy</span>
              <span className="text-lg font-bold">{formatNumber(currentCost)}</span>
            </div>
          </Button>
        </Tooltip>
        <div className="text-xs text-gray-500">
          Tier {building.tier}
        </div>
      </div>
    </Card>
  );
};
