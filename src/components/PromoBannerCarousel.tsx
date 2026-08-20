import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Paintbrush,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface GallerySlide {
  id: string;
  image: string;
  fallbackImage: string;
  title: string;
  category: string;
  brand: string;
  badge: string;
  actionText: string;
  actionType: 'quote' | 'whatsapp' | 'category';
  targetCategory?: string;
}

const GALLERY_SLIDES: GallerySlide[] = [
  {
    id: 'gallery-paint-rolling',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=85',
    title: 'Architectural Wall Paints & Master Applicator Finishes',
    category: 'Interior & Exterior Wall Paints',
    brand: 'NIPPON PAINT • BIRLA OPUS',
    badge: '100% Factory Fresh Tinted Batches',
    actionText: 'Explore Paint Catalog',
    actionType: 'category',
    targetCategory: 'paints',
  },
  {
    id: 'gallery-designer-shades',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=85',
    title: '2500+ Designer Shades & Computerized Color Matching',
    category: 'Luxury Emulsions & Textures',
    brand: 'ASIAN PAINTS • NIPPON • OPUS',
    badge: 'Free Shade Card Sampling',
    actionText: 'Book Color Consultation',
    actionType: 'quote',
  },
  {
    id: 'gallery-luxury-interiors',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    title: 'Ultra-Washable Stain Resistant High-Sheen Living Walls',
    category: 'High-Durability Interior Emulsion',
    brand: 'ROYALE & SHINEX FINISHES',
    badge: 'Zero-VOC Eco Formulations',
    actionText: 'Get Wall Makeover Estimate',
    actionType: 'quote',
  },
  {
    id: 'gallery-pu-wood-coatings',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    title: 'High-Gloss Italian PU Wood Polish & Protective Enamels',
    category: 'Wood & Metal Coatings',
    brand: 'SIKA • AKZONOBEL • NIPPON',
    badge: 'Mirror-Finish Italian Gloss',
    actionText: 'Consult PU Specialist',
    actionType: 'whatsapp',
  },
  {
    id: 'gallery-waterproof-primers',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1600&q=85',
    title: 'Anti-Damp Waterproof Primers & All-Weather Exterior Shields',
    category: 'Base Preparation & Waterproofing',
    brand: 'DR. FIXIT • SIKA RAINCOAT',
    badge: '10-Year Weather Barrier',
    actionText: 'Book Site Inspection',
    actionType: 'quote',
  },
];

export const PromoBannerCarousel: React.FC = () => {
  const { settings, setActiveTab, setSelectedCategoryId, setIsQuoteOpen } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_SLIDES.length) % GALLERY_SLIDES.length);
  };

  const currentSlide = GALLERY_SLIDES[currentIndex];

  const handleAction = (slide: GallerySlide) => {
    if (slide.actionType === 'quote') {
      setIsQuoteOpen(true);
    } else if (slide.actionType === 'whatsapp') {
      const msg = encodeURIComponent(
        `Namaste Rajeshwar Ji! I am viewing "${slide.title}" on your Maa Vaibhav Lakshmi Enterprises painting portal and would like color consulting and quotes.`
      );
      window.open(`https://wa.me/91${settings.whatsappNumber || settings.primaryPhone}?text=${msg}`, '_blank');
    } else if (slide.actionType === 'category' && slide.targetCategory) {
      setSelectedCategoryId(slide.targetCategory);
      setActiveTab('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="technical-solutions-carousel"
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4"
    >
      {/* Animated Painting Visual Showcase Stage */}
      <div
        className="relative w-full min-h-[280px] sm:min-h-[360px] md:min-h-[440px] aspect-[16/10] sm:aspect-[16/8] md:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/90 shadow-2xl group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const touchEndX = e.changedTouches[0].clientX;
          const diff = touchStartX.current - touchEndX;
          if (diff > 50) handleNext();
          if (diff < -50) handlePrev();
          touchStartX.current = null;
        }}
      >
        {/* Animated Slide Imagery with Soothing Crossfade & Gentle Zoom */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, filter: 'blur(4px)', scale: 1.03 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(3px)', scale: 0.98 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Visual Painting Image */}
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              loading="eager"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== currentSlide.fallbackImage) {
                  target.src = currentSlide.fallbackImage;
                }
              }}
              className="w-full h-full object-cover object-center block brightness-95 contrast-105"
            />

            {/* Subtle Gradient Overlays for High Legibility while keeping image crisp */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-transparent to-slate-950/20 pointer-events-none" />

            {/* Floating Overlay Content */}
            <div className="absolute inset-0 p-4 sm:p-7 md:p-10 flex flex-col justify-between z-10">
              {/* Top Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>{currentSlide.brand}</span>
                  </span>
                  <span className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-slate-200 text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full hidden xs:inline-block">
                    {currentSlide.category}
                  </span>
                </div>
              </div>

              {/* Bottom Caption & Action Button */}
              <div className="space-y-2 sm:space-y-3 max-w-2xl">
                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
                  {currentSlide.title}
                </h3>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleAction(currentSlide)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Paintbrush className="w-4 h-4" />
                    <span>{currentSlide.actionText}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrow Controls */}
        <button
          id="promo-prev-btn"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-lg backdrop-blur-md transition-all z-20 cursor-pointer opacity-80 hover:opacity-100"
          aria-label="Previous painting slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          id="promo-next-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/80 shadow-lg backdrop-blur-md transition-all z-20 cursor-pointer opacity-80 hover:opacity-100"
          aria-label="Next painting slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating Slide Progress Indicators */}
        <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60">
          {GALLERY_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'w-7 bg-emerald-500 shadow-xs'
                    : 'w-2 bg-slate-500/60 hover:bg-slate-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
