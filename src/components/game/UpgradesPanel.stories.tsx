import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UpgradesPanel } from './UpgradesPanel';
import { CLICK_UPGRADES, PRODUCTION_UPGRADES, AUTO_CLICK_UPGRADES, PRESTIGE_UPGRADES } from '@/constants';

const meta: Meta<typeof UpgradesPanel> = {
  title: 'Game/UpgradesPanel',
  component: UpgradesPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onPurchase: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof UpgradesPanel>;

export const Default: Story = {
  args: {
    clickUpgrades: CLICK_UPGRADES,
    productionUpgrades: PRODUCTION_UPGRADES,
    autoClickUpgrades: AUTO_CLICK_UPGRADES,
    prestigeUpgrades: PRESTIGE_UPGRADES,
    purchasedUpgrades: new Set(),
    stardust: 0,
  },
};

export const WithSomeStardust: Story = {
  args: {
    clickUpgrades: CLICK_UPGRADES,
    productionUpgrades: PRODUCTION_UPGRADES,
    autoClickUpgrades: AUTO_CLICK_UPGRADES,
    prestigeUpgrades: PRESTIGE_UPGRADES,
    purchasedUpgrades: new Set(),
    stardust: 5000,
  },
};

export const SomePurchased: Story = {
  args: {
    clickUpgrades: CLICK_UPGRADES,
    productionUpgrades: PRODUCTION_UPGRADES,
    autoClickUpgrades: AUTO_CLICK_UPGRADES,
    prestigeUpgrades: PRESTIGE_UPGRADES,
    purchasedUpgrades: new Set(['improvedCollectors', 'enhancedCollectors', 'basicAutoClicker']),
    stardust: 10000,
  },
};

export const ManyPurchased: Story = {
  args: {
    clickUpgrades: CLICK_UPGRADES,
    productionUpgrades: PRODUCTION_UPGRADES,
    autoClickUpgrades: AUTO_CLICK_UPGRADES,
    prestigeUpgrades: PRESTIGE_UPGRADES,
    purchasedUpgrades: new Set([
      'improvedCollectors',
      'enhancedCollectors',
      'advancedCollectors',
      'basicAutoClicker',
      'improvedAutoClicker',
      'efficientProduction',
    ]),
    stardust: 100000,
  },
};

export const AllPurchased: Story = {
  args: {
    clickUpgrades: CLICK_UPGRADES,
    productionUpgrades: PRODUCTION_UPGRADES,
    autoClickUpgrades: AUTO_CLICK_UPGRADES,
    prestigeUpgrades: PRESTIGE_UPGRADES,
    purchasedUpgrades: new Set([
      ...CLICK_UPGRADES.map((u) => u.id),
      ...PRODUCTION_UPGRADES.map((u) => u.id),
      ...AUTO_CLICK_UPGRADES.map((u) => u.id),
      ...PRESTIGE_UPGRADES.map((u) => u.id),
    ]),
    stardust: 999999999,
  },
};
