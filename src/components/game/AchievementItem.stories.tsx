import type { Meta, StoryObj } from '@storybook/react';
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

const meta: Meta<typeof AchievementItem> = {
  title: 'Game/AchievementItem',
  component: AchievementItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AchievementItem>;

export const Locked: Story = {
  args: {
    achievement: mockAchievement,
    isUnlocked: false,
    currentProgress: 0,
  },
};

export const Unlocked: Story = {
  args: {
    achievement: mockAchievement,
    isUnlocked: true,
    currentProgress: 1,
  },
};

export const PartialProgress: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      name: 'Click Master',
      description: 'Click 1000 times',
      threshold: 1000,
    },
    isUnlocked: false,
    currentProgress: 456,
  },
};

export const NearlyComplete: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      name: 'Building Empire',
      description: 'Purchase 100 buildings',
      condition: 'buildingCount',
      threshold: 100,
    },
    isUnlocked: false,
    currentProgress: 98,
  },
};

export const NoProgress: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      name: 'First Prestige',
      description: 'Perform your first prestige',
      condition: 'totalPrestiges',
      threshold: 1,
    },
    isUnlocked: false,
    currentProgress: 0,
  },
};

export const NoBonus: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      name: 'Explorer',
      description: 'Discover all buildings',
      condition: 'buildingCount',
      threshold: 7,
      bonus: 0,
    },
    isUnlocked: false,
    currentProgress: 5,
  },
};

export const LargeNumbers: Story = {
  args: {
    achievement: {
      ...mockAchievement,
      name: 'Stardust Tycoon',
      description: 'Earn 1 billion total stardust',
      condition: 'totalFuelEarned',
      threshold: 1000000000,
      bonus: 0.5,
    },
    isUnlocked: false,
    currentProgress: 750000000,
  },
};
