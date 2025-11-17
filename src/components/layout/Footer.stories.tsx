import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const WithCustomContent: Story = {
  render: () => (
    <Footer>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Total clicks: 12,345</span>
        <span className="text-gray-400">Total buildings: 89</span>
        <span className="text-gray-400">Playtime: 5h 23m</span>
      </div>
    </Footer>
  ),
};

export const WithStatistics: Story = {
  render: () => (
    <Footer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-500 text-xs">Clicks</div>
          <div className="text-blue-400 font-semibold">1,234,567</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs">Buildings</div>
          <div className="text-green-400 font-semibold">456</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs">Upgrades</div>
          <div className="text-purple-400 font-semibold">23</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500 text-xs">Achievements</div>
          <div className="text-yellow-400 font-semibold">18/50</div>
        </div>
      </div>
    </Footer>
  ),
};

export const WithMinimalContent: Story = {
  render: () => (
    <Footer>
      <div className="text-center text-sm text-gray-500">
        Made with ✨ by the Cosmic Team
      </div>
    </Footer>
  ),
};
