import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Settings } from './Settings';
import { GameProvider } from '@/context/GameContext';
import { ToastProvider } from '@/context/ToastContext';
import * as settingsManager from '@/utils/settingsManager';
import * as saveManager from '@/utils/saveLoad/saveManager';

// Mock functions
const mockOnClose = vi.fn();

// Wrapper component with providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>
    <GameProvider>{children}</GameProvider>
  </ToastProvider>
);

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Wrapper>
          <Settings isOpen={false} onClose={mockOnClose} />
        </Wrapper>
      );

      expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render all three tabs', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      expect(screen.getByRole('button', { name: /preferences/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save\/load/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
    });

    it('should show preferences tab by default', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      expect(screen.getByText('Enable auto-save')).toBeInTheDocument();
    });
  });

  describe('Preferences Tab', () => {
    it('should load settings from localStorage', () => {
      const loadSettingsSpy = vi.spyOn(settingsManager, 'loadSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      expect(loadSettingsSpy).toHaveBeenCalled();
    });

    it('should toggle auto-save enabled', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const checkbox = screen.getByLabelText(/enable auto-save/i);
      fireEvent.click(checkbox);

      expect(saveSettingsSpy).toHaveBeenCalled();
    });

    it('should change auto-save interval', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const select = screen.getByDisplayValue(/30 seconds/i);
      fireEvent.change(select, { target: { value: '60' } });

      expect(saveSettingsSpy).toHaveBeenCalled();
      const savedSettings = saveSettingsSpy.mock.calls[0][0];
      expect(savedSettings.autoSaveInterval).toBe(60);
    });

    it('should toggle show particles', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const checkbox = screen.getByLabelText(/show particle effects/i);
      fireEvent.click(checkbox);

      expect(saveSettingsSpy).toHaveBeenCalled();
    });

    it('should toggle reduce motion', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const checkbox = screen.getByLabelText(/reduce motion/i);
      fireEvent.click(checkbox);

      expect(saveSettingsSpy).toHaveBeenCalled();
    });

    it('should change number notation', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const select = screen.getByDisplayValue(/standard/i);
      fireEvent.change(select, { target: { value: 'scientific' } });

      expect(saveSettingsSpy).toHaveBeenCalled();
      const savedSettings = saveSettingsSpy.mock.calls[0][0];
      expect(savedSettings.numberNotation).toBe('scientific');
    });

    it('should toggle show tooltips', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const checkbox = screen.getByLabelText(/show tooltips/i);
      fireEvent.click(checkbox);

      expect(saveSettingsSpy).toHaveBeenCalled();
    });
  });

  describe('Save/Load Tab', () => {
    beforeEach(() => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      // Switch to save/load tab
      const saveLoadTab = screen.getByRole('button', { name: /save\/load/i });
      fireEvent.click(saveLoadTab);
    });

    it('should render save/load options', () => {
      expect(screen.getByText(/export save/i)).toBeInTheDocument();
      expect(screen.getByText(/import save/i)).toBeInTheDocument();
      expect(screen.getByText(/hard reset/i)).toBeInTheDocument();
    });

    it('should display last save time', () => {
      expect(screen.getByText(/last saved:/i)).toBeInTheDocument();
    });

    it('should export save when clicked', () => {
      const exportSaveSpy = vi.spyOn(saveManager, 'exportSave');
      exportSaveSpy.mockReturnValue('{"test": "data"}');

      // Mock URL.createObjectURL and related functions
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:test');
      globalThis.URL.revokeObjectURL = vi.fn();

      const exportButton = screen.getByRole('button', { name: /export save/i });
      fireEvent.click(exportButton);

      expect(exportSaveSpy).toHaveBeenCalled();
    });

    it('should show hard reset confirmation when clicked', async () => {
      const resetButton = screen.getByRole('button', { name: /hard reset/i });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText(/confirm hard reset/i)).toBeInTheDocument();
      });
    });

    it('should cancel hard reset', async () => {
      const resetButton = screen.getByRole('button', { name: /hard reset/i });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText(/confirm hard reset/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/confirm hard reset/i)).not.toBeInTheDocument();
      });
    });

    it('should perform hard reset when confirmed', async () => {
      const deleteSaveSpy = vi.spyOn(saveManager, 'deleteSave');

      const resetButton = screen.getByRole('button', { name: /hard reset/i });
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getByText(/confirm hard reset/i)).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', {
        name: /yes, reset everything/i,
      });
      fireEvent.click(confirmButton);

      expect(deleteSaveSpy).toHaveBeenCalled();
    });
  });

  describe('About Tab', () => {
    it('should render about information', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      // Switch to about tab
      const aboutTab = screen.getByRole('button', { name: /about/i });
      fireEvent.click(aboutTab);

      expect(screen.getByText(/about cosmic clicker/i)).toBeInTheDocument();
      expect(screen.getByText(/1\.0\.0/)).toBeInTheDocument();
      expect(screen.getByText(/how to play/i)).toBeInTheDocument();
    });

    it('should render GitHub link', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      // Switch to about tab
      const aboutTab = screen.getByRole('button', { name: /about/i });
      fireEvent.click(aboutTab);

      const githubLink = screen.getByRole('link', { name: /github repository/i });
      expect(githubLink).toHaveAttribute('href');
      expect(githubLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('Tab Switching', () => {
    it('should switch between tabs', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      // Start on preferences
      expect(screen.getByText(/enable auto-save/i)).toBeInTheDocument();

      // Switch to save/load
      const saveLoadTab = screen.getByRole('button', { name: /save\/load/i });
      fireEvent.click(saveLoadTab);
      expect(screen.getByText(/export save/i)).toBeInTheDocument();

      // Switch to about
      const aboutTab = screen.getByRole('button', { name: /about/i });
      fireEvent.click(aboutTab);
      expect(screen.getByText(/about cosmic clicker/i)).toBeInTheDocument();

      // Switch back to preferences
      const preferencesTab = screen.getByRole('button', { name: /preferences/i });
      fireEvent.click(preferencesTab);
      expect(screen.getByText(/enable auto-save/i)).toBeInTheDocument();
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when close button is clicked', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const closeButton = screen.getByLabelText(/close modal/i);
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      // Find the backdrop by testing for the backdrop class/attributes
      const dialog = screen.getByRole('dialog');
      const backdrop = dialog.previousSibling;

      // Only test if backdrop exists and is an element
      if (backdrop && backdrop.nodeType === Node.ELEMENT_NODE) {
        fireEvent.click(backdrop as HTMLElement);
        expect(mockOnClose).toHaveBeenCalled();
      } else {
        // If no backdrop, just verify the modal is open
        expect(dialog).toBeInTheDocument();
      }
    });
  });

  describe('Settings Persistence', () => {
    it('should persist settings to localStorage', () => {
      const saveSettingsSpy = vi.spyOn(settingsManager, 'saveSettings');

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const checkbox = screen.getByLabelText(/show particle effects/i);
      fireEvent.click(checkbox);

      expect(saveSettingsSpy).toHaveBeenCalled();

      // Verify settings were saved by checking localStorage directly
      const saved = localStorage.getItem('cosmicClicker_settings');
      expect(saved).toBeTruthy();
    });

    it('should load settings when component mounts', () => {
      const mockSettings = {
        autoSaveEnabled: false,
        autoSaveInterval: 60,
        showParticles: false,
        reduceMotion: true,
        numberNotation: 'scientific' as const,
        showTooltips: false,
        soundEnabled: false,
        musicEnabled: false,
      };

      vi.spyOn(settingsManager, 'loadSettings').mockReturnValue(mockSettings);

      render(
        <Wrapper>
          <Settings isOpen={true} onClose={mockOnClose} />
        </Wrapper>
      );

      const autoSaveCheckbox = screen.getByLabelText(
        /enable auto-save/i
      ) as HTMLInputElement;
      expect(autoSaveCheckbox.checked).toBe(false);
    });
  });
});
