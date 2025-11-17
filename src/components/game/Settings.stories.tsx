import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from './Settings';
import { GameProvider } from '@/context/GameContext';
import { ToastProvider } from '@/context/ToastContext';
import { useState } from 'react';

const meta = {
  title: 'Game/Settings',
  component: Settings,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <GameProvider>
          <Story />
        </GameProvider>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Settings component with interactive modal
 */
const SettingsWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Settings
      </button>
      <Settings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close clicked'),
  },
  render: () => <SettingsWrapper />,
};

/**
 * Settings opened by default
 */
export const Opened: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
  },
};

/**
 * Settings closed
 */
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('Close clicked'),
  },
};

/**
 * Settings with Save/Load tab
 */
const SaveLoadTabStory = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Click "Save/Load" tab to see save management options
      </p>
      <Settings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const SaveLoadTab: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
  },
  render: () => <SaveLoadTabStory />,
};

/**
 * Settings with About tab
 */
const AboutTabStory = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <p className="mb-4 text-gray-600">
        Click "About" tab to see game information
      </p>
      <Settings isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const AboutTab: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close clicked'),
  },
  render: () => <AboutTabStory />,
};
