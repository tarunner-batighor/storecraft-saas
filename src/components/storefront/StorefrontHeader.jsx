import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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
  Layers
} from 'lucide-react';

export default function StorefrontHeader() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
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

  const primaryColor = branding?.primary_color || '#0f766e';

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
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                {currentTenant?.name?.slice(0, 1) || 'S'}
              </div>
            )}
            <div>
              <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block group-hover:opacity-90">
                {currentTenant?.name || 'Online Store'}
              </span>
              {branding?.tagline && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 hidden md:block max-w-[280px]">
                  {branding.tagline}
                </span>
              )}
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search genuine products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 text-slate-900 dark:text-white transition"
                style={{ '--tw-ring-color': primaryColor }}
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full text-white text-xs font-semibold shadow-sm transition"
                style={{ backgroundColor: primaryColor }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Catalog Link */}
            <Link
              to={`/store/${currentSlug}/catalog`}
              className="hidden lg:flex items-center space-x-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Layers className="w-4 h-4" />
              <span>Catalog</span>
            </Link>

            {/* Track Order */}
            <Link
              to={`/store/${currentSlug}/track`}
              className="hidden sm:flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </Link>

            {/* Wishlist */}
            <Link
              to={`/store/${currentSlug}/account?tab=wishlist`}
              className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 px-3 py-2 rounded-xl text-white shadow-md transition hover:opacity-95"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold text-xs hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-slate-900 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Customer Account Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
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
                        <span>My Orders & Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <div className="text-xs text-slate-600 dark:text-slate-400">Welcome to {currentTenant?.name}</div>
                      <Link
                        to={`/store/${currentSlug}/account`}
                        onClick={() => setUserDropdownOpen(false)}
                        className="block text-center w-full py-1.5 rounded-lg text-white text-xs font-semibold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Sign In / Register
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 text-white text-xs rounded-md font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Go
                </button>
              </div>
            </form>
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Link to={`/store/${currentSlug}`} onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded hover:bg-slate-100">
                Home
              </Link>
              <Link to={`/store/${currentSlug}/catalog`} onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded hover:bg-slate-100">
                All Products
              </Link>
              <Link to={`/store/${currentSlug}/track`} onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded hover:bg-slate-100">
                Track Order
              </Link>
              <Link to={`/store/${currentSlug}/account`} onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 rounded hover:bg-slate-100">
                Customer Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
