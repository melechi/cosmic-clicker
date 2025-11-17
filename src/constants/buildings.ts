import type { Building, BuildingUpgrade } from '@/types';

/**
 * All available buildings in the game
 */
export const BUILDINGS: Building[] = [
  {
    id: 'spaceMiner',
    name: 'Mining Drone',
    description: 'Small autonomous drones that collect fuel from nearby sources',
    baseCost: 10,
    costMultiplier: 1.15,
    production: 0.1,
    tier: 1,
  },
  {
    id: 'asteroidHarvester',
    name: 'Asteroid Harvester',
    description: 'Automated mining rigs that extract fuel from asteroids',
    baseCost: 100,
    costMultiplier: 1.15,
    production: 1,
    tier: 2,
  },
  {
    id: 'lunarRefinery',
    name: 'Fuel Refinery',
    description: 'Advanced refineries that process raw materials into fuel',
    baseCost: 1100,
    costMultiplier: 1.15,
    production: 8,
    tier: 3,
  },
  {
    id: 'solarCollector',
    name: 'Solar Collector',
    description: 'Massive arrays that convert solar energy into fuel',
    baseCost: 12000,
    costMultiplier: 1.15,
    production: 47,
    tier: 4,
  },
  {
    id: 'wormholeGenerator',
    name: 'Quantum Extractor',
    description: 'Exotic technology that extracts fuel from quantum fluctuations',
    baseCost: 130000,
    costMultiplier: 1.15,
    production: 260,
    tier: 5,
  },
  {
    id: 'galacticNexus',
    name: 'Fuel Synthesizer',
    description: 'A vast network that synthesizes fuel from cosmic matter',
    baseCost: 1400000,
    costMultiplier: 1.15,
    production: 1400,
    tier: 6,
  },
  {
    id: 'universeEngine',
    name: 'Reality Engine',
    description: 'Reality-bending machinery that creates fuel from the fabric of spacetime',
    baseCost: 20000000,
    costMultiplier: 1.15,
    production: 7800,
    tier: 7,
  },
];

/**
 * Building-specific upgrades (unlocked at ownership thresholds)
 */
export const BUILDING_UPGRADES: BuildingUpgrade[] = [
  // Space Miner upgrades
  {
    id: 'spaceMinerUpgrade1',
    buildingId: 'spaceMiner',
    name: 'Efficient Drones',
    description: 'Space Miners are twice as efficient',
    cost: 100,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'spaceMinerUpgrade2',
    buildingId: 'spaceMiner',
    name: 'Advanced AI',
    description: 'Space Miners are three times as efficient',
    cost: 1000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'spaceMinerUpgrade3',
    buildingId: 'spaceMiner',
    name: 'Quantum Drones',
    description: 'Space Miners are five times as efficient',
    cost: 10000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Asteroid Harvester upgrades
  {
    id: 'asteroidHarvesterUpgrade1',
    buildingId: 'asteroidHarvester',
    name: 'Improved Mining Tools',
    description: 'Asteroid Harvesters are twice as efficient',
    cost: 1000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'asteroidHarvesterUpgrade2',
    buildingId: 'asteroidHarvester',
    name: 'Precision Drills',
    description: 'Asteroid Harvesters are three times as efficient',
    cost: 10000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'asteroidHarvesterUpgrade3',
    buildingId: 'asteroidHarvester',
    name: 'Molecular Extraction',
    description: 'Asteroid Harvesters are five times as efficient',
    cost: 100000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Lunar Refinery upgrades
  {
    id: 'lunarRefineryUpgrade1',
    buildingId: 'lunarRefinery',
    name: 'Enhanced Smelting',
    description: 'Lunar Refineries are twice as efficient',
    cost: 10000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'lunarRefineryUpgrade2',
    buildingId: 'lunarRefinery',
    name: 'Thermal Optimization',
    description: 'Lunar Refineries are three times as efficient',
    cost: 100000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'lunarRefineryUpgrade3',
    buildingId: 'lunarRefinery',
    name: 'Fusion Refining',
    description: 'Lunar Refineries are five times as efficient',
    cost: 1000000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Solar Collector upgrades
  {
    id: 'solarCollectorUpgrade1',
    buildingId: 'solarCollector',
    name: 'Focused Arrays',
    description: 'Solar Collectors are twice as efficient',
    cost: 100000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'solarCollectorUpgrade2',
    buildingId: 'solarCollector',
    name: 'Dyson Swarm',
    description: 'Solar Collectors are three times as efficient',
    cost: 1000000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'solarCollectorUpgrade3',
    buildingId: 'solarCollector',
    name: 'Stellar Harvesting',
    description: 'Solar Collectors are five times as efficient',
    cost: 10000000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Wormhole Generator upgrades
  {
    id: 'wormholeGeneratorUpgrade1',
    buildingId: 'wormholeGenerator',
    name: 'Stable Portals',
    description: 'Wormhole Generators are twice as efficient',
    cost: 1000000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'wormholeGeneratorUpgrade2',
    buildingId: 'wormholeGenerator',
    name: 'Quantum Entanglement',
    description: 'Wormhole Generators are three times as efficient',
    cost: 10000000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'wormholeGeneratorUpgrade3',
    buildingId: 'wormholeGenerator',
    name: 'Reality Manipulation',
    description: 'Wormhole Generators are five times as efficient',
    cost: 100000000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Galactic Nexus upgrades
  {
    id: 'galacticNexusUpgrade1',
    buildingId: 'galacticNexus',
    name: 'Network Optimization',
    description: 'Galactic Nexus is twice as efficient',
    cost: 10000000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'galacticNexusUpgrade2',
    buildingId: 'galacticNexus',
    name: 'Intergalactic Relays',
    description: 'Galactic Nexus is three times as efficient',
    cost: 100000000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'galacticNexusUpgrade3',
    buildingId: 'galacticNexus',
    name: 'Universal Connection',
    description: 'Galactic Nexus is five times as efficient',
    cost: 1000000000,
    multiplier: 5,
    requiredCount: 50,
  },

  // Universe Engine upgrades
  {
    id: 'universeEngineUpgrade1',
    buildingId: 'universeEngine',
    name: 'Spacetime Weaving',
    description: 'Universe Engines are twice as efficient',
    cost: 100000000,
    multiplier: 2,
    requiredCount: 10,
  },
  {
    id: 'universeEngineUpgrade2',
    buildingId: 'universeEngine',
    name: 'Reality Forging',
    description: 'Universe Engines are three times as efficient',
    cost: 1000000000,
    multiplier: 3,
    requiredCount: 25,
  },
  {
    id: 'universeEngineUpgrade3',
    buildingId: 'universeEngine',
    name: 'Cosmic Creation',
    description: 'Universe Engines are five times as efficient',
    cost: 10000000000,
    multiplier: 5,
    requiredCount: 50,
  },
];

/**
 * Get a building by ID
 */
export function getBuildingById(id: string): Building | undefined {
  return BUILDINGS.find((building) => building.id === id);
}

/**
 * Get all upgrades for a specific building
 */
export function getBuildingUpgrades(buildingId: string): BuildingUpgrade[] {
  return BUILDING_UPGRADES.filter((upgrade) => upgrade.buildingId === buildingId);
}
