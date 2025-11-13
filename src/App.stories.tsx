import type { Meta, StoryObj } from '@storybook/react';
import { vi } from 'vitest';
import App from './App';
import * as saveManager from '@/utils/saveLoad/saveManager';
import type { GameState } from '@/types';
import { initialGameState } from '@/types';

const meta: Meta<typeof App> = {
  title: 'App/Main',
  component: App,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main Cosmic Clicker application component. Includes all game functionality, state management, and UI.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-screen h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof App>;

/**
 * Default story - Fresh game with no saved data
 */
export const FreshGame: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A brand new game with no saved progress. Players start with 0 stardust.',
      },
    },
  },
  beforeEach: () => {
    // Mock loadGame to return null (no save)
    vi.spyOn(saveManager, 'loadGame').mockReturnValue(null);
  },
};

/**
 * Game with some progress
 */
export const EarlyGame: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Early game state with a few buildings and some stardust. Shows typical gameplay after ~10 minutes.',
      },
    },
  },
  beforeEach: () => {
    const earlyGameState: GameState = {
      ...initialGameState,
      stardust: 500,
      totalStardustEarned: 2000,
      clickPower: 1,
      productionPerSecond: 5.5,
      buildings: {
        spaceMiner: 5,
        asteroidHarvester: 2,
      },
      upgrades: ['clickUpgrade1'],
      achievements: ['firstClick', 'clickNovice'],
      statistics: {
        totalClicks: 150,
        totalPlayTime: 600,
        currentSessionTime: 0,
        totalPrestiges: 0,
        buildingsPurchased: 7,
        upgradesPurchased: 1,
      },
      lastSaveTime: Date.now(),
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(earlyGameState);
  },
};

/**
 * Mid-game with multiple buildings
 */
export const MidGame: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mid-game state with several buildings, upgrades, and achievements. Shows gameplay after ~1 hour.',
      },
    },
  },
  beforeEach: () => {
    const midGameState: GameState = {
      ...initialGameState,
      stardust: 50000,
      totalStardustEarned: 500000,
      clickPower: 5,
      productionPerSecond: 250,
      buildings: {
        spaceMiner: 25,
        asteroidHarvester: 15,
        lunarRefinery: 10,
        solarCollector: 5,
      },
      upgrades: [
        'clickUpgrade1',
        'clickUpgrade2',
        'productionUpgrade1',
        'buildingUpgrade1',
      ],
      achievements: [
        'firstClick',
        'clickNovice',
        'clickAdept',
        'stardustNovice',
        'firstBuilding',
      ],
      statistics: {
        totalClicks: 1500,
        totalPlayTime: 3600,
        currentSessionTime: 0,
        totalPrestiges: 0,
        buildingsPurchased: 55,
        upgradesPurchased: 4,
      },
      lastSaveTime: Date.now(),
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(midGameState);
  },
};

/**
 * Late game approaching first prestige
 */
export const ReadyToPrestige: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Late game state ready for first prestige. Player has accumulated enough stardust for Nebula Crystals.',
      },
    },
  },
  beforeEach: () => {
    const lateGameState: GameState = {
      ...initialGameState,
      stardust: 2000000,
      totalStardustEarned: 5000000,
      clickPower: 10,
      productionPerSecond: 5000,
      buildings: {
        spaceMiner: 50,
        asteroidHarvester: 40,
        lunarRefinery: 30,
        solarCollector: 20,
        wormholeGenerator: 10,
        galacticNexus: 5,
      },
      upgrades: [
        'clickUpgrade1',
        'clickUpgrade2',
        'clickUpgrade3',
        'productionUpgrade1',
        'productionUpgrade2',
        'buildingUpgrade1',
        'buildingUpgrade2',
      ],
      achievements: [
        'firstClick',
        'clickNovice',
        'clickAdept',
        'clickMaster',
        'stardustNovice',
        'stardustAdept',
        'firstBuilding',
        'buildingNovice',
      ],
      statistics: {
        totalClicks: 5000,
        totalPlayTime: 7200,
        currentSessionTime: 0,
        totalPrestiges: 0,
        buildingsPurchased: 155,
        upgradesPurchased: 7,
      },
      lastSaveTime: Date.now(),
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(lateGameState);
  },
};

/**
 * Post-prestige game with Nebula Crystals
 */
