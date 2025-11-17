import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clicker } from './Clicker';
import { GameProvider } from '@/context';

// Test wrapper with GameProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('Clicker', () => {
  it('should render game area', () => {
    render(<Clicker />, { wrapper: TestWrapper });

    expect(screen.getByRole('button', { name: /game area/i })).toBeInTheDocument();
  });

  it('should render with spaceship', () => {
    const { container } = render(<Clicker />, { wrapper: TestWrapper });

    // Spaceship should be present
    const spaceship = container.querySelector('svg');
    expect(spaceship).toBeTruthy();
  });

  it('should handle click events on game area', async () => {
    const user = userEvent.setup();
    render(<Clicker />, { wrapper: TestWrapper });

    const gameArea = screen.getByRole('button', { name: /game area/i });
    await user.click(gameArea);

    // Click should be registered (no error thrown)
    expect(gameArea).toBeTruthy();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Clicker disabled />, { wrapper: TestWrapper });

    const gameArea = screen.getByRole('button', { name: /game area/i });
    expect(gameArea).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show instruction text when no objects', () => {
    render(<Clicker />, { wrapper: TestWrapper });

    expect(screen.getByText(/waiting for objects to mine/i)).toBeInTheDocument();
  });

  it('should support keyboard interaction', async () => {
    render(<Clicker />, { wrapper: TestWrapper });

    const gameArea = screen.getByRole('button', { name: /game area/i });

    // Focus the element
    gameArea.focus();

    // Press spacebar
    fireEvent.keyDown(gameArea, { key: ' ' });

    // Should not crash
    expect(gameArea).toBeTruthy();
  });

  it('should have proper ARIA attributes', () => {
    render(<Clicker />, { wrapper: TestWrapper });

    const gameArea = screen.getByRole('button', { name: /game area/i });
    expect(gameArea).toHaveAttribute('tabIndex', '0');
  });

  it('should show laser stats display', () => {
    const { container } = render(<Clicker />, { wrapper: TestWrapper });

    // Check for stats display (damage, range, cooldown)
    expect(container.textContent).toMatch(/damage/i);
    expect(container.textContent).toMatch(/range/i);
    expect(container.textContent).toMatch(/cooldown/i);
  });
});
