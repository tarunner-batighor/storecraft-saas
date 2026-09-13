import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Package,
  Layers,
  Sparkles,
  Percent,
  Wallet
} from 'lucide-react';

export default function AdminReportsPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { isBn } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.success) setData(res);
      } catch (err) {}
      finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSlug]);

  const handleExportCSV = () => {
    const slug = currentSlug;
    window.open(`/api/analytics/export-csv?store=${slug}`, '_blank');
  };

  const currencySymbol = branding?.currency_symbol || '৳';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-sky-500" />
            <span>{isBn ? 'সেলস রিপোর্ট, কমিশন ও আয়-ব্যয় হিসেব' : 'Sales Analytics & Financial Reports'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isBn
              ? 'মোট বিক্রয়, প্ল্যাটফর্ম কমিশন হার, নিট আয় এবং ১-ক্লিকে সিএসভি (CSV) এক্সেল ডাউনলোড।'
              : 'Comprehensive revenue breakdowns, platform commission rate, and 1-click accounting CSV export.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{isBn ? 'সব অর্ডার এক্সেল (CSV) ডাউনলোড' : 'Export All Orders (CSV)'}</span>
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">{isBn ? 'মোট বিক্রয় (Gross)' : 'Total Gross Sales'}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(data.metrics.gross_revenue, 'BDT', currencySymbol)}
              </div>
              <span className="text-[10px] text-slate-400">{data.metrics.total_orders} {isBn ? 'টি অর্ডার' : 'orders'}</span>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase">{isBn ? 'প্ল্যাটফর্ম ফি/কমিশন' : 'Platform Fee'}</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                  {data.metrics.commission_rate}%
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {formatCurrency(data.metrics.platform_commission, 'BDT', currencySymbol)}
              </div>
              <span className="text-[10px] text-slate-400">{isBn ? 'প্যাকেজ অনুযায়ী কর্তন' : 'Plan based deduction'}</span>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">{isBn ? 'নিট আয় (Net Payout)' : 'Net Store Revenue'}</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(data.metrics.net_store_revenue, 'BDT', currencySymbol)}
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold">{isBn ? 'দোকানদারের আসল পাওনা' : 'After platform fee'}</span>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">{isBn ? 'গড় অর্ডার সাইজ (AOV)' : 'Avg Order Value'}</span>
              <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
                {formatCurrency(data.metrics.avg_order_value, 'BDT', currencySymbol)}
              </div>
              <span className="text-[10px] text-slate-400">{isBn ? 'প্রতি অর্ডারের গড় মূল্য' : 'Per order average'}</span>
            </div>
          </div>

          {/* Daily Trend Table */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isBn ? 'দৈনিক বিক্রয় খতিয়ান (গত ৭ দিন)' : 'Daily Revenue Ledger (Last 7 Days)'}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5">{isBn ? 'তারিখ ও দিন' : 'Date & Day'}</th>
                    <th className="py-2.5">{isBn ? 'অর্ডার সংখ্যা' : 'Orders'}</th>
                    <th className="py-2.5 text-right">{isBn ? 'মোট বিক্রয়' : 'Revenue'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.charts.daily_sales.map((day) => (
                    <tr key={day.date} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{day.label}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">{day.orders} {isBn ? 'টি' : 'orders'}</td>
                      <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                        {formatCurrency(day.revenue, 'BDT', currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
