/**
 * PageContainer Component
 * Balanced, medium-sized page header typography and compact action controls slot
 */
export default function PageContainer({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = '',
}) {
  return (
    <section className={`w-full ${className}`}>
      {(title || actions || badge) && (
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            {badge && <div className="mb-1.5">{badge}</div>}
            {title && (
              <h1 className="text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#000000]">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[13px] font-medium leading-5 text-[#626262]">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
      )}

      {children}
    </section>
  );
}
