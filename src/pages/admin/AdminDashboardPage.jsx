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
      <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
        ড্যাশবোর্ড ডাটা লোড হচ্ছে...
      </div>
    );
  }

  const { metrics, charts, top_selling_products, low_stock_products, recent_orders } = data;
  const currencySymbol = branding?.currency_symbol || '৳';

  const maxDayRevenue = Math.max(...charts.daily_sales.map(d => d.revenue), 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <span>স্টোর ম্যানেজমেন্ট ড্যাশবোর্ড</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              লাইভ শপ
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentTenant?.name}-এর আজকের বিক্রয়, স্টক ও অর্ডারের সার্বিক চিত্র।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/store/${currentSlug}`}
            target="_blank"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
          >
            <span>কাস্টমার ভিউ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner (if any) */}
      {low_stock_products && low_stock_products.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">স্টক সতর্কতা (Low Stock Alert): </span>
              <span className="text-amber-800 dark:text-amber-300">
                {low_stock_products.length}টি পণ্যের স্টক শেষ হওয়ার পথে। দ্রুত স্টক আপডেট করুন।
              </span>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            স্টক দেখুন →
          </Link>
        </div>
      )}

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>মোট বিক্রয় (Gross Sales)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(metrics.gross_revenue, 'BDT', currencySymbol)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>আদায়কৃত: {formatCurrency(metrics.net_paid_revenue, 'BDT', currencySymbol)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>মোট অর্ডার সংখ্যা</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_orders} টি
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
            গড় অর্ডার মূল্য: {formatCurrency(metrics.avg_order_value, 'BDT', currencySymbol)}
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>ডেলিভারি অপেক্ষমান</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.pending_fulfillments} টি
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            কুরিয়ারে বুকিং দেওয়া প্রয়োজন
          </div>
        </div>

        {/* Total Products in Catalog */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>মোট পণ্য / বই</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_products} টি
          </div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            নিবন্ধিত কাস্টমার: {metrics.total_customers} জন
          </div>
        </div>
      </div>

      {/* Middle Grid: 7-Days Visual Sales Chart & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">গত ৭ দিনের বিক্রয় পরিসংখ্যান</h2>
              <p className="text-[11px] text-slate-400">প্রতিদিনের অর্ডারের মোট টাকার হিসাব</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              রিয়েলটাইম গ্রাফ
            </span>
          </div>

          <div className="h-56 flex items-end gap-2 sm:gap-4 pt-6 pb-2">
            {charts.daily_sales.map((day, idx) => {
              const heightPercent = Math.max(8, (day.revenue / maxDayRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none transition whitespace-nowrap z-20">
                    {formatCurrency(day.revenue, 'BDT', currencySymbol)} ({day.orders} অর্ডার)
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
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">অর্ডারের স্ট্যাটাস অনুপাত</h2>

          <div className="space-y-3">
            {charts.status_breakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.count} টি</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center justify-center space-x-1"
            >
              <span>সব অর্ডার পরিচালনা করুন</span>
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
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">সর্বাধিক বিক্রিত পণ্যসমূহ</h2>
            <Link to="/admin/products" className="text-xs text-sky-600 hover:underline">সবগুলো দেখুন</Link>
          </div>

          <div className="space-y-3">
            {top_selling_products.length === 0 ? (
              <p className="text-xs text-slate-400">এখনও কোনো বিক্রয় রেকর্ড তৈরি হয়নি।</p>
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
                      <div className="text-[10px] text-slate-400">{item.units_sold} পিস বিক্রি হয়েছে</div>
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
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">সাম্প্রতিক অর্ডারসমূহ</h2>
            <Link to="/admin/orders" className="text-xs text-sky-600 hover:underline">সবগুলো দেখুন</Link>
          </div>

          <div className="space-y-3">
            {recent_orders.length === 0 ? (
              <p className="text-xs text-slate-400">কোনো অর্ডার পাওয়া যায়নি।</p>
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
