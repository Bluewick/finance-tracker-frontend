import {
  AlertTriangle,
  CheckCircle2,
  Layers,
  Pencil,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import CurrencyDisplay from '../common/CurrencyDisplay.jsx';
import BudgetProgressBar from './BudgetProgressBar.jsx';
import { formatPercentage } from '../../utils/formatters.util.js';

/**
 * CategoryBudgetCard Component (Task 6.2)
 * Displays individual category budget limits, actual_spent, remaining, percentage_used,
 * and color-coded status (Emerald < 75%, Amber 75-99%, Rose >= 100% or is_exceeded: true).
 */
export default function CategoryBudgetCard({ budget, onEdit, onDelete }) {
  const pct = Number(budget.percentage_used) || 0;
  const isExceeded = Boolean(budget.is_exceeded) || pct >= 100;
  const isWarning = !isExceeded && pct >= 75;
  const remaining = Number(budget.remaining) || 0;

  return (
    <div className="fluent-card fluent-card-interactive flex flex-col justify-between p-4">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[5px] ${
              isExceeded
                ? 'bg-[#F70909]/[0.08] text-[#840000]'
                : 'bg-[#EBF3FF] text-[#0063F9]'
            }`}
          >
            <Layers className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-semibold leading-5 text-[#000000]">
              {budget.category}
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <Badge
                variant={
                  isExceeded ? 'danger' : isWarning ? 'warning' : 'success'
                }
                size="sm"
                icon={isExceeded || isWarning ? AlertTriangle : CheckCircle2}
              >
                {formatPercentage(pct, 1)} Used
              </Badge>
            </div>
          </div>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit?.(budget)}
            title="Update Budget Limit"
            aria-label={`Edit ${budget.category} budget`}
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-black/[0.04] text-[#474747] hover:bg-[#F1F7FF] hover:text-[#0063F9]"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(budget)}
            title="Delete Budget"
            aria-label={`Delete ${budget.category} budget`}
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-black/[0.04] text-[#474747] hover:bg-[#F70909]/[0.10] hover:text-[#840000]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Spent vs Limit Figures */}
      <div className="my-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[#626262] uppercase">
              Spent
            </span>
            <p className="text-[22px] font-semibold leading-7 text-[#000000]">
              <CurrencyDisplay amount={budget.actual_spent} />
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold text-[#626262] uppercase">
              Limit
            </span>
            <p className="text-[15px] font-semibold leading-6 text-[#626262]">
              <CurrencyDisplay amount={budget.amount_limit} />
            </p>
          </div>
        </div>

        <div className="mt-2.5">
          <BudgetProgressBar percentageUsed={pct} isExceeded={isExceeded} />
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between border-t border-black/10 pt-2.5 text-[12px] font-semibold">
        <span className="text-[#626262]">
          {isExceeded || remaining < 0 ? 'Exceeded by' : 'Remaining'}
        </span>
        <span
          className={
            isExceeded || remaining < 0 ? 'text-[#840000]' : 'text-[#029A6D]'
          }
        >
          <CurrencyDisplay amount={Math.abs(remaining)} />
        </span>
      </div>
    </div>
  );
}

