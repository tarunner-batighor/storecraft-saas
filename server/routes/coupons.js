const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireTenant } = require('../middleware/tenant');
const { verifyAuth, requireTenantStaff } = require('../middleware/auth');

router.use(requireTenant);

// POST /api/coupons/validate (Public Validation for Checkout / Cart)
router.post('/validate', (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = db.findOne('coupons', c => c.code.toUpperCase() === code.toUpperCase() && c.is_active, req.tenant.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promo coupon.' });
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its maximum usage limit.' });
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ৳${coupon.min_order_amount.toLocaleString()} required for this coupon.`
      });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === 'free_shipping') {
      discount = 60; // Standard shipping offset
    }

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount_amount: discount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Coupon validation failed' });
  }
});

// Admin coupon management
router.use(verifyAuth);
router.use(requireTenantStaff);

// GET /api/coupons
router.get('/', (req, res) => {
  const coupons = db.find('coupons', {}, req.tenant.id);
  res.json({ success: true, coupons });
});

// POST /api/coupons
router.post('/', (req, res) => {
  try {
    const { code, type = 'percentage', value, min_order_amount = 0, max_discount = null, usage_limit = 100 } = req.body;
    if (!code || value === undefined) {
      return res.status(400).json({ success: false, message: 'Coupon code and discount value are required' });
    }

    const cleanCode = code.toUpperCase().trim();
    const existing = db.findOne('coupons', { code: cleanCode }, req.tenant.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const newCoupon = db.insert('coupons', {
      tenant_id: req.tenant.id,
      code: cleanCode,
      type,
      value: Number(value),
      min_order_amount: Number(min_order_amount) || 0,
      max_discount: max_discount ? Number(max_discount) : null,
      usage_limit: Number(usage_limit) || 100,
      usage_count: 0,
      is_active: true
    }, req.tenant.id);

    res.status(201).json({ success: true, message: 'Coupon created successfully', coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
});

// PUT /api/coupons/:id
router.put('/:id', (req, res) => {
  const updated = db.update('coupons', req.params.id, req.body, req.tenant.id);
  res.json({ success: true, message: 'Coupon updated', coupon: updated });
});

// DELETE /api/coupons/:id
router.delete('/:id', (req, res) => {
  db.delete('coupons', req.params.id, req.tenant.id);
  res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = router;
