import api from './api.js';
import { STORAGE_KEYS } from '../utils/constants.util.js';

/**
 * User Profile & Security Service (/api/users/*)
 */

/**
 * Endpoint #3: GET /api/users/me
 * Retrieves the currently authenticated user's profile
 */
export async function getCurrentUser() {
  const response = await api.get('/api/users/me');
  if (response?.data) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data));
  }
  return response;
}

/**
 * Endpoint #11: PATCH /api/users/me
 * Updates the current user's profile (e.g., name, currency)
 *
 * @param {object} payload - { name, currency }
 */
export async function updateUserProfile(payload) {
  const response = await api.patch('/api/users/me', payload);
  if (response?.data) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data));
  }
  return response;
}

/**
 * Endpoint #16: PATCH /api/users/me/password
 * Updates the current user's account password
 *
 * @param {object} payload - { current_password, new_password }
 */
export async function updateUserPassword(payload) {
  return api.patch('/api/users/me/password', payload);
}

