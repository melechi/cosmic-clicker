import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrestigePanel } from './PrestigePanel';

const meta: Meta<typeof PrestigePanel> = {
  title: 'Game/PrestigePanel',
  component: PrestigePanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onPrestige: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PrestigePanel>;

export const CannotPrestige: Story = {
  args: {
    totalFuelEarned: 500000,
    currentNebulaCrystals: 0,
    crystalsToGain: 0,
    canPrestige: false,
    productionBonus: 0,
  },
};

export const NearlyReady: Story = {
  args: {
    totalFuelEarned: 950000,
    currentNebulaCrystals: 0,
    crystalsToGain: 0,
    canPrestige: false,
    productionBonus: 0,
  },
};

export const ReadyToPrestige: Story = {
  args: {
    totalFuelEarned: 2000000,
    currentNebulaCrystals: 0,
    crystalsToGain: 1,
    canPrestige: true,
    productionBonus: 0,
  },
};

export const WithExistingCrystals: Story = {
  args: {
    totalFuelEarned: 10000000,
    currentNebulaCrystals: 10,
    crystalsToGain: 3,
    canPrestige: true,
    productionBonus: 10,
  },
};

export const HighPrestige: Story = {
  args: {
    totalFuelEarned: 100000000,
    currentNebulaCrystals: 50,
    crystalsToGain: 10,
    canPrestige: true,
    productionBonus: 50,
  },
};

export const VeryHighPrestige: Story = {
  args: {
    totalFuelEarned: 1000000000000,
    currentNebulaCrystals: 999,
    crystalsToGain: 1000,
    canPrestige: true,
    productionBonus: 999,
  },
};
