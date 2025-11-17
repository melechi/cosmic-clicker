import type { Meta, StoryObj } from '@storybook/react';
import { ShipControls } from './ShipControls';
import { useState } from 'react';
import type { ShipSpeed } from '@/types';

const meta = {
  title: 'Game/ShipControls',
  component: ShipControls,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentSpeed: {
      control: 'select',
      options: ['stop', 'slow', 'normal', 'fast', 'boost'],
      description: 'Current ship speed setting',
    },
    fuel: {
      control: { type: 'number', min: 0, max: 10000, step: 100 },
      description: 'Current fuel amount',
    },
    tankCapacity: {
      control: { type: 'number', min: 1000, max: 100000, step: 1000 },
      description: 'Maximum fuel tank capacity',
    },
    maxSpeedUnlocked: {
      control: 'select',
      options: ['stop', 'slow', 'normal', 'fast', 'boost'],
      description: 'Maximum speed setting unlocked',
    },
    fuelEfficiencyPercent: {
      control: { type: 'number', min: 25, max: 100, step: 5 },
      description: 'Fuel efficiency percentage (lower = less consumption)',
    },
    onSpeedChange: { action: 'speed changed' },
  },
} satisfies Meta<typeof ShipControls>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Interactive wrapper that handles speed changes
 */
const InteractiveShipControls = (args: any) => {
  const [currentSpeed, setCurrentSpeed] = useState<ShipSpeed>(args.currentSpeed);

  const handleSpeedChange = (speed: ShipSpeed) => {
    setCurrentSpeed(speed);
    args.onSpeedChange(speed);
  };

  return (
    <div className="w-[600px]">
      <ShipControls {...args} currentSpeed={currentSpeed} onSpeedChange={handleSpeedChange} />
    </div>
  );
};

/**
 * Default state - Normal speed with adequate fuel
 */
export const Default: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 500,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * All speeds unlocked
 */
export const AllSpeedsUnlocked: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 800,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'boost',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Low fuel warning
 */
export const LowFuel: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 80,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Out of fuel
 */
export const OutOfFuel: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'stop',
    fuel: 0,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Full tank
 */
export const FullTank: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 1000,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'fast',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Stopped ship
 */
export const Stopped: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'stop',
    fuel: 500,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Slow speed
 */
export const SlowSpeed: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'slow',
    fuel: 600,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'fast',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Fast speed unlocked
 */
export const FastSpeed: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'fast',
    fuel: 700,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'fast',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Boost speed (inefficient)
 */
export const BoostSpeed: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'boost',
    fuel: 900,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'boost',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Improved fuel efficiency (50% consumption)
 */
export const ImprovedEfficiency: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 500,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'fast',
    fuelEfficiencyPercent: 50,
    onSpeedChange: () => {},
  },
};

/**
 * Large tank capacity
 */
export const LargeTank: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 5000,
    tankCapacity: 10000,
    maxSpeedUnlocked: 'boost',
    fuelEfficiencyPercent: 75,
    onSpeedChange: () => {},
  },
};

/**
 * Early game - only basic speeds unlocked
 */
export const EarlyGame: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'normal',
    fuel: 250,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};

/**
 * Late game - all upgrades
 */
export const LateGame: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'fast',
    fuel: 75000,
    tankCapacity: 100000,
    maxSpeedUnlocked: 'boost',
    fuelEfficiencyPercent: 25,
    onSpeedChange: () => {},
  },
};

/**
 * Critical low fuel
 */
export const CriticalLowFuel: Story = {
  render: (args) => <InteractiveShipControls {...args} />,
  args: {
    currentSpeed: 'slow',
    fuel: 10,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'fast',
    fuelEfficiencyPercent: 100,
    onSpeedChange: () => {},
  },
};
