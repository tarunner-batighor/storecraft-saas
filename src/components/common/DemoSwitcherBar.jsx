import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Store,
  Crown,
  ShieldAlert,
  UserCheck,
  ShoppingBag,
  ExternalLink,
  PlusCircle,
  Layers,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import CreateStoreModal from './CreateStoreModal';

export default function DemoSwitcherBar() {
  const { currentSlug, currentTenant, availableStores, switchTenant, refreshTenant } = useTenant();
  const { user, isSuperAdmin, isStoreOwner, isStoreStaff, isCustomer, demoSwitch, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const isSuperAdminView = location.pathname.startsWith('/super-admin');
  const isAdminView = location.pathname.startsWith('/admin') && !isSuperAdminView;
  const isPlatformView = location.pathname === '/' || location.pathname === '/platform';
  const isStorefrontView = !isSuperAdminView && !isAdminView && !isPlatformView;

  if (isDismissed) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setIsDismissed(false)}
          className="bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 p-2 rounded-full shadow-2xl flex items-center space-x-1.5 text-xs font-bold transition"
          title="Show Switcher Bar"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px]">Demo Controls</span>
        </button>
      </div>
    );
  }

  const handleStoreChange = (slug) => {
    switchTenant(slug);
    setIsStoreDropdownOpen(false);
    if (isAdminView) {
      navigate('/admin');
    } else if (isStorefrontView) {
      navigate(`/store/${slug}`);
    }
  };

  const handleRoleSwitch = async (role) => {
    setIsRoleDropdownOpen(false);
    await demoSwitch(role, currentSlug);
    if (role === 'super_admin') {
      navigate('/super-admin');
    } else if (role === 'store_owner' || role === 'store_staff') {
      navigate('/admin');
    } else {
      navigate(`/store/${currentSlug}`);
    }
  };

  return (
    <>
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800 sticky top-0 z-50 px-3 py-1.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: SaaS Brand & Active Store Selector */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/platform')}
              className="flex items-center space-x-1.5 font-bold tracking-wide text-white hover:text-emerald-400 transition"
              title="SaaS Platform Landing"
            >
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center text-white font-extrabold text-[10px]">
                SC
              </div>
              <span className="hidden sm:inline">StoreCraft</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold">
                SaaS
              </span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Active Store Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-md border border-slate-700 transition text-xs"
              >
                <Store className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-medium truncate max-w-[110px] sm:max-w-[150px]">
                  {currentTenant?.name || currentSlug}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStoreDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>দোকান পরিবর্তন করুন</span>
                    <button onClick={refreshTenant} className="hover:text-white" title="Refresh">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  {availableStores.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleStoreChange(s.slug)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition ${
                        currentSlug === s.slug ? 'bg-sky-950/60 text-sky-400 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: s.branding?.primary_color || '#0ea5e9' }}
                        />
                        <div>
                          <div className="text-xs">{s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.slug}.storecraft.io</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {s.plan_name}
                      </span>
                    </button>
                  ))}
                  <div className="p-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setIsStoreDropdownOpen(false);
                        setShowCreateModal(true);
                      }}
                      className="w-full flex items-center justify-center space-x-1 text-emerald-400 hover:bg-emerald-950/50 py-1.5 rounded text-xs font-semibold"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ নতুন স্টোর খুলুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Links, Role, Login & Dismiss */}
          <div className="flex items-center space-x-2">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => navigate('/platform')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  isPlatformView ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                SaaS
              </button>

              <button
                onClick={() => navigate(`/store/${currentSlug}`)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  isStorefrontView ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Storefront
              </button>

              <button
                onClick={() => navigate('/admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  isAdminView ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>

              <button
                onClick={() => navigate('/super-admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  isSuperAdminView ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Super Admin
              </button>
            </div>

            {/* Login / Logout Button */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex items-center space-x-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-2 py-1 rounded-md text-[11px] font-bold transition"
                title="লগআউট করুন"
              >
                <LogOut className="w-3 h-3" />
                <span>লগআউট</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition shadow"
              >
                <Lock className="w-3 h-3" />
                <span>লগইন (Login)</span>
              </Link>
            )}

            {/* Dismiss / Hide button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-md"
              title="এই বারটি লুকান (Hide Bar)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateStoreModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTenant) => {
            setShowCreateModal(false);
            switchTenant(newTenant.slug);
            navigate(`/store/${newTenant.slug}`);
          }}
        />
      )}
    </>
  );
}
