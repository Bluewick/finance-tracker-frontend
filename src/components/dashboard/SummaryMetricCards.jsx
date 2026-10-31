import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from '../../utils/formatters.util.js';
import { MetricCardSkeleton } from '../feedback/Skeleton.jsx';

/**
 * Builds real time-series points combining Option 1 (Monthly Trends)
 * and Option 2 (Chronological Daily Aggregation when filters or multi-day transactions exist).
 */
function buildSparklineSeries(trends = [], transactions = [], hasActiveFilters = false) {
  // Option 2: If filters are active (or monthly trends has <= 1 active month while multiple transaction dates exist),
  // aggregate transactions chronologically by date (YYYY-MM-DD).
  const activeMonthsCount = trends.filter(
    (m) => Number(m.income) > 0 || Number(m.expense) > 0
  ).length;

  if (
    (hasActiveFilters || activeMonthsCount <= 1) &&
    Array.isArray(transactions) &&
    transactions.length > 0
  ) {
    const byDate = new Map();

    // Sort oldest to newest
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (const txn of sorted) {
      const dateKey = String(txn.date || '').split('T')[0];
      if (!dateKey) continue;

      const existing = byDate.get(dateKey) || {
        label: formatDate(dateKey, { day: '2-digit', month: 'short' }),
        income: 0,
        expense: 0,
        net_savings: 0,
        savings_rate: 0,
      };

      const amount = Number(txn.amount) || 0;
      if (txn.type === 'income') {
        existing.income += amount;
      } else {
        existing.expense += amount;
      }
      existing.net_savings = existing.income - existing.expense;
      existing.savings_rate =
        existing.income > 0
          ? Number(
              (((existing.income - existing.expense) / existing.income) * 100).toFixed(1)
            )
          : 0;

      byDate.set(dateKey, existing);
    }

    const dailyPoints = Array.from(byDate.values());
    if (dailyPoints.length >= 2) {
      return dailyPoints;
    }
  }

  // Option 1: Use the 12-month series from GET /api/analytics/monthly-trends
  if (Array.isArray(trends) && trends.length > 0) {
    return trends.map((m) => {
      const inc = Number(m.income) || 0;
      const exp = Number(m.expense) || 0;
      const net =
        m.net_savings !== undefined ? Number(m.net_savings) : inc - exp;
      const rate =
        inc > 0 ? Number((((inc - exp) / inc) * 100).toFixed(1)) : 0;

      return {
        label: m.label || m.month_name,
        income: inc,
        expense: exp,
        net_savings: net,
        savings_rate: Math.max(-100, Math.min(100, rate)),
      };
    });
  }

  return [];
}

/**
 * Frosted Glass Micro Tooltip for KPI Sparklines (DESIGN.md Section 9)
 */
function SparklineTooltip({ active, payload, currency, isPercentage }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  const val = payload[0]?.value;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip pointer-events-none z-30 px-2 py-1">
      <p className="text-[8px] font-semibold leading-2.5 text-[#444444]">
        {item.label}
      </p>
      <p className="mt-0.5 text-[9px] font-bold leading-3 text-[#000000]">
        {isPercentage
          ? formatPercentage(val, 1)
          : formatCurrency(val, currency)}
      </p>
    </div>
  );
}

/**
 * Live Recharts Mini Area Sparkline inside the 5px radius KPI badge container
 * Adheres to DESIGN.md Section 4 Variant B:
 * rgba(72, 145, 255, 0.06) background, 1px solid rgba(72, 145, 255, 0.21) border
 */
