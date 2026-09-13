import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import db from './db.js';
import { resolveTenant } from './middleware/tenant.js';
import { verifyAuth } from './middleware/auth.js';
import { runSeed } from './seed.js';

import authRoutes from './routes/auth.js';
import platformRoutes from './routes/platform.js';
import tenantRoutes from './routes/tenant.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import couponsRoutes from './routes/coupons.js';
import shippingRoutes from './routes/shipping.js';
import reviewsRoutes from './routes/reviews.js';
import analyticsRoutes from './routes/analytics.js';
import courierRoutes from './routes/courier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(resolveTenant);

// TWA (Trusted Web Activity) Digital Asset Links verification
app.get('/.well-known/assetlinks.json', (req, res) => {
  const assetLinksPath = path.resolve(__dirname, '../public/assetlinks.json');
  if (fs.existsSync(assetLinksPath)) {
    res.setHeader('Content-Type', 'application/json');
    return res.sendFile(assetLinksPath);
  }
  res.json([]);
});

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

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/courier', courierRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: 'production',
    active_tenant: req.tenant ? req.tenant.name : 'Platform Scope'
  });
});

// Serve Frontend dist
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback for Single Page Application (SPA) client routes in Express 5
app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexFile = path.resolve(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  res.status(200).send('<h1>StoreCraft SaaS Server is Running</h1><p>Frontend assets are being built...</p>');
});

runSeed(false);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[StoreCraft Server] Multi-Tenant SaaS API running on http://0.0.0.0:${PORT}`);
});
