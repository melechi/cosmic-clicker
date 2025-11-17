import React, { useEffect, useState } from 'react';
import { formatNumber } from '@/utils/formatting/numberFormat';

export interface ClickParticleProps {
  x: number;
  y: number;
  value: number;
  onComplete: () => void;
}

/**
 * Animated particle that shows fuel gained from clicking
 */
export const ClickParticle: React.FC<ClickParticleProps> = ({ x, y, value, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none text-yellow-400 font-bold text-2xl animate-float-up z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    >
      +{formatNumber(value)}
    </div>
  );
};
