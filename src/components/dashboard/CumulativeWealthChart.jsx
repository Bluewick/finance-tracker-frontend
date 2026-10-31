import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import {
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';
import Badge from '../common/Badge.jsx';

function WealthTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="fluent-frosted-tooltip min-w-[155px] px-3 py-2">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {row.label || label}
      </p>
      <div className="mt-1 space-y-0.5 text-[10px] font-semibold leading-3.5">
        <p className="text-[#0063F9]">
          Cumulative Net: {formatCurrency(row.cumulative_net, currency)}
        </p>
        <p className="text-[#029A6D]">
          Period Net: {formatCurrency(row.period_net, currency)}
        </p>
      </div>
    </div>
  );
}

/**
 * 1. CumulativeWealthChart Component
 * Computes running cumulative net worth / cashflow balance over time
 * from monthly-trends or filtered chronological transactions.
 */
export default function CumulativeWealthChart({
  trends = [],
  transactions = [],
  hasActiveFilters = false,
  loading = false,
}) {
  const { currency } = useAuth();

  const seriesData = useMemo(() => {
    const activeMonthsCount = trends.filter(
      (m) => Number(m.income) > 0 || Number(m.expense) > 0
    ).length;

    if (
      (hasActiveFilters || activeMonthsCount <= 1) &&
      Array.isArray(transactions) &&
      transactions.length > 0
    ) {
      const byDate = new Map();
      const sorted = [...transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      for (const txn of sorted) {
        const dateKey = String(txn.date || '').split('T')[0];
        if (!dateKey) continue;
        const curr = byDate.get(dateKey) || {
          label: formatDate(dateKey, { day: '2-digit', month: 'short' }),
          income: 0,
          expense: 0,
        };
        const amt = Number(txn.amount) || 0;
        if (txn.type === 'income') curr.income += amt;
        else curr.expense += amt;
        byDate.set(dateKey, curr);
      }

      let running = 0;
      return Array.from(byDate.values()).map((d) => {
        const periodNet = d.income - d.expense;
        running += periodNet;
        return {
          label: d.label,
          period_net: periodNet,
          cumulative_net: running,
        };
      });
    }

    let running = 0;
    return trends.map((m) => {
      const inc = Number(m.income) || 0;
      const exp = Number(m.expense) || 0;
      const periodNet =
        m.net_savings !== undefined ? Number(m.net_savings) : inc - exp;
      running += periodNet;
      return {
        label: m.month_name || m.label,
        period_net: periodNet,
        cumulative_net: running,
      };
    });
  }, [trends, transactions, hasActiveFilters]);

  if (loading) {
    return <ChartCardSkeleton height="h-[320px]" />;
  }

  const finalBalance =
    seriesData.length > 0
      ? seriesData[seriesData.length - 1].cumulative_net
      : 0;

  return (
    <div className="fluent-card flex min-h-[320px] flex-col justify-between px-[12px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Cumulative Net Worth Trajectory
          </h3>
          <p className="text-[11px] font-medium text-[#626262]">
            Running balance accumulation across periods
          </p>
        </div>

        <Badge
          variant={finalBalance >= 0 ? 'success' : 'danger'}
          size="sm"
          icon={TrendingUp}
        >
          {formatCurrency(finalBalance, currency)}
        </Badge>
      </div>

      <div className="my-2.5 flex flex-1 flex-col justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        {seriesData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-[13px] font-semibold text-[#000000]">
              No trajectory data yet
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#626262]">
              Record transactions to plot your running net balance curve.
            </p>
          </div>
        ) : (
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={seriesData}
                margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0063F9" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#0063F9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                <Tooltip content={<WealthTooltip currency={currency} />} />
                <Area
                  type="monotone"
                  dataKey="cumulative_net"
                  stroke="#0063F9"
                  strokeWidth={2.5}
                  fill="url(#wealthGrad)"
                  activeDot={{
                    r: 4,
                    fill: '#0063F9',
                    stroke: '#FFFFFF',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#0063F9]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Running Cumulative Balance
          </span>
        </div>
      </div>
    </div>
  );
}

