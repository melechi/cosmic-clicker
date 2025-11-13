import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('should render children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('should not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip on mouse enter', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });

  it('should hide tooltip on mouse leave', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.unhover(button);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip on focus', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );

    await user.tab(); // Focus the button

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('should hide tooltip on blur', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip content="Tooltip text">
          <button>Focus me</button>
        </Tooltip>
        <button>Other button</button>
      </div>
    );

    await user.tab(); // Focus first button
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    await user.tab(); // Focus second button (blur first)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('should render complex content', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        content={
          <div>
            <strong>Title</strong>
            <p>Description</p>
          </div>
        }
      >
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should apply custom className', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" className="custom-tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button'));

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.classList.contains('custom-tooltip')).toBe(true);
  });

  it('should position tooltip at top by default', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.classList.contains('bottom-full')).toBe(true);
  });

  it('should position tooltip at bottom', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.classList.contains('top-full')).toBe(true);
  });

  it('should position tooltip at left', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" position="left">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.classList.contains('right-full')).toBe(true);
  });

  it('should position tooltip at right', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Tooltip text" position="right">
        <button>Hover me</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    await user.hover(button);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.classList.contains('left-full')).toBe(true);
  });
});
