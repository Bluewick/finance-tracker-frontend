/**
 * Fluent Design System Card Container
 * Strictly adheres to DESIGN.md:
 * - #FFFFFF surface
 * - 15px border-radius
 * - 0px 2px 5px rgba(0, 0, 0, 0.09) ambient shadow
 * - 14px Inter SemiBold card title (-0.01em tracking)
 */
export default function Card({
  title,
  subtitle,
  action,
  children,
  interactive = false,
  padding = 'p-4',
  className = '',
  headerClassName = '',
  ...rest
}) {
  return (
    <div
      className={`fluent-card ${
        interactive ? 'fluent-card-interactive' : ''
      } ${padding} ${className}`}
      {...rest}
    >
      {(title || action) && (
        <div
          className={`mb-3.5 flex items-center justify-between gap-3 ${headerClassName}`}
        >
          <div>
            {title && (
              <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] font-medium text-[#626262]">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

