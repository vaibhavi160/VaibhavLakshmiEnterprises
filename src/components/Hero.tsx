import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  Sparkles,
  Phone,
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab, setIsQuoteOpen, settings } = useApp();

  return (
    <section id="homepage-hero" className="relative bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Top Subtitle Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/90 dark:border-emerald-700/50 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs max-w-full truncate">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Maa Vaibhav Lakshmi Enterprises • Chinhat, Lucknow</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Engineered Protection & <br className="hidden sm:inline" />
              <span className="text-emerald-600 dark:text-emerald-400">
                Master Waterproofing Execution
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Specialist Applicator & Authorized Dealer in Lucknow. We supply genuine construction chemicals, waterproofing systems, and decorative paints while delivering certified on-site execution with warranty.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                id="hero-explore-products-btn"
                onClick={() => {
                  setActiveTab('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all interactive-button min-h-[46px]"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-get-quote-btn"
                onClick={() => setIsQuoteOpen(true)}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold px-6 py-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all interactive-button min-h-[46px]"
              >
                <Wrench className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Get a Service Quote</span>
              </button>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">100% Genuine</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">Dr. Fixit, Sika & Paints</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">Certified Team</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">Master Applicators</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 col-span-2 sm:col-span-1">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">Lucknow Based</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">Chinhat, Gomti Nagar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards Stack */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800/60 shadow-xl bg-white dark:bg-slate-900 group interactive-card">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                  alt="Construction & Waterproofing Site Execution"
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 dark:from-slate-950 dark:via-slate-950/40 to-transparent" />

                {/* Overlaid Bottom Card */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Specialist Application Service</span>
                    <span className="bg-emerald-700 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[10px] sm:text-[11px] line-clamp-2">
                    Roof Waterproofing, Structural Repairs, Injection Grouting & PU Coatings with complete technical guidance.
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="absolute -top-3 -left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-lg hidden sm:flex items-center gap-2.5 backdrop-blur-md interactive-card">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center justify-center font-bold text-xs">
                  15+
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Years Experience</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Lucknow Region</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-3 -right-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-lg hidden sm:flex items-center gap-2.5 backdrop-blur-md interactive-card">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-xl flex items-center justify-center font-bold text-xs">
                  100%
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Quality Guarantee</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">On-Site Execution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
