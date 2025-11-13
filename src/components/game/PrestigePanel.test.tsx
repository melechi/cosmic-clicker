import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrestigePanel } from './PrestigePanel';

describe('PrestigePanel', () => {
  it('should render header and description', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={0}
        currentNebulaCrystals={0}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText('Prestige')).toBeInTheDocument();
    expect(screen.getByText(/reset your progress to gain powerful nebula crystals/i)).toBeInTheDocument();
  });

  it('should display current status', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={5000000}
        currentNebulaCrystals={10}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={10}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument(); // crystals
    expect(screen.getByText('+10%')).toBeInTheDocument(); // bonus
    expect(screen.getByText('5.00M')).toBeInTheDocument(); // total stardust
  });

  it('should show how prestige works section', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={0}
        currentNebulaCrystals={0}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText('How Prestige Works')).toBeInTheDocument();
    expect(screen.getByText(/minimum requirement: 1m total stardust earned/i)).toBeInTheDocument();
  });

  it('should show progress when cannot prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={500000}
        currentNebulaCrystals={0}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText('Progress to Prestige')).toBeInTheDocument();
    expect(screen.getByText(/500K \/ 1\.00M/)).toBeInTheDocument();
  });

  it('should not show progress when can prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={2000000}
        currentNebulaCrystals={0}
        crystalsToGain={1}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.queryByText('Progress to Prestige')).not.toBeInTheDocument();
  });

  it('should show confirmation modal when prestige clicked', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={2000000}
        currentNebulaCrystals={0}
        crystalsToGain={1}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    await user.click(screen.getByRole('button', { name: /prestige to gain/i }));

    expect(screen.getByText('Confirm Prestige')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to prestige/i)).toBeInTheDocument();
  });

  it('should call onPrestige when confirmed', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={2000000}
        currentNebulaCrystals={0}
        crystalsToGain={1}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    // Open modal
    await user.click(screen.getByRole('button', { name: /prestige to gain/i }));

    // Confirm
    const confirmButtons = screen.getAllByRole('button', { name: /prestige/i });
    const confirmButton = confirmButtons.find((btn) => btn.textContent === 'Prestige');
    if (confirmButton) {
      await user.click(confirmButton);
    }

    expect(mockOnPrestige).toHaveBeenCalledTimes(1);
  });

  it('should not call onPrestige when cancelled', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={2000000}
        currentNebulaCrystals={0}
        crystalsToGain={1}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    // Open modal
    await user.click(screen.getByRole('button', { name: /prestige to gain/i }));

    // Cancel
    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockOnPrestige).not.toHaveBeenCalled();
  });

  it('should close modal after confirmation', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={2000000}
        currentNebulaCrystals={0}
        crystalsToGain={1}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    // Open modal
    await user.click(screen.getByRole('button', { name: /prestige to gain/i }));
    expect(screen.getByText('Confirm Prestige')).toBeInTheDocument();

    // Confirm
    const confirmButtons = screen.getAllByRole('button', { name: /prestige/i });
    const confirmButton = confirmButtons.find((btn) => btn.textContent === 'Prestige');
    if (confirmButton) {
      await user.click(confirmButton);
    }

    expect(screen.queryByText('Confirm Prestige')).not.toBeInTheDocument();
  });

  it('should show crystals to gain in modal', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={10000000}
        currentNebulaCrystals={0}
        crystalsToGain={3}
        canPrestige={true}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    await user.click(screen.getByRole('button', { name: /prestige to gain/i }));

    expect(screen.getByText('+3 Nebula Crystals')).toBeInTheDocument();
    expect(screen.getByText('(+3% production bonus)')).toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', () => {
    const mockOnPrestige = vi.fn();
    const { container } = render(
      <PrestigePanel
        totalStardustEarned={500000}
        currentNebulaCrystals={0}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // 500K / 1M = 50%
  });

  it('should show amount needed to prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigePanel
        totalStardustEarned={300000}
        currentNebulaCrystals={0}
        crystalsToGain={0}
        canPrestige={false}
        productionBonus={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText(/you need 700K more total stardust/i)).toBeInTheDocument();
  });
});
