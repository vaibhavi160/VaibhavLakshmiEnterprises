import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { X, Star, CheckCircle2, ShieldCheck, MessageSquare, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';

interface ProductReviewModalProps {
  product: Product | null;
  orderId?: string;
  onClose: () => void;
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  product,
  orderId,
  onClose,
}) => {
  const { user, addProductReview, hasUserPurchasedProduct, showToast, setIsTrackingModalOpen } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>(user?.name || '');
  const [city, setCity] = useState<string>(user?.city || 'Lucknow');
  const [loading, setLoading] = useState<boolean>(false);

  if (!product) return null;

  // Check if purchase is verified
  const purchaseCheck = hasUserPurchasedProduct(product.id, user?.email || user?.uid);
  const isVerified = Boolean(orderId || purchaseCheck.purchased);
  const activeOrderId = orderId || purchaseCheck.orderId;

  const starLabels: Record<number, string> = {
    1: 'Poor Quality - Not Recommended',
    2: 'Fair - Needs Improvement',
    3: 'Average - Met Basic Needs',
    4: 'Very Good - Recommended',
    5: 'Outstanding - Highly Recommended!',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      showToast('Only customers who have ordered this product can submit a review.', 'error');
      return;
    }

    if (!comment.trim()) {
      showToast('Please provide your review feedback.', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await addProductReview({
        productId: product.id,
        productName: product.name,
        productImage: product.mainImage,
        orderId: activeOrderId,
        userId: user?.uid,
        userName: reviewerName.trim() || user?.name || 'Verified Customer',
        userEmail: user?.email,
        userCity: city.trim() || 'Lucknow',
        rating: rating,
        title: title.trim() || `${rating}★ Review for ${product.name}`,
        comment: comment.trim(),
        isVerifiedPurchase: true,
      });

      if (success) {
        onClose();
      }
    } catch (err: any) {
      showToast(err.message || 'Error submitting review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="product-review-modal-overlay" className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div id="product-review-modal-card" className="glass-modal-card rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-slate-900 dark:text-slate-100 my-auto">
        <button
          id="review-modal-close-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0 pr-6">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700/60">
              {product.brand}
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate mt-1">
              {product.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Pack: {product.unit} • ₹{product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Verified Purchase Status Banner */}
        {isVerified ? (
          <div className="mb-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="font-extrabold flex items-center gap-1">
                <span>Verified Buyer Feedback</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Purchased from Maa Vaibhav Lakshmi Enterprises {activeOrderId ? `(Order #${activeOrderId.slice(-6).toUpperCase()})` : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Verified Customer Order Required</span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              Reviews can only be added by customers who have ordered this specific product from Maa Vaibhav Lakshmi Enterprises.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsTrackingModalOpen(true);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Check My Order History</span>
              </button>
            </div>
          </div>
        )}

        {/* Review Form */}
        {isVerified ? (
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Overall Product Rating
            </label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-auto text-right">
                {starLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Review Headline (Summary)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Excellent waterproofing result for my roof slab"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Detailed Comments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Feedback & Performance Notes
            </label>
            <textarea
              required
              rows={3}
              placeholder="Write about mixing/application ease, waterproofing effectiveness, surface adhesion, delivery speed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Reviewer Name and City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Verma"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Location / City
              </label>
              <input
                type="text"
                placeholder="e.g. Chinhat, Lucknow"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors text-xs disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Review...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Submit Product Review</span>
              </>
            )}
          </button>
        </form>
        ) : (
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
