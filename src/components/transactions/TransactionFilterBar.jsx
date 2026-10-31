import { Calendar, Filter, RotateCcw, Search } from 'lucide-react';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import {
  ALL_CATEGORIES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../utils/constants.util.js';

const TYPE_PILLS = [
  { value: 'ALL', label: 'All Types' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
];

/**
 * TransactionFilterBar Component (Task 5.2 — Use Case 5)
 * Filters transactions by Type (All, Income, Expense), Category, Date Range (startDate, endDate), and Search query
 */
export default function TransactionFilterBar({
  filters,
  onFilterChange,
  onReset,
}) {
  const categoryList =
    filters.type === 'income'
      ? INCOME_CATEGORIES
      : filters.type === 'expense'
        ? EXPENSE_CATEGORIES
        : ALL_CATEGORIES;

  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    ...categoryList.map((cat) => ({ value: cat, label: cat })),
  ];

  const hasActiveFilters =
    filters.type !== 'ALL' ||
    filters.category !== 'ALL' ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    Boolean(filters.search);

  return (
    <div className="fluent-card mb-4 flex flex-col gap-3.5 p-4">
      {/* Top Row: Type Segment Pills + Search Input */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        {/* Type Segmented Pills (DESIGN.md Section 5) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[12px] font-semibold text-[#626262]">
            Type:
          </span>
          {TYPE_PILLS.map((pill) => {
            const isActive = filters.type === pill.value;
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => onFilterChange('type', pill.value)}
                className={`fluent-pressable rounded-[5px] px-[15px] py-[6px] text-[11px] font-semibold leading-[14px] transition-all ${
                  isActive
                    ? 'bg-[#F1F7FF] text-[#0063F9]'
                    : 'border-[0.5px] border-black/15 bg-[#FFFFFF] text-[#626262] hover:text-[#000000]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search Notes / Category Input */}
        <div className="w-full md:max-w-xs">
          <Input
            type="text"
            icon={Search}
            placeholder="Filter by notes or category..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Row: Category Dropdown + Start Date + End Date + Reset */}
      <div className="grid grid-cols-1 items-end gap-3 border-t border-black/10 pt-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Category"
          icon={Filter}
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          options={categoryOptions}
        />

        <Input
          label="From Date"
          type="date"
          icon={Calendar}
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />

        <Input
          label="To Date"
          type="date"
          icon={Calendar}
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />

        <div className="flex items-center justify-end gap-2">
          {hasActiveFilters && (
            <Button
              variant="subtle"
              size="md"
              fullWidth
              icon={RotateCcw}
              onClick={onReset}
            >
              Reset All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

