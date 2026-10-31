import { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  FileText,
  PenLine,
  Save,
  Tag,
} from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import AlertBanner from '../feedback/AlertBanner.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import {
  createTransaction,
  updateTransaction,
} from '../../services/transaction.service.js';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../utils/constants.util.js';
import {
  convertCurrency,
  convertToBaseCurrency,
  formatCurrency,
  formatDateForInput,
  getCurrencySymbol,
} from '../../utils/formatters.util.js';

const TODAY_INPUT = new Date().toISOString().split('T')[0];

function isOtherOption(cat) {
  return (
    cat === 'Other' || cat === 'Other Income' || cat === 'Other Expense'
  );
}

function getInitialFormState(editingTransaction, activeCurrency = 'INR') {
  if (editingTransaction) {
    const type = editingTransaction.type || 'expense';
    const stdList =
      type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const rawCat = editingTransaction.category || stdList[0];

    // If existing transaction has a custom category not in standard list, select "Other" and prefill customCategory
    const isCustom =
      Boolean(rawCat) &&
      (!stdList.includes(rawCat) || isOtherOption(rawCat));

    const convertedDisplayAmount =
      editingTransaction.amount !== undefined
        ? Number(
            convertCurrency(
              editingTransaction.amount,
              activeCurrency,
              'INR'
            ).toFixed(2)
          )
        : '';

    return {
      type,
      category: isCustom ? 'Other' : rawCat,
      customCategory:
        isCustom && !isOtherOption(rawCat) ? rawCat : '',
      amount:
        convertedDisplayAmount !== '' ? String(convertedDisplayAmount) : '',
      date: formatDateForInput(editingTransaction.date) || TODAY_INPUT,
      notes: editingTransaction.notes || '',
    };
  }

  return {
    type: 'expense',
    category: EXPENSE_CATEGORIES[0],
    customCategory: '',
    amount: '',
    date: TODAY_INPUT,
    notes: '',
  };
}

/**
 * TransactionFormModal Component (Task 5.1 — Use Cases 2 & 6)
 * Refined executive layout with custom "Other" category input for both Income & Expense.
 */
export default function TransactionFormModal({
  isOpen,
  onClose,
  editingTransaction = null,
  onSuccess,
}) {
  if (!isOpen) return null;

  const modalKey =
    editingTransaction?._id || editingTransaction?.id || 'create-new';

  return (
    <TransactionFormDialog
      key={modalKey}
      isOpen={isOpen}
      onClose={onClose}
      editingTransaction={editingTransaction}
      onSuccess={onSuccess}
    />
  );
}

