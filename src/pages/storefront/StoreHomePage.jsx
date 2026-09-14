import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../utils/api';
import HeroSlider from '../../components/storefront/HeroSlider';
import ProductCard from '../../components/storefront/ProductCard';
import {
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

export default function StoreHomePage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const { isBn } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Flash deal countdown timer state (Hours : Mins : Secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/products/categories')
        ]);
        if (prodRes.success) setProducts(prodRes.products || []);
        if (catRes.success) setCategories(catRes.categories || []);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentSlug]);

  const primaryColor = branding?.primary_color || '#0284c7';

  // Filtered views
  const featuredProducts = products.filter(p => p.is_featured);
  const flashDeals = products.filter(p => p.is_flash_deal);

  const displayedProducts = activeTab === 'featured'
    ? (featuredProducts.length > 0 ? featuredProducts : products)
    : activeTab === 'deals'
    ? (flashDeals.length > 0 ? flashDeals : products)
    : products;

  return (
    <div className="space-y-6 sm:space-y-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-20 md:pb-10">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Trust & Guarantee Badges - Compact Bar */}
      <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 sm:p-4 rounded-2xl shadow-xs text-center text-slate-800 dark:text-slate-200">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
          <Truck className="w-4 h-4 text-sky-500 shrink-0" />
          <div className="text-left">
            <h4 className="text-[11px] sm:text-xs font-bold leading-none">{isBn ? 'দ্রুত হোম ডেলিভারি' : 'Fast Delivery'}</h4>
            <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">{isBn ? 'সারা বাংলাদেশে' : 'All Bangladesh'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 border-x border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-left">
            <h4 className="text-[11px] sm:text-xs font-bold leading-none">{isBn ? '১০০% আসল পণ্য' : 'Authentic'}</h4>
            <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">{isBn ? 'গ্যারান্টিযুক্ত কোয়ালিটি' : 'Guaranteed'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
          <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="text-left">
            <h4 className="text-[11px] sm:text-xs font-bold leading-none">{isBn ? 'ক্যাশ অন ডেলিভারি' : 'COD Available'}</h4>
            <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">{isBn ? 'বিকাশ ও নগদ' : 'bKash & Nagad'}</span>
          </div>
        </div>
      </div>

      {/* Categories Showcase - Compact Horizontal Scroll on Mobile */}
      {categories.length > 0 && (
        <section className="space-y-2.5 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>{isBn ? 'ক্যাটাগরি সমূহ' : 'Categories'}</span>
            </h2>
            <Link
              to={`/store/${currentSlug}/catalog`}
              className="text-xs font-bold text-sky-600 hover:underline flex items-center space-x-1"
            >
              <span>{isBn ? 'সব দেখুন' : 'View All'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/store/${currentSlug}/catalog?category=${cat.slug || cat.id}`}
                className="group p-2 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:shadow-md transition flex items-center space-x-2.5 shrink-0 min-w-[140px] sm:min-w-0"
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80'}
                  alt={cat.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-500">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {isBn ? 'পণ্য দেখুন' : 'Explore'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Flash Deals Section - High Density 2-Column Mobile Grid */}
      {flashDeals.length > 0 && (
        <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/20 rounded-3xl p-3 sm:p-6 space-y-3 sm:space-y-5">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                <Zap className="w-3 h-3 fill-current" />
                <span>{isBn ? 'ফ্ল্যাশ ডিল' : 'Flash Deals'}</span>
              </div>
              <h2 className="text-xs sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {isBn ? 'সীমিত সময়ের অফার' : 'Limited Time Deals'}
              </h2>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center space-x-1 bg-slate-900 text-white px-2.5 py-1 rounded-xl shadow-sm text-xs font-mono font-bold shrink-0">
              <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {flashDeals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Main Product Showcase - Dense 2-Column Grid */}
      <section className="space-y-3 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 px-1">
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
              <span>{isBn ? 'জনপ্রিয় ও নতুন পণ্য' : 'Popular & New Arrivals'}</span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              {isBn ? 'সব পণ্য' : 'All'}
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1 rounded-lg transition ${
                activeTab === 'featured' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              {isBn ? 'ফিচার্ড' : 'Featured'}
            </button>
          </div>
        </div>

        {/* 2-Column Mobile Grid for Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            {isBn ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
