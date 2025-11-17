import React, { useState, useCallback, useMemo } from 'react';
import { ClickParticle } from './ClickParticle';
import { Spaceship } from '../effects/Spaceship';
import { MiningBot } from '../effects/MiningBot';
import { usePulse } from '@/hooks/useAnimation';

export interface ClickerProps {
  clickPower: number;
  onClick: () => void;
  disabled?: boolean;
  spaceMinerCount?: number; // Number of Space Miner buildings owned
}

interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

/**
 * Main clickable element for collecting fuel
 */
export const Clicker: React.FC<ClickerProps> = ({
  clickPower,
  onClick,
  disabled = false,
  spaceMinerCount = 0,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextParticleId, setNextParticleId] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  const scale = usePulse(clickCount, { duration: 200, scale: 1.1 });

  // Calculate number of visual mining bots (1 per 10 miners)
  const visualBotCount = useMemo(() => {
    return Math.floor(spaceMinerCount / 10);
  }, [spaceMinerCount]);

  // Generate bot positions in orbit around the star
  const botPositions = useMemo(() => {
    const positions = [];
    const radius = 180; // Distance from center

    for (let i = 0; i < visualBotCount; i++) {
      const angle = (360 / visualBotCount) * i;
      positions.push({ angle, distance: radius, index: i });
    }

    return positions;
  }, [visualBotCount]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Trigger click callback
      onClick();

      // Create particle at click position
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setParticles((prev) => [
        ...prev,
        {
          id: nextParticleId,
          x,
          y,
          value: clickPower,
        },
      ]);
      setNextParticleId((id) => id + 1);
      setClickCount((count) => count + 1);
    },
    [onClick, clickPower, nextParticleId, disabled]
  );

  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <div className="relative flex items-center justify-center p-8 min-h-[500px]">
      {/* SVG container for mining bots - positioned behind button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          style={{
            width: '500px',
            height: '500px',
            overflow: 'visible',
          }}
          viewBox="-250 -250 500 500"
        >
          {/* Render mining bots */}
          {botPositions.map((pos) => (
            <MiningBot
              key={pos.index}
              angle={pos.angle}
              distance={pos.distance}
              index={pos.index}
            />
          ))}
        </svg>
      </div>

      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-64 h-64 transition-all duration-200
          focus:outline-none active:scale-95 z-10
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ transform: `scale(${scale})`, background: 'transparent' }}
        aria-label={`Click to generate ${clickPower} fuel`}
        aria-disabled={disabled}
      >
        {/* Spaceship - rotated to face upward */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Spaceship size={180} />
        </div>
      </button>

      {/* Click Particles */}
      {particles.map((particle) => (
        <ClickParticle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          value={particle.value}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}

      {/* Instruction Text */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <p className="text-gray-400 text-sm">Click to collect fuel!</p>
      </div>
    </div>
  );
};
