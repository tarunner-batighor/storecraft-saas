import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { X, Plus, Trash2, Sparkles, Layers, Image, Loader2, Check } from 'lucide-react';

export default function ProductFormModal({ product, categories, onClose, onSuccess }) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    category_id: product?.category_id || (categories[0]?.id || ''),
    price: product?.price || '',
    compare_at_price: product?.compare_at_price || '',
    cost_price: product?.cost_price || '',
    stock_quantity: product?.stock_quantity ?? 10,
    low_stock_threshold: product?.low_stock_threshold ?? 3,
    track_quantity: product?.track_quantity ?? true,
    is_published: product?.is_published ?? true,
    is_featured: product?.is_featured ?? false,
    is_flash_deal: product?.is_flash_deal ?? false,
    flash_deal_discount: product?.flash_deal_discount || 0,
    short_description: product?.short_description || '',
    description: product?.description || '',
    images: product?.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    variants: product?.variants || [],
    attributes: product?.attributes || []
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Variant helper states
  const [attrName, setAttrName] = useState('Size');
  const [attrValues, setAttrValues] = useState('M, L, XL');

  const handleAddAttributeAndGenerateVariants = () => {
    if (!attrName.trim() || !attrValues.trim()) return;
    const values = attrValues.split(',').map(s => s.trim()).filter(Boolean);
    const updatedAttrs = [...formData.attributes.filter(a => a.name !== attrName.trim()), { name: attrName.trim(), values }];

    // Generate variants
    const generatedVariants = values.map((val, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      name: `${val}`,
      sku: `${formData.sku || 'SKU'}-${val.toUpperCase()}`,
      price: Number(formData.price) || 0,
      compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
      stock_quantity: Math.max(1, Math.floor(Number(formData.stock_quantity) / values.length) || 5),
      attributes: { [attrName.trim()]: val }
    }));

    setFormData(prev => ({
      ...prev,
      attributes: updatedAttrs,
      variants: generatedVariants
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        const res = await api.put(`/products/${product.id}`, formData);
        if (res.success) {
          onSuccess(res.product);
        }
      } else {
        const res = await api.post('/products', formData);
        if (res.success) {
          onSuccess(res.product);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-slide-up">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {isEditing ? `Edit Product: ${product.name}` : 'Create New Product'}
            </h2>
            <p className="text-xs text-slate-400">
              Manage product pricing, SKU, media gallery, inventory and variants
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Section 1: General Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Base SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PROD-101"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              2. Pricing & Stock Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selling Price (৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="2500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Compare at Price (Original/Strike-through)
                </label>
                <input
                  type="number"
                  placeholder="3000"
                  value={formData.compare_at_price}
                  onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Quantity (Total Units)
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Variant Generator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Product Variants Matrix (Size, Color, Storage)
              </h3>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Option Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Size or Color"
                    value={attrName}
                    onChange={(e) => setAttrName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Option Values (Comma separated)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. Small, Medium, Large, XL"
                      value={attrValues}
                      onChange={(e) => setAttrValues(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddAttributeAndGenerateVariants}
                      className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 shrink-0"
                    >
                      Generate Matrix
                    </button>
                  </div>
                </div>
              </div>

              {/* Generated Variants Table */}
              {formData.variants && formData.variants.length > 0 && (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold">
                        <th className="py-2">Variant Name</th>
                        <th className="py-2">SKU</th>
                        <th className="py-2">Price (৳)</th>
                        <th className="py-2">Stock</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {formData.variants.map((v, idx) => (
                        <tr key={v.id || idx}>
                          <td className="py-2 font-bold">{v.name}</td>
                          <td className="py-2 font-mono text-[11px]">{v.sku}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={v.price}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormData(prev => ({
                                  ...prev,
                                  variants: prev.variants.map((item, i) => i === idx ? { ...item, price: val } : item)
                                }));
                              }}
                              className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="number"
                              value={v.stock_quantity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormData(prev => ({
                                  ...prev,
                                  variants: prev.variants.map((item, i) => i === idx ? { ...item, stock_quantity: val } : item)
                                }));
                              }}
                              className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
                            />
                          </td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }))}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Images */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              4. Product Media & Gallery
            </h3>

            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="Paste Image URL (https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl"
              >
                Add Image
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Descriptions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
              5. Descriptions & Highlights
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Summary
              </label>
              <input
                type="text"
                placeholder="One sentence summary of product..."
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Description (Specifications, Features & Warranty)
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Published on Storefront</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_flash_deal}
                onChange={(e) => setFormData({ ...formData, is_flash_deal: e.target.checked })}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>Include in Flash Deals</span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-lg transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{isEditing ? 'Update Product' : 'Save & Publish Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
