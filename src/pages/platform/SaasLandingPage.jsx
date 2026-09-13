import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import CreateStoreModal from '../../components/common/CreateStoreModal';
import {
  Sparkles,
  Store,
  Layers,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  Truck,
  ArrowRight,
  Check,
  Crown,
  Server,
  BarChart3,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';

export default function SaasLandingPage() {
  const { availableStores, switchTenant } = useTenant();
  const { demoSwitch } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/public/plans');
        if (res.success && res.plans) {
          setPlans(res.plans);
        }
      } catch (err) {}
    };
    fetchPlans();
  }, []);

  const handleOpenStorefront = (slug) => {
    switchTenant(slug);
    navigate(`/store/${slug}`);
  };

  const handleOpenAdmin = async (slug) => {
    switchTenant(slug);
    await demoSwitch('store_owner', slug);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* SaaS Platform Hero */}
      <div className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>White-Label Multi-Tenant E-Commerce SaaS Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white">
            Launch Your Custom Branded Online Store in <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">60 Seconds</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, multi-tenant e-commerce platform. Complete with customizable branding, 
            custom domains, product variants, bKash & card payments, automated courier consignments (Pathao & Steadfast), and strict row-level tenant data isolation.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition flex items-center space-x-2"
            >
              <Store className="w-4 h-4" />
              <span>Create Store Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleOpenStorefront('gadgetvibe')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center space-x-2"
            >
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>Explore Live Stores</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Demo Stores Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Pre-Populated Demo Stores
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Experience 3 Ready-to-Sell Multi-Tenant Stores
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Each tenant has its own isolated product catalog, custom color scheme, shipping rules, payment methods, and orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableStores.map((store) => (
            <div
              key={store.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={store.branding?.logo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                      alt={store.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition">
                        {store.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400 block">{store.slug}.storecraft.io</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {store.branding?.tagline || 'Custom e-commerce store with high performance catalog & seamless checkout.'}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {store.product_count || 0} Products
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                    {store.plan_name}
                  </span>
                  {store.custom_domain && (
                    <span className="px-2.5 py-1 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/60">
                      🌐 {store.custom_domain}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleOpenStorefront(store.slug)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1"
                >
                  <span>Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenAdmin(store.slug)}
                  className="py-2.5 px-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center space-x-1 shadow-md"
                  style={{ backgroundColor: store.branding?.primary_color || '#0f766e' }}
                >
                  <span>Store Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Architecture Matrix */}
      <div className="bg-slate-900/60 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Enterprise Grade Multi-Tenancy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Complete Built-In SaaS Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Row-Level Data Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every query is automatically scoped with Tenant ID. Customers, products, orders and invoices never mix across stores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Custom Domains & DNS</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your own domain (e.g. <code>mybrand.com</code>) with automated CNAME routing and SSL provisioning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">bKash, Nagad & Cards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in support for Bangladeshi mobile financial services (bKash & Nagad) + Cash on Delivery & International Stripe cards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Pathao & Steadfast APIs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                1-click consignment generation, parcel label printing, and real-time shipment status webhook sync across 64 districts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Multi-Variant Matrix Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage complex product options (Size x Color x Storage) with individual SKU, price and inventory stock controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Super Admin Platform Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Global platform analytics, SaaS plan tiers, store impersonation, audit logs, and gross merchandise revenue tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Subscription Plans Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            SaaS Subscription Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Transparent, Scalable SaaS Pricing
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`p-6 rounded-3xl border flex flex-col justify-between transition relative ${
                p.is_popular
                  ? 'bg-slate-900 border-emerald-500 shadow-xl ring-1 ring-emerald-500'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.is_popular && (
                <span className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase">
                  Best Value
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                  <div className="flex items-baseline space-x-1 mt-2">
                    <span className="text-3xl font-black text-white">${p.price_monthly}</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  {p.features?.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  Start Store on {p.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateStoreModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newTenant) => {
            setShowCreateModal(false);
            switchTenant(newTenant.slug);
            navigate(`/store/${newTenant.slug}`);
          }}
        />
      )}
    </div>
  );
}
