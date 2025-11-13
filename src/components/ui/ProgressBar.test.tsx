import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('should render with correct width based on value and max', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);

    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar?.getAttribute('style')).toContain('width: 50%');
  });

  it('should handle 0 value', () => {
    const { container } = render(<ProgressBar value={0} max={100} />);

    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar?.getAttribute('style')).toContain('width: 0%');
  });

  it('should handle max value', () => {
    const { container } = render(<ProgressBar value={100} max={100} />);

    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar?.getAttribute('style')).toContain('width: 100%');
  });

  it('should cap at 100% when value exceeds max', () => {
    const { container } = render(<ProgressBar value={150} max={100} />);

    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar?.getAttribute('style')).toContain('width: 100%');
  });

  it('should display label when provided', () => {
    render(<ProgressBar value={50} max={100} label="Progress" />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should display percentage when showPercentage is true', () => {
    render(<ProgressBar value={75} max={100} showPercentage />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should display both label and percentage', () => {
    render(<ProgressBar value={50} max={100} label="Loading" showPercentage />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<ProgressBar value={50} max={100} className="custom-class" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.classList.contains('custom-class')).toBe(true);
  });

  it('should apply primary variant color by default', () => {
    const { container } = render(<ProgressBar value={50} max={100} />);

    const progressBar = container.querySelector('.bg-blue-500');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply success variant color', () => {
    const { container } = render(<ProgressBar value={50} max={100} variant="success" />);

    const progressBar = container.querySelector('.bg-green-500');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply warning variant color', () => {
    const { container } = render(<ProgressBar value={50} max={100} variant="warning" />);

    const progressBar = container.querySelector('.bg-yellow-500');
    expect(progressBar).toBeInTheDocument();
  });

  it('should apply danger variant color', () => {
    const { container } = render(<ProgressBar value={50} max={100} variant="danger" />);

    const progressBar = container.querySelector('.bg-red-500');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle fractional percentages', () => {
    render(<ProgressBar value={33} max={100} showPercentage />);

    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('should round percentage display', () => {
    render(<ProgressBar value={33.7} max={100} showPercentage />);

    expect(screen.getByText('34%')).toBeInTheDocument();
  });
});
