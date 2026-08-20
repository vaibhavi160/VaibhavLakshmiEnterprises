import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromoBannerCarousel } from './components/PromoBannerCarousel';
import { BrandPartners } from './components/BrandPartners';
import { ProductCard } from './components/ProductCard';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductReviewModal } from './components/ProductReviewModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ServicesSection } from './components/ServicesSection';
import { QuoteModal } from './components/QuoteModal';
import { CartDrawer } from './components/CartDrawer';
import { SupportChatWidget } from './components/SupportChatWidget';
import { AuthModal } from './components/AuthModal';
import { OrdersTrackingModal } from './components/OrdersTrackingModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Product } from './types';
import { ArrowRight, Wrench, Package, ShieldCheck, Sparkles, Building2, Loader2 } from 'lucide-react';

// Code-split heavy views using React.lazy for optimized bundle size & initial load speed
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const AboutContact = lazy(() => import('./components/AboutContact'));

const PageLoadingFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[40vh] space-y-4">
    <div className="p-4 bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3 shadow-sm">
      <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
      <div>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Loading Module...</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">Optimizing experience for Maa Vaibhav Lakshmi Enterprises</p>
      </div>
    </div>
  </div>
);

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    products,
    setIsQuoteOpen,
    theme,
    selectedProductId,
    setSelectedProductId,
    selectedServiceId,
    setSelectedServiceId,
    reviewModalProduct,
    closeReviewModal,
  } = useApp();

  // Initialize theme mode on document root: defaults to 'light' mode upon initial load
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('mvle_theme_v1');
    const effectiveTheme = (savedTheme === 'dark' || theme === 'dark') ? 'dark' : 'light';

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Deep linking check on URL load or hash change
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const prodParam = params.get('product');

      if (prodParam) {
        setSelectedProductId(prodParam);
      } else if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        setSelectedProductId(id);
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    return () => window.removeEventListener('hashchange', handleUrlCheck);
  }, []);

  // Scroll to top and update dynamic SEO canonical link & document title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Dynamic SEO Title & Canonical URL management
    const baseUrl = window.location.origin || 'https://ais-pre-2psf4o3hm5cgs64xqj5veo-844279947682.asia-east1.run.app';
    let title = 'Waterproofing Services & Construction Chemicals Lucknow | Maa Vaibhav Lakshmi Enterprises';
    let canonicalUrl = `${baseUrl}/`;
    let metaDesc = 'Top-rated waterproofing services & authorized construction chemicals dealer in Lucknow. Dr. Fixit, Sika, Nippon Paint & Birla Opus in Chinhat, Gomti Nagar & Faizabad Road.';

    if (selectedProductId) {
      const selectedProd = products.find(p => p.id === selectedProductId);
      if (selectedProd) {
        title = `${selectedProd.name} | Construction Chemicals Dealer Lucknow`;
        canonicalUrl = `${baseUrl}/#product-${selectedProd.id}`;
        metaDesc = `Buy ${selectedProd.name} (${selectedProd.brand}) in Lucknow at authorized dealer wholesale rates. Genuine construction chemicals & expert application advice from Maa Vaibhav Lakshmi Enterprises.`;
      }
    } else if (activeTab === 'products') {
      title = 'Construction Chemicals & Waterproofing Products in Lucknow | Wholesale Catalog';
      canonicalUrl = `${baseUrl}/#products`;
      metaDesc = 'Browse genuine Dr. Fixit waterproofing compounds, Sika bonding agents, epoxy coatings & luxury paints with wholesale contractor volume pricing in Lucknow.';
    } else if (activeTab === 'services') {
      title = 'Waterproofing Services & Leakage Contractors in Lucknow | Terrace, Basement & PU Grouting';
      canonicalUrl = `${baseUrl}/#services`;
      metaDesc = 'Professional waterproofing services in Lucknow with warranty. Terrace leakage repair, PU injection grouting, bathroom dampness sealing & structural concrete repair by certified master applicators.';
    } else if (activeTab === 'about') {
      title = 'Waterproofing Specialists & Store Location | Chinhat, Faizabad Road Lucknow';
      canonicalUrl = `${baseUrl}/#about`;
      metaDesc = 'Visit Maa Vaibhav Lakshmi Enterprises near Neem Karauli Dham, Faizabad Road, Chinhat, Lucknow. Serving Lucknow with construction chemicals and waterproofing since 2012.';
    } else if (activeTab === 'dealers') {
      title = 'Authorized Dr. Fixit & Sika Dealer Lucknow | Brand Certifications';
      canonicalUrl = `${baseUrl}/#dealers`;
      metaDesc = 'Authorized dealer certificates for Dr. Fixit (Pidilite), Sika India, Nippon Paint and Birla Opus in Lucknow. 100% genuine products with manufacturer backing.';
    } else if (activeTab === 'admin') {
      title = 'Store Admin Portal | Maa Vaibhav Lakshmi Enterprises';
    }

    document.title = title;

    // Update canonical link in DOM
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // Update meta description
    let descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descEl) {
      descEl.setAttribute('content', metaDesc);
    }
  }, [activeTab, selectedProductId, products]);

  const handleOpenDetail = (p: Product) => {
    setSelectedProductId(p.id);
  };

  const handleCloseDetail = () => {
    setSelectedProductId(null);
    // Clean URL query/hash without page reload
    window.history.replaceState(null, '', window.location.pathname);
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200 pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Global Application Header */}
      <Header />

      {/* Main View Renderer */}
      <main className="flex-1 min-h-[calc(100vh-140px)]">
        <Suspense fallback={<PageLoadingFallback />}>
          <AnimatePresence mode="wait">
            {(activeTab === 'home' || !['products', 'services', 'about', 'profile', 'admin'].includes(activeTab)) && (
              <motion.div
                key="view-home"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="space-y-4"
              >
                <PromoBannerCarousel />
                <Hero />
                <BrandPartners />

                {/* Featured Marketplace Products Showcase */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Popular Construction Chemicals</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Featured Products & Waterproofing Solvers
                      </h2>
                    </div>

                    <button
                      id="home-view-all-products-btn"
                      onClick={() => {
                        setActiveTab('products');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-700/80 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-xs"
                    >
                      <span>View Full Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                      <ProductCard key={product.id} product={product} onOpenDetail={handleOpenDetail} />
                    ))}
                  </div>
                </section>

                {/* Services Highlight Banner */}
                <ServicesSection />
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="view-products"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <ProductGrid onOpenDetail={handleOpenDetail} />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="view-services"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <ServicesSection />
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="view-about"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <AboutContact />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="view-profile"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <UserProfile />
              </motion.div>
            )}

            {activeTab === 'admin' && (
              <motion.div
                key="view-admin"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Global Modals & Floating Tools */}
      <ProductDetailModal
        productId={selectedProductId}
        onClose={handleCloseDetail}
        onSelectProduct={p => setSelectedProductId(p.id)}
      />

      <ProductReviewModal
        product={reviewModalProduct?.product || null}
        orderId={reviewModalProduct?.orderId}
        onClose={closeReviewModal}
      />

      <ServiceDetailModal
        serviceId={selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
      />

      <QuoteModal />
      <CartDrawer />
      <AuthModal />
      <OrdersTrackingModal />
      <SupportChatWidget />
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
