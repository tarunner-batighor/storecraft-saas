import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
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
  Clock
} from 'lucide-react';

export default function StoreHomePage() {
  const { currentTenant, branding, currentSlug } = useTenant();
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

  const primaryColor = branding?.primary_color || '#0f766e';
  const flashDeals = products.filter(p => p.is_flash_deal);
  const featuredProducts = products.filter(p => p.is_featured);

  const filteredProducts = activeTab === 'all'
    ? products
    : activeTab === 'featured'
    ? featuredProducts
    : activeTab === 'flash'
    ? flashDeals
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
      {/* Hero Carousel */}
      <HeroSlider />

      {/* Featured Categories Bar */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-sky-500" />
                <span>Shop by Category</span>
              </h2>
              <p className="text-xs text-slate-500">Explore curated collections</p>
            </div>
            <Link
              to={`/store/${currentSlug}/catalog`}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/store/${currentSlug}/catalog?category=${cat.slug || cat.id}`}
                className="group p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:shadow-lg transition flex items-center space-x-3 overflow-hidden"
              >
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80'}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-sky-500">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {cat.product_count !== undefined ? `${cat.product_count} items` : 'Explore'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Flash Deals Section with Countdown */}
      {flashDeals.length > 0 && (
        <section className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Limited Time Flash Deals</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Exclusive Deals of the Day
              </h2>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-md">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex space-x-1 text-sm font-black font-mono">
                <span className="bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {flashDeals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Main Product Showcase with Tabs */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <span>Trending & Popular Products</span>
            </h2>
            <p className="text-xs text-slate-500">Hand-selected quality products with guaranteed authenticity</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'featured' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Featured Only
            </button>
            <button
              onClick={() => setActiveTab('flash')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'flash' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Flash Sales
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">No products found in this tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
