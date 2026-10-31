import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import CurrencyDisplay from '../common/CurrencyDisplay.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { TableRowSkeleton } from '../feedback/Skeleton.jsx';
import { formatDate } from '../../utils/formatters.util.js';

/**
 * TransactionTable Component (Task 5.3 — Use Cases 4 & 6)
 * Displays chronological transaction history with category icon boxes (#EBF3FF, 5px radius),
 * type pills, formatted dates, amounts, Edit/Delete actions, and server-driven pagination controls.
 */
export default function TransactionTable({
  transactions = [],
  meta,
  loading = false,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
  onAddFirst,
}) {
  if (loading) {
    return <TableRowSkeleton rows={6} />;
  }

  if (!transactions.length) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No transactions found"
        description="There are no income or expense entries matching your current filters. Try adjusting your filters or record a new transaction."
        actionLabel="Record Transaction"
        actionIcon={Plus}
        onAction={onAddFirst}
      />
    );
  }

  const currentPage = Number(meta?.page) || 1;
  const totalPages = Number(meta?.total_pages) || 1;
  const totalItems = Number(meta?.total) || transactions.length;
  const currentLimit = Number(meta?.limit) || 10;

  return (
    <div className="fluent-card overflow-hidden p-3 sm:p-4">
      {/* Desktop & Tablet Header Strip */}
      <div className="hidden border-b border-black/10 px-3 pb-3 text-[11px] font-semibold tracking-wider text-[#767676] uppercase md:grid md:grid-cols-12 md:gap-4">
        <div className="col-span-5">Category & Description</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-2 text-right">Amount</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Transaction Rows (DESIGN.md Section 8: 60px-78px height, #EBF3FF 5px thumbnail, subtle hairline divider) */}
      <div className="divide-y divide-black/[0.17]">
        {transactions.map((txn) => {
          const isIncome = txn.type === 'income';
          const id = txn._id || txn.id;

          return (
            <div
              key={id}
              className="flex flex-col justify-between gap-3 px-2 py-3 transition-colors hover:bg-[#F6F8FC]/80 md:grid md:min-h-[70px] md:grid-cols-12 md:items-center md:gap-4"
            >
              {/* Leading Icon Box + Category + Notes */}
              <div className="flex items-center gap-3.5 min-w-0 md:col-span-5">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[5px] bg-[#EBF3FF]">
                  {isIncome ? (
                    <ArrowDownLeft className="h-5 w-5 text-[#029A6D]" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-[#0063F9]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
                    {txn.category}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] font-medium text-[#626262]">
                    {txn.notes || 'No additional notes'}
                  </p>
                </div>
              </div>

              {/* Type Pill */}
              <div className="flex items-center justify-between md:col-span-2">
                <span className="text-[11px] font-semibold text-[#767676] md:hidden">
                  Type:
                </span>
                <Badge
                  variant={isIncome ? 'income' : 'expense'}
                  size="sm"
                  className="capitalize"
                >
                  {txn.type}
                </Badge>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between md:col-span-2">
                <span className="text-[11px] font-semibold text-[#767676] md:hidden">
                  Date:
                </span>
                <span className="text-[13px] font-semibold text-[#626262]">
                  {formatDate(txn.date)}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between md:col-span-2 md:justify-end">
                <span className="text-[11px] font-semibold text-[#767676] md:hidden">
                  Amount:
                </span>
                <CurrencyDisplay
                  amount={txn.amount}
                  type={txn.type}
                  showSign
                  className="text-[14px] font-semibold leading-5"
                />
              </div>

              {/* Actions (Edit & Delete) */}
              <div className="flex items-center justify-end gap-1.5 md:col-span-1">
                <button
                  type="button"
                  onClick={() => onEdit?.(txn)}
                  title="Edit Transaction"
                  aria-label={`Edit ${txn.category} transaction`}
                  className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-black/[0.04] text-[#474747] hover:bg-[#F1F7FF] hover:text-[#0063F9]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(txn)}
                  title="Delete Transaction"
                  aria-label={`Delete ${txn.category} transaction`}
                  className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-black/[0.04] text-[#474747] hover:bg-[#F70909]/[0.10] hover:text-[#840000]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer (driven by meta: { page, limit, total, total_pages }) */}
      <div className="mt-3 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-3.5 sm:flex-row">
        <div className="flex items-center gap-3 text-[12px] font-semibold text-[#626262]">
          <span>
            Showing page <strong className="text-[#000000]">{currentPage}</strong>{' '}
            of <strong className="text-[#000000]">{totalPages}</strong> ({totalItems}{' '}
            {totalItems === 1 ? 'record' : 'records'})
          </span>

          {onLimitChange && (
            <select
              value={currentLimit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="rounded-[5px] bg-[#F5F5F5] px-2 py-1 text-[11px] font-semibold text-[#000000] focus:outline-none focus:ring-1 focus:ring-[#0063F9]"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={ChevronRight}
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

