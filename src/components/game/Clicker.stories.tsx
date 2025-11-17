import type { Meta, StoryObj } from '@storybook/react';
import { Clicker } from './Clicker';
import { GameProvider } from '@/context';

const meta: Meta<typeof Clicker> = {
  title: 'Game/Clicker',
  component: Clicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <GameProvider>
        <div style={{ width: '800px', height: '600px' }}>
          <Story />
        </div>
      </GameProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Clicker>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