function TransactionFormDialog({
  isOpen,
  onClose,
  editingTransaction = null,
  onSuccess,
}) {
  const { currency } = useAuth();
  const toast = useToast();
  const isEditing = Boolean(editingTransaction?._id || editingTransaction?.id);
  const currencySymbol = getCurrencySymbol(currency);

  const [formData, setFormData] = useState(() =>
    getInitialFormState(editingTransaction, currency)
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const quickAmounts =
    currency === 'INR' ? [500, 1000, 5000, 10000] : [10, 50, 100, 500];

  const baseCategories =
    formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const categoryOptions = baseCategories.map((cat) => ({
    value: cat,
    label: cat === 'Other' ? 'Other (Specify Custom...)' : cat,
  }));

  const isCustomCategoryActive = isOtherOption(formData.category);

  const handleTypeSwitch = (newType) => {
    if (newType === formData.type) return;
    const defaultCat =
      newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: isOtherOption(prev.category) ? 'Other' : defaultCat,
    }));
    setFieldErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleQuickAmountAdd = (increment) => {
    const currentVal = Number(formData.amount) || 0;
    const nextVal = currentVal + increment;
    setFormData((prev) => ({ ...prev, amount: String(nextVal) }));
    if (fieldErrors.amount) {
      setFieldErrors((prev) => ({ ...prev, amount: '' }));
    }
  };

  const resolvedCategory = isCustomCategoryActive
    ? formData.customCategory.trim()
    : formData.category;

  const validate = () => {
    const errors = {};
    const numAmount = Number(formData.amount);

    if (!formData.amount || Number.isNaN(numAmount) || numAmount <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0.';
    }
    if (!formData.category) {
      errors.category = 'Please select a category.';
    }
    if (isCustomCategoryActive) {
      if (!formData.customCategory.trim()) {
        errors.customCategory = 'Please enter your custom category name.';
      } else if (formData.customCategory.trim().length < 2) {
        errors.customCategory = 'Category name must be at least 2 characters.';
      }
    }
    if (!formData.date) {
      errors.date = 'Transaction date is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    const payload = {
      type: formData.type,
      category: resolvedCategory,
      amount: convertToBaseCurrency(formData.amount, currency),
      date: formData.date,
      notes: formData.notes.trim(),
    };

    try {
      if (isEditing) {
        const txnId = editingTransaction._id || editingTransaction.id;
        await updateTransaction(txnId, payload);
        toast.success(
          `${payload.category} transaction updated successfully.`,
          'Transaction Updated'
        );
      } else {
        await createTransaction(payload);
        toast.success(
          `${payload.category} (${payload.type}) recorded.`,
          'Transaction Added'
        );
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const msg =
        err.message || 'Could not save transaction. Please try again.';
      setApiError(msg);
      toast.error(msg, 'Save Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isExpense = formData.type === 'expense';

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitting ? undefined : onClose}
      title={isEditing ? 'Edit Transaction' : 'Record New Transaction'}
      subtitle={
        isEditing
          ? 'Modify transaction amount, category, date, or notes.'
          : 'Log an income or expense entry to your personal ledger.'
      }
      maxWidth="max-w-[520px]"
      footer={
        <div className="flex w-full items-center justify-between">
          <span className="text-[11px] font-semibold text-[#767676]">
            {Number(formData.amount) > 0
              ? `${isExpense ? 'Outflow' : 'Inflow'}: ${formatCurrency(
                  formData.amount,
                  currency,
                  { skipConversion: true }
                )}`
              : 'Enter amount above'}
          </span>

          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="transaction-form"
              variant="primary"
              size="md"
              icon={Save}
              loading={submitting}
              loadingText={isEditing ? 'Updating...' : 'Saving...'}
            >
              {isEditing ? 'Save Changes' : 'Save Transaction'}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id="transaction-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {apiError && (
          <AlertBanner
            variant="error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        {/* 1. Segmented Type Switcher (Expense vs Income) */}
        <div className="grid grid-cols-2 gap-2 rounded-[10px] bg-[#F5F5F5] p-1.5">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleTypeSwitch('expense')}
            className={`fluent-pressable flex items-center justify-center gap-2 rounded-[7px] py-2.5 text-[13px] font-semibold transition-all ${
              isExpense
                ? 'bg-[#FFFFFF] text-[#840000] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)]'
                : 'text-[#626262] hover:text-[#000000]'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                isExpense
                  ? 'bg-[#F70909]/10 text-[#840000]'
                  : 'bg-black/[0.05] text-[#626262]'
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            <span>Expense (Outcome)</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleTypeSwitch('income')}
            className={`fluent-pressable flex items-center justify-center gap-2 rounded-[7px] py-2.5 text-[13px] font-semibold transition-all ${
              !isExpense
                ? 'bg-[#FFFFFF] text-[#029A6D] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.08)]'
                : 'text-[#626262] hover:text-[#000000]'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full ${
                !isExpense
                  ? 'bg-[#09F7A1]/20 text-[#029A6D]'
                  : 'bg-black/[0.05] text-[#626262]'
              }`}
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
            </span>
            <span>Income (Inflow)</span>
          </button>
        </div>

        {/* 2. Hero Financial Amount Box */}
        <div
          className={`rounded-[12px] border p-3.5 transition-all ${
            fieldErrors.amount
              ? 'border-[#F70909]/60 bg-[#F70909]/[0.02]'
              : 'border-black/[0.08] bg-[#F6F8FC] focus-within:border-[#0063F9] focus-within:bg-[#FFFFFF] focus-within:ring-2 focus-within:ring-[#0063F9]/15'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="txn-amount-input"
              className="text-[11px] font-semibold tracking-wider text-[#626262] uppercase"
            >
              Transaction Amount <span className="text-[#840000]">*</span>
            </label>
            <span className="rounded-[5px] bg-[#EBF3FF] px-2 py-0.5 text-[10px] font-bold text-[#0063F9]">
              {currency}
            </span>
          </div>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[24px] font-bold text-[#626262] select-none">
              {currencySymbol}
            </span>
            <input
              id="txn-amount-input"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              disabled={submitting}
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-transparent text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[#000000] placeholder:text-[#CBD5E1] focus:outline-none"
            />
          </div>

          {/* Quick Add Amount Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-black/[0.06] pt-2.5">
            <span className="mr-1 text-[10px] font-semibold text-[#767676]">
              Quick Add:
            </span>
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                disabled={submitting}
                onClick={() => handleQuickAmountAdd(amt)}
                className="fluent-pressable rounded-[5px] border border-black/[0.08] bg-[#FFFFFF] px-2 py-0.5 text-[11px] font-semibold text-[#474747] hover:border-[#0063F9]/40 hover:bg-[#F1F7FF] hover:text-[#0063F9]"
              >
                +{currencySymbol}
                {amt.toLocaleString()}
              </button>
            ))}
          </div>

          {fieldErrors.amount && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#840000]">
              {fieldErrors.amount}
            </p>
          )}
        </div>

        {/* 3. Category & Transaction Date Row */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <Select
            label="Category"
            name="category"
            icon={Tag}
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            error={fieldErrors.category}
            disabled={submitting}
            required
          />

          <Input
            label="Transaction Date"
            name="date"
            type="date"
            icon={Calendar}
            value={formData.date}
            onChange={handleChange}
            error={fieldErrors.date}
            disabled={submitting}
            required
          />
        </div>

        {/* 4. Conditional Custom Category Input when "Other" is selected */}
        {isCustomCategoryActive && (
          <div className="rounded-[10px] border border-[#0063F9]/25 bg-[#F1F7FF]/70 p-3">
            <Input
              label={`Custom ${isExpense ? 'Expense' : 'Income'} Category`}
              name="customCategory"
              type="text"
              surface="white"
              icon={PenLine}
              placeholder={
                isExpense
                  ? 'e.g., Pet Care, Home Repair, Gifts...'
                  : 'e.g., Consulting, Royalty, Side Project...'
              }
              value={formData.customCategory}
              onChange={handleChange}
              error={fieldErrors.customCategory}
              disabled={submitting}
              autoFocus
              required
              helperText="This custom category name will be saved directly to your transaction."
            />
          </div>
        )}

        {/* 5. Notes / Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="txn-notes-input"
              className="flex items-center gap-1.5 text-[13px] font-semibold leading-5 text-[#000000]"
            >
              <FileText className="h-3.5 w-3.5 text-[#767676]" />
              <span>Notes / Description</span>
            </label>
            <span className="text-[11px] font-medium text-[#767676]">
              {formData.notes.length}/160
            </span>
          </div>

          <textarea
            id="txn-notes-input"
            name="notes"
            rows={2}
            maxLength={160}
            disabled={submitting}
            placeholder="Add optional details, merchant name, or reference notes..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full resize-none rounded-[7px] border border-transparent bg-[#F5F5F5] px-3.5 py-2.5 text-[13px] font-semibold leading-5 text-[#000000] placeholder:font-medium placeholder:text-[#767676] transition-all focus:border-[#0063F9] focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0063F9]/20"
          />
        </div>
      </form>
    </Modal>
  );
}
