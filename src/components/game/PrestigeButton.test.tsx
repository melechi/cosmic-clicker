import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrestigeButton } from './PrestigeButton';

describe('PrestigeButton', () => {
  it('should render prestige button', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByRole('button', { name: /prestige/i })).toBeInTheDocument();
    expect(screen.getByText('PRESTIGE')).toBeInTheDocument();
  });

  it('should show crystals to gain when can prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText(/gain 10 nebula crystals/i)).toBeInTheDocument();
  });

  it('should show not available message when cannot prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText('Not available yet')).toBeInTheDocument();
  });

  it('should call onPrestige when button clicked and can prestige', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
      />
    );

    await user.click(screen.getByRole('button', { name: /prestige/i }));

    expect(mockOnPrestige).toHaveBeenCalledTimes(1);
  });

  it('should not call onPrestige when cannot prestige', async () => {
    const user = userEvent.setup();
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    await user.click(screen.getByRole('button', { name: /prestige/i }));

    expect(mockOnPrestige).not.toHaveBeenCalled();
  });

  it('should disable button when cannot prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByRole('button', { name: /prestige/i })).toBeDisabled();
  });

  it('should enable button when can prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByRole('button', { name: /prestige/i })).not.toBeDisabled();
  });

  it('should disable button when disabled prop is true', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
        disabled={true}
      />
    );

    expect(screen.getByRole('button', { name: /prestige/i })).toBeDisabled();
  });

  it('should format large crystal amounts correctly', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={1000000}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByText(/gain 1\.00m nebula crystals/i)).toBeInTheDocument();
  });

  it('should have accessible label', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
      />
    );

    expect(
      screen.getByLabelText('Prestige to gain 10 Nebula Crystals')
    ).toBeInTheDocument();
  });

  it('should have accessible label when cannot prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    expect(screen.getByLabelText('Prestige not available yet')).toBeInTheDocument();
  });

  it('should apply pulse animation when can prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={true}
        crystalsToGain={10}
        onPrestige={mockOnPrestige}
      />
    );

    const button = screen.getByRole('button', { name: /prestige/i });
    expect(button).toHaveClass('animate-pulse');
  });

  it('should not apply pulse animation when cannot prestige', () => {
    const mockOnPrestige = vi.fn();
    render(
      <PrestigeButton
        canPrestige={false}
        crystalsToGain={0}
        onPrestige={mockOnPrestige}
      />
    );

    const button = screen.getByRole('button', { name: /prestige/i });
    expect(button).not.toHaveClass('animate-pulse');
  });
});
