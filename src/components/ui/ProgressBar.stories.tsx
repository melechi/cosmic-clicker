import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    max: 100,
  },
};

export const WithLabel: Story = {
  args: {
    value: 75,
    max: 100,
    label: 'Progress',
  },
};

export const WithPercentage: Story = {
  args: {
    value: 60,
    max: 100,
    showPercentage: true,
  },
};

export const WithLabelAndPercentage: Story = {
  args: {
    value: 80,
    max: 100,
    label: 'Loading',
    showPercentage: true,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    max: 100,
    label: 'Not Started',
    showPercentage: true,
  },
};

export const Full: Story = {
  args: {
    value: 100,
    max: 100,
    label: 'Complete',
    showPercentage: true,
  },
};

export const Success: Story = {
  args: {
    value: 70,
    max: 100,
    label: 'Success',
    variant: 'success',
    showPercentage: true,
  },
};

export const Warning: Story = {
  args: {
    value: 50,
    max: 100,
    label: 'Warning',
    variant: 'warning',
    showPercentage: true,
  },
};

export const Danger: Story = {
  args: {
    value: 30,
    max: 100,
    label: 'Critical',
    variant: 'danger',
    showPercentage: true,
  },
};
