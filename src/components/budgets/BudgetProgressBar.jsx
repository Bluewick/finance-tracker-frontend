/**
 * BudgetProgressBar Component
 * Visual progress indicator color-coded by budget utilization:
 * - < 75%: Cobalt/Emerald (Healthy)
 * - 75% - 99%: Amber (Approaching Limit)
 * - >= 100% or isExceeded: Crimson (#F70909)
 */
export default function BudgetProgressBar({
  percentageUsed = 0,
  isExceeded = false,
  height = 'h-2.5',
  trackBg = 'bg-[#EDF2F9]',
}) {
  const numericPct = Number(percentageUsed) || 0;
  const clampedWidth = Math.min(100, Math.max(0, numericPct));

  let fillColor = 'bg-[#0063F9]';
  if (isExceeded || numericPct >= 100) {
    fillColor = 'bg-[#F70909]';
  } else if (numericPct >= 75) {
    fillColor = 'bg-amber-500';
  }

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${height} ${trackBg}`}
      role="progressbar"
      aria-valuenow={Math.round(numericPct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${fillColor}`}
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  );
}

