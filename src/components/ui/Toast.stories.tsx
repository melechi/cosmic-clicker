import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { useState } from 'react';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: 'The type of toast notification',
    },
    message: {
      control: 'text',
      description: 'The message to display in the toast',
    },
    duration: {
      control: 'number',
      description: 'Duration in milliseconds before auto-dismiss',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when toast is closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

/**
 * Success toast with green styling - used for positive actions
 */
export const Success: Story = {
  args: {
    id: 'success-1',
    message: 'Achievement Unlocked: First Click!',
    type: 'success',
    duration: 3000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Info toast with blue styling - used for informational messages
 */
export const Info: Story = {
  args: {
    id: 'info-1',
    message: 'New building available: Asteroid Harvester',
    type: 'info',
    duration: 3000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Warning toast with yellow styling - used for warnings
 */
export const Warning: Story = {
  args: {
    id: 'warning-1',
    message: 'Not enough stardust to purchase',
    type: 'warning',
    duration: 3000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Error toast with red styling - used for errors
 */
export const Error: Story = {
  args: {
    id: 'error-1',
    message: 'Failed to load saved game',
    type: 'error',
    duration: 3000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Toast with longer duration (5 seconds)
 */
export const LongDuration: Story = {
  args: {
    id: 'long-1',
    message: 'This toast will stay visible for 5 seconds',
    type: 'info',
    duration: 5000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Toast with short duration (1 second)
 */
export const ShortDuration: Story = {
  args: {
    id: 'short-1',
    message: 'Quick message!',
    type: 'success',
    duration: 1000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Toast with long message text
 */
export const LongMessage: Story = {
  args: {
    id: 'long-msg-1',
    message:
      'This is a very long toast message that demonstrates how the toast handles longer text content. It should wrap nicely and remain readable.',
    type: 'info',
    duration: 5000,
    onClose: () => console.log('Toast closed'),
  },
};

/**
 * Interactive example showing manual close
 */
export const InteractiveClose: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
      return (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">Toast was closed!</p>
          <button
            onClick={() => setIsVisible(true)}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Show Toast Again
          </button>
        </div>
      );
    }

    return (
      <div className="w-80">
        <Toast
          id="interactive-1"
          message="Click the X button to close me manually"
          type="info"
          duration={10000}
          onClose={() => {
            console.log('Toast closed');
            setIsVisible(false);
          }}
        />
      </div>
    );
  },
};

/**
 * Example showing all toast types together
 */
export const AllTypes: Story = {
  render: () => {
    const [toasts, setToasts] = useState([
      { id: '1', message: 'Success message', type: 'success' as const },
      { id: '2', message: 'Info message', type: 'info' as const },
      { id: '3', message: 'Warning message', type: 'warning' as const },
      { id: '4', message: 'Error message', type: 'error' as const },
    ]);

    return (
      <div className="flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={10000}
            onClose={(id) => {
              console.log('Toast closed:', id);
              setToasts((prev) => prev.filter((t) => t.id !== id));
            }}
          />
        ))}
      </div>
    );
  },
};

/**
 * Game-specific examples for Cosmic Clicker
 */
export const GameExamples: Story = {
  render: () => {
    const gameToasts = [
      {
        id: '1',
        message: 'Prestiged! Gained 10 Nebula Crystals',
        type: 'success' as const,
      },
      {
        id: '2',
        message: 'Achievement Unlocked: 100 Clicks!',
        type: 'success' as const,
      },
      {
        id: '3',
        message: 'Unlocked: Wormhole Generator',
        type: 'info' as const,
      },
      {
        id: '4',
        message: 'Insufficient funds for this upgrade',
        type: 'warning' as const,
      },
    ];

    return (
      <div className="flex w-80 flex-col gap-2">
        {gameToasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={10000}
            onClose={(id) => console.log('Toast closed:', id)}
          />
        ))}
      </div>
    );
  },
};
