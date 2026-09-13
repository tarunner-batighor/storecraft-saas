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
  Server
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
        setMsg(res.message);
        setDnsStatus(res.dns_instructions);
        refreshTenant();
      }
    } catch (err) {
      setError(err.message || 'Failed to update custom domain');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard: ' + text);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Globe className="w-6 h-6 text-sky-500" />
          <span>Custom Domain & DNS Setup</span>
        </h1>
        <p className="text-xs text-slate-500">
          Connect your own branded domain (e.g. <code>mystore.com</code>) to your online store with automated SSL provisioning.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Domain Input Card */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3">
          1. Configure Your Domain
        </h2>

        <form onSubmit={handleSaveDomain} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Domain Name
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. gadgetvibe.com or shop.fashionhub.bd"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-black transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Save & Verify Domain'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Standard SaaS Subdomain: <code className="text-slate-700 dark:text-slate-300 font-bold">{currentSlug}.storecraft.io</code>
            </p>
          </div>
        </form>
      </div>

      {/* DNS Configuration Instructions */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-500" />
            <span>2. DNS Records Required at Your Registrar (Namecheap, Cloudflare, GoDaddy)</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px]">
                <th className="py-2">Type</th>
                <th className="py-2">Host / Name</th>
                <th className="py-2">Points To / Value</th>
                <th className="py-2">SSL Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              <tr>
                <td className="py-3 font-mono font-bold text-sky-600">CNAME</td>
                <td className="py-3 font-mono">@ or www</td>
                <td className="py-3 font-mono font-semibold">cname.storecraft.io</td>
                <td className="py-3">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Auto SSL Provisioned</span>
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => copyToClipboard('cname.storecraft.io')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    title="Copy Target"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
