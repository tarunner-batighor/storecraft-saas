import express from 'express';
import db from '../db.js';
import { verifyAuth, requireSuperAdmin } from '../middleware/auth.js';
import { runSeed } from '../seed.js';

const router = express.Router();

router.use(verifyAuth);
router.use(requireSuperAdmin);

router.get('/stats', (req, res) => {
  try {
    const tenants = db.find('tenants');
    const plans = db.find('plans');
    const orders = db.find('orders');
    const products = db.find('products');
    const users = db.find('users');

    const platformGMV = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
    const totalCommissions = orders.reduce((sum, ord) => sum + (ord.platform_commission_amount || 0), 0);

    let saasMRR = 0;
    tenants.forEach(t => {
      if (t.status === 'active') {
        const plan = plans.find(p => p.id === t.plan_id);
        if (plan) saasMRR += (plan.price_monthly || 0);
      }
    });

    res.json({
      success: true,
      stats: {
        total_tenants: tenants.length,
        active_tenants: tenants.filter(t => t.status === 'active').length,
        total_users: users.length,
        total_products: products.length,
        total_orders: orders.length,
        platform_gmv: platformGMV,
        total_commission_collected: totalCommissions,
        saas_mrr: saasMRR,
        saas_arr: saasMRR * 12,
        super_admin_bkash: '01766299775',
        super_admin_nagad: '01766299775',
        system_status: {
          uptime: '99.99%',
          db_status: 'Healthy (Row-Level Isolated)',
          server_time: new Date().toISOString()
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Stats error' });
  }
});

router.get('/tenants', (req, res) => {
  try {
    const tenants = db.find('tenants');
    const plans = db.find('plans');

    const result = tenants.map(t => {
      const plan = plans.find(p => p.id === t.plan_id);
      const storeProducts = db.count('products', {}, t.id);
      const storeOrders = db.find('orders', {}, t.id);
      const storeRevenue = storeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const storeCommissions = storeOrders.reduce((sum, o) => sum + (o.platform_commission_amount || 0), 0);
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
        commission_rate: plan ? plan.commission_percentage : 0,
        commission_earned: storeCommissions,
        owner_name: owner ? owner.name : 'N/A',
        owner_email: owner ? owner.email : 'N/A',
        products_count: storeProducts,
        orders_count: storeOrders.length,
        total_revenue: storeRevenue,
        branding: t.branding
      };
    });

    res.json({ success: true, tenants: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

router.put('/tenants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, plan_id, name, custom_domain } = req.body;
    const updated = db.update('tenants', id, {
      ...(status ? { status } : {}),
      ...(plan_id ? { plan_id } : {}),
      ...(name ? { name } : {}),
      ...(custom_domain !== undefined ? { custom_domain } : {})
    });
    res.json({ success: true, tenant: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

router.get('/plans', (req, res) => {
  const plans = db.find('plans');
  res.json({ success: true, plans });
});

router.get('/orders', (req, res) => {
  const orders = db.find('orders');
  const tenants = db.find('tenants');
  const enriched = orders.map(ord => ({
    ...ord,
    store_name: tenants.find(x => x.id === ord.tenant_id)?.name || 'Store'
  }));
  res.json({ success: true, orders: enriched });
});

router.post('/reset-seed', (req, res) => {
  runSeed(true);
  res.json({ success: true, message: 'Database reset & reseeded!' });
});

export default router;
