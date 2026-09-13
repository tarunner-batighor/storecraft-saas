import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  CheckCircle2,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

export default function SaasLandingPage() {
  const { availableStores, switchTenant } = useTenant();
  const { demoSwitch } = useAuth();
  const { isBn, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
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
            <span>{isBn ? 'হোয়াইট-লেবেল মাল্টি-টেন্যান্ট ই-কমার্স SaaS প্ল্যাটফর্ম' : 'White-Label Multi-Tenant E-Commerce SaaS Platform'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white">
            {isBn ? (
              <>মাত্র <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">৬০ সেকেন্ডে</span> তৈরি করুন আপনার নিজস্ব ব্র্যান্ডের অনলাইন স্টোর</>
            ) : (
              <>Launch Your Custom Branded Online Store in <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">60 Seconds</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isBn ? (
              'বাংলাদেশের উদ্যোক্তা ও মার্চেন্টদের জন্য সম্পূর্ণ আধুনিক মাল্টি-টেন্যান্ট ই-কমার্স সলিউশন। নিজস্ব ব্র্যান্ডিং, কাস্টম ডোমেন, বিকাশ/নগদ পেমেন্ট, পাঠাও ও স্টিডফাস্ট কুরিয়ার বুকিং এবং ইনভয়েস ম্যানেজমেন্ট।'
            ) : (
              'A comprehensive, multi-tenant e-commerce platform for Bangladeshi merchants. Complete with customizable branding, custom domains, bKash & Nagad payments, automated courier consignments (Pathao & Steadfast), and strict row-level tenant data isolation.'
            )}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition flex items-center space-x-2"
            >
              <Store className="w-4 h-4" />
              <span>{isBn ? 'ফ্রি স্টোর খুলুন' : 'Create Store Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleOpenStorefront('sarwarbooks')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition flex items-center space-x-2"
            >
              <Laptop className="w-4 h-4 text-sky-400" />
              <span>{isBn ? 'লাইভ স্টোর দেখুন (Demo)' : 'Explore Live Stores'}</span>
            </button>

            <button
              onClick={toggleLanguage}
              className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs transition flex items-center space-x-1.5"
            >
              <Globe className="w-4 h-4" />
              <span>{isBn ? 'Switch to English' : 'বাংলা সংস্করণ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Demo Stores Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isBn ? 'প্রি-বিল্ট লাইভ ডেমো স্টোরসমূহ' : 'Pre-Populated Demo Stores'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isBn ? 'সম্পূর্ণ ভিন্নধর্মী লাইভ স্টোর পরখ করুন' : 'Experience Ready-to-Sell Multi-Tenant Stores'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {isBn ? (
              'প্রত্যেকটি স্টোরের নিজস্ব আলাদা ইনভেন্টরি, থিম ও ব্র্যান্ডিং কালার, শিপিং চার্জ এবং আলাদা পেমেন্ট গেটওয়ে রয়েছে।'
            ) : (
              'Each tenant has its own isolated product catalog, custom color scheme, shipping rules, payment methods, and orders.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableStores.map((store) => (
            <div
              key={store.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden p-5 flex flex-col justify-between space-y-5 hover:border-slate-700 transition shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={store.branding?.logo || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                    alt={store.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition truncate">
                      {store.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">{store.slug}.storecraft.io</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {store.branding?.tagline || 'Custom e-commerce store with high performance catalog & seamless checkout.'}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {store.product_count || 0} {isBn ? 'পণ্য' : 'Products'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                    {store.plan_name}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleOpenStorefront(store.slug)}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition flex items-center justify-center space-x-1"
                >
                  <span>{isBn ? 'স্টোরফ্রন্ট' : 'Store'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleOpenAdmin(store.slug)}
                  className="py-2 px-2.5 rounded-xl text-white text-[11px] font-bold transition flex items-center justify-center space-x-1 shadow-md"
                  style={{ backgroundColor: store.branding?.primary_color || '#0f766e' }}
                >
                  <span>{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
                  <ArrowRight className="w-3 h-3" />
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
              {isBn ? 'এন্টারপ্রাইজ গ্রেড মাল্টি-টেন্যান্সি' : 'Enterprise Grade Multi-Tenancy'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isBn ? 'বাংলাদেশি ই-কমার্সের সকল স্বয়ংসম্পূর্ণ ফিচার' : 'Complete Built-In SaaS Capabilities'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'নিরাপদ ডেটা আইসোলেশন' : 'Row-Level Data Isolation'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? 'প্রত্যেকটি স্টোরের ডেটা সম্পূর্ণরূপে সুরক্ষিত ও পৃথক। এক স্টোরের তথ্য অন্য কেউ দেখতে বা বদলাতে পারে না।' : 'Every query is automatically scoped with Tenant ID. Customers, products, orders and invoices never mix across stores.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'কাস্টম ডোমেন ও ডিএনএস' : 'Custom Domains & DNS'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? 'আপনার নিজস্ব ডোমেন (যেমন: yourbrand.com বা .com.bd) সংযুক্ত করুন খুব সহজে ফ্রি এসএসএল সহ।' : 'Connect your own domain (e.g. mybrand.com or .com.bd) with automated CNAME routing and SSL provisioning.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'বিকাশ, নগদ ও ক্যাশ অন ডেলিভারি' : 'bKash, Nagad & Cards'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? 'বাংলাদেশের সকল জনপ্রিয় পেমেন্ট মেথড (বিকাশ, নগদ, রকেট, সিওডি) এবং আন্তর্জাতিক কার্ড সাপোর্ট।' : 'Built-in support for Bangladeshi mobile financial services (bKash & Nagad) + Cash on Delivery & International Stripe cards.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'পাঠাও ও স্টিডফাস্ট কুরিয়ার' : 'Pathao & Steadfast APIs'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? '১-ক্লিকে কুরিয়ারে পার্সেল বুকিং, শিপিং লেবেল প্রিন্ট ও লাইভ পার্সেল ট্র্যাকিং সুবিধা।' : '1-click consignment generation, parcel label printing, and real-time shipment status webhook sync across 64 districts.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'মাল্টি-ভেরিয়েন্ট প্রোডাক্ট ইঞ্জিন' : 'Multi-Variant Matrix Engine'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? 'রং, সাইজ বা ভলিউম ভিত্তিক আলাদা দাম ও স্টক নিয়ন্ত্রণের সুবিধা।' : 'Manage complex product options (Size x Color x Storage) with individual SKU, price and inventory stock controls.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{isBn ? 'সুপার অ্যাডমিন প্ল্যাটফর্ম কন্ট্রোল' : 'Super Admin Platform Control'}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isBn ? 'সার্বিক প্ল্যাটফর্ম অ্যানালিটিক্স, স্টোর ম্যানেজমেন্ট ও সাবস্ক্রিপশন প্ল্যান কন্ট্রোল।' : 'Global platform analytics, SaaS plan tiers, store impersonation, audit logs, and gross merchandise revenue tracking.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Subscription Plans Matrix (Bangladeshi Benchmark Pricing) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isBn ? 'সাশ্রয়ী সাবস্ক্রিপশন প্যাকেজ' : 'SaaS Subscription Tiers'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isBn ? 'বাংলাদেশের ই-কমার্স উদ্যোক্তাদের জন্য স্বচ্ছ প্রাইসিং' : 'Transparent, Scalable SaaS Pricing'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {isBn
              ? 'কোনো গোপন চার্জ নেই। ফ্রি ট্রায়াল দিয়ে শুরু করুন এবং ব্যবসা বড় হওয়ার সাথে সাথে আপগ্রেড করুন।'
              : 'No hidden setup fees. Start free and scale seamlessly as your business and order volume grow.'}
          </p>

          {/* Monthly / Yearly Switcher */}
          <div className="inline-flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isBn ? 'মাসিক বিলিং' : 'Monthly'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isBn ? 'বার্ষিক বিলিং' : 'Yearly'}</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
                {isBn ? '২ মাস ফ্রি' : '2 Mo Free'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'yearly' ? p.price_yearly : p.price_monthly;
            const featuresList = isBn && p.features ? p.features : (p.features_en || p.features);

            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition relative ${
                  p.is_popular
                    ? 'bg-slate-900 border-emerald-500 shadow-2xl ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.is_popular && (
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase shadow-md">
                    {isBn ? 'সবচেয়ে জনপ্রিয়' : 'Best Value'}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {isBn && p.name_bn ? p.name_bn : p.name}
                    </h3>
                    {p.badge && (
                      <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-baseline space-x-1 mt-3">
                      <span className="text-3xl font-black text-white">
                        {price === 0 ? (isBn ? '৳০' : '৳0') : `৳${price.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {billingCycle === 'yearly' ? (isBn ? '/বার্ষিক' : '/yr') : (isBn ? '/মাসিক' : '/month')}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    {featuresList?.map((f, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                      p.is_popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <span>
                      {price === 0
                        ? (isBn ? 'ফ্রি ট্রায়াল শুরু করুন' : 'Start Free Trial')
                        : (isBn ? `${p.name} প্যাকেজে শুরু করুন` : `Get Started with ${p.name}`)}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
