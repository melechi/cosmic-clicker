import React from 'react';

export interface FooterProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Footer component for displaying stats and links
 */
export const Footer: React.FC<FooterProps> = ({ children, className = '' }) => {
  return (
    <footer
      className={`bg-gray-900 border-t border-gray-700 py-3 px-6 ${className}`}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto">
        {children || (
          <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
                aria-label="View help documentation"
              >
                Help
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
                aria-label="Report a bug"
              >
                Report Bug
              </a>
              <a
                href="#"
                className="hover:text-blue-400 transition-colors"
                aria-label="View changelog"
              >
                Changelog
              </a>
            </div>
            <div>
              <span>Cosmic Clicker v1.0.0</span>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
