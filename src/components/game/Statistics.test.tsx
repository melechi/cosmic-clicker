import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Statistics } from './Statistics';
import type { GameStatistics } from '@/types';

const mockStatistics: GameStatistics = {
  totalClicks: 5000,
  totalPlayTime: 7325, // 2h 2m 5s
  currentSessionTime: 300,
  totalPrestiges: 2,
  buildingsPurchased: 150,
  upgradesPurchased: 10,
};

describe('Statistics', () => {
  it('should render header and description', () => {
    render(<Statistics statistics={mockStatistics} />);

    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText(/your cosmic journey in numbers/i)).toBeInTheDocument();
  });

  it('should render all statistics labels', () => {
    render(<Statistics statistics={mockStatistics} />);

    expect(screen.getByText('Total Clicks')).toBeInTheDocument();
    expect(screen.getByText('Total Buildings Purchased')).toBeInTheDocument();
    expect(screen.getByText('Total Upgrades Purchased')).toBeInTheDocument();
    expect(screen.getByText('Prestige Count')).toBeInTheDocument();
    expect(screen.getByText('Play Time')).toBeInTheDocument();
    expect(screen.getByText('Current Session Time')).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(<Statistics statistics={mockStatistics} />);

    expect(screen.getByText('5.00K')).toBeInTheDocument(); // totalClicks
  });

  it('should format playtime correctly', () => {
    render(<Statistics statistics={mockStatistics} />);

    expect(screen.getByText('2h 2m 5s')).toBeInTheDocument();
  });

  it('should format playtime without hours when less than 1 hour', () => {
    const stats = { ...mockStatistics, totalPlayTime: 125 }; // 2m 5s
    render(<Statistics statistics={stats} />);

    expect(screen.getByText('2m 5s')).toBeInTheDocument();
  });

  it('should format playtime as seconds only when less than 1 minute', () => {
    const stats = { ...mockStatistics, totalPlayTime: 45 };
    render(<Statistics statistics={stats} />);

    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroStats: GameStatistics = {
      totalClicks: 0,
      totalPlayTime: 0,
      currentSessionTime: 0,
      totalPrestiges: 0,
      buildingsPurchased: 0,
      upgradesPurchased: 0,
    };

    render(<Statistics statistics={zeroStats} />);

    const zeroValues = screen.getAllByText('0');
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it('should render statistics in grid layout', () => {
    const { container } = render(<Statistics statistics={mockStatistics} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('should apply correct color classes', () => {
    const { container } = render(<Statistics statistics={mockStatistics} />);

    expect(container.querySelector('.text-yellow-400')).toBeInTheDocument();
    expect(container.querySelector('.text-purple-400')).toBeInTheDocument();
  });
});
