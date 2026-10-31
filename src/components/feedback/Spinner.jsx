/**
 * Animated SVG Spinner adhering to Fluent Design System
 * Never uses raw "Loading..." text on its own.
 */
export default function Spinner({ size = 'md', variant = 'primary', className = '' }) {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-11 w-11',
  };

  const colorClasses = {
    primary: 'text-[#0063F9]',
    white: 'text-[#FFFFFF]',
    muted: 'text-[#626262]',
    danger: 'text-[#840000]',
    success: 'text-[#029A6D]',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size] || sizeClasses.md} ${
        colorClasses[variant] || colorClasses.primary
      } ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

