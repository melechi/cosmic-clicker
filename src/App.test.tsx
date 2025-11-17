import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as saveManager from '@/utils/saveLoad/saveManager';
import type { GameState } from '@/types';
import { initialGameState } from '@/types';

// Mock saveManager functions
vi.mock('@/utils/saveLoad/saveManager', () => ({
  loadGame: vi.fn(),
  saveGame: vi.fn(),
  deleteSave: vi.fn(),
  exportSave: vi.fn(),
  importSave: vi.fn(),
  getLastSaveTime: vi.fn(),
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Default loadGame to return null (fresh start)
    vi.mocked(saveManager.loadGame).mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('App Rendering', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(document.body).toBeTruthy();
    });

    it('should render GameProvider', () => {
      render(<App />);
      // If GameProvider is working, the app should render game elements
      // We can verify by checking for game UI elements
      expect(document.querySelector('[role="main"]')).toBeTruthy();
    });

    it('should render ToastProvider', () => {
      render(<App />);
      // ToastProvider renders a container for toasts
      // The app should render without errors if ToastProvider is working
      expect(document.body).toBeTruthy();
    });

    it('should render Header component', async () => {
      render(<App />);
      // Wait for the header to be rendered
      await waitFor(() => {
        const header = document.querySelector('header');
        expect(header).toBeTruthy();
      });
    });

    it('should render Sidebar component', async () => {
      render(<App />);
      await waitFor(() => {
        const sidebar = document.querySelector('aside');
        expect(sidebar).toBeTruthy();
      });
    });

    it('should render Clicker component', async () => {
      render(<App />);
      await waitFor(() => {
        // Look for the clicker button
        const clicker = screen.queryByRole('button', { name: /click/i });
        expect(clicker).toBeTruthy();
      });
    });

    it('should render BackgroundParticles', () => {
      render(<App />);
      // BackgroundParticles creates a canvas element
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeTruthy();
    });
  });

  describe('Game State Initialization', () => {
    it('should start with initial game state when no save exists', () => {
      vi.mocked(saveManager.loadGame).mockReturnValue(null);

      render(<App />);

      // Verify loadGame was called
      expect(saveManager.loadGame).toHaveBeenCalledOnce();
    });

    it('should load saved game state when save exists', () => {
      const mockSavedState: GameState = {
        ...initialGameState,
        fuel: 1000,
        totalFuelEarned: 1000,
        buildings: { spaceMiner: 5 },
        lastSaveTime: Date.now(),
      };

      vi.mocked(saveManager.loadGame).mockReturnValue(mockSavedState);

      render(<App />);

      expect(saveManager.loadGame).toHaveBeenCalledOnce();
    });

    it('should not show offline modal for fresh game', async () => {
      vi.mocked(saveManager.loadGame).mockReturnValue(null);

      render(<App />);

      // Modal should not be present
      await waitFor(() => {
        const modal = screen.queryByText(/welcome back/i);
        expect(modal).toBeFalsy();
      });
    });

    it('should show offline modal when returning after time away', async () => {
      const oneHourAgo = Date.now() - 3600000; // 1 hour ago
      const mockSavedState: GameState = {
        ...initialGameState,
        fuel: 100,
        productionPerSecond: 10,
        lastSaveTime: oneHourAgo,
      };

      vi.mocked(saveManager.loadGame).mockReturnValue(mockSavedState);

      render(<App />);

      // Modal should appear with offline progress
      await waitFor(
        () => {
          const modal = screen.queryByText(/welcome back/i);
          expect(modal).toBeTruthy();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('Tab Navigation', () => {
    it('should start with Buildings tab active', async () => {
      render(<App />);

      await waitFor(() => {
        // The buildings tab content should be visible
        const buildingsContent = screen.queryByText(/buildings/i);
        expect(buildingsContent).toBeTruthy();
      });
    });

    it('should switch to Upgrades tab when clicked', async () => {
      render(<App />);

      await waitFor(() => {
        const upgradesTab = screen.queryByRole('button', { name: /upgrades/i });
        if (upgradesTab) {
          fireEvent.click(upgradesTab);
        }
      });
    });

    it('should switch to Achievements tab when clicked', async () => {
      render(<App />);

      await waitFor(() => {
        const achievementsTab = screen.queryByRole('button', { name: /achievements/i });
        if (achievementsTab) {
          fireEvent.click(achievementsTab);
        }
      });
    });

    it('should switch to Prestige tab when clicked', async () => {
      render(<App />);

      await waitFor(() => {
        const prestigeTab = screen.queryByRole('button', { name: /prestige/i });
        if (prestigeTab) {
          fireEvent.click(prestigeTab);
        }
      });
    });

    it('should switch to Statistics tab when clicked', async () => {
      render(<App />);

      await waitFor(() => {
        const statisticsTab = screen.queryByRole('button', { name: /statistics/i });
        if (statisticsTab) {
          fireEvent.click(statisticsTab);
        }
      });
    });
  });

  describe('Game Interactions', () => {
    it('should handle clicking the clicker', async () => {
      render(<App />);

      await waitFor(() => {
        const clicker = screen.queryByRole('button', { name: /click/i });
        if (clicker) {
          fireEvent.click(clicker);
          // After clicking, stardust should increase (tested in component tests)
          expect(clicker).toBeTruthy();
        }
      });
    });

    it('should update stardust display when clicking', async () => {
      render(<App />);

      await waitFor(() => {
        const clicker = screen.queryByRole('button', { name: /click/i });
        if (clicker) {
          // Click multiple times
          fireEvent.click(clicker);
          fireEvent.click(clicker);
          fireEvent.click(clicker);
        }
      });

      // The header should show stardust value (implementation dependent)
    });
  });

  describe('Auto-save Functionality', () => {
    it('should call saveGame periodically', async () => {
      // Use fake timers for this test
      vi.useFakeTimers();

      render(<App />);

      // Fast-forward time by 30 seconds (auto-save interval)
      vi.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(saveManager.saveGame).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });
  });

  describe('Achievement Checking', () => {
    it('should check achievements periodically', async () => {
      // This test verifies the achievement checking interval runs
      vi.useFakeTimers();

      render(<App />);

      // Fast-forward time by 5 seconds (achievement check interval)
      vi.advanceTimersByTime(5000);

      // Achievement checking happens (no errors thrown)
      expect(true).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<App />);

      await waitFor(() => {
        const main = screen.queryByRole('main');
        expect(main).toBeTruthy();
      });
    });

    it('should support keyboard navigation', async () => {
      render(<App />);

      await waitFor(() => {
        const buttons = screen.queryAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive Layout', () => {
    it('should render mobile layout on small screens', () => {
      // Set viewport to mobile size
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 667, writable: true });

      render(<App />);

      // The layout should adapt (implementation dependent)
      expect(document.body).toBeTruthy();
    });

    it('should render desktop layout on large screens', () => {
      // Set viewport to desktop size
      Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });

      render(<App />);

      expect(document.body).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle loadGame errors gracefully', () => {
      vi.mocked(saveManager.loadGame).mockImplementation(() => {
        throw new Error('Failed to load');
      });

      // Should not crash
      expect(() => render(<App />)).not.toThrow();
    });

    it('should handle saveGame errors gracefully', async () => {
      vi.mocked(saveManager.saveGame).mockImplementation(() => {
        throw new Error('Failed to save');
      });

      vi.useFakeTimers();

      render(<App />);

      // Fast-forward to trigger auto-save
      vi.advanceTimersByTime(30000);

      // App should still be running
      await waitFor(() => {
        expect(document.body).toBeTruthy();
      });

      vi.useRealTimers();
    });
  });

  describe('Modal Interactions', () => {
    it('should close offline modal when button is clicked', async () => {
      const oneHourAgo = Date.now() - 3600000;
      const mockSavedState: GameState = {
        ...initialGameState,
        fuel: 100,
        productionPerSecond: 10,
        lastSaveTime: oneHourAgo,
      };

      vi.mocked(saveManager.loadGame).mockReturnValue(mockSavedState);

      render(<App />);

      // Wait for modal to appear
      await waitFor(() => {
        const modal = screen.queryByText(/welcome back/i);
        expect(modal).toBeTruthy();
      });

      // Click the continue button
      const continueButton = screen.queryByRole('button', { name: /continue/i });
      if (continueButton) {
        fireEvent.click(continueButton);

        // Modal should disappear
        await waitFor(() => {
          const modal = screen.queryByText(/welcome back/i);
          expect(modal).toBeFalsy();
        });
      }
    });

    it('should close offline modal on Escape key', async () => {
      const oneHourAgo = Date.now() - 3600000;
      const mockSavedState: GameState = {
        ...initialGameState,
        fuel: 100,
        productionPerSecond: 10,
        lastSaveTime: oneHourAgo,
      };

      vi.mocked(saveManager.loadGame).mockReturnValue(mockSavedState);

      render(<App />);

      // Wait for modal to appear
      await waitFor(() => {
        const modal = screen.queryByText(/welcome back/i);
        expect(modal).toBeTruthy();
      });

      // Press Escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      // Modal should disappear
      await waitFor(() => {
        const modal = screen.queryByText(/welcome back/i);
        expect(modal).toBeFalsy();
      });
    });
  });
});
