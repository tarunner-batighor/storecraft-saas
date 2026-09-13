import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  ArrowRight,
  AlertCircle,
  Tag,
  Loader2,
  Lock
} from 'lucide-react';

export default function StoreCheckoutPage() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const {
    cart,
    clearCart,
    subtotal,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    shippingCost,
    grandTotal
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingZones, setShippingZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: 'Dhaka',
    area: '',
    address: '',
    customer_notes: '',
    payment_method: 'cod',
    payment_trx_id: ''
  });

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch Shipping Zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get('/shipping/zones');
        if (res.success && res.zones && res.zones.length > 0) {
          setShippingZones(res.zones);
          setSelectedZone(res.zones[0]);
        }
      } catch (err) {}
    };
    fetchZones();
  }, [currentSlug]);

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to={`/store/${currentSlug}/catalog`}
          className="inline-block px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md"
          style={{ backgroundColor: primaryColor }}
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  // Calculate dynamic shipping based on selectedZone
  let effectiveShipping = 60;
  if (selectedZone) {
    if (selectedZone.free_shipping_threshold && subtotal >= selectedZone.free_shipping_threshold) {
      effectiveShipping = 0;
    } else {
      effectiveShipping = selectedZone.rate || 0;
    }
  }

  const effectiveGrandTotal = Math.max(0, subtotal - discountAmount + effectiveShipping);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCodeInput);
    setCouponLoading(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please enter your Name, Phone Number, and Delivery Address.');
      return;
    }

    if (formData.payment_method === 'bkash' && !formData.payment_trx_id.trim()) {
      setErrorMsg('Please enter your bKash Transaction ID (TRX ID).');
      return;
    }

    if (formData.payment_method === 'nagad' && !formData.payment_trx_id.trim()) {
      setErrorMsg('Please enter your Nagad Transaction ID (TRX ID).');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_id: user?.id || null,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        shipping_address: {
          recipient_name: formData.name,
          phone: formData.phone,
          city: formData.city,
          area: formData.area,
          street_address: formData.address
        },
        items: cart.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        shipping_zone_id: selectedZone ? selectedZone.id : null,
        payment_method: formData.payment_method,
        payment_trx_id: formData.payment_trx_id || null,
        customer_notes: formData.customer_notes
      };

      const res = await api.post('/orders/checkout', orderPayload);

      if (res.success && res.order) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        clearCart();
        navigate(`/store/${currentSlug}/order-success/${res.order.order_number}`, {
          state: { order: res.order }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentSettings = currentTenant?.payment_methods || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <span>Secure 1-Page Checkout</span>
          </h1>
          <p className="text-xs text-slate-500">Fast & hassle-free order placement</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Contact, Address, Shipping & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Customer Contact */}
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">1</span>
              <span>Customer Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hossain"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Optional for Invoice Receipt)
                </label>
                <input
                  type="email"
                  placeholder="tanvir@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">2</span>
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City / District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Comilla">Comilla</option>
                  <option value="Other District">Other District</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Area / Thana
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Gulshan, Agrabad"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Street Address & House/Flat Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House #, Road #, Sector/Block, Landmark details..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please call before arrival, deliver after 2 PM"
                  value={formData.customer_notes}
                  onChange={(e) => setFormData({ ...formData, customer_notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Shipping Method */}
          {shippingZones.length > 0 && (
            <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">3</span>
                <span>Select Shipping Zone</span>
              </h2>

              <div className="space-y-2">
                {shippingZones.map((zone) => {
                  const isFree = zone.free_shipping_threshold && subtotal >= zone.free_shipping_threshold;
                  return (
                    <label
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                        selectedZone?.id === zone.id
                          ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="shipping_zone"
                          checked={selectedZone?.id === zone.id}
                          onChange={() => setSelectedZone(zone)}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{zone.name}</div>
                          <div className="text-[11px] text-slate-500">Est. Time: {zone.estimated_days || '2-3 Days'}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isFree ? (
                          <span className="text-emerald-600 uppercase font-black">FREE</span>
                        ) : (
                          formatCurrency(zone.rate, 'BDT', currencySymbol)
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center">4</span>
              <span>Choose Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                onClick={() => setFormData({ ...formData, payment_method: 'cod' })}
                className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  formData.payment_method === 'cod'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                  className="mt-1 text-sky-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay in cash when your parcel arrives at your doorstep.</p>
                </div>
              </label>

              {/* bKash Payment */}
              <label
                onClick={() => setFormData({ ...formData, payment_method: 'bkash' })}
                className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  formData.payment_method === 'bkash'
                    ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/40 ring-1 ring-pink-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="bkash"
                  checked={formData.payment_method === 'bkash'}
                  onChange={() => setFormData({ ...formData, payment_method: 'bkash' })}
                  className="mt-1 text-pink-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">bKash Mobile Payment</span>
                    <span className="text-[10px] bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded font-semibold">Instant</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pay via bKash App or USSD to <strong>{paymentSettings.bkash_number || '01700000000'}</strong>
                  </p>

                  {formData.payment_method === 'bkash' && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-pink-200 dark:border-pink-900/50 space-y-2">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {paymentSettings.bkash_instructions || 'Please send money/payment to the number above and enter Transaction ID below.'}
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. BKB902319984"
                        value={formData.payment_trx_id}
                        onChange={(e) => setFormData({ ...formData, payment_trx_id: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white uppercase font-mono"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Credit/Debit Cards */}
              <label
                onClick={() => setFormData({ ...formData, payment_method: 'card' })}
                className={`flex items-start space-x-3 p-3.5 rounded-xl border cursor-pointer transition ${
                  formData.payment_method === 'card'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={() => setFormData({ ...formData, payment_method: 'card' })}
                  className="mt-1 text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Visa / Mastercard / Amex</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Secure card payment with instant order confirmation.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Order Summary, Promo Code & Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 sticky top-24 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-3">
              Order Summary ({cart.length} items)
            </h2>

            {/* Cart Items Preview */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex space-x-3 items-center text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <span className="text-slate-500 text-[11px]">Qty: {item.quantity} × {formatCurrency(item.price, 'BDT', currencySymbol)}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0">
                    {formatCurrency(item.price * item.quantity, 'BDT', currencySymbol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Promo Box */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(discountAmount, 'BDT', currencySymbol)})</span>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-slate-400 hover:text-rose-500">×</button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl uppercase font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCodeInput.trim()}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(subtotal, 'BDT', currencySymbol)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount, 'BDT', currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {effectiveShipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(effectiveShipping, 'BDT', currencySymbol)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Grand Total</span>
                <span>{formatCurrency(effectiveGrandTotal, 'BDT', currencySymbol)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-xl hover:shadow-2xl transition flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
