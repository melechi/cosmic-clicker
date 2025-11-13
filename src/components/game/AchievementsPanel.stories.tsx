import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AchievementsPanel } from './AchievementsPanel';
import { ACHIEVEMENTS } from '@/constants';

const meta: Meta<typeof AchievementsPanel> = {
  title: 'Game/AchievementsPanel',
  component: AchievementsPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AchievementsPanel>;

const mockGetProgress = (id: string): number => {
  const progressMap: Record<string, number> = {
    firstClick: 1,
    clickNovice: 50,
    clickAdept: 300,
    firstBuilding: 1,
    buildingNovice: 5,
    firstUpgrade: 0,
    stardustNovice: 5000,
  };
  return progressMap[id] || 0;
};

export const NoAchievements: Story = {
  args: {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: new Set(),
    getAchievementProgress: fn(() => 0),
  },
};

export const SomeUnlocked: Story = {
  args: {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: new Set(['firstClick', 'firstBuilding', 'firstUpgrade']),
    getAchievementProgress: fn(mockGetProgress),
  },
};

export const ManyUnlocked: Story = {
  args: {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: new Set([
      'firstClick',
      'clickNovice',
      'clickAdept',
      'firstBuilding',
      'buildingNovice',
      'firstUpgrade',
      'upgradeNovice',
      'stardustNovice',
    ]),
    getAchievementProgress: fn(mockGetProgress),
  },
};

export const AllUnlocked: Story = {
  args: {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: new Set(ACHIEVEMENTS.map((a) => a.id)),
    getAchievementProgress: fn((id) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      return achievement?.threshold || 0;
    }),
  },
};

export const WithProgress: Story = {
  args: {
    achievements: ACHIEVEMENTS,
    unlockedAchievements: new Set(['firstClick']),
    getAchievementProgress: fn(mockGetProgress),
  },
};
