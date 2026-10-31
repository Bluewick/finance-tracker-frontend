import api from './api.js';

/**
 * Transactions Service (/api/transactions/*)
 */

/**
 * Helper to strip empty/undefined query parameters before sending to API
 */
function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '' && value !== 'ALL'
    )
  );
}

/**
 * Endpoint #12: GET /api/transactions
 * Retrieves paginated and filtered transactions
 *
 * @param {object} [params] - { page, limit, type, category, startDate, endDate, search }
 */
export async function getTransactions(params = {}) {
  return api.get('/api/transactions', {
    params: cleanParams(params),
  });
}

/**
 * Endpoint #20: GET /api/transactions/:id
 * Retrieves a single transaction by its ID
 *
 * @param {string} id
 */
export async function getTransactionById(id) {
  return api.get(`/api/transactions/${id}`);
}

/**
 * Endpoints #4 & #7: POST /api/transactions
 * Creates a new income or expense transaction
 *
 * @param {object} payload - { type: 'income'|'expense', category, amount, date, notes }
 */
export async function createTransaction(payload) {
  return api.post('/api/transactions', {
    ...payload,
    amount: Number(payload.amount),
  });
}

/**
 * Endpoint #22: PATCH /api/transactions/:id
 * Updates an existing transaction
 *
 * @param {string} id
 * @param {object} payload - { type, category, amount, date, notes }
 */
export async function updateTransaction(id, payload) {
  const body = { ...payload };
  if (body.amount !== undefined) {
    body.amount = Number(body.amount);
  }
  return api.patch(`/api/transactions/${id}`, body);
}

/**
 * Endpoint #23: DELETE /api/transactions/:id
 * Deletes a transaction by its ID
 *
 * @param {string} id
 */
export async function deleteTransaction(id) {
  return api.delete(`/api/transactions/${id}`);
}

/**
 * Endpoint #17: GET /api/transactions/export
 * Fetches raw CSV string of transactions matching optional filter parameters
 *
 * @param {object} [params] - { type, category, startDate, endDate }
 * @returns {Promise<string>} Raw CSV string
 */
export async function exportTransactionsCsv(params = {}) {
  const response = await api.get('/api/transactions/export', {
    params: cleanParams(params),
    responseType: 'text',
  });
  return typeof response === 'string' ? response : JSON.stringify(response);
}

/**
 * Triggers a browser file download from a CSV text payload
 *
 * @param {string} csvContent
 * @param {string} [filename]
 */
export function triggerCsvDownload(csvContent, filename) {
  const defaultFilename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

