import { DEFAULT_CURRENCY, MONTHS, SUPPORTED_CURRENCIES } from './constants.util.js';

/**
 * Formats a numeric amount according to the user's selected currency (e.g., INR, USD, EUR, GBP).
 * Respects Intl.NumberFormat locales for accurate grouping (e.g. Indian lakh/crore grouping for INR).
 *
 * @param {number|string} amount - The numeric value to format
 * @param {string} [currencyCode='INR'] - ISO 4217 currency code
 * @param {object} [options={}] - Optional overrides for Intl.NumberFormat
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencyCode = DEFAULT_CURRENCY, options = {}) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return formatCurrency(0, currencyCode, options);
  }

  const normalizedCurrency = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const currencyMeta =
    SUPPORTED_CURRENCIES.find((c) => c.code === normalizedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  const hasFraction = Math.abs(numericAmount % 1) > 0;

  try {
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: 'currency',
      currency: currencyMeta.code,
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
      ...options,
    }).format(numericAmount);
  } catch {
    return `${currencyMeta.symbol}${numericAmount.toLocaleString()}`;
  }
}

/**
 * Formats large numbers compactly for chart axes or compact badges (e.g., ₹85K, $1.2M)
 *
 * @param {number|string} amount
 * @param {string} [currencyCode='INR']
 * @returns {string}
 */
export function formatCompactCurrency(amount, currencyCode = DEFAULT_CURRENCY) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return '0';

  const normalizedCurrency = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const currencyMeta =
    SUPPORTED_CURRENCIES.find((c) => c.code === normalizedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  try {
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: 'currency',
      currency: currencyMeta.code,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(numericAmount);
  } catch {
    return `${currencyMeta.symbol}${numericAmount}`;
  }
}

/**
 * Returns the currency symbol for a given currency code.
 *
 * @param {string} [currencyCode='INR']
 * @returns {string}
 */
export function getCurrencySymbol(currencyCode = DEFAULT_CURRENCY) {
  const normalized = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const found = SUPPORTED_CURRENCIES.find((c) => c.code === normalized);
  return found ? found.symbol : '₹';
}

/**
 * Formats an ISO date string or Date object into a readable format (e.g., "15 Oct 2026").
 *
 * @param {string|Date} dateInput
 * @param {object} [options]
 * @returns {string}
 */
export function formatDate(dateInput, options = {}) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return String(dateInput);

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
}

/**
 * Formats an ISO date string or Date object into `YYYY-MM-DD` suitable for `<input type="date" />`
 * and API query parameters.
 *
 * @param {string|Date} [dateInput=new Date()]
 * @returns {string}
 */
export function formatDateForInput(dateInput = new Date()) {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

/**
 * Formats a percentage value with clean rounding (e.g., 94.35 -> "94.4%" or "94.35%").
 *
 * @param {number|string} value
 * @param {number} [decimals=1]
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1) {
  const num = Number(value);
  if (Number.isNaN(num)) return '0%';
  const rounded = Number(num.toFixed(decimals));
  return `${rounded}%`;
}

/**
 * Converts month number (1-12) and optional year into a human label (e.g., "October 2026").
 *
 * @param {number} monthNumber - 1 to 12
 * @param {number} [year]
 * @param {boolean} [short=false]
 * @returns {string}
 */
export function formatMonthYear(monthNumber, year, short = false) {
  const monthObj = MONTHS.find((m) => m.value === Number(monthNumber));
  const monthLabel = monthObj ? (short ? monthObj.short : monthObj.label) : '';
  return year ? `${monthLabel} ${year}`.trim() : monthLabel;
}

