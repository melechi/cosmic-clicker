import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastData } from '../components/ui/ToastContainer';

interface ToastContextValue {
  addToast: (message: string, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  toasts: ToastData[];
}

interface ToastOptions {
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

/**
 * Context for managing toast notifications throughout the app
 */
export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined
);

/**
 * Provider component that wraps the app and manages toast state
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastData = {
        id,
        message,
        type: options.type || 'info',
        duration: options.duration || 3000,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const value: ToastContextValue = {
    addToast,
    removeToast,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
        position={position}
        maxToasts={maxToasts}
      />
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
