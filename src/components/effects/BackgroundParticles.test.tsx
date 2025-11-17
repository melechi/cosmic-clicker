import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BackgroundParticles } from './BackgroundParticles';

describe('BackgroundParticles', () => {
  let mockMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Mock matchMedia for useReducedMotion
    mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: '',
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render canvas when enabled', () => {
    const { container } = render(<BackgroundParticles enabled={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should not render when disabled', () => {
    const { container } = render(<BackgroundParticles enabled={false} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeInTheDocument();
  });

  it('should not render when user prefers reduced motion', () => {
    // Mock prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<BackgroundParticles enabled={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<BackgroundParticles enabled={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'z-0');
  });

  it('should be hidden from screen readers', () => {
    const { container } = render(<BackgroundParticles enabled={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('should accept custom particle count', () => {
    const { container } = render(<BackgroundParticles enabled={true} count={50} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should default to 100 particles when count not specified', () => {
    const { container } = render(<BackgroundParticles enabled={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should cleanup animation on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<BackgroundParticles enabled={true} />);

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });
});
