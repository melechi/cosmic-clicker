import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Test Content</Card>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(<Card title="Card Title">Content</Card>);

    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains('custom-class')).toBe(true);
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Card onClick={handleClick}>Clickable Content</Card>);

    await user.click(screen.getByText('Clickable Content'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should have base classes', () => {
    const { container } = render(<Card>Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains('bg-gray-800')).toBe(true);
    expect(card.classList.contains('rounded-lg')).toBe(true);
    expect(card.classList.contains('shadow-md')).toBe(true);
  });

  it('should apply hoverable classes when hoverable is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains('hover:border-blue-500')).toBe(true);
    expect(card.classList.contains('cursor-pointer')).toBe(true);
  });

  it('should not apply hoverable classes by default', () => {
    const { container } = render(<Card>Content</Card>);

    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains('hover:border-blue-500')).toBe(false);
  });
});
