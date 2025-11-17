/**
 * Object templates for Cosmic Clicker Phase 1
 * Based on GAME_DESIGN_V2.md objects & interactions
 */

export interface LootEntry {
  resourceId: string;
  minAmount: number;
  maxAmount: number;
  probability: number; // 0-1, chance this loot drops
}

export interface ObjectTemplate {
  id: string;
  name: string;
  type: 'asteroid' | 'debris' | 'derelict' | 'special';
  size: 'small' | 'medium' | 'large';
  hp: number;
  lootTable: LootEntry[];
  visual: {
    icon: string;
    color?: string;
    width: number; // pixels
    height: number; // pixels
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare';
  description: string;
}

export const OBJECT_TEMPLATES: ObjectTemplate[] = [
  // ===== ASTEROIDS - Stone =====
  {
    id: 'asteroid_stone_small',
    name: 'Small Stone Asteroid',
    type: 'asteroid',
    size: 'small',
    hp: 10,
    lootTable: [
      { resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 1.0 },
    ],
    visual: { icon: '🪨', color: '#888', width: 40, height: 40 },
    rarity: 'common',
    description: 'A small rocky asteroid containing stone.',
  },
  {
    id: 'asteroid_stone_medium',
    name: 'Medium Stone Asteroid',
    type: 'asteroid',
    size: 'medium',
    hp: 50,
    lootTable: [
      { resourceId: 'stone', minAmount: 20, maxAmount: 30, probability: 1.0 },
    ],
    visual: { icon: '🪨', color: '#888', width: 60, height: 60 },
    rarity: 'common',
    description: 'A medium-sized rocky asteroid.',
  },
  {
    id: 'asteroid_stone_large',
    name: 'Large Stone Asteroid',
    type: 'asteroid',
    size: 'large',
    hp: 100,
    lootTable: [
      { resourceId: 'stone', minAmount: 40, maxAmount: 50, probability: 1.0 },
    ],
    visual: { icon: '🪨', color: '#888', width: 80, height: 80 },
    rarity: 'uncommon',
    description: 'A large rocky asteroid with abundant stone.',
  },

  // ===== ASTEROIDS - Carbon =====
  {
    id: 'asteroid_carbon_small',
    name: 'Small Carbon Asteroid',
    type: 'asteroid',
    size: 'small',
    hp: 10,
    lootTable: [
      { resourceId: 'carbon', minAmount: 5, maxAmount: 10, probability: 1.0 },
    ],
    visual: { icon: '⚫', color: '#222', width: 40, height: 40 },
    rarity: 'common',
    description: 'A small dark asteroid containing carbon.',
  },
  {
    id: 'asteroid_carbon_medium',
    name: 'Medium Carbon Asteroid',
    type: 'asteroid',
    size: 'medium',
    hp: 50,
    lootTable: [
      { resourceId: 'carbon', minAmount: 20, maxAmount: 30, probability: 1.0 },
    ],
    visual: { icon: '⚫', color: '#222', width: 60, height: 60 },
    rarity: 'common',
    description: 'A medium-sized carbon-rich asteroid.',
  },
  {
    id: 'asteroid_carbon_large',
    name: 'Large Carbon Asteroid',
    type: 'asteroid',
    size: 'large',
    hp: 100,
    lootTable: [
      { resourceId: 'carbon', minAmount: 40, maxAmount: 50, probability: 1.0 },
    ],
    visual: { icon: '⚫', color: '#222', width: 80, height: 80 },
    rarity: 'uncommon',
    description: 'A large carbon-rich asteroid.',
  },

  // ===== ASTEROIDS - Iron =====
  {
    id: 'asteroid_iron_small',
    name: 'Small Iron Asteroid',
    type: 'asteroid',
    size: 'small',
    hp: 15,
    lootTable: [
      { resourceId: 'iron', minAmount: 3, maxAmount: 8, probability: 1.0 },
    ],
    visual: { icon: '🔩', color: '#a85', width: 40, height: 40 },
    rarity: 'uncommon',
    description: 'A small metallic asteroid containing iron.',
  },
  {
    id: 'asteroid_iron_medium',
    name: 'Medium Iron Asteroid',
    type: 'asteroid',
    size: 'medium',
    hp: 60,
    lootTable: [
      { resourceId: 'iron', minAmount: 15, maxAmount: 25, probability: 1.0 },
    ],
    visual: { icon: '🔩', color: '#a85', width: 60, height: 60 },
    rarity: 'uncommon',
    description: 'A medium-sized iron-rich asteroid.',
  },
  {
    id: 'asteroid_iron_large',
    name: 'Large Iron Asteroid',
    type: 'asteroid',
    size: 'large',
    hp: 120,
    lootTable: [
      { resourceId: 'iron', minAmount: 35, maxAmount: 45, probability: 1.0 },
    ],
    visual: { icon: '🔩', color: '#a85', width: 80, height: 80 },
    rarity: 'rare',
    description: 'A large iron asteroid with abundant metal.',
  },

  // ===== ASTEROIDS - Ice =====
  {
    id: 'asteroid_ice_small',
    name: 'Small Ice Asteroid',
    type: 'asteroid',
    size: 'small',
    hp: 8,
    lootTable: [
      { resourceId: 'ice', minAmount: 4, maxAmount: 9, probability: 1.0 },
    ],
    visual: { icon: '❄️', color: '#aef', width: 40, height: 40 },
    rarity: 'uncommon',
    description: 'A small frozen asteroid.',
  },
  {
    id: 'asteroid_ice_medium',
    name: 'Medium Ice Asteroid',
    type: 'asteroid',
    size: 'medium',
    hp: 40,
    lootTable: [
      { resourceId: 'ice', minAmount: 18, maxAmount: 28, probability: 1.0 },
    ],
    visual: { icon: '❄️', color: '#aef', width: 60, height: 60 },
    rarity: 'uncommon',
    description: 'A medium-sized ice asteroid.',
  },
  {
    id: 'asteroid_ice_large',
    name: 'Large Ice Asteroid',
    type: 'asteroid',
    size: 'large',
    hp: 90,
    lootTable: [
      { resourceId: 'ice', minAmount: 38, maxAmount: 48, probability: 1.0 },
    ],
    visual: { icon: '❄️', color: '#aef', width: 80, height: 80 },
    rarity: 'rare',
    description: 'A large ice asteroid.',
  },

  // ===== ASTEROIDS - Gold =====
  {
    id: 'asteroid_gold_small',
    name: 'Small Gold Asteroid',
    type: 'asteroid',
    size: 'small',
    hp: 20,
    lootTable: [
      { resourceId: 'gold', minAmount: 2, maxAmount: 5, probability: 1.0 },
    ],
    visual: { icon: '🏅', color: '#fd0', width: 40, height: 40 },
    rarity: 'rare',
    description: 'A small precious metal asteroid.',
  },
  {
    id: 'asteroid_gold_medium',
    name: 'Medium Gold Asteroid',
    type: 'asteroid',
    size: 'medium',
    hp: 80,
    lootTable: [
      { resourceId: 'gold', minAmount: 10, maxAmount: 20, probability: 1.0 },
    ],
    visual: { icon: '🏅', color: '#fd0', width: 60, height: 60 },
    rarity: 'rare',
    description: 'A medium-sized gold-rich asteroid.',
  },

  // ===== DEBRIS =====
  {
    id: 'debris_scrap',
    name: 'Scrap Debris',
    type: 'debris',
    size: 'small',
    hp: 5,
    lootTable: [
      { resourceId: 'carbon', minAmount: 2, maxAmount: 5, probability: 0.7 },
      { resourceId: 'iron', minAmount: 1, maxAmount: 3, probability: 0.3 },
    ],
    visual: { icon: '🛠️', color: '#666', width: 35, height: 35 },
    rarity: 'common',
    description: 'Fragile space debris containing scrap materials.',
  },
  {
    id: 'debris_container',
    name: 'Cargo Container',
    type: 'debris',
    size: 'medium',
    hp: 15,
    lootTable: [
      { resourceId: 'stone', minAmount: 5, maxAmount: 10, probability: 0.4 },
      { resourceId: 'carbon', minAmount: 3, maxAmount: 8, probability: 0.4 },
      { resourceId: 'iron', minAmount: 2, maxAmount: 5, probability: 0.2 },
    ],
    visual: { icon: '📦', color: '#964', width: 45, height: 45 },
    rarity: 'uncommon',
    description: 'A sealed cargo container with random resources.',
  },
  {
    id: 'debris_fuel_tank',
    name: 'Fuel Tank',
    type: 'debris',
    size: 'small',
    hp: 10,
    lootTable: [
      { resourceId: 'ice', minAmount: 5, maxAmount: 15, probability: 1.0 },
    ],
    visual: { icon: '⛽', color: '#f80', width: 40, height: 40 },
    rarity: 'uncommon',
    description: 'An old fuel tank with convertible materials.',
  },

  // ===== DERELICTS =====
  {
    id: 'derelict_escape_pod',
    name: 'Escape Pod',
    type: 'derelict',
    size: 'small',
    hp: 200,
    lootTable: [
      { resourceId: 'iron', minAmount: 20, maxAmount: 40, probability: 1.0 },
      { resourceId: 'carbon', minAmount: 10, maxAmount: 20, probability: 0.8 },
      { resourceId: 'titanium', minAmount: 1, maxAmount: 3, probability: 0.1 },
    ],
    visual: { icon: '🛸', color: '#ccc', width: 70, height: 50 },
    rarity: 'rare',
    description: 'An abandoned escape pod with valuable salvage.',
  },
  {
    id: 'derelict_shuttle',
    name: 'Derelict Shuttle',
    type: 'derelict',
    size: 'medium',
    hp: 500,
    lootTable: [
      { resourceId: 'iron', minAmount: 50, maxAmount: 100, probability: 1.0 },
      { resourceId: 'titanium', minAmount: 10, maxAmount: 25, probability: 0.6 },
      { resourceId: 'gold', minAmount: 5, maxAmount: 15, probability: 0.3 },
    ],
    visual: { icon: '🚀', color: '#aaa', width: 90, height: 70 },
    rarity: 'rare',
    description: 'A damaged shuttle with high-value materials.',
  },
  {
    id: 'derelict_cruiser',
    name: 'Derelict Cruiser',
    type: 'derelict',
    size: 'large',
    hp: 1000,
    lootTable: [
      { resourceId: 'iron', minAmount: 100, maxAmount: 200, probability: 1.0 },
      { resourceId: 'titanium', minAmount: 30, maxAmount: 60, probability: 0.8 },
      { resourceId: 'gold', minAmount: 15, maxAmount: 35, probability: 0.5 },
      { resourceId: 'platinum', minAmount: 3, maxAmount: 10, probability: 0.15 },
    ],
    visual: { icon: '🛸', color: '#888', width: 120, height: 90 },
    rarity: 'very_rare',
    description: 'A massive derelict cruiser with incredible salvage.',
  },
];

// Helper function to get template by ID
export function getObjectTemplateById(id: string): ObjectTemplate | undefined {
  return OBJECT_TEMPLATES.find((t) => t.id === id);
}

// Helper function to get templates by type
export function getObjectTemplatesByType(
  type: 'asteroid' | 'debris' | 'derelict' | 'special'
): ObjectTemplate[] {
  return OBJECT_TEMPLATES.filter((t) => t.type === type);
}
