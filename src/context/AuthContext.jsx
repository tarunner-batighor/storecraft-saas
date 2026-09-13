import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('storecraft_token'));

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('storecraft_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [token]);

  const login = async (email, password, tenant_id) => {
    const res = await api.post('/auth/login', { email, password, tenant_id });
    if (res.success && res.token) {
      localStorage.setItem('storecraft_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.token) {
      localStorage.setItem('storecraft_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('storecraft_token');
    setToken(null);
    setUser(null);
  };

  const demoSwitch = async (role, tenantSlug, userId) => {
    try {
      const res = await api.post('/auth/demo-switch', { role, tenant_slug: tenantSlug, user_id: userId });
      if (res.success && res.token) {
        localStorage.setItem('storecraft_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.error('Demo switch failed:', err);
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'store_owner') return true;
    if (user.permissions && (user.permissions.includes('all') || user.permissions.includes(permission))) {
      return true;
    }
    return false;
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isStoreOwner = user?.role === 'store_owner';
  const isStoreStaff = user?.role === 'store_staff' || isStoreOwner || isSuperAdmin;
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      isSuperAdmin,
      isStoreOwner,
      isStoreStaff,
      isCustomer,
      login,
      register,
      logout,
      demoSwitch,
      hasPermission,
      refreshUser: checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
