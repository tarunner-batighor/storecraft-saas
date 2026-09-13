import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
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
  Lock
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

      {/* Global Stats Matrix */}
      {stats && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Active Tenants</span>
              <Store className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.total_tenants} Stores</div>
            <div className="text-[11px] text-slate-500">{stats.active_tenants} active stores provisioning orders</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">SaaS MRR (Monthly)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">${stats.saas_mrr} / mo</div>
            <div className="text-[11px] text-slate-500">ARR Run Rate: <strong>${stats.saas_arr} / year</strong></div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Platform Gross GMV</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">
              {formatCurrency(stats.platform_gmv, 'BDT', '৳')}
            </div>
            <div className="text-[11px] text-slate-500">Total Orders: <strong>{stats.total_orders}</strong> across all tenants</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">System Architecture</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">{stats.system_status.db_status}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">Uptime: {stats.system_status.uptime}</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex border-b border-slate-800 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'tenants' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Tenant Stores ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'plans' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>SaaS Plans & Quotas ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'orders' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Global Orders Feed ({orders.length})</span>
        </button>
      </div>

      {/* Tab 1: Tenant Management */}
      {activeTab === 'tenants' && (
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Search store name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white outline-none"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="p-4">Store / Subdomain</th>
                  <th className="p-4">Owner Contact</th>
                  <th className="p-4">SaaS Tier Plan</th>
                  <th className="p-4">Catalog & Orders</th>
                  <th className="p-4">Gross Revenue</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={t.branding?.logo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={t.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{t.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{t.slug}.storecraft.io</div>
                        {t.custom_domain && (
                          <div className="text-[10px] text-sky-400 font-mono">🌐 {t.custom_domain}</div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-white font-medium">{t.owner_name}</div>
                      <div className="text-[11px] text-slate-400">{t.owner_email}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={t.plan_id}
                        onChange={(e) => handleUpdateTenant(t.id, { plan_id: e.target.value })}
                        className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 outline-none"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} (${p.price_monthly}/mo)</option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <div className="text-white font-semibold">{t.products_count} Products</div>
                      <div className="text-[11px] text-slate-400">{t.orders_count} Orders</div>
                    </td>

                    <td className="p-4 font-black text-amber-400 text-sm">
                      {formatCurrency(t.total_revenue, 'BDT', '৳')}
                    </td>

                    <td className="p-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTenant(t.id, { status: e.target.value })}
                        className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 border outline-none cursor-pointer ${
                          t.status === 'active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
                        }`}
                      >
                        <option value="active">ACTIVE</option>
                        <option value="suspended">SUSPENDED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleImpersonateTenant(t.slug)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition inline-flex items-center space-x-1"
                        title="Login as Store Owner"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Impersonate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: SaaS Plans */}
      {activeTab === 'plans' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div key={p.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">{p.name}</h3>
                <div className="text-2xl font-black text-emerald-400 mt-1">${p.price_monthly} / mo</div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Product Limit:</span>
                  <strong className="text-white">{p.max_products}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Staff Seats:</span>
                  <strong className="text-white">{p.max_staff}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Custom Domain:</span>
                  <strong className="text-white">{p.custom_domain_allowed ? 'Allowed' : 'Not Allowed'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <strong className="text-white">{p.commission_percentage}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Global Orders Feed */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                <th className="p-4">Store Name</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-bold text-white">{ord.store_name}</td>
                  <td className="p-4 font-mono text-slate-400">#{ord.order_number}</td>
                  <td className="p-4 text-slate-300">{ord.customer_name} ({ord.customer_phone})</td>
                  <td className="p-4 font-bold text-amber-400">{formatCurrency(ord.total_amount, 'BDT', '৳')}</td>
                  <td className="p-4 text-slate-400 uppercase">{ord.payment_method}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(ord.status).bg}`}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
