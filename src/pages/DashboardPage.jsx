import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  RotateCcw,
  X,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import SummaryMetricCards from '../components/dashboard/SummaryMetricCards.jsx';
import CategoryPieChart from '../components/dashboard/CategoryPieChart.jsx';
import MonthlyTrendsBarChart from '../components/dashboard/MonthlyTrendsBarChart.jsx';
import CumulativeWealthChart from '../components/dashboard/CumulativeWealthChart.jsx';
import BudgetVsActualChart from '../components/dashboard/BudgetVsActualChart.jsx';
import WeekdaySpendingChart from '../components/dashboard/WeekdaySpendingChart.jsx';
import CategoryTicketChart from '../components/dashboard/CategoryTicketChart.jsx';
import CashflowEfficiencyGauge from '../components/dashboard/CashflowEfficiencyGauge.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import TransactionFormModal from '../components/transactions/TransactionFormModal.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Select from '../components/common/Select.jsx';
import Input from '../components/common/Input.jsx';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import { Skeleton } from '../components/feedback/Skeleton.jsx';
import {
  getCategoryBreakdown,
  getFinancialSummary,
  getMonthlyTrends,
} from '../services/analytics.service.js';
import { getTransactions } from '../services/transaction.service.js';
import { getBudgets } from '../services/budget.service.js';
import {
  ALL_CATEGORIES,
  CURRENT_MONTH,
  CURRENT_YEAR,
} from '../utils/constants.util.js';
import { formatDate, formatMonthYear, formatPercentage } from '../utils/formatters.util.js';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Categories' },
  ...ALL_CATEGORIES.map((c) => ({ value: c, label: c })),
];

/**
 * DashboardPage Component (Phase 4: Use Cases 3 & 5)
 * Refined header & compact action bar:
 * - Icon-only small Refresh button
 * - Small Filter button that opens Category & Date Range filter modal
 * - Small "+ Add" button that opens the Record Transaction modal directly
 */
