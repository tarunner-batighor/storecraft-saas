import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { requireTenant } from '../middleware/tenant.js';
import { verifyAuth, requireTenantStaff } from '../middleware/auth.js';

const router = express.Router();

// Public Store Info endpoint (Used by storefront for branding, colors, logos, banners)
router.get('/info', requireTenant, (req, res) => {
  const tenant = req.tenant;
  res.json({
    success: true,
    store: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      custom_domain: tenant.custom_domain,
      branding: tenant.branding,
      payment_methods: {
        cod: tenant.payment_settings?.cod_enabled ?? true,
        bkash: tenant.payment_settings?.bkash_enabled ?? true,
        bkash_type: tenant.payment_settings?.bkash_type,
        bkash_number: tenant.payment_settings?.bkash_number,
        bkash_instructions: tenant.payment_settings?.bkash_instructions,
        nagad: tenant.payment_settings?.nagad_enabled ?? false,
        nagad_number: tenant.payment_settings?.nagad_number,
        stripe: tenant.payment_settings?.stripe_enabled ?? false,
        stripe_public_key: tenant.payment_settings?.stripe_public_key
      }
    }
  });
});

// Authenticated Store Settings endpoints (Owner/Staff only)
router.use(verifyAuth);
router.use(requireTenant);
router.use(requireTenantStaff);

// GET /api/tenant/settings
router.get('/settings', (req, res) => {
  const tenant = db.findById('tenants', req.tenant.id);
  const plan = db.findById('plans', tenant.plan_id);
  res.json({
    success: true,
    tenant,
    plan
  });
});

// PUT /api/tenant/branding
router.put('/branding', (req, res) => {
  try {
    const { branding, name } = req.body;
    const currentTenant = db.findById('tenants', req.tenant.id);
    
    const updatedBranding = {
      ...currentTenant.branding,
      ...branding
    };

    const updated = db.update('tenants', req.tenant.id, {
      ...(name ? { name } : {}),
      branding: updatedBranding
    });

    res.json({
      success: true,
      message: 'Store branding updated successfully!',
      tenant: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update branding' });
  }
});

// PUT /api/tenant/domain (Custom domain configuration)
router.put('/domain', (req, res) => {
  try {
    const { custom_domain } = req.body;
    const tenant = db.findById('tenants', req.tenant.id);
    const plan = db.findById('plans', tenant.plan_id);

    if (custom_domain && (!plan || !plan.custom_domain_allowed)) {
      return res.status(403).json({
        success: false,
        message: 'Custom domain is not supported on your current plan. Please upgrade to Starter or Growth plan.'
      });
    }

    const cleanDomain = custom_domain ? custom_domain.toLowerCase().trim().replace(/^https?:\/\//, '') : null;

    if (cleanDomain) {
      const existing = db.findOne('tenants', t => t.custom_domain === cleanDomain && t.id !== req.tenant.id);
      if (existing) {
        return res.status(400).json({ success: false, message: 'This custom domain is already mapped to another store.' });
      }
    }

    const updated = db.update('tenants', req.tenant.id, { custom_domain: cleanDomain });

    res.json({
      success: true,
      message: cleanDomain ? `Domain ${cleanDomain} mapped successfully! Point CNAME to cname.storecraft.io` : 'Custom domain removed',
      tenant: updated,
      dns_instructions: {
        record_type: 'CNAME',
        host: '@ or www',
        points_to: 'cname.storecraft.io',
        ssl_status: 'Active (Let\'s Encrypt Auto-Provisioned)'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Domain update failed' });
  }
});

// PUT /api/tenant/payments
router.put('/payments', (req, res) => {
  try {
    const { payment_settings } = req.body;
    const updated = db.update('tenants', req.tenant.id, { payment_settings });
    res.json({ success: true, message: 'Payment settings updated', payment_settings: updated.payment_settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update payments' });
  }
});

// PUT /api/tenant/couriers
router.put('/couriers', (req, res) => {
  try {
    const { courier_settings } = req.body;
    const updated = db.update('tenants', req.tenant.id, { courier_settings });
    res.json({ success: true, message: 'Courier integrations updated', courier_settings: updated.courier_settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update courier settings' });
  }
});

// GET /api/tenant/staff
router.get('/staff', (req, res) => {
  const staff = db.find('users', u => u.tenant_id === req.tenant.id && (u.role === 'store_owner' || u.role === 'store_staff'));
  const safeStaff = staff.map(({ password_hash, ...u }) => u);
  res.json({ success: true, staff: safeStaff });
});

// POST /api/tenant/staff (Add new staff)
router.post('/staff', (req, res) => {
  try {
    const { name, email, password, phone, permissions = ['orders.read', 'orders.write'] } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase() && u.tenant_id === req.tenant.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists in this store.' });
    }

    const passwordHash = bcrypt.hashSync(password, 8);
    const newStaff = db.insert('users', {
      tenant_id: req.tenant.id,
      role: 'store_staff',
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password_hash: passwordHash,
      permissions,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      is_active: true
    });

    const { password_hash, ...safeStaff } = newStaff;
    res.status(201).json({ success: true, message: 'Staff member added successfully', staff: safeStaff });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add staff' });
  }
});

// DELETE /api/tenant/staff/:id
router.delete('/staff/:id', (req, res) => {
  const target = db.findById('users', req.params.id, req.tenant.id);
  if (!target) return res.status(404).json({ success: false, message: 'Staff not found' });
  if (target.role === 'store_owner') {
    return res.status(400).json({ success: false, message: 'Cannot delete the store owner account' });
  }
  db.delete('users', req.params.id, req.tenant.id);
  res.json({ success: true, message: 'Staff member removed' });
});

export default router;
