import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Wrench,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    cartItemCount,
    setIsCartOpen,
    setIsAuthOpen,
    setIsQuoteOpen,
    user,
    settings,
    products,
    categories,
    selectedProductId,
    setSelectedProductId,
    adminUnreadChatCount,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = searchQuery.trim()
    ? products
        .filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectSearchItem = (prodId: string) => {
    setSelectedProductId(prodId);
    setShowSearchDropdown(false);
    setSearchQuery('');
    setActiveTab('products');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About Us' },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/70 dark:border-slate-800/70 text-slate-800 dark:text-white shadow-xs dark:shadow-2xl backdrop-blur-xl transition-colors duration-200">
      {/* Main Header Row */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            id="brand-logo-btn"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left group shrink-0 cursor-pointer transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Logo variant="horizontal" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="relative hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0 bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          {navItems.map(item => {
            const isActive = activeTab === item.id && !selectedProductId;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedProductId(null);
                }}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap min-h-[34px] flex items-center justify-center transition-colors duration-150 z-10 ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktopNavActivePill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/80 -z-10"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <button
              id="admin-nav-link"
              onClick={() => {
                setActiveTab('admin');
                setSelectedProductId(null);
              }}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap min-h-[34px] z-10 ${
                activeTab === 'admin'
                  ? 'bg-amber-700 text-white shadow-xs border border-amber-750'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
              {adminUnreadChatCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                  {adminUnreadChatCount}
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live Search Input (XL screens and above) */}
          <div ref={searchRef} className="relative hidden xl:block w-44 2xl:w-56">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Dropdown Results */}
            {showSearchDropdown && searchQuery.trim().length > 0 && (
              <div
                id="header-search-results"
                className="absolute left-0 right-0 top-full mt-2 glass-floating-popover rounded-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-200 min-w-[240px]"
              >
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  Matching Products
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
                    {filteredProducts.map(prod => (
                      <button
                        key={prod.id}
                        id={`search-result-${prod.id}`}
                        onClick={() => handleSelectSearchItem(prod.id)}
                        className="w-full text-left p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors min-h-[44px]"
                      >
                        <img
                          src={prod.mainImage}
                          alt={prod.name}
                          className="w-8 h-8 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{prod.name}</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            {prod.brand} • ₹{prod.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">No products found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center shrink-0"
            aria-label="Toggle Light and Dark Mode"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Get Quote CTA Button */}
          <button
            id="header-get-quote-btn"
            onClick={() => setIsQuoteOpen(true)}
            className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Get Quote</span>
          </button>

          {/* Cart Trigger */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="View Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartItemCount > 0 && (
              <span
                id="cart-badge-count"
                className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[10px] min-w-4 h-4 rounded-full px-1 flex items-center justify-center border border-white dark:border-slate-900 shadow-xs"
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Auth Profile Trigger */}
          <button
            id="header-user-btn"
            onClick={() => {
              if (user) {
                setActiveTab('profile');
              } else {
                setIsAuthOpen(true);
              }
            }}
            className={`flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
              user
                ? 'bg-emerald-50 dark:bg-slate-800 border-emerald-300 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-slate-700'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-emerald-500/50 shrink-0"
              />
            ) : (
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span className="hidden sm:inline truncate text-xs font-semibold">
              {user ? (user.role === 'admin' ? 'Admin' : user.name.split(' ')[0]) : 'Login'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 shadow-lg">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search products or services..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveTab('products');
              }}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedProductId(null);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              id="mobile-get-quote-btn"
              onClick={() => {
                setIsQuoteOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Get Free On-Site Inspection Quote</span>
            </button>

            {user?.role === 'admin' && (
              <button
                id="mobile-admin-btn"
                onClick={() => {
                  setActiveTab('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="col-span-2 bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <span>Go to Admin Portal</span>
                {adminUnreadChatCount > 0 && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {adminUnreadChatCount} New
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
