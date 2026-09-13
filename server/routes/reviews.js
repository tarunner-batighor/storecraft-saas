import express from 'express';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(requireTenant);

router.get('/', (req, res) => {
  const { product_id } = req.query;
  let reviews = db.find('reviews', {}, req.tenant.id);

  if (product_id) {
    reviews = reviews.filter(r => r.product_id === product_id);
  }

  if (req.query.all !== 'true') {
    reviews = reviews.filter(r => r.is_approved !== false);
  }

  reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ success: true, reviews });
});

router.post('/', (req, res) => {
  try {
    const { product_id, customer_name, rating = 5, comment, photos = [] } = req.body;
    if (!product_id || !customer_name || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, customer name, and comment are required' });
    }

    const product = db.findById('products', product_id, req.tenant.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newReview = db.insert('reviews', {
      tenant_id: req.tenant.id,
      product_id,
      customer_id: req.body.customer_id || null,
      customer_name,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment,
      photos: Array.isArray(photos) ? photos : [],
      is_approved: true
    }, req.tenant.id);

    const allProductReviews = db.find('reviews', { product_id, is_approved: true }, req.tenant.id);
    const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / allProductReviews.length;
    
    db.update('products', product_id, {
      rating_avg: Number(avg.toFixed(1)),
      rating_count: allProductReviews.length
    }, req.tenant.id);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review: newReview
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

router.use(verifyAuth);
router.use(requireTenantStaff);

router.patch('/:id/approve', (req, res) => {
  const { is_approved } = req.body;
  const updated = db.update('reviews', req.params.id, { is_approved: Boolean(is_approved) }, req.tenant.id);
  res.json({ success: true, review: updated });
});

router.delete('/:id', (req, res) => {
  db.delete('reviews', req.params.id, req.tenant.id);
  res.json({ success: true, message: 'Review deleted' });
});

export default router;
