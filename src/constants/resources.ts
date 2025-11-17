/**
 * Resource definitions for Cosmic Clicker Phase 1
 * Based on GAME_DESIGN_V2.md resource economy
 */

export interface Resource {
  id: string;
  name: string;
  icon: string;
  tier: 1 | 2 | 3 | 4;
  fuelConversionRate: number; // How much fuel 1 unit converts to
  creditValue: number; // Base sell price per unit
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  description: string;
}

export const RESOURCES: Resource[] = [
  // Tier 1 - Early Zones 1-2
  {
    id: 'stone',
    name: 'Stone',
    icon: '🪨',
    tier: 1,
    fuelConversionRate: 1,
    creditValue: 1,
    rarity: 'common',
    description: 'Common asteroid material. Basic fuel conversion.',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    icon: '⚫',
    tier: 1,
    fuelConversionRate: 1,
    creditValue: 1,
    rarity: 'common',
    description: 'Common organic material found in debris and asteroids.',
  },

  // Tier 2 - Zones 2-4
  {
    id: 'iron',
    name: 'Iron',
    icon: '🔩',
    tier: 2,
    fuelConversionRate: 2,
    creditValue: 3,
    rarity: 'uncommon',
    description: 'Durable metal from iron asteroids and derelicts.',
  },
  {
    id: 'ice',
    name: 'Ice',
    icon: '❄️',
    tier: 2,
    fuelConversionRate: 1.5,
    creditValue: 2,
    rarity: 'uncommon',
    description: 'Frozen water from ice asteroids. Good fuel efficiency.',
  },

  // Tier 3 - Zones 4-6
  {
    id: 'gold',
    name: 'Gold',
    icon: '🏅',
    tier: 3,
    fuelConversionRate: 5,
    creditValue: 10,
    rarity: 'rare',
    description: 'Precious metal with excellent energy properties.',
  },
  {
    id: 'titanium',
    name: 'Titanium',
    icon: '🔧',
    tier: 3,
    fuelConversionRate: 4,
    creditValue: 8,
    rarity: 'rare',
    description: 'Advanced alloy from high-tech derelicts.',
  },

  // Tier 4 - Zones 6+
  {
    id: 'platinum',
    name: 'Platinum',
    icon: '💎',
    tier: 4,
    fuelConversionRate: 10,
    creditValue: 25,
    rarity: 'very_rare',
    description: 'Rare precious metal with high energy density.',
  },
  {
    id: 'iridium',
    name: 'Iridium',
    icon: '⭐',
    tier: 4,
    fuelConversionRate: 15,
    creditValue: 40,
    rarity: 'very_rare',
    description: 'Exotic material from rare cosmic objects.',
  },
  {
    id: 'dark_matter',
    name: 'Dark Matter',
    icon: '🌌',
    tier: 4,
    fuelConversionRate: 50,
    creditValue: 100,
    rarity: 'legendary',
    description: 'Mysterious substance with incredible energy potential.',
  },
];

// Helper function to get resource by ID
export function getResourceById(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

// Helper function to get resources by tier
export function getResourcesByTier(tier: 1 | 2 | 3 | 4): Resource[] {
  return RESOURCES.filter((r) => r.tier === tier);
}
