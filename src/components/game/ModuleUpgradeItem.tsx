import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { ModuleUpgrade } from '@/constants/modules';
import type { BaseModule } from '@/types';
import {
  getUpgradeStatus,
  getPrerequisiteNames,
  formatStatChange,
  getStatDisplayName,
} from '@/utils/gameLogic/moduleUpgrades';
import { MODULE_UPGRADES } from '@/constants/modules';

export interface ModuleUpgradeItemProps {
  upgrade: ModuleUpgrade;
  module: BaseModule;
  credits: number;
  onPurchase: (upgradeId: string) => void;
}

/**
 * Individual module upgrade item with purchase button
 */
export const ModuleUpgradeItem: React.FC<ModuleUpgradeItemProps> = ({
  upgrade,
  module,
  credits,
  onPurchase,
}) => {
  const status = getUpgradeStatus(upgrade, module, credits);
  const prerequisiteNames = getPrerequisiteNames(upgrade, MODULE_UPGRADES);

  const handlePurchase = () => {
    if (status.canPurchase) {
      onPurchase(upgrade.id);
    }
  };

  // Get the primary stat change for display
  const statChanges = Object.entries(upgrade.statChanges);
  const primaryStatChange = statChanges[0];

  // Get current value from module
  const getCurrentStatValue = (statKey: string): number | boolean | string | number[] | string[] | undefined => {
    return (module as Record<string, unknown>)[statKey] as number | boolean | string | number[] | string[] | undefined;
  };

  // Determine border color based on status
  const getBorderColor = () => {
    if (status.isPurchased) return 'border-green-500/50';
    if (status.isLocked) return 'border-gray-600';
    if (status.canPurchase) return 'border-blue-500';
    return 'border-gray-700';
  };

  return (
    <Card
      className={`transition-all ${getBorderColor()} ${
        status.isPurchased
          ? 'opacity-50'
          : status.canPurchase
          ? 'hover:border-blue-400 cursor-pointer'
          : 'opacity-75'
      }`}
      onClick={handlePurchase}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
          {status.isPurchased ? '✓' : status.isLocked ? '🔒' : '⚡'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-white">{upgrade.name}</h3>
            {status.isPurchased && (
              <span className="text-green-400 text-xs font-semibold flex-shrink-0">
                Owned
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mb-2">{upgrade.description}</p>

          {/* Stat changes preview */}
          {primaryStatChange && !status.isPurchased && (
            <div className="text-xs text-blue-300 mb-2">
              {formatStatChange(
                getStatDisplayName(primaryStatChange[0]),
                getCurrentStatValue(primaryStatChange[0]),
                primaryStatChange[1]
              )}
            </div>
          )}

          {/* Prerequisites warning */}
          {status.isLocked && prerequisiteNames.length > 0 && (
            <div className="text-xs text-orange-400 mb-2">
              Requires: {prerequisiteNames.join(', ')}
            </div>
          )}

          {/* Cost and Purchase */}
          {!status.isPurchased && (
            <div className="flex items-center justify-between gap-2">
              <Tooltip content="Credits required to purchase this upgrade">
                <div className={`font-semibold text-xs ${
                  status.isAffordable ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {formatNumber(upgrade.cost)} 💳
                </div>
              </Tooltip>
              <Button
                variant={status.canPurchase ? 'primary' : 'secondary'}
                size="small"
                onClick={handlePurchase}
                disabled={!status.canPurchase}
                aria-label={`Purchase ${upgrade.name} for ${formatNumber(upgrade.cost)} credits`}
              >
                {status.isLocked ? 'Locked' : 'Buy'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
