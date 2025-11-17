import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpgradeItem } from './UpgradeItem';
import type { ClickUpgrade } from '@/types';

const mockUpgrade: ClickUpgrade = {
  id: 'improvedCollectors',
  name: 'Improved Collectors',
  description: 'Double your click power',
  cost: 100,
  type: 'click',
  multiplier: 2,
};

describe('UpgradeItem', () => {
  it('should render upgrade name and description', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('Improved Collectors')).toBeInTheDocument();
    expect(screen.getByText('Double your click power')).toBeInTheDocument();
  });

  it('should render cost when not purchased', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('100 SD')).toBeInTheDocument();
  });

  it('should not render cost when purchased', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={true}
        canAfford={false}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.queryByText('100 SD')).not.toBeInTheDocument();
  });

  it('should show owned badge when purchased', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={true}
        canAfford={false}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText('✓ Owned')).toBeInTheDocument();
  });

  it('should call onPurchase when buy button clicked', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase improved collectors/i }));

    expect(mockOnPurchase).toHaveBeenCalledWith('improvedCollectors');
    expect(mockOnPurchase).toHaveBeenCalledTimes(1);
  });

  it('should have clickable card when affordable and not purchased', () => {
    const mockOnPurchase = vi.fn();
    const { container } = render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    const card = container.querySelector('.cursor-pointer');
    expect(card).toBeInTheDocument();
  });

  it('should disable button when cannot afford', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={false}
        onPurchase={mockOnPurchase}
      />
    );

    const button = screen.getByRole('button', { name: /purchase improved collectors/i });
    expect(button).toBeDisabled();
  });

  it('should not call onPurchase when already purchased', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    const { container } = render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={true}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    const card = container.firstChild;
    if (card) {
      await user.click(card as HTMLElement);
      expect(mockOnPurchase).not.toHaveBeenCalled();
    }
  });

  it('should not call onPurchase when cannot afford', async () => {
    const user = userEvent.setup();
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={false}
        onPurchase={mockOnPurchase}
      />
    );

    await user.click(screen.getByRole('button', { name: /purchase improved collectors/i }));

    expect(mockOnPurchase).not.toHaveBeenCalled();
  });

  it('should render correct icon for click upgrade', () => {
    const mockOnPurchase = vi.fn();
    const { container } = render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(container.textContent).toContain('👆');
  });

  it('should render correct icon for production upgrade', () => {
    const mockOnPurchase = vi.fn();
    const productionUpgrade = { ...mockUpgrade, type: 'production' as const };
    const { container } = render(
      <UpgradeItem
        upgrade={productionUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(container.textContent).toContain('📈');
  });

  it('should format large costs correctly', () => {
    const mockOnPurchase = vi.fn();
    const expensiveUpgrade = { ...mockUpgrade, cost: 1000000 };
    render(
      <UpgradeItem
        upgrade={expensiveUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(screen.getByText(/1M SD/i)).toBeInTheDocument();
  });

  it('should have accessible button label', () => {
    const mockOnPurchase = vi.fn();
    render(
      <UpgradeItem
        upgrade={mockUpgrade}
        isPurchased={false}
        canAfford={true}
        onPurchase={mockOnPurchase}
      />
    );

    expect(
      screen.getByLabelText('Purchase Improved Collectors for 100 stardust')
    ).toBeInTheDocument();
  });
});
