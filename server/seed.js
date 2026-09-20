import db from './db.js';
import bcrypt from 'bcryptjs';

export function seedDatabase() {
  // Clear existing records
  db.reset();

  console.log('[Seed] Seeding Bangladeshi standard SaaS platform with 4 stores and Personal bKash/Nagad 01766299775...');

  // 1. SaaS Subscription Plans (Standard Bangladeshi Pricing in BDT)
  const plans = [
    {
      id: 'plan-free',
      name: 'Free Trial',
      name_bn: 'ফ্রি ট্রায়াল (নতুনদের জন্য)',
      slug: 'free',
      price_monthly: 0,
      price_yearly: 0,
      max_products: 25,
      max_staff: 1,
      commission_percentage: 3.0,
      custom_domain_allowed: false,
      is_popular: false,
      badge: '১৪ দিনের ফ্রি ট্রায়াল',
      features: [
        'সর্বোচ্চ ২৫টি প্রোডাক্ট আপলোড',
        'স্ট্যান্ডার্ড সাবডোমেন (yourstore.storecraft.io)',
        'ক্যাশ অন ডেলিভারি (COD) ও বিকাশ/নগদ',
        'বেসিক মোবাইল রেসপনসিভ PWA স্টোরফ্রন্ট',
        'স্ট্যান্ডার্ড অর্ডার ও ইনভেন্টরি ট্র্যাকিং',
        '৩% প্ল্যাটফর্ম ট্রানজ্যাকশন ফি'
      ],
      features_en: [
        'Up to 25 Products',
        'Free Subdomain (yourstore.storecraft.io)',
        'Cash on Delivery & bKash/Nagad',
        'Mobile Responsive PWA Storefront',
        'Basic Order & Inventory Management',
        '3.0% Platform Transaction Fee'
      ]
    },
    {
      id: 'plan-starter',
      name: 'Starter Store',
      name_bn: 'স্টার্টার / এফ-কমার্স',
      slug: 'starter',
      price_monthly: 999,
      price_yearly: 9990,
      max_products: 250,
      max_staff: 2,
      commission_percentage: 1.5,
      custom_domain_allowed: true,
      is_popular: false,
      badge: 'ক্ষুদ্র ও এফ-কমার্স উদ্যোক্তা',
      features: [
        'সর্বোচ্চ ২৫০টি প্রোডাক্ট ও আনলিমিটেড অর্ডার',
        'নিজস্ব কাস্টম ডোমেন কানেকশন (.com / .com.bd)',
        'বিকাশ ও নগদ পার্সোনাল/মার্চেন্ট পেমেন্ট',
        'পাঠাও ও স্টিডফাস্ট ১-ক্লিক কুরিয়ার বুকিং',
        '২ জন স্টাফ অ্যাকাউন্ট ও অটো ইনভয়েস স্লিপ',
        '১.৫% প্ল্যাটফর্ম ট্রানজ্যাকশন ফি'
      ],
      features_en: [
        'Up to 250 Products & Unlimited Orders',
        'Custom Domain Support (.com / .com.bd)',
        'bKash & Nagad Online/Personal Payment',
        'Pathao & Steadfast 1-Click Courier Dispatch',
        '2 Staff Accounts & Auto PDF Invoices',
        '1.5% Platform Transaction Fee'
      ]
    },
    {
      id: 'plan-growth',
      name: 'Growth Business',
      name_bn: 'গ্রোথ বিজনেস (জনপ্রিয়)',
      slug: 'growth',
      price_monthly: 1999,
      price_yearly: 19990,
      max_products: 1000,
      max_staff: 5,
      commission_percentage: 0.5,
      custom_domain_allowed: true,
      is_popular: true,
      badge: 'সবচেয়ে জনপ্রিয় (Best Value)',
      features: [
        '১,০০০টি প্রোডাক্ট ও আনলিমিটেড ব্যান্ডউইথ',
        'কাস্টম ডোমেন + ফ্রি SSL সার্টিফিকেট',
        'অটোমেটেড SMS নোটিফিকেশন গেটওয়ে',
        'মাল্টি-ভেরিয়েন্ট ইনভেন্টরি ও সাইজ/কালার স্টক',
        'ফেসবুক পিক্সেল ও অ্যাডভান্সড অ্যানালিটিক্স',
        '৫ জন স্টাফ অ্যাকাউন্ট ও ২৪/৭ প্রায়োরিটি সাপোর্ট',
        'মাত্র ০.৫% প্ল্যাটফর্ম ফি'
      ],
      features_en: [
        'Up to 1,000 Products & Unlimited Traffic',
        'Custom Domain + Free SSL Certificate',
        'Automated Customer SMS Notifications',
        'Multi-Variant Matrix (Size, Color, SKU)',
        'Facebook Pixel & Advanced Reports',
        '5 Staff Accounts with RBAC Permissions',
        'Low 0.5% Platform Fee'
      ]
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise VIP',
      name_bn: 'এন্টারপ্রাইজ কর্পোরেট',
      slug: 'enterprise',
      price_monthly: 4999,
      price_yearly: 49990,
      max_products: 10000,
      max_staff: 20,
      commission_percentage: 0.0,
      custom_domain_allowed: true,
      is_popular: false,
      badge: 'টপ ব্র্যান্ড ও বড় শোরুম',
      features: [
        'আনলিমিটেড প্রোডাক্ট ও আনলিমিটেড ফাইল স্টোরেজ',
        '০% প্ল্যাটফর্ম কমিশন (জিরো ফি)',
        'মাল্টি-ওয়্যারহাউস ও শাখাভিত্তিক স্টক ট্র্যাকিং',
        'ডেডিকেটেড একাউন্ট ম্যানেজার ও ফোন সাপোর্ট',
        'কাস্টম থিম স্টাইলিং ও এপিআই/ওয়েবহুক এক্সেস',
        '২০ জন স্টাফ একাউন্ট ও ৯৯.৯% আপটাইম SLA'
      ],
      features_en: [
        'Unlimited Products & Cloud Storage',
        '0% Platform Commission (Zero Fee)',
        'Multi-Warehouse & Branch Stock Control',
        'Dedicated Account Manager & Phone Support',
        'Custom Webhooks & REST API Access',
        '20 Staff Accounts & 99.9% Uptime SLA'
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
    password_hash: bcrypt.hashSync('password123', 8),
    phone: '01766299775',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['all'],
    is_active: true
  });

  // ================= TENANT 1: SARWAR AHMAD BOOK STORE (BOOKS) =================
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
      top_bar_text: '📚 Sarwar Ahmad Book Store এ স্বাগতম! ৳১,৫০০+ অর্ডারে ফ্রি হোম ডেলিভারি | বিকাশ/নগদ: 01766299775',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'sarwar@gmail.com',
      contact_phone: '01766299775',
      address: 'কনকর্ড এম্পোরিয়াম শপিং কমপ্লেক্স, কাঁটাবন, ঢাকা-১২০৫',
      footer_text: '© 2026 Sarwar Ahmad Book Store. সর্বস্বত্ব সংরক্ষিত। অরিজিনাল বই ও ক্যাশ অন ডেলিভারি।',
      social_links: {
        facebook: 'https://facebook.com/sarwarbooks.bd',
        instagram: 'https://instagram.com/sarwarbooks'
      },
      chatbot: {
        enabled: true,
        url: 'https://bot-platform-2qwf.onrender.com/chat/aaluh0fo',
        title: 'বই সহকারী AI Bot',
        welcome_message: 'আসসালামু আলাইকুম! বই বা অর্ডার সম্পর্কিত যেকোনো তথ্যের জন্য চ্যাট করুন।'
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
      pathao: { enabled: true, default: true, client_id: 'PT-SARWAR-01', secret: 'pt_live_key_991' },
      steadfast: { enabled: true, default: false, api_key: 'st_live_992' },
      redx: { enabled: false }
    },
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Personal',
      bkash_number: '01766299775',
      bkash_instructions: 'বিকাশ পার্সোনাল নম্বরে (01766299775) Send Money করুন এবং ট্রানজেকশন আইডি দিন।',
      nagad_enabled: true,
      nagad_type: 'Personal',
      nagad_number: '01766299775',
      nagad_instructions: 'নগদ পার্সোনাল নম্বরে (01766299775) Send Money করুন এবং ট্রানজেকশন আইডি দিন।',
      card_enabled: true
    }
  });

  const catIslamic = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'ইসলামিক ও জীবনঘনিষ্ঠ',
    slug: 'islamic-books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 1
  }, tenantBooks.id);

  const catSelf = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'আত্মউন্নয়ন ও মোটিভেশন',
    slug: 'self-development',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 2
  }, tenantBooks.id);

  const catTech = db.insert('categories', {
    tenant_id: tenantBooks.id,
    name: 'ক্যারিয়ার ও প্রোগ্রামিং',
    slug: 'tech-career',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
    sort_order: 3
  }, tenantBooks.id);

  // Books Products
  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'বেলা ফুরাবার আগে (হার্ডকভার) - আরিফ আজাদ',
    slug: 'bela-furabar-age',
    sku: 'BOOK-BFA-01',
    category_id: catIslamic.id,
    price: 320,
    compare_at_price: 380,
    stock_quantity: 48,
    is_published: true,
    is_featured: true,
    is_flash_deal: true,
    flash_deal_discount: 15,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'বেলা ফুরাবার আগে বইটি এমন একটি বই, যা হারিয়ে যাওয়া আত্মাকে ফিরিয়ে আনে আত্মশুদ্ধির চিরচেনা রাজপথে। সমকালীন যুবসমাজের জন্য এক অনন্য উপহার।',
    specifications: { 'লেখক': 'আরিফ আজাদ', 'প্রকাশনী': 'সমকালীন প্রকাশন', 'কভার': 'হার্ডকভার', 'পৃষ্ঠা সংখ্যা': '১৯২' },
    rating_avg: 4.9,
    rating_count: 64
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'প্যারাডক্সিক্যাল সাজিদ ১ ও ২ (কম্বো সেট)',
    slug: 'paradoxical-sajid-combo',
    sku: 'BOOK-PS-COMBO',
    category_id: catIslamic.id,
    price: 580,
    compare_at_price: 700,
    stock_quantity: 35,
    is_published: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'যুক্তিবাদী সাজিদের সাথে ধর্ম ও বিজ্ঞানের চমৎকার সংমিশ্রণ। ইসলাম সম্পর্কিত জটিল সংশয় ও প্রশ্নের বুদ্ধিদীপ্ত উত্তর।',
    specifications: { 'লেখক': 'আরিফ আজাদ', 'প্রকাশনী': 'গার্ডিয়ান পাবলিকেশনস', 'সংস্করণ': 'নতুন মুদ্রণ ২০২৬' },
    rating_avg: 4.95,
    rating_count: 128
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'রিচার্জ আপনার ডাউন ব্যাটারি - ঝংকার মাহবুব',
    slug: 'recharge-down-battery',
    sku: 'BOOK-RDB-01',
    category_id: catSelf.id,
    price: 280,
    compare_at_price: 350,
    stock_quantity: 60,
    is_published: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'হতাশা ও অলসতাকে বিদায় জানিয়ে জীবনের লক্ষ্য অর্জনে নতুন উদ্দীপনা যোগাতে অত্যন্ত অনুপ্রেরণামূলক একটি বই।',
    specifications: { 'লেখক': 'ঝংকার মাহবুব', 'প্রকাশনী': 'আদর্শ', 'বিষয়': 'মোটিভেশন' },
    rating_avg: 4.8,
    rating_count: 52
  }, tenantBooks.id);

  db.insert('products', {
    tenant_id: tenantBooks.id,
    name: 'হাতে কলমে ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট',
    slug: 'hands-on-fullstack-web-dev',
    sku: 'BOOK-DEV-01',
    category_id: catTech.id,
    price: 650,
    compare_at_price: 800,
    stock_quantity: 25,
    is_published: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'React, Node.js, Express এবং আধুনিক ক্লাউড আর্কিটেকচার নিয়ে প্রজেক্টভিত্তিক ফুলস্ট্যাক ডেভেলপমেন্ট শেখার পূর্ণাঙ্গ বাংলা বই।',
    specifications: { 'লেখক': 'আব্দুল হাদী', 'কভার': 'হার্ডকভার', 'পৃষ্ঠা': '৩২০' },
    rating_avg: 5.0,
    rating_count: 19
  }, tenantBooks.id);

  // Shipping Zones for Books
  db.insert('shipping_zones', {
    tenant_id: tenantBooks.id,
    name: 'ঢাকা সিটির ভেতরে হোম ডেলিভারি',
    cities: ['Dhaka', 'ঢাকা'],
    rate: 60,
    free_shipping_threshold: 1500,
    estimated_days: '২৪-৪৮ ঘণ্টা'
  }, tenantBooks.id);

  db.insert('shipping_zones', {
    tenant_id: tenantBooks.id,
    name: 'ঢাকার বাইরে সারা বাংলাদেশে হোম ডেলিভারি',
    cities: ['All Bangladesh', 'সারা বাংলাদেশ'],
    rate: 110,
    free_shipping_threshold: 2500,
    estimated_days: '২-৩ কার্যদিবস'
  }, tenantBooks.id);

  // Coupon for Books
  db.insert('coupons', {
    tenant_id: tenantBooks.id,
    code: 'BOOK10',
    discount_type: 'percentage',
    discount_value: 10,
    min_purchase_amount: 500,
    max_discount_amount: 200,
    usage_limit: 500,
    usage_count: 42,
    is_active: true,
    expires_at: '2027-12-31T23:59:59Z'
  }, tenantBooks.id);

  // Store Owner User for Sarwar Books
  db.insert('users', {
    id: 'user-owner-sarwar',
    tenant_id: tenantBooks.id,
    role: 'store_owner',
    name: 'Sarwar Ahmad',
    email: 'sarwar@gmail.com',
    password_hash: bcrypt.hashSync('owner123', 8),
    phone: '01766299775',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    is_active: true
  });

  // Sample Order for Sarwar Books with Platform Commission
  db.insert('orders', {
    id: 'ord-sb-1001',
    order_number: 'SB-2026-1001',
    tenant_id: tenantBooks.id,
    customer_name: 'তানভীর আহমেদ',
    customer_email: 'tanvir@gmail.com',
    customer_phone: '01711223344',
    shipping_address: {
      recipient_name: 'তানভীর আহমেদ',
      phone: '01711223344',
      address_line1: 'বাসা #৪৪, রোড #৭, ধানমন্ডি',
      city: 'Dhaka',
      postal_code: '1209'
    },
    items: [
      {
        product_id: 'prod-1',
        name: 'বেলা ফুরাবার আগে (হার্ডকভার)',
        price: 320,
        quantity: 1,
        total: 320
      },
      {
        product_id: 'prod-3',
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
    platform_commission_rate: 0.5,
    platform_commission_amount: 3,
    store_net_revenue: 597,
    payment_method: 'bkash',
    payment_status: 'paid',
    payment_trx_id: 'TRX982736154',
    status: 'delivered',
    courier_name: 'Pathao Courier',
    courier_tracking_id: 'PT-894120',
    timeline: [
      { status: 'pending', note: 'Order placed online via bKash', created_at: '2026-09-12T10:00:00Z', created_by: 'Customer' },
      { status: 'delivered', note: 'Parcel delivered by Pathao', created_at: '2026-09-13T09:00:00Z', created_by: 'Pathao Rider' }
    ]
  }, tenantBooks.id);

  // ================= TENANT 2: GADGETVIBE (GADGETS & TECH) =================
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
      top_bar_text: '⚡ Free Express Delivery on Tech orders over ৳5,000 | bKash/Nagad: 01766299775',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@gadgetvibe.com',
      contact_phone: '01766299775',
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
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Personal',
      bkash_number: '01766299775',
      nagad_enabled: true,
      nagad_type: 'Personal',
      nagad_number: '01766299775'
    }
  });

  const catGadget = db.insert('categories', {
    tenant_id: tenantGadget.id,
    name: 'Smartphones & Audio',
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
    phone: '01766299775',
    is_active: true
  });

  // ================= TENANT 3: GREENGROCER (ORGANIC GROCERY) =================
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
      top_bar_text: '🥬 গ্রিনগ্রোসারে তাজা শাকসবজি ও খাঁটি মধু অর্ডার করুন | বিকাশ/নগদ: 01766299775',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@greengrocer.com',
      contact_phone: '01766299775',
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
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Personal',
      bkash_number: '01766299775',
      nagad_enabled: true,
      nagad_type: 'Personal',
      nagad_number: '01766299775'
    }
  });

  const catGreen = db.insert('categories', {
    tenant_id: tenantGreen.id,
    name: 'তাজা শাকসবজি ও মধু',
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
    phone: '01766299775',
    is_active: true
  });

  // ================= TENANT 4: SILK & COTTON (FASHION & APPAREL) =================
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
      top_bar_text: '✨ প্রিমিয়াম ঈদ ও উৎসব কালেকশনে ফ্ল্যাট ২০% ডিসকাউন্ট | বিকাশ/নগদ: 01766299775',
      top_bar_enabled: true,
      currency: 'BDT',
      currency_symbol: '৳',
      contact_email: 'support@silkandcotton.com',
      contact_phone: '01766299775',
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
    payment_settings: {
      cod_enabled: true,
      bkash_enabled: true,
      bkash_type: 'Personal',
      bkash_number: '01766299775',
      nagad_enabled: true,
      nagad_type: 'Personal',
      nagad_number: '01766299775'
    }
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
    phone: '01766299775',
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
    phone: '01711223344',
    is_active: true
  });

  console.log('[Seed] All 4 multi-tenant stores initialized successfully with Personal bKash/Nagad 01766299775!');
}

export function runSeed(force = false) {
  if (force || db.count('tenants') === 0) {
    seedDatabase();
  }
}
