import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import {
  Truck,
  Check,
  Save,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';

export default function AdminCourierSettingsPage() {
  const { currentTenant, refreshTenant } = useTenant();

  const [pathaoEnabled, setPathaoEnabled] = useState(true);
  const [pathaoClientId, setPathaoClientId] = useState('PATHAO_MOCK_882');
  const [pathaoSecret, setPathaoSecret] = useState('******');

  const [steadfastEnabled, setSteadfastEnabled] = useState(true);
  const [steadfastApiKey, setSteadfastApiKey] = useState('STDF_MOCK_771');

  const [redxEnabled, setRedxEnabled] = useState(false);
  const [redxApiKey, setRedxApiKey] = useState('');

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/tenant/settings');
        if (res.success && res.tenant?.courier_settings) {
          const cs = res.tenant.courier_settings;
          setPathaoEnabled(cs.pathao?.enabled ?? true);
          setPathaoClientId(cs.pathao?.client_id || '');
          setSteadfastEnabled(cs.steadfast?.enabled ?? true);
          setSteadfastApiKey(cs.steadfast?.api_key || '');
          setRedxEnabled(cs.redx?.enabled ?? false);
          setRedxApiKey(cs.redx?.api_key || '');
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
      const res = await api.put('/tenant/couriers', {
        courier_settings: {
          pathao: { enabled: pathaoEnabled, client_id: pathaoClientId, secret: pathaoSecret },
          steadfast: { enabled: steadfastEnabled, api_key: steadfastApiKey },
          redx: { enabled: redxEnabled, api_key: redxApiKey }
        }
      });
      if (res.success) {
        setMsg('Courier integrations and API keys saved!');
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
          <Truck className="w-6 h-6 text-sky-500" />
          <span>Courier Integrations (Pathao, Steadfast, RedX)</span>
        </h1>
        <p className="text-xs text-slate-500">
          Connect automated parcel dispatch APIs to generate real-time consignment tracking numbers & dispatch labels with 1-click.
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-2xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Pathao Courier */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center font-bold text-sm">
                PT
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pathao Courier API</h3>
                <p className="text-[11px] text-slate-500">Fast home delivery across 64 districts with automated COD recovery</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pathaoEnabled}
                onChange={(e) => setPathaoEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {pathaoEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pathao Client ID</label>
                <input
                  type="text"
                  value={pathaoClientId}
                  onChange={(e) => setPathaoClientId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pathao Client Secret</label>
                <input
                  type="password"
                  value={pathaoSecret}
                  onChange={(e) => setPathaoSecret(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Steadfast Courier */}
        <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                SF
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Steadfast Courier API</h3>
                <p className="text-[11px] text-slate-500">Nationwide coverage with live SMS status sync & 0% return charge</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={steadfastEnabled}
                onChange={(e) => setSteadfastEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {steadfastEnabled && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Steadfast API Key</label>
              <input
                type="text"
                value={steadfastApiKey}
                onChange={(e) => setSteadfastApiKey(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xl transition flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Courier Integrations</span>
          </button>
        </div>
      </form>
    </div>
  );
}
