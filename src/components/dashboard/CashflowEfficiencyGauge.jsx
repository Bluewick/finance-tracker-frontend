import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Gauge } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { formatCurrency, formatPercentage } from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';
import Badge from '../common/Badge.jsx';

function GaugeTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip px-2.5 py-1.5">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {item.name}: {formatPercentage(item.value, 1)}
      </p>
    </div>
  );
}

/**
 * 5. CashflowEfficiencyGauge Component
 * Concentric Radial Gauge (DESIGN.md Section 7) comparing:
 * - Savings Retention Rate (%)
 * - Expense Burn Rate (%)
 */
export default function CashflowEfficiencyGauge({
  summary,
  loading = false,
}) {
  const { currency } = useAuth();

  if (loading) {
    return <ChartCardSkeleton height="h-[300px]" />;
  }

  const totalIncome = Number(summary?.total_income) || 0;
  const totalExpense = Number(summary?.total_expense) || 0;
  const savingsRate = Math.max(
    0,
    Math.min(100, Number(summary?.savings_rate) || 0)
  );
  const expenseRatio =
    totalIncome > 0
      ? Math.max(0, Math.min(100, Number(((totalExpense / totalIncome) * 100).toFixed(1))))
      : totalExpense > 0
        ? 100
        : 0;

  const radialData = [
    {
      name: 'Expense Burn Rate',
      value: expenseRatio,
      fill: '#0056D6',
    },
    {
      name: 'Savings Retention',
      value: savingsRate,
      fill: '#09F7A1',
    },
  ];

  const isHealthy = savingsRate >= 20;

  return (
    <div className="fluent-card flex min-h-[300px] flex-col justify-between px-[12px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Cashflow Efficiency Gauge
          </h3>
          <p className="text-[11px] font-medium text-[#626262]">
            Savings retention vs. expense burn ratio
          </p>
        </div>

        <Badge
          variant={isHealthy ? 'success' : 'warning'}
          size="sm"
          icon={Gauge}
        >
          Target: 20%+ Saved
        </Badge>
      </div>

      <div className="relative my-2 flex flex-1 items-center justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        <div className="h-[190px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="48%"
              outerRadius="88%"
              barSize={14}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: '#FFFFFF' }}
                dataKey="value"
                cornerRadius={10}
              />
              <Tooltip content={<GaugeTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Center Readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-semibold text-[#626262] uppercase">
            Saved
          </span>
          <span className="text-[18px] font-bold leading-6 text-[#000000]">
            {formatPercentage(savingsRate, 1)}
          </span>
          <span className="text-[10px] font-semibold text-[#029A6D]">
            {formatCurrency(Math.max(0, totalIncome - totalExpense), currency)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#09F7A1]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Savings ({formatPercentage(savingsRate, 0)})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#0056D6]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Expense Burn ({formatPercentage(expenseRatio, 0)})
          </span>
        </div>
      </div>
    </div>
  );
}

