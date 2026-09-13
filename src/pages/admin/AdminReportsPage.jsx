import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
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
  Sparkles
} from 'lucide-react';

export default function AdminReportsPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
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
    const token = localStorage.getItem('storecraft_token');
    const slug = currentSlug;
    window.open(`/api/analytics/export-csv?store=${slug}`, '_blank');
  };

  const currencySymbol = branding?.currency_symbol || '৳';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-sky-500" />
            <span>Sales Analytics & Business Intelligence</span>
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive revenue breakdowns, transaction logs, and 1-click accounting CSV export.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All Orders (CSV)</span>
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Gross Volume</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {formatCurrency(data.metrics.gross_revenue, 'BDT', currencySymbol)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">Verified Paid Volume</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(data.metrics.net_paid_revenue, 'BDT', currencySymbol)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoiced Orders</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {data.metrics.total_orders} Orders
              </div>
            </div>
          </div>

          {/* Daily Trend Table */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Daily Revenue Ledger (Last 7 Days)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5">Date & Day</th>
                    <th className="py-2.5">Orders Processed</th>
                    <th className="py-2.5 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.charts.daily_sales.map((day) => (
                    <tr key={day.date} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{day.label}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">{day.orders} orders</td>
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
