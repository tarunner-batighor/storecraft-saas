import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Check, ShoppingCart, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductQuickView({ product, onClose }) {
  const { branding } = useTenant();
  const { addToCart } = useCart();

  const [selectedVariant, setSelectedVariant] = useState(() => {
    return product.variants && product.variants.length > 0 ? product.variants[0] : null;
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(() => {
    return (product.images && product.images[0]) || '';
  });
  const [addedSuccess, setAddedSuccess] = useState(false);

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
  const currentStock = selectedVariant ? (selectedVariant.stock_quantity ?? product.stock_quantity) : product.stock_quantity;
  const isOutOfStock = product.track_quantity && currentStock <= 0;

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden relative animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
            <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-inner">
              <img
                src={selectedImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      selectedImage === img ? 'border-sky-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Variant Selector Column */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {product.category_name && (
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {product.category_name}
                </span>
              )}
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mt-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(currentPrice, 'BDT', currencySymbol)}
                </span>
                {currentComparePrice && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    {formatCurrency(currentComparePrice, 'BDT', currencySymbol)}
                  </span>
                )}
                {product.track_quantity && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    currentStock > 5
                      ? 'bg-emerald-100 text-emerald-800'
                      : currentStock > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentStock > 0 ? `${currentStock} in stock` : 'Out of Stock'}
                  </span>
                )}
              </div>

              {/* Short Desc */}
              {product.short_description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Select Option / Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          selectedVariant?.id === v.id
                            ? 'border-transparent text-white shadow-md'
                            : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                        style={selectedVariant?.id === v.id ? { backgroundColor: primaryColor } : {}}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-6 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-40"
                  style={{ backgroundColor: primaryColor }}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Genuine Guaranteed</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>Fast Express Courier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
