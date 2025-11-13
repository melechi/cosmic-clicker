import React from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { Achievement } from '@/types';

export interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
  currentProgress?: number;
}

/**
 * Individual achievement item with progress tracking
 */
export const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  isUnlocked,
  currentProgress = 0,
}) => {
  // ProgressBar component calculates percentage internally from value and max

  return (
    <Card
      className={`p-4 transition-all ${
        isUnlocked ? 'border-yellow-500/50 bg-yellow-500/5' : 'opacity-75'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`text-4xl flex-shrink-0 ${isUnlocked ? 'grayscale-0' : 'grayscale opacity-50'}`}
          role="img"
          aria-hidden="true"
        >
          🏆
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-white">{achievement.name}</h3>
            {isUnlocked && (
              <span className="text-yellow-400 text-sm font-semibold flex-shrink-0">
                ✓ Unlocked
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>

          {/* Progress */}
          {!isUnlocked && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <Tooltip content={`${currentProgress.toFixed(1)} / ${achievement.threshold}`}>
                  <span>
                    {formatNumber(currentProgress)} / {formatNumber(achievement.threshold)}
                  </span>
                </Tooltip>
              </div>
              <ProgressBar value={currentProgress} max={achievement.threshold} variant="primary" />
            </div>
          )}

          {/* Bonus */}
          {achievement.bonus > 0 && (
            <div className="mt-2 text-xs text-purple-400">
              Bonus: +{(achievement.bonus * 100).toFixed(0)}% production
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
