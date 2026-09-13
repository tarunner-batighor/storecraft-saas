import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  Truck,
  Sparkles,
  LogOut,
  Package,
  Layers,
  Globe
} from 'lucide-react';

export default function StorefrontHeader() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, isBn, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/${currentSlug}/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const primaryColor = branding?.primary_color || '#0284c7';

  return (
    <header className="sticky top-[37px] z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Announcement Bar */}
      {branding?.top_bar_enabled !== false && branding?.top_bar_text && (
        <div
          className="text-white text-xs py-1.5 px-4 text-center font-medium shadow-inner flex items-center justify-center space-x-2"
          style={{ backgroundColor: primaryColor }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{branding.top_bar_text}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Store Name */}
          <Link
            to={`/store/${currentSlug}`}
            className="flex items-center space-x-3 shrink-0 group"
          >
            {branding?.logo ? (
              <img
                src={branding.logo}
                alt={currentTenant?.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition"
              />
            ) : (
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition"
                style={{ backgroundColor: primaryColor }}
              >
                {currentTenant?.name?.slice(0, 1) || 'S'}
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-tight group-hover:text-sky-600 transition">
                {currentTenant?.name || 'Online Store'}
              </h1>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {branding?.tagline || '100% Genuine Products'}
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 text-white text-xs rounded-full font-bold shadow-sm transition"
                style={{ backgroundColor: primaryColor }}
              >
                {isBn ? 'খুঁজুন' : 'Search'}
              </button>
            </div>
          </form>

          {/* Nav Items & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Nav Links */}
            <nav className="hidden lg:flex items-center space-x-5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Link to={`/store/${currentSlug}`} className="hover:text-sky-600 transition">
                {t('nav_home')}
              </Link>
              <Link to={`/store/${currentSlug}/catalog`} className="hover:text-sky-600 transition">
                {t('nav_catalog')}
              </Link>
              <Link to={`/store/${currentSlug}/track`} className="hover:text-sky-600 transition flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-sky-500" />
                <span>{t('nav_track')}</span>
              </Link>
            </nav>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
              title="Switch Language / ভাষা পরিবর্তন করুন"
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 text-white px-3 sm:px-4 py-2 rounded-xl transition shadow-md hover:brightness-105 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-bold text-xs hidden sm:inline">{t('nav_cart')}</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-slate-900 text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Customer Account Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                      </div>
                      <Link
                        to={`/store/${currentSlug}/account`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Package className="w-4 h-4" />
                        <span>{t('nav_account')}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <div className="text-xs text-slate-600 dark:text-slate-400">{currentTenant?.name}</div>
                      <Link
                        to={`/login`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="block text-center w-full py-1.5 rounded-xl text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {t('nav_login')}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 text-white text-xs rounded-lg font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isBn ? 'খুঁজুন' : 'Go'}
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Link to={`/store/${currentSlug}`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('nav_home')}
              </Link>
              <Link to={`/store/${currentSlug}/catalog`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('nav_catalog')}
              </Link>
              <Link to={`/store/${currentSlug}/track`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('nav_track')}
              </Link>
              <Link to={`/store/${currentSlug}/account`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('nav_account')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
