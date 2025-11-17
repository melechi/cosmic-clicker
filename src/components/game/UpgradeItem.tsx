import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { AnyUpgrade } from '@/types';

export interface UpgradeItemProps {
  upgrade: AnyUpgrade;
  isPurchased: boolean;
  canAfford: boolean;
  onPurchase: (upgradeId: string) => void;
}

/**
 * Individual upgrade item with purchase button
 */
export const UpgradeItem: React.FC<UpgradeItemProps> = ({
  upgrade,
  isPurchased,
  canAfford,
  onPurchase,
}) => {
  const handlePurchase = () => {
    if (!isPurchased && canAfford) {
      onPurchase(upgrade.id);
    }
  };

  const getUpgradeIcon = (type: string): string => {
    switch (type) {
      case 'click':
        return '👆';
      case 'production':
        return '📈';
      case 'autoClick':
        return '🤖';
      case 'prestige':
        return '💫';
      default:
        return '⚡';
    }
  };

  return (
    <Card
      className={`p-4 transition-all ${
        isPurchased
          ? 'opacity-50 border-green-500/50'
          : canAfford
          ? 'hover:border-blue-500 cursor-pointer'
          : 'opacity-75'
      }`}
      onClick={handlePurchase}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
          {getUpgradeIcon(upgrade.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white">{upgrade.name}</h3>
            {isPurchased && (
              <span className="text-green-400 text-sm font-semibold flex-shrink-0">
                ✓ Owned
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-2">{upgrade.description}</p>

          {/* Cost and Purchase */}
          {!isPurchased && (
            <div className="flex items-center justify-between gap-2">
              <Tooltip content="Fuel cost to purchase this upgrade">
                <div className="text-yellow-400 font-semibold">
                  {formatNumber(upgrade.cost)} ⛽
                </div>
              </Tooltip>
              <Button
                variant={canAfford ? 'primary' : 'secondary'}
                size="small"
                onClick={handlePurchase}
                disabled={!canAfford}
                aria-label={`Purchase ${upgrade.name} for ${formatNumber(upgrade.cost)} fuel`}
              >
                Buy
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
