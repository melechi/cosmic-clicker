import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuildingItem } from './BuildingItem';
import type { Building } from '@/types';

const mockBuilding: Building = {
  id: 'spaceMiner',
  name: 'Space Miner',
  description: 'Small drones that collect stardust automatically',
  baseCost: 10,
  costMultiplier: 1.15,
  production: 0.1,
  tier: 1,
};

describe('BuildingItem', () => {
  it('should render building name and description', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(screen.getByText('Space Miner')).toBeInTheDocument();
    expect(screen.getByText('Small drones that collect stardust automatically')).toBeInTheDocument();
  });

  it('should render owned count', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={5}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0.5}
      />
    );

    expect(screen.getByText('(5)')).toBeInTheDocument();
  });

  it('should render base production', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(screen.getByText('+0.1/s each')).toBeInTheDocument();
  });

  it('should render total production when owned > 0', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={10}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={1.0}
      />
    );

    expect(screen.getByText(/total: 1/i)).toBeInTheDocument();
  });

  it('should not render total production when owned = 0', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(screen.queryByText(/total:/i)).not.toBeInTheDocument();
  });

  it('should render current cost', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={1234}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(screen.getByText('1.23K')).toBeInTheDocument();
  });

  it('should render tier', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(screen.getByText('Tier 1')).toBeInTheDocument();
  });

  it('should call onPurchase when buy button clicked', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase space miner/i }));

    expect(mockOnPurchase).toHaveBeenCalledWith('spaceMiner');
    expect(mockOnPurchase).toHaveBeenCalledTimes(1);
  });

  it('should disable button when cannot afford', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={1000}
        canAfford={false}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    const button = screen.getByRole('button', { name: /purchase space miner/i });
    expect(button).toBeDisabled();
  });

  it('should not call onPurchase when button disabled', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={1000}
        canAfford={false}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase space miner/i }));

    expect(mockOnPurchase).not.toHaveBeenCalled();
  });

  it('should have accessible button label', () => {
    const mockOnPurchase = vi.fn();
    render(
      <BuildingItem
        building={mockBuilding}
        owned={0}
        currentCost={10}
        canAfford={true}
        onPurchase={mockOnPurchase}
        totalProduction={0}
      />
    );

    expect(
      screen.getByLabelText('Purchase Space Miner for 10 stardust')
    ).toBeInTheDocument();
  });
});
