import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Users,
  CreditCard,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';

export default function AdminSubscriptionPage() {
  const { currentTenant, currentSlug } = useTenant();
  const { isBn } = useLanguage();
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
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
        setMsg(isBn ? 'SaaS প্যাকেজ সফলভাবে আপগ্রেড করা হয়েছে!' : 'SaaS Plan upgraded successfully!');
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
    <div className="space-y-8 animate-fade-in max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Award className="w-6 h-6 text-sky-500" />
            <span>{isBn ? 'SaaS সাবস্ক্রিপশন প্যাকেজ ও রিসোর্স কোটা' : 'SaaS Subscription & Resource Quotas'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isBn
              ? 'বাংলাদেশের ই-কমার্স প্রেক্ষাপটে নির্ধারিত সাশ্রয়ী ও পূর্ণাঙ্গ প্যাকেজসমূহ। নিজস্ব ডোমেন, বিকাশ-নগদ গেটওয়ে এবং কুরিয়ার ইন্টিগ্রেশন।'
              : 'Standard Bangladeshi SaaS plans tailored for online sellers, F-commerce merchants, and large retail brands.'}
          </p>
        </div>

        {/* Monthly / Yearly Billing Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isBn ? 'মাসিক বিলিং' : 'Monthly'}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{isBn ? 'বার্ষিক বিলিং' : 'Yearly'}</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
              {isBn ? '২ মাস ফ্রি' : '2 Mo Free'}
            </span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-semibold">{msg}</span>
        </div>
      )}

      {/* Current Active Plan Status */}
      {currentPlan && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'বর্তমান সক্রিয় প্যাকেজ' : 'CURRENT ACTIVE SUBSCRIPTION'}</span>
              </div>
              <h2 className="text-2xl font-black mt-1">
                {isBn && currentPlan.name_bn ? currentPlan.name_bn : currentPlan.name}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-400">
                {currentPlan.price_monthly === 0 ? (isBn ? 'ফ্রি' : 'Free') : `৳${currentPlan.price_monthly.toLocaleString()}`}
              </span>
              <span className="text-xs text-slate-400 ml-1">{isBn ? '/মাসিক' : '/month'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/70">
              <span className="text-slate-400 block mb-1">{isBn ? 'প্রোডাক্ট কোটা' : 'Product Quota'}</span>
              <span className="font-extrabold text-white text-sm">
                {currentPlan.max_products >= 10000 ? (isBn ? 'আনলিমিটেড' : 'Unlimited') : `${currentPlan.max_products} টি প্রোডাক্ট`}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/70">
              <span className="text-slate-400 block mb-1">{isBn ? 'স্টাফ অ্যাকাউন্ট' : 'Staff Accounts'}</span>
              <span className="font-extrabold text-white text-sm">{currentPlan.max_staff} জন স্টাফ</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/70">
              <span className="text-slate-400 block mb-1">{isBn ? 'কাস্টম ডোমেন' : 'Custom Domain'}</span>
              <span className="font-extrabold text-emerald-400 text-sm">
                {currentPlan.custom_domain_allowed ? (isBn ? 'সাপোর্টেড ✅' : 'Supported ✅') : (isBn ? 'অনুমোদিত নয় ❌' : 'Disabled ❌')}
              </span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/70">
              <span className="text-slate-400 block mb-1">{isBn ? 'প্ল্যাটফর্ম ফি' : 'Platform Fee'}</span>
              <span className="font-extrabold text-sky-400 text-sm">
                {currentPlan.commission_percentage === 0 ? (isBn ? '০% (জিরো ফি)' : '0% (Zero Fee)') : `${currentPlan.commission_percentage}%`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {isBn ? 'সকল প্যাকেজের তালিকা ও তুলনা' : 'Available SaaS Plans & Pricing'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const isCurrent = currentPlan?.id === p.id;
            const price = billingCycle === 'yearly' ? p.price_yearly : p.price_monthly;
            const featuresList = isBn && p.features ? p.features : (p.features_en || p.features);

            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition relative ${
                  isCurrent
                    ? 'bg-sky-50/50 dark:bg-sky-950/40 border-sky-500 shadow-lg ring-2 ring-sky-500'
                    : p.is_popular
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                {p.is_popular && (
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow-sm">
                    {isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {isBn && p.name_bn ? p.name_bn : p.name}
                    </h4>
                    {p.badge && (
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold block mt-0.5">
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {price === 0 ? (isBn ? '৳০' : '$0') : `৳${price.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-slate-500">
                        {billingCycle === 'yearly' ? (isBn ? '/বার্ষিক' : '/yr') : (isBn ? '/মাসিক' : '/mo')}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {featuresList?.map((feat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelectPlan(p.id)}
                    disabled={isCurrent || upgrading}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isCurrent ? (isBn ? 'বর্তমান প্যাকেজ' : 'Current Plan') : (isBn ? 'এই প্যাকেজটি বেছে নিন' : 'Select Tier')}
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
