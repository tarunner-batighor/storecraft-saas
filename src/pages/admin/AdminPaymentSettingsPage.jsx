import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import {
  CreditCard,
  Banknote,
  Smartphone,
  Save,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AdminPaymentSettingsPage() {
  const { currentTenant, refreshTenant } = useTenant();

  const [codEnabled, setCodEnabled] = useState(true);
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [bkashType, setBkashType] = useState('Merchant');
  const [bkashNumber, setBkashNumber] = useState('01711223344');
  const [bkashInstructions, setBkashInstructions] = useState('');
  const [nagadEnabled, setNagadEnabled] = useState(true);
  const [nagadNumber, setNagadNumber] = useState('01822334455');
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [stripeKey, setStripeKey] = useState('pk_test_gadgetvibe_live');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/tenant/settings');
        if (res.success && res.tenant?.payment_settings) {
          const ps = res.tenant.payment_settings;
          setCodEnabled(ps.cod_enabled ?? true);
          setBkashEnabled(ps.bkash_enabled ?? true);
          setBkashType(ps.bkash_type || 'Merchant');
          setBkashNumber(ps.bkash_number || '');
          setBkashInstructions(ps.bkash_instructions || '');
          setNagadEnabled(ps.nagad_enabled ?? false);
          setNagadNumber(ps.nagad_number || '');
          setStripeEnabled(ps.stripe_enabled ?? false);
          setStripeKey(ps.stripe_public_key || '');
        }
      } catch (err) {}
    };
    fetchSettings();
  }, [currentTenant]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put('/tenant/payments', {
        payment_settings: {
          cod_enabled: codEnabled,
          bkash_enabled: bkashEnabled,
          bkash_type: bkashType,
          bkash_number: bkashNumber,
          bkash_instructions: bkashInstructions,
          nagad_enabled: nagadEnabled,
          nagad_number: nagadNumber,
          stripe_enabled: stripeEnabled,
          stripe_public_key: stripeKey
        }
      });
      if (res.success) {
        setMsg('Payment methods and gateway configuration saved!');
        refreshTenant();
      }
    } catch (err) {
      setMsg(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <CreditCard className="w-6 h-6 text-sky-500" />
          <span>Payment Gateways & Methods</span>
        </h1>
        <p className="text-xs text-slate-500">
          Configure Cash on Delivery, bKash Merchant API / Manual, Nagad, and Stripe Cards for customer checkout.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Cash on Delivery (COD) */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</h3>
                <p className="text-[11px] text-slate-500">Customer pays when parcel is delivered</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* 2. bKash Gateway */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/50 text-pink-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">bKash Mobile Financial Service</h3>
                <p className="text-[11px] text-slate-500">Supports Merchant Checkout & Manual Transaction ID Verification</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          {bkashEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">bKash Account Type</label>
                <select
                  value={bkashType}
                  onChange={(e) => setBkashType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                >
                  <option value="Merchant">Merchant Account (Payment API)</option>
                  <option value="Personal">Personal Account (Send Money)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">bKash Number</label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Instructions</label>
                <input
                  type="text"
                  value={bkashInstructions}
                  onChange={(e) => setBkashInstructions(e.target.value)}
                  placeholder="e.g. Please pay via bKash App Merchant option to counter #1 and enter TRX ID"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Cards / Stripe */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Credit & Debit Cards (Visa / Mastercard)</h3>
                <p className="text-[11px] text-slate-500">Automated card payment processing</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stripeEnabled}
                onChange={(e) => setStripeEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Payment Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
