import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrestigeButton } from './PrestigeButton';

const meta: Meta<typeof PrestigeButton> = {
  title: 'Game/PrestigeButton',
  component: PrestigeButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onPrestige: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PrestigeButton>;

export const NotAvailable: Story = {
  args: {
    canPrestige: false,
    crystalsToGain: 0,
  },
};

export const Available: Story = {
  args: {
    canPrestige: true,
    crystalsToGain: 10,
  },
};

export const LargeAmount: Story = {
  args: {
    canPrestige: true,
    crystalsToGain: 1000,
  },
};

export const VeryLargeAmount: Story = {
  args: {
    canPrestige: true,
    crystalsToGain: 1000000,
  },
};

export const Disabled: Story = {
  args: {
    canPrestige: true,
    crystalsToGain: 10,
    disabled: true,
  },
};
