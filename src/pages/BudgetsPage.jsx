import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  PieChart,
  Plus,
  RefreshCw,
  Target,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import BudgetOverviewCard from '../components/budgets/BudgetOverviewCard.jsx';
import CategoryBudgetCard from '../components/budgets/CategoryBudgetCard.jsx';
import BudgetFormModal from '../components/budgets/BudgetFormModal.jsx';
import ConfirmDeleteModal from '../components/feedback/ConfirmDeleteModal.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import { MetricCardSkeleton } from '../components/feedback/Skeleton.jsx';
import Button from '../components/common/Button.jsx';
import Select from '../components/common/Select.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import useToast from '../hooks/useToast.js';
import { deleteBudget, getBudgets } from '../services/budget.service.js';
import {
  AVAILABLE_YEARS,
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
} from '../utils/constants.util.js';
import { formatMonthYear } from '../utils/formatters.util.js';

const MONTH_OPTIONS = MONTHS.map((m) => ({ value: m.value, label: m.label }));
const YEAR_OPTIONS = AVAILABLE_YEARS.map((y) => ({
  value: y,
  label: String(y),
}));

/**
 * BudgetsPage Component (Phase 6 — Tasks 6.1, 6.2 & 6.3)
 * Monthly overall ("ALL") and per-category budget tracking & management
 */
export default function BudgetsPage() {
  const toast = useToast();

  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [refreshTick, setRefreshTick] = useState(0);

  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [defaultModalCategory, setDefaultModalCategory] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  /**
   * Fetch Budgets for Selected Month & Year from GET /api/budgets
   */
  useEffect(() => {
    let active = true;

    getBudgets({ month: selectedMonth, year: selectedYear })
      .then((res) => {
        if (!active) return;
        setBudgetData(res?.data || null);
        setError('');
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load monthly budgets.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedMonth, selectedYear, refreshTick]);

  // Listen for global transaction creation from Sidebar / Navbar modal
  useEffect(() => {
    const handleMutated = () => {
      setLoading(true);
      setRefreshTick((prev) => prev + 1);
    };
    window.addEventListener('transaction:mutated', handleMutated);
    return () => window.removeEventListener('transaction:mutated', handleMutated);
  }, []);

  const budgetsList = useMemo(
    () => budgetData?.budgets || [],
    [budgetData]
  );

  const overallBudget = useMemo(
    () => budgetsList.find((b) => b.category === 'ALL') || null,
    [budgetsList]
  );

  const categoryBudgets = useMemo(
    () => budgetsList.filter((b) => b.category !== 'ALL'),
    [budgetsList]
  );

  const exceededCount = useMemo(
    () =>
      budgetsList.filter(
        (b) => Boolean(b.is_exceeded) || Number(b.percentage_used) >= 100
      ).length,
    [budgetsList]
  );

  const totalMonthlySpent = Number(budgetData?.total_monthly_spent) || 0;

  const handleMonthChange = (newMonth) => {
    setLoading(true);
    setSelectedMonth(Number(newMonth));
  };

  const handleYearChange = (newYear) => {
    setLoading(true);
    setSelectedYear(Number(newYear));
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTick((prev) => prev + 1);
  };

  const handleOpenCreateCategory = () => {
    setEditingBudget(null);
    setDefaultModalCategory('Groceries');
    setFormModalOpen(true);
  };

  const handleOpenCreateOverall = () => {
    if (overallBudget) {
      setEditingBudget(overallBudget);
    } else {
      setEditingBudget(null);
      setDefaultModalCategory('ALL');
    }
    setFormModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setDefaultModalCategory(budget.category);
    setFormModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBudget) return;
    setDeletingLoading(true);
    const id = deletingBudget._id || deletingBudget.id;

    try {
      await deleteBudget(id);
      toast.success(
        `${
          deletingBudget.category === 'ALL'
            ? 'Overall monthly'
            : deletingBudget.category
        } budget removed.`,
        'Budget Deleted'
      );
      setDeletingBudget(null);
      handleRefresh();
    } catch (err) {
      toast.error(
        err.message || 'Failed to delete budget.',
        'Delete Failed'
      );
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <PageContainer
      title="Monthly Budgets"
      subtitle={`Track overall and category spending limits for ${formatMonthYear(
        selectedMonth,
        selectedYear
      )}.`}
      actions={
        <>
          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            loading={loading}
            loadingText="Syncing..."
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <Button
            variant="subtle"
            size="md"
            icon={Target}
            onClick={handleOpenCreateOverall}
          >
            {overallBudget ? 'Edit Overall Cap' : 'Set Overall Cap'}
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreateCategory}
          >
            New Category Budget
          </Button>
        </>
      }
    >
      {error && (
        <AlertBanner
          variant="error"
          title="Budget Sync Error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      {/* Period Selector Bar */}
      <div className="fluent-card mb-5 flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-2">
          <Select
            label="Budget Month"
            icon={Calendar}
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            options={MONTH_OPTIONS}
          />

          <Select
            label="Budget Year"
            icon={Calendar}
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            options={YEAR_OPTIONS}
          />
        </div>

        {/* Summary Pill Counters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-[7px] bg-[#F1F6FF] px-3.5 py-2 text-[12px] font-semibold text-[#000000]">
            Total Month Spend:{' '}
            <span className="text-[#0063F9]">
              <CurrencyDisplay amount={totalMonthlySpent} />
            </span>
          </div>

          {exceededCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F70909]/[0.08] px-3 py-1.5 text-[11px] font-semibold text-[#840000]">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>
                {exceededCount} {exceededCount === 1 ? 'Budget' : 'Budgets'}{' '}
                Exceeded
              </span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <MetricCardSkeleton count={4} />
      ) : (
        <>
          {/* 1. Overall ("ALL") Monthly Budget Card */}
          <BudgetOverviewCard
            overallBudget={overallBudget}
            totalMonthlySpent={totalMonthlySpent}
            month={selectedMonth}
            year={selectedYear}
            onCreateOverall={handleOpenCreateOverall}
            onEdit={handleOpenEdit}
            onDelete={(b) => setDeletingBudget(b)}
          />

          {/* 2. Per-Category Budgets Section */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-[#000000]">
              Category Spending Limits ({categoryBudgets.length})
            </h2>
          </div>

          {categoryBudgets.length === 0 ? (
            <EmptyState
              icon={PieChart}
              title={`No category budgets set for ${formatMonthYear(
                selectedMonth,
                selectedYear
              )}`}
              description="Create spending limits for categories like Groceries, Rent, Dining, or Transport to track real-time utilization."
              actionLabel="Add Category Budget"
              actionIcon={Plus}
              onAction={handleOpenCreateCategory}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryBudgets.map((budget) => (
                <CategoryBudgetCard
                  key={budget._id || budget.id}
                  budget={budget}
                  onEdit={handleOpenEdit}
                  onDelete={(b) => setDeletingBudget(b)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Update Budget Modal */}
      <BudgetFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingBudget(null);
          setDefaultModalCategory(null);
        }}
        editingBudget={editingBudget}
        defaultCategory={defaultModalCategory}
        activeMonth={selectedMonth}
        activeYear={selectedYear}
        onSuccess={handleRefresh}
      />

      {/* Delete Budget Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Budget Limit"
        itemName={
          deletingBudget
            ? deletingBudget.category === 'ALL'
              ? 'the Overall Monthly Budget (ALL)'
              : `the "${deletingBudget.category}" category budget`
            : 'this budget'
        }
        description="Removing this budget cap will stop alerts for this category, though all your underlying transactions remain untouched."
        loading={deletingLoading}
      />
    </PageContainer>
  );
}

