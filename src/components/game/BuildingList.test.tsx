import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuildingList } from './BuildingList';
import type { Building } from '@/types';

const mockBuildings: Building[] = [
  {
    id: 'spaceMiner',
    name: 'Space Miner',
    description: 'Small drones',
    baseCost: 10,
    costMultiplier: 1.15,
    production: 0.1,
    tier: 1,
  },
  {
    id: 'asteroidHarvester',
    name: 'Asteroid Harvester',
    description: 'Automated facilities',
    baseCost: 100,
    costMultiplier: 1.15,
    production: 1,
    tier: 2,
  },
];

describe('BuildingList', () => {
  it('should render all buildings', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{}}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={1000}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    expect(screen.getByText('Space Miner')).toBeInTheDocument();
    expect(screen.getByText('Asteroid Harvester')).toBeInTheDocument();
  });

  it('should render header and description', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{}}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={1000}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    expect(screen.getByText('Buildings')).toBeInTheDocument();
    expect(
      screen.getByText(/purchase buildings to automatically generate stardust/i)
    ).toBeInTheDocument();
  });

  it('should pass correct props to BuildingItem', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{ spaceMiner: 5 }}
        currentCosts={{ spaceMiner: 15, asteroidHarvester: 100 }}
        stardust={50}
        onPurchase={mockOnPurchase}
        productionByBuilding={{ spaceMiner: 0.5 }}
      />
    );

    expect(screen.getByText('(5)')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should determine affordability correctly', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{}}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={50}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    // Space Miner should be affordable (costs 10, have 50)
    const spaceMinerButton = screen.getByRole('button', { name: /purchase space miner/i });
    expect(spaceMinerButton).not.toBeDisabled();

    // Asteroid Harvester should not be affordable (costs 100, have 50)
    const harvesterButton = screen.getByRole('button', { name: /purchase asteroid harvester/i });
    expect(harvesterButton).toBeDisabled();
  });

  it('should call onPurchase with correct building id', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{}}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={1000}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase space miner/i }));
    expect(mockOnPurchase).toHaveBeenCalledWith('spaceMiner');

    await user.click(screen.getByRole('button', { name: /purchase asteroid harvester/i }));
    expect(mockOnPurchase).toHaveBeenCalledWith('asteroidHarvester');

    expect(mockOnPurchase).toHaveBeenCalledTimes(2);
  });

  it('should render empty state when no buildings', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={[]}
        ownedCounts={{}}
        currentCosts={{}}
        stardust={0}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    expect(screen.getByText('No buildings available')).toBeInTheDocument();
  });

  it('should handle missing owned counts', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{}}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={1000}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    // Should show (0) for buildings with no owned count
    const ownedCounts = screen.getAllByText('(0)');
    expect(ownedCounts).toHaveLength(2);
  });

  it('should handle missing production values', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingList
        buildings={mockBuildings}
        ownedCounts={{ spaceMiner: 1 }}
        currentCosts={{ spaceMiner: 10, asteroidHarvester: 100 }}
        stardust={1000}
        onPurchase={mockOnPurchase}
        productionByBuilding={{}}
      />
    );

    // Should not crash when production is missing
    expect(screen.getByText('Space Miner')).toBeInTheDocument();
  });
});
