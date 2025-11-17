/**
 * Ship module definitions for Cosmic Clicker Phase 1
 * Based on GAME_DESIGN_V2.md ship systems
 */

export type ModuleType =
  | 'laser'
  | 'bot_bay'
  | 'converter'
  | 'cargo'
  | 'engine'
  | 'jump_drive'
  | 'scanner';

export interface ModuleStats {
  // Laser stats
  damage?: number;
  range?: number;
  cooldown?: number;
  laserCount?: number;
  autoTarget?: boolean;

  // Bot Bay stats
  botCount?: number;
  botMiningSpeed?: number; // Resources per second per bot
  botRange?: number;
  botCapacity?: number;

  // Converter stats
  conversionSpeed?: number; // Resources per second
  conversionEfficiency?: number; // Multiplier on base conversion rates (1.0 = 100%)
  autoConvertPercent?: number; // 0-100, percentage to auto-convert
  unlockedTiers?: number[]; // Which resource tiers can be converted

  // Cargo stats
  cargoCapacity?: number;
  cargoSlots?: number;

  // Engine stats
  fuelEfficiency?: number; // Multiplier on fuel consumption (1.0 = 100%, 0.5 = 50%)
  tankCapacity?: number;
  unlockedSpeeds?: string[]; // Which speed modes are unlocked

  // Jump Drive stats
  jumpTier?: number;
  chargeTime?: number; // Seconds
  jumpEfficiency?: number; // Fuel cost multiplier

  // Scanner stats
  scannerRange?: number;
  resourceScanner?: boolean;
  artifactDetector?: boolean;
}

export interface ModuleUpgrade {
  id: string;
  moduleType: ModuleType;
  name: string;
  description: string;
  cost: number; // Credits
  prerequisiteIds?: string[]; // Must purchase these upgrades first
  statChanges: Partial<ModuleStats>;
}

// ===== INITIAL MODULE STATS =====
export const INITIAL_MODULES: Record<ModuleType, ModuleStats> = {
  laser: {
    damage: 1,
    range: 100,
    cooldown: 0.5,
    laserCount: 1,
    autoTarget: false,
  },
  bot_bay: {
    botCount: 0, // Must unlock first
    botMiningSpeed: 0.2, // 1 resource per 5 seconds
    botRange: 80,
    botCapacity: 10,
  },
  converter: {
    conversionSpeed: 0.5, // 1 resource per 2 seconds
    conversionEfficiency: 1.0, // 100%
    autoConvertPercent: 50,
    unlockedTiers: [1], // Only Tier 1 (Stone, Carbon)
  },
  cargo: {
    cargoCapacity: 100,
    cargoSlots: 3,
  },
  engine: {
    fuelEfficiency: 1.0, // 100% (normal consumption)
    tankCapacity: 1000,
    unlockedSpeeds: ['stop', 'slow', 'normal'], // Fast and Boost locked
  },
  jump_drive: {
    jumpTier: 1, // Can access zones 1-3
    chargeTime: 10,
    jumpEfficiency: 1.0,
  },
  scanner: {
    scannerRange: 300,
    resourceScanner: false,
    artifactDetector: false,
  },
};

