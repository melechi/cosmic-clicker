import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpgradesPanel } from './UpgradesPanel';
import type { ClickUpgrade, ProductionUpgrade, AutoClickUpgrade } from '@/types';

const clickUpgrade: ClickUpgrade = {
  id: 'improvedCollectors',
  name: 'Improved Collectors',
  description: 'Double your click power',
  cost: 100,
  type: 'click',
  multiplier: 2,
};

const productionUpgrade: ProductionUpgrade = {
  id: 'efficientProduction',
  name: 'Efficient Production',
  description: 'All buildings produce 50% more',
  cost: 5000,
  type: 'production',
  multiplier: 1.5,
};

const autoClickUpgrade: AutoClickUpgrade = {
  id: 'basicAutoClicker',
  name: 'Basic Auto-Clicker',
  description: 'Auto-clicks 1 time per second',
  cost: 1000,
  type: 'autoClick',
  clicksPerSecond: 1,
};

describe('UpgradesPanel', () => {
  it('should render header and description', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[]}
        productionUpgrades={[]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={0}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('Upgrades')).toBeInTheDocument();
    expect(screen.getByText(/purchase permanent upgrades/i)).toBeInTheDocument();
  });

  it('should render all tab buttons', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[productionUpgrade]}
        autoClickUpgrades={[autoClickUpgrade]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={0}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByLabelText('All upgrades tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Click upgrades tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Production upgrades tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Auto-Click upgrades tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Prestige upgrades tab')).toBeInTheDocument();
  });

  it('should show correct counts in tabs', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[productionUpgrade]}
        autoClickUpgrades={[autoClickUpgrade]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={0}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('All (3)')).toBeInTheDocument();
    expect(screen.getByText('Click (1)')).toBeInTheDocument();
    expect(screen.getByText('Production (1)')).toBeInTheDocument();
    expect(screen.getByText('Auto-Click (1)')).toBeInTheDocument();
    expect(screen.getByText('Prestige (0)')).toBeInTheDocument();
  });

  it('should switch tabs when clicked', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[productionUpgrade]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={10000}
        onPurchase={mockOnPurchase}
      />
    );

    // Initially on "All" tab, should see both upgrades
    expect(screen.getByText('Improved Collectors')).toBeInTheDocument();
    expect(screen.getByText('Efficient Production')).toBeInTheDocument();

    // Switch to "Click" tab
    await user.click(screen.getByLabelText('Click upgrades tab'));
    expect(screen.getByText('Improved Collectors')).toBeInTheDocument();
    expect(screen.queryByText('Efficient Production')).not.toBeInTheDocument();

    // Switch to "Production" tab
    await user.click(screen.getByLabelText('Production upgrades tab'));
    expect(screen.queryByText('Improved Collectors')).not.toBeInTheDocument();
    expect(screen.getByText('Efficient Production')).toBeInTheDocument();
  });

  it('should separate available and purchased upgrades', () => {
    const mockOnPurchase = vi.fn();
    const purchasedUpgrades = new Set(['improvedCollectors']);

    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[productionUpgrade]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={purchasedUpgrades}
        stardust={10000}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Purchased')).toBeInTheDocument();
  });

  it('should show purchased badge on owned upgrades', () => {
    const mockOnPurchase = vi.fn();
    const purchasedUpgrades = new Set(['improvedCollectors']);

    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={purchasedUpgrades}
        stardust={10000}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('✓ Owned')).toBeInTheDocument();
  });

  it('should call onPurchase when upgrade purchased', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={1000}
        onPurchase={mockOnPurchase}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase improved collectors/i }));

    expect(mockOnPurchase).toHaveBeenCalledWith('improvedCollectors');
  });

  it('should show empty state when no upgrades in category', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={0}
        onPurchase={mockOnPurchase}
      />
    );

    await user.click(screen.getByLabelText('Production upgrades tab'));

    expect(screen.getByText('No upgrades available in this category')).toBeInTheDocument();
  });

  it('should highlight active tab', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradesPanel
        clickUpgrades={[clickUpgrade]}
        productionUpgrades={[]}
        autoClickUpgrades={[]}
        prestigeUpgrades={[]}
        purchasedUpgrades={new Set()}
        stardust={0}
        onPurchase={mockOnPurchase}
      />
    );

    const clickTab = screen.getByLabelText('Click upgrades tab');
    expect(clickTab).not.toHaveAttribute('aria-current', 'page');

    await user.click(clickTab);
    expect(clickTab).toHaveAttribute('aria-current', 'page');
  });
});
