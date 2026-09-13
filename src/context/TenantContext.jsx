import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setApiTenant } from '../utils/api';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [currentSlug, setCurrentSlug] = useState(() => {
    return localStorage.getItem('storecraft_tenant_slug') || 'sarwarbooks';
  });
  const [storeInfo, setStoreInfo] = useState(null);
  const [availableStores, setAvailableStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load available stores list
  const fetchAvailableStores = async () => {
    try {
      const res = await api.get('/public/stores');
      if (res.success && res.stores) {
        setAvailableStores(res.stores);
      }
    } catch (err) {
      console.warn('Could not fetch public stores list', err);
    }
  };

  // Fetch current store branding & info
  const fetchStoreInfo = async (slug) => {
    const targetSlug = slug || 'sarwarbooks';
    setLoading(true);
    try {
      setApiTenant(targetSlug);
      const res = await api.get('/tenant/info', {
        headers: { 'x-tenant-slug': targetSlug }
      });
      if (res.success && res.store) {
        setStoreInfo(res.store);
        localStorage.setItem('storecraft_tenant_slug', targetSlug);
        localStorage.setItem('storecraft_tenant_id', res.store.id);

        const primary = res.store.branding?.primary_color || '#0284c7';
        const secondary = res.store.branding?.secondary_color || '#0f172a';
        const accent = res.store.branding?.accent_color || '#f59e0b';
        
        document.documentElement.style.setProperty('--brand-primary', primary);
        document.documentElement.style.setProperty('--brand-secondary', secondary);
        document.documentElement.style.setProperty('--brand-accent', accent);
        
        document.title = `${res.store.name} | StoreCraft Platform`;
      }
    } catch (err) {
      console.error('Failed to load store info for ' + targetSlug, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableStores();
    fetchStoreInfo(currentSlug);
  }, [currentSlug]);

  const switchTenant = (slug) => {
    if (slug && slug !== currentSlug) {
      setCurrentSlug(slug);
      localStorage.setItem('storecraft_tenant_slug', slug);
      fetchStoreInfo(slug);
    }
  };

  const refreshTenant = () => {
    fetchStoreInfo(currentSlug);
    fetchAvailableStores();
  };

  return (
    <TenantContext.Provider value={{
      currentSlug,
      currentTenant: storeInfo,
      branding: storeInfo?.branding || {},
      availableStores,
      loading,
      switchTenant,
      refreshTenant
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
