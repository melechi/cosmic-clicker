import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NumberCountUp } from './NumberCountUp';
import { Button } from '@/components/ui/Button';

const meta: Meta<typeof NumberCountUp> = {
  title: 'Effects/NumberCountUp',
  component: NumberCountUp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberCountUp>;

export const Formatted: Story = {
  args: {
    value: 1234567,
    format: true,
    duration: 500,
  },
  render: (args) => (
    <div className="text-4xl font-bold text-blue-400">
      <NumberCountUp {...args} />
    </div>
  ),
};

export const Unformatted: Story = {
  args: {
    value: 1234.567,
    format: false,
    decimals: 2,
    duration: 500,
  },
  render: (args) => (
    <div className="text-4xl font-bold text-green-400">
      <NumberCountUp {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="space-y-4">
        <div className="text-5xl font-bold text-purple-400">
          <NumberCountUp value={value} format={true} duration={800} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setValue(value + 100)}>+100</Button>
          <Button onClick={() => setValue(value + 1000)}>+1K</Button>
          <Button onClick={() => setValue(value + 1000000)}>+1M</Button>
          <Button variant="danger" onClick={() => setValue(0)}>
            Reset
          </Button>
        </div>
      </div>
    );
  },
};

export const LargeNumbers: Story = {
  render: () => {
    const [value, setValue] = useState(1000);

    return (
      <div className="space-y-4">
        <div className="text-6xl font-bold text-yellow-400">
          <NumberCountUp value={value} format={true} duration={1000} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setValue(1000)}>1K</Button>
          <Button onClick={() => setValue(1000000)}>1M</Button>
          <Button onClick={() => setValue(1000000000)}>1B</Button>
          <Button onClick={() => setValue(1000000000000)}>1T</Button>
        </div>
      </div>
    );
  },
};

export const FastAnimation: Story = {
  args: {
    value: 999999,
    format: true,
    duration: 200,
  },
  render: (args) => (
    <div className="text-4xl font-bold text-red-400">
      <NumberCountUp {...args} />
    </div>
  ),
};

export const SlowAnimation: Story = {
  args: {
    value: 123456,
    format: true,
    duration: 2000,
  },
  render: (args) => (
    <div className="text-4xl font-bold text-cyan-400">
      <NumberCountUp {...args} />
    </div>
  ),
};
