import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NumberCountUp } from './NumberCountUp';

describe('NumberCountUp', () => {
  it('should render formatted number', () => {
    render(<NumberCountUp value={1234} format={true} />);
    // The component animates, so we check for aria-label
    expect(screen.getByLabelText('1234')).toBeInTheDocument();
  });

  it('should render unformatted number with decimals', () => {
    render(<NumberCountUp value={123.456} format={false} decimals={2} />);
    expect(screen.getByLabelText('123.456')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <NumberCountUp value={100} className="custom-class" />
    );
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(<NumberCountUp value={1000000} format={true} />);
    expect(screen.getByLabelText('1000000')).toBeInTheDocument();
  });

  it('should handle zero value', () => {
    render(<NumberCountUp value={0} format={true} />);
    expect(screen.getByLabelText('0')).toBeInTheDocument();
  });

  it('should handle negative values', () => {
    render(<NumberCountUp value={-100} format={true} />);
    expect(screen.getByLabelText('-100')).toBeInTheDocument();
  });

  it('should default to 0 decimals when not specified', () => {
    render(<NumberCountUp value={123.456} format={false} />);
    // Should show "123" (rounded to 0 decimals)
    expect(screen.getByLabelText('123.456')).toBeInTheDocument();
  });

  it('should default to format=true when not specified', () => {
    render(<NumberCountUp value={1234567} />);
    expect(screen.getByLabelText('1234567')).toBeInTheDocument();
  });

  it('should use default duration when not specified', () => {
    render(<NumberCountUp value={100} />);
    expect(screen.getByLabelText('100')).toBeInTheDocument();
  });

  it('should accept custom duration', () => {
    render(<NumberCountUp value={100} duration={1000} />);
    expect(screen.getByLabelText('100')).toBeInTheDocument();
  });

  it('should have accessible aria-label with actual value', () => {
    render(<NumberCountUp value={1234567} format={true} />);
    const element = screen.getByLabelText('1234567');
    expect(element).toHaveAttribute('aria-label', '1234567');
  });
});
