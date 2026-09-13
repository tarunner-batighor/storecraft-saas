import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  CheckCircle,
  Truck,
  Package,
  Printer,
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

export default function StoreOrderSuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { currentTenant, branding, currentSlug } = useTenant();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/track/${orderNumber}`);
          if (res.success && res.order) {
            setOrder(res.order);
          }
        } catch (err) {}
        finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderNumber, order]);

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Thank You! Your Order is Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            We have received your order and our fulfillment team has started preparing your package.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">Order Reference:</span>
          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
            #{order?.order_number || orderNumber}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to={`/store/${currentSlug}/track?order=${order?.order_number || orderNumber}`}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
            style={{ backgroundColor: primaryColor }}
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery Status</span>
          </Link>

          <Link
            to={`/store/${currentSlug}/catalog`}
            className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Itemized Summary Card */}
      {order && (
        <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Package className="w-4 h-4 text-sky-500" />
            <span>Ordered Items</span>
          </h3>

          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
                    <span className="text-slate-400 text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.total || (item.price * item.quantity), 'BDT', currencySymbol)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
            <span>Total Paid / Due:</span>
            <span>{formatCurrency(order.total_amount, 'BDT', currencySymbol)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
