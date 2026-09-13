const db = require('./db');
const bcrypt = require('bcryptjs');

function runSeed(force = false) {
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

  // 3. TENANT 1: GadgetVibe (Tech & Gadgets Store)
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
      primary_color: '#0284c7', // Sky blue
      secondary_color: '#0f172a', // Slate dark
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
      social_links: {
        facebook: 'https://facebook.com/gadgetvibe.bd',
        instagram: 'https://instagram.com/gadgetvibe.bd',
        youtube: 'https://youtube.com/@gadgetvibe'
      },
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
        },
        {
          id: 'slide-2',
          title: 'Studio Grade Audio Mastery',
          subtitle: 'Active Noise Cancellation & Immersive Spatial Sound',
          badge: 'FLAT 15% OFF',
          button_text: 'Shop Audio',
          button_link: '/catalog?category=cat-audio',
          bg_gradient: 'from-sky-950 via-slate-900 to-indigo-950',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: {
      pathao: { enabled: true, client_id: 'PATHAO_MOCK_882', secret: '******', store_id: '9921', default: true },
      steadfast: { enabled: true, api_key: 'STDF_MOCK_771', secret: '******', default: false },
      redx: { enabled: false, api_key: '' }
    },
    payment_settings: {
      cod_enabled: true,
      cod_charge: 0,
      bkash_enabled: true,
      bkash_type: 'Merchant',
      bkash_number: '01711223344',
      bkash_instructions: 'Pay directly via bKash App Merchant Payment (Counter 1) or Enter Transaction ID below.',
      nagad_enabled: true,
      nagad_number: '01822334455',
      stripe_enabled: true,
      stripe_public_key: 'pk_test_gadgetvibe_live'
    }
  });

  // Tenant 1 Users
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

  const userGadgetStaff = db.insert('users', {
    id: 'user-gadget-staff',
    tenant_id: tenant1.id,
    role: 'store_staff',
    name: 'Karim Ahmed (Manager)',
    email: 'karim@gadgetvibe.com',
    password_hash: passwordHash,
    phone: '+880 1822-334455',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    permissions: ['products.read', 'products.write', 'orders.read', 'orders.write', 'inventory.manage'],
    is_active: true
  });

  const userCustomer1 = db.insert('users', {
    id: 'user-customer-1',
    tenant_id: tenant1.id,
    role: 'customer',
    name: 'Tanvir Hossain',
    email: 'tanvir@gmail.com',
    password_hash: passwordHash,
    phone: '+880 1912-345678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        recipient_name: 'Tanvir Hossain',
        phone: '+880 1912-345678',
        city: 'Dhaka',
        area: 'Dhanmondi 27',
        street_address: 'House #42, Road #27, Dhanmondi R/A, Dhaka-1209',
        is_default: true
      }
    ],
    is_active: true
  });

  // Tenant 1 Categories
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
    name: 'Wireless Audio & Headphones',
    slug: 'wireless-audio',
    description: 'High Fidelity Noise Cancelling Earbuds & Over-Ear Cans',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    icon: 'Headphones',
    is_featured: true,
    sort_order: 2
  });

  const catWearables = db.insert('categories', {
    id: 'cat-wearables',
    tenant_id: tenant1.id,
    name: 'Smartwatches & Fitness',
    slug: 'smartwatches-wearables',
    description: 'Track your health, workouts and calls on the go',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80',
    icon: 'Watch',
    is_featured: true,
    sort_order: 3
  });

  const catLaptops = db.insert('categories', {
    id: 'cat-laptops',
    tenant_id: tenant1.id,
    name: 'Laptops & MacBooks',
    slug: 'laptops-macbooks',
    description: 'Pro productivity machines for creators and coders',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    icon: 'Laptop',
    is_featured: true,
    sort_order: 4
  });

  const catAccessories = db.insert('categories', {
    id: 'cat-accessories',
    tenant_id: tenant1.id,
    name: 'Power, Cables & Chargers',
    slug: 'power-chargers-cables',
    description: 'Fast GaN chargers, robust braided cables & powerbanks',
    image: 'https://images.unsplash.com/photo-1609592424368-80dc450090bc?auto=format&fit=crop&w=400&q=80',
    icon: 'Zap',
    is_featured: true,
    sort_order: 5
  });

  // Tenant 1 Brands
  const brandApple = db.insert('brands', { id: 'brand-apple', tenant_id: tenant1.id, name: 'Apple', slug: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' });
  const brandSony = db.insert('brands', { id: 'brand-sony', tenant_id: tenant1.id, name: 'Sony', slug: 'sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' });
  const brandAnker = db.insert('brands', { id: 'brand-anker', tenant_id: tenant1.id, name: 'Anker', slug: 'anker', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Anker_logo.png' });

  // Tenant 1 Products
  const prod1 = db.insert('products', {
    id: 'prod-iphone16-pro',
    tenant_id: tenant1.id,
    name: 'Apple iPhone 16 Pro Max 5G',
    slug: 'apple-iphone-16-pro-max',
    sku: 'IP16PM-BASE',
    barcode: '194253912801',
    category_id: catPhones.id,
    brand_id: brandApple.id,
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
    short_description: '6.9-inch Super Retina XDR OLED, A18 Pro Bionic, Grade 5 Titanium, 48MP Triple Camera System with 5x Periscope Zoom.',
    description: `## Pro Redefined
The iPhone 16 Pro Max is crafted with Grade 5 Titanium, featuring an ultra-slim border and the stunning 6.9-inch Super Retina XDR display with ProMotion 120Hz.

### Key Specifications:
- **Processor**: Apple A18 Pro chip with 6-core GPU
- **Camera**: 48MP Fusion Camera + 48MP Ultra Wide + 12MP 5x Telephoto
- **Battery**: All-day battery life with 33W Fast MagSafe charging
- **Operating System**: iOS 18 with Apple Intelligence`,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-ip16-blk-256', name: 'Black Titanium / 256GB', sku: 'IP16PM-BLK-256', price: 178000, compare_at_price: 189000, stock_quantity: 6, attributes: { Color: 'Black Titanium', Storage: '256GB' } },
      { id: 'var-ip16-des-256', name: 'Desert Titanium / 256GB', sku: 'IP16PM-DES-256', price: 178000, compare_at_price: 189000, stock_quantity: 4, attributes: { Color: 'Desert Titanium', Storage: '256GB' } },
      { id: 'var-ip16-nat-512', name: 'Natural Titanium / 512GB', sku: 'IP16PM-NAT-512', price: 198000, compare_at_price: 210000, stock_quantity: 4, attributes: { Color: 'Natural Titanium', Storage: '512GB' } }
    ],
    attributes: [
      { name: 'Color', values: ['Black Titanium', 'Desert Titanium', 'Natural Titanium'] },
      { name: 'Storage', values: ['256GB', '512GB', '1TB'] }
    ],
    tags: ['apple', 'iphone', 'flagship', 'titanium', '5g'],
    rating_avg: 4.9,
    rating_count: 28
  });

  const prod2 = db.insert('products', {
    id: 'prod-sony-wh1000xm5',
    tenant_id: tenant1.id,
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    slug: 'sony-wh1000xm5-wireless-anc-headphones',
    sku: 'SONY-WH5-BLK',
    barcode: '027242923195',
    category_id: catAudio.id,
    brand_id: brandSony.id,
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
    short_description: 'Industry-leading noise cancellation with two processors and eight microphones for unprecedented sound clarity and 30-hour battery life.',
    description: `### Pure Sound. Zero Distraction.
The Sony WH-1000XM5 rewrite the rules for distraction-free listening. With 8 microphones and Auto NC Optimizer, active noise cancelling adjusts automatically based on your wearing conditions and environment.

- **Battery Life**: Up to 30 hours with ANC on (3-minute charge = 3 hours playback)
- **High-Res Audio**: LDAC support with custom 30mm precision driver units
- **Multipoint Connection**: Pair with two devices simultaneously`,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-sony-blk', name: 'Matte Black', sku: 'SONY-WH5-BLK', price: 36500, compare_at_price: 42000, stock_quantity: 10, attributes: { Color: 'Matte Black' } },
      { id: 'var-sony-slv', name: 'Silver Platinum', sku: 'SONY-WH5-SLV', price: 36500, compare_at_price: 42000, stock_quantity: 8, attributes: { Color: 'Silver Platinum' } }
    ],
    attributes: [
      { name: 'Color', values: ['Matte Black', 'Silver Platinum'] }
    ],
    tags: ['sony', 'anc', 'headphones', 'bluetooth', 'audiophile'],
    rating_avg: 4.8,
    rating_count: 42
  });

  const prod3 = db.insert('products', {
    id: 'prod-apple-watch-ultra2',
    tenant_id: tenant1.id,
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    slug: 'apple-watch-ultra-2-gps-cellular',
    sku: 'AWU2-49-ORG',
    barcode: '194253912999',
    category_id: catWearables.id,
    brand_id: brandApple.id,
    type: 'physical',
    price: 96000,
    compare_at_price: 105000,
    cost_price: 88000,
    stock_quantity: 8,
    low_stock_threshold: 2,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: 'The most rugged and capable Apple Watch. 3000 nits display, precision dual-frequency GPS, up to 72 hours in Low Power Mode.',
    description: `Crafted from aerospace-grade titanium, the Apple Watch Ultra 2 is engineered for extremes. Powered by the S9 SiP with Double Tap gesture and on-device Siri.`,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-awu2-orange', name: 'Orange Ocean Band', sku: 'AWU2-49-ORG', price: 96000, compare_at_price: 105000, stock_quantity: 4, attributes: { Band: 'Orange Ocean Band' } },
      { id: 'var-awu2-trail', name: 'Blue/Black Trail Loop', sku: 'AWU2-49-TRL', price: 96000, compare_at_price: 105000, stock_quantity: 4, attributes: { Band: 'Blue/Black Trail Loop' } }
    ],
    attributes: [
      { name: 'Band', values: ['Orange Ocean Band', 'Blue/Black Trail Loop'] }
    ],
    tags: ['apple', 'watch', 'ultra', 'fitness', 'titanium'],
    rating_avg: 5.0,
    rating_count: 15
  });

  const prod4 = db.insert('products', {
    id: 'prod-anker-737-powerbank',
    tenant_id: tenant1.id,
    name: 'Anker 737 Power Bank (PowerCore 24K) 140W',
    slug: 'anker-737-power-bank-24000mah-140w',
    sku: 'ANKER-737-24K',
    barcode: '194644098762',
    category_id: catAccessories.id,
    brand_id: brandAnker.id,
    type: 'physical',
    price: 13500,
    compare_at_price: 16000,
    cost_price: 10500,
    stock_quantity: 25,
    low_stock_threshold: 5,
    track_quantity: true,
    is_published: true,
    is_featured: false,
    is_flash_deal: true,
    flash_deal_discount: 15,
    short_description: 'Ultra-Powerful Two-Way Fast Charging with smart digital display and 24,000mAh capacity to power MacBook Pro and phones simultaneously.',
    description: `Equipped with Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or get a 140W ultra-powerful charge.`,
    images: [
      'https://images.unsplash.com/photo-1609592424368-80dc450090bc?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [],
    attributes: [],
    tags: ['anker', 'powerbank', 'fastcharge', '140w'],
    rating_avg: 4.9,
    rating_count: 19
  });

  const prod5 = db.insert('products', {
    id: 'prod-macbook-pro-m3',
    tenant_id: tenant1.id,
    name: 'MacBook Pro 14" Space Black (M3 Pro 18GB/512GB)',
    slug: 'macbook-pro-14-m3-pro-space-black',
    sku: 'MBP14-M3PRO-BLK',
    barcode: '194253912001',
    category_id: catLaptops.id,
    brand_id: brandApple.id,
    type: 'physical',
    price: 245000,
    compare_at_price: 260000,
    cost_price: 228000,
    stock_quantity: 5,
    low_stock_threshold: 2,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: '14.2-inch Liquid Retina XDR, M3 Pro 11-core CPU & 14-core GPU, 18GB Unified Memory, Space Black Finish.',
    description: `The most advanced chips ever built for a personal computer. With hardware-accelerated ray tracing and up to 22 hours of battery life.`,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [],
    attributes: [],
    tags: ['apple', 'macbook', 'm3pro', 'laptop'],
    rating_avg: 5.0,
    rating_count: 9
  });

  // Tenant 1 Shipping Zones
  db.insert('shipping_zones', {
    id: 'ship-gv-dhaka',
    tenant_id: tenant1.id,
    name: 'Inside Dhaka City (Express Next Day)',
    cities: ['Dhaka', 'Gazipur', 'Narayanganj'],
    rate: 60,
    free_shipping_threshold: 5000,
    estimated_days: '1-2 Days'
  });

  db.insert('shipping_zones', {
    id: 'ship-gv-outside',
    tenant_id: tenant1.id,
    name: 'Outside Dhaka (Pathao Courier Hub Delivery)',
    cities: ['Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla'],
    rate: 120,
    free_shipping_threshold: 10000,
    estimated_days: '2-4 Days'
  });

  // Tenant 1 Coupons
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

  db.insert('coupons', {
    id: 'coup-gv-2',
    tenant_id: tenant1.id,
    code: 'WELCOME500',
    type: 'fixed',
    value: 500,
    min_order_amount: 5000,
    max_discount: 500,
    usage_limit: 200,
    usage_count: 32,
    is_active: true
  });

  // Tenant 1 Orders
  db.insert('orders', {
    id: 'ord-gv-1001',
    order_number: 'GV-2026-1001',
    tenant_id: tenant1.id,
    customer_id: userCustomer1.id,
    customer_name: 'Tanvir Hossain',
    customer_email: 'tanvir@gmail.com',
    customer_phone: '+880 1912-345678',
    shipping_address: {
      recipient_name: 'Tanvir Hossain',
      phone: '+880 1912-345678',
      city: 'Dhaka',
      area: 'Dhanmondi',
      street_address: 'House #42, Road #27, Dhanmondi R/A, Dhaka-1209'
    },
    items: [
      {
        product_id: prod1.id,
        variant_id: 'var-ip16-blk-256',
        name: 'Apple iPhone 16 Pro Max 5G (Black Titanium / 256GB)',
        sku: 'IP16PM-BLK-256',
        price: 178000,
        quantity: 1,
        total: 178000,
        image: prod1.images[0]
      },
      {
        product_id: prod4.id,
        variant_id: null,
        name: 'Anker 737 Power Bank (PowerCore 24K) 140W',
        sku: 'ANKER-737-24K',
        price: 13500,
        quantity: 1,
        total: 13500,
        image: prod4.images[0]
      }
    ],
    subtotal: 191500,
    discount_amount: 2000,
    coupon_code: 'GADGET10',
    shipping_cost: 0,
    total_amount: 189500,
    payment_method: 'bkash',
    payment_status: 'paid',
    payment_trx_id: 'BKB902319984',
    status: 'shipped',
    courier_name: 'Pathao Courier',
    courier_tracking_id: 'PT-DH-8839219',
    courier_consignment_id: 'CONS_GV_901',
    timeline: [
      { status: 'pending', note: 'Order placed by customer', created_at: '2026-09-10T10:00:00Z', created_by: 'Tanvir Hossain' },
      { status: 'confirmed', note: 'Payment verified via bKash TRX: BKB902319984', created_at: '2026-09-10T10:15:00Z', created_by: 'Rahim Chowdhury' },
      { status: 'processing', note: 'Items packed in safe bubble-wrap with warranty card', created_at: '2026-09-10T14:30:00Z', created_by: 'Karim Ahmed' },
      { status: 'shipped', note: 'Handed over to Pathao Express Rider', created_at: '2026-09-11T09:00:00Z', created_by: 'Karim Ahmed' }
    ],
    customer_notes: 'Please call before arriving.',
    admin_notes: 'VIP customer, packed official 1-year warranty receipt.',
    created_at: '2026-09-10T10:00:00Z'
  });

  db.insert('orders', {
    id: 'ord-gv-1002',
    order_number: 'GV-2026-1002',
    tenant_id: tenant1.id,
    customer_id: null,
    customer_name: 'Sadia Rahman',
    customer_email: 'sadia.tech@gmail.com',
    customer_phone: '+880 1722-998877',
    shipping_address: {
      recipient_name: 'Sadia Rahman',
      phone: '+880 1722-998877',
      city: 'Chittagong',
      area: 'GEC Circle',
      street_address: 'Flat 4B, Hill View Tower, Nasirabad, Chittagong'
    },
    items: [
      {
        product_id: prod2.id,
        variant_id: 'var-sony-slv',
        name: 'Sony WH-1000XM5 Wireless ANC Headphones (Silver Platinum)',
        sku: 'SONY-WH5-SLV',
        price: 36500,
        quantity: 1,
        total: 36500,
        image: prod2.images[0]
      }
    ],
    subtotal: 36500,
    discount_amount: 500,
    coupon_code: 'WELCOME500',
    shipping_cost: 120,
    total_amount: 36120,
    payment_method: 'cod',
    payment_status: 'unpaid',
    payment_trx_id: null,
    status: 'processing',
    courier_name: 'Steadfast Courier',
    courier_tracking_id: 'STDF-CTG-10294',
    courier_consignment_id: 'CONS_GV_902',
    timeline: [
      { status: 'pending', note: 'Order placed via COD', created_at: '2026-09-11T16:20:00Z', created_by: 'Sadia Rahman' },
      { status: 'confirmed', note: 'Customer confirmed via phone call', created_at: '2026-09-11T16:45:00Z', created_by: 'Karim Ahmed' },
      { status: 'processing', note: 'Item picked from Central Warehouse shelf B4', created_at: '2026-09-12T08:30:00Z', created_by: 'Karim Ahmed' }
    ],
    customer_notes: 'Urgent delivery needed for birthday gift.',
    admin_notes: 'Steadfast consignment booked.',
    created_at: '2026-09-11T16:20:00Z'
  });

  // Tenant 1 Reviews
  db.insert('reviews', {
    id: 'rev-1',
    tenant_id: tenant1.id,
    product_id: prod1.id,
    customer_id: userCustomer1.id,
    customer_name: 'Tanvir Hossain',
    rating: 5,
    comment: 'অসাধারণ ফোন! ১ দিনের মধ্যেই ডেলিভারি পেয়েছি। সম্পূর্ণ আসল প্রোডাক্ট এবং ইনভয়েস সহ ছিল। অত্যন্ত সন্তুষ্ট।',
    photos: [],
    is_approved: true,
    created_at: '2026-09-11T18:00:00Z'
  });

  db.insert('reviews', {
    id: 'rev-2',
    tenant_id: tenant1.id,
    product_id: prod2.id,
    customer_id: null,
    customer_name: 'Ashikur Rahman',
    rating: 5,
    comment: 'The active noise cancellation is pure magic. Soundstage is deep and battery lasts forever. Recommended!',
    photos: [],
    is_approved: true,
    created_at: '2026-09-08T12:30:00Z'
  });

  // ==========================================
  // 4. TENANT 2: Silk & Cotton (Fashion & Ethnic Boutique)
  // ==========================================
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
      primary_color: '#be123c', // Rose crimson
      secondary_color: '#831843', // Deep maroon
      accent_color: '#f59e0b',
      font: 'Playfair Display',
      top_bar_text: '🌸 Festive Collection Live! Get Free Delivery across Bangladesh on orders over ৳3,000 | Code: EID500',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'hello@silkandcotton.com',
      contact_phone: '+880 1955-667788',
      address: 'House #18, Road #11, Block D, Banani, Dhaka-1213',
      footer_text: '© 2026 Silk & Cotton Bangladesh. Handcrafted pure silk, authentic Jamdani and designer ethnic wear.',
      social_links: {
        facebook: 'https://facebook.com/silkandcotton.bd',
        instagram: 'https://instagram.com/silkandcotton.bd'
      },
      hero_slides: [
        {
          id: 'slide-sc-1',
          title: 'Heritage Jamdani & Silk',
          subtitle: 'Authentic 84-Count Handwoven Masterpieces from Artisans',
          badge: 'FESTIVE COLLECTION',
          button_text: 'Discover Sarees',
          button_link: '/catalog?category=cat-sc-sarees',
          bg_gradient: 'from-rose-950 via-pink-950 to-slate-900',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'slide-sc-2',
          title: 'Royal Ethnic Menswear',
          subtitle: 'Premium Kabli, Silk Panjabi & Handcrafted Loafers',
          badge: 'EXCLUSIVE',
          button_text: 'Shop Panjabi',
          button_link: '/catalog?category=cat-sc-panjabi',
          bg_gradient: 'from-slate-950 via-red-950 to-rose-950',
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: {
      pathao: { enabled: false },
      steadfast: { enabled: true, api_key: 'STDF_SC_LIVE_998', secret: '******', default: true },
      redx: { enabled: false }
    },
    payment_settings: {
      cod_enabled: true,
      cod_charge: 0,
      bkash_enabled: true,
      bkash_type: 'Personal / Merchant',
      bkash_number: '01955667788',
      bkash_instructions: 'bKash Send Money / Payment to 01955667788 with your Order ID in reference.',
      nagad_enabled: true,
      nagad_number: '01955667799',
      stripe_enabled: true,
      stripe_public_key: 'pk_test_sc_boutique'
    }
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
    name: 'Dhakai Jamdani & Sarees',
    slug: 'dhakai-jamdani-sarees',
    description: 'Traditional Handloom Jamdani, Katan & Pure Silk Sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    icon: 'Sparkles',
    is_featured: true,
    sort_order: 1
  });

  const catPanjabi = db.insert('categories', {
    id: 'cat-sc-panjabi',
    tenant_id: tenant2.id,
    name: 'Designer Royal Panjabi',
    slug: 'designer-royal-panjabi',
    description: 'Kabli Sets, Semi-Silk Embroidered Panjabi for Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    icon: 'Shirt',
    is_featured: true,
    sort_order: 2
  });

  const catLehenga = db.insert('categories', {
    id: 'cat-sc-lehenga',
    tenant_id: tenant2.id,
    name: 'Bridal & Party Lehengas',
    slug: 'bridal-party-lehengas',
    description: 'Zari embroidered georgette and velvet festive ensembles',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    icon: 'Crown',
    is_featured: true,
    sort_order: 3
  });

  // Tenant 2 Products
  const prodSC1 = db.insert('products', {
    id: 'prod-sc-jamdani-maroon',
    tenant_id: tenant2.id,
    name: 'Handwoven 84-Count Dhakai Jamdani Saree',
    slug: 'handwoven-84-count-dhakai-jamdani-saree',
    sku: 'SC-JAM-84-MAR',
    category_id: catSarees.id,
    brand_id: null,
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
    short_description: 'Pure cotton 84-count handloom Dhakai Jamdani with golden Zari floral motif embroidery. Includes matching unstitched blouse piece.',
    description: `### Authentic Heritage Weaving
Every single thread of this Dhakai Jamdani is handcrafted by master artisans in Narayanganj. Features traditional floral Jaal work and intricate Zari pallu.`,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-sc-jam-maroon', name: 'Royal Maroon & Gold', sku: 'SC-JAM-MAR', price: 14500, compare_at_price: 18000, stock_quantity: 7, attributes: { Color: 'Royal Maroon & Gold' } },
      { id: 'var-sc-jam-blue', name: 'Peacock Blue & Silver', sku: 'SC-JAM-BLU', price: 14500, compare_at_price: 18000, stock_quantity: 5, attributes: { Color: 'Peacock Blue & Silver' } }
    ],
    attributes: [
      { name: 'Color', values: ['Royal Maroon & Gold', 'Peacock Blue & Silver'] }
    ],
    tags: ['jamdani', 'saree', 'handloom', 'wedding', 'ethnic'],
    rating_avg: 5.0,
    rating_count: 36
  });

  const prodSC2 = db.insert('products', {
    id: 'prod-sc-panjabi-royal',
    tenant_id: tenant2.id,
    name: 'Embroidered Silk Blend Royal Kabli Panjabi Set',
    slug: 'embroidered-silk-blend-royal-kabli-panjabi-set',
    sku: 'SC-KABLI-BLK',
    category_id: catPanjabi.id,
    brand_id: null,
    type: 'physical',
    price: 6800,
    compare_at_price: 8500,
    cost_price: 4200,
    stock_quantity: 24,
    low_stock_threshold: 5,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: 'Luxury matte finish raw silk blend Kabli panjabi with collar thread work, brass buttons and matching pajama.',
    description: `Designed for festive gatherings and weddings. Breathable silk blend fabric with tailored modern fit.`,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-sc-pan-40', name: 'Size 40 (M)', sku: 'SC-KABLI-40', price: 6800, compare_at_price: 8500, stock_quantity: 8, attributes: { Size: '40 (M)' } },
      { id: 'var-sc-pan-42', name: 'Size 42 (L)', sku: 'SC-KABLI-42', price: 6800, compare_at_price: 8500, stock_quantity: 10, attributes: { Size: '42 (L)' } },
      { id: 'var-sc-pan-44', name: 'Size 44 (XL)', sku: 'SC-KABLI-44', price: 6800, compare_at_price: 8500, stock_quantity: 6, attributes: { Size: '44 (XL)' } }
    ],
    attributes: [
      { name: 'Size', values: ['40 (M)', '42 (L)', '44 (XL)'] }
    ],
    tags: ['panjabi', 'kabli', 'eid', 'men', 'wedding'],
    rating_avg: 4.9,
    rating_count: 22
  });

  db.insert('shipping_zones', {
    id: 'ship-sc-dhaka',
    tenant_id: tenant2.id,
    name: 'Dhaka City Standard Delivery',
    cities: ['Dhaka'],
    rate: 70,
    free_shipping_threshold: 3000,
    estimated_days: '1-2 Days'
  });

  db.insert('shipping_zones', {
    id: 'ship-sc-allbd',
    tenant_id: tenant2.id,
    name: 'All Bangladesh via Steadfast Courier',
    cities: ['Everywhere Else'],
    rate: 130,
    free_shipping_threshold: 3000,
    estimated_days: '2-3 Days'
  });

  db.insert('coupons', {
    id: 'coup-sc-1',
    tenant_id: tenant2.id,
    code: 'EID500',
    type: 'fixed',
    value: 500,
    min_order_amount: 3000,
    max_discount: 500,
    usage_limit: 1000,
    usage_count: 120,
    is_active: true
  });

  // ==========================================
  // 5. TENANT 3: GreenGrocer Organics (Organic Agro & Superfoods)
  // ==========================================
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
      primary_color: '#059669', // Emerald green
      secondary_color: '#064e3b', // Deep forest green
      accent_color: '#d97706',
      font: 'Inter',
      top_bar_text: '🌿 100% Guaranteed Purity | Free Home Delivery across Dhaka on ৳2,000+ orders',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'care@greengrocer.com.bd',
      contact_phone: '+880 1888-112233',
      address: 'Plot #12, Block K, South Breeze Square, Bashundhara R/A, Dhaka',
      footer_text: '© 2026 GreenGrocer Organic. Sourced directly from local farmers and Sundarban tribal honey harvesters.',
      social_links: {
        facebook: 'https://facebook.com/greengrocer.bd',
        instagram: 'https://instagram.com/greengrocer.bd'
      },
      hero_slides: [
        {
          id: 'slide-gg-1',
          title: 'Direct From Nature to Table',
          subtitle: 'Raw Sundarban Honey, Pure Desi Ghee & Cold-Pressed Mustard Oil',
          badge: 'ORGANIC CERTIFIED',
          button_text: 'Shop Fresh Foods',
          button_link: '/catalog',
          bg_gradient: 'from-emerald-950 via-teal-950 to-slate-950',
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: {
      pathao: { enabled: true, client_id: 'PATHAO_GG_10', default: true },
      steadfast: { enabled: false }
    },
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Personal',
      bkash_number: '01888112233',
      stripe_enabled: false
    }
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
    description: 'Raw Sundarban Khalisha & Mustard Blossom Honey',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    icon: 'Droplets',
    is_featured: true,
    sort_order: 1
  });

  const catGhee = db.insert('categories', {
    id: 'cat-gg-ghee',
    tenant_id: tenant3.id,
    name: 'Pure Desi Cow Ghee',
    slug: 'pure-desi-cow-ghee',
    description: 'Bilona method crafted aromatic butter oil',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
    icon: 'Sparkles',
    is_featured: true,
    sort_order: 2
  });

  const catNuts = db.insert('categories', {
    id: 'cat-gg-nuts',
    tenant_id: tenant3.id,
    name: 'Dry Fruits & Seeds',
    slug: 'dry-fruits-seeds',
    description: 'Medjool Dates, Chia Seeds, Roasted Cashews & Almonds',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=400&q=80',
    icon: 'Apple',
    is_featured: true,
    sort_order: 3
  });

  db.insert('products', {
    id: 'prod-gg-sundarban-honey',
    tenant_id: tenant3.id,
    name: 'Sundarban Pure Wild Floral Raw Honey (1kg)',
    slug: 'sundarban-pure-wild-floral-raw-honey-1kg',
    sku: 'GG-HONEY-1KG',
    category_id: catHoney.id,
    brand_id: null,
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
    short_description: 'Raw, unpasteurized and unprocessed honey harvested directly from the natural beehives of the Sundarban mangrove forest.',
    description: `### Purest Gift of Nature
Our honey is extracted by certified tribal Mawalis (honey collectors) of the Sundarban. Retains all natural pollen, enzymes, antioxidants and medicinal nutrients.`,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [
      { id: 'var-gg-honey-500g', name: '500 Grams Glass Jar', sku: 'GG-HONEY-500G', price: 750, compare_at_price: 850, stock_quantity: 25, attributes: { Weight: '500g' } },
      { id: 'var-gg-honey-1kg', name: '1000 Grams (1kg) Jar', sku: 'GG-HONEY-1KG', price: 1350, compare_at_price: 1550, stock_quantity: 15, attributes: { Weight: '1kg' } }
    ],
    attributes: [
      { name: 'Weight', values: ['500g', '1kg'] }
    ],
    tags: ['honey', 'organic', 'sundarban', 'immunity', 'raw'],
    rating_avg: 5.0,
    rating_count: 54
  });

  db.insert('products', {
    id: 'prod-gg-desi-ghee',
    tenant_id: tenant3.id,
    name: 'Sirajganj Traditional Bilona Cow Ghee (1kg)',
    slug: 'sirajganj-traditional-bilona-cow-ghee-1kg',
    sku: 'GG-GHEE-1KG',
    category_id: catGhee.id,
    brand_id: null,
    type: 'physical',
    price: 1850,
    compare_at_price: 2100,
    cost_price: 1350,
    stock_quantity: 20,
    low_stock_threshold: 5,
    track_quantity: true,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: 'Granular, heavenly aromatic pure cow ghee made from grass-fed Desi cow milk curd via Vedic Bilona method.',
    description: `No artificial flavor, zero preservatives. Crafted using slow-simmering traditional earthen stoves.`,
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80'
    ],
    variants: [],
    attributes: [],
    tags: ['ghee', 'desi-ghee', 'sirajganj', 'bilona', 'ayurvedic'],
    rating_avg: 4.9,
    rating_count: 38
  });

  db.insert('shipping_zones', {
    id: 'ship-gg-dhaka',
    tenant_id: tenant3.id,
    name: 'Inside Dhaka City Same-Day / Next-Day',
    cities: ['Dhaka'],
    rate: 60,
    free_shipping_threshold: 2000,
    estimated_days: '1 Day'
  });

  // 6. Platform Invoices for Super Admin
  db.insert('platform_invoices', {
    id: 'inv-plt-101',
    tenant_id: tenant1.id,
    tenant_name: 'GadgetVibe Bangladesh',
    plan_id: 'plan-growth',
    amount: 49,
    status: 'paid',
    billing_period: 'Monthly (Sep 2026)',
    payment_method: 'Stripe Card (Auto-renew)',
    created_at: '2026-09-01T00:00:00Z'
  });

  db.insert('platform_invoices', {
    id: 'inv-plt-102',
    tenant_id: tenant2.id,
    tenant_name: 'Silk & Cotton Boutique',
    plan_id: 'plan-enterprise',
    amount: 129,
    status: 'paid',
    billing_period: 'Monthly (Sep 2026)',
    payment_method: 'Bank Wire Transfer',
    created_at: '2026-09-01T00:00:00Z'
  });

  db.insert('platform_invoices', {
    id: 'inv-plt-103',
    tenant_id: tenant3.id,
    tenant_name: 'GreenGrocer Organic Foods',
    plan_id: 'plan-starter',
    amount: 19,
    status: 'paid',
    billing_period: 'Monthly (Sep 2026)',
    payment_method: 'bKash Auto Debit',
    created_at: '2026-09-01T00:00:00Z'
  });

  // 7. Audit Logs
  db.insert('audit_logs', {
    id: 'log-1',
    tenant_id: tenant1.id,
    user_id: userGadgetOwner.id,
    action: 'product_create',
    entity_type: 'product',
    entity_id: prod1.id,
    details: 'Created Apple iPhone 16 Pro Max 5G with 3 variants',
    ip: '103.145.112.5'
  });

  console.log('[Seed] Database seeded successfully with 3 distinct tenants, products, orders, categories, and subscription plans!');
}

if (require.main === module) {
  runSeed(true);
}

module.exports = { runSeed };
