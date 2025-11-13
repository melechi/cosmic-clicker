import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementItem } from './AchievementItem';
import type { Achievement } from '@/types';

const mockAchievement: Achievement = {
  id: 'firstClick',
  name: 'First Click',
  description: 'Click the cosmic button for the first time',
  category: 'click',
  condition: 'totalClicks',
  threshold: 1,
  bonus: 0.1,
};

describe('AchievementItem', () => {
  it('should render achievement name and description', () => {
    render(
      <AchievementItem achievement={mockAchievement} isUnlocked={false} currentProgress={0} />
    );

    expect(screen.getByText('First Click')).toBeInTheDocument();
    expect(screen.getByText('Click the cosmic button for the first time')).toBeInTheDocument();
  });

  it('should show unlocked badge when achievement is unlocked', () => {
    render(
      <AchievementItem achievement={mockAchievement} isUnlocked={true} currentProgress={1} />
    );

    expect(screen.getByText('✓ Unlocked')).toBeInTheDocument();
  });

  it('should not show unlocked badge when achievement is locked', () => {
    render(
      <AchievementItem achievement={mockAchievement} isUnlocked={false} currentProgress={0} />
    );

    expect(screen.queryByText('✓ Unlocked')).not.toBeInTheDocument();
  });

  it('should show progress when not unlocked', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 100,
    };

    render(<AchievementItem achievement={achievement} isUnlocked={false} currentProgress={50} />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('50 / 100')).toBeInTheDocument();
  });

  it('should not show progress when unlocked', () => {
    render(
      <AchievementItem achievement={mockAchievement} isUnlocked={true} currentProgress={1} />
    );

    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
  });

  it('should show bonus when available', () => {
    render(
      <AchievementItem achievement={mockAchievement} isUnlocked={false} currentProgress={0} />
    );

    expect(screen.getByText(/bonus:/i)).toBeInTheDocument();
  });

  it('should not show bonus section when bonus is 0', () => {
    const achievementNoBonus: Achievement = {
      ...mockAchievement,
      bonus: 0,
    };

    render(
      <AchievementItem
        achievement={achievementNoBonus}
        isUnlocked={false}
        currentProgress={0}
      />
    );

    expect(screen.queryByText(/bonus:/i)).not.toBeInTheDocument();
  });

  it('should calculate progress percentage correctly', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 100,
    };

    const { container } = render(
      <AchievementItem achievement={achievement} isUnlocked={false} currentProgress={75} />
    );

    const progressBar = container.querySelector('[aria-valuenow="75"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle 0% progress', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 100,
    };

    const { container } = render(
      <AchievementItem achievement={achievement} isUnlocked={false} currentProgress={0} />
    );

    const progressBar = container.querySelector('[aria-valuenow="0"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 100,
    };

    const { container } = render(
      <AchievementItem achievement={achievement} isUnlocked={false} currentProgress={100} />
    );

    const progressBar = container.querySelector('[aria-valuenow="100"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply unlocked styling', () => {
    const { container } = render(
      <AchievementItem achievement={mockAchievement} isUnlocked={true} currentProgress={1} />
    );

    const card = container.querySelector('.border-yellow-500\\/50');
    expect(card).toBeInTheDocument();
  });

  it('should apply locked styling', () => {
    const { container } = render(
      <AchievementItem achievement={mockAchievement} isUnlocked={false} currentProgress={0} />
    );

    const card = container.querySelector('.opacity-75');
    expect(card).toBeInTheDocument();
  });

  it('should format large numbers in progress', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 1000000,
    };

    render(
      <AchievementItem achievement={achievement} isUnlocked={false} currentProgress={500000} />
    );

    expect(screen.getByText('500K / 1.00M')).toBeInTheDocument();
  });

  it('should default currentProgress to 0 when not provided', () => {
    const achievement: Achievement = {
      ...mockAchievement,
      threshold: 10,
    };

    render(<AchievementItem achievement={achievement} isUnlocked={false} />);

    expect(screen.getByText('0 / 10')).toBeInTheDocument();
  });
});
