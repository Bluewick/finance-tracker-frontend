import useAuth from '../../hooks/useAuth.js';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters.util.js';

/**
 * Automatically formats any numeric value using the authenticated user's preferred currency
 * Supports optional +/- prefixing and semantic coloring for income/expense rows
 */
export default function CurrencyDisplay({
  amount = 0,
  currencyOverride,
  compact = false,
  type,
  showSign = false,
  className = '',
}) {
  const { currency: userCurrency } = useAuth();
  const activeCurrency = currencyOverride || userCurrency || 'INR';

  const numeric = Number(amount) || 0;
  const absFormatted = compact
    ? formatCompactCurrency(Math.abs(numeric), activeCurrency)
    : formatCurrency(Math.abs(numeric), activeCurrency);

  let prefix = '';
  if (showSign) {
    if (type === 'income' || (type === undefined && numeric > 0)) {
      prefix = '+';
    } else if (type === 'expense' || (type === undefined && numeric < 0)) {
      prefix = '-';
    }
  } else if (numeric < 0) {
    prefix = '-';
  }

  let colorClass = '';
  if (type === 'income') {
    colorClass = 'text-[#029A6D]';
  } else if (type === 'expense') {
    colorClass = 'text-[#840000]';
  }

  return (
    <span className={`${colorClass} ${className}`.trim()}>
      {prefix}
      {absFormatted}
    </span>
  );
}

