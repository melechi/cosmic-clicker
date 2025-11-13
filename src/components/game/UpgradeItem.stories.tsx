import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UpgradeItem } from './UpgradeItem';
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
  description: 'All buildings produce 50% more stardust',
  cost: 5000,
  type: 'production',
  multiplier: 1.5,
};

const autoClickUpgrade: AutoClickUpgrade = {
  id: 'basicAutoClicker',
  name: 'Basic Auto-Clicker',
  description: 'Automatically clicks 1 time per second',
  cost: 1000,
  type: 'autoClick',
  clicksPerSecond: 1,
};

const meta: Meta<typeof UpgradeItem> = {
  title: 'Game/UpgradeItem',
  component: UpgradeItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPurchase: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof UpgradeItem>;

export const ClickUpgradeAffordable: Story = {
  args: {
    upgrade: clickUpgrade,
    isPurchased: false,
    canAfford: true,
  },
};

export const ClickUpgradeNotAffordable: Story = {
  args: {
    upgrade: clickUpgrade,
    isPurchased: false,
    canAfford: false,
  },
};

export const ClickUpgradePurchased: Story = {
  args: {
    upgrade: clickUpgrade,
    isPurchased: true,
    canAfford: false,
  },
};

export const ProductionUpgradeAffordable: Story = {
  args: {
    upgrade: productionUpgrade,
    isPurchased: false,
    canAfford: true,
  },
};

export const ProductionUpgradePurchased: Story = {
  args: {
    upgrade: productionUpgrade,
    isPurchased: true,
    canAfford: false,
  },
};

export const AutoClickUpgradeAffordable: Story = {
  args: {
    upgrade: autoClickUpgrade,
    isPurchased: false,
    canAfford: true,
  },
};

export const ExpensiveUpgrade: Story = {
  args: {
    upgrade: {
      ...clickUpgrade,
      name: 'Quantum Collectors',
      cost: 25000000,
      multiplier: 5,
    },
    isPurchased: false,
    canAfford: false,
  },
};
