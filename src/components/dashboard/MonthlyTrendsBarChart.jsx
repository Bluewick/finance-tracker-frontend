import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { AVAILABLE_YEARS } from '../../utils/constants.util.js';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';

/**
 * Custom Frosted Glass Tooltip (DESIGN.md Section 9)
 */
function MonthlyTrendsTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="fluent-frosted-tooltip min-w-[140px] px-3 py-2">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {row.label || label}
      </p>
      <div className="mt-1 space-y-0.5 text-[10px] font-semibold leading-3.5">
        <p className="text-[#0063F9]">
          Income: {formatCurrency(row.income, currency)}
        </p>
        <p className="text-[#840000]">
          Expense: {formatCurrency(row.expense, currency)}
        </p>
        <p className="border-t border-black/10 pt-0.5 text-[#029A6D]">
          Net Savings: {formatCurrency(row.net_savings, currency)}
        </p>
      </div>
    </div>
  );
}

/**
 * MonthlyTrendsBarChart Component (Task 4.3)
 * Connected to GET /api/analytics/monthly-trends
 * Strictly follows DESIGN.md Section 6:
 * - Card shell: #FFFFFF, 15px border-radius, padding 11px 12px
 * - Recessed plotting track: 10px border-radius, #F1F6FF soft background
 * - Rounded top bar caps (4px), Primary Data Blue (#4891FF) & Royal/Sky accents
 * - X-Axis & Y-Axis values in Inter SemiBold 10px, #626262
 */
export default function MonthlyTrendsBarChart({
  trendsData,
  selectedYear,
  onYearChange,
  loading = false,
}) {
  const { currency } = useAuth();

  if (loading) {
    return <ChartCardSkeleton height="h-[350px]" />;
  }

  const yearOptions = AVAILABLE_YEARS;
  const trends = trendsData?.trends || [];
  const hasAnyActivity = trends.some(
    (item) => Number(item.income) > 0 || Number(item.expense) > 0
  );

  return (
    <div className="fluent-card flex min-h-[350px] flex-col justify-between px-[12px] py-[11px]">
      {/* Card Header (DESIGN.md Section 5 & 6) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Monthly Cashflow Trends ({selectedYear})
          </h3>
        </div>

        {/* Year Filter Segment Pills */}
        {onYearChange && (
          <div className="flex items-center gap-[8px]">
            {yearOptions.map((yr) => {
              const isActive = Number(selectedYear) === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onYearChange(yr)}
                  className={`fluent-pressable rounded-[5px] px-[12px] py-[5px] text-[10px] font-semibold leading-[14px] transition-all ${
                    isActive
                      ? 'bg-[#F1F7FF] text-[#0063F9]'
                      : 'border-[0.5px] border-black/15 bg-[#FFFFFF] text-[#626262] hover:text-[#000000]'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Recessed Plotting Track (#F1F6FF, 10px radius) */}
      <div className="my-2.5 flex flex-1 flex-col justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        {!hasAnyActivity && trends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="text-[13px] font-semibold text-[#000000]">
              No monthly trend data for {selectedYear}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#626262]">
              Add income or expense entries to populate monthly bars.
            </p>
          </div>
        ) : (
          <div className="h-[235px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0, 0, 0, 0.06)"
                />
                <XAxis
                  dataKey="month_name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#626262',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                  tick={{
                    fill: '#626262',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(72, 145, 255, 0.08)', radius: 4 }}
                  content={<MonthlyTrendsTooltip currency={currency} />}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#4891FF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#064099"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
                <Bar
                  dataKey="net_savings"
                  name="Net Savings"
                  fill="#09F7A1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Legend Row (DESIGN.md Section 7: 10px x 10px circular dot + Inter SemiBold 10px label) */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#4891FF]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Income
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#064099]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Expense
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#09F7A1]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Net Savings
          </span>
        </div>
      </div>
    </div>
  );
}
