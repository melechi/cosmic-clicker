import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar, SidebarTab } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Interactive wrapper for Storybook
function SidebarWrapper({ initialTab }: { initialTab: SidebarTab }) {
  const [activeTab, setActiveTab] = useState<SidebarTab>(initialTab);
  return <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />;
}

export const Default: Story = {
  render: () => <SidebarWrapper initialTab="buildings" />,
};

export const BuildingsTab: Story = {
  render: () => <SidebarWrapper initialTab="buildings" />,
};

export const UpgradesTab: Story = {
  render: () => <SidebarWrapper initialTab="upgrades" />,
};

export const AchievementsTab: Story = {
  render: () => <SidebarWrapper initialTab="achievements" />,
};

export const PrestigeTab: Story = {
  render: () => <SidebarWrapper initialTab="prestige" />,
};

export const StatisticsTab: Story = {
  render: () => <SidebarWrapper initialTab="statistics" />,
};

export const SettingsTab: Story = {
  render: () => <SidebarWrapper initialTab="settings" />,
};
