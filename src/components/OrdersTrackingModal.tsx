import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  MapPin,
  CreditCard,
  ArrowLeft,
  XCircle,
  MessageCircle,
  Store,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const OrdersTrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingInitialQuery,
    setTrackingInitialQuery,
    orders,
    sessionOrderIds,
    user,
    settings,
    cancelCustomerOrder,
    showToast,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>(trackingInitialQuery || '');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Sync initial query when opened
  React.useEffect(() => {
    if (trackingInitialQuery) {
      setSearchQuery(trackingInitialQuery);
    }
  }, [trackingInitialQuery]);

  if (!isTrackingModalOpen) return null;

  // Filter orders related to this customer:
  const myDefaultOrders = orders.filter(o => {
    if (o?.id && sessionOrderIds.includes(o.id)) return true;
    if (user && o) {
      if (user.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.phone && o.customerPhone && o.customerPhone === user.phone) return true;
      if (user.name && o.customerName && o.customerName.toLowerCase() === user.name.toLowerCase()) return true;
    }
    return false;
  });

  const searchedOrders = orders.filter(o => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      (o?.id && o.id.toLowerCase().includes(q)) ||
      (o?.customerPhone && o.customerPhone.includes(q)) ||
      (o?.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
      (o?.customerName && o.customerName.toLowerCase().includes(q))
    );
  });

  const displayOrders = searchQuery.trim() ? searchedOrders : myDefaultOrders;

  const handleClose = () => {
    setIsTrackingModalOpen(false);
    setSelectedOrder(null);
    setTrackingInitialQuery('');
  };

  const handleWhatsAppInquiry = (order: Order) => {
    const text = `Hello Maa Vaibhav Lakshmi Enterprises, I would like to track my Order #${order.id} for ${order.customerName} (Status: ${order.status}). Total: ₹${order.totalAmount}. Payment: ${order.paymentMethod === 'Pickup' ? 'Store Pick-Up' : 'Cash on Delivery'}. Please provide delivery updates.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCancelOrder = (order: Order) => {
    if (order.status === 'Cancelled') {
      showToast('This order is already cancelled.', 'info');
      return;
    }
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      showToast(`Cannot cancel order as it is already ${order.status.toLowerCase()}. Please contact store support.`, 'error');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to cancel Order #${order.id}?`);
    if (confirmed) {
      const ok = cancelCustomerOrder(order.id);
      if (ok && selectedOrder?.id === order.id) {
        setSelectedOrder(prev => (prev ? { ...prev, status: 'Cancelled' } : null));
      }
    }
  };

  const getTimelineSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'Placed', label: 'Order Placed', desc: 'Order received & logged' },
      { key: 'Confirmed', label: 'Confirmed & Packed', desc: 'Material packed at Chinhat warehouse' },
      { key: 'Dispatched', label: 'Dispatched / In Transit', desc: 'Out for local delivery' },
      { key: 'Delivered', label: 'Delivered', desc: 'Order completed' },
    ];

    if (status === 'Cancelled') {
      return [{ key: 'Cancelled', label: 'Order Cancelled', desc: 'Order was cancelled and inventory restored' }];
    }

    let activeIdx = 0;
    if (status === 'Confirmed' || status === 'Processing') activeIdx = 1;
    if (status === 'Shipped') activeIdx = 2;
    if (status === 'Delivered') activeIdx = 3;

    return steps.map((s, idx) => ({
      ...s,
      isCompleted: idx <= activeIdx,
      isCurrent: idx === activeIdx,
    }));
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60';
      case 'Shipped':
      case 'Processing':
      case 'Confirmed':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60';
      case 'Cancelled':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700/60';
      default:
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
    }
  };

  return (
    <div
      id="orders-tracking-modal-overlay"
      className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div
        id="orders-tracking-modal-card"
        className="glass-modal-card rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Top Header */}
        <div className="glass-header-bar px-4 py-3.5 sm:px-6 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                Customer Orders & Real-time Tracking
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Track live status, delivery timeline, and manage orders
              </p>
            </div>
          </div>

          <button
            id="orders-modal-close-btn"
            onClick={handleClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Lookup Bar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="customer-order-search-input"
              type="text"
              placeholder="Search by Order ID (e.g. ORD-2026-...) or Phone Number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {selectedOrder ? (
            /* Detailed Order View */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to all orders list</span>
              </button>

              {/* Order Meta Header Card */}
              <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        Order #{selectedOrder.id}
                      </span>
                      <span
                        className={`font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${getStatusBadgeClass(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at{' '}
                      {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="order-detail-wa-btn"
                      onClick={() => handleWhatsAppInquiry(selectedOrder)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </button>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Live Fulfillment & Delivery Timeline</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {getTimelineSteps(selectedOrder.status).map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                          step.isCompleted
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-[11px]">
                          {step.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>{step.label}</span>
                        </div>
                        <p className="text-[10px] leading-tight text-slate-600 dark:text-slate-400">{step.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Ordered List */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Purchased Items</h4>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex items-center gap-3 text-xs">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Quantity: <span className="font-semibold text-slate-800 dark:text-slate-200">{item.quantity}</span> × ₹{item.unitPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Payment Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {selectedOrder.paymentMethod === 'Pickup' ? (
                        <>
                          <Store className="w-3.5 h-3.5" />
                          <span>Store Pick-Up Location</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Delivery Address</span>
                        </>
                      )}
                    </h5>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedOrder.customerName}</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedOrder.address}</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedOrder.city} - {selectedOrder.pincode}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Contact: +91 {selectedOrder.customerPhone}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Billing & Payment</span>
                    </h5>
                    <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>Discount ({selectedOrder.discountCode || 'Code'}):</span>
                          <span>-₹{selectedOrder.discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Transport:</span>
                        <span className="font-semibold">
                          {selectedOrder.paymentMethod === 'Pickup'
                            ? 'FREE (Store Pick-Up)'
                            : (selectedOrder.shippingFee && selectedOrder.shippingFee > 0)
                            ? `₹${selectedOrder.shippingFee} (Set at shipping)`
                            : 'Decided by owner at shipping'}
                        </span>
                      </div>
                      <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <span>Total to Pay:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-0.5">
                        Payment Option: <strong>{selectedOrder.paymentMethod === 'Pickup' ? 'Store Pick-Up' : 'Cash on Delivery (COD)'}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancel Action for Customers if Order is Pending or Confirmed */}
                {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Confirmed') && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <p className="text-[11px] text-slate-500">
                      Need to cancel this order? You can cancel before dispatch.
                    </p>
                    <button
                      id="cancel-order-detail-btn"
                      onClick={() => handleCancelOrder(selectedOrder)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Order</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : displayOrders.length > 0 ? (
            /* Orders Cards List */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Found <strong className="text-slate-900 dark:text-white">{displayOrders.length}</strong> {displayOrders.length === 1 ? 'order' : 'orders'}
                </span>
                <span className="text-[11px]">Click on any order to view timeline or cancel</span>
              </div>

              {displayOrders.map((order, idx) => (
                <div
                  key={`${order.id}-${idx}`}
                  id={`customer-order-card-${order.id}`}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 transition-all hover:border-emerald-500/50 space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                          Order #{order.id}
                        </span>
                        <span
                          className={`font-black px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {order.paymentMethod === 'Pickup' ? 'Store Pick-Up' : 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  {/* Products snippet */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {order.items.slice(0, 3).map((it, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
                          <img src={it.image} alt={it.productName} className="w-6 h-6 object-cover rounded" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 text-[11px] max-w-28 truncate">{it.productName}</span>
                          <span className="text-slate-400 text-[10px]">x{it.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {(order.status === 'Pending' || order.status === 'Confirmed') && (
                        <button
                          id={`cancel-order-btn-${order.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelOrder(order);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:underline cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-12 px-4 space-y-4 bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Package className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {searchQuery ? `No orders found matching "${searchQuery}"` : 'No Recent Orders Found'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {searchQuery
                    ? 'Check if your mobile number or Order ID was typed correctly, or contact support on WhatsApp.'
                    : 'Search using your 10-digit mobile number or Order ID to retrieve past orders.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsTrackingModalOpen(false);
                    setActiveTab('products');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Browse Store Catalog
                </button>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hello Maa Vaibhav Lakshmi Enterprises, I need help finding my past order.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Help</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
