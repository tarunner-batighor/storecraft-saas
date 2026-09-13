import React, { useState } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { X, Sparkles, Store, Check, ArrowRight, Loader2 } from 'lucide-react';

export default function CreateStoreModal({ onClose, onSuccess }) {
  const { register } = useAuth();
  const { refreshTenant } = useTenant();

  const [formData, setFormData] = useState({
    store_name: '',
    store_slug: '',
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    category_type: 'General Store',
    primary_color: '#0f766e'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      store_name: val,
      store_slug: autoSlug
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.store_name || !formData.email || !formData.name) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const res = await register({
        role: 'store_owner',
        store_name: formData.store_name,
        store_slug: formData.store_slug || formData.store_name.toLowerCase().replace(/\s+/g, '-'),
        name: formData.name,
        email: formData.email,
        password: formData.password || 'password123',
        phone: formData.phone
      });

      if (res.success && res.tenant) {
        refreshTenant();
        if (onSuccess) {
          onSuccess(res.tenant);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  const presetColors = [
    { label: 'Emerald', hex: '#059669' },
    { label: 'Teal', hex: '#0f766e' },
    { label: 'Sky Blue', hex: '#0284c7' },
    { label: 'Royal Indigo', hex: '#4f46e5' },
    { label: 'Rose Pink', hex: '#e11d48' },
    { label: 'Amber Gold', hex: '#d97706' },
    { label: 'Charcoal', hex: '#18181b' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Multi-Tenant Store Wizard</span>
          </div>
          <h2 className="text-xl font-bold">Launch Your Online Store in 30s</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Instant white-label store with customizable logo, branding, and ready-to-sell catalog!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Store Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Sneaker Hub, BD Artisan Studio"
              value={formData.store_name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Store Subdomain / Slug
            </label>
            <div className="flex items-center">
              <input
                type="text"
                required
                placeholder="my-store"
                value={formData.store_slug}
                onChange={(e) => setFormData({ ...formData, store_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-l-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 text-xs border border-l-0 border-slate-300 dark:border-slate-700 rounded-r-lg font-mono">
                .storecraft.io
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Tanvir Ahmed"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Owner Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="owner@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+880 1700-000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Store Architecture...</span>
                </>
              ) : (
                <>
                  <span>Create & Launch Store Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
