import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Clicker } from './Clicker';

const meta: Meta<typeof Clicker> = {
  title: 'Game/Clicker',
  component: Clicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Clicker>;

export const Default: Story = {
  args: {
    clickPower: 1,
  },
};

export const HighClickPower: Story = {
  args: {
    clickPower: 100,
  },
};

export const VeryHighClickPower: Story = {
  args: {
    clickPower: 10000,
  },
};

export const Disabled: Story = {
  args: {
    clickPower: 1,
    disabled: true,
  },
};
