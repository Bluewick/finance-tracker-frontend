import api from './api.js';
import { STORAGE_KEYS } from '../utils/constants.util.js';

/**
 * Authentication Service (/api/auth/*)
 */

/**
 * Endpoint #2: POST /api/auth/register
 * Registers a new user account and persists JWT token & user profile
 *
 * @param {object} payload - { name, email, password, currency }
 */
export async function registerUser(payload) {
  const response = await api.post('/api/auth/register', payload);
  if (response?.data?.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
  }
  if (response?.data?.user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data.user));
  }
  return response;
}

/**
 * Endpoint #10: POST /api/auth/login
 * Authenticates an existing user and persists JWT token & user profile
 *
 * @param {object} payload - { email, password }
 */
export async function loginUser(payload) {
  const response = await api.post('/api/auth/login', payload);
  if (response?.data?.token) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
  }
  if (response?.data?.user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data.user));
  }
  return response;
}

/**
 * Endpoint #15: POST /api/auth/logout
 * Logs out the current user. Note: Backend may return empty/204/status 0;
 * always clear client storage in `finally`.
 */
export async function logoutUser() {
  try {
    await api.post('/api/auth/logout');
  } catch {
    // Ignore network/empty response errors on logout
  } finally {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  }
  return { success: true, message: 'Logged out successfully.' };
}

