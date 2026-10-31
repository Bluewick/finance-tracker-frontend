import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
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

/**
 * TransactionsPage Component (Phase 5 — Use Cases 2, 4, 5, 6 & 8)
 * Full CRUD, Category/Date/Type Filtering, Pagination, and CSV Export
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

  // Modal States (Create / Edit & Confirm Delete)
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

  return (
    <PageContainer
      title="Transactions"
      subtitle="Record, filter, update, and export your chronological income and expense ledger."
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

          <ExportButton
            filters={filters}
            disabled={loading || meta.total === 0}
          />

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Add Transaction
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

      {/* Filter Bar */}
      <TransactionFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

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

