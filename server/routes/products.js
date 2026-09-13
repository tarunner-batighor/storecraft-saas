import express from 'express';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

router.use(requireTenant);

// GET /api/products (Public Storefront & Admin listing)
router.get('/', (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      min_price,
      max_price,
      in_stock,
      featured,
      flash_deal,
      sort = 'newest',
      limit = 100,
      page = 1
    } = req.query;

    let products = db.find('products', {}, req.tenant.id);

    if (req.query.all !== 'true') {
      products = products.filter(p => p.is_published !== false);
    }

    if (category) {
      const cat = db.findOne('categories', c => c.id === category || c.slug === category, req.tenant.id);
      if (cat) {
        products = products.filter(p => p.category_id === cat.id);
      }
    }

    if (brand) {
      const b = db.findOne('brands', br => br.id === brand || br.slug === brand, req.tenant.id);
      if (b) {
        products = products.filter(p => p.brand_id === b.id);
      }
    }

    if (featured === 'true') {
      products = products.filter(p => p.is_featured);
    }
    if (flash_deal === 'true') {
      products = products.filter(p => p.is_flash_deal);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (min_price !== undefined && min_price !== '') {
      products = products.filter(p => p.price >= Number(min_price));
    }
    if (max_price !== undefined && max_price !== '') {
      products = products.filter(p => p.price <= Number(max_price));
    }

    if (in_stock === 'true') {
      products = products.filter(p => (p.stock_quantity || 0) > 0);
    }

    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    } else if (sort === 'popular') {
      products.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
    } else {
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    const categories = db.find('categories', {}, req.tenant.id);
    const brands = db.find('brands', {}, req.tenant.id);
    const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
    const brandMap = Object.fromEntries(brands.map(b => [b.id, b.name]));

    const enriched = products.map(p => ({
      ...p,
      category_name: catMap[p.category_id] || 'General',
      brand_name: brandMap[p.brand_id] || null
    }));

    res.json({
      success: true,
      count: enriched.length,
      products: enriched
    });
  } catch (err) {
    console.error('[Products List Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const categories = db.find('categories', {}, req.tenant.id);
  const products = db.find('products', {}, req.tenant.id);
  const result = categories.map(cat => ({
    ...cat,
    product_count: products.filter(p => p.category_id === cat.id).length
  }));
  res.json({ success: true, categories: result });
});

// GET /api/products/brands
router.get('/brands', (req, res) => {
  const brands = db.find('brands', {}, req.tenant.id);
  res.json({ success: true, brands });
});

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = db.findOne('products', p => (p.id === idOrSlug || p.slug === idOrSlug), req.tenant.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const category = product.category_id ? db.findById('categories', product.category_id, req.tenant.id) : null;
  const brand = product.brand_id ? db.findById('brands', product.brand_id, req.tenant.id) : null;
  const reviews = db.find('reviews', { product_id: product.id }, req.tenant.id);
  const related = db.find('products', p => p.id !== product.id && p.category_id === product.category_id, req.tenant.id).slice(0, 4);

  res.json({
    success: true,
    product: {
      ...product,
      category_name: category ? category.name : null,
      brand_name: brand ? brand.name : null,
      reviews,
      related_products: related
    }
  });
});

// ================= ADMIN PRODUCT MANAGEMENT =================
router.use(verifyAuth);
router.use(requireTenantStaff);

// POST /api/products
router.post('/', (req, res) => {
  try {
    const currentCount = db.count('products', {}, req.tenant.id);
    const plan = db.findById('plans', req.tenant.plan_id);
    const maxAllowed = plan ? plan.max_products : 15;

    if (currentCount >= maxAllowed) {
      return res.status(403).json({
        success: false,
        message: `Product limit reached for your ${plan ? plan.name : 'current'} plan (Max: ${maxAllowed}). Please upgrade your SaaS plan to add more products.`
      });
    }

    const {
      name,
      slug,
      sku,
      barcode,
      category_id,
      brand_id,
      type = 'physical',
      price,
      compare_at_price,
      cost_price,
      stock_quantity = 0,
      low_stock_threshold = 5,
      track_quantity = true,
      is_published = true,
      is_featured = false,
      is_flash_deal = false,
      flash_deal_discount = 0,
      short_description = '',
      description = '',
      images = [],
      variants = [],
      attributes = [],
      tags = []
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name and price are required' });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newProduct = db.insert('products', {
      tenant_id: req.tenant.id,
      name,
      slug: cleanSlug,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      barcode: barcode || '',
      category_id: category_id || null,
      brand_id: brand_id || null,
      type,
      price: Number(price),
      compare_at_price: compare_at_price ? Number(compare_at_price) : null,
      cost_price: cost_price ? Number(cost_price) : null,
      stock_quantity: Number(stock_quantity),
      low_stock_threshold: Number(low_stock_threshold),
      track_quantity: Boolean(track_quantity),
      is_published: Boolean(is_published),
      is_featured: Boolean(is_featured),
      is_flash_deal: Boolean(is_flash_deal),
      flash_deal_discount: Number(flash_deal_discount),
      short_description,
      description,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      variants: Array.isArray(variants) ? variants : [],
      attributes: Array.isArray(attributes) ? attributes : [],
      tags: Array.isArray(tags) ? tags : [],
      rating_avg: 5.0,
      rating_count: 0
    }, req.tenant.id);

    db.insert('audit_logs', {
      tenant_id: req.tenant.id,
      user_id: req.user.id,
      action: 'product_created',
      entity_type: 'product',
      entity_id: newProduct.id,
      details: `Created product: ${newProduct.name}`
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (err) {
    console.error('[Product Create Error]', err);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.findById('products', id, req.tenant.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.compare_at_price !== undefined) updates.compare_at_price = updates.compare_at_price ? Number(updates.compare_at_price) : null;
    if (updates.cost_price !== undefined) updates.cost_price = updates.cost_price ? Number(updates.cost_price) : null;
    if (updates.stock_quantity !== undefined) updates.stock_quantity = Number(updates.stock_quantity);

    const updated = db.update('products', id, updates, req.tenant.id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

router.patch('/:id/stock', (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;
  if (stock_quantity === undefined) {
    return res.status(400).json({ success: false, message: 'stock_quantity is required' });
  }
  const updated = db.update('products', id, { stock_quantity: Number(stock_quantity) }, req.tenant.id);
  res.json({ success: true, message: 'Stock updated', product: updated });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const deleted = db.delete('products', id, req.tenant.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

router.post('/categories', (req, res) => {
  const { name, slug, description, image, icon, is_featured, sort_order } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

  const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat = db.insert('categories', {
    tenant_id: req.tenant.id,
    name,
    slug: cleanSlug,
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    icon: icon || 'Tag',
    is_featured: Boolean(is_featured),
    sort_order: Number(sort_order) || 0
  }, req.tenant.id);

  res.status(201).json({ success: true, message: 'Category created', category: newCat });
});

router.put('/categories/:id', (req, res) => {
  const updated = db.update('categories', req.params.id, req.body, req.tenant.id);
  res.json({ success: true, message: 'Category updated', category: updated });
});

router.delete('/categories/:id', (req, res) => {
  db.delete('categories', req.params.id, req.tenant.id);
  res.json({ success: true, message: 'Category deleted' });
});

export default router;
