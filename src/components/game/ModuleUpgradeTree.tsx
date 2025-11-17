import React, { useMemo } from 'react';
import { ModuleUpgradeItem } from './ModuleUpgradeItem';
import type { ModuleUpgrade } from '@/constants/modules';
import type { ModuleType, BaseModule } from '@/types';
import {
  getAvailableUpgrades,
  sortUpgradesByTier,
  groupUpgradesByCategory,
} from '@/utils/gameLogic/moduleUpgrades';

export interface ModuleUpgradeTreeProps {
  moduleType: ModuleType;
  module: BaseModule;
  allUpgrades: ModuleUpgrade[];
  credits: number;
  onPurchase: (upgradeId: string) => void;
}

/**
 * Display all upgrades for a single module
 * Organized by category with visual hierarchy
 */
export const ModuleUpgradeTree: React.FC<ModuleUpgradeTreeProps> = ({
  moduleType,
  module,
  allUpgrades,
  credits,
  onPurchase,
}) => {
  // Get upgrades for this module
  const moduleUpgrades = useMemo(
    () => getAvailableUpgrades(moduleType, allUpgrades),
    [moduleType, allUpgrades]
  );

  // Group by category
  const groupedUpgrades = useMemo(
    () => groupUpgradesByCategory(moduleUpgrades),
    [moduleUpgrades]
  );

  // Sort within each category
  const sortedCategories = useMemo(() => {
    const categories: Record<string, ModuleUpgrade[]> = {};
    Object.entries(groupedUpgrades).forEach(([category, upgrades]) => {
      categories[category] = sortUpgradesByTier(upgrades);
    });
    return categories;
  }, [groupedUpgrades]);

  if (moduleUpgrades.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No upgrades available for this module yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* If we have categories, show them grouped */}
      {Object.entries(sortedCategories).length > 1 ? (
        Object.entries(sortedCategories).map(([category, upgrades]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide border-b border-gray-700 pb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {upgrades.map((upgrade) => (
                <ModuleUpgradeItem
                  key={upgrade.id}
                  upgrade={upgrade}
                  module={module}
                  credits={credits}
                  onPurchase={onPurchase}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        // If only one category, show flat list
        <div className="grid grid-cols-1 gap-3">
          {sortUpgradesByTier(moduleUpgrades).map((upgrade) => (
            <ModuleUpgradeItem
              key={upgrade.id}
              upgrade={upgrade}
              module={module}
              credits={credits}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      )}
    </div>
  );
};
