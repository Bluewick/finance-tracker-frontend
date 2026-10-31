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
import { Receipt } from 'lucide-react';
import useAuth from '../../hooks/useAuth.js';
import { FLUENT_CHART_PALETTE } from '../../utils/constants.util.js';
import {
  formatCompactCurrency,
  formatCurrency,
} from '../../utils/formatters.util.js';
import { ChartCardSkeleton } from '../feedback/Skeleton.jsx';

function TicketTooltip({ active, payload, currency }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="fluent-frosted-tooltip min-w-[155px] px-3 py-2">
      <p className="text-[10px] font-semibold leading-3.5 text-[#000000]">
        {item.category} ({item.transaction_count}{' '}
        {item.transaction_count === 1 ? 'txn' : 'txns'})
      </p>
      <div className="mt-1 space-y-0.5 text-[10px] font-semibold leading-3.5">
        <p className="text-[#0063F9]">
          Avg Ticket: {formatCurrency(item.avg_ticket, currency)}
        </p>
        <p className="text-[#474747]">
          Total: {formatCurrency(item.amount, currency)}
        </p>
      </div>
    </div>
  );
}

/**
 * 4. CategoryTicketChart Component
 * Computes Average Spend per Transaction (amount / transaction_count) per category
 * from GET /api/analytics/category-breakdown
 */
export default function CategoryTicketChart({
  breakdown,
  loading = false,
}) {
  const { currency } = useAuth();

  const ticketData = useMemo(() => {
    const categories = breakdown?.categories || [];
    return categories.map((item) => {
      const count = Math.max(1, Number(item.transaction_count) || 1);
      const total = Number(item.amount) || 0;
      return {
        category: item.category,
        amount: total,
        transaction_count: count,
        avg_ticket: Number((total / count).toFixed(2)),
      };
    });
  }, [breakdown]);

  if (loading) {
    return <ChartCardSkeleton height="h-[300px]" />;
  }

  return (
    <div className="fluent-card flex min-h-[300px] flex-col justify-between px-[12px] py-[11px]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
            Avg. Spend per Transaction
          </h3>
          <p className="text-[11px] font-medium text-[#626262]">
            Average ticket size across active categories
          </p>
        </div>
      </div>

      <div className="my-2.5 flex flex-1 flex-col justify-center rounded-[10px] bg-[#F1F6FF] p-3">
        {ticketData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
              <Receipt className="h-5 w-5" />
            </div>
            <p className="text-[13px] font-semibold text-[#000000]">
              No category ticket metrics yet
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#626262]">
              Add transactions to analyze average spend per entry.
            </p>
          </div>
        ) : (
          <div className="h-[190px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ticketData}
                layout="vertical"
                margin={{ top: 4, right: 14, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="rgba(0, 0, 0, 0.06)"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => formatCompactCurrency(val, currency)}
                  tick={{ fill: '#626262', fontSize: 10, fontWeight: 600 }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={76}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#000000', fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(72, 145, 255, 0.08)', radius: 4 }}
                  content={<TicketTooltip currency={currency} />}
                />
                <Bar
                  dataKey="avg_ticket"
                  radius={[0, 4, 4, 0]}
                  barSize={18}
                >
                  {ticketData.map((entry, idx) => (
                    <Cell
                      key={entry.category}
                      fill={
                        FLUENT_CHART_PALETTE[idx % FLUENT_CHART_PALETTE.length]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[#4891FF]" />
          <span className="text-[10px] font-semibold leading-[14px] text-[#000000]">
            Avg Cost / Transaction (Category Total ÷ Count)
          </span>
        </div>
      </div>
    </div>
  );
}

