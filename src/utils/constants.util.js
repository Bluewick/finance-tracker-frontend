/**
 * Predefined Financial Categories, Supported Currencies, Months, and Chart Palette Tokens
 * Aligned with DESIGN.md (Fluent Design System) and Backend API Specification
 */

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Business',
  'Rental Income',
  'Dividends',
  'Bonus',
  'Refunds',
  'Other',
];

export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Rent',
  'Utilities',
  'Dining',
  'Transport',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Insurance',
  'Subscriptions',
  'Travel',
  'Other',
];

export const ALL_CATEGORIES = Array.from(
  new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
);

export const BUDGET_CATEGORIES = [
  { value: 'ALL', label: 'Overall Monthly Budget (ALL)' },
  ...EXPENSE_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
];

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)', locale: 'en-GB' },
];

export const DEFAULT_CURRENCY = 'INR';

export const MONTHS = [
  { value: 1, label: 'January', short: 'Jan' },
  { value: 2, label: 'February', short: 'Feb' },
  { value: 3, label: 'March', short: 'Mar' },
  { value: 4, label: 'April', short: 'Apr' },
  { value: 5, label: 'May', short: 'May' },
  { value: 6, label: 'June', short: 'Jun' },
  { value: 7, label: 'July', short: 'Jul' },
  { value: 8, label: 'August', short: 'Aug' },
  { value: 9, label: 'September', short: 'Sep' },
  { value: 10, label: 'October', short: 'Oct' },
  { value: 11, label: 'November', short: 'Nov' },
  { value: 12, label: 'December', short: 'Dec' },
];

/**
 * Fluent Design System Categorical & Data Visualization Palette (from DESIGN.md)
 */
export const FLUENT_CHART_PALETTE = [
  '#4891FF', // Primary Data Blue
  '#0056D6', // Royal Accent Blue
  '#064099', // Deep Navy Blue
  '#8AB9FF', // Secondary Light Blue
  '#09F7A1', // Luminous Mint / Gross Profit
  '#0063F9', // Primary Cobalt
  '#3B82F6', // Sky Cobalt
  '#1D4ED8', // Deep Royal
];

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'finance_tracker_token',
  AUTH_USER: 'finance_tracker_user',
};

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const AVAILABLE_YEARS = [
  CURRENT_YEAR - 2,
  CURRENT_YEAR - 1,
  CURRENT_YEAR,
  CURRENT_YEAR + 1,
];

