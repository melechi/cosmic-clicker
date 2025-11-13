import React, { useState } from 'react';
import { UpgradeItem } from './UpgradeItem';
import { Button } from '@/components/ui/Button';
import type { AnyUpgrade } from '@/types';

export interface UpgradesPanelProps {
  clickUpgrades: AnyUpgrade[];
  productionUpgrades: AnyUpgrade[];
  autoClickUpgrades: AnyUpgrade[];
  prestigeUpgrades: AnyUpgrade[];
  purchasedUpgrades: Set<string>;
  stardust: number;
  onPurchase: (upgradeId: string) => void;
}

type UpgradeTab = 'all' | 'click' | 'production' | 'autoClick' | 'prestige';

/**
 * Tabbed panel for displaying and purchasing upgrades
 */
export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  clickUpgrades,
  productionUpgrades,
  autoClickUpgrades,
  prestigeUpgrades,
  purchasedUpgrades,
  stardust,
  onPurchase,
}) => {
  const [activeTab, setActiveTab] = useState<UpgradeTab>('all');

  const allUpgrades = [
    ...clickUpgrades,
    ...productionUpgrades,
    ...autoClickUpgrades,
    ...prestigeUpgrades,
  ];

  const getUpgradesByTab = (tab: UpgradeTab): AnyUpgrade[] => {
    switch (tab) {
      case 'click':
        return clickUpgrades;
      case 'production':
        return productionUpgrades;
      case 'autoClick':
        return autoClickUpgrades;
      case 'prestige':
        return prestigeUpgrades;
      case 'all':
      default:
        return allUpgrades;
    }
  };

  const upgradesToShow = getUpgradesByTab(activeTab);

  // Filter: show available upgrades first, then purchased ones
  const availableUpgrades = upgradesToShow.filter((u) => !purchasedUpgrades.has(u.id));
  const purchasedUpgradesList = upgradesToShow.filter((u) => purchasedUpgrades.has(u.id));

  const tabs: { id: UpgradeTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: allUpgrades.length },
    { id: 'click', label: 'Click', count: clickUpgrades.length },
    { id: 'production', label: 'Production', count: productionUpgrades.length },
    { id: 'autoClick', label: 'Auto-Click', count: autoClickUpgrades.length },
    { id: 'prestige', label: 'Prestige', count: prestigeUpgrades.length },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Upgrades</h2>
        <p className="text-gray-400 text-sm">
          Purchase permanent upgrades to boost your production
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab(tab.id)}
            aria-label={`${tab.label} upgrades tab`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      {/* Upgrades List */}
      {upgradesToShow.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No upgrades available in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Available Upgrades */}
          {availableUpgrades.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Available
              </h3>
              {availableUpgrades.map((upgrade) => (
                <UpgradeItem
                  key={upgrade.id}
                  upgrade={upgrade}
                  isPurchased={false}
                  canAfford={stardust >= upgrade.cost}
                  onPurchase={onPurchase}
                />
              ))}
            </>
          )}

          {/* Purchased Upgrades */}
          {purchasedUpgradesList.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-6">
                Purchased
              </h3>
              {purchasedUpgradesList.map((upgrade) => (
                <UpgradeItem
                  key={upgrade.id}
                  upgrade={upgrade}
                  isPurchased={true}
                  canAfford={false}
                  onPurchase={onPurchase}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
