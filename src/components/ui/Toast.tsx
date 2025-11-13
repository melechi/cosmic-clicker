import React, { useEffect, useState, useCallback } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Individual toast notification component with auto-dismiss and progress bar
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300); // Wait for fade-out animation
  }, [id, onClose]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const decrement = 100 / (duration / 100);
        return Math.max(0, prev - decrement);
      });
    }, 100);

    const dismissTimeout = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(dismissTimeout);
    };
  }, [duration, handleClose]);

  const getIcon = (toastType: typeof type): string => {
    switch (toastType) {
      case 'success':
        return '✓';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  const typeStyles = {
    success: 'bg-green-600 border-green-500',
    info: 'bg-blue-600 border-blue-500',
    warning: 'bg-yellow-600 border-yellow-500',
    error: 'bg-red-600 border-red-500',
  };

  const progressBarStyles = {
    success: 'bg-green-400',
    info: 'bg-blue-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
  };

  return (
    <div
      className={`toast relative mb-2 overflow-hidden rounded-lg border-2 ${typeStyles[type]} text-white shadow-lg transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'toast-slide-in'
      }`}
      role="alert"
      aria-live="polite"
      data-testid={`toast-${id}`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span
          className="toast-icon text-xl font-bold"
          aria-hidden="true"
        >
          {getIcon(type)}
        </span>
        <span className="toast-message flex-1 text-sm font-medium">
          {message}
        </span>
        <button
          onClick={handleClose}
          className="toast-close-button text-lg font-bold opacity-75 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label="Close notification"
          type="button"
        >
          ✕
        </button>
      </div>
      <div
        className={`toast-progress h-1 transition-all duration-100 ease-linear ${progressBarStyles[type]}`}
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

Toast.displayName = 'Toast';
