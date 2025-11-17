import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import type { ResourceInventory } from '@/types/resources';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    fuel: 1234.56,
    tankCapacity: 1000,
    credits: 500,
    productionPerSecond: 10.5,
    nebulaCrystals: 0,
    clickPower: 1,
  },
};

export const WithNebulaCrystals: Story = {
  args: {
    fuel: 5000000,
    tankCapacity: 10000000,
    credits: 25000,
    productionPerSecond: 2500,
    nebulaCrystals: 15,
    clickPower: 10,
  },
};

export const WithResources: Story = {
  args: {
    fuel: 750,
    tankCapacity: 1000,
    credits: 1200,
    productionPerSecond: 5,
    nebulaCrystals: 0,
    clickPower: 2,
    resources: {
      stone: 45,
      carbon: 30,
      iron: 12,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    } as ResourceInventory,
  },
};

export const LargeNumbers: Story = {
  args: {
    fuel: 9876543210,
    tankCapacity: 20000000000,
    credits: 5432109876,
    productionPerSecond: 1234567,
    nebulaCrystals: 999,
    clickPower: 5000,
  },
};

export const EarlyGame: Story = {
  args: {
    fuel: 45,
    tankCapacity: 1000,
    credits: 50,
    productionPerSecond: 0.5,
    nebulaCrystals: 0,
    clickPower: 1,
    resources: {
      stone: 5,
      carbon: 3,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    } as ResourceInventory,
  },
};

export const MidGame: Story = {
  args: {
    fuel: 150000,
    tankCapacity: 200000,
    credits: 8500,
    productionPerSecond: 500,
    nebulaCrystals: 3,
    clickPower: 25,
    resources: {
      stone: 120,
      carbon: 95,
      iron: 68,
      ice: 45,
      gold: 12,
      titanium: 8,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    } as ResourceInventory,
  },
};

export const LateGame: Story = {
  args: {
    fuel: 999999999999,
    tankCapacity: 1000000000000,
    credits: 999999999,
    productionPerSecond: 50000000,
    nebulaCrystals: 100,
    clickPower: 100000,
    resources: {
      stone: 9999,
      carbon: 8888,
      iron: 7777,
      ice: 6666,
      gold: 5555,
      titanium: 4444,
      platinum: 3333,
      iridium: 2222,
      darkMatter: 1111,
    } as ResourceInventory,
  },
};

export const NoProduction: Story = {
  args: {
    fuel: 250,
    tankCapacity: 1000,
    credits: 100,
    productionPerSecond: 0,
    nebulaCrystals: 0,
    clickPower: 1,
  },
};
