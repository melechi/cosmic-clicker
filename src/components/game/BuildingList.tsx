import React from 'react';
import { BuildingItem } from './BuildingItem';
import type { Building } from '@/types';

export interface BuildingListProps {
  buildings: Building[];
  ownedCounts: Record<string, number>;
  currentCosts: Record<string, number>;
  stardust: number;
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
  stardust,
  onPurchase,
  productionByBuilding,
}) => {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Buildings</h2>
        <p className="text-gray-400 text-sm">
          Purchase buildings to automatically generate stardust over time
        </p>
      </div>

      {buildings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No buildings available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {buildings.map((building) => {
            const owned = ownedCounts[building.id] || 0;
            const currentCost = currentCosts[building.id] || building.baseCost;
            const canAfford = stardust >= currentCost;
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
