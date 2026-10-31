import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/**
 * Custom hook to trigger global non-intrusive toast notifications
 * Usage: const toast = useToast(); toast.success('Transaction saved!');
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider />');
  }
  return context;
}

export default useToast;
