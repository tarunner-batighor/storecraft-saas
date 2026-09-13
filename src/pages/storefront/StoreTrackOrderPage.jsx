import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function StoreTrackOrderPage() {
  const [searchParams] = useSearchParams();
  const { branding, currentSlug } = useTenant();
  const [orderQuery, setOrderQuery] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOrder = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${query.trim()}`);
      if (res.success && res.order) {
        setOrder(res.order);
      }
    } catch (err) {
      setError(err.message || 'No active order found with this tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderQuery) {
      searchOrder(orderQuery);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchOrder(orderQuery);
  };

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Order received & logged' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Payment/Phone verified' },
    { key: 'processing', label: 'Packaging', desc: 'Packed at warehouse' },
    { key: 'shipped', label: 'In Transit', desc: 'Handed to courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Successfully handed to buyer' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Live Order & Consignment Tracking
        </h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Enter your Order Reference Number (e.g. <code>GV-2026-1001</code>) to track your shipment lifecycle in real-time.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex space-x-2 pt-2">
          <input
            type="text"
            required
            placeholder="e.g. GV-2026-1001"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl uppercase font-mono outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="text-xs text-rose-500 flex items-center justify-center space-x-1.5 pt-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Status Results */}
      {order && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <span className="text-xs text-slate-400">Order Number</span>
                <div className="text-lg font-black text-slate-900 dark:text-white">#{order.order_number}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Current Status</span>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadge(order.status).bg}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier Tracking Details Banner */}
            {order.courier_name && (
              <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    🚚
                  </div>
                  <div>
                    <div className="text-xs font-bold text-sky-950 dark:text-sky-200">
                      Dispatched with {order.courier_name}
                    </div>
                    <div className="text-[11px] text-sky-700 dark:text-sky-300 font-mono">
                      Tracking Code: <strong>{order.courier_tracking_id}</strong>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] bg-sky-200/80 dark:bg-sky-900 text-sky-900 dark:text-sky-200 px-2.5 py-1 rounded-md font-semibold">
                  Express In-Transit
                </span>
              </div>
            )}

            {/* Visual Step Progress */}
            <div className="py-6">
              <div className="relative flex items-center justify-between">
                {/* Horizontal Bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 w-full z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 z-0"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                          isPassed
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 text-center ${
                        isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Timeline History */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Consignment Timeline & Activity Log</span>
              </h3>

              <div className="border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6 pl-4 pt-2">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-800" />
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {event.note}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-2">
                      <span>{formatDate(event.created_at)}</span>
                      {event.created_by && <span>• by {event.created_by}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
