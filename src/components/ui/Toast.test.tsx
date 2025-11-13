import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with correct message', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render success type with correct styles and icon', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Success!"
        type="success"
        onClose={onClose}
      />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).toHaveClass('bg-green-600', 'border-green-500');
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render info type with correct styles and icon', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Info!" type="info" onClose={onClose} />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).toHaveClass('bg-blue-600', 'border-blue-500');
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('should render warning type with correct styles and icon', () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Warning!"
        type="warning"
        onClose={onClose}
      />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).toHaveClass('bg-yellow-600', 'border-yellow-500');
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('should render error type with correct styles and icon', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Error!" type="error" onClose={onClose} />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).toHaveClass('bg-red-600', 'border-red-500');
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    const closeButton = screen.getByRole('button', {
      name: /close notification/i,
    });
    await user.click(closeButton);

    // Wait for fade-out animation
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith('test-1');
    });
  });

  it('should auto-dismiss after duration', async () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Test message"
        duration={3000}
        onClose={onClose}
      />
    );

    expect(onClose).not.toHaveBeenCalled();

    // Advance time by duration + fade-out animation
    vi.advanceTimersByTime(3000);

    // Wait for the fade-out animation to trigger
    await waitFor(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith('test-1');
    });
  });

  it('should display progress bar that decreases over time', async () => {
    const onClose = vi.fn();
    render(
      <Toast
        id="test-1"
        message="Test message"
        duration={1000}
        onClose={onClose}
      />
    );

    const progressBar = screen.getByRole('progressbar');

    // Initial progress should be 100
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');

    // Advance by half the duration
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      const currentProgress = Number(progressBar.getAttribute('aria-valuenow'));
      expect(currentProgress).toBeLessThan(100);
      expect(currentProgress).toBeGreaterThan(0);
    });

    // Advance to completion
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      const currentProgress = Number(progressBar.getAttribute('aria-valuenow'));
      expect(currentProgress).toBeLessThanOrEqual(10);
    });
  });

  it('should have proper ARIA attributes', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should use default duration of 3000ms when not specified', async () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    // Should not dismiss before 3000ms
    vi.advanceTimersByTime(2900);
    expect(onClose).not.toHaveBeenCalled();

    // Should dismiss after 3000ms + animation
    vi.advanceTimersByTime(100);
    await waitFor(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith('test-1');
    });
  });

  it('should use default type of info when not specified', () => {
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).toHaveClass('bg-blue-600', 'border-blue-500');
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('should apply fade-out class when closing', async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = vi.fn();
    render(
      <Toast id="test-1" message="Test message" onClose={onClose} />
    );

    const toast = screen.getByTestId('toast-test-1');
    expect(toast).not.toHaveClass('translate-x-full', 'opacity-0');

    const closeButton = screen.getByRole('button', {
      name: /close notification/i,
    });
    await user.click(closeButton);

    await waitFor(() => {
      expect(toast).toHaveClass('translate-x-full', 'opacity-0');
    });
  });

  it('should cleanup timers on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast
        id="test-1"
        message="Test message"
        duration={3000}
        onClose={onClose}
      />
    );

    unmount();

    // Advance time after unmount
    vi.advanceTimersByTime(3000);

    // onClose should not be called after unmount
    expect(onClose).not.toHaveBeenCalled();
  });
});
