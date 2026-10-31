import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { FLUENT_CHART_PALETTE } from '../../utils/constants.util.js';
import { formatCurrency, formatPercentage } from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';

/**
 * Custom Frosted Glass Tooltip (DESIGN.md Section 9)
 */
function CategoryTooltip({ active, payload, currency }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip px-2.5 py-1.5">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {item.category} ({formatPercentage(item.percentage, 1)})
      </p>
      <p className="mt-0.5 text-[10px] font-semibold leading-3.5 text-[#444444]">
        {formatCurrency(item.amount, currency)} • {item.transaction_count}{' '}
        {item.transaction_count === 1 ? 'txn' : 'txns'}
      </p>
    </div>
  );
}

/**
 * CategoryPieChart Component (Task 4.2)
 * Connected to GET /api/analytics/category-breakdown
 * Follows DESIGN.md Section 7 (Radial & Concentric Distribution Cards):
 * - 3px solid #FFFFFF stroke barrier between donut segments
 * - Center cutout with centered summary grand_total
 * - Legend row with 10px x 10px circular dots + Inter SemiBold 10px labels
 */
export default function CategoryPieChart({
  breakdown,
  selectedType = 'expense',
  onTypeChange,
  loading = false,
}) {
  const { currency } = useAuth();

  if (loading) {
    return <ChartCardSkeleton height="h-[350px]" />;
  }

  const categories = breakdown?.categories || [];
  const grandTotal = Number(breakdown?.grand_total) || 0;

  return (
    <div className="fluent-card flex min-h-[350px] flex-col justify-between p-[12px]">
      {/* Card Header with Segment Pill Toggle (DESIGN.md Section 5) */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
          Category Breakdown
        </h3>

        {onTypeChange && (
          <div className="flex items-center gap-[8px]">
            {['expense', 'income'].map((typeOption) => {
              const isActive = selectedType === typeOption;
              return (
                <button
                  key={typeOption}
                  type="button"
                  onClick={() => onTypeChange(typeOption)}
                  className={`fluent-pressable rounded-[5px] px-[12px] py-[5px] text-[10px] font-semibold leading-[14px] capitalize transition-all ${
                    isActive
                      ? 'bg-[#F1F7FF] text-[#0063F9]'
                      : 'border-[0.5px] border-black/15 bg-[#FFFFFF] text-[#626262] hover:text-[#000000]'
                  }`}
                >
                  {typeOption === 'expense' ? 'Expenses' : 'Income'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Body: Donut Chart + Category List */}
      {categories.length === 0 ? (
        <div className="my-3 flex flex-1 flex-col items-center justify-center rounded-[10px] bg-[#F1F6FF] p-6 text-center">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <p className="text-[13px] font-semibold text-[#000000]">
            No {selectedType} data for this period
          </p>
          <p className="mt-1 text-[11px] font-medium text-[#626262]">
            Record an {selectedType} transaction to visualize category share.
          </p>
        </div>
      ) : (
        <>
          <div className="my-2 grid flex-1 grid-cols-1 items-center gap-2 sm:grid-cols-12">
            {/* Donut Chart with Centered Total */}
            <div className="relative h-[200px] w-full sm:col-span-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={1}
                    stroke="#FFFFFF"
                    strokeWidth={3}
                  >
                    {categories.map((entry, idx) => (
                      <Cell
                        key={entry.category}
                        fill={
                          FLUENT_CHART_PALETTE[idx % FLUENT_CHART_PALETTE.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CategoryTooltip currency={currency} />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Cutout Summary Total (DESIGN.md Section 7) */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-semibold text-[#626262] uppercase">
                  Total
                </span>
                <span className="max-w-[96px] truncate text-[13px] font-semibold leading-5 text-[#000000]">
                  {formatCurrency(grandTotal, currency)}
                </span>
              </div>
            </div>

            {/* Ranked Category Percentage Breakdown */}
            <div className="flex max-h-[195px] flex-col gap-2 overflow-y-auto pr-1 sm:col-span-6">
              {categories.map((item, idx) => {
                const dotColor =
                  FLUENT_CHART_PALETTE[idx % FLUENT_CHART_PALETTE.length];
                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between rounded-[7px] bg-[#F6F8FC] px-2.5 py-1.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-[10px] w-[10px] shrink-0 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span className="truncate text-[12px] font-semibold text-[#000000]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-[#626262]">
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <span className="rounded-[21px] bg-[#F1F7FF] px-2 py-0.5 text-[10px] font-semibold text-[#0063F9]">
                        {formatPercentage(item.percentage, 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Legend Row (DESIGN.md Section 7: 10px x 10px circular dot + 10px SemiBold label) */}
          <div className="flex flex-wrap items-center justify-center gap-[9px] pt-1">
            {categories.slice(0, 5).map((item, idx) => (
              <div key={item.category} className="flex items-center gap-1.5">
                <span
                  className="h-[10px] w-[10px] rounded-full"
                  style={{
                    backgroundColor:
                      FLUENT_CHART_PALETTE[idx % FLUENT_CHART_PALETTE.length],
                  }}
                />
                <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

