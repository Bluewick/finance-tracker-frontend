import { useId } from 'react';

/**
 * Reusable Fluent Design System Input Component
 * Supports leading/trailing icons, recessed (#F5F5F5) or surface (#FFFFFF) variants, and inline error state
 */
export default function Input({
  label,
  id,
  type = 'text',
  error,
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

  const errorStyles = error
    ? '!border-[#F70909]/60 !bg-[#F70909]/[0.03] focus:!ring-[#F70909]/20'
    : 'focus:ring-2 focus:ring-[#0063F9]/20';

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold leading-5 text-[#000000]"
        >
          {label}
          {required && <span className="ml-0.5 text-[#840000]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-[#767676]">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full rounded-[7px] py-2.5 text-[14px] font-semibold leading-5 text-[#000000] placeholder:font-medium placeholder:text-[#767676] transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
            Icon ? 'pl-9' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} ${surfaceStyles} ${errorStyles} ${className}`}
          {...rest}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-semibold text-[#840000]">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] font-medium text-[#626262]">{helperText}</p>
      ) : null}
    </div>
  );
}

