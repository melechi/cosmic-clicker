import type { Meta, StoryObj } from '@storybook/react';
import { BackgroundParticles } from './BackgroundParticles';

const meta: Meta<typeof BackgroundParticles> = {
  title: 'Effects/BackgroundParticles',
  component: BackgroundParticles,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BackgroundParticles>;

export const Default: Story = {
  args: {
    enabled: true,
    count: 100,
  },
  render: (args) => (
    <div className="relative w-full h-screen bg-gray-950">
      <BackgroundParticles {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-2xl">Background Particles Demo</div>
      </div>
    </div>
  ),
};

export const FewParticles: Story = {
  args: {
    enabled: true,
    count: 25,
  },
  render: (args) => (
    <div className="relative w-full h-screen bg-gray-950">
      <BackgroundParticles {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-2xl">Few Particles (25)</div>
      </div>
    </div>
  ),
};

export const ManyParticles: Story = {
  args: {
    enabled: true,
    count: 200,
  },
  render: (args) => (
    <div className="relative w-full h-screen bg-gray-950">
      <BackgroundParticles {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-2xl">Many Particles (200)</div>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    enabled: false,
    count: 100,
  },
  render: (args) => (
    <div className="relative w-full h-screen bg-gray-950">
      <BackgroundParticles {...args} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-2xl">Particles Disabled</div>
      </div>
    </div>
  ),
};
