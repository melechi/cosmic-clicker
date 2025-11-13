import React from 'react';

export interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
  /** Optional label to display */
  label?: string;
  /** Optional CSS class names */
  className?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * Progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  className = '',
  showPercentage = false,
  variant = 'primary',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const barColor = variantColors[variant];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1 text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && <span className="text-gray-400">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
