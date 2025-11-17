import type { Meta, StoryObj } from '@storybook/react';
import { Statistics } from './Statistics';
import type { GameStatistics } from '@/types';

const meta: Meta<typeof Statistics> = {
  title: 'Game/Statistics',
  component: Statistics,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Statistics>;

const earlyGameStats: GameStatistics = {
  totalClicks: 250,
  totalPlayTime: 300, // 5 minutes
  currentSessionTime: 300,
  totalPrestiges: 0,
  buildingsPurchased: 5,
  upgradesPurchased: 1,
};

const midGameStats: GameStatistics = {
  totalClicks: 10000,
  totalPlayTime: 7200, // 2 hours
  currentSessionTime: 3600,
  totalPrestiges: 3,
  buildingsPurchased: 150,
  upgradesPurchased: 15,
};

const lateGameStats: GameStatistics = {
  totalClicks: 500000,
  totalPlayTime: 172800, // 48 hours
  currentSessionTime: 7200,
  totalPrestiges: 50,
  buildingsPurchased: 5000,
  upgradesPurchased: 50,
};

export const EarlyGame: Story = {
  args: {
    statistics: earlyGameStats,
  },
};

export const MidGame: Story = {
  args: {
    statistics: midGameStats,
  },
};

export const LateGame: Story = {
  args: {
    statistics: lateGameStats,
  },
};

export const ZeroStats: Story = {
  args: {
    statistics: {
      totalClicks: 0,
      totalPlayTime: 0,
      currentSessionTime: 0,
      totalPrestiges: 0,
      buildingsPurchased: 0,
      upgradesPurchased: 0,
    },
  },
};
