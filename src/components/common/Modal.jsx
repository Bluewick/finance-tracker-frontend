import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Fluent Design System Modal Dialog
 * Features frosted backdrop, 15px card rounding, Escape key close, and header/footer slots
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-[4px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface Card (15px radius, Level 1/2 shadow) */}
      <div
        className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-[15px] bg-[#FFFFFF] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.16)]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-black/10 px-6 py-4">
          <div>
            {title && (
              <h2
                id="modal-title"
                className="text-[16px] font-semibold leading-6 tracking-[-0.01em] text-[#000000]"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[12px] font-medium text-[#626262]">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[7px] bg-black/[0.04] text-[#474747] hover:bg-[#F1F7FF] hover:text-[#0063F9]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[78vh] overflow-y-auto px-6 py-5">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-black/10 bg-[#F6F8FC] px-6 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

