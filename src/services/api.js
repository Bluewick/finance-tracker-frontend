import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants.util.js';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5213';

/**
 * Centralized Axios HTTP Client configured for the Express.js Finance Tracker API
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Automatically attach JWT Bearer token if present
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * - Unwraps standardized `{ success, message, data, meta }` envelopes
 * - Gracefully handles 204 / status 0 empty responses (DELETE & logout endpoints)
 * - Handles 401 Unauthorized session expiration without hard page reloads
 */
api.interceptors.response.use(
  (response) => {
    // Handle raw CSV export or string payloads
    if (typeof response.data === 'string') {
      return response.data;
    }

    // Handle 204 No Content or empty body
    if (!response.data || response.status === 204) {
      return {
        success: true,
        message: 'Operation completed successfully.',
        data: null,
      };
    }

    return response.data;
  },
  (error) => {
    // Notice from API spec: DELETE /api/transactions/:id, DELETE /api/budgets/:id,
    // and POST /api/auth/logout may return status 0 or empty response when server closes connection with 204
    const requestMethod = error.config?.method?.toLowerCase();
    const requestUrl = error.config?.url || '';
    const isDeleteOrLogout =
      requestMethod === 'delete' || requestUrl.includes('/api/auth/logout');

    if (!error.response && isDeleteOrLogout) {
      return {
        success: true,
        message: 'Operation completed successfully.',
        data: null,
      };
    }

    const status = error.response?.status;
    const responseData = error.response?.data;

    // Extract standardized backend error structure
    const errorMessage =
      responseData?.error?.message ||
      responseData?.message ||
      error.message ||
      'An unexpected network error occurred.';

    const errorCode = responseData?.error?.code || `HTTP_${status || 'NETWORK_ERROR'}`;
    const errorDetails = responseData?.error?.details || [];

    // Automatic session cleanup on 401 Unauthorized (except login/register/password change attempts)
    const isAuthAttempt =
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/register') ||
      requestUrl.includes('/api/users/me/password');

    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    const normalizedError = new Error(errorMessage);
    normalizedError.status = status;
    normalizedError.code = errorCode;
    normalizedError.details = errorDetails;
    normalizedError.raw = responseData;

    return Promise.reject(normalizedError);
  }
);

/**
 * Endpoint #1: GET /
 * Verifies root API status
 */
export async function getApiRootStatus() {
  return api.get('/');
}

/**
 * Endpoint #9: GET /api/health
 * Checks server health and uptime
 */
export async function getServerHealth() {
  return api.get('/api/health');
}

export default api;

