import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  Grid,
  ShoppingCart,
  Heart,
  User,
  Truck
} from 'lucide-react';

export default function StoreMobileBottomBar() {
  const { currentSlug, branding } = useTenant();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { isBn } = useLanguage();
  const location = useLocation();

  const primaryColor = branding?.primary_color || '#0284c7';
  const basePath = `/store/${currentSlug}`;

  const navItems = [
    {
      label: isBn ? 'হোম' : 'Home',
      path: basePath,
      icon: Home,
      exact: true
    },
    {
      label: isBn ? 'ক্যাটালগ' : 'Shop',
      path: `${basePath}/catalog`,
      icon: Grid
    },
    {
      label: isBn ? 'ট্র্যাকিং' : 'Track',
      path: `${basePath}/track`,
      icon: Truck
    },
    {
      label: isBn ? 'অ্যাকাউন্ট' : 'Account',
      path: `${basePath}/account`,
      icon: User
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-2xl flex items-center justify-around">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? location.pathname === item.path || location.pathname === `${item.path}/`
          : location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive ? 'font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
            style={{ color: isActive ? primaryColor : undefined }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}

      {/* Center Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative -top-3 p-3 rounded-full text-white shadow-xl transition transform active:scale-95 flex items-center justify-center"
        style={{ backgroundColor: primaryColor }}
        aria-label="Open Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {totalItemsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
            {totalItemsCount}
          </span>
        )}
      </button>

      {navItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname.startsWith(item.path);

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive ? 'font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
            style={{ color: isActive ? primaryColor : undefined }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
