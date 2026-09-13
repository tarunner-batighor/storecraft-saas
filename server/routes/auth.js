const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { generateToken, verifyAuth, requireAuth } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password, tenant_id } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.findOne('users', u => {
      if (u.email.toLowerCase() !== email.toLowerCase()) return false;
      // If logging in to a specific tenant (customer/staff), check tenant_id
      if (tenant_id && u.role !== 'super_admin') {
        return u.tenant_id === tenant_id;
      }
      return true;
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user not found.' });
    }

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Your account is deactivated.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[Auth Login Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/register (Customer Registration or Tenant Owner Registration)
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer', tenant_id, store_name, store_slug } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // If registering as a new store owner (Create Tenant Wizard)
    if (role === 'store_owner') {
      const existingUser = db.findOne('users', { email: email.toLowerCase() });
      if (existingUser && existingUser.role === 'store_owner') {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const slug = (store_slug || store_name || 'my-store')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingTenant = db.findOne('tenants', { slug });
      if (existingTenant) {
        return res.status(400).json({ success: false, message: 'Store subdomain / slug is already taken.' });
      }

      // Create new tenant
      const newTenant = db.insert('tenants', {
        name: store_name || `${name}'s Store`,
        slug: slug,
        custom_domain: null,
        status: 'active',
        plan_id: 'plan-starter',
        plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
        branding: {
          tagline: 'Welcome to our premium online shop',
          logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=150&q=80',
          favicon: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=64&q=80',
          primary_color: '#0f766e',
          secondary_color: '#1e293b',
          accent_color: '#f59e0b',
          font: 'Inter',
          top_bar_text: '⚡ Free Shipping on your first order! Use code: FIRST10',
          top_bar_enabled: true,
          currency: 'BDT',
          currency_symbol: '৳',
          contact_email: email,
          contact_phone: phone || '+880 1700-000000',
          address: 'Dhaka, Bangladesh',
          footer_text: `© ${new Date().getFullYear()} ${store_name || name}. All rights reserved.`,
          social_links: { facebook: '', instagram: '' },
          hero_slides: [
            {
              id: 'slide-default-1',
              title: `Welcome to ${store_name || name}`,
              subtitle: 'Discover our exclusive range of curated products',
              badge: 'NEW OPENING',
              button_text: 'Start Shopping',
              button_link: '/catalog',
              bg_gradient: 'from-slate-900 via-teal-950 to-slate-900',
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        courier_settings: {
          pathao: { enabled: true, client_id: 'PATHAO_DEMO', default: true },
          steadfast: { enabled: false }
        },
        payment_settings: {
          cod_enabled: true,
          bkash_enabled: true,
          bkash_type: 'Personal',
          bkash_number: phone || '01700000000',
          stripe_enabled: false
        }
      });

      // Default Category
      const defaultCategory = db.insert('categories', {
        tenant_id: newTenant.id,
        name: 'Featured Collection',
        slug: 'featured-collection',
        description: 'Our top trending products',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
        icon: 'Sparkles',
        is_featured: true,
        sort_order: 1
      });

      // Default Shipping Zone
      db.insert('shipping_zones', {
        tenant_id: newTenant.id,
        name: 'Standard Home Delivery',
        cities: ['All Districts'],
        rate: 60,
        free_shipping_threshold: 2000,
        estimated_days: '2-3 Days'
      });

      // Create owner user
      const passwordHash = bcrypt.hashSync(password, 8);
      const newUser = db.insert('users', {
        tenant_id: newTenant.id,
        role: 'store_owner',
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        phone: phone || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        permissions: ['all'],
        is_active: true
      });

      const token = generateToken(newUser);
      const { password_hash, ...safeUser } = newUser;

      return res.status(201).json({
        success: true,
        message: 'Store created successfully!',
        token,
        user: safeUser,
        tenant: newTenant
      });
    }

    // Customer Registration for a specific Tenant
    const activeTenantId = tenant_id || req.tenantId;
    if (!activeTenantId) {
      return res.status(400).json({ success: false, message: 'Store context is required for customer registration.' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase() && u.tenant_id === activeTenantId);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists in this store.' });
    }

    const passwordHash = bcrypt.hashSync(password, 8);
    const newCustomer = db.insert('users', {
      tenant_id: activeTenantId,
      role: 'customer',
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      addresses: [],
      permissions: [],
      is_active: true
    });

    const token = generateToken(newCustomer);
    const { password_hash, ...safeUser } = newCustomer;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[Auth Register Error]', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', verifyAuth, (req, res) => {
  if (!req.user) {
    return res.json({ success: true, user: null, isAuthenticated: false });
  }
  const { password_hash, ...safeUser } = req.user;
  let tenant = null;
  if (req.user.tenant_id) {
    tenant = db.findById('tenants', req.user.tenant_id);
  }
  res.json({
    success: true,
    user: safeUser,
    tenant,
    isAuthenticated: true
  });
});

// POST /api/auth/demo-switch (Switch between demo accounts easily in 1-click)
router.post('/demo-switch', (req, res) => {
  try {
    const { role, tenant_slug, user_id } = req.body;
    let targetUser = null;

    if (user_id) {
      targetUser = db.findById('users', user_id);
    } else if (role === 'super_admin') {
      targetUser = db.findOne('users', { role: 'super_admin' });
    } else if (role === 'store_owner') {
      const tenant = tenant_slug ? db.findOne('tenants', { slug: tenant_slug }) : db.find('tenants')[0];
      if (tenant) {
        targetUser = db.findOne('users', { tenant_id: tenant.id, role: 'store_owner' });
      }
    } else if (role === 'store_staff') {
      const tenant = tenant_slug ? db.findOne('tenants', { slug: tenant_slug }) : db.find('tenants')[0];
      if (tenant) {
        targetUser = db.findOne('users', { tenant_id: tenant.id, role: 'store_staff' }) || db.findOne('users', { tenant_id: tenant.id, role: 'store_owner' });
      }
    } else if (role === 'customer') {
      const tenant = tenant_slug ? db.findOne('tenants', { slug: tenant_slug }) : db.find('tenants')[0];
      if (tenant) {
        targetUser = db.findOne('users', { tenant_id: tenant.id, role: 'customer' });
      }
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Demo user not found for this role/store' });
    }

    const token = generateToken(targetUser);
    const { password_hash, ...safeUser } = targetUser;
    const tenant = targetUser.tenant_id ? db.findById('tenants', targetUser.tenant_id) : null;

    res.json({
      success: true,
      token,
      user: safeUser,
      tenant
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Switch failed' });
  }
});

module.exports = router;
