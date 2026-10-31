import api from './api.js';

/**
 * Visual Analytics Service (/api/analytics/*)
 */

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '' && value !== 'ALL'
    )
  );
}

/**
 * Endpoint #5: GET /api/analytics/summary
 * Retrieves total_income, total_expense, net_balance, savings_rate, and transaction_counts
 *
 * @param {object} [params] - Optional filter parameters { startDate, endDate, category, month, year }
 */
export async function getFinancialSummary(params = {}) {
  return api.get('/api/analytics/summary', {
    params: cleanParams(params),
  });
}

/**
 * Endpoint #13: GET /api/analytics/category-breakdown
 * Retrieves category-wise distribution (amount, percentage, transaction_count) for Pie/Donut charts
 *
 * @param {object} [params] - Optional { type: 'expense'|'income', startDate, endDate, month, year }
 */
export async function getCategoryBreakdown(params = {}) {
  return api.get('/api/analytics/category-breakdown', {
    params: cleanParams(params),
  });
}

/**
 * Endpoint #18: GET /api/analytics/monthly-trends
 * Retrieves 12-month income, expense, and net_savings trends for Bar charts
 *
 * @param {object} [params] - Optional { year: 2026 }
 */
export async function getMonthlyTrends(params = {}) {
  return api.get('/api/analytics/monthly-trends', {
    params: cleanParams(params),
  });
}

