import React, { useState } from 'react';
import { AchievementItem } from './AchievementItem';
import { Button } from '@/components/ui/Button';
import type { Achievement, AchievementCategory } from '@/types';

export interface AchievementsPanelProps {
  achievements: Achievement[];
  unlockedAchievements: Set<string>;
  getAchievementProgress: (achievementId: string) => number;
}

type FilterCategory = 'all' | AchievementCategory;

/**
 * Panel displaying achievements with category filtering
 */
export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements,
  unlockedAchievements,
  getAchievementProgress,
}) => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const categories: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'click', label: 'Clicks' },
    { id: 'production', label: 'Production' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'prestige', label: 'Prestige' },
  ];

  const filteredAchievements =
    activeCategory === 'all'
      ? achievements
      : achievements.filter((a) => a.category === activeCategory);

  // Separate unlocked and locked achievements
  const unlockedList = filteredAchievements.filter((a) => unlockedAchievements.has(a.id));
  const lockedList = filteredAchievements.filter((a) => !unlockedAchievements.has(a.id));

  const unlockedCount = achievements.filter((a) => unlockedAchievements.has(a.id)).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? Math.floor((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">Achievements</h2>
          <div className="text-right">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-xl font-bold text-yellow-400">
              {unlockedCount} / {totalCount} ({completionPercentage}%)
            </div>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          Unlock achievements to earn rewards and track your progress
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => {
          const categoryAchievements =
            category.id === 'all'
              ? achievements
              : achievements.filter((a) => a.category === category.id);
          const categoryUnlocked = categoryAchievements.filter((a) =>
            unlockedAchievements.has(a.id)
          ).length;

          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setActiveCategory(category.id)}
              aria-label={`${category.label} achievements`}
              aria-current={activeCategory === category.id ? 'page' : undefined}
            >
              {category.label} ({categoryUnlocked}/{categoryAchievements.length})
            </Button>
          );
        })}
      </div>

      {/* Achievements List */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No achievements in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Locked Achievements (shown first to focus on progress) */}
          {lockedList.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                In Progress ({lockedList.length})
              </h3>
              {lockedList.map((achievement) => (
                <AchievementItem
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={false}
                  currentProgress={getAchievementProgress(achievement.id)}
                />
              ))}
            </>
          )}

          {/* Unlocked Achievements */}
          {unlockedList.length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mt-6">
                Completed ({unlockedList.length})
              </h3>
              {unlockedList.map((achievement) => (
                <AchievementItem
                  key={achievement.id}
                  achievement={achievement}
                  isUnlocked={true}
                  currentProgress={achievement.threshold}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
