import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import CourierModal from '../../components/admin/CourierModal';
import InvoiceModal from '../../components/admin/InvoiceModal';
import {
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Printer,
  ChevronDown,
  CheckCircle,
  Clock,
  ExternalLink,
  PackageCheck
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [courierOrder, setCourierOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentSlug]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${newStatus.toUpperCase()} by Store Staff`
      });
      if (res.success && res.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNum = o.order_number?.toLowerCase().includes(q);
      const matchCust = o.customer_name?.toLowerCase().includes(q);
      const matchPhone = o.customer_phone?.includes(q);
      if (!matchNum && !matchCust && !matchPhone) return false;
    }
    return true;
  });

  const currencySymbol = branding?.currency_symbol || '৳';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-sky-500" />
            <span>Orders & Fulfillment Management</span>
          </h1>
          <p className="text-xs text-slate-500">
            Track, process and dispatch customer orders with automated courier sync
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-sky-600 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'all' ? `(${orders.length})` : `(${orders.filter(o => o.status === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by order # or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer & Location</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4">Courier Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">No orders found matching criteria.</td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                    {/* Order Ref & Date */}
                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">#{ord.order_number}</div>
                      <div className="text-[10px] text-slate-400">{formatDate(ord.created_at)}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">{ord.customer_name}</div>
                      <div className="text-[11px] text-slate-500">{ord.customer_phone}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {ord.shipping_address?.area || ''}, {ord.shipping_address?.city || 'Dhaka'}
                      </div>
                    </td>

                    {/* Items & Total */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(ord.total_amount, 'BDT', currencySymbol)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ord.items?.length || 0} items ({ord.items?.map(i => i.name).slice(0, 1).join('')}...)
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(ord.payment_status).bg}`}>
                          {ord.payment_status}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          via {ord.payment_method}
                        </span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase py-1 px-2.5 rounded-lg border outline-none cursor-pointer ${getStatusBadge(ord.status).bg}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Courier Details & Book Action */}
                    <td className="p-4">
                      {ord.courier_name ? (
                        <div>
                          <div className="font-semibold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{ord.courier_name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{ord.courier_tracking_id}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCourierOrder(ord)}
                          className="px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-[11px] font-bold hover:bg-sky-100 flex items-center space-x-1"
                        >
                          <Truck className="w-3 h-3" />
                          <span>Dispatch Courier</span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setInvoiceOrder(ord)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 transition flex items-center space-x-1 ml-auto"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Booking Modal */}
      {courierOrder && (
        <CourierModal
          order={courierOrder}
          onClose={() => setCourierOrder(null)}
          onSuccess={(updatedOrder) => {
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          }}
        />
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          tenant={currentTenant}
          onClose={() => setInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
