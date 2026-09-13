const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireTenant } = require('../middleware/tenant');
const { verifyAuth, requireTenantStaff } = require('../middleware/auth');

router.use(requireTenant);

// POST /api/orders/checkout (Public Checkout for Customer/Guest)
router.post('/checkout', (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      coupon_code,
      shipping_zone_id,
      payment_method = 'cod',
      payment_trx_id = null,
      customer_notes = ''
    } = req.body;

    if (!customer_name || !customer_phone || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and valid cart items are required to place an order.'
      });
    }

    // 1. Calculate subtotal & verify stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = db.findById('products', item.product_id, req.tenant.id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ID '${item.product_id}' not found in store.` });
      }

      let unitPrice = product.price;
      let variantName = '';
      let sku = product.sku;

      if (item.variant_id && product.variants && product.variants.length > 0) {
        const variant = product.variants.find(v => v.id === item.variant_id);
        if (variant) {
          unitPrice = variant.price;
          variantName = variant.name;
          sku = variant.sku || product.sku;
          // Check stock
          if (product.track_quantity && (variant.stock_quantity !== undefined && variant.stock_quantity < item.quantity)) {
            return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} (${variant.name}). Only ${variant.stock_quantity} left.` });
          }
        }
      } else {
        if (product.track_quantity && (product.stock_quantity !== undefined && product.stock_quantity < item.quantity)) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} left.` });
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product_id: product.id,
        variant_id: item.variant_id || null,
        name: variantName ? `${product.name} (${variantName})` : product.name,
        sku: sku,
        price: unitPrice,
        quantity: item.quantity,
        total: itemTotal,
        image: item.image || (product.images && product.images[0]) || ''
      });
    }

    // 2. Shipping Cost calculation
    let shippingCost = 60; // Default
    if (shipping_zone_id) {
      const zone = db.findById('shipping_zones', shipping_zone_id, req.tenant.id);
      if (zone) {
        if (zone.free_shipping_threshold && subtotal >= zone.free_shipping_threshold) {
          shippingCost = 0;
        } else {
          shippingCost = zone.rate || 0;
        }
      }
    } else {
      // Find first shipping zone or default
      const zones = db.find('shipping_zones', {}, req.tenant.id);
      if (zones.length > 0) {
        const zone = zones[0];
        if (zone.free_shipping_threshold && subtotal >= zone.free_shipping_threshold) {
          shippingCost = 0;
        } else {
          shippingCost = zone.rate || 0;
        }
      }
    }

    // 3. Coupon Discount calculation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon_code) {
      const coupon = db.findOne('coupons', c => c.code.toUpperCase() === coupon_code.toUpperCase() && c.is_active, req.tenant.id);
      if (coupon) {
        if (!coupon.min_order_amount || subtotal >= coupon.min_order_amount) {
          if (coupon.type === 'percentage') {
            discountAmount = Math.round((subtotal * coupon.value) / 100);
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
              discountAmount = coupon.max_discount;
            }
          } else if (coupon.type === 'fixed') {
            discountAmount = Math.min(coupon.value, subtotal);
          } else if (coupon.type === 'free_shipping') {
            discountAmount = shippingCost;
            shippingCost = 0;
          }

          appliedCoupon = coupon.code;
          // Increment coupon usage
          db.update('coupons', coupon.id, { usage_count: (coupon.usage_count || 0) + 1 }, req.tenant.id);
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

    // 4. Reduce stock
    for (const item of items) {
      const product = db.findById('products', item.product_id, req.tenant.id);
      if (product && product.track_quantity) {
        if (item.variant_id && product.variants) {
          const updatedVariants = product.variants.map(v => {
            if (v.id === item.variant_id) {
              return { ...v, stock_quantity: Math.max(0, (v.stock_quantity || 0) - item.quantity) };
            }
            return v;
          });
          const totalVariantStock = updatedVariants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
          db.update('products', product.id, {
            variants: updatedVariants,
            stock_quantity: totalVariantStock
          }, req.tenant.id);
        } else {
          db.update('products', product.id, {
            stock_quantity: Math.max(0, (product.stock_quantity || 0) - item.quantity)
          }, req.tenant.id);
        }
      }
    }

    // 5. Generate unique store order number (e.g. GV-2026-1045)
    const storePrefix = (req.tenant.slug || 'SC').slice(0, 3).toUpperCase();
    const currentYear = new Date().getFullYear();
    const existingCount = db.count('orders', {}, req.tenant.id);
    const orderNumber = `${storePrefix}-${currentYear}-${1001 + existingCount}`;

    // 6. Payment status logic
    let paymentStatus = 'unpaid';
    if (payment_method === 'bkash' && payment_trx_id) {
      paymentStatus = 'paid';
    } else if (payment_method === 'stripe' || payment_method === 'card') {
      paymentStatus = 'paid';
    }

    // 7. Insert Order
    const newOrder = db.insert('orders', {
      order_number: orderNumber,
      tenant_id: req.tenant.id,
      customer_id: req.body.customer_id || null,
      customer_name,
      customer_email: customer_email || '',
      customer_phone,
      shipping_address: shipping_address || {
        recipient_name: customer_name,
        phone: customer_phone,
        city: 'Dhaka',
        area: '',
        street_address: req.body.address || ''
      },
      items: validatedItems,
      subtotal,
      discount_amount: discountAmount,
      coupon_code: appliedCoupon,
      shipping_cost: shippingCost,
      total_amount: totalAmount,
      payment_method,
      payment_status: paymentStatus,
      payment_trx_id: payment_trx_id || null,
      status: 'pending',
      courier_name: null,
      courier_tracking_id: null,
      courier_consignment_id: null,
      timeline: [
        {
          status: 'pending',
          note: `Order placed online via ${payment_method.toUpperCase()}`,
          created_at: new Date().toISOString(),
          created_by: customer_name
        }
      ],
      customer_notes,
      admin_notes: ''
    }, req.tenant.id);

    // Create In-App Notification for Store Owner
    db.insert('notifications', {
      tenant_id: req.tenant.id,
      title: 'New Order Received!',
      message: `Order #${newOrder.order_number} for ৳${newOrder.total_amount.toLocaleString()} by ${customer_name}`,
      type: 'order',
      is_read: false,
      link: `/admin/orders/${newOrder.id}`
    }, req.tenant.id);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('[Order Checkout Error]', err);
    res.status(500).json({ success: false, message: 'Failed to complete checkout' });
  }
});

