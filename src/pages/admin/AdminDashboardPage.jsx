import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Truck,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentSlug]);

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading store analytics & fulfillment feed...</p>
      </div>
    );
  }

  const { metrics, charts, top_selling_products, low_stock_products, recent_orders } = data;
  const currencySymbol = branding?.currency_symbol || '৳';

  // Calculate max revenue in daily sales for bar scaling
  const maxDayRevenue = Math.max(...charts.daily_sales.map(d => d.revenue), 1000);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Overview */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time sales, order lifecycle & inventory metrics for <strong>{currentTenant?.name}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-black transition flex items-center space-x-1.5"
          >
            <Package className="w-4 h-4" />
            <span>+ Add Product</span>
          </Link>

          <Link
            to={`/store/${currentSlug}`}
            target="_blank"
            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Alert (if any) */}
      {low_stock_products && low_stock_products.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 p-4 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Low Stock Alert ({low_stock_products.length} products below safety threshold)
            </span>
            <p className="text-amber-800 dark:text-amber-300 mt-0.5">
              Items: {low_stock_products.map(p => `${p.name} (${p.stock_quantity} left)`).join(', ')}
            </p>
          </div>
          <Link to="/admin/products" className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline">
            Manage Stock
          </Link>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(metrics.gross_revenue, 'BDT', currencySymbol)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Paid: {formatCurrency(metrics.net_paid_revenue, 'BDT', currencySymbol)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_orders}
          </div>
          <div className="text-[11px] text-slate-500">
            Avg Order Value: <strong>{formatCurrency(metrics.avg_order_value, 'BDT', currencySymbol)}</strong>
          </div>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Fulfillment</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">
            {metrics.pending_fulfillments}
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting packaging / courier dispatch
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Store Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_products}
          </div>
          <div className="text-[11px] text-slate-500">
            Registered Customers: <strong>{metrics.total_customers}</strong>
          </div>
        </div>
      </div>

      {/* Charts Row: 7 Days Sales Trend + Order Status Pie/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Revenue (Last 7 Days)</h2>
            <span className="text-xs text-slate-400">Daily Breakdown</span>
          </div>

          {/* Custom SVG/Bar Chart */}
          <div className="pt-4 h-48 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-100 dark:border-slate-700 pb-2">
            {charts.daily_sales.map((day, idx) => {
              const heightPercent = Math.max(8, (day.revenue / maxDayRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transition whitespace-nowrap z-20">
                    {formatCurrency(day.revenue, 'BDT', currencySymbol)} ({day.orders} orders)
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[40px] bg-slate-100 dark:bg-slate-700/50 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-sky-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">
                    {day.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Breakdown (1 col) */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Order Status Distribution</h2>

          <div className="space-y-3">
            {charts.status_breakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center justify-center space-x-1"
            >
              <span>Manage All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Selling Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Top Selling Products</h2>
            <Link to="/admin/products" className="text-xs text-sky-600 hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {top_selling_products.length === 0 ? (
              <p className="text-xs text-slate-400">No sales data recorded yet.</p>
            ) : (
              top_selling_products.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover bg-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.units_sold} units sold</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {formatCurrency(item.total_revenue, 'BDT', currencySymbol)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-sky-600 hover:underline">View All</Link>
          </div>

          <div className="space-y-3">
            {recent_orders.length === 0 ? (
              <p className="text-xs text-slate-400">No orders received yet.</p>
            ) : (
              recent_orders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white">#{ord.order_number}</div>
                    <div className="text-[11px] text-slate-500">{ord.customer_name} • {formatDate(ord.created_at)}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(ord.status).bg}`}>
                      {ord.status}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(ord.total_amount, 'BDT', currencySymbol)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
