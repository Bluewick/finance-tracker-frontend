import { useId } from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

/**
 * Reusable Fluent Design System Input Component
 * Supports leading/trailing icons, recessed (#F5F5F5) or surface (#FFFFFF) variants,
 * inline error state, and inline warning state.
 */
export default function Input({
  label,
  id,
  type = 'text',
  error,
  warning,
  helperText,
  icon: Icon,
  rightElement,
  surface = 'recessed',
  className = '',
  containerClassName = '',
  required = false,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const surfaceStyles =
    surface === 'white'
      ? 'bg-[#FFFFFF] border border-black/15 focus:border-[#0063F9]'
      : 'bg-[#F5F5F5] border border-transparent focus:bg-[#FFFFFF] focus:border-[#0063F9]';

  const stateStyles = error
    ? '!border-[#F70909]/60 !bg-[#F70909]/[0.03] focus:!ring-2 focus:!ring-[#F70909]/20'
    : warning
      ? '!border-[#FF8D28]/70 !bg-[#FF8D28]/[0.04] focus:!ring-2 focus:!ring-[#FF8D28]/20'
      : 'focus:ring-2 focus:ring-[#0063F9]/20';

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-semibold tracking-[0.01em] text-[#1F1F1F]"
        >
          {label}
          {required && <span className="ml-0.5 text-[#840000]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div
            className={`pointer-events-none absolute left-3.5 flex items-center transition-colors ${
              error
                ? 'text-[#F70909]'
                : warning
                  ? 'text-[#C85A00]'
                  : 'text-[#767676]'
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-[9px] py-2.5 text-[13px] font-semibold leading-5 text-[#000000] placeholder:font-medium placeholder:text-[#8E8E93] transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} ${surfaceStyles} ${stateStyles} ${className}`}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#840000]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#F70909]" />
          <span>{error}</span>
        </p>
      ) : warning ? (
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#B55000]">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#FF8D28]" />
          <span>{warning}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] font-medium text-[#626262]">{helperText}</p>
      ) : null}
    </div>
  );
}
