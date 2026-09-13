import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import {
  Award,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Globe,
  Package,
  Users
} from 'lucide-react';

export default function AdminSubscriptionPage() {
  const { currentTenant, currentSlug } = useTenant();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchPlanData = async () => {
      setLoading(true);
      try {
        const [settingsRes, plansRes] = await Promise.all([
          api.get('/tenant/settings'),
          api.get('/public/plans')
        ]);
        if (settingsRes.success) setCurrentPlan(settingsRes.plan);
        if (plansRes.success) setPlans(plansRes.plans || []);
      } catch (err) {}
      finally {
        setLoading(false);
      }
    };
    fetchPlanData();
  }, [currentSlug]);

  const handleSelectPlan = async (planId) => {
    setUpgrading(true);
    setMsg('');
    try {
      const res = await api.put(`/platform/tenants/${currentTenant.id}`, { plan_id: planId });
      if (res.success) {
        setMsg('SaaS Plan upgraded successfully!');
        const updated = plans.find(p => p.id === planId);
        setCurrentPlan(updated);
      }
    } catch (err) {
      setMsg(err.message || 'Upgrade failed');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Award className="w-6 h-6 text-sky-500" />
          <span>SaaS Subscription & Resource Quotas</span>
        </h1>
        <p className="text-xs text-slate-500">
          Manage your StoreCraft SaaS subscription tier, feature entitlements, product limits, and custom domain access.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      {/* Current Active Plan Status */}
      {currentPlan && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CURRENT ACTIVE SUBSCRIPTION</span>
              </div>
              <h2 className="text-2xl font-black mt-1">{currentPlan.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400">${currentPlan.price_monthly}</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Product Quota</span>
              <span className="font-bold text-white text-sm">{currentPlan.max_products} Products</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Staff Accounts</span>
              <span className="font-bold text-white text-sm">{currentPlan.max_staff} Staff Members</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Custom Domain</span>
              <span className="font-bold text-white text-sm">{currentPlan.custom_domain_allowed ? 'Supported ✅' : 'Disabled ❌'}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Platform Fee</span>
              <span className="font-bold text-white text-sm">{currentPlan.commission_percentage}% / order</span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Available SaaS Plans
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = currentPlan?.id === p.id;
            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition relative ${
                  isCurrent
                    ? 'bg-sky-50/50 dark:bg-sky-950/40 border-sky-500 shadow-lg ring-2 ring-sky-500'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                {p.is_popular && (
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{p.name}</h4>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">${p.price_monthly}</span>
                      <span className="text-xs text-slate-500">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-700">
                    {p.features?.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={isCurrent || upgrading}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      isCurrent
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-black text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Tier'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
