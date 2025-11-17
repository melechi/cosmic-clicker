import type { ZoneConfig } from '@/types';

/**
 * Zone configurations
 * Each zone requires a certain amount of fuel to complete
 */
export const ZONES: ZoneConfig[] = [
  {
    number: 1,
    name: 'Asteroid Belt',
    fuelRequired: 10000, // 10K fuel to complete Zone 1
    color: '#a16207',
    bgColor: '#fef3c7',
  },
  {
    number: 2,
    name: 'Ice Field',
    fuelRequired: 50000, // 50K fuel to complete Zone 2
    color: '#0369a1',
    bgColor: '#e0f2fe',
  },
  {
    number: 3,
    name: 'Nebula Cloud',
    fuelRequired: 250000, // 250K fuel to complete Zone 3
    color: '#a21caf',
    bgColor: '#fae8ff',
  },
  {
    number: 4,
    name: 'Debris Field',
    fuelRequired: 1000000, // 1M fuel to complete Zone 4
    color: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    number: 5,
    name: 'Dark Matter',
    fuelRequired: 5000000, // 5M fuel to complete Zone 5
    color: '#4c1d95',
    bgColor: '#ede9fe',
  },
  {
    number: 6,
    name: '???',
    fuelRequired: Infinity, // Unknown zone - infinite requirement
    color: '#64748b',
    bgColor: '#f1f5f9',
  },
];

/**
 * Get zone configuration by zone number
 */
export function getZoneConfig(zoneNumber: number): ZoneConfig {
  return ZONES[zoneNumber - 1] || ZONES[ZONES.length - 1];
}

/**
 * Get fuel required for current zone
 */
export function getFuelRequiredForZone(zoneNumber: number): number {
  const zone = getZoneConfig(zoneNumber);
  return zone.fuelRequired;
}

/**
 * Check if player can warp to next zone
 */
export function canWarpToNextZone(currentZone: number, zoneProgress: number): boolean {
  const zone = getZoneConfig(currentZone);
  return zoneProgress >= zone.fuelRequired && currentZone < ZONES.length;
}
