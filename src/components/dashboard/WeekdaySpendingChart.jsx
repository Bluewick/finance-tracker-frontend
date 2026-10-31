import { useMemo } from 'react';
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
import { CalendarDays } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import {
  formatCompactCurrency,
  formatCurrency,
} from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';
import Badge from '../common/Badge.jsx';

const WEEKDAYS = [
  { index: 1, short: 'Mon', full: 'Monday' },
  { index: 2, short: 'Tue', full: 'Tuesday' },
  { index: 3, short: 'Wed', full: 'Wednesday' },
  { index: 4, short: 'Thu', full: 'Thursday' },
  { index: 5, short: 'Fri', full: 'Friday' },
  { index: 6, short: 'Sat', full: 'Saturday' },
  { index: 0, short: 'Sun', full: 'Sunday' },
];

function WeekdayTooltip({ active, payload, currency }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip min-w-[130px] px-2.5 py-1.5">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {item.full}
      </p>
      <p className="mt-0.5 text-[10px] font-semibold leading-3.5 text-[#0063F9]">
        Spent: {formatCurrency(item.expense, currency)}
      </p>
      <p className="text-[9px] font-medium text-[#626262]">
        {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
      </p>
    </div>
  );
}

/**
 * 3. WeekdaySpendingChart Component
 * Analyzes expense transactions by day of the week (Mon - Sun)
 */
export default function WeekdaySpendingChart({
  transactions = [],
  loading = false,
}) {
  const { currency } = useAuth();

  const { weekdayData, peakDay } = useMemo(() => {
    const buckets = WEEKDAYS.map((d) => ({
      ...d,
      expense: 0,
      count: 0,
    }));

    for (const txn of transactions) {
      if (txn.type !== 'expense' || !txn.date) continue;
      const dt = new Date(txn.date);
      if (Number.isNaN(dt.getTime())) continue;
      const dayIdx = dt.getUTCDay();
      const target = buckets.find((b) => b.index === dayIdx);
      if (target) {
        target.expense += Number(txn.amount) || 0;
        target.count += 1;
      }
    }

    let maxDay = null;
    for (const b of buckets) {
      if (b.expense > 0 && (!maxDay || b.expense > maxDay.expense)) {
        maxDay = b;
      }
    }

    return { weekdayData: buckets, peakDay: maxDay };
  }, [transactions]);

  if (loading) {
    return <ChartCardSkeleton height="h-[300px]" />;
  }

  return (
    <div className="fluent-card flex min-h-[300px] flex-col justify-between px-[12px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Day-of-Week Spending Pattern
          </h3>
          <p className="text-[11px] font-medium text-[#626262]">
            Expense distribution across weekdays & weekends
          </p>
        </div>

        {peakDay && (
          <Badge variant="primary" size="sm" icon={CalendarDays}>
            Peak: {peakDay.short}
          </Badge>
        )}
      </div>

      <div className="my-2.5 flex flex-1 flex-col justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        <div className="h-[190px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayData}
              margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(0, 0, 0, 0.06)"
              />
              <XAxis
                dataKey="short"
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
                content={<WeekdayTooltip currency={currency} />}
              />
              <Bar
                dataKey="expense"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              >
                {weekdayData.map((entry) => {
                  const isPeak = peakDay && entry.short === peakDay.short;
                  return (
                    <Cell
                      key={entry.short}
                      fill={isPeak ? '#0063F9' : '#4891FF'}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#4891FF]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Regular Day
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#0063F9]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Peak Spend Day
          </span>
        </div>
      </div>
    </div>
  );
}

