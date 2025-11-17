/**
 * Export all game constants
 */
export { BUILDINGS, BUILDING_UPGRADES, getBuildingById, getBuildingUpgrades } from './buildings';
export {
  CLICK_UPGRADES,
  AUTO_CLICK_UPGRADES,
  PRODUCTION_UPGRADES,
  PRESTIGE_UPGRADES,
  ALL_UPGRADES,
  getUpgradeById,
  getUpgradesByType,
} from './upgrades';
export { ACHIEVEMENTS, getAchievementById, getAchievementsByCategory } from './achievements';
export { GAME_CONFIG, UI_CONFIG } from './gameConfig';
export { ZONES, getZoneConfig, getFuelRequiredForZone, canWarpToNextZone } from './zones';
