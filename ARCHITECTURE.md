# StoreCraft SaaS — Complete Multi-Tenant White-Label E-commerce Architecture

## 1. Multi-Tenancy & Tenant Isolation Architecture
StoreCraft is engineered as a **Row-Level Security (RLS) Multi-Tenant SaaS Platform**. A single unified application and database instance powers thousands of independent storefronts and merchant administrative panels.

### Tenant Resolution Lifecycle:
1. **Host/Domain Match**: Checks the incoming `Host` header against `tenants.custom_domain` (e.g. `gadgetvibe.com` or `silkandcotton.fashion`).
2. **Subdomain Extraction**: If host matches `*.storecraft.io`, extracts the tenant slug.
3. **API Headers**: Looks for `x-tenant-slug` or `x-tenant-id` in HTTP request headers.
4. **URL Query Param**: Supports `?store=slug` or `?tenant=slug`.
5. **Context Injection**: Sets `req.tenant` and `req.tenantId` for all downstream controllers and database queries.
6. **Data Partitioning**: All queries (Products, Orders, Customers, Coupons, Invoices, Reviews) are strictly scoped with `WHERE tenant_id = req.tenantId`.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Capability | Super Admin | Store Owner | Store Staff / Manager | Customer |
|---|:---:|:---:|:---:|:---:|
| **Platform Analytics & MRR** | ✅ | ❌ | ❌ | ❌ |
| **SaaS Subscription Plans** | ✅ | ❌ | ❌ | ❌ |
| **Tenant Impersonation / Reset** | ✅ | ❌ | ❌ | ❌ |
| **Store Branding & Colors** | ✅ | ✅ | ❌ | ❌ |
| **Custom Domain Mapping** | ✅ | ✅ | ❌ | ❌ |
| **Payment & Courier APIs** | ✅ | ✅ | ❌ | ❌ |
| **Staff Member Management** | ✅ | ✅ | ❌ | ❌ |
| **Product CRUD & Variants** | ✅ | ✅ | ✅ (if permitted) | ❌ |
| **Order Processing & Invoicing** | ✅ | ✅ | ✅ (if permitted) | ❌ |
| **Courier Dispatch (Pathao/Steadfast)** | ✅ | ✅ | ✅ (if permitted) | ❌ |
| **Browse, Wishlist & Cart** | ✅ | ✅ | ✅ | ✅ |
| **1-Page Checkout & Tracking** | ✅ | ✅ | ✅ | ✅ |

---

## 3. Database Schema Overview

```sql
-- 1. Tenants (Stores)
tenants (
  id UUID PRIMARY KEY,
  name VARCHAR,
  slug VARCHAR UNIQUE,
  custom_domain VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'active', -- active, suspended
  plan_id VARCHAR REFERENCES plans(id),
  plan_expires_at TIMESTAMP,
  branding JSONB {
    tagline, logo, favicon,
    primary_color, secondary_color, accent_color,
    font, top_bar_text, top_bar_enabled,
    currency, currency_symbol, contact_email, contact_phone,
    address, footer_text, hero_slides
  },
  courier_settings JSONB { pathao, steadfast, redx },
  payment_settings JSONB { cod_enabled, bkash_enabled, nagad_enabled, stripe_enabled },
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 2. SaaS Subscription Plans
plans (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  slug VARCHAR,
  price_monthly DECIMAL,
  price_yearly DECIMAL,
  max_products INTEGER,
  max_staff INTEGER,
  commission_percentage DECIMAL,
  custom_domain_allowed BOOLEAN,
  features TEXT[]
);

-- 3. Users (Super Admin, Store Owners, Staff, Customers)
users (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id), -- NULL for Super Admin
  role VARCHAR, -- 'super_admin', 'store_owner', 'store_staff', 'customer'
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  password_hash VARCHAR,
  avatar VARCHAR,
  permissions TEXT[],
  addresses JSONB[],
  is_active BOOLEAN,
  created_at TIMESTAMP
);

-- 4. Products & Variants
products (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR,
  slug VARCHAR,
  sku VARCHAR,
  barcode VARCHAR,
  category_id UUID REFERENCES categories(id),
  brand_id UUID REFERENCES brands(id),
  type VARCHAR DEFAULT 'physical',
  price DECIMAL,
  compare_at_price DECIMAL,
  cost_price DECIMAL,
  stock_quantity INTEGER,
  low_stock_threshold INTEGER,
  track_quantity BOOLEAN,
  is_published BOOLEAN,
  is_featured BOOLEAN,
  is_flash_deal BOOLEAN,
  flash_deal_discount DECIMAL,
  short_description TEXT,
  description TEXT,
  images TEXT[],
  variants JSONB[],
  attributes JSONB[],
  tags TEXT[],
  rating_avg DECIMAL,
  rating_count INTEGER,
  created_at TIMESTAMP
);

-- 5. Orders & Fulfillment Lifecycle
orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR,
  tenant_id UUID REFERENCES tenants(id),
  customer_id UUID,
  customer_name VARCHAR,
  customer_email VARCHAR,
  customer_phone VARCHAR,
  shipping_address JSONB,
  items JSONB[],
  subtotal DECIMAL,
  discount_amount DECIMAL,
  coupon_code VARCHAR,
  shipping_cost DECIMAL,
  total_amount DECIMAL,
  payment_method VARCHAR,
  payment_status VARCHAR,
  payment_trx_id VARCHAR,
  status VARCHAR, -- pending, confirmed, processing, shipped, delivered, cancelled
  courier_name VARCHAR,
  courier_tracking_id VARCHAR,
  courier_consignment_id VARCHAR,
  timeline JSONB[],
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP
);
```

---

## 4. Built-In Multi-Tenant Demo Stores

1. **GadgetVibe Bangladesh** (`slug: gadgetvibe`)
   - Category: Consumer Tech, Smartphones, Audio, Smartwatches
   - Colors: Sky Blue (`#0284c7`) & Dark Slate (`#0f172a`)
   - Integrations: bKash Merchant, Pathao Express Courier, Stripe Cards

2. **Silk & Cotton Boutique** (`slug: silkandcotton`)
   - Category: Luxury Jamdani Sarees, Designer Kabli Panjabi
   - Colors: Rose Crimson (`#be123c`) & Champagne Gold (`#f59e0b`)
   - Integrations: Steadfast Courier, COD, bKash

3. **GreenGrocer Organics** (`slug: greengrocer`)
   - Category: Wild Sundarban Honey, Desi Cow Ghee, Dry Fruits
   - Colors: Emerald Green (`#059669`) & Forest Dark (`#064e3b`)
   - Integrations: In-House Express, bKash Personal, COD
