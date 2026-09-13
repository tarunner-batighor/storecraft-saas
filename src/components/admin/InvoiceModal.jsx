import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

export default function InvoiceModal({ order, tenant, onClose }) {
  const currencySymbol = tenant?.branding?.currency_symbol || '৳';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-slide-up my-6">
        {/* Action Header Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Invoice Preview: #{order.order_number}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          {/* Top Store Info & Invoice Title */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                {tenant?.branding?.logo ? (
                  <img src={tenant.branding.logo} alt={tenant.name} className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">
                    {tenant?.name?.slice(0, 1)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-black tracking-tight">{tenant?.name}</h1>
                  <p className="text-[11px] text-slate-500">{tenant?.branding?.tagline}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 max-w-xs">{tenant?.branding?.address}</p>
              <p className="text-xs text-slate-600">
                Phone: {tenant?.branding?.contact_phone} • Email: {tenant?.branding?.contact_email}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xl font-black text-slate-900 tracking-wider">TAX INVOICE</span>
              <div className="font-mono text-xs font-bold text-slate-800">#{order.order_number}</div>
              <div className="text-xs text-slate-500">Date: {formatDate(order.created_at)}</div>
              <div className="pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Payment: {order.payment_status?.toUpperCase()} ({order.payment_method?.toUpperCase()})
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[10px] uppercase text-slate-400">Billed & Shipped To:</span>
              <div className="font-bold text-slate-900 text-sm">{order.customer_name}</div>
              <div className="text-slate-600">{order.customer_phone}</div>
              <div className="text-slate-600">{order.customer_email || 'No email provided'}</div>
              <div className="text-slate-700 pt-1 font-medium">
                {order.shipping_address?.street_address}, {order.shipping_address?.area}, {order.shipping_address?.city}
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[10px] uppercase text-slate-400">Fulfillment & Courier:</span>
              <div className="font-bold text-slate-900">{order.courier_name || 'In-House Delivery'}</div>
              {order.courier_tracking_id && (
                <div className="font-mono text-xs text-slate-700">
                  Tracking Code: <strong>{order.courier_tracking_id}</strong>
                </div>
              )}
              <div className="text-slate-600">Order Status: <strong className="capitalize">{order.status}</strong></div>
              {order.payment_trx_id && (
                <div className="text-slate-600 font-mono text-[11px]">TRX ID: {order.payment_trx_id}</div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3 font-mono text-slate-500 text-[11px]">{item.sku || 'N/A'}</td>
                    <td className="py-3 text-right text-slate-700">{formatCurrency(item.price, 'BDT', currencySymbol)}</td>
                    <td className="py-3 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      {formatCurrency(item.total || (item.price * item.quantity), 'BDT', currencySymbol)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="border-t-2 border-slate-900 pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatCurrency(order.subtotal, 'BDT', currencySymbol)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({order.coupon_code || 'Promo'}):</span>
                  <span className="font-bold">-{formatCurrency(order.discount_amount, 'BDT', currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span className="font-bold text-slate-900">
                  {order.shipping_cost === 0 ? 'FREE' : formatCurrency(order.shipping_cost, 'BDT', currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black border-t border-slate-300 pt-2 text-slate-900">
                <span>Grand Total:</span>
                <span>{formatCurrency(order.total_amount, 'BDT', currencySymbol)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Footer */}
          <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-500 flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-700">Thank you for your business!</p>
              <p>All items covered under 7-day warranty from delivery date.</p>
            </div>
            <div className="text-right font-mono">
              Authorized Digital Receipt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
