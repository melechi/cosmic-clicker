import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should render stardust amount', () => {
    render(
      <Header
        stardust={1234.56}
        productionPerSecond={10}
        nebulaCrystals={0}
        clickPower={1}
      />
    );

    expect(screen.getByLabelText(/stardust/i)).toHaveTextContent('1.23K');
  });

  it('should render production rate', () => {
    render(
      <Header
        stardust={0}
        productionPerSecond={45.8}
        nebulaCrystals={0}
        clickPower={1}
      />
    );

    expect(screen.getByLabelText(/production rate/i)).toHaveTextContent('45.8/s');
  });

  it('should render click power', () => {
    render(
      <Header
        stardust={0}
        productionPerSecond={0}
        nebulaCrystals={0}
        clickPower={5}
      />
    );

    expect(screen.getByLabelText(/click power/i)).toHaveTextContent('5');
  });

  it('should render nebula crystals when greater than 0', () => {
    render(
      <Header
        stardust={0}
        productionPerSecond={0}
        nebulaCrystals={10}
        clickPower={1}
      />
    );

    expect(screen.getByLabelText(/nebula crystals/i)).toHaveTextContent('10');
  });

  it('should not render nebula crystals when 0', () => {
    render(
      <Header
        stardust={0}
        productionPerSecond={0}
        nebulaCrystals={0}
        clickPower={1}
      />
    );

    expect(screen.queryByLabelText(/nebula crystals/i)).not.toBeInTheDocument();
  });

  it('should format large numbers correctly', () => {
    render(
      <Header
        stardust={1234567890}
        productionPerSecond={5432100}
        nebulaCrystals={999}
        clickPower={1000000}
      />
    );

    expect(screen.getByLabelText(/stardust/i)).toHaveTextContent('1.23B');
    expect(screen.getByLabelText(/production rate/i)).toHaveTextContent('5.43M/s');
    expect(screen.getByLabelText(/click power/i)).toHaveTextContent('1.00M');
  });

  it('should render game title', () => {
    render(
      <Header
        stardust={0}
        productionPerSecond={0}
        nebulaCrystals={0}
        clickPower={1}
      />
    );

    expect(screen.getByText('Cosmic Clicker')).toBeInTheDocument();
  });

  it('should have accessible labels', () => {
    render(
      <Header
        stardust={100}
        productionPerSecond={10}
        nebulaCrystals={5}
        clickPower={2}
      />
    );

    expect(screen.getByLabelText(/stardust:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/production rate:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/click power:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nebula crystals:/i)).toBeInTheDocument();
  });
});
