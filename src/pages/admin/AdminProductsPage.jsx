import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import ProductFormModal from '../../components/admin/ProductFormModal';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';

export default function AdminProductsPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        api.get('/products?all=true'),
        api.get('/products/categories'),
        api.get('/tenant/settings')
      ]);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
      if (setRes.success) setPlan(setRes.plan);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentSlug]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.del(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleStockQuickUpdate = async (id, newStock) => {
    try {
      await api.patch(`/products/${id}/stock`, { stock_quantity: Number(newStock) });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: Number(newStock) } : p));
    } catch (err) {
      alert('Failed to update stock');
    }
  };

  const filtered = products.filter(p => {
    if (selectedCat && p.category_id !== selectedCat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const currencySymbol = branding?.currency_symbol || '৳';
  const maxProducts = plan ? plan.max_products : 15;
  const isLimitReached = products.length >= maxProducts;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Plan Limit Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Package className="w-6 h-6 text-sky-500" />
            <span>Products & Stock Inventory</span>
          </h1>
          <p className="text-xs text-slate-500">
            {products.length} of {maxProducts} products used ({plan ? plan.name : 'Starter'} Plan)
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsCreateModalOpen(true);
          }}
          disabled={isLimitReached}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Plan limit warning banner */}
      {isLimitReached && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Product limit reached for your <strong>{plan?.name}</strong>. Upgrade your SaaS tier for higher limits.</span>
          </div>
          <a href="/admin/subscription" className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400">
            Upgrade Plan
          </a>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU / Variants</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">Loading catalog items...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">No products found matching filters.</td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const hasVariants = prod.variants && prod.variants.length > 0;
                  const isLow = prod.track_quantity && prod.stock_quantity <= (prod.low_stock_threshold || 5);

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition">
                      {/* Product Image & Name */}
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 max-w-[200px] sm:max-w-[260px]">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{prod.name}</div>
                          {prod.is_flash_deal && (
                            <span className="inline-flex items-center space-x-0.5 text-[10px] text-amber-600 font-bold">
                              <Zap className="w-3 h-3 fill-current" />
                              <span>Flash Deal</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                        {prod.category_name || 'General'}
                      </td>

                      {/* SKU & Variants count */}
                      <td className="p-4">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-bold">{prod.sku}</div>
                        {hasVariants ? (
                          <span className="text-[10px] text-sky-600 font-semibold">{prod.variants.length} Variants</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Single</span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(prod.price, 'BDT', currencySymbol)}
                        </div>
                        {prod.compare_at_price && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(prod.compare_at_price, 'BDT', currencySymbol)}
                          </div>
                        )}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="p-4">
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            defaultValue={prod.stock_quantity}
                            onBlur={(e) => handleStockQuickUpdate(prod.id, e.target.value)}
                            className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white text-center"
                          />
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            prod.stock_quantity <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {prod.stock_quantity <= 0 ? 'Out' : isLow ? 'Low' : 'OK'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          prod.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {prod.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsCreateModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create/Edit Modal */}
      {isCreateModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
