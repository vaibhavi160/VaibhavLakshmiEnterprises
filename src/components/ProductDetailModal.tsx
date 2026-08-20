import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingCart,
  MessageCircle,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Star,
  Truck,
  RotateCcw,
  Building2,
  ArrowRight,
  Copy,
  MessageSquare,
  Sparkles,
  Trash2,
  Reply,
  Send,
} from 'lucide-react';

interface ProductDetailModalProps {
  productId: string | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
  onSelectProduct,
}) => {
  const {
    products,
    addToCart,
    settings,
    showToast,
    getShareableProductUrl,
    user,
    updateProduct,
    reviews,
    openReviewModal,
    hasUserPurchasedProduct,
    deleteProductReview,
    addSellerReplyToReview,
  } = useApp();
  const isAdmin = user?.role === 'admin';

  const product = products.find(p => p.id === productId || p.slug === productId);

  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedImg(product.mainImage || (product.images && product.images[0]) || '');
      setQuantity(1);
      // Update browser URL hash/query without page reload
      const shareUrl = getShareableProductUrl(product);
      window.history.replaceState(null, '', `?product=${product.id}#product-${product.id}`);
    }
  }, [product]);

  if (!productId || !product) return null;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const purchaseInfo = hasUserPurchasedProduct(product.id, user?.email || user?.uid);

  // Compute average score & distribution strictly from customer reviews
  const avgRating = productReviews.length > 0
    ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1))
    : 0;
  const reviewCount = productReviews.length;

  const starCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: productReviews.filter(r => r.rating === stars).length,
    percentage: productReviews.length > 0 ? Math.round((productReviews.filter(r => r.rating === stars).length / productReviews.length) * 100) : 0,
  }));

  const relatedProducts = products
    .filter(p => p && p.id && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const isOutOfStock = product.stock <= 0;

  // Admin decided promotional offer
  const hasActiveOffer = product.isOfferActive === true && (
    Boolean(product.offerText) || Boolean(product.discountPercentage && product.discountPercentage > 0)
  );
  const offerBadgeLabel = product.offerText || (product.discountPercentage ? `${product.discountPercentage}% OFF` : '');

  const handleShare = () => {
    const url = getShareableProductUrl(product);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Shareable product link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleWhatsAppOrder = () => {
    const msg = isOutOfStock
      ? `Hello Maa Vaibhav Lakshmi Enterprises, I am checking about restock for "${product.name}" (${product.unit}). Please let me know when it will be available in Lucknow store.`
      : `Hello Maa Vaibhav Lakshmi Enterprises, I would like to enquire / order:\nProduct: ${product.name}\nPack Unit: ${product.unit}\nQuantity: ${quantity}\nTotal Price: ₹${product.price * quantity}\nPlease advise availability in Lucknow.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handlePostSellerReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    await addSellerReplyToReview(reviewId, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div id="product-detail-modal-card" className="glass-modal-card rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        {/* Sticky Top Modal Header */}
        <div className="sticky top-0 z-20 glass-header-bar px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
              {product.brand}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">SKU: {product.sku}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="product-share-btn"
              onClick={handleShare}
              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              id="product-modal-close-btn"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <img
                  src={selectedImg || product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Admin decided offer badge */}
                {hasActiveOffer && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
                    {offerBadgeLabel}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImg === img ? 'border-emerald-500 scale-105' : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Purchase Panel */}
            <div className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pack Size / Unit: <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{product.unit}</span></p>
              </div>

              {/* Rating & Verified Buyer prompt */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-500 dark:text-amber-400">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                    <Star className={`w-3.5 h-3.5 ${avgRating > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    <span className="font-bold">{avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {reviewCount > 0 ? `(${reviewCount} customer reviews)` : '(0 reviews • Be the first buyer to review)'}
                  </span>
                </div>

                {/* Verified Buyer Review Action Callout */}
                {purchaseInfo.purchased ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 p-3 rounded-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-extrabold text-[11px]">Verified Purchase on Your Account</p>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">You bought this product in order #{purchaseInfo.orderId?.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      id="verified-write-review-btn"
                      onClick={() => openReviewModal(product, purchaseInfo.orderId)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Write Review</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span className="text-[11px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reviews verified via order records</span>
                    </span>
                    <button
                      onClick={() => openReviewModal(product)}
                      className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline text-[11px] flex items-center gap-1"
                    >
                      <span>Add Feedback</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Block & Offer */}
              <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {hasActiveOffer && product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Net Store Price • {product.unit}</p>
                  </div>

                  {/* Stock Status Badge */}
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        !isOutOfStock
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/60'
                          : 'bg-red-600 text-white border border-red-500 font-extrabold'
                      }`}
                    >
                      {!isOutOfStock ? 'In Stock • Ready for Delivery' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Admin decided offer announcement */}
                {hasActiveOffer && product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                    <span>{product.offerText || 'Special Promotional Offer'}</span>
                    <span className="font-bold">Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}!</span>
                  </div>
                )}
              </div>

              {/* Out of Stock Notice Banner */}
              {isOutOfStock && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>Currently Unavailable in Lucknow Warehouse</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    This material is currently out of stock. You can send a direct inquiry to our team via WhatsApp to get the next shipment arrival date or pre-reserve your batch.
                  </p>
                </div>
              )}

              {/* Quantity Controls */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {isOutOfStock ? (
                  <button
                    id="modal-add-cart-btn"
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs cursor-not-allowed"
                  >
                    <span>Item Out of Stock</span>
                  </button>
                ) : (
                  <button
                    id="modal-add-cart-btn"
                    onClick={() => addToCart(product, quantity)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors text-xs"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} to Cart</span>
                  </button>
                )}

                <button
                  id="modal-whatsapp-enquiry-btn"
                  onClick={handleWhatsAppOrder}
                  className={`w-full font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs ${
                    isOutOfStock
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-white dark:text-white" />
                  <span>{isOutOfStock ? 'Enquire Restock on WhatsApp' : 'Instant WhatsApp Order'}</span>
                </button>
              </div>

              {/* Guarantee badges */}
              <div className="pt-3 divide-y divide-slate-200 dark:divide-slate-800/80 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Genuine product directly from {product.brand}</span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Fast Lucknow Local Delivery & On-Site Pickup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs Tabs */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Product Overview</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                {product.description}
              </p>
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Technical Specifications</h3>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-3">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{spec.key}</span>
                      <span className="col-span-2 text-slate-800 dark:text-slate-200">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verified Customer Reviews Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <span>Customer Ratings & Reviews</span>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60">
                    {productReviews.length} Reviews
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Authentic feedback from verified buyers in Lucknow and UP</p>
              </div>

              {purchaseInfo.purchased ? (
                <button
                  onClick={() => openReviewModal(product, purchaseInfo.orderId)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write Verified Review</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
                  Reviews enabled for verified buyers
                </span>
              )}
            </div>

            {/* Rating Breakdown Dashboard Card */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:border-r md:border-slate-200 md:dark:border-slate-800 md:pr-6">
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</div>
                <div className="flex items-center justify-center gap-1 my-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        avgRating > 0 && s <= Math.round(avgRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Based on {reviewCount} customer {reviewCount === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Star Distribution Progress Bars */}
              <div className="md:col-span-2 space-y-1.5 text-xs">
                {starCounts.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="w-10 font-bold text-slate-700 dark:text-slate-300 text-right">{stars} ★</span>
                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-slate-500 dark:text-slate-400 text-[11px] font-medium">{count} ({percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Review Cards */}
            <div className="space-y-3 pt-2">
              {productReviews.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No reviews yet for this product.</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {purchaseInfo.purchased
                      ? 'You purchased this item! Share your feedback with other customers in Lucknow.'
                      : 'Reviews are added exclusively by customers who ordered this product.'}
                  </p>
                  {purchaseInfo.purchased && (
                    <button
                      onClick={() => openReviewModal(product, purchaseInfo.orderId)}
                      className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Write First Review</span>
                    </button>
                  )}
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300 dark:text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">{rev.title}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified Purchase</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{rev.userName}</span>
                          {rev.userCity && <span> • {rev.userCity}</span>}
                          <span> • {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Admin moderation controls */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setReplyingReviewId(replyingReviewId === rev.id ? null : rev.id)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Reply to review"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProductReview(rev.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs pt-1">
                      {rev.comment}
                    </p>

                    {/* Official Seller Reply */}
                    {rev.sellerReply && (
                      <div className="mt-2 bg-emerald-50/70 dark:bg-emerald-950/30 border-l-2 border-emerald-500 p-2.5 rounded-r-xl text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Seller Response • {rev.sellerReply.author}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-normal">
                          {rev.sellerReply.comment}
                        </p>
                      </div>
                    )}

                    {/* Admin Reply Input Box */}
                    {isAdmin && replyingReviewId === rev.id && (
                      <div className="mt-2 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-300 dark:border-slate-800 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write official response from Maa Vaibhav Lakshmi Enterprises..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handlePostSellerReply(rev.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">Related Products in {product.brand}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-left hover:border-emerald-600 transition-all group"
                  >
                    <img src={rel.mainImage} alt={rel.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                    <p className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{rel.name}</p>
                    <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs mt-1">₹{rel.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
