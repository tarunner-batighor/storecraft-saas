# StoreCraft SaaS — Complete Multi-Tenant White-Label E-commerce Platform

A production-ready, highly scalable **Multi-Tenant White-Label E-commerce SaaS Platform**. Merchants can instantly sign up and create their own branded online store with custom subdomains, custom domains, dynamic themes/colors, product variant matrix, inventory tracking, bKash/Nagad/Cards/COD checkout, automated Pathao/Steadfast courier dispatch, printable invoices, customer account portals, and SaaS subscription billing.

---

## 🚀 Live Demo Quick Access

The application includes a **Top Floating Demo Switcher** that allows 1-click switching between:
- 🌟 **SaaS Platform Landing**: `http://localhost:3000/platform`
- 👑 **Super Admin Control Center**: `http://localhost:3000/super-admin`
- 🏬 **Store 1: GadgetVibe Tech**: Storefront `http://localhost:3000/store/gadgetvibe` | Admin `http://localhost:3000/admin`
- 👗 **Store 2: Silk & Cotton Fashion**: Storefront `http://localhost:3000/store/silkandcotton` | Admin `http://localhost:3000/admin`
- 🌿 **Store 3: GreenGrocer Organics**: Storefront `http://localhost:3000/store/greengrocer` | Admin `http://localhost:3000/admin`
- ➕ **Instant Store Creator Wizard**: Click `+ Create New Store` to provision an active tenant on the fly!

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@storecraft.io` | `password123` | Platform Metrics, MRR, Plans, Tenant Management |
| **GadgetVibe Owner** | `rahim@gadgetvibe.com` | `password123` | Store Products, Orders, Theme, Staff, Couriers |
| **GadgetVibe Staff (Manager)** | `karim@gadgetvibe.com` | `password123` | Order Fulfillment, Stock Adjustments |
| **Silk & Cotton Owner** | `nusrat@silkandcotton.com` | `password123` | Fashion Boutique Management |
| **GreenGrocer Owner** | `hasan@greengrocer.com` | `password123` | Organic Store Management |
| **Customer** | `tanvir@gmail.com` | `password123` | Order History, Tracking & Wishlist |

*(Tip: You can also use the 1-click role switcher in the top demo bar to instantly switch accounts without typing passwords!)*

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend API**: Node.js, Express, JWT, bcryptjs, JSON database engine with strict Row-Level Tenant Scoping
- **Architecture**: Row-Level Multi-Tenancy with dynamic CSS token injection for true white-label customization.
