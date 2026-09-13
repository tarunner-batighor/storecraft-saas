import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  AlertCircle
} from 'lucide-react';

export default function CartDrawer() {
  const { branding, currentSlug } = useTenant();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    couponError,
    applyCoupon,
    removeCoupon,
    shippingCost,
    grandTotal
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  // Free shipping threshold progress
  const freeShippingGoal = 3000;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingGoal) * 100);
  const remainingForFree = Math.max(0, freeShippingGoal - subtotal);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput);
    setCouponLoading(false);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate(`/store/${currentSlug}/checkout`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-white" />
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">
                {remainingForFree > 0 ? (
                  <>Add <span className="text-emerald-600 font-bold">{formatCurrency(remainingForFree, 'BDT', currencySymbol)}</span> more for <strong>FREE DELIVERY</strong></>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>You've Unlocked FREE Delivery!</span>
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-500">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse through our handpicked products and find something you'll love!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate(`/store/${currentSlug}/catalog`);
                  }}
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-xs"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {formatCurrency(item.price, 'BDT', currencySymbol)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-3">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(discountAmount, 'BDT', currencySymbol)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. GADGET10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <div className="text-[11px] text-rose-500 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(subtotal, 'BDT', currencySymbol)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount, 'BDT', currencySymbol)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost, 'BDT', currencySymbol)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span>{formatCurrency(grandTotal, 'BDT', currencySymbol)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2"
                style={{ backgroundColor: primaryColor }}
              >
                <span>Proceed to 1-Page Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
