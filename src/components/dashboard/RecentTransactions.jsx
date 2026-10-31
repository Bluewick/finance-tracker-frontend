import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  ReceiptText,
} from 'lucide-react';
import CurrencyDisplay from '../common/CurrencyDisplay.jsx';
import { formatDate } from '../../utils/formatters.util.js';
import { TableRowSkeleton } from '../feedback/Skeleton.jsx';

/**
 * RecentTransactions Component
 * Strictly follows DESIGN.md Section 8 (Ranked Item Lists & Data Rows):
 * - Card shell: #FFFFFF, 15px border-radius, padding 12px
 * - Item row height: 60px-78px, leading thumbnail box 52px x 52px (#EBF3FF, 5px radius)
 * - Title text: Inter SemiBold 14px, #000000
 * - Metric/Value text: Inter SemiBold 14px
 * - Subtle bottom hairline divider (rgba(0,0,0,0.17)), last item omits border
 */
export default function RecentTransactions({
  transactions = [],
  loading = false,
}) {
  if (loading) {
    return <TableRowSkeleton rows={4} />;
  }

  return (
    <div className="fluent-card flex h-full flex-col justify-between p-[12px]">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
          Recent Transactions
        </h3>

        <Link
          to="/transactions"
          className="fluent-pressable inline-flex items-center gap-1 rounded-[5px] bg-[#F1F7FF] px-2.5 py-1 text-[10px] font-semibold leading-[14px] text-[#0063F9] hover:bg-[#EBF3FF]"
        >
          <span>View All</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* List Rows */}
      {transactions.length === 0 ? (
        <div className="my-2 flex flex-1 flex-col items-center justify-center rounded-[10px] bg-[#F1F6FF] p-6 text-center">
          <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
            <ReceiptText className="h-5 w-5" />
          </div>
          <p className="text-[13px] font-semibold text-[#000000]">
            No recent transactions found
          </p>
          <p className="mt-1 text-[11px] font-medium text-[#626262]">
            Transactions matching your active filters will appear here.
          </p>
          <Link
            to="/transactions?action=new"
            className="fluent-pressable mt-3 inline-flex items-center gap-1.5 rounded-[5px] bg-[#0063F9] px-3 py-1.5 text-[11px] font-semibold text-[#FFFFFF] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#0056D6]"
          >
            <span>+ Record First Transaction</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-black/[0.17]">
          {transactions.map((txn) => {
            const isIncome = txn.type === 'income';
            return (
              <div
                key={txn._id || txn.id}
                className="flex min-h-[68px] items-center justify-between gap-3 py-2.5 px-1 transition-colors hover:bg-[#F6F8FC]/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Leading Thumbnail / Icon Box (DESIGN.md: 5px radius, #EBF3FF background) */}
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[5px] bg-[#EBF3FF]">
                    {isIncome ? (
                      <ArrowDownLeft className="h-5 w-5 text-[#029A6D]" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-[#0063F9]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
                        {txn.category}
                      </p>
                      <span
                        className={`rounded-[21px] px-2 py-0.5 text-[10px] font-semibold leading-[14px] capitalize ${
                          isIncome
                            ? 'bg-[#09F7A1]/[0.10] text-[#029A6D]'
                            : 'bg-[#F70909]/[0.08] text-[#840000]'
                        }`}
                      >
                        {txn.type}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] font-medium text-[#626262]">
                      {txn.notes ? `${txn.notes} • ` : ''}
                      {formatDate(txn.date)}
                    </p>
                  </div>
                </div>

                {/* Right Metric Value */}
                <div className="shrink-0 text-right">
                  <CurrencyDisplay
                    amount={txn.amount}
                    type={txn.type}
                    showSign
                    className="text-[14px] font-semibold leading-5"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

