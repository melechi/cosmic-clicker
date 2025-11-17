import React, { useMemo, useState } from 'react';
import { useGame } from '@/context';
import { useToast } from '@/hooks/useToast';
import { actions } from '@/context/actions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ResourceDisplay } from './ResourceDisplay';
import { formatNumber } from '@/utils/formatting/numberFormat';
import { calculateTotalCargo } from '@/utils/gameLogic/resourceConversion';
import { RESOURCES } from '@/constants/resources';
import type { ResourceType } from '@/types';

/**
 * Cargo Hold Panel - Display all collected resources with convert/sell actions
 */
export const CargoHoldPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const toast = useToast();
  const [showDetails, setShowDetails] = useState(false);

  // Calculate cargo usage
  const currentCargo = useMemo(() => calculateTotalCargo(state.resources), [state.resources]);
  const maxCargo = state.modules.cargoHold.totalCapacity;
  const cargoPercent = (currentCargo / maxCargo) * 100;

  // Get resources with amounts > 0, grouped by tier
  const resourcesByTier = useMemo(() => {
    const tiers: Record<number, Array<{ type: ResourceType; amount: number }>> = {
      1: [],
      2: [],
      3: [],
      4: [],
    };

    RESOURCES.forEach((resource) => {
      const amount = state.resources[resource.id as ResourceType] || 0;
      if (amount > 0) {
        tiers[resource.tier].push({
          type: resource.id as ResourceType,
          amount,
        });
      }
    });

    return tiers;
  }, [state.resources]);

  // Check if any resources exist
  const hasResources = currentCargo > 0;
  const isCargoFull = currentCargo >= maxCargo;

  // Handler for converting a single resource
  const handleConvert = (resourceType: ResourceType, amount: number) => {
    const currentAmount = state.resources[resourceType] || 0;
    if (currentAmount < amount) {
      toast.error('Not enough resources to convert!');
      return;
    }

    dispatch(actions.convertResources(resourceType, amount));
    toast.success(`Converted ${amount} ${resourceType} to fuel!`);
  };

  // Handler for selling a single resource
  const handleSell = (resourceType: ResourceType, amount: number) => {
    const currentAmount = state.resources[resourceType] || 0;
    if (currentAmount < amount) {
      toast.error('Not enough resources to sell!');
      return;
    }

    dispatch(actions.sellResources(resourceType, amount));
    toast.success(`Sold ${amount} ${resourceType} for credits!`);
  };

  // Handler for converting all resources of a type
  const handleConvertAll = (resourceType: ResourceType) => {
    const amount = state.resources[resourceType] || 0;
    if (amount === 0) return;

    handleConvert(resourceType, amount);
  };

  // Handler for selling all resources of a type
  const handleSellAll = (resourceType: ResourceType) => {
    const amount = state.resources[resourceType] || 0;
    if (amount === 0) return;

    handleSell(resourceType, amount);
  };

  // Handler for converting ALL resources in cargo
  const handleConvertAllCargo = () => {
    if (!hasResources) return;

    let totalConverted = 0;
    RESOURCES.forEach((resource) => {
      const amount = state.resources[resource.id as ResourceType] || 0;
      if (amount > 0) {
        dispatch(actions.convertResources(resource.id as ResourceType, amount));
        totalConverted += amount;
      }
    });

    toast.success(`Converted all cargo (${totalConverted} resources) to fuel!`, { duration: 4000 });
  };

  // Handler for selling ALL resources in cargo
  const handleSellAllCargo = () => {
    if (!hasResources) return;

    let totalSold = 0;
    RESOURCES.forEach((resource) => {
      const amount = state.resources[resource.id as ResourceType] || 0;
      if (amount > 0) {
        dispatch(actions.sellResources(resource.id as ResourceType, amount));
        totalSold += amount;
      }
    });

    toast.success(`Sold all cargo (${totalSold} resources) for credits!`, { duration: 4000 });
  };

  // Render tier section
  const renderTierSection = (tier: number) => {
    const resources = resourcesByTier[tier];
    if (resources.length === 0) return null;

    return (
      <div key={tier} className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Tier {tier} Resources
        </h4>
        {resources.map(({ type, amount }) => (
          <div key={type} className="space-y-2">
            <ResourceDisplay
              resourceType={type}
              amount={amount}
              showDetails={showDetails}
              compact={false}
            />
            <div className="flex gap-2">
              <Button
                size="small"
                variant="primary"
                onClick={() => handleConvertAll(type)}
                className="flex-1"
                aria-label={`Convert all ${type}`}
              >
                Convert All
              </Button>
              <Button
                size="small"
                variant="success"
                onClick={() => handleSellAll(type)}
                className="flex-1"
                aria-label={`Sell all ${type}`}
              >
                Sell All
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card title="Cargo Hold" className="h-full flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Cargo capacity bar */}
        <div>
          <ProgressBar
            value={currentCargo}
            max={maxCargo}
            label="Cargo Capacity"
            showPercentage={false}
            variant={isCargoFull ? 'danger' : cargoPercent > 80 ? 'warning' : 'primary'}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>
              {formatNumber(currentCargo, 0)} / {formatNumber(maxCargo, 0)} units
            </span>
            <span>{cargoPercent.toFixed(0)}% Full</span>
          </div>
          {isCargoFull && (
            <div className="text-xs text-red-400 mt-2 font-semibold">
              Cargo is full! Convert or sell resources to make space.
            </div>
          )}
        </div>

        {/* Toggle details button */}
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-300">Resources</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Resources list or empty state */}
        {!hasResources ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-center">Cargo hold is empty</p>
            <p className="text-xs text-center mt-1">
              Mine asteroids and debris to collect resources
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Render resources by tier */}
            {renderTierSection(1)}
            {renderTierSection(2)}
            {renderTierSection(3)}
            {renderTierSection(4)}
          </div>
        )}
      </div>

      {/* Bulk actions at bottom */}
      {hasResources && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
          <div className="text-xs text-gray-500 mb-2">Bulk Actions</div>
          <div className="flex gap-2">
            <Button
              size="medium"
              variant="primary"
              onClick={handleConvertAllCargo}
              fullWidth
              aria-label="Convert all cargo to fuel"
            >
              Convert All to Fuel
            </Button>
            <Button
              size="medium"
              variant="success"
              onClick={handleSellAllCargo}
              fullWidth
              aria-label="Sell all cargo for credits"
            >
              Sell All for Credits
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
