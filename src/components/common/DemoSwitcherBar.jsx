import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
  RefreshCw
} from 'lucide-react';
import CreateStoreModal from './CreateStoreModal';

export default function DemoSwitcherBar() {
  const { currentSlug, currentTenant, availableStores, switchTenant, refreshTenant } = useTenant();
  const { user, isSuperAdmin, isStoreOwner, isStoreStaff, isCustomer, demoSwitch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const isSuperAdminView = location.pathname.startsWith('/super-admin');
  const isAdminView = location.pathname.startsWith('/admin') && !isSuperAdminView;
  const isPlatformView = location.pathname === '/' || location.pathname === '/platform';
  const isStorefrontView = !isSuperAdminView && !isAdminView && !isPlatformView;

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
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800 sticky top-0 z-50 px-3 py-2 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: SaaS Platform Brand & Active Store Selector */}
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
                Multi-Tenant SaaS
              </span>
            </button>

            <span className="text-slate-700">|</span>

            {/* Active Store Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md border border-slate-700 transition"
              >
                <Store className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {currentTenant?.name || currentSlug}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isStoreDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>SWITCH ACTIVE STORE</span>
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
                      <span>+ Create New Store</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center/Right: View Switcher Tabs & Role Switcher */}
          <div className="flex items-center space-x-2">
            {/* Navigation Mode Buttons */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => navigate('/platform')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  isPlatformView ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="SaaS Platform Overview"
              >
                <Layers className="w-3 h-3" />
                <span className="hidden md:inline">SaaS Portal</span>
              </button>

              <button
                onClick={() => navigate(`/store/${currentSlug}`)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  isStorefrontView ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Customer Storefront"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Storefront</span>
              </button>

              <button
                onClick={() => navigate('/admin')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  isAdminView ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Store Owner Admin Panel"
              >
                <Store className="w-3 h-3" />
                <span>Store Admin</span>
              </button>

              <button
                onClick={() => navigate('/super-admin')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  isSuperAdminView ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Super Admin Platform Portal"
              >
                <Crown className="w-3 h-3" />
                <span className="hidden md:inline">Super Admin</span>
              </button>
            </div>

            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-md transition"
                title="Switch Active Demo Role"
              >
                {isSuperAdmin ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                ) : isStoreOwner ? (
                  <Store className="w-3.5 h-3.5 text-indigo-400" />
                ) : isStoreStaff ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="font-semibold capitalize">
                  {user ? (user.role === 'super_admin' ? 'Super Admin' : user.role === 'store_owner' ? 'Store Owner' : user.role === 'store_staff' ? 'Manager' : 'Customer') : 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                    TEST ROLE AS:
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('super_admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-amber-300 hover:bg-slate-800"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-medium">Super Admin</div>
                      <div className="text-[10px] text-slate-400">Platform-wide control & plans</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('store_owner')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-indigo-300 hover:bg-slate-800"
                  >
                    <Store className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-medium">Store Owner</div>
                      <div className="text-[10px] text-slate-400">Products, orders, themes & staff</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('store_staff')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-blue-300 hover:bg-slate-800"
                  >
                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-medium">Store Manager / Staff</div>
                      <div className="text-[10px] text-slate-400">Order fulfillment & inventory</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSwitch('customer')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-emerald-300 hover:bg-slate-800"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">Customer</div>
                      <div className="text-[10px] text-slate-400">Shopping, wishlist & tracking</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
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
