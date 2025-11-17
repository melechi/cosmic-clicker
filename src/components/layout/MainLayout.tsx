import React from 'react';
import { Header, HeaderProps } from './Header';
import { Sidebar, SidebarTab } from './Sidebar';
import { Footer } from './Footer';

export interface MainLayoutProps {
  /** Header props (fuel, production, etc.) */
  headerProps: HeaderProps;
  /** Active sidebar tab */
  activeTab: SidebarTab;
  /** Callback when sidebar tab changes */
  onTabChange: (tab: SidebarTab) => void;
  /** Main content area */
  children: React.ReactNode;
  /** Optional footer content */
  footerContent?: React.ReactNode;
}

/**
 * Main layout component that combines header, sidebar, content area, and footer
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  headerProps,
  activeTab,
  onTabChange,
  children,
  footerContent,
}) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content Area - No sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Content */}
        <main
          className="flex-1 overflow-y-auto"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      {footerContent && <Footer>{footerContent}</Footer>}
    </div>
  );
};