function LiveMiniSparkline({
  data = [],
  dataKey,
  color = '#0063F9',
  gradientId,
  currency,
  isPercentage = false,
}) {
  return (
    <div
      className="hidden sm:flex h-[68px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] p-1"
      style={{
        backgroundColor: 'rgba(72, 145, 255, 0.06)',
        border: '1px solid rgba(72, 145, 255, 0.21)',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 2, left: 2, bottom: 2 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.32} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip
            content={
              <SparklineTooltip
                currency={currency}
                isPercentage={isPercentage}
              />
            }
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: '#FFFFFF', strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * SummaryMetricCards Component (Task 4.1)
 * Connected to GET /api/analytics/summary, GET /api/analytics/monthly-trends, and GET /api/transactions
 * Displays Total Income, Total Expenses, Net Balance, and Savings Rate (%) with real live AreaChart sparklines.
 */
export default function SummaryMetricCards({
  summary,
  trends = [],
  transactions = [],
  hasActiveFilters = false,
  loading = false,
}) {
  const { currency } = useAuth();

  const sparklineData = useMemo(
    () => buildSparklineSeries(trends, transactions, hasActiveFilters),
    [trends, transactions, hasActiveFilters]
  );

  if (loading) {
    return <MetricCardSkeleton count={4} />;
  }

  const totalIncome = Number(summary?.total_income) || 0;
  const totalExpense = Number(summary?.total_expense) || 0;
  const netBalance = Number(summary?.net_balance) || 0;
  const savingsRate = Number(summary?.savings_rate) || 0;
  const counts = summary?.transaction_counts || {
    income: 0,
    expense: 0,
    total: 0,
  };

  const isPositiveNet = netBalance >= 0;
  const isHealthySavings = savingsRate >= 20;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Total Income Card */}
      <div className="fluent-card fluent-card-interactive flex min-h-[130px] items-center justify-between gap-2 p-[12px]">
        <div className="flex h-full min-w-0 flex-col justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 shrink-0 text-[#029A6D]" />
            <span className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
              Total Income
            </span>
          </div>

          <div
            className="truncate text-[26px] 2xl:text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#000000]"
            title={formatCurrency(totalIncome, currency)}
          >
            {formatCurrency(totalIncome, currency)}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-[21px] bg-[#09F7A1]/[0.10] px-[6px] py-[2px] text-[10px] font-semibold leading-[14px] text-[#029A6D]">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {counts.income} {counts.income === 1 ? 'Credit' : 'Credits'}
            </span>
            <span className="text-[10px] font-semibold text-[#626262]">
              Inflow
            </span>
          </div>
        </div>

        <LiveMiniSparkline
          data={sparklineData}
          dataKey="income"
          color="#029A6D"
          gradientId="spark-income"
          currency={currency}
        />
      </div>

      {/* 2. Total Expenses Card */}
      <div className="fluent-card fluent-card-interactive flex min-h-[130px] items-center justify-between gap-2 p-[12px]">
        <div className="flex h-full min-w-0 flex-col justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 shrink-0 text-[#840000]" />
            <span className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
              Total Expenses
            </span>
          </div>

          <div
            className="truncate text-[26px] 2xl:text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#000000]"
            title={formatCurrency(totalExpense, currency)}
          >
            {formatCurrency(totalExpense, currency)}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-[21px] bg-[#F70909]/[0.08] px-[6px] py-[2px] text-[10px] font-semibold leading-[14px] text-[#840000]">
              <ArrowDownRight className="h-3.5 w-3.5" />
              {counts.expense} {counts.expense === 1 ? 'Debit' : 'Debits'}
            </span>
            <span className="text-[10px] font-semibold text-[#626262]">
              Outflow
            </span>
          </div>
        </div>

        <LiveMiniSparkline
          data={sparklineData}
          dataKey="expense"
          color="#840000"
          gradientId="spark-expense"
          currency={currency}
        />
      </div>

      {/* 3. Net Balance Card */}
      <div className="fluent-card fluent-card-interactive flex min-h-[130px] items-center justify-between gap-2 p-[12px]">
        <div className="flex h-full min-w-0 flex-col justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 shrink-0 text-[#0063F9]" />
            <span className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
              Net Balance
            </span>
          </div>

          <div
            className="truncate text-[26px] 2xl:text-[32px] font-semibold leading-[40px] tracking-[-0.02em] text-[#000000]"
            title={formatCurrency(netBalance, currency)}
          >
            {formatCurrency(netBalance, currency)}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-[21px] px-[6px] py-[2px] text-[10px] font-semibold leading-[14px] ${
                isPositiveNet
                  ? 'bg-[#09F7A1]/[0.10] text-[#029A6D]'
                  : 'bg-[#F70909]/[0.08] text-[#840000]'
              }`}
            >
              {isPositiveNet ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {isPositiveNet ? 'Surplus' : 'Deficit'}
            </span>
            <span className="text-[10px] font-semibold text-[#626262]">
              {counts.total} Total Txns
            </span>
          </div>
        </div>

        <LiveMiniSparkline
          data={sparklineData}
          dataKey="net_savings"
          color="#0063F9"
          gradientId="spark-net"
          currency={currency}
        />
      </div>

      {/* 4. Savings Rate Card */}
      <div className="fluent-card fluent-card-interactive flex min-h-[130px] items-center justify-between gap-2 p-[12px]">
        <div className="flex h-full min-w-0 flex-col justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 shrink-0 text-[#4891FF]" />
            <span className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
              Savings Rate
            </span>
          </div>

          <div className="truncate text-[28px] 2xl:text-[34px] font-semibold leading-[40px] tracking-[-0.02em] text-[#000000]">
            {formatPercentage(savingsRate, 1)}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-[21px] px-[6px] py-[2px] text-[10px] font-semibold leading-[14px] ${
                isHealthySavings
                  ? 'bg-[#09F7A1]/[0.10] text-[#029A6D]'
                  : 'bg-[#F70909]/[0.08] text-[#840000]'
              }`}
            >
              {isHealthySavings ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {isHealthySavings ? 'Healthy' : 'Low Buffer'}
            </span>
            <span className="text-[10px] font-semibold text-[#626262]">
              of Income
            </span>
          </div>
        </div>

        <LiveMiniSparkline
          data={sparklineData}
          dataKey="savings_rate"
          color="#4891FF"
          gradientId="spark-savings"
          currency={currency}
          isPercentage
        />
      </div>
    </div>
  );
}
