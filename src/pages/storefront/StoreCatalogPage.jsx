import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import ProductCard from '../../components/storefront/ProductCard';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function StoreCatalogPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.success) setCategories(res.categories || []);
      } catch (err) {}
    };
    fetchCats();
  }, [currentSlug]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (searchQuery) params.set('search', searchQuery);
        if (inStockOnly) params.set('in_stock', 'true');
        if (minPrice) params.set('min_price', minPrice);
        if (maxPrice) params.set('max_price', maxPrice);
        if (sortBy) params.set('sort', sortBy);

        const res = await api.get(`/products?${params.toString()}`);
        if (res.success) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error('Catalog fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentSlug, selectedCategory, searchQuery, inStockOnly, sortBy, minPrice, maxPrice]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
  };

  const primaryColor = branding?.primary_color || '#0f766e';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Title */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Product Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Showing {products.length} products
          </p>
        </div>

        {/* Top Controls: Search & Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-2">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search in store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none w-40 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className={`md:block space-y-6 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </span>
              <button
                onClick={clearFilters}
                className="text-[11px] text-rose-500 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-white block">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition ${
                    selectedCategory === ''
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug || cat.id)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                      selectedCategory === cat.slug || selectedCategory === cat.id
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">
                      {cat.product_count !== undefined ? cat.product_count : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-900 dark:text-white block">
                Price Range (৳)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match your active filters. Try adjusting your search query or reset your filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
