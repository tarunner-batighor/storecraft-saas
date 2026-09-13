import db from './db.js';
import bcrypt from 'bcryptjs';

export function runSeed(force = false) {
  if (!force && db.find('tenants').length > 0) {
    console.log('[Seed] Database already contains tenants. Skipping seed.');
    return;
  }

  console.log('[Seed] Seeding fresh multi-tenant SaaS database...');
  db.reset();

  const passwordHash = bcrypt.hashSync('password123', 8);

  // 1. SaaS Subscription Plans
  const plans = [
    {
      id: 'plan-free',
      name: 'Free Trial',
      slug: 'free',
      price_monthly: 0,
      price_yearly: 0,
      max_products: 15,
      max_staff: 1,
      commission_percentage: 5.0,
      custom_domain_allowed: false,
      is_popular: false,
      features: [
        'Up to 15 Products',
        'Standard Subdomain (store.storecraft.io)',
        'Basic Storefront Themes',
        'Cash on Delivery & bKash',
        'Standard Analytics',
        '5.0% Platform Commission'
      ]
    },
    {
      id: 'plan-starter',
      name: 'Starter Store',
      slug: 'starter',
      price_monthly: 19,
      price_yearly: 190,
      max_products: 100,
      max_staff: 3,
      commission_percentage: 2.5,
      custom_domain_allowed: true,
      is_popular: false,
      features: [
        'Up to 100 Products & Variants',
        'Custom Domain Support',
        'bKash, Nagad, Cards & COD',
        'Pathao & Steadfast Courier Integration',
        'Automated Invoices & Packing Slips',
        '2.5% Platform Commission',
        'Standard Support'
      ]
    },
    {
      id: 'plan-growth',
      name: 'Growth Business',
      slug: 'growth',
      price_monthly: 49,
      price_yearly: 490,
      max_products: 1000,
      max_staff: 10,
      commission_percentage: 1.0,
      custom_domain_allowed: true,
      is_popular: true,
      features: [
        'Up to 1,000 Products & Variants',
        'Custom Domain + Free SSL',
        'All Payment Gateways + Manual Verification',
        'All Courier Integrations (Auto Consignment)',
        'Advanced Sales Reports & Analytics',
        'Discount Engine & Flash Sales',
        '1.0% Platform Commission',
        'Priority 24/7 Support'
      ]
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise VIP',
      slug: 'enterprise',
      price_monthly: 129,
      price_yearly: 1290,
      max_products: 99999,
      max_staff: 50,
      commission_percentage: 0.0,
      custom_domain_allowed: true,
      is_popular: false,
      features: [
        'Unlimited Products & Variants',
        'Dedicated Custom Domain & Custom Assets CDN',
        '0% Platform Commission',
        'Multi-Staff Role Permissions (RBAC)',
        'Automated Stock Alerts & Inventory Matrix',
        'Full White-Label Branding (Zero StoreCraft badges)',
        'Dedicated Account Manager & SLA'
      ]
    }
  ];

  plans.forEach(p => db.insert('plans', p));

  // 2. Super Admin User
  db.insert('users', {
    id: 'user-super-admin',
    tenant_id: null,
    role: 'super_admin',
    name: 'Platform Super Admin',
    email: 'admin@storecraft.io',
    password_hash: passwordHash,
    phone: '+880 1700-000000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  // 3. TENANT 1: GadgetVibe
  const tenant1 = db.insert('tenants', {
    id: 'tenant-gadgetvibe',
    name: 'GadgetVibe Bangladesh',
    slug: 'gadgetvibe',
    custom_domain: 'gadgetvibe.com',
    status: 'active',
    plan_id: 'plan-growth',
    plan_expires_at: '2027-12-31T23:59:59Z',
    branding: {
      tagline: 'Your Premier Destination for Authentic Tech & Gadgets',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
      favicon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=64&q=80',
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      accent_color: '#f59e0b',
      font: 'Inter',
      top_bar_text: '⚡ Free Express Delivery on Tech orders over ৳5,000 | Code: GADGET10 for 10% OFF',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@gadgetvibe.com',
      contact_phone: '+880 1811-223344',
      address: 'Shop #402, Level 4, Multiplan Centre, New Elephant Road, Dhaka-1205',
      footer_text: '© 2026 GadgetVibe Bangladesh. All rights reserved. 100% Genuine Tech Products with Official Warranty.',
      social_links: { facebook: 'https://facebook.com', instagram: 'https://instagram.com' },
      hero_slides: [
        {
          id: 'slide-1',
          title: 'Next-Gen Flagship Series',
          subtitle: 'Experience Unmatched Performance & Pro Camera Systems',
          badge: 'NEW ARRIVAL',
          button_text: 'Explore Gadgets',
          button_link: '/catalog',
          bg_gradient: 'from-slate-900 via-sky-950 to-slate-900',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: {
      pathao: { enabled: true, client_id: 'PATHAO_MOCK_882', secret: '******', default: true },
      steadfast: { enabled: true, api_key: 'STDF_MOCK_771', default: false }
    },
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Merchant',
      bkash_number: '01711223344',
      stripe_enabled: true
    }
  });

  // Tenant 1 Users & Products
  const userGadgetOwner = db.insert('users', {
    id: 'user-gadget-owner',
    tenant_id: tenant1.id,
    role: 'store_owner',
    name: 'Rahim Chowdhury',
    email: 'rahim@gadgetvibe.com',
    password_hash: passwordHash,
    phone: '+880 1711-223344',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  const catPhones = db.insert('categories', {
    id: 'cat-phones',
    tenant_id: tenant1.id,
    name: 'Smartphones & Tablets',
    slug: 'smartphones-tablets',
    description: 'Latest Flagships & Tablets with official warranty',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
    icon: 'Smartphone',
    is_featured: true,
    sort_order: 1
  });

  const catAudio = db.insert('categories', {
    id: 'cat-audio',
    tenant_id: tenant1.id,
    name: 'Wireless Audio',
    slug: 'wireless-audio',
    description: 'High Fidelity Noise Cancelling Earbuds',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    icon: 'Headphones',
    is_featured: true,
    sort_order: 2
  });

  const prod1 = db.insert('products', {
    id: 'prod-iphone16-pro',
    tenant_id: tenant1.id,
    name: 'Apple iPhone 16 Pro Max 5G',
    slug: 'apple-iphone-16-pro-max',
    sku: 'IP16PM-BASE',
    category_id: catPhones.id,
    type: 'physical',
    price: 178000,
    compare_at_price: 189000,
    cost_price: 165000,
    stock_quantity: 14,
    low_stock_threshold: 3,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 6,
    short_description: '6.9-inch Super Retina XDR OLED, A18 Pro Bionic, Grade 5 Titanium, 48MP Triple Camera System.',
    description: 'The iPhone 16 Pro Max is crafted with Grade 5 Titanium, featuring an ultra-slim border and the stunning 6.9-inch display.',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'],
    variants: [
      { id: 'var-1', name: 'Black Titanium / 256GB', sku: 'IP16-BLK-256', price: 178000, stock_quantity: 8, attributes: { Color: 'Black Titanium' } },
      { id: 'var-2', name: 'Desert Titanium / 256GB', sku: 'IP16-DES-256', price: 178000, stock_quantity: 6, attributes: { Color: 'Desert Titanium' } }
    ],
    attributes: [{ name: 'Color', values: ['Black Titanium', 'Desert Titanium'] }],
    tags: ['apple', 'iphone', '5g'],
    rating_avg: 4.9,
    rating_count: 28
  });

  const prod2 = db.insert('products', {
    id: 'prod-sony-wh1000xm5',
    tenant_id: tenant1.id,
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    slug: 'sony-wh1000xm5-wireless-anc-headphones',
    sku: 'SONY-WH5',
    category_id: catAudio.id,
    type: 'physical',
    price: 36500,
    compare_at_price: 42000,
    cost_price: 31000,
    stock_quantity: 18,
    low_stock_threshold: 4,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 13,
    short_description: 'Industry-leading noise cancellation with 30-hour battery life.',
    description: 'Pure Sound. Zero Distraction with Auto NC Optimizer.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    variants: [],
    attributes: [],
    tags: ['sony', 'anc', 'headphones'],
    rating_avg: 4.8,
    rating_count: 42
  });

  db.insert('shipping_zones', {
    id: 'ship-gv-dhaka',
    tenant_id: tenant1.id,
    name: 'Inside Dhaka City (Express)',
    cities: ['Dhaka'],
    rate: 60,
    free_shipping_threshold: 5000,
    estimated_days: '1-2 Days'
  });

  db.insert('coupons', {
    id: 'coup-gv-1',
    tenant_id: tenant1.id,
    code: 'GADGET10',
    type: 'percentage',
    value: 10,
    min_order_amount: 3000,
    max_discount: 2000,
    usage_limit: 500,
    usage_count: 48,
    is_active: true
  });

  // TENANT 2: Silk & Cotton
  const tenant2 = db.insert('tenants', {
    id: 'tenant-silkandcotton',
    name: 'Silk & Cotton Boutique',
    slug: 'silkandcotton',
    custom_domain: 'silkandcotton.fashion',
    status: 'active',
    plan_id: 'plan-enterprise',
    plan_expires_at: '2028-06-30T23:59:59Z',
    branding: {
      tagline: 'Timeless Heritage, Handcrafted Bangladeshi Elegance',
      logo: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=150&q=80',
      favicon: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=64&q=80',
      primary_color: '#be123c',
      secondary_color: '#831843',
      accent_color: '#f59e0b',
      font: 'Playfair Display',
      top_bar_text: '🌸 Festive Collection Live! Free Delivery on orders over ৳3,000 | Code: EID500',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'hello@silkandcotton.com',
      contact_phone: '+880 1955-667788',
      address: 'House #18, Road #11, Block D, Banani, Dhaka-1213',
      footer_text: '© 2026 Silk & Cotton Bangladesh.',
      hero_slides: [
        {
          id: 'slide-sc-1',
          title: 'Heritage Jamdani & Silk',
          subtitle: 'Authentic 84-Count Handwoven Masterpieces',
          badge: 'FESTIVE COLLECTION',
          button_text: 'Discover Sarees',
          button_link: '/catalog',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: { steadfast: { enabled: true, api_key: 'STDF_SC_LIVE_998', default: true } },
    payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: '01955667788' }
  });

  db.insert('users', {
    id: 'user-sc-owner',
    tenant_id: tenant2.id,
    role: 'store_owner',
    name: 'Nusrat Jahan',
    email: 'nusrat@silkandcotton.com',
    password_hash: passwordHash,
    phone: '+880 1955-667788',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  const catSarees = db.insert('categories', {
    id: 'cat-sc-sarees',
    tenant_id: tenant2.id,
    name: 'Dhakai Jamdani Sarees',
    slug: 'dhakai-jamdani-sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  });

  db.insert('products', {
    id: 'prod-sc-jamdani-maroon',
    tenant_id: tenant2.id,
    name: 'Handwoven 84-Count Dhakai Jamdani Saree',
    slug: 'handwoven-84-count-dhakai-jamdani-saree',
    sku: 'SC-JAM-84',
    category_id: catSarees.id,
    type: 'physical',
    price: 14500,
    compare_at_price: 18000,
    cost_price: 9500,
    stock_quantity: 12,
    low_stock_threshold: 3,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 19,
    short_description: 'Pure cotton 84-count handloom Dhakai Jamdani with golden Zari floral motif.',
    description: 'Every single thread is handcrafted by master artisans in Narayanganj.',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    variants: [],
    attributes: [],
    tags: ['jamdani', 'saree', 'handloom'],
    rating_avg: 5.0,
    rating_count: 36
  });

  // TENANT 3: GreenGrocer
  const tenant3 = db.insert('tenants', {
    id: 'tenant-greengrocer',
    name: 'GreenGrocer Organic Foods',
    slug: 'greengrocer',
    custom_domain: 'greengrocer.com.bd',
    status: 'active',
    plan_id: 'plan-starter',
    plan_expires_at: '2027-08-15T23:59:59Z',
    branding: {
      tagline: '100% Pure, Farm-Fresh & Chemical-Free Natural Delicacies',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
      favicon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=64&q=80',
      primary_color: '#059669',
      secondary_color: '#064e3b',
      accent_color: '#d97706',
      font: 'Inter',
      top_bar_text: '🌿 100% Guaranteed Purity | Free Home Delivery across Dhaka on ৳2,000+ orders',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'care@greengrocer.com.bd',
      contact_phone: '+880 1888-112233',
      address: 'Bashundhara R/A, Dhaka',
      footer_text: '© 2026 GreenGrocer Organic.',
      hero_slides: [
        {
          id: 'slide-gg-1',
          title: 'Direct From Nature to Table',
          subtitle: 'Raw Sundarban Honey, Pure Desi Ghee & Mustard Oil',
          badge: 'ORGANIC CERTIFIED',
          button_text: 'Shop Fresh Foods',
          button_link: '/catalog',
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: { pathao: { enabled: true, default: true } },
    payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: '01888112233' }
  });

  db.insert('users', {
    id: 'user-gg-owner',
    tenant_id: tenant3.id,
    role: 'store_owner',
    name: 'Hasan Mahmud',
    email: 'hasan@greengrocer.com',
    password_hash: passwordHash,
    phone: '+880 1888-112233',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  const catHoney = db.insert('categories', {
    id: 'cat-gg-honey',
    tenant_id: tenant3.id,
    name: 'Wild Honey & Syrups',
    slug: 'wild-honey-syrups',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  });

  db.insert('products', {
    id: 'prod-gg-sundarban-honey',
    tenant_id: tenant3.id,
    name: 'Sundarban Pure Wild Floral Raw Honey (1kg)',
    slug: 'sundarban-pure-wild-floral-raw-honey-1kg',
    sku: 'GG-HONEY-1KG',
    category_id: catHoney.id,
    type: 'physical',
    price: 1350,
    compare_at_price: 1550,
    cost_price: 900,
    stock_quantity: 40,
    low_stock_threshold: 10,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 13,
    short_description: 'Raw, unpasteurized and unprocessed honey harvested from Sundarban.',
    description: 'Extracted by certified tribal Mawalis of the Sundarban.',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    variants: [],
    attributes: [],
    tags: ['honey', 'organic', 'sundarban'],
    rating_avg: 5.0,
    rating_count: 54
  });

  console.log('[Seed] Database seeded successfully with 3 distinct tenants!');
}
