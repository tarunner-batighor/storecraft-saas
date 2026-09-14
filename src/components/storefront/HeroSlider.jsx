import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSlider() {
  const { branding, currentSlug } = useTenant();
  const slides = branding?.hero_slides && branding.hero_slides.length > 0 ? branding.hero_slides : [
    {
      id: 'default-1',
      title: 'প্রিমিয়াম হ্যান্ডক্রাফটেড কালেকশন',
      subtitle: '১০০% অরিজিনাল কোয়ালিটি এবং দ্রুত হোম ডেলিভারি সুবিধা।',
      badge: 'বিশেষ অফার',
      button_text: 'কালেকশন দেখুন',
      button_link: `/store/${currentSlug}/catalog`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const primaryColor = branding?.primary_color || '#0f766e';

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl sm:rounded-3xl my-3 sm:my-6 shadow-lg max-w-7xl mx-auto">
      {/* Compact Height for Mobile */}
      <div className="relative min-h-[190px] sm:min-h-[340px] lg:min-h-[400px] flex items-center">
        {/* Background Overlay & Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center opacity-40 filter brightness-90 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-xl px-4 sm:px-10 py-5 sm:py-8 space-y-2 sm:space-y-3">
          {currentSlide.badge && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-950" />
              <span>{currentSlide.badge}</span>
            </div>
          )}

          <h1 className="text-base sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug sm:leading-tight text-white drop-shadow-md">
            {currentSlide.title}
          </h1>

          <p className="text-[11px] sm:text-sm text-slate-200 line-clamp-2 max-w-md leading-relaxed hidden xs:block sm:block">
            {currentSlide.subtitle}
          </p>

          <div className="pt-1">
            <Link
              to={currentSlide.button_link ? `/store/${currentSlug}${currentSlide.button_link.startsWith('/') ? currentSlide.button_link : '/' + currentSlide.button_link}` : `/store/${currentSlug}/catalog`}
              className="inline-flex items-center space-x-1.5 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-xl hover:opacity-95 transition transform active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <span>{currentSlide.button_text || 'অর্ডার করুন'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel Nav Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
