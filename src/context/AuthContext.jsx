import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../hooks/useAuth.js';
import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  registerUser as apiRegisterUser,
} from '../services/auth.service.js';
import {
  getCurrentUser as apiGetCurrentUser,
  updateUserProfile as apiUpdateUserProfile,
} from '../services/user.service.js';
import { DEFAULT_CURRENCY, STORAGE_KEYS } from '../utils/constants.util.js';
import {
  fetchLiveExchangeRates,
  getExchangeRates,
} from '../utils/formatters.util.js';

function getInitialStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  );
  const [user, setUser] = useState(() => getInitialStoredUser());
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN))
  );
  const [exchangeRates, setExchangeRates] = useState(() => getExchangeRates());

  /**
   * Fetch latest live FX conversion rates on initial app load
   */
  useEffect(() => {
    let active = true;
    fetchLiveExchangeRates().then((liveRates) => {
      if (active && liveRates) {
        setExchangeRates({ ...liveRates });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  /**
   * Syncs user profile from GET /api/users/me on initial app load if a JWT exists
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!storedToken) {
      return;
    }

    let active = true;
    apiGetCurrentUser()
      .then((res) => {
        if (!active) return;
        if (res?.data) {
          setUser(res.data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
        setToken(null);
        setUser(null);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /**
   * Listen for 401 Unauthorized events dispatched by src/services/api.js
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await apiLoginUser(credentials);
    const newToken = response?.data?.token || null;
    const newUser = response?.data?.user || null;
    setToken(newToken);
    setUser(newUser);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    const response = await apiRegisterUser(payload);
    const newToken = response?.data?.token || null;
    const newUser = response?.data?.user || null;
    setToken(newToken);
    setUser(newUser);
    return response;
  }, []);

  const logout = useCallback(async () => {
    await apiLogoutUser();
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const response = await apiGetCurrentUser();
    if (response?.data) {
      setUser(response.data);
    }
    return response;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const response = await apiUpdateUserProfile(payload);
    if (response?.data) {
      setUser(response.data);
    }
    return response;
  }, []);

  const currency = user?.currency || DEFAULT_CURRENCY;
  const isAuthenticated = Boolean(token && user);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      currency,
      exchangeRates,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    }),
    [
      user,
      token,
      currency,
      exchangeRates,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
