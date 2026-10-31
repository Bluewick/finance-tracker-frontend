import api from './api.js';

/**
 * Budgets Service (/api/budgets/*)
 */

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

/**
 * Endpoint #14: GET /api/budgets
 * Retrieves budgets for a specific month & year along with `total_monthly_spent`,
 * `actual_spent`, `remaining`, `percentage_used`, and `is_exceeded`.
 *
 * @param {object} [params] - { month: 1-12, year: YYYY }
 */
export async function getBudgets(params = {}) {
  return api.get('/api/budgets', {
    params: cleanParams(params),
  });
}

/**
 * Endpoints #6 & #8: POST /api/budgets
 * Creates or saves a monthly budget limit for a specific category (e.g. "Groceries") or overall ("ALL")
 *
 * @param {object} payload - { category: 'ALL' | string, amount_limit: number, month: number, year: number }
 */
export async function createBudget(payload) {
  return api.post('/api/budgets', {
    category: payload.category,
    amount_limit: Number(payload.amount_limit),
    month: Number(payload.month),
    year: Number(payload.year),
  });
}

/**
 * Endpoint #19: PATCH /api/budgets/:id
 * Updates an existing budget's amount_limit
 *
 * @param {string} id
 * @param {object} payload - { amount_limit: number }
 */
export async function updateBudget(id, payload) {
  return api.patch(`/api/budgets/${id}`, {
    amount_limit: Number(payload.amount_limit),
  });
}

/**
 * Endpoint #21: DELETE /api/budgets/:id
 * Deletes a budget by its ID
 *
 * @param {string} id
 */
export async function deleteBudget(id) {
  return api.delete(`/api/budgets/${id}`);
}

