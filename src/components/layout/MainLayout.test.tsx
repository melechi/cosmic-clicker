import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  const mockHeaderProps = {
    fuel: 1000,
    tankCapacity: 5000,
    credits: 100,
    productionPerSecond: 10,
    nebulaCrystals: 5,
    clickPower: 1,
  };

  it('should render header with provided props', () => {
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Cosmic Clicker')).toBeInTheDocument();
    expect(screen.getByLabelText(/stardust/i)).toBeInTheDocument();
  });

  it('should render sidebar with active tab', () => {
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="upgrades"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    const upgradesTab = screen.getByLabelText('Upgrades tab');
    expect(upgradesTab).toHaveClass('bg-blue-600');
  });

  it('should render children in main content area', () => {
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div data-testid="test-content">Test Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onTabChange when sidebar tab is clicked', async () => {
    const user = userEvent.setup();
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    await user.click(screen.getByLabelText('Achievements tab'));

    expect(mockOnTabChange).toHaveBeenCalledWith('achievements');
  });

  it('should render footer when footerContent is provided', () => {
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
        footerContent={<div data-testid="footer-content">Footer Info</div>}
      >
        <div>Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    expect(screen.getByText('Footer Info')).toBeInTheDocument();
  });

  it('should not render footer when footerContent is not provided', () => {
    const mockOnTabChange = vi.fn();
    const { container } = render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    expect(container.querySelector('footer')).not.toBeInTheDocument();
  });

  it('should have accessible main content landmark', () => {
    const mockOnTabChange = vi.fn();
    render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    expect(screen.getByLabelText('Main content')).toBeInTheDocument();
  });

  it('should have responsive layout structure', () => {
    const mockOnTabChange = vi.fn();
    const { container } = render(
      <MainLayout
        headerProps={mockHeaderProps}
        activeTab="buildings"
        onTabChange={mockOnTabChange}
      >
        <div>Content</div>
      </MainLayout>
    );

    const layout = container.querySelector('.min-h-screen');
    expect(layout).toHaveClass('flex', 'flex-col');
  });
});
