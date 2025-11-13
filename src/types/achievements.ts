/**
 * Achievement category
 */
export type AchievementCategory = 'click' | 'production' | 'milestone' | 'prestige';

/**
 * Achievement definition
 */
export interface Achievement {
  /** Unique identifier for the achievement */
  id: string;
  /** Display name of the achievement */
  name: string;
  /** Description of how to unlock */
  description: string;
  /** Achievement category */
  category: AchievementCategory;
  /** Condition type for unlock */
  condition: 'totalClicks' | 'buildingCount' | 'totalStardustEarned' | 'totalPrestiges' | 'totalNebulaCrystals';
  /** Value required to unlock (e.g., 100 clicks, 1000000 stardust) */
  threshold: number;
  /** For building-specific achievements, the building ID */
  buildingId?: string;
  /** Production bonus percentage (typically 1% = 0.01) */
  bonus: number;
}
