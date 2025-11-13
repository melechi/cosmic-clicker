import React, { useState, useCallback } from 'react';
import { ClickParticle } from './ClickParticle';
import { usePulse } from '@/hooks/useAnimation';

export interface ClickerProps {
  clickPower: number;
  onClick: () => void;
  disabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

/**
 * Main clickable element for generating stardust
 */
export const Clicker: React.FC<ClickerProps> = ({ clickPower, onClick, disabled = false }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextParticleId, setNextParticleId] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  const scale = usePulse(clickCount, { duration: 200, scale: 1.1 });

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
    <div className="relative flex items-center justify-center p-8">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-64 h-64 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
          shadow-2xl hover:shadow-blue-500/50 transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-blue-400
          active:scale-95
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:from-blue-400 hover:to-purple-500'}
        `}
        style={{ transform: `scale(${scale})` }}
        aria-label={`Click to generate ${clickPower} stardust`}
        aria-disabled={disabled}
      >
        {/* Cosmic Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl select-none" role="img" aria-hidden="true">
            ✨
          </span>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl animate-pulse" />
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
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-400 text-sm">Click to collect stardust!</p>
      </div>
    </div>
  );
};
