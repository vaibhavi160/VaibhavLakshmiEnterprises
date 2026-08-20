import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Tag,
  Truck,
  Store,
  UserCheck,
  Lock,
  LogIn,
  MessageCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    placeOrder,
    customerDiscounts,
    appliedDiscount,
    discountAmount,
    applyDiscountCode,
    removeAppliedDiscount,
    user,
    setIsAuthOpen,
    settings,
    showToast,
  } = useApp();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Delivery Form details
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lucknow');
  const [pincode, setPincode] = useState(user?.pincode || '226028');
  // Two payment methods: COD or Pickup
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Pickup'>('COD');

  // Synchronize form details when user logs in or changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.pincode) setPincode(user.pincode);
    }
  }, [user]);

  if (!isCartOpen) return null;

  const discountedSubtotal = Math.max(0, cartTotal - discountAmount);
  // Delivery charges: If Pickup, it is ₹0. If COD, it is decided by owner at the time of shipping
  const isPickup = paymentMethod === 'Pickup';
  const shippingFee = 0;

  // Billing calculation: Materials net total (NO GST, delivery decided at shipping)
  const grandTotal = discountedSubtotal;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyDiscountCode(couponInput, phone || email);
    if (res.success) {
      setCouponFeedback({ msg: res.message, type: 'success' });
      setCouponInput('');
    } else {
      setCouponFeedback({ msg: res.message, type: 'error' });
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      showToast('Please log in or register before checking out.', 'info');
      setIsAuthOpen(true);
      return;
    }
    setIsCheckoutStep(true);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Authentication required: Please log in or create an account to place an order.', 'error');
      setIsAuthOpen(true);
      return;
    }

    if (!name.trim() || !phone.trim()) {
      showToast('Please fill in your name and phone number.', 'error');
      return;
    }

    if (!isPickup && (!address.trim() || !pincode.trim())) {
      showToast('Please fill in complete delivery address and pincode for Cash on Delivery.', 'error');
      return;
    }

    try {
      const order = placeOrder({
        customerName: name.trim(),
        customerEmail: (email || user.email || 'customer@lucknow.in').trim(),
        customerPhone: phone.trim(),
        address: isPickup ? 'Store Self Pick-Up (Chinhat, Lucknow)' : address.trim(),
        city: city.trim(),
        pincode: isPickup ? '226028' : pincode.trim(),
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          image: item.product.mainImage,
        })),
        subtotal: cartTotal,
        totalAmount: grandTotal,
        gstAmount: 0, // No 18% GST
        shippingFee,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        discountCode: appliedDiscount ? appliedDiscount.code : undefined,
        paymentMethod,
        status: 'Pending',
      });

      setCompletedOrder(order);
    } catch (err: any) {
      // Error handled by placeOrder or toast
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsCheckoutStep(false);
    setCompletedOrder(null);
    setCouponFeedback(null);
  };

  const handleWhatsAppOrderReceipt = () => {
    if (!completedOrder) return;
    const discountMsg = completedOrder.discountCode
      ? `\nPersonal Discount: -₹${completedOrder.discountAmount} (Code: ${completedOrder.discountCode})`
      : '';
    const deliveryMsg = completedOrder.paymentMethod === 'Pickup'
      ? 'Delivery Mode: Store Pick-Up (Chinhat Outlet - FREE)'
      : `Delivery Mode: Cash on Delivery (Delivery charges decided by owner at shipping)\nDelivery Address: ${completedOrder.address}, ${completedOrder.city} - ${completedOrder.pincode}`;

    const msg = `Hello Maa Vaibhav Lakshmi Enterprises,\nI have placed Order #${completedOrder.id}:\nCustomer: ${completedOrder.customerName} (${completedOrder.customerPhone})\nSubtotal: ₹${cartTotal}${discountMsg}\nItems Total: ₹${completedOrder.totalAmount}\nPayment Method: ${completedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Store Pick-Up'}\n${deliveryMsg}\nPlease confirm delivery charges & dispatch schedule.`;
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 glass-backdrop flex justify-end">
      <div id="cart-drawer-panel" className="glass-drawer-panel w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="glass-header-bar px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              {completedOrder ? 'Order Confirmed' : isCheckoutStep ? 'Checkout & Delivery' : 'Shopping Cart'}
            </h3>
          </div>

          <button
            id="cart-close-btn"
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">Order #{completedOrder.id} Placed!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Thank you, <span className="text-slate-900 dark:text-white font-semibold">{completedOrder.customerName}</span>. Your order has been placed successfully.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Items Total:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Payment Option:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {completedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Store Pick-Up (Self Pick-Up)'}
                  </span>
                </div>
                {completedOrder.paymentMethod === 'COD' && (
                  <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400">Delivery Charge:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">
                      Decided by owner at the time of shipping
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Address / Location:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right truncate max-w-44">
                    {completedOrder.address}, {completedOrder.city}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="wa-receipt-btn"
                  onClick={handleWhatsAppOrderReceipt}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Order Confirmation</span>
                </button>

                <button
                  onClick={handleClose}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : isCheckoutStep ? (
            !user ? (
              /* Auth Gate Screen */
              <div id="checkout-auth-gate" className="text-center py-8 px-4 space-y-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Sign In Required to Place Order</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    To safeguard order verification, link site delivery records, and apply your customer discounts, please log in or create an account.
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    id="checkout-login-trigger-btn"
                    onClick={() => setIsAuthOpen(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Log In or Create Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutStep(false)}
                    className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2.5 rounded-xl text-xs cursor-pointer"
                  >
                    Return to Cart Items
                  </button>
                </div>
              </div>
            ) : (
              /* Address & Payment Form */
              <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-4">
                {/* 1. Payment Method Selection (Only COD & Pick Up) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Payment & Delivery Method
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">Select one option</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {/* Option 1: Cash on Delivery */}
                    <button
                      type="button"
                      id="payment-method-cod-btn"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        paymentMethod === 'COD'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${paymentMethod === 'COD' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs">Cash on Delivery</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Pay cash at your doorstep upon receiving order.
                      </p>
                      <div className="mt-2 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 p-1.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                        Delivery charge decided by owner at shipping
                      </div>
                    </button>

                    {/* Option 2: Store Pick Up */}
                    <button
                      type="button"
                      id="payment-method-pickup-btn"
                      onClick={() => setPaymentMethod('Pickup')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        paymentMethod === 'Pickup'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${paymentMethod === 'Pickup' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <Store className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-xs">Store Pick-Up</span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Self-collect from Chinhat, Lucknow warehouse.
                      </p>
                      <div className="mt-2 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        Delivery: FREE (Self Collect)
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Customer & Address Details */}
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {isPickup ? 'Customer Contact Details' : 'Delivery Address'}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>{user.email}</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input
                      id="checkout-input-name"
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Rajeshwar Shukla"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                      <input
                        id="checkout-input-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 9454666748"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                      <input
                        id="checkout-input-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {isPickup ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs space-y-1">
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Store Pick-Up Location:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                        {settings.businessName} • {settings.address}
                      </p>
                      <p className="text-emerald-700 dark:text-emerald-400 text-[10px]">
                        Hours: {settings.businessHoursText || 'Mon – Sun: 8:30 AM – 8:30 PM'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Site / Street Address *</label>
                        <textarea
                          id="checkout-input-address"
                          required
                          rows={2}
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="House/Plot No, Site Location, Landmark..."
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">City / District *</label>
                          <input
                            id="checkout-input-city"
                            type="text"
                            required
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Pincode *</label>
                          <input
                            id="checkout-input-pincode"
                            type="text"
                            required
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Billing summary: Subtotal - Discount + Delivery Fee (NO 18% GST) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Discount ({appliedDiscount.code}):</span>
                      </span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>
                      {isPickup ? 'Pick-Up Charges:' : 'Delivery Charges:'}
                    </span>
                    <span className={isPickup ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-amber-600 dark:text-amber-400 font-semibold text-[11px]'}>
                      {isPickup ? 'FREE (Store Pick-Up)' : 'Decided by owner at shipping'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>{isPickup ? 'Grand Total to Pay:' : 'Items Total:'}</span>
                    <span className="text-base text-emerald-600 dark:text-emerald-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {!isPickup && (
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 text-right">
                      * Delivery charges are decided by owner at the time of shipping
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutStep(false)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-xs cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    id="checkout-confirm-btn"
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg text-xs cursor-pointer"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            )
          ) : cart.length > 0 ? (
            /* Items List */
            <div className="space-y-4">
              {/* Account Status / Login Alert */}
              {!user ? (
                <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs">
                  <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-amber-900 dark:text-amber-200 text-xs">Sign In Required to Order</p>
                      <button
                        type="button"
                        onClick={() => setIsAuthOpen(true)}
                        className="text-[11px] font-bold text-amber-900 dark:text-amber-300 underline hover:no-underline cursor-pointer"
                      >
                        Sign In Now
                      </button>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                      Please log in or register to place your order with Cash on Delivery or Store Pick-Up.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <UserCheck className="w-4 h-4" />
                    <span>Ordering as: <strong>{user.name}</strong></span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full font-bold">
                    Verified
                  </span>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl items-center shadow-xs"
                  >
                    <img
                      src={item.product.mainImage}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100 dark:border-slate-800"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        ₹{item.product.price.toLocaleString('en-IN')} / {item.product.unit || 'Unit'}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-750 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 text-xs">
                          <button
                            id={`cart-minus-qty-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            id={`cart-plus-qty-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold disabled:opacity-30 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      id={`cart-remove-item-${item.product.id}`}
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-950 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Personalized Coupon & Special Discount Section */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Apply Discount Coupon</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Optional discount code</span>
                </div>

                {appliedDiscount ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {appliedDiscount.code}
                        </span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                          {appliedDiscount.discountType === 'percentage'
                            ? `${appliedDiscount.discountValue}% OFF`
                            : `₹${appliedDiscount.discountValue} OFF`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeAppliedDiscount}
                        className="text-[11px] text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <UserCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">For: <strong>{appliedDiscount.customerName}</strong></span>
                    </div>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      You save ₹{discountAmount.toLocaleString('en-IN')} on this order!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        id="cart-coupon-input"
                        type="text"
                        placeholder="e.g. VIP-RAJESHWAR, MONSOON10"
                        value={couponInput}
                        onChange={e => {
                          setCouponInput(e.target.value);
                          setCouponFeedback(null);
                        }}
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        id="cart-apply-coupon-btn"
                        type="submit"
                        disabled={!couponInput.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {couponFeedback && (
                      <p
                        className={`text-[11px] font-medium ${
                          couponFeedback.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {couponFeedback.msg}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* Empty Cart View */
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-600">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Browse our chemical coatings, paints, and waterproofing materials.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
              >
                Start Browsing Products
              </button>
            </div>
          )}
        </div>

        {/* Bottom Total & Checkout Footer */}
        {cart.length > 0 && !completedOrder && !isCheckoutStep && (
          <div className="glass-surface-subtle p-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Discount ({appliedDiscount.code}):</span>
                  </span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment Options:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">COD / Store Pick-Up</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Estimated Subtotal:</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{discountedSubtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={handleProceedToCheckout}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-xs cursor-pointer ${
                user
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-900/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-slate-900/20'
              }`}
            >
              {user ? (
                <>
                  <span>Proceed to Delivery & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Log In / Register to Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