export const PostPrestige: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Game state after first prestige with Nebula Crystals. Shows prestige bonuses in effect.',
      },
    },
  },
  beforeEach: () => {
    const prestigeGameState: GameState = {
      ...initialGameState,
      stardust: 1000,
      totalStardustEarned: 1000,
      nebulaCrystals: 5,
      clickPower: 1,
      productionPerSecond: 0.5,
      buildings: {
        spaceMiner: 5,
      },
      upgrades: [],
      achievements: [
        'firstClick',
        'clickNovice',
        'clickAdept',
        'clickMaster',
        'stardustNovice',
        'stardustAdept',
        'firstBuilding',
        'buildingNovice',
        'firstPrestige',
      ],
      statistics: {
        totalClicks: 100,
        totalPlayTime: 8000,
        currentSessionTime: 0,
        totalPrestiges: 1,
        buildingsPurchased: 5,
        upgradesPurchased: 0,
      },
      lastSaveTime: Date.now(),
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(prestigeGameState);
  },
};

/**
 * Game with offline progress (1 hour away)
 */
export const WithOfflineProgress: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Player returning after 1 hour away. Shows offline progress modal with accumulated stardust.',
      },
    },
  },
  beforeEach: () => {
    const oneHourAgo = Date.now() - 3600000; // 1 hour ago
    const offlineGameState: GameState = {
      ...initialGameState,
      stardust: 1000,
      totalStardustEarned: 10000,
      clickPower: 2,
      productionPerSecond: 50,
      buildings: {
        spaceMiner: 10,
        asteroidHarvester: 5,
      },
      upgrades: ['clickUpgrade1'],
      achievements: ['firstClick', 'clickNovice'],
      statistics: {
        totalClicks: 500,
        totalPlayTime: 1800,
        currentSessionTime: 0,
        totalPrestiges: 0,
        buildingsPurchased: 15,
        upgradesPurchased: 1,
      },
      lastSaveTime: oneHourAgo,
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(offlineGameState);
  },
};

/**
 * Game with maximum offline progress (8+ hours away)
 */
export const MaxOfflineProgress: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Player returning after 8+ hours away. Shows capped offline progress with warning message.',
      },
    },
  },
  beforeEach: () => {
    const tenHoursAgo = Date.now() - 36000000; // 10 hours ago
    const maxOfflineState: GameState = {
      ...initialGameState,
      stardust: 5000,
      totalStardustEarned: 100000,
      clickPower: 5,
      productionPerSecond: 200,
      buildings: {
        spaceMiner: 30,
        asteroidHarvester: 20,
        lunarRefinery: 10,
      },
      upgrades: ['clickUpgrade1', 'clickUpgrade2', 'productionUpgrade1'],
      achievements: [
        'firstClick',
        'clickNovice',
        'clickAdept',
        'stardustNovice',
        'firstBuilding',
      ],
      statistics: {
        totalClicks: 2000,
        totalPlayTime: 5000,
        currentSessionTime: 0,
        totalPrestiges: 0,
        buildingsPurchased: 60,
        upgradesPurchased: 3,
      },
      lastSaveTime: tenHoursAgo,
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(maxOfflineState);
  },
};

/**
 * Endgame with max resources
 */
export const Endgame: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Endgame state with multiple prestiges, high-tier buildings, and many achievements unlocked.',
      },
    },
  },
  beforeEach: () => {
    const endgameState: GameState = {
      ...initialGameState,
      stardust: 1e15,
      totalStardustEarned: 1e18,
      nebulaCrystals: 50,
      clickPower: 100,
      productionPerSecond: 1e9,
      buildings: {
        spaceMiner: 200,
        asteroidHarvester: 180,
        lunarRefinery: 150,
        solarCollector: 120,
        wormholeGenerator: 100,
        galacticNexus: 80,
        universeEngine: 50,
      },
      upgrades: [
        'clickUpgrade1',
        'clickUpgrade2',
        'clickUpgrade3',
        'productionUpgrade1',
        'productionUpgrade2',
        'productionUpgrade3',
        'buildingUpgrade1',
        'buildingUpgrade2',
        'buildingUpgrade3',
        'autoClick1',
      ],
      achievements: [
        'firstClick',
        'clickNovice',
        'clickAdept',
        'clickMaster',
        'clickLegend',
        'stardustNovice',
        'stardustAdept',
        'stardustMaster',
        'firstBuilding',
        'buildingNovice',
        'buildingAdept',
        'firstPrestige',
        'prestigeNovice',
      ],
      statistics: {
        totalClicks: 100000,
        totalPlayTime: 50000,
        currentSessionTime: 0,
        totalPrestiges: 10,
        buildingsPurchased: 1000,
        upgradesPurchased: 10,
      },
      lastSaveTime: Date.now(),
    };

    vi.spyOn(saveManager, 'loadGame').mockReturnValue(endgameState);
  },
};
