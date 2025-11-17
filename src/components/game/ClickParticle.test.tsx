import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ClickParticle } from './ClickParticle';

describe('ClickParticle', () => {
  it('should render with formatted value', () => {
    const mockOnComplete = vi.fn();
    render(<ClickParticle x={100} y={200} value={1234} onComplete={mockOnComplete} />);

    expect(screen.getByText('+1.23K')).toBeInTheDocument();
  });

  it('should position particle at specified coordinates', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(
      <ClickParticle x={150} y={250} value={10} onComplete={mockOnComplete} />
    );

    const particle = container.querySelector('.absolute');
    expect(particle).toHaveStyle({ left: '150px', top: '250px' });
  });

  it('should call onComplete after animation', async () => {
    const mockOnComplete = vi.fn();
    render(<ClickParticle x={100} y={200} value={10} onComplete={mockOnComplete} />);

    await waitFor(() => expect(mockOnComplete).toHaveBeenCalled(), { timeout: 1500 });
  });

  it('should be hidden from screen readers', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(
      <ClickParticle x={100} y={200} value={10} onComplete={mockOnComplete} />
    );

    const particle = container.querySelector('.absolute');
    expect(particle).toHaveAttribute('aria-hidden', 'true');
  });

  it('should format large numbers correctly', () => {
    const mockOnComplete = vi.fn();
    render(<ClickParticle x={100} y={200} value={1000000} onComplete={mockOnComplete} />);

    expect(screen.getByText('+1.00M')).toBeInTheDocument();
  });

  it('should not be interactive (pointer-events-none)', () => {
    const mockOnComplete = vi.fn();
    const { container } = render(
      <ClickParticle x={100} y={200} value={10} onComplete={mockOnComplete} />
    );

    const particle = container.querySelector('.absolute');
    expect(particle).toHaveClass('pointer-events-none');
  });
});
