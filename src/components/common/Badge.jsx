/**
 * Semantic Status & Delta Badge Pill (DESIGN.md Section 4)
 * - Positive Delta / Income / Healthy: container rgba(9, 247, 161, 0.10), text #029A6D, 21px pill
 * - Negative Delta / Expense / Exceeded: container rgba(247, 9, 9, 0.08), text #840000, 21px pill
 * - Primary Cobalt Tint: container #F1F7FF, text #0063F9
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
}) {
  const variants = {
    success: 'bg-[#09F7A1]/[0.10] text-[#029A6D]',
    income: 'bg-[#09F7A1]/[0.10] text-[#029A6D]',
    danger: 'bg-[#F70909]/[0.08] text-[#840000]',
    expense: 'bg-[#F70909]/[0.08] text-[#840000]',
    primary: 'bg-[#F1F7FF] text-[#0063F9]',
    warning: 'bg-amber-500/12 text-amber-800',
    neutral: 'bg-[#F5F5F5] text-[#626262]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] leading-[14px]',
    md: 'px-2.5 py-1 text-[11px] leading-[14px]',
    lg: 'px-3 py-1 text-[12px] leading-[16px]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[21px] font-semibold ${
        variants[variant] || variants.neutral
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
}

