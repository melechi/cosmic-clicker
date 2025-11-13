import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ClickParticle } from './ClickParticle';

const meta: Meta<typeof ClickParticle> = {
  title: 'Game/ClickParticle',
  component: ClickParticle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClickParticle>;

function ParticleDemo({ value }: { value: number }) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setParticles((prev) => [...prev, { id: nextId, x, y }]);
    setNextId((id) => id + 1);
  };

  const removeParticle = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-96 h-96 bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer"
    >
      <div className="text-gray-400">Click anywhere to spawn particles</div>
      {particles.map((p) => (
        <ClickParticle
          key={p.id}
          x={p.x}
          y={p.y}
          value={value}
          onComplete={() => removeParticle(p.id)}
        />
      ))}
    </div>
  );
}

export const Default: Story = {
  render: () => <ParticleDemo value={1} />,
};

export const LargeValue: Story = {
  render: () => <ParticleDemo value={1000} />,
};

export const VeryLargeValue: Story = {
  render: () => <ParticleDemo value={1000000} />,
};

export const HugeValue: Story = {
  render: () => <ParticleDemo value={1000000000} />,
};
