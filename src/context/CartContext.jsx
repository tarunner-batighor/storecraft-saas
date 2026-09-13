import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTenant } from './TenantContext';
import { api } from '../utils/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentSlug, currentTenant } = useTenant();
  const storageKey = `storecraft_cart_${currentSlug}`;
  const wishlistKey = `storecraft_wishlist_${currentSlug}`;

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(wishlistKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [selectedShippingZone, setSelectedShippingZone] = useState(null);

  // Sync cart to local storage when slug changes or cart changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCart(saved ? JSON.parse(saved) : []);
    } catch {
      setCart([]);
    }
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }, [currentSlug]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }, [cart, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist', e);
    }
  }, [wishlist, wishlistKey]);

  const addToCart = (product, variant = null, quantity = 1) => {
    const unitPrice = variant ? variant.price : product.price;
    const sku = variant ? variant.sku : product.sku;
    const variantName = variant ? variant.name : null;
    const image = (product.images && product.images[0]) || '';
    const itemId = variant ? `${product.id}-${variant.id}` : product.id;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product_id: product.id,
          variant_id: variant ? variant.id : null,
          name: variantName ? `${product.name} (${variantName})` : product.name,
          base_name: product.name,
          variant_name: variantName,
          sku,
          price: unitPrice,
          image,
          quantity
        }
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(p => p.id === productId);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Apply Coupon
  const applyCoupon = async (code) => {
    setCouponError('');
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code');
      return false;
    }

    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim(),
        subtotal
      });
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.coupon.discount_amount);
        return true;
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
  };

  // Shipping calculation
  let shippingCost = 60;
  if (selectedShippingZone) {
    if (selectedShippingZone.free_shipping_threshold && subtotal >= selectedShippingZone.free_shipping_threshold) {
      shippingCost = 0;
    } else {
      shippingCost = selectedShippingZone.rate || 0;
    }
  } else if (subtotal >= 3000) {
    shippingCost = 0;
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  return (
    <CartContext.Provider value={{
      cart,
      wishlist,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      subtotal,
      totalItemsCount,
      appliedCoupon,
      discountAmount,
      couponError,
      applyCoupon,
      removeCoupon,
      selectedShippingZone,
      setSelectedShippingZone,
      shippingCost,
      grandTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
