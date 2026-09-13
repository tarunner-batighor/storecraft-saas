const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyAuth, requireSuperAdmin } = require('../middleware/auth');
const { runSeed } = require('../seed');

// All platform routes require Super Admin auth
router.use(verifyAuth);
router.use(requireSuperAdmin);

// GET /api/platform/stats
router.get('/stats', (req, res) => {
  try {
    const tenants = db.find('tenants');
    const plans = db.find('plans');
    const orders = db.find('orders');
    const products = db.find('products');
    const users = db.find('users');

    // Calculate Platform GMV (Gross Merchandise Value across all stores)
    const platformGMV = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
    const totalOrdersCount = orders.length;

    // Calculate SaaS Monthly Recurring Revenue (MRR)
    let saasMRR = 0;
    tenants.forEach(t => {
      if (t.status === 'active') {
        const plan = plans.find(p => p.id === t.plan_id);
        if (plan) {
          saasMRR += (plan.price_monthly || 0);
        }
      }
    });

    // Plan distribution
    const planCounts = {};
    plans.forEach(p => planCounts[p.name] = 0);
    tenants.forEach(t => {
      const plan = plans.find(p => p.id === t.plan_id);
      if (plan) planCounts[plan.name] = (planCounts[plan.name] || 0) + 1;
    });

    // Recent 5 tenants
    const recentTenants = tenants.slice(-5).reverse().map(t => {
      const plan = plans.find(p => p.id === t.plan_id);
      const storeProducts = db.count('products', {}, t.id);
      const storeOrders = db.count('orders', {}, t.id);
      return {
        ...t,
        plan_name: plan ? plan.name : 'Unknown',
        products_count: storeProducts,
        orders_count: storeOrders
      };
    });

    res.json({
      success: true,
      stats: {
        total_tenants: tenants.length,
        active_tenants: tenants.filter(t => t.status === 'active').length,
        total_users: users.length,
        total_products: products.length,
        total_orders: totalOrdersCount,
        platform_gmv: platformGMV,
        saas_mrr: saasMRR,
        saas_arr: saasMRR * 12,
        plan_distribution: planCounts,
        recent_tenants: recentTenants,
        system_status: {
          uptime: '99.99%',
          db_status: 'Healthy (Row-Level Isolated)',
          server_time: new Date().toISOString()
        }
      }
    });
  } catch (err) {
    console.error('[Platform Stats Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch platform stats' });
  }
});

// GET /api/platform/tenants
router.get('/tenants', (req, res) => {
  try {
    const tenants = db.find('tenants');
    const plans = db.find('plans');

    const result = tenants.map(t => {
      const plan = plans.find(p => p.id === t.plan_id);
      const storeProducts = db.count('products', {}, t.id);
      const storeOrders = db.find('orders', {}, t.id);
      const storeRevenue = storeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const owner = db.findOne('users', { tenant_id: t.id, role: 'store_owner' });

      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        custom_domain: t.custom_domain,
        status: t.status,
        plan_id: t.plan_id,
        plan_name: plan ? plan.name : 'Free',
        plan_price: plan ? plan.price_monthly : 0,
        plan_expires_at: t.plan_expires_at,
        owner_name: owner ? owner.name : 'N/A',
        owner_email: owner ? owner.email : 'N/A',
        owner_phone: owner ? owner.phone : 'N/A',
        products_count: storeProducts,
        orders_count: storeOrders.length,
        total_revenue: storeRevenue,
        branding: t.branding,
        created_at: t.created_at
      };
    });

    res.json({ success: true, tenants: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tenants' });
  }
});

// PUT /api/platform/tenants/:id
router.put('/tenants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, plan_id, name, custom_domain } = req.body;

    const tenant = db.findById('tenants', id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const updated = db.update('tenants', id, {
      ...(status ? { status } : {}),
      ...(plan_id ? { plan_id } : {}),
      ...(name ? { name } : {}),
      ...(custom_domain !== undefined ? { custom_domain } : {})
    });

    res.json({ success: true, tenant: updated, message: 'Tenant updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update tenant' });
  }
});

// GET /api/platform/plans
router.get('/plans', (req, res) => {
  const plans = db.find('plans');
  res.json({ success: true, plans });
});

// PUT /api/platform/plans/:id
router.put('/plans/:id', (req, res) => {
  const { id } = req.params;
  const updated = db.update('plans', id, req.body);
  res.json({ success: true, plan: updated, message: 'Subscription plan updated' });
});

// GET /api/platform/invoices
router.get('/invoices', (req, res) => {
  const invoices = db.find('platform_invoices');
  res.json({ success: true, invoices });
});

// GET /api/platform/orders
router.get('/orders', (req, res) => {
  const orders = db.find('orders');
  const tenants = db.find('tenants');
  const enrichedOrders = orders.map(ord => {
    const t = tenants.find(x => x.id === ord.tenant_id);
    return {
      ...ord,
      store_name: t ? t.name : 'Unknown Store'
    };
  });
  res.json({ success: true, orders: enrichedOrders });
});

// POST /api/platform/reset-seed (Instant database reset & reseed)
router.post('/reset-seed', (req, res) => {
  try {
    runSeed(true);
    res.json({ success: true, message: 'Database reset and re-seeded with fresh demo stores!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset database' });
  }
});

module.exports = router;
