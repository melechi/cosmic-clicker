import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import type { ResourceInventory } from '@/types/resources';

const defaultProps = {
  fuel: 0,
  tankCapacity: 1000,
  credits: 0,
  productionPerSecond: 0,
  nebulaCrystals: 0,
  clickPower: 1,
};

describe('Header', () => {
  it('should render fuel amount with tank capacity', () => {
    render(<Header {...defaultProps} fuel={1234.56} tankCapacity={5000} />);

    expect(screen.getByLabelText(/fuel:/i)).toHaveTextContent('1.23K');
    expect(screen.getByLabelText(/fuel:/i)).toHaveTextContent('/5.00K');
  });

  it('should render credits amount', () => {
    render(<Header {...defaultProps} credits={9876.54} />);

    expect(screen.getByLabelText(/credits:/i)).toHaveTextContent('9.88K');
  });

  it('should render production rate when greater than 0', () => {
    render(<Header {...defaultProps} productionPerSecond={45.8} />);

    expect(screen.getByLabelText(/production rate/i)).toHaveTextContent('45.8/s');
  });

  it('should not render production rate when 0', () => {
    render(<Header {...defaultProps} productionPerSecond={0} />);

    expect(screen.queryByLabelText(/production rate/i)).not.toBeInTheDocument();
  });

  it('should render nebula crystals when greater than 0', () => {
    render(<Header {...defaultProps} nebulaCrystals={10} />);

    expect(screen.getByLabelText(/nebula crystals/i)).toHaveTextContent('10');
  });

  it('should not render nebula crystals when 0', () => {
    render(<Header {...defaultProps} nebulaCrystals={0} />);

    expect(screen.queryByLabelText(/nebula crystals/i)).not.toBeInTheDocument();
  });

  it('should render key resources when provided', () => {
    const resources: ResourceInventory = {
      stone: 50,
      carbon: 30,
      iron: 10,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    render(<Header {...defaultProps} resources={resources} />);

    expect(screen.getByLabelText(/stone:/i)).toHaveTextContent('50');
    expect(screen.getByLabelText(/carbon:/i)).toHaveTextContent('30');
    expect(screen.getByLabelText(/iron:/i)).toHaveTextContent('10');
  });

  it('should only render resources with non-zero counts', () => {
    const resources: ResourceInventory = {
      stone: 50,
      carbon: 0,
      iron: 0,
      ice: 0,
      gold: 0,
      titanium: 0,
      platinum: 0,
      iridium: 0,
      darkMatter: 0,
    };

    render(<Header {...defaultProps} resources={resources} />);

    expect(screen.getByLabelText(/stone:/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/carbon:/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/iron:/i)).not.toBeInTheDocument();
  });

  it('should not render resources section when no resources provided', () => {
    render(<Header {...defaultProps} />);

    expect(screen.queryByText(/resources:/i)).not.toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(
      <Header
        {...defaultProps}
        fuel={1234567890}
        tankCapacity={2000000000}
        credits={9876543210}
        productionPerSecond={5432100}
        nebulaCrystals={999}
      />
    );

    expect(screen.getByLabelText(/fuel:/i)).toHaveTextContent('1.23B');
    expect(screen.getByLabelText(/credits:/i)).toHaveTextContent('9.88B');
    expect(screen.getByLabelText(/production rate/i)).toHaveTextContent('5.43M/s');
  });

  it('should render game title', () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText('Cosmic Clicker')).toBeInTheDocument();
  });

  it('should have accessible labels', () => {
    render(
      <Header
        {...defaultProps}
        fuel={100}
        credits={500}
        productionPerSecond={10}
        nebulaCrystals={5}
      />
    );

    expect(screen.getByLabelText(/fuel:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/credits:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/production rate:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nebula crystals:/i)).toBeInTheDocument();
  });
});
