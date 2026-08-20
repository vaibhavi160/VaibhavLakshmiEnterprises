import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Package,
  Wrench,
  ShoppingCart,
  User,
  PhoneCall,
  MessageCircle,
  FileText,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartItemCount,
    setIsCartOpen,
    setIsQuoteOpen,
    user,
    setIsAuthOpen,
    settings,
    setSelectedProductId,
  } = useApp();

  const handleNavClick = (tabId: string) => {
    setSelectedProductId(null);
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-dock px-2 py-1.5 transition-all duration-200"
      aria-label="Mobile Quick Navigation"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* Home */}
        <button
          id="mobile-bnav-home"
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] ${
            activeTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Catalog / Products */}
        <button
          id="mobile-bnav-products"
          onClick={() => handleNavClick('products')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] ${
            activeTab === 'products'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </button>

        {/* Services */}
        <button
          id="mobile-bnav-services"
          onClick={() => handleNavClick('services')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] ${
            activeTab === 'services'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Services</span>
        </button>

        {/* Cart */}
        <button
          id="mobile-bnav-cart"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all min-h-[44px]"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white font-bold text-[9px] min-w-4 h-4 rounded-full px-1 flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Profile / Account */}
        <button
          id="mobile-bnav-profile"
          onClick={() => {
            if (user) {
              handleNavClick('profile');
            } else {
              setIsAuthOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[44px] ${
            activeTab === 'profile'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5 mb-0.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] tracking-tight truncate max-w-12">
            {user ? 'Account' : 'Login'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
