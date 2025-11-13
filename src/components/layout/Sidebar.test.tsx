import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('should render all navigation tabs', () => {
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    expect(screen.getByLabelText('Buildings tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Upgrades tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Achievements tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Prestige tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Statistics tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Settings tab')).toBeInTheDocument();
  });

  it('should highlight active tab', () => {
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="upgrades" onTabChange={mockOnTabChange} />);

    const upgradesTab = screen.getByLabelText('Upgrades tab');
    expect(upgradesTab).toHaveClass('bg-blue-600');
    expect(upgradesTab).toHaveAttribute('aria-current', 'page');
  });

  it('should call onTabChange when tab is clicked', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    await user.click(screen.getByLabelText('Achievements tab'));

    expect(mockOnTabChange).toHaveBeenCalledWith('achievements');
    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
  });

  it('should toggle collapse state', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    const collapseButton = screen.getByLabelText('Collapse sidebar');
    expect(collapseButton).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    await user.click(collapseButton);
    expect(screen.getByLabelText('Expand sidebar')).toHaveAttribute('aria-expanded', 'false');

    // Expand
    await user.click(screen.getByLabelText('Expand sidebar'));
    expect(screen.getByLabelText('Collapse sidebar')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should hide tab labels when collapsed', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    // Initially expanded, labels should be visible
    expect(screen.getByText('Buildings')).toBeInTheDocument();

    // Collapse
    await user.click(screen.getByLabelText('Collapse sidebar'));

    // Labels should not be visible
    expect(screen.queryByText('Buildings')).not.toBeInTheDocument();
  });

  it('should hide footer info when collapsed', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    // Initially expanded, footer should be visible
    expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();

    // Collapse
    await user.click(screen.getByLabelText('Collapse sidebar'));

    // Footer should not be visible
    expect(screen.queryByText('Version 1.0.0')).not.toBeInTheDocument();
  });

  it('should have accessible navigation landmark', () => {
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(<Sidebar activeTab="buildings" onTabChange={mockOnTabChange} />);

    const buildingsTab = screen.getByLabelText('Buildings tab');
    buildingsTab.focus();

    await user.keyboard('{Enter}');
    expect(mockOnTabChange).toHaveBeenCalledWith('buildings');
  });

  it('should apply custom className', () => {
    const mockOnTabChange = vi.fn();
    const { container } = render(
      <Sidebar activeTab="buildings" onTabChange={mockOnTabChange} className="custom-class" />
    );

    expect(container.querySelector('aside')).toHaveClass('custom-class');
  });
});
