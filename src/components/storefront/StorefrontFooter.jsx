import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ExternalLink
} from 'lucide-react';

export default function StorefrontFooter() {
  const { currentTenant, branding, currentSlug } = useTenant();
  const primaryColor = branding?.primary_color || '#0f766e';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-16">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs">Nationwide Delivery</h4>
                <p className="text-[11px] text-slate-400">Fast delivery across 64 districts</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs">100% Genuine</h4>
                <p className="text-[11px] text-slate-400">Authentic products guaranteed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs">7 Days Easy Return</h4>
                <p className="text-[11px] text-slate-400">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-xs">Customer Support</h4>
                <p className="text-[11px] text-slate-400">Dedicated assistance 10AM-10PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store About */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {branding?.logo ? (
                <img src={branding.logo} alt={currentTenant?.name} className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                  {currentTenant?.name?.slice(0, 1) || 'S'}
                </div>
              )}
              <span className="font-bold text-white text-base">{currentTenant?.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {branding?.tagline || 'Leading customized online store offering the finest authentic products with nationwide delivery.'}
            </p>
            {branding?.address && (
              <div className="flex items-start space-x-2 text-slate-400 pt-1">
                <MapPin className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                <span>{branding.address}</span>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to={`/store/${currentSlug}/catalog`} className="hover:text-white transition">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link to={`/store/${currentSlug}/track`} className="hover:text-white transition">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to={`/store/${currentSlug}/account`} className="hover:text-white transition">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/platform" className="hover:text-white transition">
                  About Multi-Tenant Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Contact & Help</h4>
            <ul className="space-y-2">
              {branding?.contact_phone && (
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{branding.contact_phone}</span>
                </li>
              )}
              {branding?.contact_email && (
                <li className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{branding.contact_email}</span>
                </li>
              )}
              <li className="text-slate-400">Official Warranty & Support</li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">We Accept</h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
              <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg">Cash on Delivery</span>
              <span className="px-2.5 py-1 bg-pink-950/40 text-pink-400 border border-pink-900/50 rounded-lg">bKash</span>
              <span className="px-2.5 py-1 bg-orange-950/40 text-orange-400 border border-orange-900/50 rounded-lg">Nagad</span>
              <span className="px-2.5 py-1 bg-indigo-950/40 text-indigo-400 border border-indigo-900/50 rounded-lg">Visa / Master</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Protected by 256-bit SSL encryption.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500 text-[11px]">
          <div>
            {branding?.footer_text || `© ${new Date().getFullYear()} ${currentTenant?.name}. All rights reserved.`}
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Powered by</span>
            <Link to="/platform" className="text-emerald-400 hover:underline font-semibold flex items-center space-x-0.5">
              <span>StoreCraft SaaS</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
