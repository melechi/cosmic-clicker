import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    fuel: 1234.56,
    productionPerSecond: 10.5,
    nebulaCrystals: 0,
    clickPower: 1,
  },
};

export const WithNebulaCrystals: Story = {
  args: {
    fuel: 5000000,
    productionPerSecond: 2500,
    nebulaCrystals: 15,
    clickPower: 10,
  },
};

export const LargeNumbers: Story = {
  args: {
    fuel: 9876543210,
    productionPerSecond: 1234567,
    nebulaCrystals: 999,
    clickPower: 5000,
  },
};

export const EarlyGame: Story = {
  args: {
    fuel: 45,
    productionPerSecond: 0.5,
    nebulaCrystals: 0,
    clickPower: 1,
  },
};

export const MidGame: Story = {
  args: {
    fuel: 150000,
    productionPerSecond: 500,
    nebulaCrystals: 3,
    clickPower: 25,
  },
};

export const LateGame: Story = {
  args: {
    fuel: 999999999999,
    productionPerSecond: 50000000,
    nebulaCrystals: 100,
    clickPower: 100000,
  },
};
