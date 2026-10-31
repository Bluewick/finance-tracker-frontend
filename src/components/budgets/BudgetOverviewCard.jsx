import {
  AlertTriangle,
  CheckCircle2,
  Pencil,
  Plus,
  ShieldAlert,
  Target,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import CurrencyDisplay from '../common/CurrencyDisplay.jsx';
import BudgetProgressBar from './BudgetProgressBar.jsx';
import { formatMonthYear, formatPercentage } from '../../utils/formatters.util.js';

/**
 * BudgetOverviewCard Component
 * Highlights the Overall Monthly Budget (category: "ALL") and total monthly spend
 */
export default function BudgetOverviewCard({
  overallBudget,
  totalMonthlySpent = 0,
  month,
  year,
  onCreateOverall,
  onEdit,
  onDelete,
}) {
  const periodLabel = formatMonthYear(month, year);

  if (!overallBudget) {
    return (
      <div className="fluent-card mb-6 flex flex-col justify-between gap-4 border border-dashed border-[#4891FF]/40 bg-[#FFFFFF] p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[5px] bg-[#EBF3FF] text-[#0063F9]">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#000000]">
                Overall Monthly Cap ({periodLabel})
              </h2>
              <Badge variant="primary" size="sm">
                Not Configured
              </Badge>
            </div>
            <p className="mt-1 text-[13px] font-medium text-[#626262]">
              Total spent across all categories in {periodLabel} is{' '}
              <strong className="text-[#000000]">
                <CurrencyDisplay amount={totalMonthlySpent} />
              </strong>
              . Set an overall (&quot;ALL&quot;) monthly cap to track your total spending ceiling.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onCreateOverall}
          className="shrink-0"
        >
          Set Overall Cap
        </Button>
      </div>
    );
  }

  const pct = Number(overallBudget.percentage_used) || 0;
  const isExceeded = Boolean(overallBudget.is_exceeded) || pct >= 100;
  const isWarning = !isExceeded && pct >= 75;
  const remaining = Number(overallBudget.remaining) || 0;

  return (
    <div className="fluent-card mb-6 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[5px] ${
              isExceeded
                ? 'bg-[#F70909]/[0.08] text-[#840000]'
                : 'bg-[#EBF3FF] text-[#0063F9]'
            }`}
          >
            {isExceeded ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <Target className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold text-[#000000]">
                Overall Monthly Budget (ALL) — {periodLabel}
              </h2>
              <Badge
                variant={
                  isExceeded ? 'danger' : isWarning ? 'warning' : 'success'
                }
                size="sm"
                icon={isExceeded || isWarning ? AlertTriangle : CheckCircle2}
              >
                {isExceeded
                  ? 'Budget Exceeded'
                  : isWarning
                    ? 'Approaching Limit'
                    : 'On Track'}
              </Badge>
            </div>
            <p className="mt-1 text-[12px] font-medium text-[#626262]">
              Tracks your combined expenses across all categories for {periodLabel}.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 self-end sm:self-start">
          <Button
            variant="secondary"
            size="sm"
            icon={Pencil}
            onClick={() => onEdit?.(overallBudget)}
          >
            Edit Cap
          </Button>
          <button
            type="button"
            onClick={() => onDelete?.(overallBudget)}
            title="Delete Overall Budget"
            aria-label="Delete overall monthly budget"
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-black/[0.04] text-[#474747] hover:bg-[#F70909]/[0.10] hover:text-[#840000]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row inside Recessed Track (#F1F6FF, 10px radius) */}
      <div className="mt-4 rounded-[10px] bg-[#F1F6FF] p-4">
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <span className="text-[11px] font-semibold text-[#626262] uppercase">
              Actual Spent
            </span>
            <p className="mt-0.5 text-[24px] font-semibold text-[#000000]">
              <CurrencyDisplay amount={overallBudget.actual_spent} />
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#626262] uppercase">
              Monthly Limit
            </span>
            <p className="mt-0.5 text-[24px] font-semibold text-[#000000]">
              <CurrencyDisplay amount={overallBudget.amount_limit} />
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#626262] uppercase">
              {remaining < 0 ? 'Over Budget By' : 'Remaining Buffer'}
            </span>
            <p
              className={`mt-0.5 text-[24px] font-semibold ${
                remaining < 0 || isExceeded
                  ? 'text-[#840000]'
                  : 'text-[#029A6D]'
              }`}
            >
              <CurrencyDisplay amount={Math.abs(remaining)} />
            </p>
          </div>
        </div>

        <BudgetProgressBar
          percentageUsed={pct}
          isExceeded={isExceeded}
          height="h-3"
          trackBg="bg-[#FFFFFF]"
        />

        <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#626262]">
          <span>Utilization: {formatPercentage(pct, 1)}</span>
          <span>
            {isExceeded
              ? 'Spending has exceeded your monthly cap'
              : `${formatPercentage(Math.max(0, 100 - pct), 1)} of cap available`}
          </span>
        </div>
      </div>
    </div>
  );
}

