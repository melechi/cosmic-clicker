/**
 * Zone spawn tables for Cosmic Clicker Phase 1
 * Based on GAME_DESIGN_V2.md zone system
 */

export interface SpawnEntry {
  templateId: string;
  weight: number; // Relative probability (higher = more common)
}

export interface ZoneSpawnTable {
  zoneId: number;
  zoneName: string;
  spawnEntries: SpawnEntry[];
  spawnRate: number; // Objects per second
  difficulty: number; // Multiplier for HP, rewards, etc.
}

export const ZONE_SPAWN_TABLES: ZoneSpawnTable[] = [
  // ===== ZONE 1: Asteroid Belt =====
  {
    zoneId: 1,
    zoneName: 'Asteroid Belt',
    spawnRate: 1.0,
    difficulty: 1.0,
    spawnEntries: [
      // Stone asteroids (45%)
      { templateId: 'asteroid_stone_small', weight: 30 },
      { templateId: 'asteroid_stone_medium', weight: 15 },

      // Carbon asteroids (30%)
      { templateId: 'asteroid_carbon_small', weight: 20 },
      { templateId: 'asteroid_carbon_medium', weight: 10 },

      // Debris (20%)
      { templateId: 'debris_scrap', weight: 15 },
      { templateId: 'debris_container', weight: 5 },

      // Derelicts (4%)
      { templateId: 'derelict_escape_pod', weight: 4 },

      // Future: Gates (1%)
      // { templateId: 'special_gate', weight: 1 },
    ],
  },

  // ===== ZONE 2: Debris Field =====
  {
    zoneId: 2,
    zoneName: 'Debris Field',
    spawnRate: 1.2,
    difficulty: 1.3,
    spawnEntries: [
      // Stone asteroids (20%)
      { templateId: 'asteroid_stone_small', weight: 10 },
      { templateId: 'asteroid_stone_medium', weight: 7 },
      { templateId: 'asteroid_stone_large', weight: 3 },

      // Carbon asteroids (25%)
      { templateId: 'asteroid_carbon_small', weight: 15 },
      { templateId: 'asteroid_carbon_medium', weight: 8 },
      { templateId: 'asteroid_carbon_large', weight: 2 },

      // Iron asteroids (15%)
      { templateId: 'asteroid_iron_small', weight: 10 },
      { templateId: 'asteroid_iron_medium', weight: 5 },

      // Debris (30%)
      { templateId: 'debris_scrap', weight: 20 },
      { templateId: 'debris_container', weight: 8 },
      { templateId: 'debris_fuel_tank', weight: 2 },

      // Derelicts (10%)
      { templateId: 'derelict_escape_pod', weight: 7 },
      { templateId: 'derelict_shuttle', weight: 3 },
    ],
  },

  // ===== ZONE 3: Ice Ring =====
  {
    zoneId: 3,
    zoneName: 'Ice Ring',
    spawnRate: 1.4,
    difficulty: 1.6,
    spawnEntries: [
      // Stone asteroids (10%)
      { templateId: 'asteroid_stone_medium', weight: 6 },
      { templateId: 'asteroid_stone_large', weight: 4 },

      // Carbon asteroids (15%)
      { templateId: 'asteroid_carbon_medium', weight: 10 },
      { templateId: 'asteroid_carbon_large', weight: 5 },

      // Iron asteroids (20%)
      { templateId: 'asteroid_iron_small', weight: 8 },
      { templateId: 'asteroid_iron_medium', weight: 10 },
      { templateId: 'asteroid_iron_large', weight: 2 },

      // Ice asteroids (30%)
      { templateId: 'asteroid_ice_small', weight: 15 },
      { templateId: 'asteroid_ice_medium', weight: 12 },
      { templateId: 'asteroid_ice_large', weight: 3 },

      // Debris (15%)
      { templateId: 'debris_container', weight: 8 },
      { templateId: 'debris_fuel_tank', weight: 7 },

      // Derelicts (10%)
      { templateId: 'derelict_escape_pod', weight: 5 },
      { templateId: 'derelict_shuttle', weight: 5 },
    ],
  },

  // ===== ZONE 4: Mining Outpost =====
  {
    zoneId: 4,
    zoneName: 'Mining Outpost',
    spawnRate: 1.6,
    difficulty: 2.0,
    spawnEntries: [
      // Carbon asteroids (10%)
      { templateId: 'asteroid_carbon_large', weight: 10 },

      // Iron asteroids (25%)
      { templateId: 'asteroid_iron_medium', weight: 15 },
      { templateId: 'asteroid_iron_large', weight: 10 },

      // Ice asteroids (20%)
      { templateId: 'asteroid_ice_medium', weight: 12 },
      { templateId: 'asteroid_ice_large', weight: 8 },

      // Gold asteroids (15%)
      { templateId: 'asteroid_gold_small', weight: 10 },
      { templateId: 'asteroid_gold_medium', weight: 5 },

      // Debris (15%)
      { templateId: 'debris_container', weight: 10 },
      { templateId: 'debris_fuel_tank', weight: 5 },

      // Derelicts (15%)
      { templateId: 'derelict_escape_pod', weight: 5 },
      { templateId: 'derelict_shuttle', weight: 8 },
      { templateId: 'derelict_cruiser', weight: 2 },
    ],
  },

  // ===== ZONE 5: Junk Yard =====
  {
    zoneId: 5,
    zoneName: 'Junk Yard',
    spawnRate: 1.8,
    difficulty: 2.5,
    spawnEntries: [
      // Iron asteroids (20%)
      { templateId: 'asteroid_iron_medium', weight: 10 },
      { templateId: 'asteroid_iron_large', weight: 10 },

      // Ice asteroids (15%)
      { templateId: 'asteroid_ice_medium', weight: 8 },
      { templateId: 'asteroid_ice_large', weight: 7 },

      // Gold asteroids (15%)
      { templateId: 'asteroid_gold_small', weight: 8 },
      { templateId: 'asteroid_gold_medium', weight: 7 },

      // Debris (25%)
      { templateId: 'debris_scrap', weight: 5 },
      { templateId: 'debris_container', weight: 15 },
      { templateId: 'debris_fuel_tank', weight: 5 },

      // Derelicts (25%)
      { templateId: 'derelict_escape_pod', weight: 8 },
      { templateId: 'derelict_shuttle', weight: 12 },
      { templateId: 'derelict_cruiser', weight: 5 },
    ],
  },

  // ===== ZONE 6: Rich Belt =====
  {
    zoneId: 6,
    zoneName: 'Rich Belt',
    spawnRate: 2.0,
    difficulty: 3.0,
    spawnEntries: [
      // Iron asteroids (15%)
      { templateId: 'asteroid_iron_large', weight: 15 },

      // Ice asteroids (15%)
      { templateId: 'asteroid_ice_large', weight: 15 },

      // Gold asteroids (30%)
      { templateId: 'asteroid_gold_small', weight: 10 },
      { templateId: 'asteroid_gold_medium', weight: 20 },

      // Debris (15%)
      { templateId: 'debris_container', weight: 10 },
      { templateId: 'debris_fuel_tank', weight: 5 },

      // Derelicts (25%)
      { templateId: 'derelict_shuttle', weight: 12 },
      { templateId: 'derelict_cruiser', weight: 13 },
    ],
  },
];

// Helper function to get spawn table by zone ID
export function getSpawnTableByZoneId(
  zoneId: number
): ZoneSpawnTable | undefined {
  return ZONE_SPAWN_TABLES.find((table) => table.zoneId === zoneId);
}

// Helper function to select a random template based on weights
export function selectRandomTemplate(zoneId: number): string | undefined {
  const table = getSpawnTableByZoneId(zoneId);
  if (!table) return undefined;

  const totalWeight = table.spawnEntries.reduce(
    (sum, entry) => sum + entry.weight,
    0
  );
  let random = Math.random() * totalWeight;

  for (const entry of table.spawnEntries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.templateId;
    }
  }

  // Fallback to first entry if something goes wrong
  return table.spawnEntries[0]?.templateId;
}
