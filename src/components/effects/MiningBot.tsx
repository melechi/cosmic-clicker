import React, { useEffect, useState } from 'react';

export interface MiningBotProps {
  angle: number; // Orbital position in degrees
  distance: number; // Distance from center in pixels
  index: number; // Bot index for animation delay
}

interface LaserState {
  id: number;
  isActive: boolean;
}

export const MiningBot: React.FC<MiningBotProps> = ({ index }) => {
  const [laser, setLaser] = useState<LaserState>({ id: 0, isActive: false });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [shotsFired, setShotsFired] = useState(0);

  // Generate random position around the star
  // Star button is 256px (w-64 h-64), so radius is 128px
  // Add bot radius (12px) + safety margin (20px) = minimum 160px from center
  const getRandomPosition = () => {
    const randomAngle = Math.random() * 360;
    const minDistance = 160; // Clear the star + safety margin
    const maxDistance = 220;
    const randomDistance = minDistance + Math.random() * (maxDistance - minDistance);

    return {
      x: Math.cos((randomAngle * Math.PI) / 180) * randomDistance,
      y: Math.sin((randomAngle * Math.PI) / 180) * randomDistance,
    };
  };

  // Initialize starting position
  useEffect(() => {
    const initialPos = getRandomPosition();
    setPosition(initialPos);
  }, []);

  // Movement and mining behavior
  useEffect(() => {
    const baseDelay = index * 500; // Stagger initial behavior

    const timeout = setTimeout(() => {
      const movementLoop = () => {
        // Pick new target position
        const newTarget = getRandomPosition();
        setIsMoving(true);
        setShotsFired(0);

        // Move to target over 1.5 seconds
        const moveStartTime = performance.now();
        const moveDuration = 1500;
        const startPos = { ...position };

        let moveAnimationId: number;

        const animateMove = (currentTime: number) => {
          const elapsed = currentTime - moveStartTime;
          const progress = Math.min(elapsed / moveDuration, 1);

          // Easing function for smooth movement
          const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          setPosition({
            x: startPos.x + (newTarget.x - startPos.x) * easeProgress,
            y: startPos.y + (newTarget.y - startPos.y) * easeProgress,
          });

          if (progress < 1) {
            moveAnimationId = requestAnimationFrame(animateMove);
          } else {
            setIsMoving(false);
            // Fire lasers at this position (2-4 shots)
            const shotsToFire = 2 + Math.floor(Math.random() * 3);
            fireLaserBurst(shotsToFire);
          }
        };

        moveAnimationId = requestAnimationFrame(animateMove);

        return () => cancelAnimationFrame(moveAnimationId);
      };

      // Start the loop
      movementLoop();

      // Repeat every 5-7 seconds
      const loopInterval = setInterval(movementLoop, 5000 + Math.random() * 2000);

      return () => clearInterval(loopInterval);
    }, baseDelay);

    return () => clearTimeout(timeout);
  }, [index]);

  // Fire a burst of lasers
  const fireLaserBurst = (totalShots: number) => {
    let currentShot = 0;

    const fireNext = () => {
      if (currentShot < totalShots) {
        setLaser((prev) => ({ id: prev.id + 1, isActive: true }));
        setShotsFired(currentShot + 1);

        setTimeout(() => {
          setLaser((prev) => ({ ...prev, isActive: false }));
        }, 300);

        currentShot++;
        setTimeout(fireNext, 500); // 500ms between shots
      }
    };

    fireNext();
  };

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      {/* Mining Bot Body */}
      <circle
        cx="0"
        cy="0"
        r="12"
        fill={isMoving ? "#93c5fd" : "#60a5fa"}
        opacity="0.9"
        stroke="#3b82f6"
        strokeWidth="2"
      >
        <animate
          attributeName="opacity"
          values="0.9;1;0.9"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="0" cy="0" r="8" fill="#93c5fd" />

      {/* Bot "eye" indicator */}
      <circle cx="-3" cy="-3" r="2" fill="#1e40af" />
      <circle cx="3" cy="-3" r="2" fill="#1e40af" />

      {/* Mining indicator when firing */}
      {!isMoving && shotsFired > 0 && (
        <circle cx="0" cy="0" r="15" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6">
          <animate attributeName="r" from="15" to="20" dur="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="0.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Laser beam to center */}
      {laser.isActive && (
        <line
          x1="0"
          y1="0"
          x2={-position.x}
          y2={-position.y}
          stroke="#ef4444"
          strokeWidth="2"
          opacity="0.8"
          className="laser-beam"
        >
          <animate attributeName="opacity" from="0.8" to="0" dur="0.3s" />
          <animate attributeName="stroke-width" from="3" to="1" dur="0.3s" />
        </line>
      )}

      {/* Laser glow effect */}
      {laser.isActive && (
        <line
          x1="0"
          y1="0"
          x2={-position.x}
          y2={-position.y}
          stroke="#fca5a5"
          strokeWidth="4"
          opacity="0.4"
          className="laser-glow"
        >
          <animate attributeName="opacity" from="0.4" to="0" dur="0.3s" />
        </line>
      )}
    </g>
  );
};
