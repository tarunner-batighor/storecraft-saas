import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Eye,
  Copy,
  Check,
  Share2,
  Globe,
  Percent,
  Wallet
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { isBn } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/store/${currentSlug}`
    : `https://storecraft-saas.onrender.com/store/${currentSlug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
        {isBn ? 'ড্যাশবোর্ড ডাটা লোড হচ্ছে...' : 'Loading dashboard metrics...'}
      </div>
    );
  }

  const { metrics, charts, top_selling_products, low_stock_products, recent_orders } = data;
  const currencySymbol = branding?.currency_symbol || '৳';
  const primaryColor = branding?.primary_color || '#0284c7';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <span>{isBn ? 'স্টোর ম্যানেজমেন্ট ড্যাশবোর্ড' : 'Store Management Dashboard'}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {isBn ? 'লাইভ শপ' : 'Live Store'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentTenant?.name} — {isBn ? 'আজকের বিক্রয়, স্টক, কমিশন ও অর্ডারের সার্বিক চিত্র।' : 'Real-time sales, stock & order intelligence.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/store/${currentSlug}`}
            target="_blank"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <span>{isBn ? 'কাস্টমার ভিউ দেখুন' : 'View Customer Store'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Prominent Free Store Link Card (ডোমেন কেনা ছাড়া ফ্রি ওয়েব লিংক) */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-sky-700/50 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-sky-400 animate-pulse" />
            <h2 className="text-sm font-black text-white">
              {isBn ? 'আপনার ফ্রি অনলাইন স্টোর লিংক (কাস্টমারদের সাথে শেয়ার করুন)' : 'Your Free Online Storefront Link (Share with Customers)'}
            </h2>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
            {isBn ? 'ডোমেন কেনা ছাড়াই লাইভ ও ফ্রি' : '100% Free - No Domain Required'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {isBn
            ? 'এই লিংকটি সরাসরি আপনার ফেসবুক পেজ, টিকটক, ইনস্টাগ্রাম বা হোয়াটসঅ্যাপে শেয়ার করুন। কাস্টমাররা লিংকে ঢুকে আপনার প্রোডাক্ট দেখতে ও অর্ডার করতে পারবেন।'
            : 'Share this link with your customers on WhatsApp, Facebook or Instagram. Customers can browse and purchase directly without requiring a custom domain.'}
        </p>

        {/* Link Bar + Copy Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
          <div className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-sky-300 select-all truncate">
            {storeUrl}
          </div>

          <button
            onClick={handleCopyLink}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer shrink-0 ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-black'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? 'কপি হয়েছে! ✅' : 'Copied! ✅'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isBn ? 'লিংক কপি করুন' : 'Copy Store Link'}</span>
              </>
            )}
          </button>

          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center justify-center space-x-1 shrink-0"
          >
            <span>{isBn ? 'ভিজিট করুন' : 'Visit Store'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Low Stock Warning Banner (if any) */}
      {low_stock_products && low_stock_products.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                {isBn ? 'স্টক সতর্কতা (Low Stock Alert): ' : 'Low Stock Warning: '}
              </span>
              <span className="text-amber-800 dark:text-amber-300">
                {isBn
                  ? `${low_stock_products.length}টি পণ্যের স্টক শেষ হওয়ার পথে। দ্রুত স্টক আপডেট করুন।`
                  : `${low_stock_products.length} products running low on inventory.`}
              </span>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline shrink-0"
          >
            {isBn ? 'স্টক দেখুন →' : 'View Stock →'}
          </Link>
        </div>
      )}

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? 'মোট বিক্রয় (Gross Sales)' : 'Total Gross Sales'}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {formatCurrency(metrics.gross_revenue, 'BDT', currencySymbol)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{isBn ? 'আদায়কৃত:' : 'Paid:'} {formatCurrency(metrics.net_paid_revenue, 'BDT', currencySymbol)}</span>
          </div>
        </div>

        {/* Platform Commission & Net Revenue */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? 'নিট আয় (Net Payout)' : 'Net Store Revenue'}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {formatCurrency(metrics.net_store_revenue || metrics.gross_revenue, 'BDT', currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span>{isBn ? 'প্ল্যাটফর্ম ফি:' : 'Fee:'} {formatCurrency(metrics.platform_commission || 0, 'BDT', currencySymbol)}</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded font-bold">
              {metrics.commission_rate || 0}%
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? 'মোট অর্ডার সংখ্যা' : 'Total Orders'}</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_orders} {isBn ? 'টি' : 'Orders'}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center space-x-1">
            <Truck className="w-3 h-3" />
            <span>{metrics.pending_fulfillments} {isBn ? 'টি পেন্ডিং ডেলিভারি' : 'Pending Fulfillments'}</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{isBn ? 'মোট সক্রিয় পণ্য' : 'Active Products'}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.total_products} {isBn ? 'টি' : 'Products'}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{metrics.total_customers} {isBn ? 'জন নিবন্ধিত গ্রাহক' : 'Customers'}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isBn ? 'সাম্প্রতিক অর্ডারসমূহ (Recent Orders)' : 'Recent Orders'}
            </h2>
            <Link to="/admin/orders" className="text-xs font-bold text-sky-600 hover:underline">
              {isBn ? 'সবগুলো দেখুন →' : 'View All →'}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 text-[10px] uppercase">
                  <th className="py-2">{isBn ? 'অর্ডার নম্বর' : 'Order #'}</th>
                  <th className="py-2">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                  <th className="py-2">{isBn ? 'মোট টাকা' : 'Total'}</th>
                  <th className="py-2">{isBn ? 'পেমেন্ট' : 'Payment'}</th>
                  <th className="py-2">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent_orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                      {isBn ? 'এখনো কোনো অর্ডার আসেনি' : 'No orders yet'}
                    </td>
                  </tr>
                ) : (
                  recent_orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 font-bold text-sky-600">
                        <Link to={`/admin/orders`}>#{ord.order_number}</Link>
                      </td>
                      <td className="py-3 text-slate-800 dark:text-slate-200">{ord.customer_name}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(ord.total_amount, 'BDT', currencySymbol)}
                      </td>
                      <td className="py-3 capitalize text-[11px]">{ord.payment_method}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status).bg}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Help & Platform bKash info */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isBn ? 'দ্রুত অ্যাকশন ও সাপোর্ট' : 'Quick Actions & Support'}
            </h3>

            <div className="space-y-2 text-xs">
              <Link
                to="/admin/products"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 transition"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? '+ নতুন পণ্য যোগ করুন' : '+ Add New Product'}</span>
                <Package className="w-4 h-4 text-sky-500" />
              </Link>

              <Link
                to="/admin/branding"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 transition"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? '🎨 লোগো ও থিম কালার' : '🎨 Logo & Theme Colors'}</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </Link>

              <Link
                to="/admin/payments"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200 dark:border-slate-700 transition"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? '💳 বিকাশ ও নগদ সেটিংস' : '💳 bKash & Nagad Setup'}</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </Link>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-[11px] text-sky-900 dark:text-sky-300">
            <strong>{isBn ? 'সহায়তা ও বিলিং নম্বর:' : 'Support & Billing:'}</strong>
            <p className="mt-0.5">বিকাশ/নগদ পার্সোনাল: <strong className="font-mono">01766299775</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
