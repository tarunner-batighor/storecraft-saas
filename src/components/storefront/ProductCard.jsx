import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  Check
} from 'lucide-react';
import ProductQuickView from './ProductQuickView';

export default function ProductCard({ product }) {
  const { branding, currentSlug } = useTenant();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';
  const wishlisted = isWishlisted(product.id);

  const hasVariants = product.variants && product.variants.length > 0;
  const isOutOfStock = product.track_quantity && product.stock_quantity <= 0;

  // Calculate discount percentage
  const discountPercent = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVariants) {
      // If item has variants (size, color), open Quick View for customer to select
      setIsQuickViewOpen(true);
      return;
    }

    addToCart(product, null, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-700/30">
          <Link to={`/store/${currentSlug}/product/${product.slug || product.id}`}>
            <img
              src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges - Compact for Mobile */}
          <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full shadow-sm">
                -{discountPercent}%
              </span>
            )}
            {product.is_flash_deal && (
              <span className="bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full flex items-center space-x-0.5 shadow-sm">
                <Zap className="w-2.5 h-2.5 fill-current" />
                <span>FLASH</span>
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-900/90 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                স্টক শেষ
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shadow-md z-10 ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button overlay (Desktop hover) */}
          <div className="absolute inset-x-0 bottom-2 px-3 hidden group-hover:flex justify-center z-10 transition animate-fade-in">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-semibold py-1 rounded-xl backdrop-blur-md flex items-center justify-center space-x-1 shadow-lg transition cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>একনজরে দেখুন</span>
            </button>
          </div>
        </div>

        {/* Info - High Density on Mobile */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2 sm:space-y-3">
          <div className="space-y-1">
            {product.category_name && (
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 block truncate">
                {product.category_name}
              </span>
            )}
            <Link
              to={`/store/${currentSlug}/product/${product.slug || product.id}`}
              className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 hover:underline leading-tight"
            >
              {product.name}
            </Link>

            {/* Ratings */}
            <div className="flex items-center space-x-1 text-[11px] pt-0.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                      i < Math.floor(product.rating_avg || 5) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-500 text-[10px]">
                ({product.rating_count || 0})
              </span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                {formatCurrency(product.price, 'BDT', currencySymbol)}
              </div>
              {product.compare_at_price && (
                <div className="text-[10px] sm:text-xs text-slate-400 line-through truncate">
                  {formatCurrency(product.compare_at_price, 'BDT', currencySymbol)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 sm:p-2.5 rounded-xl text-white font-semibold transition shadow-sm flex items-center justify-center shrink-0 cursor-pointer ${
                isOutOfStock ? 'opacity-40 cursor-not-allowed bg-slate-400' : 'hover:opacity-95 active:scale-90'
              }`}
              style={{ backgroundColor: primaryColor }}
              title={hasVariants ? 'সাইজ/ভেরিয়েন্ট নির্বাচন করুন' : 'কার্টে যোগ করুন'}
            >
              {isAdded ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              ) : (
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isQuickViewOpen && (
        <ProductQuickView
          product={product}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
