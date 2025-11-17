import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShipControls } from './ShipControls';
import type { ShipSpeed } from '@/types';

describe('ShipControls', () => {
  const mockOnSpeedChange = vi.fn();

  const defaultProps = {
    currentSpeed: 'normal' as ShipSpeed,
    fuel: 500,
    tankCapacity: 1000,
    maxSpeedUnlocked: 'normal' as ShipSpeed,
    fuelEfficiencyPercent: 100,
    onSpeedChange: mockOnSpeedChange,
  };

  beforeEach(() => {
    mockOnSpeedChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render ship controls card', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Ship Controls/i)).toBeInTheDocument();
    });

    it('should render all speed buttons', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByLabelText(/Stop speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Slow speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Normal speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Fast speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Boost speed/i)).toBeInTheDocument();
    });

    it('should display fuel tank information', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Fuel Tank/i)).toBeInTheDocument();
      expect(screen.getByText(/500/)).toBeInTheDocument();
      expect(screen.getByText(/1\.00K/)).toBeInTheDocument(); // 1000 formatted
    });

    it('should display current speed', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Current Speed/i)).toBeInTheDocument();
      expect(screen.getByText(/Normal/)).toBeInTheDocument();
    });

    it('should display fuel consumption rate', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Fuel consumption:/i)).toBeInTheDocument();
      expect(screen.getByText(/1\.00\/sec/)).toBeInTheDocument(); // Normal speed, 100% efficiency
    });

    it('should display distance rate', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Distance rate:/i)).toBeInTheDocument();
      expect(screen.getByText(/1x/)).toBeInTheDocument(); // Normal speed
    });
  });

  describe('Speed Selection', () => {
    it('should highlight current speed button', () => {
      render(<ShipControls {...defaultProps} />);
      const normalButton = screen.getByLabelText(/Normal speed/i);
      expect(normalButton.className).toContain('ring-2');
    });

    it('should call onSpeedChange when clicking unlocked speed', () => {
      render(<ShipControls {...defaultProps} />);
      const slowButton = screen.getByLabelText(/Slow speed/i);
      fireEvent.click(slowButton);
      expect(mockOnSpeedChange).toHaveBeenCalledWith('slow');
    });

    it('should not call onSpeedChange when clicking locked speed', () => {
      render(<ShipControls {...defaultProps} />);
      const fastButton = screen.getByLabelText(/Fast speed/i);
      expect(fastButton).toBeDisabled();
      fireEvent.click(fastButton);
      expect(mockOnSpeedChange).not.toHaveBeenCalled();
    });

    it('should show lock icon on locked speeds', () => {
      render(<ShipControls {...defaultProps} />);
      const fastButton = screen.getByLabelText(/Fast speed/i);
      // Check for lock emoji within the button's parent
      expect(fastButton.textContent).toContain('🔒');
    });

    it('should enable Fast and Boost when maxSpeedUnlocked is boost', () => {
      render(<ShipControls {...defaultProps} maxSpeedUnlocked="boost" />);
      const fastButton = screen.getByLabelText(/Fast speed/i);
      const boostButton = screen.getByLabelText(/Boost speed/i);
      expect(fastButton).not.toBeDisabled();
      expect(boostButton).not.toBeDisabled();
    });
  });

  describe('Fuel Warnings', () => {
    it('should show low fuel warning when fuel < 10%', () => {
      render(<ShipControls {...defaultProps} fuel={50} />); // 5% of 1000
      expect(screen.getByText(/LOW FUEL/i)).toBeInTheDocument();
      expect(screen.getByText(/5\.0%/)).toBeInTheDocument();
    });

    it('should show out of fuel warning when fuel = 0', () => {
      render(<ShipControls {...defaultProps} fuel={0} />);
      expect(screen.getByText(/OUT OF FUEL/i)).toBeInTheDocument();
      expect(screen.getByText(/Ship has stopped/i)).toBeInTheDocument();
    });

    it('should not show warnings when fuel is adequate', () => {
      render(<ShipControls {...defaultProps} fuel={500} />); // 50%
      expect(screen.queryByText(/LOW FUEL/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/OUT OF FUEL/i)).not.toBeInTheDocument();
    });
  });

  describe('Fuel Consumption Calculations', () => {
    it('should calculate correct fuel consumption for stop speed', () => {
      render(<ShipControls {...defaultProps} currentSpeed="stop" />);
      expect(screen.getByText(/0\.00\/sec/)).toBeInTheDocument();
    });

    it('should calculate correct fuel consumption for slow speed', () => {
      render(<ShipControls {...defaultProps} currentSpeed="slow" />);
      expect(screen.getByText(/0\.50\/sec/)).toBeInTheDocument(); // 0.5x with 100% efficiency
    });

    it('should calculate correct fuel consumption for boost speed', () => {
      render(<ShipControls {...defaultProps} currentSpeed="boost" maxSpeedUnlocked="boost" />);
      expect(screen.getByText(/5\.00\/sec/)).toBeInTheDocument(); // 5x with 100% efficiency
    });

    it('should account for fuel efficiency in consumption calculation', () => {
      render(<ShipControls {...defaultProps} fuelEfficiencyPercent={50} />);
      expect(screen.getByText(/0\.50\/sec/)).toBeInTheDocument(); // 1x speed * 50% efficiency
    });
  });

  describe('Progress Bar', () => {
    it('should show correct fuel percentage', () => {
      render(<ShipControls {...defaultProps} fuel={750} tankCapacity={1000} />);
      expect(screen.getByText(/75%/)).toBeInTheDocument();
    });

    it('should use danger variant when out of fuel', () => {
      const { container } = render(<ShipControls {...defaultProps} fuel={0} />);
      const progressBar = container.querySelector('.bg-red-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should use warning variant when fuel is low', () => {
      const { container } = render(<ShipControls {...defaultProps} fuel={50} />);
      const progressBar = container.querySelector('.bg-yellow-500');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should change speed to stop when pressing 1', () => {
      render(<ShipControls {...defaultProps} />);
      fireEvent.keyDown(window, { key: '1' });
      expect(mockOnSpeedChange).toHaveBeenCalledWith('stop');
    });

    it('should change speed to slow when pressing 2', () => {
      render(<ShipControls {...defaultProps} />);
      fireEvent.keyDown(window, { key: '2' });
      expect(mockOnSpeedChange).toHaveBeenCalledWith('slow');
    });

    it('should change speed to normal when pressing 3', () => {
      render(<ShipControls {...defaultProps} />);
      fireEvent.keyDown(window, { key: '3' });
      expect(mockOnSpeedChange).toHaveBeenCalledWith('normal');
    });

    it('should not change to locked speed with keyboard', () => {
      render(<ShipControls {...defaultProps} />);
      fireEvent.keyDown(window, { key: '4' }); // Fast is locked
      expect(mockOnSpeedChange).not.toHaveBeenCalled();
    });

    it('should toggle to stop when pressing spacebar from normal', () => {
      render(<ShipControls {...defaultProps} currentSpeed="normal" />);
      fireEvent.keyDown(window, { key: ' ' });
      expect(mockOnSpeedChange).toHaveBeenCalledWith('stop');
    });

    it('should toggle to normal when pressing spacebar from stop', () => {
      render(<ShipControls {...defaultProps} currentSpeed="stop" />);
      fireEvent.keyDown(window, { key: ' ' });
      expect(mockOnSpeedChange).toHaveBeenCalledWith('normal');
    });

    it('should not trigger shortcuts when typing in input', () => {
      const { container } = render(
        <>
          <input type="text" />
          <ShipControls {...defaultProps} />
        </>
      );
      const input = container.querySelector('input');
      if (input) {
        input.focus();
        fireEvent.keyDown(input, { key: '1' });
        expect(mockOnSpeedChange).not.toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels on speed buttons', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByLabelText(/Stop speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Slow speed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Normal speed/i)).toBeInTheDocument();
    });

    it('should show keyboard shortcuts hint', () => {
      render(<ShipControls {...defaultProps} />);
      expect(screen.getByText(/Keyboard shortcuts:/i)).toBeInTheDocument();
      expect(screen.getByText(/1-5: Select speed/i)).toBeInTheDocument();
      expect(screen.getByText(/Space: Toggle stop\/resume/i)).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<ShipControls {...defaultProps} className="custom-class" />);
      const card = container.querySelector('.custom-class');
      expect(card).toBeInTheDocument();
    });
  });
});
