import React from 'react';
import { BuildingItem } from './BuildingItem';
import type { Building } from '@/types';

export interface BuildingListProps {
  buildings: Building[];
  ownedCounts: Record<string, number>;
  currentCosts: Record<string, number>;
  fuel: number;
  onPurchase: (buildingId: string) => void;
  productionByBuilding: Record<string, number>;
}

/**
 * List of all available buildings
 */
export const BuildingList: React.FC<BuildingListProps> = ({
  buildings,
  ownedCounts,
  currentCosts,
  fuel,
  onPurchase,
  productionByBuilding,
}) => {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Ship Modules</h2>
        <p className="text-gray-400 text-sm">
          Purchase modules to automatically generate fuel over time
        </p>
      </div>

      {buildings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No modules available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buildings.map((building) => {
            const owned = ownedCounts[building.id] || 0;
            const currentCost = currentCosts[building.id] || building.baseCost;
            const canAfford = fuel >= currentCost;
            const totalProduction = productionByBuilding[building.id] || 0;

            return (
              <BuildingItem
                key={building.id}
                building={building}
                owned={owned}
                currentCost={currentCost}
                canAfford={canAfford}
                onPurchase={onPurchase}
                totalProduction={totalProduction}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
