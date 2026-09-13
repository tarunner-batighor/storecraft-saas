import db from './db.js';
import bcrypt from 'bcryptjs';

export function runSeed(force = false) {
  if (!force && db.find('tenants').length >= 4) {
    console.log('[Seed] Database already contains all tenants including Sarwar Book Store.');
    return;
  }

  console.log('[Seed] Seeding fresh multi-tenant SaaS database with Sarwar Ahmad Book Store...');
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
      price_monthly: 999,
      price_yearly: 9990,
      max_products: 100,
      max_staff: 3,
      commission_percentage: 2.5,
      custom_domain_allowed: true,
      is_popular: true,
      features: [
        'Up to 100 Products',
        'Custom Domain Mapping (yourbrand.com)',
        'Courier Automation (Pathao, Steadfast)',
        'Automated Invoice & Packing Slips',
        'Coupon & Flash Deals Engine',
        '2.5% Platform Commission'
      ]
    },
    {
      id: 'plan-growth',
      name: 'Growth Business',
      slug: 'growth',
      price_monthly: 2499,
      price_yearly: 24990,
      max_products: 500,
      max_staff: 10,
      commission_percentage: 1.0,
      custom_domain_allowed: true,
      is_popular: false,
      features: [
        'Up to 500 Products',
        'Custom Domain + Auto SSL',
        'Full Courier API Dispatch',
        'Staff Permissions (RBAC)',
        'Sales Export CSV & Analytics',
        'Priority 24/7 Phone Support'
      ]
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise VIP',
      slug: 'enterprise',
      price_monthly: 5999,
      price_yearly: 59990,
      max_products: 10000,
      max_staff: 50,
      commission_percentage: 0.0,
      custom_domain_allowed: true,
      is_popular: false,
      features: [
        'Unlimited Products & Storage',
        '0% Platform Transaction Fee',
        'Multi-Warehouse Inventory',
        'Dedicated Account Manager',
        'Custom Webhook & API Access',
        'White-Label SLA & 99.99% Uptime'
      ]
    }
  ];
  plans.forEach(p => db.insert('plans', p));

  // 2. Super Admin User
  db.insert('users', {
    id: 'user-super-admin',
    tenant_id: null,
    role: 'super_admin',
    name: 'Abdul Hadi Bin Masud (Super Admin)',
    email: 'abdulhadibinmasud775@gmail.com',
    password_hash: bcrypt.hashSync('admin123', 8),
    phone: '+880 1711-000000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  // ================= TENANT 1: SARWAR AHMAD BOOK STORE =================
  const tenantBooks = db.insert('tenants', {
    id: 'tenant-sarwarbooks',
    name: 'Sarwar Ahmad Book Store',
    slug: 'sarwarbooks',
    custom_domain: 'sarwarbooks.com',
    status: 'active',
    plan_id: 'plan-growth',
    plan_expires_at: '2027-12-31T23:59:59Z',
    branding: {
      tagline: 'সেরা বইয়ের বিশ্বস্ত অনলাইন বুক শপ - ঘরে বসেই বই কিনুন',
      logo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80',
      favicon: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=64&q=80',
      primary_color: '#0284c7',
      secondary_color: '#0f172a',
      accent_color: '#f59e0b',
      font: 'Inter',
      top_bar_text: '📚 Sarwar Ahmad Book Store এ স্বাগতম! ৳১,৫০০+ অর্ডারে ফ্রি হোম ডেলিভারি | কোড: BOOK10',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'sarwar@gmail.com',
      contact_phone: '+880 1712-345678',
      address: 'কনকর্ড এম্পোরিয়াম শপিং কমপ্লেক্স, কাঁটাবন, ঢাকা-১২০৫',
      footer_text: '© 2026 Sarwar Ahmad Book Store. সর্বস্বত্ব সংরক্ষিত। অরিজিনাল বই ও ক্যাশ অন ডেলিভারি।',
      social_links: {
        facebook: 'https://facebook.com/sarwarbooks.bd',
        instagram: 'https://instagram.com/sarwarbooks'
      },
      hero_slides: [
        {
          id: 'slide-sb-1',
          title: 'বইমেলা ও সমকালীন সেরা বেস্টসেলার',
          subtitle: 'ইসলামিক, মোটিভেশনাল ও জনপ্রিয় সাহিত্যিকের সব নতুন বইয়ের সমাহার',
          badge: 'বেস্টসেলার অফার',
          button_text: 'বই দেখুন ও কিনুন',
          button_link: '/catalog',
          bg_gradient: 'from-slate-900 via-sky-950 to-slate-900',
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'slide-sb-2',
          title: 'ক্যারিয়ার, স্কিল ও প্রোগ্রামিং বুকস',
          subtitle: 'ঘরে বসেই নিজের স্কিল বাড়াতে অরিজিনাল কোয়ালিটি টেকনিক্যাল বই',
          badge: 'ফ্ল্যাট ১৫% ছাড়',
          button_text: 'স্কিল ডেভেলপমেন্ট বই',
          button_link: '/catalog',
          bg_gradient: 'from-sky-950 via-slate-900 to-indigo-950',
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: {
      pathao: { enabled: true, default: true },
      steadfast: { enabled: true }
    },
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Merchant / Personal',
      bkash_number: '01712345678',
      bkash_instructions: 'বিকাশ অ্যাপ থেকে Send Money / Payment করে TrxID নিচে লিখুন।',
      nagad_enabled: true,
      nagad_number: '01712345678',
      stripe_enabled: false
    }
  });

  // Categories for Sarwar Book Store
  const catIslamic = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'ইসলামিক ও জীবনঘনিষ্ঠ',
    slug: 'islamic-books',
    description: 'আত্মশুদ্ধি, ঈমান ও জীবন পরিবর্তনের সেরা বইসমূহ',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    icon: 'BookOpen',
    is_featured: true,
    sort_order: 1
  }, tenantBooks.id);

  const catSelf = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'আত্মউন্নয়ন ও মোটিভেশন',
    slug: 'self-development',
    description: 'ব্যক্তিগত দক্ষতা ও মানসিক শক্তি বৃদ্ধির বই',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    icon: 'Sparkles',
    is_featured: true,
    sort_order: 2
  }, tenantBooks.id);

  const catTech = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'ক্যারিয়ার ও প্রোগ্রামিং',
    slug: 'tech-career',
    description: 'কম্পিউটার সায়েন্স, কোডিং ও ফ্রিল্যান্সিং গাইডবুক',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
    icon: 'Code',
    is_featured: true,
    sort_order: 3
  }, tenantBooks.id);

  // Products for Sarwar Book Store
  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'বেলা ফুরাবার আগে (হার্ডকভার) - আরিফ আজাদ',
    slug: 'bela-furabar-age',
    sku: 'BOOK-AZAD-01',
    category_id: catIslamic.id,
    type: 'physical',
    price: 320,
    compare_at_price: 380,
    stock_quantity: 45,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 16,
    short_description: 'জীবন পরিবর্তনকারী ও আত্মশুদ্ধির সেরা বেস্টসেলার বই।',
    description: 'জীবনের প্রতিটি মুহূর্তে কীভাবে সঠিক পথে চলা যায় এবং দ্বীনের আলোকে সুন্দর জীবন গড়া যায়—তা নিয়ে চমৎকার রচনা।',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 5.0,
    rating_count: 24,
    tags: ['Best Seller', 'Islamic', 'Hardcover']
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'প্যারাডক্সিক্যাল সাজিদ ১ ও ২ (কম্বো সেট)',
    slug: 'paradoxical-sajid-combo',
    sku: 'BOOK-SAJID-SET',
    category_id: catIslamic.id,
    type: 'physical',
    price: 550,
    compare_at_price: 650,
    stock_quantity: 30,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 15,
    short_description: 'যুক্তি ও বৈজ্ঞানিক প্রমাণের আলোকে সংশয়ের উত্তর।',
    description: 'তরুণ প্রজন্মের সংশয় ও প্রশ্নের যৌক্তিক সমাধান নিয়ে আরিফ আজাদের আলোচিত মাস্টারপিস বইয়ের পূর্ণাঙ্গ কম্বো।',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 4.9,
    rating_count: 38,
    tags: ['Combo', 'Islamic', 'Philosophy']
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'রিচার্জ আপনার ডাউন ব্যাটারি - ঝংকার মাহবুব',
    slug: 'recharge-down-battery',
    sku: 'BOOK-JHANKAR-01',
    category_id: catSelf.id,
    type: 'physical',
    price: 280,
    compare_at_price: 350,
    stock_quantity: 50,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: 'হাল ছেড়ে দেওয়া মনকে চাঙ্গা করতে দারুণ মোটিভেশনাল বই।',
    description: 'আলসেমি দূর করে কাজে মনোযোগী হওয়ার এবং ক্যারিয়ারে সফল হওয়ার ব্যবহারিক টিপস।',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 4.8,
    rating_count: 19,
    tags: ['Self Help', 'Motivation']
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'হাতে কলমে ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট',
    slug: 'hands-on-fullstack-web-dev',
    sku: 'BOOK-CODE-01',
    category_id: catTech.id,
    type: 'physical',
    price: 580,
    compare_at_price: 680,
    stock_quantity: 25,
    is_published: true,
    is_featured: true,
    is_flash_deal: false,
    short_description: 'HTML, CSS, JavaScript, React ও Node.js শেখার সম্পূর্ণ বাংলা গাইড।',
    description: 'প্র্যাক্টিক্যাল প্রজেক্ট ভিত্তিক ওয়েব ডেভেলপমেন্ট ও ফ্রিল্যান্সিং ক্যারিয়ার গাইড।',
    images: ['https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 5.0,
    rating_count: 12,
    tags: ['Programming', 'Web Dev']
  }, tenantBooks.id);

  // Shipping & Coupons for Sarwar Book Store
  db.insert('shipping_zones', {
    tenant_id: tenantBooks.id,
    name: 'ঢাকা সিটির ভেতরে হোম ডেলিভারি',
    cities: ['Dhaka'],
    rate: 60,
    free_shipping_threshold: 1500,
    estimated_days: '১-২ দিন'
  }, tenantBooks.id);

  db.insert('shipping_zones', {
    tenant_id: tenantBooks.id,
    name: 'ঢাকার বাইরে সারা বাংলাদেশে হোম ডেলিভারি',
    cities: ['All Districts'],
    rate: 100,
    free_shipping_threshold: 2000,
    estimated_days: '২-৩ দিন'
  }, tenantBooks.id);

  db.insert('coupons', {
    tenant_id: tenantBooks.id,
    code: 'BOOK10',
    type: 'percentage',
    value: 10,
    min_order_amount: 500,
    max_discount: 200,
    usage_limit: 500,
    usage_count: 14,
    is_active: true
  }, tenantBooks.id);

  // Users for Sarwar Book Store
  db.insert('users', {
    id: 'user-sarwar-owner',
    tenant_id: tenantBooks.id,
    role: 'store_owner',
    name: 'Sarwar Ahmad',
    email: 'sarwar@gmail.com',
    password_hash: bcrypt.hashSync('owner123', 8),
    phone: '+880 1712-345678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  // Sample Order for Sarwar Book Store
  db.insert('orders', {
    order_number: 'SB-2026-1001',
    tenant_id: tenantBooks.id,
    customer_name: 'তানভীর আহমেদ',
    customer_email: 'tanvir@gmail.com',
    customer_phone: '+880 1711-223344',
    shipping_address: {
      recipient_name: 'তানভীর আহমেদ',
      phone: '+880 1711-223344',
      city: 'Dhaka',
      area: 'Dhanmondi',
      street_address: 'House #45, Road #7/A, Dhanmondi, Dhaka'
    },
    items: [
      {
        product_id: 'p1',
        name: 'বেলা ফুরাবার আগে (হার্ডকভার)',
        price: 320,
        quantity: 1,
        total: 320
      },
      {
        product_id: 'p2',
        name: 'রিচার্জ আপনার ডাউন ব্যাটারি',
        price: 280,
        quantity: 1,
        total: 280
      }
    ],
    subtotal: 600,
    discount_amount: 60,
    coupon_code: 'BOOK10',
    shipping_cost: 60,
    total_amount: 600,
    payment_method: 'cod',
    payment_status: 'paid',
    status: 'delivered',
    courier_name: 'Pathao Courier',
    courier_tracking_id: 'PT-894120',
    timeline: [
      { status: 'pending', note: 'Order placed online', created_at: '2026-09-12T10:00:00Z', created_by: 'Customer' },
      { status: 'delivered', note: 'Parcel delivered by Pathao', created_at: '2026-09-13T09:00:00Z', created_by: 'Pathao Rider' }
    ]
  }, tenantBooks.id);

  // ================= TENANT 2: GADGETVIBE =================
  const tenantGadget = db.insert('tenants', {
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
      hero_slides: [
        {
          id: 'slide-1',
          title: 'Next-Gen Flagship Series',
          subtitle: 'Experience Unmatched Performance & Pro Camera Systems',
          badge: 'NEW ARRIVAL',
          button_text: 'Explore Gadgets',
          button_link: '/catalog',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: { pathao: { enabled: true, default: true } },
    payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: '01811223344' }
  });

  const catGadget = db.insert('categories', {
    tenant_id: tenantGadget.id,
    name: 'Smartphones & Gadgets',
    slug: 'smartphones',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  }, tenantGadget.id);

  db.insert('products', {
    tenant_id: tenantGadget.id,
    name: 'Ultra Wireless Noise-Cancelling Headphones Pro',
    slug: 'ultra-wireless-headphones-pro',
    sku: 'AUDIO-HP-01',
    category_id: catGadget.id,
    price: 4999,
    compare_at_price: 6500,
    stock_quantity: 28,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 23,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 4.9,
    rating_count: 42
  }, tenantGadget.id);

  db.insert('shipping_zones', {
    tenant_id: tenantGadget.id,
    name: 'Inside Dhaka Express',
    cities: ['Dhaka'],
    rate: 60,
    free_shipping_threshold: 5000,
    estimated_days: '24 Hours'
  }, tenantGadget.id);

  db.insert('users', {
    id: 'user-owner-gv',
    tenant_id: tenantGadget.id,
    role: 'store_owner',
    name: 'Rahim Chowdhury',
    email: 'owner@gadgetvibe.com',
    password_hash: bcrypt.hashSync('owner123', 8),
    phone: '+880 1811-223344',
    is_active: true
  });

  // Customer account
  db.insert('users', {
    id: 'user-customer-tanvir',
    tenant_id: tenantBooks.id,
    role: 'customer',
    name: 'Tanvir Ahmed',
    email: 'tanvir@gmail.com',
    password_hash: bcrypt.hashSync('customer123', 8),
    phone: '+880 1711-223344',
    is_active: true
  });

  // ================= TENANT 3: GREENGROCER =================
  const tenantGreen = db.insert('tenants', {
    id: 'tenant-greengrocer',
    name: 'GreenGrocer Organic Farm',
    slug: 'greengrocer',
    custom_domain: 'greengrocer.storecraft.io',
    status: 'active',
    plan_id: 'plan-starter',
    plan_expires_at: '2027-12-31T23:59:59Z',
    branding: {
      tagline: '১০০% খাঁটি ও অর্গানিক গ্রোসারি পণ্য আপনার দোরগোড়ায়',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
      primary_color: '#16a34a',
      secondary_color: '#064e3b',
      accent_color: '#eab308',
      font: 'Inter',
      top_bar_text: '🥬 গ্রিনগ্রোসারে তাজা শাকসবজি ও খাঁটি মধু অর্ডার করুন | কোড: ORGANIC5',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@greengrocer.com',
      contact_phone: '+880 1911-556677',
      address: 'বাড়ি #১২, রোড #৪, গুলশান-২, ঢাকা',
      footer_text: '© 2026 GreenGrocer Organic Farm. ফ্রেশ অর্গানিক পণ্যের নিশ্চয়তা।',
      hero_slides: [
        {
          id: 'slide-gg-1',
          title: 'ফার্ম-ফ্রেশ তাজা শাকসবজি ও ফলমূল',
          subtitle: 'রাসায়নিক ও ফরমালিনমুক্ত ১০০% খাঁটি পুষ্টি উপাদান',
          badge: 'আজকের ফ্রেশ স্টক',
          button_text: 'বাজার করুন',
          button_link: '/catalog',
          bg_gradient: 'from-emerald-950 via-green-900 to-slate-900',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: { steadfast: { enabled: true, default: true } },
    payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: '01911556677' }
  });

  const catGreen = db.insert('categories', {
    tenant_id: tenantGreen.id,
    name: 'তাজা শাকসবজি ও ফ্রুটস',
    slug: 'fresh-produce',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  }, tenantGreen.id);

  db.insert('products', {
    tenant_id: tenantGreen.id,
    name: 'সুন্দরবনের খাঁটি প্রাকৃতিক মধু (১ কেজি)',
    slug: 'sundarban-raw-honey-1kg',
    sku: 'HONEY-RAW-1KG',
    category_id: catGreen.id,
    price: 1150,
    compare_at_price: 1350,
    stock_quantity: 45,
    is_published: true,
    is_featured: true,
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 4.95,
    rating_count: 38
  }, tenantGreen.id);

  db.insert('shipping_zones', {
    tenant_id: tenantGreen.id,
    name: 'Dhaka City Express Delivery',
    cities: ['Dhaka'],
    rate: 60,
    free_shipping_threshold: 1500,
    estimated_days: 'Same Day'
  }, tenantGreen.id);

  db.insert('users', {
    id: 'user-owner-green',
    tenant_id: tenantGreen.id,
    role: 'store_owner',
    name: 'Kazi Farhan',
    email: 'owner@greengrocer.com',
    password_hash: bcrypt.hashSync('owner123', 8),
    phone: '+880 1911-556677',
    is_active: true
  });

  // ================= TENANT 4: SILK & COTTON =================
  const tenantSilk = db.insert('tenants', {
    id: 'tenant-silkandcotton',
    name: 'Silk & Cotton Lifestyle',
    slug: 'silkandcotton',
    custom_domain: 'silkandcotton.storecraft.io',
    status: 'active',
    plan_id: 'plan-growth',
    plan_expires_at: '2027-12-31T23:59:59Z',
    branding: {
      tagline: 'এক্সক্লুসিভ ডিজাইনার পাঞ্জাবি, শাড়ি ও প্রিমিয়াম ফ্যাশন',
      logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80',
      primary_color: '#d97706',
      secondary_color: '#451a03',
      accent_color: '#f59e0b',
      font: 'Playfair Display',
      top_bar_text: '✨ প্রিমিয়াম ঈদ ও উৎসব কালেকশনে ফ্ল্যাট ২০% ডিসকাউন্ট | কোড: FESTIVE20',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@silkandcotton.com',
      contact_phone: '+880 1711-998877',
      address: 'রোড #১১, বনানী, ঢাকা-১২১৩',
      footer_text: '© 2026 Silk & Cotton Lifestyle. ১০০% প্রিমিয়াম ফেব্রিক ও এক্সক্লুসিভ কালেকশন।',
      hero_slides: [
        {
          id: 'slide-sc-1',
          title: 'এক্সক্লুসিভ প্রিমিয়াম পাঞ্জাবি কালেকশন',
          subtitle: '১০০% পিওর কটন ও সিল্ক ফেব্রিকের সাথে প্রিমিয়াম এমব্রয়ডারি',
          badge: 'নতুন কালেকশন',
          button_text: 'কালেকশন দেখুন',
          button_link: '/catalog',
          bg_gradient: 'from-amber-950 via-slate-900 to-amber-950',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    courier_settings: { pathao: { enabled: true, default: true } },
    payment_settings: { cod_enabled: true, bkash_enabled: true, bkash_number: '01711998877', nagad_enabled: true }
  });

  const catSilk = db.insert('categories', {
    tenant_id: tenantSilk.id,
    name: 'পাঞ্জাবি ও কাবলি',
    slug: 'panjabi-collection',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  }, tenantSilk.id);

  db.insert('products', {
    tenant_id: tenantSilk.id,
    name: 'এক্সক্লুসিভ হ্যান্ড-এমব্রয়ডারি কটন পাঞ্জাবি',
    slug: 'exclusive-hand-embroidery-cotton-panjabi',
    sku: 'SILK-PJ-001',
    category_id: catSilk.id,
    price: 3450,
    compare_at_price: 4200,
    stock_quantity: 30,
    is_published: true,
    is_featured: true,
    has_variants: true,
    variants: [
      { id: 'v-pj-m', name: 'Medium (40)', sku: 'SILK-PJ-M', price: 3450, stock_quantity: 12 },
      { id: 'v-pj-l', name: 'Large (42)', sku: 'SILK-PJ-L', price: 3450, stock_quantity: 10 },
      { id: 'v-pj-xl', name: 'XL (44)', sku: 'SILK-PJ-XL', price: 3650, stock_quantity: 8 }
    ],
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    rating_avg: 4.9,
    rating_count: 24
  }, tenantSilk.id);

  db.insert('shipping_zones', {
    tenant_id: tenantSilk.id,
    name: 'Dhaka City Standard',
    cities: ['Dhaka'],
    rate: 70,
    free_shipping_threshold: 3000,
    estimated_days: '1-2 Days'
  }, tenantSilk.id);

  db.insert('users', {
    id: 'user-owner-silk',
    tenant_id: tenantSilk.id,
    role: 'store_owner',
    name: 'Nadia Rahman',
    email: 'owner@silkandcotton.com',
    password_hash: bcrypt.hashSync('owner123', 8),
    phone: '+880 1711-998877',
    is_active: true
  });

  console.log('[Seed] All 4 multi-tenant stores initialized successfully!');
}
