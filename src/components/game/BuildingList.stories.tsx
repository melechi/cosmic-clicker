import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BuildingList } from './BuildingList';
import { BUILDINGS } from '@/constants';

const meta: Meta<typeof BuildingList> = {
  title: 'Game/BuildingList',
  component: BuildingList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onPurchase: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof BuildingList>;

export const Default: Story = {
  args: {
    buildings: BUILDINGS,
    ownedCounts: {},
    currentCosts: {
      spaceMiner: 10,
      asteroidHarvester: 100,
      lunarRefinery: 1100,
      solarCollector: 12000,
      wormholeGenerator: 130000,
      galacticNexus: 1400000,
      universeEngine: 20000000,
    },
    stardust: 0,
    productionByBuilding: {},
  },
};

export const EarlyGame: Story = {
  args: {
    buildings: BUILDINGS,
    ownedCounts: {
      spaceMiner: 3,
      asteroidHarvester: 0,
    },
    currentCosts: {
      spaceMiner: 13,
      asteroidHarvester: 100,
      lunarRefinery: 1100,
      solarCollector: 12000,
      wormholeGenerator: 130000,
      galacticNexus: 1400000,
      universeEngine: 20000000,
    },
    stardust: 50,
    productionByBuilding: {
      spaceMiner: 0.3,
      asteroidHarvester: 0,
    },
  },
};

export const MidGame: Story = {
  args: {
    buildings: BUILDINGS,
    ownedCounts: {
      spaceMiner: 25,
      asteroidHarvester: 15,
      lunarRefinery: 10,
      solarCollector: 5,
      wormholeGenerator: 0,
    },
    currentCosts: {
      spaceMiner: 250,
      asteroidHarvester: 350,
      lunarRefinery: 2500,
      solarCollector: 25000,
      wormholeGenerator: 130000,
      galacticNexus: 1400000,
      universeEngine: 20000000,
    },
    stardust: 50000,
    productionByBuilding: {
      spaceMiner: 2.5,
      asteroidHarvester: 15,
      lunarRefinery: 80,
      solarCollector: 235,
      wormholeGenerator: 0,
    },
  },
};

export const LateGame: Story = {
  args: {
    buildings: BUILDINGS,
    ownedCounts: {
      spaceMiner: 100,
      asteroidHarvester: 85,
      lunarRefinery: 70,
      solarCollector: 60,
      wormholeGenerator: 50,
      galacticNexus: 25,
      universeEngine: 10,
    },
    currentCosts: {
      spaceMiner: 5000,
      asteroidHarvester: 15000,
      lunarRefinery: 50000,
      solarCollector: 250000,
      wormholeGenerator: 1500000,
      galacticNexus: 15000000,
      universeEngine: 200000000,
    },
    stardust: 100000000,
    productionByBuilding: {
      spaceMiner: 10,
      asteroidHarvester: 85,
      lunarRefinery: 560,
      solarCollector: 2820,
      wormholeGenerator: 13000,
      galacticNexus: 35000,
      universeEngine: 78000,
    },
  },
};

export const EmptyList: Story = {
  args: {
    buildings: [],
    ownedCounts: {},
    currentCosts: {},
    stardust: 0,
    productionByBuilding: {},
  },
};
