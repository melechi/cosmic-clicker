import React from 'react';

export interface CardProps {
  /** Content to display inside the card */
  children: React.ReactNode;
  /** Optional CSS class names */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional title for the card */
  title?: string;
  /** Whether the card should have hover effects */
  hoverable?: boolean;
}

/**
 * Card component for grouping content
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  title,
  hoverable = false,
}) => {
  const baseClasses = 'bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700';
  const hoverClasses = hoverable ? 'hover:border-blue-500 transition-colors cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`} onClick={onClick}>
      {title && <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>}
      {children}
    </div>
  );
};
