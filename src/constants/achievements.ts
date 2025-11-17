import type { Achievement } from '@/types';

/**
 * All achievements in the game
 * Each achievement grants +1% production bonus
 */
export const ACHIEVEMENTS: Achievement[] = [
  // Click-based achievements
  {
    id: 'firstClick',
    name: 'First Click',
    description: 'Click once',
    category: 'click',
    condition: 'totalClicks',
    threshold: 1,
    bonus: 0.01,
  },
  {
    id: 'clickNovice',
    name: 'Click Novice',
    description: 'Click 100 times',
    category: 'click',
    condition: 'totalClicks',
    threshold: 100,
    bonus: 0.01,
  },
  {
    id: 'clickAdept',
    name: 'Click Adept',
    description: 'Click 1,000 times',
    category: 'click',
    condition: 'totalClicks',
    threshold: 1000,
    bonus: 0.01,
  },
  {
    id: 'clickMaster',
    name: 'Click Master',
    description: 'Click 10,000 times',
    category: 'click',
    condition: 'totalClicks',
    threshold: 10000,
    bonus: 0.01,
  },
  {
    id: 'clickLegend',
    name: 'Click Legend',
    description: 'Click 100,000 times',
    category: 'click',
    condition: 'totalClicks',
    threshold: 100000,
    bonus: 0.01,
  },

  // Production-based achievements
  {
    id: 'miningBeginner',
    name: 'Mining Beginner',
    description: 'Own 1 Space Miner',
    category: 'production',
    condition: 'buildingCount',
    threshold: 1,
    buildingId: 'spaceMiner',
    bonus: 0.01,
  },
  {
    id: 'miningFleet',
    name: 'Mining Fleet',
    description: 'Own 50 Space Miners',
    category: 'production',
    condition: 'buildingCount',
    threshold: 50,
    buildingId: 'spaceMiner',
    bonus: 0.01,
  },
  {
    id: 'asteroidBaron',
    name: 'Asteroid Baron',
    description: 'Own 25 Asteroid Harvesters',
    category: 'production',
    condition: 'buildingCount',
    threshold: 25,
    buildingId: 'asteroidHarvester',
    bonus: 0.01,
  },
  {
    id: 'solarMagnate',
    name: 'Solar Magnate',
    description: 'Own 10 Solar Collectors',
    category: 'production',
    condition: 'buildingCount',
    threshold: 10,
    buildingId: 'solarCollector',
    bonus: 0.01,
  },
  {
    id: 'realityShaper',
    name: 'Reality Shaper',
    description: 'Own 1 Universe Engine',
    category: 'production',
    condition: 'buildingCount',
    threshold: 1,
    buildingId: 'universeEngine',
    bonus: 0.01,
  },

  // Milestone-based achievements
  {
    id: 'dustCollector',
    name: 'Dust Collector',
    description: 'Earn 1,000 fuel (lifetime)',
    category: 'milestone',
    condition: 'totalFuelEarned',
    threshold: 1000,
    bonus: 0.01,
  },
  {
    id: 'stellarMiner',
    name: 'Stellar Miner',
    description: 'Earn 1,000,000 fuel (lifetime)',
    category: 'milestone',
    condition: 'totalFuelEarned',
    threshold: 1000000,
    bonus: 0.01,
  },
  {
    id: 'galacticTycoon',
    name: 'Galactic Tycoon',
    description: 'Earn 1,000,000,000 fuel (lifetime)',
    category: 'milestone',
    condition: 'totalFuelEarned',
    threshold: 1000000000,
    bonus: 0.01,
  },
  {
    id: 'universeCreator',
    name: 'Universe Creator',
    description: 'Earn 1,000,000,000,000 fuel (lifetime)',
    category: 'milestone',
    condition: 'totalFuelEarned',
    threshold: 1000000000000,
    bonus: 0.01,
  },

  // Prestige-based achievements
  {
    id: 'firstAscension',
    name: 'First Ascension',
    description: 'Prestige once',
    category: 'prestige',
    condition: 'totalPrestiges',
    threshold: 1,
    bonus: 0.01,
  },
  {
    id: 'ascensionMaster',
    name: 'Ascension Master',
    description: 'Prestige 10 times',
    category: 'prestige',
    condition: 'totalPrestiges',
    threshold: 10,
    bonus: 0.01,
  },
  {
    id: 'crystalCollector',
    name: 'Crystal Collector',
    description: 'Earn 100 Nebula Crystals (total)',
    category: 'prestige',
    condition: 'totalNebulaCrystals',
    threshold: 100,
    bonus: 0.01,
  },
  {
    id: 'cosmicVeteran',
    name: 'Cosmic Veteran',
    description: 'Earn 1,000 Nebula Crystals (total)',
    category: 'prestige',
    condition: 'totalNebulaCrystals',
    threshold: 1000,
    bonus: 0.01,
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.category === category);
}
