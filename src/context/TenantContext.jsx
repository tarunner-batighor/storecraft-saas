import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setApiTenant } from '../utils/api';

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [currentSlug, setCurrentSlug] = useState(() => {
    return localStorage.getItem('storecraft_tenant_slug') || 'gadgetvibe';
  });
  const [storeInfo, setStoreInfo] = useState(null);
  const [availableStores, setAvailableStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load available stores list for demo switcher
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
    setLoading(true);
    try {
      setApiTenant(slug);
      const res = await api.get('/tenant/info', {
        headers: { 'x-tenant-slug': slug }
      });
      if (res.success && res.store) {
        setStoreInfo(res.store);
        localStorage.setItem('storecraft_tenant_slug', slug);
        localStorage.setItem('storecraft_tenant_id', res.store.id);

        // Apply dynamic CSS variables for theme customization
        const primary = res.store.branding?.primary_color || '#0f766e';
        const secondary = res.store.branding?.secondary_color || '#0f172a';
        const accent = res.store.branding?.accent_color || '#f59e0b';
        
        document.documentElement.style.setProperty('--brand-primary', primary);
        document.documentElement.style.setProperty('--brand-secondary', secondary);
        document.documentElement.style.setProperty('--brand-accent', accent);
        
        // Update Title & Favicon
        document.title = `${res.store.name} | Multi-Tenant Store`;
        if (res.store.branding?.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = res.store.branding.favicon;
        }
      }
    } catch (err) {
      console.error('Failed to load store info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableStores();
    fetchStoreInfo(currentSlug);
  }, [currentSlug]);

  const switchTenant = (slug) => {
    if (slug !== currentSlug) {
      setCurrentSlug(slug);
      localStorage.setItem('storecraft_tenant_slug', slug);
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
