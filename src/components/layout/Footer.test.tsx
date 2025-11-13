import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should render default content when no children provided', () => {
    render(<Footer />);

    expect(screen.getByText(/cosmic clicker v1\.0\.0/i)).toBeInTheDocument();
    expect(screen.getByLabelText('View help documentation')).toBeInTheDocument();
    expect(screen.getByLabelText('Report a bug')).toBeInTheDocument();
    expect(screen.getByLabelText('View changelog')).toBeInTheDocument();
  });

  it('should render custom children when provided', () => {
    render(
      <Footer>
        <div data-testid="custom-footer">Custom footer content</div>
      </Footer>
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByText('Custom footer content')).toBeInTheDocument();
  });

  it('should not render default content when custom children provided', () => {
    render(
      <Footer>
        <div>Custom content</div>
      </Footer>
    );

    expect(screen.queryByText(/cosmic clicker v1\.0\.0/i)).not.toBeInTheDocument();
  });

  it('should have contentinfo landmark role', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');

    expect(footer).toHaveAttribute('role', 'contentinfo');
  });

  it('should apply custom className', () => {
    const { container } = render(<Footer className="custom-class" />);
    const footer = container.querySelector('footer');

    expect(footer).toHaveClass('custom-class');
  });

  it('should render links with accessible labels', () => {
    render(<Footer />);

    const helpLink = screen.getByLabelText('View help documentation');
    const bugLink = screen.getByLabelText('Report a bug');
    const changelogLink = screen.getByLabelText('View changelog');

    expect(helpLink).toHaveAttribute('href', '#');
    expect(bugLink).toHaveAttribute('href', '#');
    expect(changelogLink).toHaveAttribute('href', '#');
  });

  it('should have hover effects on links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveClass('hover:text-blue-400');
    });
  });
});
