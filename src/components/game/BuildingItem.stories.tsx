import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BuildingItem } from './BuildingItem';
import type { Building } from '@/types';

const mockBuilding: Building = {
  id: 'spaceMiner',
  name: 'Space Miner',
  description: 'Small drones that collect stardust automatically',
  baseCost: 10,
  costMultiplier: 1.15,
  production: 0.1,
  tier: 1,
};

const meta: Meta<typeof BuildingItem> = {
  title: 'Game/BuildingItem',
  component: BuildingItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPurchase: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BuildingItem>;

export const Affordable: Story = {
  args: {
    building: mockBuilding,
    owned: 0,
    currentCost: 10,
    canAfford: true,
    totalProduction: 0,
  },
};

export const NotAffordable: Story = {
  args: {
    building: mockBuilding,
    owned: 0,
    currentCost: 1000,
    canAfford: false,
    totalProduction: 0,
  },
};

export const WithOwned: Story = {
  args: {
    building: mockBuilding,
    owned: 25,
    currentCost: 50,
    canAfford: true,
    totalProduction: 2.5,
  },
};

export const ManyOwned: Story = {
  args: {
    building: mockBuilding,
    owned: 100,
    currentCost: 500,
    canAfford: true,
    totalProduction: 10,
  },
};

export const ExpensiveBuilding: Story = {
  args: {
    building: {
      id: 'universeEngine',
      name: 'Universe Engine',
      description: 'Reality-bending machinery that creates stardust from the fabric of spacetime',
      baseCost: 20000000,
      costMultiplier: 1.15,
      production: 7800,
      tier: 7,
    },
    owned: 5,
    currentCost: 45000000,
    canAfford: false,
    totalProduction: 39000,
  },
};

export const HighTierBuilding: Story = {
  args: {
    building: {
      id: 'galacticNexus',
      name: 'Galactic Nexus',
      description: 'A vast network connecting stellar production facilities',
      baseCost: 1400000,
      costMultiplier: 1.15,
      production: 1400,
      tier: 6,
    },
    owned: 10,
    currentCost: 3500000,
    canAfford: true,
    totalProduction: 14000,
  },
};