// GET /api/orders/track/:orderNumber (Public Order Tracking)
router.get('/track/:orderNumber', (req, res) => {
  const { orderNumber } = req.params;
  const order = db.findOne('orders', o => (o.order_number === orderNumber || o.id === orderNumber), req.tenant.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found with this tracking ID' });
  }

  // Return public safe view of order
  res.json({
    success: true,
    order: {
      order_number: order.order_number,
      created_at: order.created_at,
      status: order.status,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      courier_name: order.courier_name,
      courier_tracking_id: order.courier_tracking_id,
      timeline: order.timeline,
      total_amount: order.total_amount,
      items: order.items,
      shipping_address: {
        city: order.shipping_address?.city,
        area: order.shipping_address?.area
      }
    }
  });
});

// ================= AUTHENTICATED STAFF ORDER ROUTES =================
router.use(verifyAuth);

// GET /api/orders/my-orders (For Customer Portal)
router.get('/my-orders', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Login required' });
  }
  const orders = db.find('orders', o => o.customer_id === req.user.id || (req.user.phone && o.customer_phone === req.user.phone), req.tenant.id);
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ success: true, orders });
});

// Staff permissions required below
router.use(requireTenantStaff);

// GET /api/orders (Staff List orders)
router.get('/', (req, res) => {
  try {
    const { status, search, payment_status } = req.query;
    let orders = db.find('orders', {}, req.tenant.id);

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }
    if (payment_status && payment_status !== 'all') {
      orders = orders.filter(o => o.payment_status === payment_status);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      orders = orders.filter(o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        (o.customer_email && o.customer_email.toLowerCase().includes(q))
      );
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id (Staff View Single Order)
router.get('/:id', (req, res) => {
  const order = db.findOne('orders', o => (o.id === req.params.id || o.order_number === req.params.id), req.tenant.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// PATCH /api/orders/:id/status (Update order status & append timeline)
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, note, admin_notes } = req.body;

    const order = db.findOne('orders', o => (o.id === id || o.order_number === id), req.tenant.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedTimeline = [...(order.timeline || [])];
    if (status && status !== order.status) {
      updatedTimeline.push({
        status,
        note: note || `Order status updated to ${status.toUpperCase()}`,
        created_at: new Date().toISOString(),
        created_by: req.user.name || 'Store Staff'
      });
    }

    const updated = db.update('orders', order.id, {
      ...(status ? { status } : {}),
      ...(payment_status ? { payment_status } : {}),
      ...(admin_notes !== undefined ? { admin_notes } : {}),
      timeline: updatedTimeline
    }, req.tenant.id);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

// POST /api/orders/:id/courier-book (Courier Consignment Dispatch Integration)
router.post('/:id/courier-book', (req, res) => {
  try {
    const { id } = req.params;
    const { courier_name = 'Pathao Courier', recipient_city, weight_kg = 1, special_instruction = '' } = req.body;

    const order = db.findOne('orders', o => (o.id === id || o.order_number === id), req.tenant.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate authentic mock tracking & consignment details
    const courierPrefix = courier_name.includes('Pathao') ? 'PT' : courier_name.includes('Steadfast') ? 'STDF' : 'RDX';
    const trackingId = `${courierPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const consignmentId = `CN-${Date.now().toString().slice(-8)}`;

    const updatedTimeline = [...(order.timeline || []), {
      status: 'shipped',
      note: `Booked consignment with ${courier_name}. Tracking ID: ${trackingId}`,
      created_at: new Date().toISOString(),
      created_by: req.user.name || 'Store Staff'
    }];

    const updated = db.update('orders', order.id, {
      status: 'shipped',
      courier_name,
      courier_tracking_id: trackingId,
      courier_consignment_id: consignmentId,
      timeline: updatedTimeline
    }, req.tenant.id);

    res.json({
      success: true,
      message: `Consignment created successfully on ${courier_name}!`,
      consignment: {
        courier_name,
        tracking_id: trackingId,
        consignment_id: consignmentId,
        status: 'In Transit',
        order: updated
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Courier booking failed' });
  }
});

// GET /api/orders/:id/invoice (Printable Invoice / Packing Slip Generator Data)
router.get('/:id/invoice', (req, res) => {
  const order = db.findOne('orders', o => (o.id === req.params.id || o.order_number === req.params.id), req.tenant.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const tenant = db.findById('tenants', req.tenant.id);

  res.json({
    success: true,
    invoice: {
      invoice_number: `INV-${order.order_number}`,
      date: order.created_at,
      store: {
        name: tenant.name,
        tagline: tenant.branding?.tagline,
        logo: tenant.branding?.logo,
        address: tenant.branding?.address,
        phone: tenant.branding?.contact_phone,
        email: tenant.branding?.contact_email,
        currency_symbol: tenant.branding?.currency_symbol || '৳'
      },
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
        shipping_address: order.shipping_address
      },
      items: order.items,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      coupon_code: order.coupon_code,
      shipping_cost: order.shipping_cost,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      courier_name: order.courier_name,
      courier_tracking_id: order.courier_tracking_id,
      customer_notes: order.customer_notes
    }
  });
});

module.exports = router;
