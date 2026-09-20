import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
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
  ExternalLink,
  Bot,
  MessageSquare,
  Zap,
  Info
} from 'lucide-react';

export default function AdminBrandingPage() {
  const { currentTenant, branding, currentSlug, refreshTenant } = useTenant();
  const { isBn } = useLanguage();

  const [name, setName] = useState(currentTenant?.name || '');
  const [tagline, setTagline] = useState(branding?.tagline || '');
  const [logo, setLogo] = useState(branding?.logo || '');
  const [favicon, setFavicon] = useState(branding?.favicon || '');
  const [primaryColor, setPrimaryColor] = useState(branding?.primary_color || '#0284c7');
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondary_color || '#0f172a');
  const [accentColor, setAccentColor] = useState(branding?.accent_color || '#f59e0b');
  const [topBarText, setTopBarText] = useState(branding?.top_bar_text || '');
  const [topBarEnabled, setTopBarEnabled] = useState(branding?.top_bar_enabled ?? true);
  const [currencySymbol, setCurrencySymbol] = useState(branding?.currency_symbol || '৳');
  const [contactEmail, setContactEmail] = useState(branding?.contact_email || '');
  const [contactPhone, setContactPhone] = useState(branding?.contact_phone || '');
  const [address, setAddress] = useState(branding?.address || '');
  const [footerText, setFooterText] = useState(branding?.footer_text || '');

  // AI Chatbot Settings
  const [chatbotEnabled, setChatbotEnabled] = useState(branding?.chatbot?.enabled ?? true);
  const [chatbotUrl, setChatbotUrl] = useState(branding?.chatbot?.url || 'https://bot-platform-2qwf.onrender.com/chat/aaluh0fo');
  const [chatbotTitle, setChatbotTitle] = useState(branding?.chatbot?.title || 'বই সহকারী AI Bot');
  const [chatbotWelcome, setChatbotWelcome] = useState(branding?.chatbot?.welcome_message || 'আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো সহায়তার জন্য মেসেজ দিন।');

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
      setPrimaryColor(branding?.primary_color || '#0284c7');
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

      // Chatbot
      setChatbotEnabled(branding?.chatbot?.enabled ?? true);
      setChatbotUrl(branding?.chatbot?.url || 'https://bot-platform-2qwf.onrender.com/chat/aaluh0fo');
      setChatbotTitle(branding?.chatbot?.title || 'বই সহকারী AI Bot');
      setChatbotWelcome(branding?.chatbot?.welcome_message || 'আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো সহায়তার জন্য মেসেজ দিন।');
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
          hero_slides: heroSlides,
          chatbot: {
            enabled: chatbotEnabled,
            url: chatbotUrl.trim(),
            title: chatbotTitle.trim(),
            welcome_message: chatbotWelcome.trim()
          }
        }
      });

      if (res.success) {
        setMsg(isBn ? 'স্টোর ব্র্যান্ডিং ও চ্যাটবট সেটিংস সফলভাবে আপডেট হয়েছে!' : 'Store branding & chatbot settings updated live!');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Palette className="w-6 h-6 text-sky-500" />
            <span>{isBn ? 'স্টোর থিম, ব্র্যান্ডিং ও এআই চ্যাটবট কাস্টমাইজার' : 'Store Theme & White-Label Customizer'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isBn
              ? 'লোগো, ব্র্যান্ড কালার, হিরো স্লাইডার, অ্যানাউন্সমেন্ট বার এবং বট প্ল্যাটফর্ম থেকে এআই চ্যাটবট উইজেট যুক্ত করুন।'
              : 'Customize logo, dynamic brand colors, hero sliders, top announcement bar, and Bot Platform integration.'}
          </p>
        </div>

        <a
          href={`/store/${currentSlug}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center space-x-1.5 shadow-sm"
        >
          <span>{isBn ? 'লাইভ স্টোর দেখুন' : 'Live Storefront'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold">{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section: AI Chatbot Integration (Bot Platform) */}
        <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/40 to-slate-900 border border-sky-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white flex items-center space-x-2">
                  <span>{isBn ? 'এআই ও অটো-রিপ্লাই চ্যাটবট ইন্টিগ্রেশন (Bot Platform)' : 'AI & Auto-Reply Chatbot Integration'}</span>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] px-2 py-0.2 rounded-full uppercase font-bold">
                    Live
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isBn
                    ? 'আপনার বট প্ল্যাটফর্ম (bot-platform-2qwf.onrender.com) থেকে যেকোনো চ্যাটবট লিংক এখানে বসিয়ে ১-ক্লিকে ওয়েবসাইটে ফ্লোটিং চ্যাট আইকন চালু করুন।'
                    : 'Connect any chatbot web link from your bot platform to display a floating auto-reply chat widget at bottom-right.'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={chatbotEnabled}
                onChange={(e) => setChatbotEnabled(e.target.checked)}
                className="rounded text-sky-600 w-4 h-4"
              />
              <span className="text-xs font-bold text-slate-200">
                {chatbotEnabled ? (isBn ? 'চ্যাটবট সক্রিয় ✅' : 'Enabled ✅') : (isBn ? 'নিষ্ক্রিয় ❌' : 'Disabled ❌')}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-200 mb-1.5">
                {isBn ? 'বট ওয়েবচ্যাট ইউআরএল (Bot Chat Web URL)' : 'Bot Webchat URL'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="url"
                required={chatbotEnabled}
                placeholder="যেমন: https://bot-platform-2qwf.onrender.com/chat/aaluh0fo"
                value={chatbotUrl}
                onChange={(e) => setChatbotUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-sky-300 font-mono focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isBn
                  ? 'আপনার বট প্ল্যাটফর্মের চ্যাট পেজের সম্পূর্ণ লিংক দিন (উদাঃ https://bot-platform-2qwf.onrender.com/chat/aaluh0fo)'
                  : 'Paste your Bot Platform webchat embed URL.'}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                {isBn ? 'চ্যাটবট উইন্ডোর শিরোনাম (Assistant Title)' : 'Chatbot Window Title'}
              </label>
              <input
                type="text"
                placeholder="যেমন: Sarwar Books AI সহকারী"
                value={chatbotTitle}
                onChange={(e) => setChatbotTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                {isBn ? 'ওয়েলকাম ফ্লোটিং মেসেজ (Teaser Bubble)' : 'Welcome Bubble Message'}
              </label>
              <input
                type="text"
                placeholder="যেমন: আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো তথ্যের জন্য চ্যাট করুন।"
                value={chatbotWelcome}
                onChange={(e) => setChatbotWelcome(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900/90 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 1: Color Palette & Presets */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isBn ? '১. ডায়নামিক ব্র্যান্ড কালার ও থিম' : '1. Dynamic Brand Colors'}</span>
            </h2>
            <span className="text-[11px] text-slate-400">{isBn ? 'স্টোরফ্রন্টে সরাসরি প্রভাব ফেলবে' : 'Instantly affects Storefront'}</span>
          </div>

          {/* Quick Preset Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">{isBn ? 'প্রিসেট কালার প্যালেট' : 'Preset Themes'}</label>
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
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs hover:border-sky-500 transition cursor-pointer"
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
                {isBn ? 'প্রাইমারি ব্র্যান্ড কালার (বাটন ও অ্যাকসেন্ট)' : 'Primary Brand Color'}
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
                {isBn ? 'সেকেন্ডারি ডার্ক কালার (ফুটার/হেডার)' : 'Secondary Dark Color'}
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
                {isBn ? 'অ্যাকসেন্ট হাইলাইট কালার' : 'Accent Highlight Color'}
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
            {isBn ? '২. দোকানের নাম, স্লোগান ও লোগো' : '2. Store Name, Slogan & Media'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'দোকানের নাম' : 'Store Name'} <span className="text-rose-500">*</span>
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
                {isBn ? 'কারেন্সি প্রতীক' : 'Currency Symbol'}
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
                {isBn ? 'দোকানের স্লোগান / ট্যাগলাইন' : 'Store Tagline / Slogan'}
              </label>
              <input
                type="text"
                placeholder="যেমন: সেরা বইয়ের বিশ্বস্ত অনলাইন বুক শপ"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'লোগো ইমেজ লিঙ্ক (URL)' : 'Logo Image URL'}
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
                {isBn ? 'ফেভিকন ইমেজ লিঙ্ক (Favicon URL)' : 'Favicon URL'}
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
            {isBn ? '৩. টপ ব্যানার নোটিশ ও কন্টাক্ট ইনফো' : '3. Top Announcement & Contact Info'}
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isBn ? 'টপ হেডার নোটিশ টেক্সট' : 'Top Header Announcement Message'}
                </label>
                <label className="flex items-center space-x-1.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topBarEnabled}
                    onChange={(e) => setTopBarEnabled(e.target.checked)}
                    className="rounded text-sky-600 w-3.5 h-3.5"
                  />
                  <span>{isBn ? 'স্টোরফ্রন্টে প্রদর্শন করুন' : 'Show on Storefront'}</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="⚡ ১,৫০০ টাকার অর্ডারে ফ্রি ডেলিভারি | কোড: BOOK10"
                value={topBarText}
                onChange={(e) => setTopBarText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'সাপোর্ট ইমেইল' : 'Customer Support Email'}
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
                  {isBn ? 'সাপোর্ট মোবাইল নম্বর' : 'Customer Support Phone'}
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
                  {isBn ? 'দোকানের ঠিকানা' : 'Store Physical Address'}
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
                  {isBn ? 'ফুটার কপিরাইট টেক্সট' : 'Footer Copyright Note'}
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
            className="px-8 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xl transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isBn ? 'সব পরিবর্তন সেভ ও লাইভ করুন' : 'Save & Apply Theme Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
