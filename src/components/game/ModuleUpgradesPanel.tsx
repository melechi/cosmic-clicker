import React, { useState } from 'react';
import { useGame } from '@/context';
import { actions } from '@/context/actions';
import { useToast } from '@/hooks/useToast';
import { ModuleUpgradeTree } from './ModuleUpgradeTree';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { ModuleType } from '@/types';
import { MODULE_UPGRADES, getUpgradeById } from '@/constants/modules';

export interface ModuleUpgradesPanelProps {
  // This component reads from GameContext, no props needed
}

type ModuleTab = {
  id: ModuleType;
  name: string;
  icon: string;
  description: string;
};

const MODULE_TABS: ModuleTab[] = [
  {
    id: 'laser',
    name: 'Laser',
    icon: '🔫',
    description: 'Active mining tool - fire at objects to extract resources',
  },
  {
    id: 'botBay',
    name: 'Bot Bay',
    icon: '🤖',
    description: 'Idle mining - bots autonomously collect resources',
  },
  {
    id: 'converter',
    name: 'Converter',
    icon: '⚗️',
    description: 'Transform resources into fuel',
  },
  {
    id: 'cargoHold',
    name: 'Cargo',
    icon: '📦',
    description: 'Store collected resources',
  },
  {
    id: 'engine',
    name: 'Engine',
    icon: '🚀',
    description: 'Ship movement and fuel efficiency',
  },
  {
    id: 'jumpDrive',
    name: 'Jump Drive',
    icon: '🌀',
    description: 'Warp between zones',
  },
  {
    id: 'scanner',
    name: 'Scanner',
    icon: '📡',
    description: 'Detect objects, resources, and secrets',
  },
];

/**
 * Module Upgrades Panel
 * Tab-based navigation for 7 ship modules with upgrade trees
 */
export const ModuleUpgradesPanel: React.FC<ModuleUpgradesPanelProps> = () => {
  const { state, dispatch } = useGame();
  const toast = useToast();
  const [activeModule, setActiveModule] = useState<ModuleType>('laser');

  const currentModule = state.modules[activeModule];

  const handlePurchaseUpgrade = (upgradeId: string) => {
    const upgrade = getUpgradeById(upgradeId);
    if (!upgrade) {
      toast.error('Upgrade not found');
      return;
    }

    // Check if can afford
    if (state.credits < upgrade.cost) {
      toast.error('Not enough credits!');
      return;
    }

    // Dispatch purchase action
    dispatch(actions.purchaseModuleUpgrade(upgradeId));
    toast.success(`Purchased ${upgrade.name}!`);
  };

  // Get module stats for display
  const getModuleStats = (moduleType: ModuleType): string[] => {
    const module = state.modules[moduleType];
    const stats: string[] = [];

    switch (moduleType) {
      case 'laser':
        stats.push(`Damage: ${module.damage}`);
        stats.push(`Range: ${module.range}px`);
        stats.push(`Cooldown: ${module.cooldown}s`);
        stats.push(`Lasers: ${module.laserCount}`);
        if (module.autoTarget) stats.push('Auto-Targeting: ON');
        break;
      case 'botBay':
        stats.push(`Bots: ${module.botCount}`);
        if (module.botCount > 0) {
          stats.push(`Speed: ${module.miningSpeed}/s`);
          stats.push(`Range: ${module.range}px`);
          stats.push(`Capacity: ${module.botCapacity}`);
        }
        break;
      case 'converter':
        stats.push(`Speed: ${module.conversionSpeed}/s`);
        stats.push(`Efficiency: ${module.efficiencyPercent}%`);
        stats.push(`Auto-Convert: ${module.autoConvertPercent}%`);
        stats.push(`Unlocked Tiers: ${module.unlockedTiers.join(', ')}`);
        break;
      case 'cargoHold':
        stats.push(`Capacity: ${module.totalCapacity}`);
        stats.push(`Slots: ${module.resourceSlots}`);
        if (module.compressionRatio > 1) {
          stats.push(`Compression: ${module.compressionRatio}x`);
        }
        break;
      case 'engine':
        stats.push(`Efficiency: ${module.fuelEfficiencyPercent}%`);
        stats.push(`Tank: ${module.tankCapacity}`);
        stats.push(`Max Speed: ${module.maxSpeedUnlocked}`);
        if (module.regenerativeBraking) {
          stats.push(`Regen Braking: ${module.regenerativeBrakingPercent}%`);
        }
        break;
      case 'jumpDrive':
        stats.push(`Max Tier: ${module.maxZoneTier}`);
        stats.push(`Charge Time: ${module.chargeTime}s`);
        stats.push(`Fuel Cost: ${module.fuelCostPercent}%`);
        break;
      case 'scanner':
        stats.push(`Range: ${module.detectionRange}px`);
        if (module.resourceScanner) stats.push('Resource Scanner: ON');
        if (module.artifactDetector) stats.push('Artifact Detector: ON');
        break;
    }

    return stats;
  };

  const activeModuleTab = MODULE_TABS.find((tab) => tab.id === activeModule);
  const moduleStats = getModuleStats(activeModule);

  return (
    <div className="space-y-4">
      {/* Header with credits display */}
      <Card className="bg-gray-900 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Module Upgrades</h2>
            <p className="text-sm text-gray-400">Purchase upgrades with credits to enhance your ship</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Available Credits</p>
            <p className="text-2xl font-bold text-yellow-400">{formatNumber(state.credits)} 💳</p>
          </div>
        </div>
      </Card>

      {/* Module tabs */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {MODULE_TABS.map((tab) => {
          const module = state.modules[tab.id];
          const purchasedCount = module.purchasedUpgrades.length;
          const totalUpgrades = MODULE_UPGRADES.filter((u) => u.moduleType === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeModule === tab.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <div className="text-xs font-semibold text-white">{tab.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {purchasedCount}/{totalUpgrades}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active module info */}
      {activeModuleTab && (
        <Card className="bg-gray-900">
          <div className="flex items-start gap-3">
            <div className="text-4xl">{activeModuleTab.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{activeModuleTab.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{activeModuleTab.description}</p>

              {/* Current stats */}
              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-300 uppercase mb-2">Current Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  {moduleStats.map((stat, index) => (
                    <div key={index} className="text-xs text-gray-400">
                      {stat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Upgrade tree */}
      <div className="bg-gray-900 rounded-lg p-4">
        <ModuleUpgradeTree
          moduleType={activeModule}
          module={currentModule}
          allUpgrades={MODULE_UPGRADES}
          credits={state.credits}
          onPurchase={handlePurchaseUpgrade}
        />
      </div>
    </div>
  );
};
