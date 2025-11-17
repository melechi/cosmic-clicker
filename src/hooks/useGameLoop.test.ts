import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGameLoop } from './useGameLoop';
import { useGame } from '@/context';

// Mock the useGame hook
vi.mock('@/context', () => ({
  useGame: vi.fn(),
}));

describe('useGameLoop', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  let rafCallbacks: Array<(time: number) => void>;
  let rafId: number;

  beforeEach(() => {
    mockDispatch = vi.fn();
    (useGame as ReturnType<typeof vi.fn>).mockReturnValue({
      state: {},
      dispatch: mockDispatch,
    });

    rafCallbacks = [];
    rafId = 0;

    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((callback: (time: number) => void) => {
      rafCallbacks.push(callback);
      return ++rafId;
    }) as unknown as typeof requestAnimationFrame;

    // Mock cancelAnimationFrame
    globalThis.cancelAnimationFrame = vi.fn();

    // Mock performance.now
    let currentTime = 0;
    globalThis.performance.now = vi.fn(() => {
      currentTime += 16.67; // ~60 FPS
      return currentTime;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should start the game loop on mount', () => {
    renderHook(() => useGameLoop());

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should dispatch TICK action with delta time', async () => {
    renderHook(() => useGameLoop());

    // Execute the first frame callback
    if (rafCallbacks.length > 0) {
      rafCallbacks[0](performance.now());
    }

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    // Check that dispatch was called with tick action
    const calls = mockDispatch.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0].type).toBe('TICK');
    expect(calls[0][0].payload).toHaveProperty('deltaTime');
    expect(typeof calls[0][0].payload.deltaTime).toBe('number');
  });

  it('should clean up on unmount', () => {
    const { unmount } = renderHook(() => useGameLoop());

    unmount();

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('should continue loop across multiple frames', () => {
    renderHook(() => useGameLoop());

    // Simulate multiple frames
    for (let i = 0; i < 5; i++) {
      if (rafCallbacks[i]) {
        rafCallbacks[i](performance.now());
      }
    }

    // Should have scheduled multiple animation frames
    expect(globalThis.requestAnimationFrame).toHaveBeenCalledTimes(6); // Initial + 5 frames
  });

  it('should calculate delta time correctly', () => {
    let callCount = 0;

    mockDispatch.mockImplementation((action) => {
      if (action.type === 'TICK') {
        const deltaTime = action.payload.deltaTime;

        if (callCount > 0) {
          // Delta time should be approximately 0.01667 seconds (16.67ms at 60 FPS)
          expect(deltaTime).toBeGreaterThan(0);
          expect(deltaTime).toBeLessThan(1); // Should be less than 1 second
        }

        callCount++;
      }
    });

    renderHook(() => useGameLoop());

    // Execute a few frames
    for (let i = 0; i < 3; i++) {
      if (rafCallbacks[i]) {
        rafCallbacks[i](performance.now());
      }
    }

    expect(callCount).toBeGreaterThan(0);
  });
});
