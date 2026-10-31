import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

/**
 * Contextual Alert Banner adhering to DESIGN.md semantic tokens
 */
export default function AlertBanner({
  variant = 'error',
  title,
  message,
  onClose,
  className = '',
}) {
  if (!message && !title) return null;

  const styles = {
    error: {
      container: 'bg-[#F70909]/[0.08] border-[#F70909]/20 text-[#840000]',
      icon: AlertCircle,
    },
    success: {
      container: 'bg-[#09F7A1]/[0.12] border-[#029A6D]/20 text-[#029A6D]',
      icon: CheckCircle2,
    },
    warning: {
      container: 'bg-amber-500/10 border-amber-500/25 text-amber-900',
      icon: TriangleAlert,
    },
    info: {
      container: 'bg-[#F1F7FF] border-[#4891FF]/30 text-[#0056D6]',
      icon: Info,
    },
  };

  const current = styles[variant] || styles.error;
  const IconComponent = current.icon;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-[7px] border px-3.5 py-2.5 text-[13px] font-semibold ${current.container} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <IconComponent className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          {title && <p className="font-semibold leading-5">{title}</p>}
          {message && (
            <p className={`${title ? 'mt-0.5 font-normal opacity-90' : 'leading-5'}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="fluent-pressable rounded-[4px] p-0.5 opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

