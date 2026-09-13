import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import ProfilePasswordModal from '../../components/common/ProfilePasswordModal';
import {
  Crown,
  Store,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  KeyRound
} from 'lucide-react';

export default function SuperAdminDashboardPage() {
  const { user, isSuperAdmin, demoSwitch } = useAuth();
  const { switchTenant, refreshTenant } = useTenant();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tenants');
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const fetchSuperAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, tenantsRes, plansRes, ordersRes] = await Promise.all([
        api.get('/platform/stats'),
        api.get('/platform/tenants'),
        api.get('/platform/plans'),
        api.get('/platform/orders')
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (tenantsRes.success) setTenants(tenantsRes.tenants || []);
      if (plansRes.success) setPlans(plansRes.plans || []);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
    } catch (err) {
      console.error('Super Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const handleUpdateTenant = async (tenantId, updates) => {
    try {
      const res = await api.put(`/platform/tenants/${tenantId}`, updates);
      if (res.success) {
        setMsg('Tenant updated successfully!');
        fetchSuperAdminData();
        refreshTenant();
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const handleImpersonateTenant = async (tenantSlug) => {
    await demoSwitch('store_owner', tenantSlug);
    switchTenant(tenantSlug);
    navigate('/admin');
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset database to clean default seed state? All demo stores will be refreshed.')) return;
    try {
      const res = await api.post('/platform/reset-seed', {});
      if (res.success) {
        setMsg('Database reset and reseeded with fresh demo stores!');
        fetchSuperAdminData();
        refreshTenant();
      }
    } catch (err) {
      alert('Reset failed');
    }
  };

  const filteredTenants = tenants.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.slug.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 space-y-8">
      {/* Profile & Password Modal */}
      <ProfilePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />

      {/* Top Banner */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>StoreCraft Multi-Tenant Platform Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Super Admin Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Global tenant provisioning, SaaS recurring revenue, cross-store GMV & subscription tier quotas.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-sky-600/30"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>পাসওয়ার্ড পরিবর্তন</span>
          </button>

          <button
            onClick={handleResetDatabase}
            className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800/80 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            title="Reset to fresh demo seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <button
            onClick={fetchSuperAdminData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {msg && (
        <div className="max-w-7xl mx-auto p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Top 4 SaaS Performance KPI Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>SaaS Monthly Recurring (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatCurrency(stats?.saas_mrr || 0)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            ARR: {formatCurrency(stats?.saas_arr || 0)}/yr
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Active Stores</span>
            <Store className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats?.active_tenants || 0} / {stats?.total_tenants || 0}
          </div>
          <div className="text-[11px] text-sky-400 font-semibold mt-1">
            100% Data Row-Level Isolated
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Platform GMV (Total Volume)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {formatCurrency(stats?.platform_gmv || 0)}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Across {stats?.total_orders || 0} customer orders
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Platform Health & System</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            99.99% Uptime
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1 truncate">
            Node v20 • Ready
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-800 space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'tenants'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Tenants & Stores ({tenants.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'plans'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            SaaS Subscription Plans ({plans.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tenant Orders Feed ({orders.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Tenants List */}
      {activeTab === 'tenants' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search by store name or subdomain..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing {filteredTenants.length} tenants
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Store / Subdomain</th>
                    <th className="p-4">Owner Info</th>
                    <th className="p-4">Plan & Pricing</th>
                    <th className="p-4">Products / Orders</th>
                    <th className="p-4">Total GMV</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/50 transition">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {t.branding?.logo ? (
                            <img src={t.branding.logo} alt={t.name} className="w-9 h-9 rounded-xl object-cover bg-slate-800" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 font-bold flex items-center justify-center">
                              {t.name.slice(0, 1)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{t.name}</span>
                              {t.custom_domain && (
                                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono">
                                  {t.custom_domain}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {t.slug}.storecraft.io
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-200">{t.owner_name}</div>
                        <div className="text-[11px] text-slate-500">{t.owner_email}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Award className="w-3 h-3" />
                          <span>{t.plan_name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {formatCurrency(t.plan_price)}/mo
                        </div>
                      </td>
                      <td className="p-4">
                        <div><span className="font-bold text-white">{t.products_count}</span> products</div>
                        <div className="text-[11px] text-slate-500">{t.orders_count} orders</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {formatCurrency(t.total_revenue)}
                      </td>
                      <td className="p-4">
                        <select
                          value={t.status}
                          onChange={(e) => handleUpdateTenant(t.id, { status: e.target.value })}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                            t.status === 'active'
                              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                              : 'bg-rose-950/60 border-rose-800 text-rose-300'
                          }`}
                        >
                          <option value="active">Active (চালু)</option>
                          <option value="suspended">Suspended (স্থগিত)</option>
                        </select>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleImpersonateTenant(t.slug)}
                          className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition inline-flex items-center space-x-1 shadow-md"
                          title="Open Store Owner Admin"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subscription Plans */}
      {activeTab === 'plans' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">{p.id}</div>
                <h3 className="text-xl font-black text-white">{p.name}</h3>
                <div className="text-2xl font-black text-emerald-400 my-3">
                  {p.price_monthly === 0 ? 'Free' : `${formatCurrency(p.price_monthly)}/mo`}
                </div>
                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                  <div>📦 Max Products: <strong className="text-white">{p.max_products}</strong></div>
                  <div>👥 Max Staff: <strong className="text-white">{p.max_staff}</strong></div>
                  <div>🌐 Custom Domain: <strong className={p.custom_domain_allowed ? 'text-emerald-400' : 'text-slate-500'}>{p.custom_domain_allowed ? 'Allowed' : 'Not Allowed'}</strong></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Global Orders Feed */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Tenant Store</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-white">{o.order_number}</td>
                    <td className="p-4 font-semibold text-sky-400">{o.store_name}</td>
                    <td className="p-4">{o.customer_name} ({o.customer_phone})</td>
                    <td className="p-4 font-bold text-white">{formatCurrency(o.total_amount)}</td>
                    <td className="p-4 uppercase">{o.payment_method} ({o.payment_status})</td>
                    <td className="p-4">{getStatusBadge(o.status)}</td>
                    <td className="p-4 text-slate-500">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
