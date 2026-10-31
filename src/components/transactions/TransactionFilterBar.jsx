import { Calendar, Check, Filter, RotateCcw, Search } from 'lucide-react';
import Modal from '../common/Modal.jsx';
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
 * TransactionFilterBar Modal Component (Task 5.2 — Use Case 5)
 * Renders transaction filter controls (Type, Search, Category, Date Range) inside a clean modal.
 */
export default function TransactionFilterBar({
  isOpen,
  onClose,
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Transactions"
      subtitle="Narrow down your transaction ledger by type, category, date range, or notes."
      maxWidth="max-w-md"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            variant="subtle"
            size="sm"
            icon={RotateCcw}
            disabled={!hasActiveFilters}
            onClick={onReset}
          >
            Reset Filters
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Check}
            onClick={onClose}
          >
            Apply Filters
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Type Segmented Pills */}
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#000000]">
            Transaction Type
          </label>
          <div className="grid grid-cols-3 gap-2 rounded-[7px] bg-[#F5F5F5] p-1">
            {TYPE_PILLS.map((pill) => {
              const isActive = filters.type === pill.value;
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => onFilterChange('type', pill.value)}
                  className={`fluent-pressable rounded-[5px] py-1.5 text-[12px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#0063F9] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)]'
                      : 'text-[#626262] hover:text-[#000000]'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Notes / Category Input */}
        <Input
          label="Search Notes or Category"
          type="text"
          icon={Search}
          placeholder="e.g., supermarket, salary..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />

        {/* Category Dropdown */}
        <Select
          label="Category"
          icon={Filter}
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          options={categoryOptions}
        />

        {/* Date Range */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>
      </div>
    </Modal>
  );
}
