import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a basic card with some content inside.',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    children: 'Card content goes here.',
  },
};

export const Hoverable: Story = {
  args: {
    children: 'Hover over this card to see the effect.',
    hoverable: true,
  },
};

export const Clickable: Story = {
  args: {
    children: 'Click this card!',
    onClick: () => alert('Card clicked!'),
  },
};

export const WithCustomStyling: Story = {
  args: {
    children: 'Card with custom border color.',
    className: 'border-purple-500',
  },
};

export const ComplexContent: Story = {
  args: {
    title: 'Building Card',
    children: (
      <div>
        <p className="text-gray-300 mb-2">Space Miner</p>
        <p className="text-yellow-400 text-sm">Cost: 10 SD</p>
        <p className="text-green-400 text-sm">Production: 0.1 SD/sec</p>
        <p className="text-gray-400 text-sm mt-2">Owned: 5</p>
      </div>
    ),
  },
};
