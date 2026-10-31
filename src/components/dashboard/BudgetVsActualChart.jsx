import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercentage,
} from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';

function BudgetVsActualTooltip({ active, payload, currency }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip min-w-[155px] px-3 py-2">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {item.label} ({formatPercentage(item.percentage_used, 1)})
      </p>
      <div className="mt-1 space-y-0.5 text-[10px] font-semibold leading-3.5">
        <p className="text-[#0063F9]">
          Budget Cap: {formatCurrency(item.amount_limit, currency)}
        </p>
        <p className={item.is_exceeded ? 'text-[#840000]' : 'text-[#029A6D]'}>
          Actual Spent: {formatCurrency(item.actual_spent, currency)}
        </p>
      </div>
    </div>
  );
}

/**
 * 2. BudgetVsActualChart Component
 * Side-by-side comparison of Planned Budget Limit vs Actual Spend across categories
 */
export default function BudgetVsActualChart({
  budgets = [],
  loading = false,
}) {
  const { currency } = useAuth();

  if (loading) {
    return <ChartCardSkeleton height="h-[320px]" />;
  }

  const chartData = budgets.map((b) => ({
    label: b.category === 'ALL' ? 'Overall (ALL)' : b.category,
    amount_limit: Number(b.amount_limit) || 0,
    actual_spent: Number(b.actual_spent) || 0,
    percentage_used: Number(b.percentage_used) || 0,
    is_exceeded:
      Boolean(b.is_exceeded) || Number(b.percentage_used) >= 100,
  }));

  return (
    <div className="fluent-card flex min-h-[320px] flex-col justify-between px-[12px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Budget Cap vs. Actual Spend
          </h3>
          <p className="text-[11px] font-medium text-[#626262]">
            Planned monthly limits compared to real expenses
          </p>
        </div>

        <Link
          to="/budgets"
          className="fluent-pressable rounded-[5px] bg-[#F1F7FF] px-2.5 py-1 text-[10px] font-semibold text-[#0063F9] hover:bg-[#EBF3FF]"
        >
          Configure
        </Link>
      </div>

      <div className="my-2.5 flex flex-1 flex-col justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
              <Target className="h-5 w-5" />
            </div>
            <p className="text-[13px] font-semibold text-[#000000]">
              No monthly budgets to compare
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#626262]">
              Set category or overall budgets to compare planned vs. actual spend.
            </p>
          </div>
        ) : (
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
                barGap={5}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(0, 0, 0, 0.06)"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#626262', fontSize: 10, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                  tick={{ fill: '#626262', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(72, 145, 255, 0.08)', radius: 4 }}
                  content={<BudgetVsActualTooltip currency={currency} />}
                />
                <Bar
                  dataKey="amount_limit"
                  name="Budget Limit"
                  fill="#8AB9FF"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="actual_spent"
                  name="Actual Spent"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={entry.is_exceeded ? '#F70909' : '#0056D6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#8AB9FF]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Budget Limit
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#0056D6]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Actual Spend (Within Cap)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#F70909]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Exceeded Cap
          </span>
        </div>
      </div>
    </div>
  );
}

