'use client';

import { useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning';

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; border: string }
> = {
  success: {
    container: 'bg-green-50 text-green-600',
    border: 'border-green-500',
  },
  error: {
    container: 'bg-red-50 text-red-600',
    border: 'border-red-500',
  },
  warning: {
    container: 'bg-yellow-50 text-yellow-600',
    border: 'border-yellow-500',
  },
};

export function Toast({
  toast,
  onClose,
}: {
  toast: ToastState | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const styles = VARIANT_STYLES[toast.variant];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-toast-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-md ${styles.container} ${styles.border}`}
      >
        <p className="flex-1 text-sm">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
