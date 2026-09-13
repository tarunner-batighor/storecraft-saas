import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSlider() {
  const { branding, currentSlug } = useTenant();
  const slides = branding?.hero_slides && branding.hero_slides.length > 0 ? branding.hero_slides : [
    {
      id: 'default-1',
      title: 'Premium Handcrafted Collection',
      subtitle: 'Discover authentic products crafted with unmatched excellence.',
      badge: 'SPECIAL OFFER',
      button_text: 'Explore Catalog',
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
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl my-6 shadow-xl max-w-7xl mx-auto">
      <div className="relative min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Background Overlay & Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center opacity-35 filter brightness-90 transition-all duration-700 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 space-y-4">
          {currentSlide.badge && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>{currentSlide.badge}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
            {currentSlide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 line-clamp-2 max-w-lg leading-relaxed">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to={currentSlide.button_link ? `/store/${currentSlug}${currentSlide.button_link.startsWith('/') ? currentSlide.button_link : '/' + currentSlide.button_link}` : `/store/${currentSlug}/catalog`}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition transform active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              <span>{currentSlide.button_text || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Nav Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
