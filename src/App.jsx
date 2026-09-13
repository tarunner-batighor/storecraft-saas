import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { TenantProvider, useTenant } from './context/TenantContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import DemoSwitcherBar from './components/common/DemoSwitcherBar';
import StorefrontHeader from './components/storefront/StorefrontHeader';
import StorefrontFooter from './components/storefront/StorefrontFooter';
import CartDrawer from './components/storefront/CartDrawer';

// SaaS Platform Pages
import SaasLandingPage from './pages/platform/SaasLandingPage';
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage';

// Storefront Pages
import StoreHomePage from './pages/storefront/StoreHomePage';
import StoreCatalogPage from './pages/storefront/StoreCatalogPage';
import StoreProductDetailPage from './pages/storefront/StoreProductDetailPage';
import StoreCheckoutPage from './pages/storefront/StoreCheckoutPage';
import StoreOrderSuccessPage from './pages/storefront/StoreOrderSuccessPage';
import StoreTrackOrderPage from './pages/storefront/StoreTrackOrderPage';
import StoreCustomerAccountPage from './pages/storefront/StoreCustomerAccountPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminBrandingPage from './pages/admin/AdminBrandingPage';
import AdminCustomDomainPage from './pages/admin/AdminCustomDomainPage';
import AdminPaymentSettingsPage from './pages/admin/AdminPaymentSettingsPage';
import AdminCourierSettingsPage from './pages/admin/AdminCourierSettingsPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminSubscriptionPage from './pages/admin/AdminSubscriptionPage';

function StorefrontLayout() {
  const { tenantSlug } = useParams();
  const { switchTenant, currentSlug } = useTenant();

  React.useEffect(() => {
    if (tenantSlug && tenantSlug !== currentSlug) {
      switchTenant(tenantSlug);
    }
  }, [tenantSlug, currentSlug]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      <div>
        <StorefrontHeader />
        <main className="animate-fade-in">
          <Outlet />
        </main>
      </div>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <CartProvider>
            {/* Global Demo Switcher & View Switcher Bar */}
            <DemoSwitcherBar />

            <Routes>
              {/* SaaS Platform Landing */}
              <Route path="/" element={<SaasLandingPage />} />
              <Route path="/platform" element={<SaasLandingPage />} />

              {/* Super Admin Control Center */}
              <Route path="/super-admin" element={<SuperAdminDashboardPage />} />

              {/* Store Owner / Staff Admin Panel */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="coupons" element={<AdminCouponsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="branding" element={<AdminBrandingPage />} />
                <Route path="domain" element={<AdminCustomDomainPage />} />
                <Route path="payments" element={<AdminPaymentSettingsPage />} />
                <Route path="couriers" element={<AdminCourierSettingsPage />} />
                <Route path="staff" element={<AdminStaffPage />} />
                <Route path="subscription" element={<AdminSubscriptionPage />} />
              </Route>

              {/* White-Label Customer Storefront Routes */}
              <Route path="/store/:tenantSlug" element={<StorefrontLayout />}>
                <Route index element={<StoreHomePage />} />
                <Route path="catalog" element={<StoreCatalogPage />} />
                <Route path="product/:productSlug" element={<StoreProductDetailPage />} />
                <Route path="checkout" element={<StoreCheckoutPage />} />
                <Route path="order-success/:orderNumber" element={<StoreOrderSuccessPage />} />
                <Route path="track" element={<StoreTrackOrderPage />} />
                <Route path="account" element={<StoreCustomerAccountPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}
