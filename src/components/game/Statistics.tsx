import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/utils/formatting/numberFormat';
import type { GameStatistics } from '@/types';

export interface StatisticsProps {
  statistics: GameStatistics;
}

/**
 * Display game statistics and progress
 */
export const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const stats = [
    {
      label: 'Total Clicks',
      value: formatNumber(statistics.totalClicks),
      color: 'text-yellow-400',
    },
    {
      label: 'Total Buildings Purchased',
      value: formatNumber(statistics.buildingsPurchased),
      color: 'text-purple-400',
    },
    {
      label: 'Total Upgrades Purchased',
      value: formatNumber(statistics.upgradesPurchased),
      color: 'text-purple-400',
    },
    {
      label: 'Prestige Count',
      value: formatNumber(statistics.totalPrestiges),
      color: 'text-pink-400',
    },
    {
      label: 'Play Time',
      value: formatTime(statistics.totalPlayTime),
      color: 'text-gray-400',
    },
    {
      label: 'Current Session Time',
      value: formatTime(statistics.currentSessionTime),
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Statistics</h2>
        <p className="text-gray-400 text-sm">Your cosmic journey in numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
