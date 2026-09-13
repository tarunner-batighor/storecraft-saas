import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, verifyAuth, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { email, password, tenant_id } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.findOne('users', u => {
      if (u.email.toLowerCase() !== email.toLowerCase()) return false;
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

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer', tenant_id, store_name, store_slug } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (role === 'store_owner') {
      const slug = (store_slug || store_name || 'my-store')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingTenant = db.findOne('tenants', { slug });
      if (existingTenant) {
        return res.status(400).json({ success: false, message: 'Store subdomain is already taken.' });
      }

      const newTenant = db.insert('tenants', {
        name: store_name || `${name}'s Store`,
        slug: slug,
        custom_domain: null,
        status: 'active',
        plan_id: 'plan-starter',
        plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        branding: {
          tagline: `স্বাগতম ${store_name || name}-এ`,
          logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80',
          primary_color: '#0284c7',
          secondary_color: '#0f172a',
          accent_color: '#f59e0b',
          top_bar_text: '⚡ ফ্রি হোম ডেলিভারি পেতে কোড ব্যবহার করুন: FIRST10',
          top_bar_enabled: true,
          currency: 'BDT',
          currency_symbol: '৳',
          contact_email: email,
          contact_phone: phone || '+880 1700-000000',
          address: 'Dhaka, Bangladesh',
          footer_text: `© ${new Date().getFullYear()} ${store_name || name}. All rights reserved.`,
          hero_slides: [
            {
              id: 'slide-default-1',
              title: `${store_name || name}`,
              subtitle: 'অনলাইনে সেরা কালেকশন ও দ্রুততম হোম ডেলিভারি',
              badge: 'NEW OPENING',
              button_text: 'কেনাকাটা করুন',
              button_link: '/catalog',
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
            }
          ]
        },
        courier_settings: { pathao: { enabled: true, default: true }, steadfast: { enabled: true } },
        payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: phone || '01700000000' }
      });

      const cat1 = db.insert('categories', {
        tenant_id: newTenant.id,
        name: 'Featured Collection',
        slug: 'featured-collection',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        is_featured: true,
        sort_order: 1
      }, newTenant.id);

      db.insert('shipping_zones', {
        tenant_id: newTenant.id,
        name: 'Standard Home Delivery',
        cities: ['All Districts'],
        rate: 60,
        free_shipping_threshold: 1500,
        estimated_days: '2-3 Days'
      }, newTenant.id);

      // Auto-create 3 Starter Products for immediate showcase
      db.insert('products', {
        tenant_id: newTenant.id,
        name: `${store_name || name} স্পেশাল বেস্টসেলার আইটেম`,
        slug: 'featured-best-seller',
        sku: 'SKU-BEST-01',
        category_id: cat1.id,
        price: 450,
        compare_at_price: 550,
        stock_quantity: 50,
        is_published: true,
        is_featured: true,
        is_flash_deal: true,
        flash_deal_discount: 18,
        short_description: 'আমাদের স্টোরের সবচেয়ে জনপ্রিয় এবং নির্ভরযোগ্য পণ্য।',
        description: 'অরিজিনাল কোয়ালিটি ও দ্রুত হোম ডেলিভারি নিশ্চয়তা সহ প্রিমিয়াম কালেকশন।',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        rating_avg: 5.0,
        rating_count: 8
      }, newTenant.id);

      db.insert('products', {
        tenant_id: newTenant.id,
        name: 'প্রিমিয়াম এডিশন কালেকশন',
        slug: 'premium-edition',
        sku: 'SKU-PREM-02',
        category_id: cat1.id,
        price: 850,
        compare_at_price: 1050,
        stock_quantity: 35,
        is_published: true,
        is_featured: true,
        is_flash_deal: false,
        short_description: 'এক্সক্লুসিভ কালেকশন ও ক্যাশ অন ডেলিভারি সুবিধা।',
        description: '১০০% জেনুইন প্রোডাক্ট, সারা বাংলাদেশে ২-৩ দিনে হোম ডেলিভারি।',
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
        rating_avg: 4.9,
        rating_count: 5
      }, newTenant.id);

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

    const activeTenantId = tenant_id || req.tenantId;
    if (!activeTenantId) {
      return res.status(400).json({ success: false, message: 'Store context is required' });
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

    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

router.get('/me', verifyAuth, (req, res) => {
  if (!req.user) {
    return res.json({ success: true, user: null, isAuthenticated: false });
  }
  const { password_hash, ...safeUser } = req.user;
  let tenant = null;
  if (req.user.tenant_id) {
    tenant = db.findById('tenants', req.user.tenant_id);
  }
  res.json({ success: true, user: safeUser, tenant, isAuthenticated: true });
});

router.post('/change-password', verifyAuth, (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'লগইন আবশ্যক (Login required)' });
    }
    const { current_password, new_password, name, phone } = req.body;
    
    const user = db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'ইউজার পাওয়া যায়নি।' });
    }

    if (new_password) {
      if (new_password.length < 6) {
        return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' });
      }
      if (current_password) {
        const isMatch = bcrypt.compareSync(current_password, user.password_hash);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'বর্তমান পাসওয়ার্ডটি সঠিক নয়।' });
        }
      }
      const newHash = bcrypt.hashSync(new_password, 8);
      db.update('users', user.id, { 
        password_hash: newHash,
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {})
      });
    } else {
      db.update('users', user.id, { 
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {})
      });
    }

    const updatedUser = db.findById('users', user.id);
    const { password_hash, ...safeUser } = updatedUser;

    res.json({ success: true, message: 'প্রোফাইল ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!', user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' });
  }
});

router.post('/demo-switch', (req, res) => {
  try {
    const { role, tenant_slug, user_id } = req.body;
    let targetUser = null;

    if (user_id) {
      targetUser = db.findById('users', user_id);
    } else if (role === 'super_admin') {
      targetUser = db.findOne('users', { role: 'super_admin' });
    } else if (role === 'store_owner' || role === 'store_staff' || role === 'customer') {
      const tenant = tenant_slug ? db.findOne('tenants', { slug: tenant_slug }) : db.find('tenants')[0];
      if (tenant) {
        targetUser = db.findOne('users', { tenant_id: tenant.id, role: role }) || db.findOne('users', { tenant_id: tenant.id, role: 'store_owner' });
      }
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Demo user not found' });
    }

    const token = generateToken(targetUser);
    const { password_hash, ...safeUser } = targetUser;
    const tenant = targetUser.tenant_id ? db.findById('tenants', targetUser.tenant_id) : null;

    res.json({ success: true, token, user: safeUser, tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Switch failed' });
  }
});

export default router;
