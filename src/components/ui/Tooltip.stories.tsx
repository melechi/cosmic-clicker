import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '100px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>,
  },
};

export const PositionTop: Story = {
  args: {
    content: 'Tooltip on top',
    position: 'top',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>,
  },
};

export const PositionBottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    position: 'bottom',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Bottom</button>,
  },
};

export const PositionLeft: Story = {
  args: {
    content: 'Tooltip on left',
    position: 'left',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>,
  },
};

export const PositionRight: Story = {
  args: {
    content: 'Tooltip on right',
    position: 'right',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>,
  },
};

export const WithComplexContent: Story = {
  args: {
    content: (
      <div>
        <div className="font-bold mb-1">Building Info</div>
        <div className="text-xs">Cost: 100 SD</div>
        <div className="text-xs">Production: 1 SD/sec</div>
      </div>
    ),
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover for info</button>,
  },
};

export const OnIcon: Story = {
  args: {
    content: 'Click to get help',
    children: (
      <span className="inline-flex items-center justify-center w-6 h-6 text-sm bg-gray-700 text-gray-300 rounded-full cursor-help">
        ?
      </span>
    ),
  },
};
