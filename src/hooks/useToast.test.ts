import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useToast } from './useToast';
import { ToastProvider } from '../context/ToastContext';
import React from 'react';

describe('useToast', () => {
  it('should throw error when used outside ToastProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToast must be used within a ToastProvider');

    console.error = originalError;
  });

  it('should provide toast methods when used within ToastProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(result.current).toHaveProperty('success');
    expect(result.current).toHaveProperty('info');
    expect(result.current).toHaveProperty('warning');
    expect(result.current).toHaveProperty('error');
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.info).toBe('function');
    expect(typeof result.current.warning).toBe('function');
    expect(typeof result.current.error).toBe('function');
  });

  it('should add success toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.success('Test success message');
    }).not.toThrow();
  });

  it('should add info toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.info('Test info message');
    }).not.toThrow();
  });

  it('should add warning toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.warning('Test warning message');
    }).not.toThrow();
  });

  it('should add error toast', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.error('Test error message');
    }).not.toThrow();
  });

  it('should accept custom duration option', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.success('Test message', { duration: 5000 });
    }).not.toThrow();
  });

  it('should return stable toast API across renders', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result, rerender } = renderHook(() => useToast(), { wrapper });

    const firstToast = result.current;
    rerender();
    const secondToast = result.current;

    // Toast API should be stable (same reference)
    expect(firstToast).toBe(secondToast);
  });

  it('should handle multiple toast calls', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.success('Message 1');
      result.current.info('Message 2');
      result.current.warning('Message 3');
      result.current.error('Message 4');
    }).not.toThrow();
  });

  it('should not require options parameter', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.success('Message without options');
    }).not.toThrow();
  });

  it('should work with empty options object', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastProvider, null, children);

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(() => {
      result.current.success('Message', {});
    }).not.toThrow();
  });
});
