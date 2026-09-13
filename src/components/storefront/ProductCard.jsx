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
      <div className="group bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-700/40">
          <Link to={`/store/${currentSlug}/product/${product.slug || product.id}`}>
            <img
              src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            {product.is_flash_deal && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5 shadow-sm">
                <Zap className="w-3 h-3 fill-current" />
                <span>FLASH</span>
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-800/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition shadow-md z-10 ${
              wishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View Button overlay */}
          <div className="absolute inset-x-0 bottom-2 px-3 hidden group-hover:flex justify-center z-10 transition animate-fade-in">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold py-1.5 rounded-xl backdrop-blur-md flex items-center justify-center space-x-1.5 shadow-lg transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
          <div className="space-y-1.5">
            {product.category_name && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {product.category_name}
              </span>
            )}
            <Link
              to={`/store/${currentSlug}/product/${product.slug || product.id}`}
              className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:underline leading-snug"
            >
              {product.name}
            </Link>

            {/* Ratings */}
            <div className="flex items-center space-x-1 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating_avg || 5) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-slate-500 text-[11px]">
                ({product.rating_count || 0})
              </span>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(product.price, 'BDT', currencySymbol)}
              </div>
              {product.compare_at_price && (
                <div className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.compare_at_price, 'BDT', currencySymbol)}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2.5 rounded-xl text-white font-semibold transition shadow-md flex items-center justify-center ${
                isOutOfStock ? 'opacity-40 cursor-not-allowed bg-slate-400' : 'hover:opacity-95 active:scale-95'
              }`}
              style={{ backgroundColor: primaryColor }}
              title={hasVariants ? 'Choose Variant' : 'Add to Cart'}
            >
              {isAdded ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
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
