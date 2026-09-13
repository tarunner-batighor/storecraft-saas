import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Server,
  Zap,
  Info
} from 'lucide-react';

export default function AdminCustomDomainPage() {
  const { currentTenant, currentSlug, refreshTenant } = useTenant();
  const [domain, setDomain] = useState(currentTenant?.custom_domain || '');
  const [loading, setLoading] = useState(false);
  const [dnsStatus, setDnsStatus] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentTenant) {
      setDomain(currentTenant.custom_domain || '');
    }
  }, [currentTenant]);

  const handleSaveDomain = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const res = await api.put('/tenant/domain', { custom_domain: domain });
      if (res.success) {
        setMsg(res.message || 'কাস্টম ডোমেন সফলভাবে যুক্ত হয়েছে!');
        setDnsStatus(res.dns_instructions);
        refreshTenant();
      }
    } catch (err) {
      setError(err.message || 'ডোমেন আপডেট ব্যর্থ হয়েছে। আপনার প্ল্যান চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('কপি করা হয়েছে: ' + text);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Globe className="w-6 h-6 text-sky-500" />
          <span>কাস্টম ডোমেন ও DNS সংযোগ</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          আপনার কেনা নিজস্ব ডোমেন (যেমন: <code>sarwarbooks.com</code> বা <code>yourbrand.com.bd</code>) দোকানের সাথে যুক্ত করুন।
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <form onSubmit={handleSaveDomain} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              আপনার কেনা ডোমেনের নাম (Custom Domain Name)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="যেমন: sarwarbooks.com বা shop.mybrand.bd"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{loading ? 'সংরক্ষণ হচ্ছে...' : 'ডোমেন সেভ ও কানেক্ট করুন'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              সামনে <code>https://</code> লিখবেন না, শুধু মূল ডোমেন বা সাবডোমেনের নাম লিখুন।
            </p>
          </div>
        </form>

        {/* Current Active Domain Status */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {currentTenant?.custom_domain ? (
                  <span className="text-emerald-500">সংযুক্ত ডোমেন: {currentTenant.custom_domain}</span>
                ) : (
                  <span>ডিফল্ট সাবডোমেন: {currentSlug}.storecraft.io</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">
                SSL সার্টিফিকেট: <strong className="text-emerald-500">স্বয়ংক্রিয় সক্রিয় (Let's Encrypt HTTPS)</strong>
              </div>
            </div>
          </div>
          {currentTenant?.custom_domain && (
            <a
              href={`https://${currentTenant.custom_domain}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 flex items-center space-x-1.5 shadow-sm hover:bg-slate-100"
            >
              <span>ডোমেন ভিজিট করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* DNS Configuration Instructions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-sky-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            কীভাবে আপনার ডোমেন প্রোভাইডারে DNS রেকর্ড বসাবেন (DNS Guide)
          </h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          যে কোম্পানি থেকে আপনি ডোমেন কিনেছেন (যেমন: Namecheap, GoDaddy, Cloudflare, Dianahost বা ExonHost) তাদের <strong>DNS Management</strong> সেকশনে গিয়ে নিচের রেকর্ডটি বসিয়ে দিন:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">রেকর্ড টাইপ (Type)</th>
                <th className="p-3">হোস্ট / নাম (Name)</th>
                <th className="p-3">পয়েন্ট করবে (Value / Target)</th>
                <th className="p-3">TTL</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              <tr>
                <td className="p-3 font-bold text-sky-500">CNAME</td>
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">@ (অথবা www)</td>
                <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                  storecraft-saas.onrender.com
                </td>
                <td className="p-3 text-slate-500">Automatic / 3600</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => copyToClipboard('storecraft-saas.onrender.com')}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>কপি</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3 text-xs text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            DNS রেকর্ড বসানোর পর সারা বিশ্বে ছড়াতে (DNS Propagation) সাধারণত <strong>১৫ থেকে ৩০ মিনিট</strong> সময় লাগে। রেকর্ড বসার সাথে সাথে আপনার ডোমেনে সিকিউর SSL গ্রিন-লক চালু হয়ে যাবে।
          </span>
        </div>
      </div>
    </div>
  );
}
