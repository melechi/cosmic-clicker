import React from 'react';

export interface SpaceshipProps {
  size?: number;
  className?: string;
}

/**
 * SVG Spaceship component
 * A sleek, futuristic spaceship design
 */
export const Spaceship: React.FC<SpaceshipProps> = ({ size = 120, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Engine glow (bottom) */}
      <ellipse cx="60" cy="100" rx="20" ry="8" fill="#60a5fa" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="60" cy="100" rx="15" ry="6" fill="#93c5fd" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Main body - sleek hull */}
      <path
        d="M 60 20 L 75 50 L 75 85 L 70 95 L 50 95 L 45 85 L 45 50 Z"
        fill="url(#shipGradient)"
        stroke="#1e40af"
        strokeWidth="2"
      />

      {/* Cockpit window */}
      <ellipse cx="60" cy="35" rx="8" ry="10" fill="#60a5fa" opacity="0.7" />
      <ellipse cx="60" cy="35" rx="6" ry="8" fill="#93c5fd" opacity="0.9" />
      <circle cx="60" cy="32" r="2" fill="#dbeafe" opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Wing - left */}
      <path
        d="M 45 55 L 30 70 L 35 80 L 45 75 Z"
        fill="url(#wingGradient)"
        stroke="#1e40af"
        strokeWidth="2"
      />

      {/* Wing - right */}
      <path
        d="M 75 55 L 90 70 L 85 80 L 75 75 Z"
        fill="url(#wingGradient)"
        stroke="#1e40af"
        strokeWidth="2"
      />

      {/* Engine details */}
      <rect x="48" y="90" width="5" height="8" rx="1" fill="#3b82f6" />
      <rect x="67" y="90" width="5" height="8" rx="1" fill="#3b82f6" />

      {/* Nose cone */}
      <path
        d="M 60 20 L 65 30 L 55 30 Z"
        fill="#dbeafe"
        stroke="#60a5fa"
        strokeWidth="1"
      />

      {/* Detail lines */}
      <line x1="60" y1="45" x2="60" y2="85" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
      <line x1="52" y1="50" x2="52" y2="85" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="68" y1="50" x2="68" y2="85" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />

      {/* Accent lights */}
      <circle cx="48" cy="60" r="2" fill="#fbbf24">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="72" cy="60" r="2" fill="#fbbf24">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
      </circle>

      {/* Gradients */}
      <defs>
        <linearGradient id="shipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Engine flame effect */}
      <g opacity="0.7">
        <ellipse cx="52" cy="98" rx="3" ry="8" fill="#fbbf24">
          <animate attributeName="ry" values="8;12;8" dur="0.3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="68" cy="98" rx="3" ry="8" fill="#fbbf24">
          <animate attributeName="ry" values="8;12;8" dur="0.3s" repeatCount="indefinite" begin="0.15s" />
        </ellipse>
        <ellipse cx="60" cy="98" rx="4" ry="10" fill="#f59e0b">
          <animate attributeName="ry" values="10;14;10" dur="0.3s" repeatCount="indefinite" begin="0.1s" />
        </ellipse>
      </g>
    </svg>
  );
};
