import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import {
  Tags,
  Plus,
  Trash2,
  Tag,
  Check,
  Percent,
  DollarSign,
  Truck,
  X
} from 'lucide-react';

export default function AdminCouponsPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    min_order_amount: 1000,
    max_discount: 1000,
    usage_limit: 100
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
      }
    } catch (err) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentSlug]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.post('/coupons', formData);
      if (res.success) {
        setShowModal(false);
        setFormData({ code: '', type: 'percentage', value: 10, min_order_amount: 1000, max_discount: 1000, usage_limit: 100 });
        fetchCoupons();
      }
    } catch (err) {
      setError(err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.del(`/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const currencySymbol = branding?.currency_symbol || '৳';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Tags className="w-6 h-6 text-sky-500" />
            <span>Discount Coupons & Flash Deals</span>
          </h1>
          <p className="text-xs text-slate-500">
            Create promotional coupon codes with percentage or flat discounts and usage counters.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px]">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Value</th>
              <th className="p-4">Min Spend</th>
              <th className="p-4">Usage Counter</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading coupons...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">No active coupons created yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                  <td className="p-4">
                    <div className="font-mono font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-sky-500" />
                      <span>{c.code}</span>
                    </div>
                  </td>

                  <td className="p-4 font-bold text-emerald-600">
                    {c.type === 'percentage' ? `${c.value}% OFF` : c.type === 'fixed' ? `${formatCurrency(c.value, 'BDT', currencySymbol)} FLAT` : 'FREE SHIPPING'}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold">
                    {c.min_order_amount ? formatCurrency(c.min_order_amount, 'BDT', currencySymbol) : 'No minimum'}
                  </td>

                  <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                    {c.usage_count || 0} / {c.usage_limit || '∞'} used
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create New Discount Coupon</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25, EID500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Order Amount (৳)</label>
                  <input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-black"
                >
                  {saving ? 'Creating...' : 'Publish Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
