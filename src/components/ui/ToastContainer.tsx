import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

/**
 * Container component that manages a stack of toast notifications
 * Uses React Portal to render outside the normal DOM flow
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create portal container on mount
    const portalDiv = document.createElement('div');
    portalDiv.id = 'toast-portal';
    document.body.appendChild(portalDiv);
    portalRef.current = portalDiv;

    return () => {
      // Cleanup portal on unmount
      if (portalRef.current && document.body.contains(portalRef.current)) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  const positionStyles: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  // Limit number of toasts to maxToasts (show most recent)
  const visibleToasts = toasts.slice(-maxToasts);

  const content = (
    <div
      className={`toast-container fixed z-50 flex w-80 max-w-full flex-col ${positionStyles[position]}`}
      data-testid="toast-container"
      aria-live="polite"
      aria-atomic="true"
    >
      {visibleToasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={onRemove}
        />
      ))}
    </div>
  );

  // Only render when portal is ready
  return portalRef.current ? createPortal(content, portalRef.current) : null;
};

ToastContainer.displayName = 'ToastContainer';
