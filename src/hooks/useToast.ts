import { useContext, useMemo } from 'react';
import { ToastContext } from '../context/ToastContext';

interface ToastOptions {
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastAPI {
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => void;
}

/**
 * Custom hook for triggering toast notifications
 * Provides convenience methods for each toast type
 *
 * @example
 * const toast = useToast();
 * toast.success('Achievement Unlocked!');
 * toast.error('Failed to load save', { duration: 5000 });
 *
 * @throws {Error} If used outside of ToastProvider
 */
export function useToast(): ToastAPI {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast } = context;

  const toast = useMemo(
    () => ({
      success: (message: string, options?: Omit<ToastOptions, 'type'>) => {
        addToast(message, { ...options, type: 'success' });
      },
      info: (message: string, options?: Omit<ToastOptions, 'type'>) => {
        addToast(message, { ...options, type: 'info' });
      },
      warning: (message: string, options?: Omit<ToastOptions, 'type'>) => {
        addToast(message, { ...options, type: 'warning' });
      },
      error: (message: string, options?: Omit<ToastOptions, 'type'>) => {
        addToast(message, { ...options, type: 'error' });
      },
    }),
    [addToast]
  );

  return toast;
}
