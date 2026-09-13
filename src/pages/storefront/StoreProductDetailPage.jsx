import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ProductCard from '../../components/storefront/ProductCard';
import {
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Zap,
  ArrowRight,
  MessageSquarePlus,
  Loader2
} from 'lucide-react';

export default function StoreProductDetailPage() {
  const { productSlug } = useParams();
  const { currentTenant, branding, currentSlug } = useTenant();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review submission state
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    customer_name: user?.name || ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${productSlug}`);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImage((res.product.images && res.product.images[0]) || '');
          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedVariant(res.product.variants[0]);
          } else {
            setSelectedVariant(null);
          }
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug, currentSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-500" />
        <p className="text-xs text-slate-500 mt-2">Loading product specs...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to={`/store/${currentSlug}/catalog`}
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';
  const wishlisted = isWishlisted(product.id);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentComparePrice = selectedVariant ? selectedVariant.compare_at_price : product.compare_at_price;
  const currentStock = selectedVariant ? (selectedVariant.stock_quantity ?? product.stock_quantity) : product.stock_quantity;
  const isOutOfStock = product.track_quantity && currentStock <= 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate(`/store/${currentSlug}/checkout`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment || !newReview.customer_name) return;
    setSubmittingReview(true);
    setReviewMsg('');
    try {
      const res = await api.post('/reviews', {
        product_id: product.id,
        customer_id: user?.id || null,
        customer_name: newReview.customer_name,
        rating: newReview.rating,
        comment: newReview.comment
      });
      if (res.success) {
        setReviewMsg('Thank you! Your verified review has been submitted.');
        setNewReview({ rating: 5, comment: '', customer_name: user?.name || '' });
        // Refresh product
        const updatedRes = await api.get(`/products/${productSlug}`);
        if (updatedRes.success) setProduct(updatedRes.product);
      }
    } catch (err) {
      setReviewMsg(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 flex items-center space-x-2">
        <Link to={`/store/${currentSlug}`} className="hover:text-slate-900 dark:hover:text-white">Home</Link>
        <span>/</span>
        <Link to={`/store/${currentSlug}/catalog`} className="hover:text-slate-900 dark:hover:text-white">Catalog</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{product.name}</span>
      </div>

      {/* Main Grid: Gallery & Purchase Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative group">
            <img
              src={selectedImage || (product.images && product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            {product.is_flash_deal && (
              <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-md">
                <Zap className="w-4 h-4 fill-current" />
                <span>FLASH SALE</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-sky-500 shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              {product.category_name && (
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {product.category_name}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 rounded-full border transition ${
                  wishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & SKU */}
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating_avg || 5) ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
                <span className="text-slate-900 dark:text-white font-bold ml-1">{product.rating_avg || 5.0}</span>
                <span className="text-slate-500">({product.rating_count || 0} reviews)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(currentPrice, 'BDT', currencySymbol)}
                </span>
                {currentComparePrice && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    {formatCurrency(currentComparePrice, 'BDT', currencySymbol)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes and standard warranty</p>
            </div>

            {product.track_quantity && (
              <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-xs ${
                currentStock > 5
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentStock > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {currentStock > 0 ? `${currentStock} in stock` : 'Sold Out'}
              </span>
            )}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Select Option / Variation:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl text-left border transition ${
                      selectedVariant?.id === v.id
                        ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-slate-900 dark:text-white shadow-sm ring-1 ring-sky-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{v.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{formatCurrency(v.price, 'BDT', currencySymbol)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-6 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-40"
                style={{ backgroundColor: primaryColor }}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Buy Now (Direct Checkout) */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center text-xs">
            <div className="space-y-1">
              <Truck className="w-5 h-5 mx-auto text-sky-500" />
              <div className="font-bold text-slate-900 dark:text-white">Express Delivery</div>
              <div className="text-[10px] text-slate-500">24-48 Hours</div>
            </div>
            <div className="space-y-1 border-x border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-500" />
              <div className="font-bold text-slate-900 dark:text-white">100% Genuine</div>
              <div className="text-[10px] text-slate-500">Official Warranty</div>
            </div>
            <div className="space-y-1">
              <RotateCcw className="w-5 h-5 mx-auto text-amber-500" />
              <div className="font-bold text-slate-900 dark:text-white">Easy Returns</div>
              <div className="text-[10px] text-slate-500">7 Days Return</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Specifications */}
      <div className="bg-white dark:bg-slate-800/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-3">
          Product Details & Features
        </h3>
        <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {product.description || product.short_description || 'Detailed specifications and warranty information available upon inquiry.'}
        </div>
      </div>

      {/* Customer Reviews & Form Section */}
      <div className="bg-white dark:bg-slate-800/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Customer Reviews ({product.reviews?.length || 0})
            </h3>
            <p className="text-xs text-slate-500">Verified buyer ratings and feedback</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{product.rating_avg || 5.0}</div>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{rev.customer_name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">Verified Buyer</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(rev.created_at)}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-300'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review this product!</p>
          )}
        </div>

        {/* Write a Review Box */}
        <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <MessageSquarePlus className="w-4 h-4 text-sky-500" />
            <span>Write a Product Review</span>
          </h4>

          {reviewMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl">
              {reviewMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Tanvir Ahmed"
                value={newReview.customer_name}
                onChange={(e) => setNewReview({ ...newReview, customer_name: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                <option value={2}>⭐⭐ (2 Stars - Below Average)</option>
                <option value={1}>⭐ (1 Star - Poor)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Feedback / Review</label>
            <textarea
              required
              rows={3}
              placeholder="What did you like or dislike about this product?"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: primaryColor }}
          >
            {submittingReview ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </div>

      {/* Related Products */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">You May Also Like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
