import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export type SidebarTab = 'buildings' | 'upgrades' | 'achievements' | 'prestige' | 'statistics' | 'settings';

export interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  className?: string;
}

/**
 * Sidebar component for navigation between game panels
 */
export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs: { id: SidebarTab; label: string; icon: string }[] = [
    { id: 'buildings', label: 'Buildings', icon: '🏭' },
    { id: 'upgrades', label: 'Upgrades', icon: '⚡' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'prestige', label: 'Prestige', icon: '💫' },
    { id: 'statistics', label: 'Statistics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside
      className={`bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
      aria-label="Main navigation"
    >
      {/* Collapse Toggle */}
      <div className="p-4 border-b border-gray-700">
        <Button
          variant="secondary"
          size="small"
          fullWidth
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                aria-label={`${tab.label} tab`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="text-2xl" role="img" aria-hidden="true">
                  {tab.icon}
                </span>
                {!isCollapsed && <span className="font-medium">{tab.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Info (when expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
          <p>Version 1.0.0</p>
          <p className="mt-1">Made with ✨</p>
        </div>
      )}
    </aside>
  );
};
