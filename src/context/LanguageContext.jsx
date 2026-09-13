import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  bn: {
    // General & Common
    language: 'বাংলা',
    lang_code: 'bn',
    switch_to_en: 'English',
    switch_to_bn: 'বাংলা',
    save: 'সেভ করুন',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    view: 'দেখুন',
    search: 'অনুসন্ধান...',
    loading: 'লোড হচ্ছে...',
    success: 'সফলভাবে সম্পন্ন হয়েছে',
    error: 'সমস্যা হয়েছে',
    copy: 'কপি',
    copied: 'কপি করা হয়েছে!',
    online: 'সক্রিয় (Online)',

    // Header & Navigation
    nav_home: 'হোম',
    nav_catalog: 'সকল পণ্য / ক্যাটালগ',
    nav_track: 'অর্ডার ট্র্যাকিং',
    nav_account: 'আমার অ্যাকাউন্ট',
    nav_cart: 'কার্ট',
    nav_admin: 'অ্যাডমিন প্যানেল',
    nav_super_admin: 'সুপার অ্যাডমিন',
    nav_logout: 'লগআউট',
    nav_login: 'লগইন করুন',
    create_store_btn: 'ফ্রি স্টোর তৈরি করুন',

    // Landing Page
    landing_badge: 'হোয়াইট-লেবেল মাল্টি-টেন্যান্ট ই-কমার্স SaaS প্ল্যাটফর্ম',
    landing_hero_title: 'মাত্র ৬০ সেকেন্ডে আপনার নিজস্ব ব্র্যান্ডের অনলাইন শপ চালু করুন',
    landing_hero_sub: 'কাস্টমাইজেবল ব্র্যান্ডিং, কাস্টম ডোমেন, প্রোডাক্ট ভ্যারিয়েন্ট, বিকাশ/নগদ/কার্ড পেমেন্ট ও অটোমেটেড কুরিয়ার বুকিং সহ সম্পূর্ণ দেশীয় ই-কমার্স সল্যুশন।',
    explore_stores_btn: 'লাইভ স্টোর দেখুন',
    live_stores_title: 'প্ল্যাটফর্মে সক্রিয় অনলাইন স্টোরসমূহ',
    live_stores_sub: 'উদ্যোক্তাদের তৈরি করা লাইভ ব্র্যান্ডেড স্টোরফ্রন্টগুলো ঘুরে দেখুন।',
    visit_storefront: 'স্টোরফ্রন্ট দেখুন',
    manage_store: 'স্টোর অ্যাডমিন',

    // Pricing Plans
    pricing_title: 'সাশ্রয়ী সাবস্ক্রিপশন প্যাকেজ',
    pricing_sub: 'আপনার ব্যবসার আকার অনুযায়ী সেরা প্ল্যানটি বেছে নিন।',
    per_month: '/মাস',
    choose_plan: 'প্ল্যান বেছে নিন',
    current_plan: 'বর্তমান প্ল্যান',

    // Storefront Catalog & Product
    catalog_title: 'আমাদের পণ্যসম্ভার',
    all_categories: 'সকল ক্যাটাগরি',
    filter_by: 'ফিল্টার করুন',
    price_range: 'মূল্যের পরিসীমা',
    in_stock_only: 'শুধুমাত্র স্টকে থাকা পণ্য',
    sort_by: 'সাজান',
    sort_newest: 'নতুন পণ্য প্রথমে',
    sort_price_low: 'দাম: কম থেকে বেশি',
    sort_price_high: 'দাম: বেশি থেকে কম',
    sort_rating: 'সর্বোচ্চ রেটিং',
    add_to_cart: 'কার্টে যোগ করুন',
    buy_now: 'সরাসরি অর্ডার করুন',
    quick_view: 'দ্রুত দেখুন',
    stock_left: 'পিস স্টকে আছে',
    out_of_stock: 'স্টক শেষ',
    regular_price: 'নিয়মিত মূল্য',
    special_price: 'বিশেষ মূল্য',
    reviews_count: 'টি রিভিউ',

    // Cart Drawer & Checkout
    cart_title: 'আপনার শপিং কার্ট',
    cart_empty: 'আপনার কার্ট খালি রয়েছে',
    subtotal: 'মোট পণ্যের দাম (Subtotal)',
    delivery_charge: 'ডেলিভারি চার্জ',
    discount_applied: 'ডিসকাউন্ট ছাড়',
    grand_total: 'সর্বমোট পরিশোধযোগ্য',
    proceed_checkout: 'চেকআউটে যান',
    checkout_title: '১-পেজ দ্রুত চেকআউট',
    shipping_details: 'ডেলিভারি ঠিকানা ও তথ্য',
    recipient_name: 'আপনার নাম (Full Name)',
    phone_number: 'মোবাইল নম্বর (Phone)',
    full_address: 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা)',
    select_district: 'ডেলিভারি এলাকা / জেলা',
    inside_dhaka: 'ঢাকা সিটির ভেতরে (৳৬০)',
    outside_dhaka: 'ঢাকার বাইরে সারা বাংলাদেশ (৳১০০-১২০)',
    payment_method: 'পেমেন্ট মাধ্যম বেছে নিন',
    cod_label: 'ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা)',
    bkash_label: 'বিকাশ পেমেন্ট (bKash)',
    nagad_label: 'নগদ পেমেন্ট (Nagad)',
    trx_id_label: 'বিকাশ/নগদ TrxID নম্বর',
    apply_coupon: 'কুপন কোড প্রয়োগ',
    place_order_btn: 'অর্ডার সম্পন্ন করুন (Confirm Order)',

    // Order Success & Tracking
    order_success_title: 'আপনার অর্ডার সফল হয়েছে!',
    order_success_sub: 'ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।',
    order_number: 'অর্ডার নম্বর',
    track_order_title: 'লাইভ পার্সেল ট্র্যাকিং',
    track_order_btn: 'অর্ডার ট্র্যাক করুন',
    track_placeholder: 'অর্ডার নম্বর লিখুন (যেমন: SB-2026-1001)',

    // Admin Sidebar & Menus
    admin_overview: 'ওভারভিউ ড্যাশবোর্ড',
    admin_products: 'পণ্য ও স্টক তালিকা',
    admin_orders: 'অর্ডার ও ডেলিভারি',
    admin_coupons: 'কুপন ও ডিসকাউন্ট',
    admin_reports: 'সেলস রিপোর্ট ও এক্সেল',
    admin_branding: 'থিম ও ব্র্যান্ডিং',
    admin_domain: 'কাস্টম ডোমেন সংযোগ',
    admin_payments: 'পেমেন্ট গেটওয়ে সেটিংস',
    admin_couriers: 'কুরিয়ার অটোমেশন',
    admin_staff: 'স্টাফ ও পারমিশন',
    admin_subscription: 'প্ল্যান ও সাবস্ক্রিপশন',
    change_password_btn: 'পাসওয়ার্ড পরিবর্তন',
    view_live_store: 'লাইভ দোকান দেখুন',

    // Admin Dashboard Metrics
    gross_sales: 'মোট বিক্রয় (Gross Sales)',
    collected_amount: 'আদায়কৃত টাকা',
    total_orders_count: 'মোট অর্ডার সংখ্যা',
    pending_delivery: 'ডেলিভারি অপেক্ষমান',
    total_products_count: 'মোট পণ্য / বই',
    sales_7_days: 'গত ৭ দিনের বিক্রয় পরিসংখ্যান',
    order_status_ratio: 'অর্ডারের স্ট্যাটাস অনুপাত',
    top_selling_title: 'সর্বাধিক বিক্রিত পণ্যসমূহ',
    recent_orders_title: 'সাম্প্রতিক অর্ডারসমূহ',

    // Super Admin Portal
    super_admin_title: 'Super Admin Control Center',
    super_admin_sub: 'গ্লোবাল টেন্যান্ট প্রভিশনিং, SaaS মাসিক রিকারিং আয় ও প্ল্যাটফর্ম নিয়ন্ত্রণ।',
    saas_mrr: 'SaaS মাসিক রিকারিং আয় (MRR)',
    total_active_tenants: 'মোট সক্রিয় স্টোর সংখ্যা',
    platform_gmv: 'প্ল্যাটফর্ম মোট জিএমভি (GMV)',
    reset_demo_db: 'রিসেট ডেমো ডাটা'
  },
  en: {
    // General & Common
    language: 'English',
    lang_code: 'en',
    switch_to_en: 'English',
    switch_to_bn: 'বাংলা',
    save: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search...',
    loading: 'Loading...',
    success: 'Completed Successfully',
    error: 'An error occurred',
    copy: 'Copy',
    copied: 'Copied to clipboard!',
    online: 'Online',

    // Header & Navigation
    nav_home: 'Home',
    nav_catalog: 'All Products / Catalog',
    nav_track: 'Track Order',
    nav_account: 'My Account',
    nav_cart: 'Cart',
    nav_admin: 'Store Admin',
    nav_super_admin: 'Super Admin',
    nav_logout: 'Logout',
    nav_login: 'Login',
    create_store_btn: 'Create Free Store',

    // Landing Page
    landing_badge: 'White-Label Multi-Tenant E-Commerce SaaS Platform',
    landing_hero_title: 'Launch Your Custom Branded Online Store in 60 Seconds',
    landing_hero_sub: 'Complete with customizable branding, custom domains, product variants, bKash & card payments, automated courier consignments, and strict tenant isolation.',
    explore_stores_btn: 'Explore Live Stores',
    live_stores_title: 'Active Stores On Platform',
    live_stores_sub: 'Discover live merchant storefronts powered by StoreCraft multi-tenant engine.',
    visit_storefront: 'View Storefront',
    manage_store: 'Store Admin',

    // Pricing Plans
    pricing_title: 'Simple & Transparent Pricing',
    pricing_sub: 'Choose the plan that best fits your business growth scale.',
    per_month: '/month',
    choose_plan: 'Choose Plan',
    current_plan: 'Current Plan',

    // Storefront Catalog & Product
    catalog_title: 'Explore Our Catalog',
    all_categories: 'All Categories',
    filter_by: 'Filter By',
    price_range: 'Price Range',
    in_stock_only: 'In Stock Only',
    sort_by: 'Sort By',
    sort_newest: 'Newest First',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    sort_rating: 'Top Rated',
    add_to_cart: 'Add to Cart',
    buy_now: 'Order Now',
    quick_view: 'Quick View',
    stock_left: 'units left in stock',
    out_of_stock: 'Out of Stock',
    regular_price: 'Regular Price',
    special_price: 'Special Price',
    reviews_count: 'Reviews',

    // Cart Drawer & Checkout
    cart_title: 'Your Shopping Cart',
    cart_empty: 'Your cart is currently empty',
    subtotal: 'Cart Subtotal',
    delivery_charge: 'Delivery Charge',
    discount_applied: 'Discount Offset',
    grand_total: 'Grand Total Amount',
    proceed_checkout: 'Proceed to Checkout',
    checkout_title: '1-Page Express Checkout',
    shipping_details: 'Shipping & Delivery Address',
    recipient_name: 'Recipient Full Name',
    phone_number: 'Phone Number',
    full_address: 'Full Street Address',
    select_district: 'Delivery Zone / District',
    inside_dhaka: 'Inside Dhaka City (৳60)',
    outside_dhaka: 'Outside Dhaka Nationwide (৳100-120)',
    payment_method: 'Select Payment Method',
    cod_label: 'Cash on Delivery (Pay upon receipt)',
    bkash_label: 'bKash Mobile Payment',
    nagad_label: 'Nagad Mobile Payment',
    trx_id_label: 'bKash/Nagad Transaction ID (TrxID)',
    apply_coupon: 'Apply Promo Coupon',
    place_order_btn: 'Place Order Now',

    // Order Success & Tracking
    order_success_title: 'Order Placed Successfully!',
    order_success_sub: 'Thank you! Your order has been placed. Our team will contact you shortly.',
    order_number: 'Order Number',
    track_order_title: 'Live Parcel Tracking',
    track_order_btn: 'Track Order',
    track_placeholder: 'Enter order number (e.g. SB-2026-1001)',

    // Admin Sidebar & Menus
    admin_overview: 'Overview Dashboard',
    admin_products: 'Products & Inventory',
    admin_orders: 'Orders & Fulfillment',
    admin_coupons: 'Coupons & Discounts',
    admin_reports: 'Sales Reports & CSV',
    admin_branding: 'Theme & Branding',
    admin_domain: 'Custom Domain Setup',
    admin_payments: 'Payment Gateways',
    admin_couriers: 'Courier Automation',
    admin_staff: 'Staff & Permissions',
    admin_subscription: 'Plans & Subscription',
    change_password_btn: 'Change Password',
    view_live_store: 'View Live Store',

    // Admin Dashboard Metrics
    gross_sales: 'Gross Sales Revenue',
    collected_amount: 'Collected Revenue',
    total_orders_count: 'Total Orders',
    pending_delivery: 'Pending Deliveries',
    total_products_count: 'Total Products / Books',
    sales_7_days: 'Sales Over Last 7 Days',
    order_status_ratio: 'Order Status Distribution',
    top_selling_title: 'Top Selling Products',
    recent_orders_title: 'Recent Orders',

    // Super Admin Portal
    super_admin_title: 'Super Admin Control Center',
    super_admin_sub: 'Global tenant provisioning, SaaS recurring revenue, and master platform control.',
    saas_mrr: 'SaaS Monthly Recurring (MRR)',
    total_active_tenants: 'Total Active Stores',
    platform_gmv: 'Platform GMV Volume',
    reset_demo_db: 'Reset Demo DB'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('storecraft_language') || 'bn';
  });

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('storecraft_language', newLang);
  };

  const toggleLanguage = () => {
    const next = lang === 'bn' ? 'en' : 'bn';
    switchLanguage(next);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      isBn: lang === 'bn',
      isEn: lang === 'en',
      switchLanguage,
      toggleLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