// ===== MODULE UPGRADES =====
export const MODULE_UPGRADES: ModuleUpgrade[] = [
  // ===== LASER UPGRADES =====
  {
    id: 'laser_damage_1',
    moduleType: 'laser',
    name: 'Focused Beam I',
    description: 'Increase laser damage to 2',
    cost: 100,
    statChanges: { damage: 2 },
  },
  {
    id: 'laser_damage_2',
    moduleType: 'laser',
    name: 'Focused Beam II',
    description: 'Increase laser damage to 5',
    cost: 500,
    prerequisiteIds: ['laser_damage_1'],
    statChanges: { damage: 5 },
  },
  {
    id: 'laser_damage_3',
    moduleType: 'laser',
    name: 'Focused Beam III',
    description: 'Increase laser damage to 10',
    cost: 2500,
    prerequisiteIds: ['laser_damage_2'],
    statChanges: { damage: 10 },
  },
  {
    id: 'laser_damage_4',
    moduleType: 'laser',
    name: 'Focused Beam IV',
    description: 'Increase laser damage to 25',
    cost: 12000,
    prerequisiteIds: ['laser_damage_3'],
    statChanges: { damage: 25 },
  },
  {
    id: 'laser_damage_5',
    moduleType: 'laser',
    name: 'Focused Beam V',
    description: 'Increase laser damage to 50',
    cost: 60000,
    prerequisiteIds: ['laser_damage_4'],
    statChanges: { damage: 50 },
  },
  {
    id: 'laser_range_1',
    moduleType: 'laser',
    name: 'Extended Range I',
    description: 'Increase laser range to 150px',
    cost: 200,
    statChanges: { range: 150 },
  },
  {
    id: 'laser_range_2',
    moduleType: 'laser',
    name: 'Extended Range II',
    description: 'Increase laser range to 200px',
    cost: 800,
    prerequisiteIds: ['laser_range_1'],
    statChanges: { range: 200 },
  },
  {
    id: 'laser_range_3',
    moduleType: 'laser',
    name: 'Extended Range III',
    description: 'Increase laser range to 300px',
    cost: 4000,
    prerequisiteIds: ['laser_range_2'],
    statChanges: { range: 300 },
  },
  {
    id: 'laser_cooldown_1',
    moduleType: 'laser',
    name: 'Rapid Fire I',
    description: 'Reduce cooldown to 0.3s',
    cost: 300,
    statChanges: { cooldown: 0.3 },
  },
  {
    id: 'laser_cooldown_2',
    moduleType: 'laser',
    name: 'Rapid Fire II',
    description: 'Reduce cooldown to 0.2s',
    cost: 1500,
    prerequisiteIds: ['laser_cooldown_1'],
    statChanges: { cooldown: 0.2 },
  },
  {
    id: 'laser_cooldown_3',
    moduleType: 'laser',
    name: 'Rapid Fire III',
    description: 'Reduce cooldown to 0.1s',
    cost: 8000,
    prerequisiteIds: ['laser_cooldown_2'],
    statChanges: { cooldown: 0.1 },
  },
  {
    id: 'laser_multi_1',
    moduleType: 'laser',
    name: 'Dual Lasers',
    description: 'Fire 2 lasers simultaneously',
    cost: 2000,
    statChanges: { laserCount: 2 },
  },
  {
    id: 'laser_multi_2',
    moduleType: 'laser',
    name: 'Triple Lasers',
    description: 'Fire 3 lasers simultaneously',
    cost: 10000,
    prerequisiteIds: ['laser_multi_1'],
    statChanges: { laserCount: 3 },
  },
  {
    id: 'laser_auto_target',
    moduleType: 'laser',
    name: 'Auto-Targeting System',
    description: 'Laser automatically targets nearest object',
    cost: 5000,
    statChanges: { autoTarget: true },
  },

  // ===== BOT BAY UPGRADES =====
  {
    id: 'bot_unlock',
    moduleType: 'bot_bay',
    name: 'Unlock Bot Bay',
    description: 'Deploy your first mining bot',
    cost: 500,
    statChanges: { botCount: 1 },
  },
  {
    id: 'bot_count_1',
    moduleType: 'bot_bay',
    name: 'Expand Bot Bay I',
    description: 'Deploy 3 mining bots',
    cost: 2000,
    prerequisiteIds: ['bot_unlock'],
    statChanges: { botCount: 3 },
  },
  {
    id: 'bot_count_2',
    moduleType: 'bot_bay',
    name: 'Expand Bot Bay II',
    description: 'Deploy 5 mining bots',
    cost: 8000,
    prerequisiteIds: ['bot_count_1'],
    statChanges: { botCount: 5 },
  },
  {
    id: 'bot_count_3',
    moduleType: 'bot_bay',
    name: 'Expand Bot Bay III',
    description: 'Deploy 10 mining bots',
    cost: 35000,
    prerequisiteIds: ['bot_count_2'],
    statChanges: { botCount: 10 },
  },
  {
    id: 'bot_speed_1',
    moduleType: 'bot_bay',
    name: 'Enhanced Bot Efficiency I',
    description: 'Bots mine 1 resource per 3 seconds',
    cost: 1500,
    prerequisiteIds: ['bot_unlock'],
    statChanges: { botMiningSpeed: 0.333 },
  },
  {
    id: 'bot_speed_2',
    moduleType: 'bot_bay',
    name: 'Enhanced Bot Efficiency II',
    description: 'Bots mine 1 resource per second',
    cost: 6000,
    prerequisiteIds: ['bot_speed_1'],
    statChanges: { botMiningSpeed: 1.0 },
  },
  {
    id: 'bot_speed_3',
    moduleType: 'bot_bay',
    name: 'Enhanced Bot Efficiency III',
    description: 'Bots mine 2 resources per second',
    cost: 25000,
    prerequisiteIds: ['bot_speed_2'],
    statChanges: { botMiningSpeed: 2.0 },
  },
  {
    id: 'bot_range_1',
    moduleType: 'bot_bay',
    name: 'Extended Bot Range I',
    description: 'Increase bot range to 120px',
    cost: 1000,
    prerequisiteIds: ['bot_unlock'],
    statChanges: { botRange: 120 },
  },
  {
    id: 'bot_range_2',
    moduleType: 'bot_bay',
    name: 'Extended Bot Range II',
    description: 'Increase bot range to 180px',
    cost: 5000,
    prerequisiteIds: ['bot_range_1'],
    statChanges: { botRange: 180 },
  },
  {
    id: 'bot_capacity_1',
    moduleType: 'bot_bay',
    name: 'Larger Bot Storage I',
    description: 'Bots carry 25 resources before returning',
    cost: 2500,
    prerequisiteIds: ['bot_unlock'],
    statChanges: { botCapacity: 25 },
  },
  {
    id: 'bot_capacity_2',
    moduleType: 'bot_bay',
    name: 'Larger Bot Storage II',
    description: 'Bots carry 50 resources before returning',
    cost: 12000,
    prerequisiteIds: ['bot_capacity_1'],
    statChanges: { botCapacity: 50 },
  },

  // ===== CONVERTER UPGRADES =====
  {
    id: 'converter_speed_1',
    moduleType: 'converter',
    name: 'Faster Conversion I',
    description: 'Convert 1 resource per second',
    cost: 400,
    statChanges: { conversionSpeed: 1.0 },
  },
  {
    id: 'converter_speed_2',
    moduleType: 'converter',
    name: 'Faster Conversion II',
    description: 'Convert 2 resources per second',
    cost: 2000,
    prerequisiteIds: ['converter_speed_1'],
    statChanges: { conversionSpeed: 2.0 },
  },
  {
    id: 'converter_speed_3',
    moduleType: 'converter',
    name: 'Faster Conversion III',
    description: 'Convert 5 resources per second',
    cost: 10000,
    prerequisiteIds: ['converter_speed_2'],
    statChanges: { conversionSpeed: 5.0 },
  },
  {
    id: 'converter_efficiency_1',
    moduleType: 'converter',
    name: 'Improved Efficiency I',
    description: '+10% conversion efficiency (110% total)',
    cost: 1500,
    statChanges: { conversionEfficiency: 1.1 },
  },
  {
    id: 'converter_efficiency_2',
    moduleType: 'converter',
    name: 'Improved Efficiency II',
    description: '+25% conversion efficiency (125% total)',
    cost: 8000,
    prerequisiteIds: ['converter_efficiency_1'],
    statChanges: { conversionEfficiency: 1.25 },
  },
  {
    id: 'converter_efficiency_3',
    moduleType: 'converter',
    name: 'Improved Efficiency III',
    description: '+50% conversion efficiency (150% total)',
    cost: 40000,
    prerequisiteIds: ['converter_efficiency_2'],
    statChanges: { conversionEfficiency: 1.5 },
  },
  {
    id: 'converter_tier_2',
    moduleType: 'converter',
    name: 'Unlock Tier 2 Resources',
    description: 'Enable conversion of Iron and Ice',
    cost: 3000,
    statChanges: { unlockedTiers: [1, 2] },
  },
  {
    id: 'converter_tier_3',
    moduleType: 'converter',
    name: 'Unlock Tier 3 Resources',
    description: 'Enable conversion of Gold and Titanium',
    cost: 20000,
    prerequisiteIds: ['converter_tier_2'],
    statChanges: { unlockedTiers: [1, 2, 3] },
  },

  // ===== CARGO HOLD UPGRADES =====
  {
    id: 'cargo_capacity_1',
    moduleType: 'cargo',
    name: 'Cargo Expansion I',
    description: 'Increase capacity to 250',
    cost: 300,
    statChanges: { cargoCapacity: 250 },
  },
  {
    id: 'cargo_capacity_2',
    moduleType: 'cargo',
    name: 'Cargo Expansion II',
    description: 'Increase capacity to 500',
    cost: 1500,
    prerequisiteIds: ['cargo_capacity_1'],
    statChanges: { cargoCapacity: 500 },
  },
  {
    id: 'cargo_capacity_3',
    moduleType: 'cargo',
    name: 'Cargo Expansion III',
    description: 'Increase capacity to 1000',
    cost: 7500,
    prerequisiteIds: ['cargo_capacity_2'],
    statChanges: { cargoCapacity: 1000 },
  },
  {
    id: 'cargo_capacity_4',
    moduleType: 'cargo',
    name: 'Cargo Expansion IV',
    description: 'Increase capacity to 2500',
    cost: 35000,
    prerequisiteIds: ['cargo_capacity_3'],
    statChanges: { cargoCapacity: 2500 },
  },
  {
    id: 'cargo_slots_1',
    moduleType: 'cargo',
    name: 'Additional Resource Slots I',
    description: 'Store 5 different resource types',
    cost: 1000,
    statChanges: { cargoSlots: 5 },
  },
  {
    id: 'cargo_slots_2',
    moduleType: 'cargo',
    name: 'Additional Resource Slots II',
    description: 'Store 8 different resource types',
    cost: 5000,
    prerequisiteIds: ['cargo_slots_1'],
    statChanges: { cargoSlots: 8 },
  },

  // ===== ENGINE UPGRADES =====
  {
    id: 'engine_efficiency_1',
    moduleType: 'engine',
    name: 'Fuel Economy I',
    description: 'Reduce fuel consumption by 10% (90% consumption)',
    cost: 800,
    statChanges: { fuelEfficiency: 0.9 },
  },
  {
    id: 'engine_efficiency_2',
    moduleType: 'engine',
    name: 'Fuel Economy II',
    description: 'Reduce fuel consumption by 20% (80% consumption)',
    cost: 4000,
    prerequisiteIds: ['engine_efficiency_1'],
    statChanges: { fuelEfficiency: 0.8 },
  },
  {
    id: 'engine_efficiency_3',
    moduleType: 'engine',
    name: 'Fuel Economy III',
    description: 'Reduce fuel consumption by 30% (70% consumption)',
    cost: 20000,
    prerequisiteIds: ['engine_efficiency_2'],
    statChanges: { fuelEfficiency: 0.7 },
  },
  {
    id: 'engine_tank_1',
    moduleType: 'engine',
    name: 'Expanded Fuel Tank I',
    description: 'Increase fuel capacity to 5,000',
    cost: 1000,
    statChanges: { tankCapacity: 5000 },
  },
  {
    id: 'engine_tank_2',
    moduleType: 'engine',
    name: 'Expanded Fuel Tank II',
    description: 'Increase fuel capacity to 10,000',
    cost: 5000,
    prerequisiteIds: ['engine_tank_1'],
    statChanges: { tankCapacity: 10000 },
  },
  {
    id: 'engine_tank_3',
    moduleType: 'engine',
    name: 'Expanded Fuel Tank III',
    description: 'Increase fuel capacity to 50,000',
    cost: 25000,
    prerequisiteIds: ['engine_tank_2'],
    statChanges: { tankCapacity: 50000 },
  },
  {
    id: 'engine_unlock_fast',
    moduleType: 'engine',
    name: 'Unlock Fast Speed',
    description: 'Enable Fast speed mode (2x speed, 2x fuel)',
    cost: 2000,
    statChanges: { unlockedSpeeds: ['stop', 'slow', 'normal', 'fast'] },
  },
  {
    id: 'engine_unlock_boost',
    moduleType: 'engine',
    name: 'Unlock Boost Speed',
    description: 'Enable Boost speed mode (3x speed, 5x fuel)',
    cost: 15000,
    prerequisiteIds: ['engine_unlock_fast'],
    statChanges: { unlockedSpeeds: ['stop', 'slow', 'normal', 'fast', 'boost'] },
  },

  // ===== JUMP DRIVE UPGRADES =====
  {
    id: 'jump_tier_2',
    moduleType: 'jump_drive',
    name: 'Tier 2 Jump Drive',
    description: 'Unlock access to zones 4-6',
    cost: 10000,
    statChanges: { jumpTier: 2 },
  },
  {
    id: 'jump_charge_1',
    moduleType: 'jump_drive',
    name: 'Faster Charging I',
    description: 'Reduce charge time to 7 seconds',
    cost: 3000,
    statChanges: { chargeTime: 7 },
  },
  {
    id: 'jump_charge_2',
    moduleType: 'jump_drive',
    name: 'Faster Charging II',
    description: 'Reduce charge time to 5 seconds',
    cost: 12000,
    prerequisiteIds: ['jump_charge_1'],
    statChanges: { chargeTime: 5 },
  },
  {
    id: 'jump_efficiency_1',
    moduleType: 'jump_drive',
    name: 'Efficient Jump I',
    description: 'Reduce jump fuel cost by 10% (90% cost)',
    cost: 5000,
    statChanges: { jumpEfficiency: 0.9 },
  },
  {
    id: 'jump_efficiency_2',
    moduleType: 'jump_drive',
    name: 'Efficient Jump II',
    description: 'Reduce jump fuel cost by 25% (75% cost)',
    cost: 25000,
    prerequisiteIds: ['jump_efficiency_1'],
    statChanges: { jumpEfficiency: 0.75 },
  },

  // ===== SCANNER UPGRADES =====
  {
    id: 'scanner_range_1',
    moduleType: 'scanner',
    name: 'Extended Scanner I',
    description: 'Increase detection range to 500px',
    cost: 600,
    statChanges: { scannerRange: 500 },
  },
  {
    id: 'scanner_range_2',
    moduleType: 'scanner',
    name: 'Extended Scanner II',
    description: 'Increase detection range to 800px',
    cost: 3000,
    prerequisiteIds: ['scanner_range_1'],
    statChanges: { scannerRange: 800 },
  },
  {
    id: 'scanner_range_3',
    moduleType: 'scanner',
    name: 'Extended Scanner III',
    description: 'Increase detection range to 1200px',
    cost: 15000,
    prerequisiteIds: ['scanner_range_2'],
    statChanges: { scannerRange: 1200 },
  },
  {
    id: 'scanner_resource',
    moduleType: 'scanner',
    name: 'Resource Scanner',
    description: 'See resource type and quantity in objects',
    cost: 4000,
    statChanges: { resourceScanner: true },
  },
  {
    id: 'scanner_artifact',
    moduleType: 'scanner',
    name: 'Artifact Detector',
    description: 'Highlight objects containing artifacts',
    cost: 10000,
    statChanges: { artifactDetector: true },
  },
];

// Helper functions
export function getUpgradesByModule(moduleType: ModuleType): ModuleUpgrade[] {
  return MODULE_UPGRADES.filter((u) => u.moduleType === moduleType);
}

export function getUpgradeById(id: string): ModuleUpgrade | undefined {
  return MODULE_UPGRADES.find((u) => u.id === id);
}

export function canPurchaseUpgrade(
  upgradeId: string,
  purchasedUpgradeIds: string[],
  credits: number
): boolean {
  const upgrade = getUpgradeById(upgradeId);
  if (!upgrade) return false;

  // Check if already purchased
  if (purchasedUpgradeIds.includes(upgradeId)) return false;

  // Check if can afford
  if (credits < upgrade.cost) return false;

  // Check prerequisites
  if (upgrade.prerequisiteIds) {
    return upgrade.prerequisiteIds.every((prereqId) =>
      purchasedUpgradeIds.includes(prereqId)
    );
  }

  return true;
}
