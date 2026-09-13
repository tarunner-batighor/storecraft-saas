const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const { resolveTenant } = require('./middleware/tenant');
const { verifyAuth } = require('./middleware/auth');
const { runSeed } = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tenant Context Resolver for all requests
app.use(resolveTenant);

// Public SaaS Platform routes (For landing page, store explorer, pricing)
app.get('/api/public/stores', (req, res) => {
  const tenants = db.find('tenants', { status: 'active' });
  const plans = db.find('plans');
  const safeStores = tenants.map(t => {
    const plan = plans.find(p => p.id === t.plan_id);
    const productCount = db.count('products', {}, t.id);
    return {
      id: t.id,
      name: t.name,
      slug: t.slug,
      custom_domain: t.custom_domain,
      branding: t.branding,
      plan_name: plan ? plan.name : 'Starter',
      product_count: productCount
    };
  });
  res.json({ success: true, stores: safeStores });
});

app.get('/api/public/plans', (req, res) => {
  const plans = db.find('plans');
  res.json({ success: true, plans });
});

// Notifications endpoint (Tenant scoped)
app.get('/api/notifications', verifyAuth, (req, res) => {
  if (!req.tenantId) {
    return res.json({ success: true, notifications: [] });
  }
  const notifications = db.find('notifications', {}, req.tenantId);
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json({ success: true, notifications: notifications.slice(0, 10) });
});

app.patch('/api/notifications/read-all', verifyAuth, (req, res) => {
  if (req.tenantId) {
    const notifications = db.find('notifications', {}, req.tenantId);
    notifications.forEach(n => {
      db.update('notifications', n.id, { is_read: true }, req.tenantId);
    });
  }
  res.json({ success: true });
});

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/platform', require('./routes/platform'));
app.use('/api/tenant', require('./routes/tenant'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/shipping', require('./routes/shipping'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/courier', require('./routes/courier'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: 'production',
    active_tenant: req.tenant ? req.tenant.name : 'Platform Scope'
  });
});

// Serve Frontend dist in production if available
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.method === 'GET') {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Seed data check on startup
runSeed(false);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[StoreCraft Server] Multi-Tenant SaaS API running on http://0.0.0.0:${PORT}`);
});
