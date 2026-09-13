import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import {
  Palette,
  Sparkles,
  Save,
  Check,
  Image,
  Eye,
  Sliders,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function AdminBrandingPage() {
  const { currentTenant, branding, currentSlug, refreshTenant } = useTenant();

  const [name, setName] = useState(currentTenant?.name || '');
  const [tagline, setTagline] = useState(branding?.tagline || '');
  const [logo, setLogo] = useState(branding?.logo || '');
  const [favicon, setFavicon] = useState(branding?.favicon || '');
  const [primaryColor, setPrimaryColor] = useState(branding?.primary_color || '#0f766e');
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondary_color || '#0f172a');
  const [accentColor, setAccentColor] = useState(branding?.accent_color || '#f59e0b');
  const [topBarText, setTopBarText] = useState(branding?.top_bar_text || '');
  const [topBarEnabled, setTopBarEnabled] = useState(branding?.top_bar_enabled ?? true);
  const [currencySymbol, setCurrencySymbol] = useState(branding?.currency_symbol || '৳');
  const [contactEmail, setContactEmail] = useState(branding?.contact_email || '');
  const [contactPhone, setContactPhone] = useState(branding?.contact_phone || '');
  const [address, setAddress] = useState(branding?.address || '');
  const [footerText, setFooterText] = useState(branding?.footer_text || '');

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState(branding?.hero_slides || []);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (currentTenant) {
      setName(currentTenant.name || '');
      setTagline(branding?.tagline || '');
      setLogo(branding?.logo || '');
      setFavicon(branding?.favicon || '');
      setPrimaryColor(branding?.primary_color || '#0f766e');
      setSecondaryColor(branding?.secondary_color || '#0f172a');
      setAccentColor(branding?.accent_color || '#f59e0b');
      setTopBarText(branding?.top_bar_text || '');
      setTopBarEnabled(branding?.top_bar_enabled ?? true);
      setCurrencySymbol(branding?.currency_symbol || '৳');
      setContactEmail(branding?.contact_email || '');
      setContactPhone(branding?.contact_phone || '');
      setAddress(branding?.address || '');
      setFooterText(branding?.footer_text || '');
      setHeroSlides(branding?.hero_slides || []);
    }
  }, [currentTenant, branding]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await api.put('/tenant/branding', {
        name,
        branding: {
          tagline,
          logo,
          favicon,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor,
          top_bar_text: topBarText,
          top_bar_enabled: topBarEnabled,
          currency_symbol: currencySymbol,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          address,
          footer_text: footerText,
          hero_slides: heroSlides
        }
      });

      if (res.success) {
        setMsg('Store branding & theme settings updated live!');
        refreshTenant();
      }
    } catch (err) {
      setMsg(err.message || 'Failed to update branding');
    } finally {
      setSaving(false);
    }
  };

  const presetThemes = [
    { name: 'Sky Tech', primary: '#0284c7', secondary: '#0f172a', accent: '#f59e0b' },
    { name: 'Rose Boutique', primary: '#be123c', secondary: '#831843', accent: '#fbbf24' },
    { name: 'Emerald Organic', primary: '#059669', secondary: '#064e3b', accent: '#d97706' },
    { name: 'Indigo Modern', primary: '#4f46e5', secondary: '#1e1b4b', accent: '#ec4899' },
    { name: 'Amber Luxury', primary: '#d97706', secondary: '#451a03', accent: '#f59e0b' },
    { name: 'Dark Cyberpunk', primary: '#06b6d4', secondary: '#09090b', accent: '#a855f7' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Palette className="w-6 h-6 text-sky-500" />
            <span>Store Theme & White-Label Customizer</span>
          </h1>
          <p className="text-xs text-slate-500">
            Customize logo, dynamic brand colors, hero sliders, top announcement bar, and store information.
          </p>
        </div>

        <a
          href={`/store/${currentSlug}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1"
        >
          <span>Live Storefront Preview</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Color Palette & Presets */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Dynamic Brand Colors</span>
            </h2>
            <span className="text-[11px] text-slate-400">Instantly affects Storefront UI</span>
          </div>

          {/* Quick Preset Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Preset Themes</label>
            <div className="flex flex-wrap gap-2">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                    setAccentColor(preset.accent);
                  }}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs hover:border-sky-500 transition"
                >
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Brand Color (Buttons & Accents)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Secondary Dark Color (Header / Footer)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accent Highlight Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Store Identity & Logo */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3">
            2. Store Name, Slogan & Media
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store Tagline / Slogan
              </label>
              <input
                type="text"
                placeholder="e.g. Bangladesh's Most Trusted Destination for Authentic Gadgets"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Favicon Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Announcement Bar & Contact Info */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3">
            3. Top Announcement & Contact Info
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Top Header Announcement Message
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topBarEnabled}
                    onChange={(e) => setTopBarEnabled(e.target.checked)}
                    className="rounded text-sky-600 w-3.5 h-3.5"
                  />
                  <span>Show on Storefront</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="⚡ Free Delivery on orders over ৳2,000 | Use Code: WELCOME10"
                value={topBarText}
                onChange={(e) => setTopBarText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Support Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Store Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Footer Copyright Note
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Apply Theme Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
