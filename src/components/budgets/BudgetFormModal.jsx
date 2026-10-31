import { useState } from 'react';
import { Calendar, DollarSign, PenLine, Save, Tag } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';
import AlertBanner from '../feedback/AlertBanner.jsx';
import useAuth from '../../hooks/useAuth.js';
import useToast from '../../hooks/useToast.js';
import { createBudget, updateBudget } from '../../services/budget.service.js';
import {
  AVAILABLE_YEARS,
  BUDGET_CATEGORIES,
  CURRENT_MONTH,
  CURRENT_YEAR,
  MONTHS,
} from '../../utils/constants.util.js';
import { getCurrencySymbol } from '../../utils/formatters.util.js';

function getInitialBudgetState(editingBudget, defaultCategory, activeMonth, activeYear) {
  if (editingBudget) {
    return {
      category: editingBudget.category || 'ALL',
      customCategory: '',
      amount_limit:
        editingBudget.amount_limit !== undefined
          ? String(editingBudget.amount_limit)
          : '',
      month: Number(editingBudget.month) || activeMonth || CURRENT_MONTH,
      year: Number(editingBudget.year) || activeYear || CURRENT_YEAR,
    };
  }

  return {
    category: defaultCategory || BUDGET_CATEGORIES[1]?.value || 'Groceries',
    customCategory: '',
    amount_limit: '',
    month: activeMonth || CURRENT_MONTH,
    year: activeYear || CURRENT_YEAR,
  };
}

/**
 * BudgetFormModal Component (Task 6.3)
 * Supports POST /api/budgets (Create for "ALL", standard categories, or custom "Other")
 * and PATCH /api/budgets/:id (Update existing budget amount_limit)
 */
export default function BudgetFormModal({
  isOpen,
  onClose,
  editingBudget = null,
  defaultCategory = null,
  activeMonth = CURRENT_MONTH,
  activeYear = CURRENT_YEAR,
  onSuccess,
}) {
  if (!isOpen) return null;

  const modalKey =
    editingBudget?._id ||
    editingBudget?.id ||
    `new-${defaultCategory || 'cat'}-${activeMonth}-${activeYear}`;

  return (
    <BudgetFormDialog
      key={modalKey}
      isOpen={isOpen}
      onClose={onClose}
      editingBudget={editingBudget}
      defaultCategory={defaultCategory}
      activeMonth={activeMonth}
      activeYear={activeYear}
      onSuccess={onSuccess}
    />
  );
}

function BudgetFormDialog({
  isOpen,
  onClose,
  editingBudget,
  defaultCategory,
  activeMonth,
  activeYear,
  onSuccess,
}) {
  const { currency } = useAuth();
  const toast = useToast();
  const isEditing = Boolean(editingBudget?._id || editingBudget?.id);

  const [formData, setFormData] = useState(() =>
    getInitialBudgetState(editingBudget, defaultCategory, activeMonth, activeYear)
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isCustomCategoryActive = !isEditing && formData.category === 'Other';
  const resolvedCategory = isCustomCategoryActive
    ? formData.customCategory.trim()
    : formData.category;

  const budgetCategoryOptions = BUDGET_CATEGORIES.map((item) => ({
    value: item.value,
    label:
      item.value === 'Other' ? 'Other (Specify Custom...)' : item.label,
  }));

  const monthOptions = MONTHS.map((m) => ({
    value: m.value,
    label: m.label,
  }));

  const yearOptions = AVAILABLE_YEARS.map((y) => ({
    value: y,
    label: String(y),
  }));

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

  const validate = () => {
    const errors = {};
    const numLimit = Number(formData.amount_limit);

    if (!formData.amount_limit || Number.isNaN(numLimit) || numLimit <= 0) {
      errors.amount_limit = 'Please enter a budget limit greater than 0.';
    }
    if (!formData.category) {
      errors.category = 'Please choose a budget category.';
    }
    if (isCustomCategoryActive) {
      if (!formData.customCategory.trim()) {
        errors.customCategory = 'Please enter your custom category name.';
      } else if (formData.customCategory.trim().length < 2) {
        errors.customCategory = 'Category name must be at least 2 characters.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      if (isEditing) {
        const budgetId = editingBudget._id || editingBudget.id;
        await updateBudget(budgetId, {
          amount_limit: Number(formData.amount_limit),
        });
        toast.success(
          `${formData.category === 'ALL' ? 'Overall' : formData.category} budget limit updated.`,
          'Budget Updated'
        );
      } else {
        await createBudget({
          category: resolvedCategory,
          amount_limit: Number(formData.amount_limit),
          month: Number(formData.month),
          year: Number(formData.year),
        });
        toast.success(
          `${resolvedCategory === 'ALL' ? 'Overall monthly' : resolvedCategory} budget saved.`,
          'Budget Saved'
        );
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const msg = err.message || 'Could not save budget. Please try again.';
      setApiError(msg);
      toast.error(msg, 'Budget Save Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={submitting ? undefined : onClose}
      title={isEditing ? 'Update Budget Limit' : 'Set Monthly Budget'}
      subtitle={
        isEditing
          ? `Adjust the spending limit for ${
              formData.category === 'ALL'
                ? 'Overall Monthly Budget (ALL)'
                : formData.category
            }.`
          : 'Configure an overall monthly cap ("ALL") or a specific expense category ceiling.'
      }
      footer={
        <>
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
            form="budget-form"
            variant="primary"
            size="md"
            icon={Save}
            loading={submitting}
            loadingText={isEditing ? 'Updating...' : 'Saving...'}
          >
            {isEditing ? 'Update Limit' : 'Save Budget'}
          </Button>
        </>
      }
    >
      <form
        id="budget-form"
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

        <Select
          label="Budget Scope / Category"
          name="category"
          icon={Tag}
          value={formData.category}
          onChange={handleChange}
          options={budgetCategoryOptions}
          error={fieldErrors.category}
          disabled={submitting || isEditing}
          helperText={
            formData.category === 'ALL'
              ? 'Applies a ceiling to your total combined monthly expenses.'
              : 'Monitors spending strictly within this expense category.'
          }
          required
        />

        {isCustomCategoryActive && (
          <div className="rounded-[10px] border border-[#0063F9]/25 bg-[#F1F7FF]/70 p-3">
            <Input
              label="Custom Expense Category"
              name="customCategory"
              type="text"
              surface="white"
              icon={PenLine}
              placeholder="e.g., Pet Care, Home Renovation..."
              value={formData.customCategory}
              onChange={handleChange}
              error={fieldErrors.customCategory}
              disabled={submitting}
              autoFocus
              required
            />
          </div>
        )}

        <Input
          label={`Monthly Spending Limit (${getCurrencySymbol(currency)} ${currency})`}
          name="amount_limit"
          type="number"
          step="1"
          min="1"
          placeholder="e.g., 15000"
          icon={DollarSign}
          value={formData.amount_limit}
          onChange={handleChange}
          error={fieldErrors.amount_limit}
          disabled={submitting}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Month"
            name="month"
            icon={Calendar}
            value={formData.month}
            onChange={handleChange}
            options={monthOptions}
            disabled={submitting || isEditing}
            required
          />

          <Select
            label="Year"
            name="year"
            icon={Calendar}
            value={formData.year}
            onChange={handleChange}
            options={yearOptions}
            disabled={submitting || isEditing}
            required
          />
        </div>
      </form>
    </Modal>
  );
}
