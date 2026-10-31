import Spinner from '../feedback/Spinner.jsx';

/**
 * Reusable Fluent Design System Button
 * Includes built-in loading spinner, disabled state, and micro-interaction press scale
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = '',
  disabled = false,
  fullWidth = false,
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  onClick,
  ...rest
}) {
  const isDisabled = disabled || loading;

  const variantClasses = {
    primary:
      'bg-[#0063F9] text-[#FFFFFF] hover:bg-[#0056D6] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)]',
    secondary:
      'bg-[#FFFFFF] text-[#474747] hover:bg-[#F1F7FF] hover:text-[#0063F9] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)]',
    subtle:
      'bg-[#F1F7FF] text-[#0063F9] hover:bg-[#EBF3FF]',
    outline:
      'bg-[#FFFFFF] text-[#474747] border border-black/15 hover:border-[#0063F9] hover:text-[#0063F9]',
    danger:
      'bg-[#F70909]/[0.08] text-[#840000] hover:bg-[#F70909]/[0.15] border border-[#F70909]/20',
    dangerSolid:
      'bg-[#D91B1B] text-[#FFFFFF] hover:bg-[#840000] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)]',
    ghost:
      'bg-transparent text-[#474747] hover:bg-black/[0.04] hover:text-[#000000]',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[11px] rounded-[5px] gap-1.5',
    sm: 'px-3 py-1.5 text-[12px] rounded-[5px] gap-1.5',
    md: 'px-4 py-2 text-[14px] rounded-[5px] gap-2',
    lg: 'px-5 py-2.5 text-[14px] rounded-[7px] gap-2.5',
  };

  const spinnerVariant =
    variant === 'primary' || variant === 'dangerSolid'
      ? 'white'
      : variant === 'danger'
        ? 'danger'
        : 'primary';

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`fluent-pressable inline-flex items-center justify-center font-semibold leading-5 transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0063F9]/40 disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size="sm" variant={spinnerVariant} />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
          <span>{children}</span>
          {RightIcon && <RightIcon className="h-4 w-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

