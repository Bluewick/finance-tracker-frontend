import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { ToastContext } from '../hooks/useToast.js';

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, variant = 'info', duration = 4000 }) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, title, message, variant }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = useMemo(
    () => ({
      success: (message, title = 'Success') =>
        addToast({ title, message, variant: 'success' }),
      error: (message, title = 'Error') =>
        addToast({ title, message, variant: 'error', duration: 5000 }),
      warning: (message, title = 'Warning') =>
        addToast({ title, message, variant: 'warning' }),
      info: (message, title = 'Notice') =>
        addToast({ title, message, variant: 'info' }),
      dismiss: removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Floating Toast Stack (Top-Right) */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-5 z-[100] flex w-full max-w-sm flex-col gap-2.5"
      >
        {toasts.map((item) => {
          const variantConfig = {
            success: {
              icon: CheckCircle2,
              badgeBg: 'bg-[#09F7A1]/15 text-[#029A6D]',
              border: 'border-l-4 border-l-[#029A6D]',
            },
            error: {
              icon: AlertCircle,
              badgeBg: 'bg-[#F70909]/10 text-[#840000]',
              border: 'border-l-4 border-l-[#840000]',
            },
            warning: {
              icon: TriangleAlert,
              badgeBg: 'bg-amber-500/15 text-amber-800',
              border: 'border-l-4 border-l-amber-600',
            },
            info: {
              icon: Info,
              badgeBg: 'bg-[#F1F7FF] text-[#0063F9]',
              border: 'border-l-4 border-l-[#0063F9]',
            },
          }[item.variant] || {
            icon: Info,
            badgeBg: 'bg-[#F1F7FF] text-[#0063F9]',
            border: 'border-l-4 border-l-[#0063F9]',
          };

          const IconComponent = variantConfig.icon;

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-start justify-between gap-3 rounded-[10px] bg-[#FFFFFF] p-3.5 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.12)] transition-all ${variantConfig.border}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] ${variantConfig.badgeBg}`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  {item.title && (
                    <p className="text-[13px] font-semibold leading-4 text-[#000000]">
                      {item.title}
                    </p>
                  )}
                  {item.message && (
                    <p className="mt-1 text-[12px] font-medium leading-4 text-[#474747]">
                      {item.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="fluent-pressable rounded-[5px] p-1 text-[#767676] hover:bg-[#F5F5F5] hover:text-[#000000]"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
