import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementsPanel } from './AchievementsPanel';
import type { Achievement } from '@/types';

const mockAchievements: Achievement[] = [
  {
    id: 'firstClick',
    name: 'First Click',
    description: 'Click once',
    category: 'click',
    condition: 'totalClicks',
    threshold: 1,
    bonus: 0.01,
  },
  {
    id: 'clickMaster',
    name: 'Click Master',
    description: 'Click 1000 times',
    category: 'click',
    condition: 'totalClicks',
    threshold: 1000,
    bonus: 0.01,
  },
  {
    id: 'firstMilestone',
    name: 'First Milestone',
    description: 'Reach a milestone',
    category: 'milestone',
    condition: 'totalStardustEarned',
    threshold: 1000,
    bonus: 0.01,
  },
];

describe('AchievementsPanel', () => {
  it('should render header and description', () => {
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText(/unlock achievements to earn rewards/i)).toBeInTheDocument();
  });

  it('should show completion progress', () => {
    const mockGetProgress = vi.fn(() => 0);
    const unlockedAchievements = new Set(['firstClick']);

    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={unlockedAchievements}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText(/1 \/ 3 \(33%\)/)).toBeInTheDocument();
  });

  it('should render category filter buttons', () => {
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByLabelText('All achievements')).toBeInTheDocument();
    expect(screen.getByLabelText('Clicks achievements')).toBeInTheDocument();
    expect(screen.getByLabelText('Production achievements')).toBeInTheDocument();
    expect(screen.getByLabelText('Milestones achievements')).toBeInTheDocument();
    expect(screen.getByLabelText('Prestige achievements')).toBeInTheDocument();
  });

  it('should show counts for each category', () => {
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText('All (0/3)')).toBeInTheDocument();
    expect(screen.getByText('Clicks (0/2)')).toBeInTheDocument();
    expect(screen.getByText('Milestones (0/1)')).toBeInTheDocument();
  });

  it('should filter achievements by category', async () => {
    const user = userEvent.setup();
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    // All achievements shown initially
    expect(screen.getByText('First Click')).toBeInTheDocument();
    expect(screen.getByText('First Milestone')).toBeInTheDocument();

    // Filter to clicks
    await user.click(screen.getByLabelText('Clicks achievements'));
    expect(screen.getByText('First Click')).toBeInTheDocument();
    expect(screen.queryByText('First Milestone')).not.toBeInTheDocument();

    // Filter to milestones
    await user.click(screen.getByLabelText('Milestones achievements'));
    expect(screen.queryByText('First Click')).not.toBeInTheDocument();
    expect(screen.getByText('First Milestone')).toBeInTheDocument();
  });

  it('should separate locked and unlocked achievements', () => {
    const mockGetProgress = vi.fn(() => 0);
    const unlockedAchievements = new Set(['firstClick']);

    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={unlockedAchievements}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText('In Progress (2)')).toBeInTheDocument();
    expect(screen.getByText('Completed (1)')).toBeInTheDocument();
  });

  it('should call getAchievementProgress for locked achievements', () => {
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    // Should be called once for each locked achievement
    expect(mockGetProgress).toHaveBeenCalledWith('firstClick');
    expect(mockGetProgress).toHaveBeenCalledWith('clickMaster');
    expect(mockGetProgress).toHaveBeenCalledWith('firstMilestone');
  });

  it('should show empty state for category with no achievements', async () => {
    const user = userEvent.setup();
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    await user.click(screen.getByLabelText('Production achievements'));

    expect(screen.getByText('No achievements in this category')).toBeInTheDocument();
  });

  it('should highlight active category button', async () => {
    const user = userEvent.setup();
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    const clicksButton = screen.getByLabelText('Clicks achievements');
    expect(clicksButton).not.toHaveAttribute('aria-current', 'page');

    await user.click(clicksButton);
    expect(clicksButton).toHaveAttribute('aria-current', 'page');
  });

  it('should calculate completion percentage correctly', () => {
    const mockGetProgress = vi.fn(() => 0);
    const unlockedAchievements = new Set(['firstClick', 'firstMilestone']);

    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={unlockedAchievements}
        getAchievementProgress={mockGetProgress}
      />
    );

    // 2/3 = 66%
    expect(screen.getByText(/2 \/ 3 \(66%\)/)).toBeInTheDocument();
  });

  it('should handle 0% completion', () => {
    const mockGetProgress = vi.fn(() => 0);
    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={new Set()}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText(/0 \/ 3 \(0%\)/)).toBeInTheDocument();
  });

  it('should handle 100% completion', () => {
    const mockGetProgress = vi.fn(() => 0);
    const unlockedAchievements = new Set(['firstClick', 'clickMaster', 'firstMilestone']);

    render(
      <AchievementsPanel
        achievements={mockAchievements}
        unlockedAchievements={unlockedAchievements}
        getAchievementProgress={mockGetProgress}
      />
    );

    expect(screen.getByText(/3 \/ 3 \(100%\)/)).toBeInTheDocument();
  });
});
