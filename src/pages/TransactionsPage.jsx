import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Plus, RefreshCw, X } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer.jsx';
import TransactionFilterBar from '../components/transactions/TransactionFilterBar.jsx';
import TransactionTable from '../components/transactions/TransactionTable.jsx';
import TransactionFormModal from '../components/transactions/TransactionFormModal.jsx';
import ExportButton from '../components/transactions/ExportButton.jsx';
import ConfirmDeleteModal from '../components/feedback/ConfirmDeleteModal.jsx';
import AlertBanner from '../components/feedback/AlertBanner.jsx';
import Button from '../components/common/Button.jsx';
import CurrencyDisplay from '../components/common/CurrencyDisplay.jsx';
import useToast from '../hooks/useToast.js';
import useDebounce from '../hooks/useDebounce.js';
import {
  deleteTransaction,
  getTransactions,
} from '../services/transaction.service.js';
import { formatDate } from '../utils/formatters.util.js';

/**
 * TransactionsPage Component (Phase 5 — Use Cases 2, 4, 5, 6 & 8)
 * Full CRUD, Modal-based Category/Date/Type Filtering, Pagination, and CSV Export
 */
export default function TransactionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  // Initialize search from URL query parameter if navigated from Global Ctrl+K Search
  const initialSearch = searchParams.get('search') || '';
  const initialAction = searchParams.get('action');

  const [filters, setFilters] = useState({
    type: 'ALL',
    category: 'ALL',
    startDate: '',
    endDate: '',
    search: initialSearch,
  });

  const debouncedSearch = useDebounce(filters.search, 250);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshTick, setRefreshTick] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States (Filter, Create/Edit & Confirm Delete)
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(initialAction === 'new');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // Sync URL query params (?action=new or ?search=...) when navigated from Navbar/Sidebar
  useEffect(() => {
    const actionParam = searchParams.get('action');
    const urlSearch = searchParams.get('search');

    if (actionParam === 'new') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('action');
      setSearchParams(nextParams, { replace: true });
      queueMicrotask(() => {
        setEditingTransaction(null);
        setFormModalOpen(true);
      });
    }

    if (urlSearch !== null && urlSearch !== filters.search) {
      queueMicrotask(() => {
        setLoading(true);
        setPage(1);
        setFilters((prev) => ({ ...prev, search: urlSearch }));
      });
    }
  }, [searchParams, setSearchParams, filters.search]);

  /**
   * Fetch Paginated Transactions from GET /api/transactions
   */
  useEffect(() => {
    let active = true;

    getTransactions({
      page,
      limit,
      type: filters.type !== 'ALL' ? filters.type : undefined,
      category: filters.category !== 'ALL' ? filters.category : undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    })
      .then((res) => {
        if (!active) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        setTransactions(list);
        if (res?.meta) {
          setMeta(res.meta);
        } else {
          setMeta({
            page,
            limit,
            total: list.length,
            total_pages: 1,
          });
        }
        setError('');
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load transactions.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    page,
    limit,
    filters.type,
    filters.category,
    filters.startDate,
    filters.endDate,
    refreshTick,
  ]);

  // Listen for global transaction creation from Sidebar / Navbar modal
  useEffect(() => {
    const handleMutated = () => {
      setLoading(true);
      setRefreshTick((prev) => prev + 1);
    };
    window.addEventListener('transaction:mutated', handleMutated);
    return () => window.removeEventListener('transaction:mutated', handleMutated);
  }, []);

  /**
   * Client-side instant search filter across notes & category on current dataset
   */
  const filteredTransactions = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (txn) =>
        txn.category?.toLowerCase().includes(q) ||
        txn.notes?.toLowerCase().includes(q) ||
        txn.type?.toLowerCase().includes(q)
    );
  }, [transactions, debouncedSearch]);

  /**
   * Quick Page Totals for Visible Transactions
   */
  const visibleStats = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const item of filteredTransactions) {
      const amt = Number(item.amount) || 0;
      if (item.type === 'income') income += amt;
      else expense += amt;
    }
    return { income, expense, net: income - expense };
  }, [filteredTransactions]);

  const handleFilterChange = (field, value) => {
    if (field !== 'search') {
      setLoading(true);
      setPage(1);
    }
    setFilters((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'type') {
        next.category = 'ALL';
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setLoading(true);
    setPage(1);
    setFilters({
      type: 'ALL',
      category: 'ALL',
      startDate: '',
      endDate: '',
      search: '',
    });
    if (searchParams.has('search')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('search');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setPage(nextPage);
  };

  const handleLimitChange = (nextLimit) => {
    setLoading(true);
    setPage(1);
    setLimit(nextLimit);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTick((prev) => prev + 1);
  };

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (txn) => {
    setEditingTransaction(txn);
    setFormModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setDeletingLoading(true);
    const txnId = deletingTransaction._id || deletingTransaction.id;

    try {
      await deleteTransaction(txnId);
      toast.success(
        `${deletingTransaction.category} transaction deleted.`,
        'Transaction Removed'
      );
      setDeletingTransaction(null);
      handleRefresh();
    } catch (err) {
      toast.error(
        err.message || 'Could not delete transaction.',
        'Delete Failed'
      );
    } finally {
      setDeletingLoading(false);
    }
  };

  const activeFilterCount =
    (filters.type !== 'ALL' ? 1 : 0) +
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <PageContainer
      title="Transactions"
      subtitle="Record, filter, update, and export your chronological income and expense ledger."
      actions={
        <>
          {/* 1. Small Icon-Only Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh Transactions"
            aria-label="Refresh Transactions"
            className="fluent-pressable flex h-8 w-8 items-center justify-center rounded-[5px] bg-[#FFFFFF] text-[#474747] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.09)] transition-all hover:bg-[#F1F7FF] hover:text-[#0063F9] disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#0063F9]' : ''}`}
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

          {/* 3. Small Export CSV Button */}
          <ExportButton
            filters={filters}
            disabled={loading || meta.total === 0}
          />

          {/* 4. Small "+ Add" Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
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
          title="Transactions Sync Error"
          message={error}
          onClose={() => setError('')}
          className="mb-4"
        />
      )}

      {/* Compact Active Filter Pills Strip (shown only when filters are active) */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-[10px] bg-[#FFFFFF] px-3.5 py-2 shadow-[0px_2px_5px_0px_rgba(0,0,0,0.06)]">
          <span className="text-[11px] font-semibold text-[#626262]">
            Active Filters:
          </span>

          {filters.type !== 'ALL' && (
            <span className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F1F7FF] px-2.5 py-0.5 text-[11px] font-semibold capitalize text-[#0063F9]">
              <span>Type: {filters.type}</span>
              <button
                type="button"
                onClick={() => handleFilterChange('type', 'ALL')}
                className="rounded-full p-0.5 hover:bg-[#0063F9]/15"
                aria-label="Remove type filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

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

          {filters.search.trim() && (
            <span className="inline-flex items-center gap-1.5 rounded-[21px] bg-[#F1F7FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#0063F9]">
              <span>Search: &quot;{filters.search.trim()}&quot;</span>
              <button
                type="button"
                onClick={() => handleFilterChange('search', '')}
                className="rounded-full p-0.5 hover:bg-[#0063F9]/15"
                aria-label="Remove search filter"
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

      {/* Quick Page Summary Strip */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="fluent-card flex items-center justify-between px-4 py-3">
          <span className="text-[12px] font-semibold text-[#626262]">
            Page Income
          </span>
          <CurrencyDisplay
            amount={visibleStats.income}
            type="income"
            showSign
            className="text-[16px] font-semibold"
          />
        </div>

        <div className="fluent-card flex items-center justify-between px-4 py-3">
          <span className="text-[12px] font-semibold text-[#626262]">
            Page Expenses
          </span>
          <CurrencyDisplay
            amount={visibleStats.expense}
            type="expense"
            showSign
            className="text-[16px] font-semibold"
          />
        </div>

        <div className="fluent-card flex items-center justify-between px-4 py-3">
          <span className="text-[12px] font-semibold text-[#626262]">
            Page Net Cashflow
          </span>
          <CurrencyDisplay
            amount={visibleStats.net}
            showSign
            className={`text-[16px] font-semibold ${
              visibleStats.net >= 0 ? 'text-[#029A6D]' : 'text-[#840000]'
            }`}
          />
        </div>
      </div>

      {/* Transaction History Table + Pagination */}
      <TransactionTable
        transactions={filteredTransactions}
        meta={meta}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={(txn) => setDeletingTransaction(txn)}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onAddFirst={handleOpenCreate}
      />

      {/* Filter Modal */}
      <TransactionFilterBar
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Create / Edit Transaction Modal */}
      <TransactionFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingTransaction(null);
        }}
        editingTransaction={editingTransaction}
        onSuccess={handleRefresh}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingTransaction)}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Transaction"
        itemName={
          deletingTransaction
            ? `the "${deletingTransaction.category}" (${deletingTransaction.type}) entry`
            : 'this transaction'
        }
        loading={deletingLoading}
      />
    </PageContainer>
  );
}
