import React, { useEffect, useState } from 'react';
import type { Position } from '@/types';

export interface LaserBeamProps {
  /** Starting position (ship position) */
  from: Position;
  /** Target position (click position) */
  to: Position;
  /** Whether laser is currently active/visible */
  active: boolean;
  /** Laser color */
  color?: string;
  /** Duration of the laser beam in milliseconds */
  duration?: number;
  /** Whether the laser hit a target */
  hit?: boolean;
  /** Callback when laser animation completes */
  onComplete?: () => void;
}

/**
 * Visual laser beam effect component
 * Renders an animated laser beam from ship to target position
 */
export const LaserBeam: React.FC<LaserBeamProps> = ({
  from,
  to,
  active,
  color = '#60a5fa',
  duration = 200,
  hit = false,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(active);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setOpacity(1);

      // Fade out after duration
      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, duration * 0.6);

      // Remove after full duration
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [active, duration, onComplete]);

  if (!isVisible) {
    return null;
  }

  // Calculate laser beam angle and length
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);

  // Hit color is brighter, miss color is dimmer
  const beamColor = hit ? color : '#6b7280';
  const glowColor = hit ? color : '#4b5563';

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: `${from.x}px`,
        top: `${from.y}px`,
        width: `${length}px`,
        height: '4px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        opacity,
        transition: `opacity ${duration * 0.4}ms ease-out`,
      }}
      aria-hidden="true"
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${glowColor}00 0%, ${glowColor}80 10%, ${glowColor}80 90%, ${glowColor}00 100%)`,
          filter: 'blur(4px)',
          height: '8px',
          top: '-2px',
        }}
      />

      {/* Core beam */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, ${beamColor}00 0%, ${beamColor} 10%, ${beamColor} 90%, ${beamColor}00 100%)`,
          boxShadow: `0 0 8px ${beamColor}, 0 0 4px ${beamColor}`,
        }}
      />

      {/* Impact flash at target */}
      {hit && (
        <div
          className="absolute"
          style={{
            right: '-8px',
            top: '50%',
            transform: 'translate(0, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${beamColor} 0%, ${beamColor}80 30%, transparent 70%)`,
            boxShadow: `0 0 12px ${beamColor}`,
            animation: 'pulse 0.2s ease-out',
          }}
        />
      )}
    </div>
  );
};
