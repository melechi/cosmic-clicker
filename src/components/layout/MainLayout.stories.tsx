import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MainLayout } from './MainLayout';
import { SidebarTab } from './Sidebar';
import { Card } from '@/components/ui/Card';

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

function MainLayoutWrapper() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('buildings');

  return (
    <MainLayout
      headerProps={{
        fuel: 12345.67,
        productionPerSecond: 250,
        nebulaCrystals: 10,
        clickPower: 5,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footerContent={
        <div className="flex justify-between items-center text-sm">
          <span>Total clicks: 1,234</span>
          <span>Total buildings: 42</span>
          <span>Playtime: 2h 15m</span>
        </div>
      }
    >
      <Card title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Content`}>
        <p className="text-gray-300">
          This is the main content area for the {activeTab} tab.
        </p>
        <p className="text-gray-400 mt-2">
          Click different tabs in the sidebar to see the layout in action.
        </p>
      </Card>
    </MainLayout>
  );
}

export const Default: Story = {
  render: () => <MainLayoutWrapper />,
};

export const EarlyGame: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('buildings');
    return (
      <MainLayout
        headerProps={{
          fuel: 45,
          productionPerSecond: 0.5,
          nebulaCrystals: 0,
          clickPower: 1,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Card title="Early Game">
          <p className="text-gray-300">Starting your cosmic journey...</p>
        </Card>
      </MainLayout>
    );
  },
};

export const LateGame: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('buildings');
    return (
      <MainLayout
        headerProps={{
          fuel: 999999999999,
          productionPerSecond: 50000000,
          nebulaCrystals: 100,
          clickPower: 100000,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        footerContent={
          <div className="flex justify-between items-center text-sm">
            <span>Total clicks: 999,999</span>
            <span>Total buildings: 5,432</span>
            <span>Playtime: 48h 30m</span>
          </div>
        }
      >
        <Card title="Late Game">
          <p className="text-gray-300">Maximum cosmic power!</p>
        </Card>
      </MainLayout>
    );
  },
};

export const WithoutFooter: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('settings');
    return (
      <MainLayout
        headerProps={{
          fuel: 5000,
          productionPerSecond: 50,
          nebulaCrystals: 2,
          clickPower: 3,
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <Card title="Settings">
          <p className="text-gray-300">Game settings and preferences.</p>
        </Card>
      </MainLayout>
    );
  },
};
