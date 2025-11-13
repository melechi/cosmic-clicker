import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clicker } from './Clicker';

describe('Clicker', () => {
  it('should render clickable button', () => {
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} />);

    expect(screen.getByLabelText(/click to generate/i)).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} />);

    await user.click(screen.getByLabelText(/click to generate/i));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should spawn particle on click', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    const { container } = render(<Clicker clickPower={10} onClick={mockOnClick} />);

    await user.click(screen.getByLabelText(/click to generate/i));

    // Check for particle
    expect(container.querySelector('.animate-float-up')).toBeInTheDocument();
  });

  it('should show correct click power in aria-label', () => {
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={50} onClick={mockOnClick} />);

    expect(screen.getByLabelText('Click to generate 50 stardust')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} disabled />);

    const button = screen.getByLabelText(/click to generate/i);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} disabled />);

    await user.click(screen.getByLabelText(/click to generate/i));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should render instruction text', () => {
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} />);

    expect(screen.getByText('Click to collect stardust!')).toBeInTheDocument();
  });

  it('should support multiple rapid clicks', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} />);

    const button = screen.getByLabelText(/click to generate/i);
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('should have focus ring for accessibility', () => {
    const mockOnClick = vi.fn();
    render(<Clicker clickPower={1} onClick={mockOnClick} />);

    const button = screen.getByLabelText(/click to generate/i);
    expect(button).toHaveClass('focus:ring-4', 'focus:ring-blue-400');
  });
});
