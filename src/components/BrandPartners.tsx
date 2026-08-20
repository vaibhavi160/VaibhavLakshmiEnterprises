import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Play, Pause, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BrandItem {
  id: string;
  name: string;
  category: string;
  role: string;
  categoryId: string;
  tagline: string;
  accentBorder: string;
  accentGlow: string;
  badgeBg: string;
  logo: React.ReactNode;
}

export const BrandPartners: React.FC = () => {
  const { setActiveTab, setSelectedCategoryId } = useApp();
  const [isPaused, setIsPaused] = useState(false);

  const handleBrandClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brands: BrandItem[] = [
    {
      id: 'dr-fixit',
      name: 'Dr. Fixit',
      category: 'Pidilite',
      role: 'Waterproofing Specialist',
      categoryId: 'waterproofing',
      tagline: 'LW+, URP, Roofseal & Bathseal Range',
      accentBorder: 'border-yellow-400/50 hover:border-yellow-400 dark:border-yellow-500/30',
      accentGlow: 'hover:shadow-yellow-500/10 group-hover:border-yellow-400',
      badgeBg: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="40" height="40" rx="8" fill="#FACC15" />
          <circle cx="22" cy="17" r="7" fill="#1E293B" />
          <path d="M14 35C14 28 18 26 22 26C26 26 30 28 30 35" fill="#1E293B" />
          <path d="M25 14L33 10L35 14L27 18Z" fill="#DC2626" />
          <text x="48" y="24" fill="#0284C7" fontSize="16" fontWeight="900" fontFamily="sans-serif">Dr. Fixit</text>
          <text x="49" y="37" fill="#F59E0B" fontSize="9" fontWeight="800" letterSpacing="0.8" fontFamily="sans-serif">PIDILITE</text>
        </svg>
      ),
    },
    {
      id: 'sika',
      name: 'Sika',
      category: 'Switzerland',
      role: 'Construction Chemicals',
      categoryId: 'chemicals',
      tagline: 'Sikadur, Sikaflex & Bonding Agents',
      accentBorder: 'border-red-500/50 hover:border-red-500 dark:border-red-500/30',
      accentGlow: 'hover:shadow-red-500/10 group-hover:border-red-500',
      badgeBg: 'bg-red-500/15 text-red-800 dark:text-red-300 border border-red-500/30',
      logo: (
        <svg viewBox="0 0 140 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L44 40H4L24 4Z" fill="#DC2626" />
          <path d="M24 14L34 34H14L24 14Z" fill="#FACC15" />
          <text x="50" y="31" fill="#DC2626" fontSize="22" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">Sika®</text>
        </svg>
      ),
    },
    {
      id: 'nippon-paint',
      name: 'Nippon Paint',
      category: 'Japan Tech',
      role: 'Decorative & PU Paints',
      categoryId: 'paints',
      tagline: 'Odourless Aircare, Weatherbond & PU',
      accentBorder: 'border-rose-500/50 hover:border-rose-500 dark:border-rose-500/30',
      accentGlow: 'hover:shadow-rose-500/10 group-hover:border-rose-500',
      badgeBg: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="22" r="14" fill="#E11D48" />
          <path d="M12 22C12 16 16 12 20 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="40" y="21" fill="#E11D48" fontSize="13" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">NIPPON</text>
          <text x="40" y="35" fill="#0F172A" className="dark:fill-white" fontSize="12" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">PAINT</text>
        </svg>
      ),
    },
    {
      id: 'birla-opus',
      name: 'Birla Opus',
      category: 'Aditya Birla',
      role: 'Luxury Wall Finishes',
      categoryId: 'paints',
      tagline: 'Allwood Luxury Finishes & Calista',
      accentBorder: 'border-purple-500/50 hover:border-purple-500 dark:border-purple-500/30',
      accentGlow: 'hover:shadow-purple-500/10 group-hover:border-purple-500',
      badgeBg: 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border border-purple-500/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(6, 8)">
            <circle cx="14" cy="14" r="6" fill="#D97706" />
            <path d="M14 2V6M14 22V26M2 14H6M22 14H26M5.5 5.5L8.5 8.5M19.5 19.5L22.5 22.5M5.5 22.5L8.5 19.5M19.5 8.5L22.5 5.5" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="38" y="20" fill="#7C3AED" fontSize="12" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">BIRLA</text>
          <text x="38" y="35" fill="#D97706" fontSize="15" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">OPUS</text>
        </svg>
      ),
    },
    {
      id: 'akzonobel',
      name: 'AkzoNobel',
      category: 'Dulux Global',
      role: 'Protective Coatings',
      categoryId: 'paints',
      tagline: 'Weathershield & High Performance',
      accentBorder: 'border-blue-600/50 hover:border-blue-600 dark:border-blue-500/30',
      accentGlow: 'hover:shadow-blue-600/10 group-hover:border-blue-600',
      badgeBg: 'bg-blue-600/15 text-blue-800 dark:text-blue-300 border border-blue-600/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 32C18 14 30 8 36 20C30 18 22 23 18 34" fill="#2563EB" />
          <circle cx="34" cy="10" r="4" fill="#2563EB" />
          <text x="44" y="28" fill="#1E40AF" className="dark:fill-sky-400" fontSize="15" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">AkzoNobel</text>
        </svg>
      ),
    },
    {
      id: 'birla-white',
      name: 'Birla White',
      category: 'Aditya Birla',
      role: 'WallCare Putty & Primer',
      categoryId: 'paints',
      tagline: 'Waterproof Wall Putty & Extocare',
      accentBorder: 'border-emerald-500/50 hover:border-emerald-500 dark:border-emerald-500/30',
      accentGlow: 'hover:shadow-emerald-500/10 group-hover:border-emerald-500',
      badgeBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(6, 8)">
            <circle cx="14" cy="14" r="6" fill="#059669" />
            <path d="M14 2V6M14 22V26M2 14H6M22 14H26M5.5 5.5L8.5 8.5M19.5 19.5L22.5 22.5M5.5 22.5L8.5 19.5M19.5 8.5L22.5 5.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="38" y="20" fill="#059669" fontSize="12" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">BIRLA</text>
          <text x="38" y="35" fill="#0F172A" className="dark:fill-white" fontSize="13" fontWeight="900" letterSpacing="1" fontFamily="sans-serif">WHITE</text>
        </svg>
      ),
    },
    {
      id: 'rakshak',
      name: 'Rakshak',
      category: 'Membranes',
      role: 'Heavy-Duty Waterproofing',
      categoryId: 'waterproofing',
      tagline: 'APP Bituminous Membranes & Geotextile',
      accentBorder: 'border-teal-500/50 hover:border-teal-500 dark:border-teal-500/30',
      accentGlow: 'hover:shadow-teal-500/10 group-hover:border-teal-500',
      badgeBg: 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/30',
      logo: (
        <svg viewBox="0 0 160 44" className="h-9 w-auto mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 6L34 11V22C34 30 28 36 22 39C16 36 10 30 10 22V11L22 6Z" fill="#0D9488" />
          <path d="M17 21L21 25L27 17" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="42" y="23" fill="#0D9488" fontSize="14" fontWeight="900" letterSpacing="0.5" fontFamily="sans-serif">RAKSHAK</text>
          <text x="43" y="35" fill="#64748B" fontSize="9" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">MEMBRANES</text>
        </svg>
      ),
    },
  ];

  // Quadruple the array to ensure perfectly continuous, infinite left-to-right scrolling with zero seam
  const scrollingBrandList = [...brands, ...brands, ...brands, ...brands];

  return (
    <section
      id="brand-partners-section"
      className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-y border-slate-200/80 dark:border-slate-800 py-12 px-0 overflow-hidden transition-colors duration-200"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Direct Authorized Dealership • Lucknow</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Official Partner Brands & Certified Products
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
              Supplying 100% factory-sealed chemicals, heavy-duty membranes, and architectural paints with official manufacturer warranties and direct GST invoicing.
            </p>
          </div>

          {/* Interactive Pause & Control Ribbon */}
          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs"
              title={isPaused ? 'Resume scrolling animation' : 'Pause scrolling animation'}
              aria-label={isPaused ? 'Resume brand scrolling' : 'Pause brand scrolling'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isPaused ? 'Resume Scroll' : 'Pause'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTINUOUS LEFT-TO-RIGHT SCROLLING MARQUEE CONTAINER */}
      <div
        id="brands-scrolling-marquee-container"
        className="relative w-full overflow-hidden py-3 pause-on-hover"
      >
        {/* Left Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent z-10 pointer-events-none" />

        {/* Right Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent z-10 pointer-events-none" />

        {/* The Animated Track - Scrolls Smoothly from Left to Right */}
        <div
          className={`flex items-center gap-4 sm:gap-6 w-max ${
            isPaused ? '' : 'animate-marquee-ltr'
          }`}
          style={{ willChange: 'transform' }}
        >
          {scrollingBrandList.map((b, index) => (
            <div
              key={`${b.id}-${index}`}
              id={`brand-marquee-card-${b.id}-${index}`}
              onClick={() => handleBrandClick(b.categoryId)}
              className={`group cursor-pointer w-[240px] sm:w-[280px] p-5 rounded-2xl border bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-850 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl shrink-0 flex flex-col justify-between text-left select-none ${b.accentBorder} ${b.accentGlow}`}
            >
              {/* Top Row with Category Tag and Verified Icon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${b.badgeBg}`}>
                  {b.category}
                </span>

                <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Authorized</span>
                </span>
              </div>

              {/* Logo Area */}
              <div className="w-full h-14 flex items-center justify-center my-2 p-1 group-hover:scale-105 transition-transform duration-300">
                {b.logo}
              </div>

              {/* Card Footer Details */}
              <div className="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {b.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[170px] sm:max-w-[190px]">
                    {b.role}
                  </p>
                </div>

                <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Trust Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">100% Genuine Certified Batch</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">Authorized Manufacturer Warranty</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">Direct GST Invoices & ITC Credit</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">Express Site Delivery in Lucknow</span>
          </div>
        </div>
      </div>
    </section>
  );
};
