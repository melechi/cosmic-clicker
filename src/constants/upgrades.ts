import type { ClickUpgrade, ProductionUpgrade, AutoClickUpgrade, PrestigeUpgrade } from '@/types';

/**
 * Click power upgrades
 */
export const CLICK_UPGRADES: ClickUpgrade[] = [
  {
    id: 'improvedCollectors',
    name: 'Improved Collectors',
    description: 'Double your click power',
    cost: 100,
    type: 'click',
    multiplier: 2,
  },
  {
    id: 'enhancedCollectors',
    name: 'Enhanced Collectors',
    description: 'Double your click power',
    cost: 500,
    type: 'click',
    multiplier: 2,
  },
  {
    id: 'advancedCollectors',
    name: 'Advanced Collectors',
    description: 'Double your click power',
    cost: 2500,
    type: 'click',
    multiplier: 2,
  },
  {
    id: 'quantumCollectors',
    name: 'Quantum Collectors',
    description: 'Triple your click power',
    cost: 25000,
    type: 'click',
    multiplier: 3,
  },
  {
    id: 'cosmicCollectors',
    name: 'Cosmic Collectors',
    description: 'Multiply your click power by 5',
    cost: 500000,
    type: 'click',
    multiplier: 5,
  },
];

/**
 * Auto-clicker upgrades
 */
export const AUTO_CLICK_UPGRADES: AutoClickUpgrade[] = [
  {
    id: 'basicAutoClicker',
    name: 'Basic Auto-clicker',
    description: 'Automatically click once per second',
    cost: 1000,
    type: 'autoClick',
    clicksPerSecond: 1,
  },
  {
    id: 'improvedAutoClicker',
    name: 'Improved Auto-clicker',
    description: 'Automatically click twice per second',
    cost: 10000,
    type: 'autoClick',
    clicksPerSecond: 2,
  },
  {
    id: 'advancedAutoClicker',
    name: 'Advanced Auto-clicker',
    description: 'Automatically click 5 times per second',
    cost: 100000,
    type: 'autoClick',
    clicksPerSecond: 5,
  },
  {
    id: 'quantumAutoClicker',
    name: 'Quantum Auto-clicker',
    description: 'Automatically click 10 times per second',
    cost: 1000000,
    type: 'autoClick',
    clicksPerSecond: 10,
  },
];

/**
 * Global production multiplier upgrades
 */
export const PRODUCTION_UPGRADES: ProductionUpgrade[] = [
  {
    id: 'efficientMining',
    name: 'Efficient Mining',
    description: 'Double production for all buildings',
    cost: 500,
    type: 'production',
    multiplier: 2,
  },
  {
    id: 'advancedAutomation',
    name: 'Advanced Automation',
    description: 'Double production for all buildings',
    cost: 5000,
    type: 'production',
    multiplier: 2,
  },
  {
    id: 'neuralNetworks',
    name: 'Neural Networks',
    description: 'Double production for all buildings',
    cost: 50000,
    type: 'production',
    multiplier: 2,
  },
  {
    id: 'quantumComputing',
    name: 'Quantum Computing',
    description: 'Double production for all buildings',
    cost: 500000,
    type: 'production',
    multiplier: 2,
  },
  {
    id: 'singularityCore',
    name: 'Singularity Core',
    description: 'Triple production for all buildings',
    cost: 5000000,
    type: 'production',
    multiplier: 3,
  },
];

/**
 * Prestige upgrades (purchased with Nebula Crystals)
 */
export const PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
  {
    id: 'stardustAffinity',
    name: 'Stardust Affinity',
    description: 'Start each run with 100 stardust',
    cost: 5,
    type: 'prestige',
    effect: 'startStardust',
    value: 100,
  },
  {
    id: 'miningExperience',
    name: 'Mining Experience',
    description: 'Start with 5 Space Miners',
    cost: 10,
    type: 'prestige',
    effect: 'startBuildings',
    value: 5,
  },
  {
    id: 'clickMaster',
    name: 'Click Master',
    description: 'Double base click power permanently',
    cost: 15,
    type: 'prestige',
    effect: 'clickMultiplier',
    value: 2,
  },
  {
    id: 'productionExpert',
    name: 'Production Expert',
    description: 'Double all production permanently',
    cost: 25,
    type: 'prestige',
    effect: 'productionMultiplier',
    value: 2,
  },
  {
    id: 'automationMastery',
    name: 'Automation Mastery',
    description: 'Unlock auto-clicker at start of run',
    cost: 50,
    type: 'prestige',
    effect: 'autoClickStart',
    value: 1,
  },
  {
    id: 'cosmicInsight',
    name: 'Cosmic Insight',
    description: 'Gain 10% more Nebula Crystals from prestige',
    cost: 100,
    type: 'prestige',
    effect: 'prestigeBonus',
    value: 0.1,
  },
];

/**
 * All upgrades combined
 */
export const ALL_UPGRADES = [
  ...CLICK_UPGRADES,
  ...AUTO_CLICK_UPGRADES,
  ...PRODUCTION_UPGRADES,
  ...PRESTIGE_UPGRADES,
];

/**
 * Get upgrade by ID
 */
export function getUpgradeById(id: string) {
  return ALL_UPGRADES.find((upgrade) => upgrade.id === id);
}

/**
 * Get upgrades by type
 */
export function getUpgradesByType(type: 'click' | 'production' | 'prestige' | 'autoClick') {
  return ALL_UPGRADES.filter((upgrade) => upgrade.type === type);
}
