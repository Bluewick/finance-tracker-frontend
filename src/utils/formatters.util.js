import {
  DEFAULT_CURRENCY,
  FALLBACK_EXCHANGE_RATES,
  MONTHS,
  STORAGE_KEYS,
  SUPPORTED_CURRENCIES,
} from './constants.util.js';

/**
 * Load cached live FX rates from localStorage or fall back to FALLBACK_EXCHANGE_RATES
 */
function loadInitialExchangeRates() {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.FX_RATES);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.rates && typeof parsed.rates === 'object') {
        return {
          ...FALLBACK_EXCHANGE_RATES,
          ...parsed.rates,
          INR: 1,
        };
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return { ...FALLBACK_EXCHANGE_RATES };
}

let activeExchangeRates = loadInitialExchangeRates();

/**
 * Returns the current active exchange rate table (relative to 1 INR)
 */
export function getExchangeRates() {
  return { ...activeExchangeRates };
}

/**
 * Fetches latest live exchange rates relative to INR from open.er-api.com
 * Caches results in localStorage and updates activeExchangeRates in-memory
 */
export async function fetchLiveExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/INR');
    if (!response.ok) {
      return activeExchangeRates;
    }
    const data = await response.json();
    if (data?.rates) {
      const nextRates = {
        INR: 1,
        USD: Number(data.rates.USD) || FALLBACK_EXCHANGE_RATES.USD,
        EUR: Number(data.rates.EUR) || FALLBACK_EXCHANGE_RATES.EUR,
        GBP: Number(data.rates.GBP) || FALLBACK_EXCHANGE_RATES.GBP,
      };
      activeExchangeRates = nextRates;
      try {
        localStorage.setItem(
          STORAGE_KEYS.FX_RATES,
          JSON.stringify({
            rates: nextRates,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {
        // Ignore quota errors
      }
      return nextRates;
    }
  } catch {
    // Offline or network restricted — gracefully keep cached/fallback rates
  }
  return activeExchangeRates;
}

/**
 * Converts a numeric amount from `fromCurrency` (defaults to base 'INR') into `toCurrency`
 * using the latest live exchange rates.
 *
 * @param {number|string} amount - Amount in source currency
 * @param {string} [toCurrency='INR'] - Target currency code
 * @param {string} [fromCurrency='INR'] - Source currency code
 * @returns {number} Converted numeric value
 */
export function convertCurrency(
  amount,
  toCurrency = DEFAULT_CURRENCY,
  fromCurrency = DEFAULT_CURRENCY
) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount) || numericAmount === 0) return 0;

  const fromCode = (fromCurrency || DEFAULT_CURRENCY).toUpperCase();
  const toCode = (toCurrency || DEFAULT_CURRENCY).toUpperCase();
  if (fromCode === toCode) return numericAmount;

  const fromRate = activeExchangeRates[fromCode] || 1;
  const toRate = activeExchangeRates[toCode] || 1;

  // First normalize to base INR, then multiply by target rate
  const amountInBaseInr = fromCode === 'INR' ? numericAmount : numericAmount / fromRate;
  return toCode === 'INR' ? amountInBaseInr : amountInBaseInr * toRate;
}

/**
 * Converts an amount entered by the user in their active display currency back into base INR
 * for consistent storage in the backend ledger.
 *
 * @param {number|string} displayAmount
 * @param {string} [displayCurrency='INR']
 * @returns {number} Amount in base INR rounded to 2 decimal places
 */
export function convertToBaseCurrency(
  displayAmount,
  displayCurrency = DEFAULT_CURRENCY
) {
  const converted = convertCurrency(
    displayAmount,
    DEFAULT_CURRENCY,
    displayCurrency
  );
  return Number(converted.toFixed(2));
}

/**
 * Returns a human-readable exchange rate summary for a given currency code
 * e.g. for USD: "1 USD ≈ ₹84.03"
 *
 * @param {string} currencyCode
 * @returns {string}
 */
export function getExchangeRateLabel(currencyCode = DEFAULT_CURRENCY) {
  const code = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  if (code === 'INR') return 'Base Ledger Currency (1:1)';
  const rate = activeExchangeRates[code];
  if (!rate) return '';
  const inrPerUnit = 1 / rate;
  return `1 ${code} ≈ ₹${inrPerUnit.toFixed(2)}`;
}

/**
 * Formats a numeric amount (stored in base INR) into the user's selected currency (INR, USD, EUR, GBP),
 * automatically applying live currency conversion unless `options.skipConversion` is true.
 *
 * @param {number|string} amount - The numeric value to format
 * @param {string} [currencyCode='INR'] - ISO 4217 currency code
 * @param {object} [options={}] - Optional overrides for Intl.NumberFormat & `{ skipConversion: boolean }`
 * @returns {string} Formatted currency string
 */
export function formatCurrency(
  amount,
  currencyCode = DEFAULT_CURRENCY,
  options = {}
) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return formatCurrency(0, currencyCode, options);
  }

  const normalizedCurrency = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const currencyMeta =
    SUPPORTED_CURRENCIES.find((c) => c.code === normalizedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  const { skipConversion = false, ...intlOptions } = options;

  const convertedAmount = skipConversion
    ? numericAmount
    : convertCurrency(numericAmount, currencyMeta.code, DEFAULT_CURRENCY);

  const hasFraction =
    currencyMeta.code !== 'INR'
      ? Math.abs(convertedAmount) > 0 && Math.abs(convertedAmount) < 1000
      : Math.abs(convertedAmount % 1) > 0.005;

  try {
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: 'currency',
      currency: currencyMeta.code,
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
      ...intlOptions,
    }).format(convertedAmount);
  } catch {
    return `${currencyMeta.symbol}${convertedAmount.toLocaleString()}`;
  }
}

/**
 * Formats large numbers compactly for chart axes or compact badges (e.g., ₹85K, $1.0K),
 * automatically converting from base INR into `currencyCode`.
 *
 * @param {number|string} amount
 * @param {string} [currencyCode='INR']
 * @param {object} [options={}]
 * @returns {string}
 */
export function formatCompactCurrency(
  amount,
  currencyCode = DEFAULT_CURRENCY,
  options = {}
) {
  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return '0';

  const normalizedCurrency = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const currencyMeta =
    SUPPORTED_CURRENCIES.find((c) => c.code === normalizedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  const convertedAmount = options.skipConversion
    ? numericAmount
    : convertCurrency(numericAmount, currencyMeta.code, DEFAULT_CURRENCY);

  try {
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: 'currency',
      currency: currencyMeta.code,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(convertedAmount);
  } catch {
    return `${currencyMeta.symbol}${Math.round(convertedAmount)}`;
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
