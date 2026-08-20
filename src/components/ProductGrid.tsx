import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { Filter, SlidersHorizontal, Search, RotateCcw, PackageSearch, Layers, Loader2, Database } from 'lucide-react';

interface ProductGridProps {
  onOpenDetail: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onOpenDetail }) => {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    isDatabaseLoading,
    syncAllToFirestore,
    user,
  } = useApp();

  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [priceSort, setPriceSort] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.filter(p => p && p.brand).map(p => p.brand)));
    return ['All', ...list];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p && p.active && p.id)
      .filter(p => {
        if (selectedCategoryId && p.categoryId !== selectedCategoryId) return false;
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
        if (stockFilter === 'in-stock' && p.stock <= 0) return false;
        if (stockFilter === 'out-of-stock' && p.stock > 0) return false;
        if (p.price > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'low-high') return a.price - b.price;
        if (priceSort === 'high-low') return b.price - a.price;
        if (priceSort === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategoryId, selectedBrand, stockFilter, maxPrice, searchQuery, priceSort]);

  const resetFilters = () => {
    setSelectedCategoryId(null);
    setSelectedBrand('All');
    setStockFilter('all');
    setMaxPrice(10000);
    setSearchQuery('');
    setPriceSort('featured');
  };

  return (
    <section id="marketplace-products-section" className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Pills Header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog Marketplace</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Construction Chemicals & Products
            </h2>
          </div>

          <button
            id="reset-filters-btn"
            onClick={resetFilters}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors shrink-0 ml-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Filters</span>
            <span className="sm:hidden text-[11px]">Reset</span>
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          <button
            id="cat-tab-all"
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategoryId === null
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Mobile Filter Toggle Header (Visible below lg) */}
        <div className="lg:hidden flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            id="mobile-toggle-filters-btn"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isMobileFilterOpen ? 'Hide Filters' : 'Filter & Sort Products'}</span>
          </button>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Sidebar Filters */}
        <aside
          id="marketplace-sidebar-filters"
          className={`${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          } space-y-6 bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 h-fit shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Filter Catalog</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredProducts.length} Results</span>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keyword Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="filter-search-input"
                type="text"
                placeholder="Search by name, brand..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Brand Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Brand</label>
            <select
              id="filter-brand-select"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            >
              {brands.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Availability</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
              <button
                type="button"
                id="stock-filter-all"
                onClick={() => setStockFilter('all')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  stockFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                id="stock-filter-in"
                onClick={() => setStockFilter('in-stock')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  stockFilter === 'in-stock'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-emerald-600'
                }`}
              >
                In Stock
              </button>
              <button
                type="button"
                id="stock-filter-out"
                onClick={() => setStockFilter('out-of-stock')}
                className={`py-1 rounded-lg font-bold transition-colors ${
                  stockFilter === 'out-of-stock'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-red-500'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sort By</label>
            <select
              id="filter-sort-select"
              value={priceSort}
              onChange={e => setPriceSort(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Max Price</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              id="filter-price-range"
              type="range"
              min="200"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-3">
          {isDatabaseLoading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center space-y-4">
              <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Connecting to Firestore Database...</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fetching live products and categories from Firebase
                </p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div id="no-products-in-db" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Products in Database Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Your new Firebase database is connected. You can add new products via the Admin Dashboard or seed initial store items.
                </p>
              </div>
              {user?.role === 'admin' && (
                <button
                  onClick={() => syncAllToFirestore()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Sync Initial Catalog to Firebase</span>
                </button>
              )}
            </div>
          ) : (
            <div id="no-products-found" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <PackageSearch className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matching products found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try adjusting your search filters or resetting to see all products.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default ProductGrid;
