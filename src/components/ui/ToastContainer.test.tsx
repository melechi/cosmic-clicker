import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastContainer, ToastData } from './ToastContainer';

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up any lingering portal elements
    const portal = document.getElementById('toast-portal');
    if (portal) {
      document.body.removeChild(portal);
    }
  });

  it('should render toasts in a portal', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    // Check that portal was created
    const portal = document.getElementById('toast-portal');
    expect(portal).toBeInTheDocument();

    // Check that toast is rendered
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
      { id: '2', message: 'Toast 2', type: 'success' },
      { id: '3', message: 'Toast 3', type: 'warning' },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('should limit toasts to maxToasts', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
      { id: '2', message: 'Toast 2', type: 'info' },
      { id: '3', message: 'Toast 3', type: 'info' },
      { id: '4', message: 'Toast 4', type: 'info' },
      { id: '5', message: 'Toast 5', type: 'info' },
      { id: '6', message: 'Toast 6', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(
      <ToastContainer toasts={toasts} onRemove={onRemove} maxToasts={3} />
    );

    // Should only show the 3 most recent toasts
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 3')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
    expect(screen.getByText('Toast 5')).toBeInTheDocument();
    expect(screen.getByText('Toast 6')).toBeInTheDocument();
  });

  it('should use default maxToasts of 5', () => {
    const toasts: ToastData[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      message: `Toast ${i + 1}`,
      type: 'info' as const,
    }));
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    // Should only show the 5 most recent toasts
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 5')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 6')).toBeInTheDocument();
    expect(screen.getByText('Toast 10')).toBeInTheDocument();
  });

  it('should apply top-right position by default', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('top-4', 'right-4');
  });

  it('should apply top-left position', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(
      <ToastContainer
        toasts={toasts}
        onRemove={onRemove}
        position="top-left"
      />
    );

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('top-4', 'left-4');
  });

  it('should apply bottom-right position', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(
      <ToastContainer
        toasts={toasts}
        onRemove={onRemove}
        position="bottom-right"
      />
    );

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('bottom-4', 'right-4');
  });

  it('should apply bottom-left position', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(
      <ToastContainer
        toasts={toasts}
        onRemove={onRemove}
        position="bottom-left"
      />
    );

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('bottom-4', 'left-4');
  });

  it('should have high z-index to appear over game content', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveClass('z-50');
  });

  it('should clean up portal on unmount', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    const { unmount } = render(
      <ToastContainer toasts={toasts} onRemove={onRemove} />
    );

    // Portal should exist
    expect(document.getElementById('toast-portal')).toBeInTheDocument();

    unmount();

    // Portal should be removed
    expect(document.getElementById('toast-portal')).not.toBeInTheDocument();
  });

  it('should render empty container when no toasts', () => {
    const onRemove = vi.fn();

    render(<ToastContainer toasts={[]} onRemove={onRemove} />);

    const container = screen.getByTestId('toast-container');
    expect(container).toBeInTheDocument();
    expect(container.children).toHaveLength(0);
  });

  it('should pass onRemove callback to Toast components', async () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info', duration: 1000 },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    // Wait for toast to auto-dismiss
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      vi.advanceTimersByTime(300); // fade-out animation
    });

    await waitFor(() => {
      expect(onRemove).toHaveBeenCalledWith('1');
    });
  });

  it('should handle toast updates correctly', () => {
    const initialToasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    const { rerender } = render(
      <ToastContainer toasts={initialToasts} onRemove={onRemove} />
    );

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();

    // Add another toast
    const updatedToasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
      { id: '2', message: 'Toast 2', type: 'success' },
    ];

    rerender(<ToastContainer toasts={updatedToasts} onRemove={onRemove} />);

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes for accessibility', () => {
    const toasts: ToastData[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
    ];
    const onRemove = vi.fn();

    render(<ToastContainer toasts={toasts} onRemove={onRemove} />);

    const container = screen.getByTestId('toast-container');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-atomic', 'true');
  });
});
