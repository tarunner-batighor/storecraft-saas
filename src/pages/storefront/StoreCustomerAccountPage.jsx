import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ShoppingBag,
  Truck,
  ExternalLink,
  Plus,
  Trash2,
  Lock,
  Mail,
  Phone
} from 'lucide-react';

export default function StoreCustomerAccountPage() {
  const [searchParams] = useSearchParams();
  const { currentTenant, branding, currentSlug } = useTenant();
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Auth Form State (if not logged in)
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('password123');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchMyOrders = async () => {
        setLoadingOrders(true);
        try {
          const res = await api.get('/orders/my-orders');
          if (res.success && res.orders) {
            setOrders(res.orders);
          }
        } catch (err) {}
        finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [isAuthenticated, currentSlug]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (isRegisterMode) {
        await register({
          name: authName,
          email: authEmail,
          password: authPassword,
          phone: authPhone,
          role: 'customer'
        });
      } else {
        await login(authEmail, authPassword, currentTenant?.id);
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const primaryColor = branding?.primary_color || '#0f766e';
  const currencySymbol = branding?.currency_symbol || '৳';

  // If Not Authenticated, show Login / Register Box
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {isRegisterMode ? 'Create Customer Account' : 'Customer Sign In'}
            </h1>
            <p className="text-xs text-slate-500">
              Access your order history, delivery tracking & saved items on {currentTenant?.name}
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Tanvir Ahmed"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+880 17XXXXXXXX"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {authLoading ? 'Signing in...' : isRegisterMode ? 'Register Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
            {isRegisterMode ? (
              <span>Already have an account? <button onClick={() => setIsRegisterMode(false)} className="text-sky-600 font-bold hover:underline">Sign In</button></span>
            ) : (
              <span>New customer? <button onClick={() => setIsRegisterMode(true)} className="text-sky-600 font-bold hover:underline">Create an Account</button></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'orders' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'wishlist' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <Package className="w-10 h-10 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">No Orders Found</h3>
              <p className="text-xs text-slate-500">You haven't placed any orders with this store yet.</p>
              <Link
                to={`/store/${currentSlug}/catalog`}
                className="inline-block px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">#{ord.order_number}</span>
                    <span className="text-[11px] text-slate-400 ml-2">Placed on {formatDate(ord.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(ord.status).bg}`}>
                      {ord.status}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${getStatusBadge(ord.payment_status).bg}`}>
                      {ord.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                          <div className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price, 'BDT', currencySymbol)}</div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.total || (item.price * item.quantity), 'BDT', currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Total: {formatCurrency(ord.total_amount, 'BDT', currencySymbol)}
                  </div>
                  <Link
                    to={`/store/${currentSlug}/track?order=${ord.order_number}`}
                    className="flex items-center space-x-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Consignment</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
              <Heart className="w-10 h-10 mx-auto text-slate-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500">Save your favorite products to buy them later.</p>
              <Link
                to={`/store/${currentSlug}/catalog`}
                className="inline-block px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map((prod) => (
                <div key={prod.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <img src={(prod.images && prod.images[0])} alt={prod.name} className="w-full aspect-square rounded-xl object-cover" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{prod.name}</h4>
                  <div className="font-black text-sm text-slate-900 dark:text-white">
                    {formatCurrency(prod.price, 'BDT', currencySymbol)}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(prod, null, 1)}
                      className="flex-1 py-2 rounded-xl text-white font-bold text-xs shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod)}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
