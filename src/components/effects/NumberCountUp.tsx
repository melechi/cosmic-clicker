import React from 'react';
import { useAnimatedNumber } from '@/hooks/useAnimation';
import { formatNumber } from '@/utils/formatting/numberFormat';

export interface NumberCountUpProps {
  /** Target number to count up to */
  value: number;
  /** Duration of animation in milliseconds */
  duration?: number;
  /** Whether to format the number with abbreviations */
  format?: boolean;
  /** Number of decimal places (only when format is false) */
  decimals?: number;
  /** Optional CSS class names */
  className?: string;
}

/**
 * Animated number counter that smoothly transitions between values
 */
export const NumberCountUp: React.FC<NumberCountUpProps> = ({
  value,
  duration = 500,
  format = true,
  decimals = 0,
  className = '',
}) => {
  const animatedValue = useAnimatedNumber(value, { duration });

  const displayValue = format
    ? formatNumber(animatedValue)
    : animatedValue.toFixed(decimals);

  return (
    <span className={className} aria-label={`${value}`}>
      {displayValue}
    </span>
  );
};
