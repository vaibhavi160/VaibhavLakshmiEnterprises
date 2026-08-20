import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Star, Share2, MessageCircle, AlertCircle, PackageX } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, settings, showToast, getShareableProductUrl, user } = useApp();
  const isOutOfStock = product.stock <= 0;
  const isAdmin = user?.role === 'admin';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = getShareableProductUrl(product);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast('Product link copied to clipboard!', 'success');
    } else {
      showToast(`Product URL: ${shareUrl}`, 'info');
    }
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = isOutOfStock
      ? `Hello Maa Vaibhav Lakshmi Enterprises, I noticed that "${product.name}" (${product.unit}) is currently out of stock. When will new stock arrive at your Lucknow store?`
      : `Hello, I am interested in ${product.name} (${product.unit}) priced at ₹${product.price}. Please provide availability & delivery details.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Admin decided promotional offer - ONLY if explicitly activated by admin
  const hasActiveOffer = product.isOfferActive === true && (
    Boolean(product.offerText) || Boolean(product.discountPercentage && product.discountPercentage > 0)
  );
  const offerBadgeLabel = product.offerText || (product.discountPercentage ? `${product.discountPercentage}% OFF` : '');

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenDetail(product)}
      className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer interactive-card ${
        isOutOfStock
          ? 'border-red-200 dark:border-red-900/50 opacity-95'
          : 'border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-600 dark:hover:border-emerald-600'
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={product.mainImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              isOutOfStock ? 'grayscale-[40%] group-hover:scale-100' : 'group-hover:scale-108'
            }`}
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Out of Stock Overlay Banner */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="bg-red-700 text-white font-bold text-[11px] sm:text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wider border border-white/20">
                <PackageX className="w-3.5 h-3.5" />
                <span>Out of Stock</span>
              </div>
            </div>
          )}

          {/* Admin Decided Offer Badge - Only shown when active offer defined by admin */}
          {!isOutOfStock && hasActiveOffer && (
            <span
              id={`product-offer-badge-${product.id}`}
              className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-amber-700 text-white font-bold text-[9px] sm:text-[10px] px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wider max-w-[70%] truncate backdrop-blur-xs"
              title={offerBadgeLabel}
            >
              {offerBadgeLabel}
            </span>
          )}

          {/* Quick Share Overlay Button */}
          <button
            id={`share-btn-${product.id}`}
            onClick={handleShare}
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-slate-900/80 hover:bg-emerald-600 text-slate-700 dark:text-slate-300 hover:text-white transition-all shadow-md backdrop-blur-md hover:scale-110 active:scale-95"
            title="Share product link"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* Brand & Category Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              {product.brand}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[9px] sm:text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-24">
              {product.unit}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating - Default is 0 */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500 dark:text-amber-400">
            <Star className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${product.rating > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'} shrink-0`} />
            <span className="font-bold">{product.rating > 0 ? product.rating.toFixed(1) : '0.0'}</span>
            <span className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-[10px]">
              {product.reviewCount > 0 ? `(${product.reviewCount})` : '(0 reviews)'}
            </span>
          </div>

          {/* Pricing - Strike-through only if active offer defined by admin */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasActiveOffer && product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-3 sm:p-4 pt-0 grid grid-cols-2 gap-2">
        {isOutOfStock ? (
          <button
            id={`add-cart-btn-${product.id}`}
            disabled
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 px-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1 truncate"
            title="This product is currently out of stock"
          >
            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 shrink-0" />
            <span className="truncate">Out of Stock</span>
          </button>
        ) : (
          <button
            id={`add-cart-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 px-1.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 dark:border-slate-700 flex items-center justify-center gap-1 transition-all interactive-button truncate"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>
        )}

        <button
          id={`wa-enquiry-btn-${product.id}`}
          onClick={handleWhatsAppEnquiry}
          className={`w-full text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 px-1.5 rounded-xl flex items-center justify-center gap-1 transition-all interactive-button shadow-xs truncate ${
            isOutOfStock
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{isOutOfStock ? 'Enquire' : 'WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};
