import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { ShieldCheck, Lock, Mail, Store, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { currentTenant, currentSlug } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Return to requested page or default role dashboard
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, currentTenant?.id);
      if (res.success) {
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user?.role === 'super_admin') {
          navigate('/super-admin');
        } else if (res.user?.role === 'store_owner' || res.user?.role === 'store_staff') {
          navigate('/admin');
        } else {
          navigate(currentSlug ? `/store/${currentSlug}` : '/');
        }
      } else {
        setError(res.message || 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-sky-500 selection:text-white">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>মূল পাতায় ফিরে যান (Back to Website)</span>
      </Link>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">অ্যাকাউন্টে লগইন করুন</h2>
          <p className="text-xs text-slate-400 mt-1">
            শুধুমাত্র অনুমোদিত পাসওয়ার্ড দিয়ে সিস্টেমে প্রবেশ করা যাবে
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              আপনার ইমেইল (Email Address)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@storecraft.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              গোপন পাসওয়ার্ড (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-sky-600/25 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer mt-2"
          >
            <span>{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন (Secure Login)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <span>নতুন স্টোর খুলতে চান? </span>
          <Link to="/" className="text-sky-400 font-bold hover:underline">
            প্ল্যাটফর্ম থেকে রেজিস্টার করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