export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [breakdownType, setBreakdownType] = useState('expense');
  const [refreshTick, setRefreshTick] = useState(0);

  // Modal States
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Filter State (Use Case 5: Filter by Category or Date)
  const [filters, setFilters] = useState({
    category: 'ALL',
    startDate: '',
    endDate: '',
  });

  // Data States
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetSnapshot, setBudgetSnapshot] = useState(null);

  // Loading & Error States
  const [loadingCore, setLoadingCore] = useState(true);
  const [loadingBreakdown, setLoadingBreakdown] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [error, setError] = useState('');

  /**
   * Synchronize Summary, Recent Transactions & Current Month Budgets
   */
  useEffect(() => {
    let active = true;
    const filterParams = {
      category: filters.category !== 'ALL' ? filters.category : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };

    Promise.all([
      getFinancialSummary(filterParams),
      getTransactions({ ...filterParams, page: 1, limit: 50 }),
      getBudgets({
        month: CURRENT_MONTH,
        year: selectedYear,
      }),
    ])
      .then(([summaryRes, txnsRes, budgetsRes]) => {
        if (!active) return;
        setSummary(summaryRes?.data || null);
        setRecentTransactions(
          Array.isArray(txnsRes?.data) ? txnsRes.data : []
        );
        setBudgetSnapshot(budgetsRes?.data || null);
        setError('');
        setLoadingCore(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load financial analytics.');
        setLoadingCore(false);
      });

    return () => {
      active = false;
    };
  }, [filters.category, filters.startDate, filters.endDate, selectedYear, refreshTick]);

  /**
   * Synchronize Category Breakdown (Pie/Donut Chart)
   */
  useEffect(() => {
    let active = true;
    getCategoryBreakdown({
      type: breakdownType,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    })
      .then((res) => {
        if (!active) return;
        setBreakdown(res?.data || null);
        setLoadingBreakdown(false);
      })
      .catch(() => {
        if (!active) return;
        setBreakdown(null);
        setLoadingBreakdown(false);
      });

    return () => {
      active = false;
    };
  }, [breakdownType, filters.startDate, filters.endDate, refreshTick]);

  /**
   * Synchronize Monthly Trends (Bar Chart)
   */
  useEffect(() => {
    let active = true;
    getMonthlyTrends({ year: selectedYear })
      .then((res) => {
        if (!active) return;
        setTrendsData(res?.data || null);
        setLoadingTrends(false);
      })
      .catch(() => {
        if (!active) return;
        setTrendsData(null);
        setLoadingTrends(false);
      });

    return () => {
      active = false;
    };
  }, [selectedYear, refreshTick]);

  // Listen for global transaction creation from Sidebar / Navbar modal
  useEffect(() => {
    const handleMutated = () => {
      setLoadingCore(true);
      setLoadingBreakdown(true);
      setLoadingTrends(true);
      setRefreshTick((prev) => prev + 1);
    };
    window.addEventListener('transaction:mutated', handleMutated);
    return () => window.removeEventListener('transaction:mutated', handleMutated);
  }, []);

  const handleFilterChange = (field, value) => {
    setLoadingCore(true);
    if (field === 'startDate' || field === 'endDate') {
      setLoadingBreakdown(true);
    }
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleYearChange = (yr) => {
    setLoadingTrends(true);
    setLoadingCore(true);
    setSelectedYear(yr);
  };

  const handleBreakdownTypeChange = (type) => {
    setLoadingBreakdown(true);
    setBreakdownType(type);
  };

  const handleRefreshAll = () => {
    setLoadingCore(true);
    setLoadingBreakdown(true);
    setLoadingTrends(true);
    setRefreshTick((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setLoadingCore(true);
    setLoadingBreakdown(true);
    setFilters({
      category: 'ALL',
      startDate: '',
      endDate: '',
    });
  };

  const isRefreshing = loadingCore || loadingBreakdown || loadingTrends;

  const activeFilterCount =
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const budgetsList = budgetSnapshot?.budgets || [];
  const overallBudget = budgetsList.find((b) => b.category === 'ALL');
  const categoryBudgets = budgetsList.filter((b) => b.category !== 'ALL');

  return (
    <PageContainer
      title="Analytics & Overview"
      subtitle="Real-time cashflow intelligence, category distribution, and monthly trends."
      actions={
        <>
          {/* 1. Small Icon-Only Refresh Button */}
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            title="Refresh Dashboard"
            aria-label="Refresh Dashboard"
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#FFFFFF] text-[#474747] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] transition-all hover:bg-[#F1F7FF] hover:text-[#0063F9] disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-[#0063F9]' : ''}`}
            />
          </button>

          {/* 2. Small Filter Button (opens Filter Modal) */}
          <button
            type="button"
            onClick={() => setFilterModalOpen(true)}
            className={`fluent-pressable inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[12px] font-semibold shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] transition-all ${
              hasActiveFilters
                ? 'bg-[#F1F7FF] text-[#0063F9] ring-1 ring-[#0063F9]/30'
                : 'bg-[#FFFFFF] text-[#474747] hover:bg-[#F1F7FF] hover:text-[#0063F9]'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0063F9] px-1 text-[10px] font-bold text-[#FFFFFF]">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* 3. Small "+ Add" Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setAddModalOpen(true)}
            className="h-8"
          >
            Add
          </Button>
        </>
      }
    >
      {error && (
        <AlertBanner
          variant="error"
          title="Analytics Sync Notice"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      {/* Compact Active Filter Pills Strip (only shown when filters are applied) */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-[10px] bg-[#FFFFFF] px-3.5 py-2 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.06)]">
          <span className="text-[11px] font-semibold text-[#626262]">
            Active Filters:
          </span>

          {filters.category !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F1F7FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0063F9]">
              <span>Category: {filters.category}</span>
              <button
                type="button"
                onClick={() => handleFilterChange('category', 'ALL')}
                className="rounded-full p-0.5 hover:bg-[#0063F9]/15"
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.startDate && (
            <span className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F1F7FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0063F9]">
              <span>From: {formatDate(filters.startDate)}</span>
              <button
                type="button"
                onClick={() => handleFilterChange('startDate', '')}
                className="rounded-full p-0.5 hover:bg-[#0063F9]/15"
                aria-label="Remove start date filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.endDate && (
            <span className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F1F7FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0063F9]">
              <span>To: {formatDate(filters.endDate)}</span>
              <button
                type="button"
                onClick={() => handleFilterChange('endDate', '')}
                className="rounded-full p-0.5 hover:bg-[#0063F9]/15"
                aria-label="Remove end date filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="ml-auto text-[11px] font-semibold text-[#840000] hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 1. Summary Metric Cards (4 KPI Cards with Real Live AreaChart Sparklines) */}
      <SummaryMetricCards
        summary={summary}
        trends={trendsData?.trends || []}
        transactions={recentTransactions}
        hasActiveFilters={hasActiveFilters}
        loading={loadingCore}
      />

      {/* 2. Primary Visual Analytics Row (Monthly Trends Bar Chart + Category Breakdown Donut Chart) */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MonthlyTrendsBarChart
            trendsData={trendsData}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            loading={loadingTrends}
          />
        </div>

        <div className="lg:col-span-5">
          <CategoryPieChart
            breakdown={breakdown}
            selectedType={breakdownType}
            onTypeChange={handleBreakdownTypeChange}
            loading={loadingBreakdown}
          />
        </div>
      </div>

      {/* 3. Wealth Trajectory & Budget vs. Actual Comparison Row */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <CumulativeWealthChart
            trends={trendsData?.trends || []}
            transactions={recentTransactions}
            hasActiveFilters={hasActiveFilters}
            loading={loadingTrends || loadingCore}
          />
        </div>

        <div className="lg:col-span-6">
          <BudgetVsActualChart
            budgets={budgetsList}
            loading={loadingCore}
          />
        </div>
      </div>

      {/* 4. Behavioral & Efficiency Intelligence Row (Weekday Pattern + Avg Ticket + Cashflow Gauge) */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <WeekdaySpendingChart
            transactions={recentTransactions}
            loading={loadingCore}
          />
        </div>

        <div className="lg:col-span-4">
          <CategoryTicketChart
            breakdown={breakdown}
            loading={loadingBreakdown}
          />
        </div>

        <div className="lg:col-span-4">
          <CashflowEfficiencyGauge
            summary={summary}
            loading={loadingCore}
          />
        </div>
      </div>

      {/* 5. Recent Transactions & Monthly Budget Health Snapshot */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentTransactions
            transactions={recentTransactions.slice(0, 5)}
            loading={loadingCore}
          />
        </div>

        {/* Monthly Budget Health Snapshot Card */}
        <div className="lg:col-span-5">
          <div className="fluent-card flex h-full flex-col justify-between p-[12px]">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <h3 className="text-[14px] font-semibold leading-5 tracking-[-0.01em] text-[#000000]">
                  Monthly Budget Health
                </h3>
                <p className="text-[11px] font-medium text-[#626262]">
                  {formatMonthYear(
                    budgetSnapshot?.month || CURRENT_MONTH,
                    budgetSnapshot?.year || selectedYear
                  )}
                </p>
              </div>

              <Link
                to="/budgets"
                className="fluent-pressable inline-flex items-center gap-1 rounded-[5px] bg-[#F1F7FF] px-2.5 py-1 text-[10px] font-semibold leading-[14px] text-[#0063F9] hover:bg-[#EBF3FF]"
              >
                <span>Manage Budgets</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {loadingCore ? (
              <div className="space-y-3 p-2">
                <Skeleton className="h-20 w-full" rounded="rounded-[10px]" />
                <Skeleton className="h-14 w-full" rounded="rounded-[7px]" />
                <Skeleton className="h-14 w-full" rounded="rounded-[7px]" />
              </div>
            ) : budgetsList.length === 0 ? (
              <div className="my-2 flex flex-1 flex-col items-center justify-center rounded-[10px] bg-[#F1F6FF] p-6 text-center">
                <p className="text-[13px] font-semibold text-[#000000]">
                  No budgets configured for this month
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#626262]">
                  Set an overall monthly cap or category limits to monitor spending.
                </p>
                <Link
                  to="/budgets"
                  className="fluent-pressable mt-3 inline-flex items-center gap-1.5 rounded-[5px] bg-[#0063F9] px-3 py-1.5 text-[11px] font-semibold text-[#FFFFFF] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] hover:bg-[#0056D6]"
                >
                  <span>+ Set Monthly Budget</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-between gap-3">
                {/* Overall ("ALL") Budget Highlight */}
                {overallBudget && (
                  <div className="rounded-[10px] bg-[#F1F6FF] p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-[#000000]">
                        Overall Monthly Cap (ALL)
                      </span>
                      <Badge
                        variant={
                          overallBudget.is_exceeded
                            ? 'danger'
                            : overallBudget.percentage_used >= 75
                              ? 'warning'
                              : 'success'
                        }
                        size="sm"
                        icon={
                          overallBudget.is_exceeded
                            ? AlertTriangle
                            : CheckCircle2
                        }
                      >
                        {formatPercentage(overallBudget.percentage_used, 1)} Used
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-[20px] font-semibold text-[#000000]">
                        <CurrencyDisplay amount={overallBudget.actual_spent} />
                      </span>
                      <span className="text-[12px] font-semibold text-[#626262]">
                        of <CurrencyDisplay amount={overallBudget.amount_limit} />
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#FFFFFF]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          overallBudget.is_exceeded
                            ? 'bg-[#F70909]'
                            : overallBudget.percentage_used >= 75
                              ? 'bg-amber-500'
                              : 'bg-[#0063F9]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(overallBudget.percentage_used) || 0)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Category Budget Rows */}
                <div className="space-y-2.5">
                  {categoryBudgets.slice(0, 3).map((b) => {
                    const pct = Math.min(
                      100,
                      Math.max(0, Number(b.percentage_used) || 0)
                    );
                    return (
                      <div
                        key={b._id}
                        className="rounded-[7px] bg-[#F6F8FC] p-2.5"
                      >
                        <div className="flex items-center justify-between text-[12px] font-semibold">
                          <span className="text-[#000000]">{b.category}</span>
                          <span className="text-[#626262]">
                            <CurrencyDisplay amount={b.actual_spent} /> /{' '}
                            <CurrencyDisplay amount={b.amount_limit} />
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div
                            className={`h-full rounded-full ${
                              b.is_exceeded
                                ? 'bg-[#F70909]'
                                : b.percentage_used >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-[#4891FF]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal (Category, Start Date, End Date) */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Analytics & Overview"
        subtitle="Narrow down summary metrics, category breakdown, and recent transactions."
        maxWidth="max-w-md"
        footer={
          <div className="flex w-full items-center justify-between">
            <Button
              variant="subtle"
              size="sm"
              icon={RotateCcw}
              disabled={!hasActiveFilters}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => setFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Filter Category"
            icon={Filter}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={CATEGORY_FILTER_OPTIONS}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Start Date"
              type="date"
              icon={Calendar}
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />

            <Input
              label="End Date"
              type="date"
              icon={Calendar}
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Record Transaction Modal triggered by "+ Add" button */}
      <TransactionFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleRefreshAll}
      />
    </PageContainer>
  );
}
