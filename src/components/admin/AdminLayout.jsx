import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import ProfilePasswordModal from '../common/ProfilePasswordModal';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  Palette,
  Globe,
  CreditCard,
  Truck,
  UserCheck,
  BarChart3,
  Award,
  ExternalLink,
  Bell,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  LogOut,
  Settings,
  KeyRound
} from 'lucide-react';

export default function AdminLayout() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.success && res.notifications) {
          setNotifications(res.notifications);
        }
      } catch (err) {}
    };
    fetchNotifs();
  }, [currentSlug]);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {}
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Coupons & Discounts', path: '/admin/coupons', icon: Tags },
    { label: 'Sales Reports & CSV', path: '/admin/reports', icon: BarChart3 },
    { label: 'Theme & Branding', path: '/admin/branding', icon: Palette },
    { label: 'Custom Domain', path: '/admin/domain', icon: Globe },
    { label: 'Payment Settings', path: '/admin/payments', icon: CreditCard },
    { label: 'Courier Integration', path: '/admin/couriers', icon: Truck },
    { label: 'Staff & Roles (RBAC)', path: '/admin/staff', icon: UserCheck },
    { label: 'SaaS Plan & Billing', path: '/admin/subscription', icon: Award }
  ];

  const primaryColor = branding?.primary_color || '#0f766e';
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Profile & Password Modal */}
      <ProfilePasswordModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Store Logo & Branding Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {branding?.logo ? (
                <img src={branding.logo} alt={currentTenant?.name} className="w-9 h-9 rounded-xl object-cover" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {currentTenant?.name?.slice(0, 1) || 'S'}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{currentTenant?.name || 'Store Admin'}</h3>
                <span className="text-[10px] text-slate-400 block font-mono">{currentSlug}.storecraft.io</span>
              </div>
            </div>

            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Storefront link */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setProfileModalOpen(true)}
            className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
          >
            <span className="flex items-center space-x-2">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>পাসওয়ার্ড পরিবর্তন</span>
            </span>
            <span className="text-[10px] text-slate-400">Settings</span>
          </button>

          <Link
            to={`/store/${currentSlug}`}
            target="_blank"
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700 transition"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>StoreCraft v2.4 SaaS</span>
            <span className="text-emerald-400 font-semibold">Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
              <span>Tenant Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {location.pathname.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Store Notifications</span>
                    <button onClick={markAllRead} className="text-[11px] text-sky-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-3 text-xs ${n.is_read ? 'opacity-70' : 'bg-sky-50/50 dark:bg-sky-950/20'}`}>
                          <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill -> Opens Password Modal on Click */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition cursor-pointer p-1 rounded-xl"
              title="Click to update Profile & Password"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/30"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-none flex items-center space-x-1">
                  <span>{user?.name || 'Owner'}</span>
                  <KeyRound className="w-3 h-3 text-sky-500" />
                </div>
                <div className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Staff'} (Edit)</div>
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
