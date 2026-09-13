import React, { useState } from 'react';
import { api } from '../../utils/api';
import { X, Truck, Check, Loader2, Package, Sparkles } from 'lucide-react';

export default function CourierModal({ order, onClose, onSuccess }) {
  const [courierName, setCourierName] = useState('Pathao Courier');
  const [weightKg, setWeightKg] = useState(1);
  const [instruction, setInstruction] = useState('Handle with care - Fragile tech/fashion goods');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedResult, setBookedResult] = useState(null);

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/orders/${order.id}/courier-book`, {
        courier_name: courierName,
        recipient_city: order.shipping_address?.city || 'Dhaka',
        weight_kg: Number(weightKg),
        special_instruction: instruction
      });
      if (res.success && res.consignment) {
        setBookedResult(res.consignment);
        if (onSuccess) onSuccess(res.consignment.order);
      }
    } catch (err) {
      setError(err.message || 'Courier booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Courier Dispatch Integration</span>
          </div>
          <h2 className="text-xl font-bold">Book Courier Consignment</h2>
          <p className="text-xs text-sky-100 mt-1">
            Order #{order.order_number} • Customer: {order.customer_name} ({order.shipping_address?.city || 'Dhaka'})
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {bookedResult ? (
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consignment Dispatched!</h3>
                <p className="text-xs text-slate-500">The courier consignment has been booked and parcel tracking is active.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Courier Provider:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bookedResult.courier_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Number:</span>
                  <span className="font-mono font-black text-sky-600 dark:text-sky-400">{bookedResult.tracking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consignment ID:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{bookedResult.consignment_id}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{error}</div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Courier Service
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Pathao Courier', 'Steadfast Courier', 'RedX Logistics'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setCourierName(name)}
                      className={`p-3 rounded-xl border text-left text-xs transition ${
                        courierName === name
                          ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-slate-900 dark:text-white font-bold ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Parcel Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery City</label>
                  <input
                    type="text"
                    readOnly
                    value={order.shipping_address?.city || 'Dhaka'}
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Courier Instruction</label>
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting with Courier API...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Generate Consignment & Print Dispatch Label</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
