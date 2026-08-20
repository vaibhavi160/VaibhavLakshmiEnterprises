import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Package,
  Wrench,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  MessageCircle,
  Search,
  Printer,
  ChevronRight,
  Truck,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
  XCircle,
  Copy,
  Check,
  Building2,
  Calendar,
  CreditCard,
  Tag,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Star,
  MessageSquare,
  Camera,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Home,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

export const UserProfile: React.FC = () => {
  const {
    user,
    logout,
    orders,
    myOrders,
    sessionOrderIds,
    queries,
    setActiveTab,
    settings,
    setIsAuthOpen,
    setSelectedProductId,
    cancelCustomerOrder,
    reorderItems,
    updateUserProfile,
    showToast,
    openReviewModal,
    products,
    reviews,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'orders' | 'queries' | 'account'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [guestLookupQuery, setGuestLookupQuery] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Profile edit states & avatar presets
  const AVATAR_PRESETS = [
    { label: 'Contractor / Engineer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
    { label: 'Builder / Architect', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
    { label: 'Homeowner / Buyer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
    { label: 'Site Supervisor', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
    { label: 'Project Consultant', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80' },
  ];

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editCity, setEditCity] = useState(user?.city || 'Lucknow');
  const [editPincode, setEditPincode] = useState(user?.pincode || '226028');
  const [editState, setEditState] = useState(user?.state || 'Uttar Pradesh');
  const [editPhotoURL, setEditPhotoURL] = useState(user?.photoURL || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Sync state when user object changes
  React.useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditAddress(user.address || '');
      setEditCity(user.city || 'Lucknow');
      setEditPincode(user.pincode || '226028');
      setEditState(user.state || 'Uttar Pradesh');
      setEditPhotoURL(user.photoURL || '');
    }
  }, [user]);

  // Profile completion status calculation
  const profileCompletion = useMemo(() => {
    if (!user) return { percentage: 0, missing: [] as string[] };
    const missing: string[] = [];
    let score = 0;

    if (user.name && user.name.trim().length > 1) score += 20;
    else missing.push('Full Name');

    if (user.phone && user.phone.trim().length >= 10) score += 25;
    else missing.push('Phone Number');

    if (user.address && user.address.trim().length > 5) score += 25;
    else missing.push('Delivery Address');

    if (user.city && (user.pincode || user.city.length > 2)) score += 15;
    else missing.push('City & Pincode');

    if (user.photoURL && user.photoURL.trim().length > 5) score += 15;
    else missing.push('Profile Photo');

    return { percentage: score, missing };
  }, [user]);

  // Handle local image file upload (Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be under 2MB for fast loading', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setEditPhotoURL(reader.result);
        showToast('Photo uploaded! Click "Save Profile Changes" to persist.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateUserProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        city: editCity.trim(),
        pincode: editPincode.trim(),
        state: editState.trim(),
        photoURL: editPhotoURL.trim(),
      });
      setIsEditingProfile(false);
      showToast('Profile updated & synchronized successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to update profile: ' + (err.message || 'Check network'), 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of requirements');

  // Copy order id handler
  const handleCopyOrderId = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    showToast(`Order ID #${orderId} copied to clipboard!`, 'info');
    setTimeout(() => {
      setCopiedOrderId(null);
    }, 2000);
  };

  // Queries filtered to this user
  const userQueries = useMemo(() => {
    if (!user) return [];
    return queries.filter(q => {
      if (user.email && q.customerEmail?.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.phone && q.customerPhone === user.phone) return true;
      if (user.name && q.customerName?.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });
  }, [queries, user]);

  // Orders displayed for logged-in user or session
  const filteredCustomerOrders = useMemo(() => {
    return myOrders.filter(order => {
      // Status Filter
      if (orderStatusFilter === 'active') {
        if (!['Pending', 'Confirmed', 'Processing', 'Shipped'].includes(order.status)) return false;
      } else if (orderStatusFilter === 'delivered') {
        if (order.status !== 'Delivered') return false;
      } else if (orderStatusFilter === 'cancelled') {
        if (order.status !== 'Cancelled') return false;
      }

      // Search Filter
      if (orderSearchQuery.trim()) {
        const query = orderSearchQuery.trim().toLowerCase();
        const matchesId = order?.id ? order.id.toLowerCase().includes(query) : false;
        const matchesItem = Array.isArray(order?.items) && order.items.some(item => item?.productName && item.productName.toLowerCase().includes(query));
        const matchesDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString().includes(query) : false;
        return matchesId || matchesItem || matchesDate;
      }

      return true;
    });
  }, [myOrders, orderStatusFilter, orderSearchQuery]);

  // Guest lookup orders
  const guestSearchedOrders = useMemo(() => {
    if (!guestLookupQuery.trim()) return [];
    const q = guestLookupQuery.trim().toLowerCase();
    return orders.filter(o =>
      (o?.id && o.id.toLowerCase().includes(q)) ||
      (o?.customerPhone && o.customerPhone.includes(q)) ||
      (o?.customerEmail && o.customerEmail.toLowerCase().includes(q)) ||
      (o?.customerName && o.customerName.toLowerCase().includes(q))
    );
  }, [orders, guestLookupQuery]);

  // Orders statistics for customer
  const stats = useMemo(() => {
    const total = myOrders.length;
    const active = myOrders.filter(o => ['Pending', 'Confirmed', 'Processing', 'Shipped'].includes(o.status)).length;
    const delivered = myOrders.filter(o => o.status === 'Delivered').length;
    const totalSpent = myOrders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { total, active, delivered, totalSpent };
  }, [myOrders]);

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow popups to print receipt', 'error');
      return;
    }

    const itemsHtml = order.items
      .map(
        item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px;">
            <strong>${item.productName}</strong>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center; font-size: 12px;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 12px;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 12px; font-weight: bold;">₹${(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order.id} | Maa Vaibhav Lakshmi Enterprises</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px; color: #0f172a; margin: 0; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 16px; }
            .header { border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .badge { display: inline-block; background: #ecfdf5; color: #047857; padding: 4px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            th { background: #f8fafc; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
            .total-box { margin-top: 20px; text-align: right; font-size: 13px; line-height: 1.6; }
            .total-amount { font-size: 20px; font-weight: 900; color: #047857; margin-top: 6px; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <h2 style="margin:0; color:#047857;">Maa Vaibhav Lakshmi Enterprises</h2>
                <p style="margin: 4px 0 0; font-size: 12px; color: #475569; font-weight: 600;">Authorized Specialist: Dr. Fixit • Sika • Nippon • Birla Opus • AkzoNobel</p>
                <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Chinhat Industrial Area, Lucknow, UP | Phone: +91 ${settings.primaryPhone}</p>
                <p style="margin: 2px 0; font-size: 11px; color: #64748b;">GSTIN: ${settings.gstNumber}</p>
              </div>
              <div style="text-align: right;">
                <span class="badge">${order.status}</span>
                <p style="margin: 6px 0 0; font-size: 12px; font-weight: bold;">TAX INVOICE</p>
                <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; line-height: 1.5;">
              <div>
                <p style="margin:0; color:#64748b; text-transform:uppercase; font-size:10px; font-weight:bold;">Billed To / Shipping Address:</p>
                <p style="margin:2px 0; font-size:14px; font-weight:bold; color:#0f172a;">${order.customerName}</p>
                <p style="margin:2px 0;">${order.address}</p>
                <p style="margin:2px 0;">${order.city} - ${order.pincode}</p>
                <p style="margin:2px 0;">Phone: +91 ${order.customerPhone}</p>
                ${order.customerEmail ? `<p style="margin:2px 0;">Email: ${order.customerEmail}</p>` : ''}
              </div>
              <div style="text-align: right;">
                <p style="margin:0; color:#64748b; text-transform:uppercase; font-size:10px; font-weight:bold;">Order Reference:</p>
                <p style="margin:2px 0; font-size:14px; font-weight:bold; color:#047857;">#${order.id}</p>
                <p style="margin:2px 0;">Payment Method: <strong>${order.paymentMethod}</strong></p>
                <p style="margin:2px 0;">Time: ${new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-box">
              ${order.subtotal ? `<p style="margin:3px 0;">Items Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}</p>` : ''}
              ${order.discountAmount ? `<p style="margin:3px 0; color: #047857; font-weight: bold;">Personal Discount (${order.discountCode || 'Applied'}): -₹${order.discountAmount.toLocaleString('en-IN')}</p>` : ''}
              <p style="margin:3px 0;">GST (18% Tax Inclusive): ₹${order.gstAmount.toLocaleString('en-IN')}</p>
              <p style="margin:3px 0;">Delivery / Freight: ${order.shippingFee === 0 ? '<strong style="color:#047857;">FREE</strong>' : '₹' + order.shippingFee.toLocaleString('en-IN')}</p>
              <p class="total-amount">Total Amount: ₹${order.totalAmount.toLocaleString('en-IN')}</p>
            </div>

            <div class="footer">
              <p style="margin:0; font-weight:600; color:#047857;">Thank you for your business with Maa Vaibhav Lakshmi Enterprises!</p>
              <p style="margin:4px 0 0;">For waterproofing queries, on-site technical inspection, or batch certificates, call +91 ${settings.primaryPhone}.</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleWhatsAppInquiry = (order: Order) => {
    const text = `Hello Maa Vaibhav Lakshmi Enterprises, I would like to inquire about my Order #${order.id} (${order.items.length} item(s), Status: ${order.status}) for ${order.customerName}. Grand Total: ₹${order.totalAmount.toLocaleString('en-IN')}. Please provide delivery status.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleConfirmCancellation = () => {
    if (!cancellingOrder) return;
    const success = cancelCustomerOrder(cancellingOrder.id, cancelReason);
    if (success) {
      setCancellingOrder(null);
    }
  };

  // Helper for tracking steps visualizer
  const getTimelineStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const timelineSteps = [
    { title: 'Order Placed', desc: 'Received in store' },
    { title: 'Confirmed', desc: 'Stock reserved' },
    { title: 'Processing', desc: 'Packed & dispatched' },
    { title: 'Out for Delivery', desc: 'In transit to site' },
    { title: 'Delivered', desc: 'Handover complete' },
  ];

  // If user is not logged in, render Guest Order Tracking Portal
  if (!user) {
    return (
      <section id="guest-orders-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        {/* Guest Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Package className="w-7 h-7" />
              </div>
              <div>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  Self-Service Order Portal
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">Customer Orders & Tracking</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track orders placed from this browser, lookup by Phone Number or Order ID, and download invoices.
                </p>
              </div>
            </div>

            <button
              id="guest-signin-btn"
              onClick={() => setIsAuthOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 hover:scale-105"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Your Account</span>
            </button>
          </div>

          {/* Quick Search Lookup Input */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Search Any Order (by Phone Number or Order ID)</span>
              </label>
              {guestLookupQuery && (
                <button
                  onClick={() => setGuestLookupQuery('')}
                  className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                id="guest-order-search-input"
                type="text"
                placeholder="Enter 10-digit phone number (e.g. 9415012345) or Order ID (e.g. ORD-2026-1001)..."
                value={guestLookupQuery}
                onChange={e => setGuestLookupQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>
          </div>

          {/* Displayed Orders List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {guestLookupQuery.trim() ? `Search Results (${guestSearchedOrders.length})` : `Recent Orders Placed on this Device (${myOrders.length})`}
              </h3>
            </div>

            {(guestLookupQuery.trim() ? guestSearchedOrders : myOrders).length > 0 ? (
              (guestLookupQuery.trim() ? guestSearchedOrders : myOrders).map((order, idx) => (
                <div
                  key={`${order.id}-${idx}`}
                  id={`guest-order-card-${order.id}`}
                  className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 text-left shadow-xs transition-all hover:border-emerald-500/50"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 dark:text-white text-sm">Order #{order.id}</span>
                          <button
                            onClick={() => handleCopyOrderId(order.id)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                            title="Copy Order ID"
                          >
                            {copiedOrderId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700/60'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.productName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                          ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-xs">Total Amount: </span>
                      <span className="font-black text-slate-900 dark:text-white text-base">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({order.paymentMethod})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handlePrintReceipt(order)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </button>

                      <button
                        onClick={() => handleWhatsAppInquiry(order)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Live Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Package className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {guestLookupQuery ? `No orders found matching "${guestLookupQuery}"` : 'No orders found on this device'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try searching with your 10-digit mobile number, or sign in to synchronize all your past orders.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all"
                  >
                    Explore Product Catalog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Logged-in User Profile View
  return (
    <section id="user-profile-section" className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border-2 border-emerald-500/60 ring-4 ring-emerald-500/10"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-3xl font-black shrink-0 shadow-lg border-2 border-white/20">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <button
              onClick={() => {
                setActiveTabSection('account');
                setIsEditingProfile(true);
              }}
              className="absolute -bottom-1 -right-1 bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-slate-900 transition-transform hover:scale-110"
              title="Change Profile Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
              {user.role === 'admin' ? (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Business Admin
                </span>
              ) : (
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Customer
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 justify-center sm:justify-start">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
              </span>
              {user.phone ? (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+91 {user.phone}</span>
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Phone Missing</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.city || 'Lucknow'}, {user.state || 'Uttar Pradesh'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5 justify-center">
          <button
            onClick={() => {
              setActiveTabSection('account');
              setIsEditingProfile(true);
            }}
            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Complete / Edit Profile</span>
          </button>

          {user.role === 'admin' && (
            <button
              id="profile-goto-admin-btn"
              onClick={() => setActiveTab('admin')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-all hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            id="profile-logout-btn"
            onClick={logout}
            className="bg-slate-100 hover:bg-red-50 hover:text-red-700 dark:bg-slate-800 dark:hover:bg-red-950/50 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Completion Progress Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white text-sm">
                Profile Completion: {profileCompletion.percentage}%
              </span>
              {profileCompletion.percentage === 100 ? (
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>100% Ready</span>
                </span>
              ) : (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Action Recommended
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {profileCompletion.percentage === 100
                ? 'Your contact, photo, and Lucknow delivery address are fully configured for 1-click checkout & instant order dispatch.'
                : `Complete your profile (add ${profileCompletion.missing.join(', ')}) for faster dispatch & order tracking.`}
            </p>
          </div>

          {profileCompletion.percentage < 100 && (
            <button
              onClick={() => {
                setActiveTabSection('account');
                setIsEditingProfile(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-transform hover:scale-105 shadow-sm shrink-0"
            >
              Complete Now ({100 - profileCompletion.percentage}% Left)
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion.percentage}%` }}
          />
        </div>
      </div>

      {/* Customer Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Orders</span>
            <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
          <p className="text-[10px] text-slate-400">All lifetime orders placed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">In Transit / Active</span>
            <Truck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.active}</p>
          <p className="text-[10px] text-slate-400">Awaiting or on the way</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.delivered}</p>
          <p className="text-[10px] text-slate-400">Delivered to your site</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Purchase</span>
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{stats.totalSpent.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400">Chemicals & paint purchases</p>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          id="profile-tab-my-orders"
          onClick={() => setActiveTabSection('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSection === 'orders'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTabSection === 'orders' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {myOrders.length}
          </span>
        </button>

        <button
          id="profile-tab-service-queries"
          onClick={() => setActiveTabSection('queries')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSection === 'queries'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Site Service Enquiries</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTabSection === 'queries' ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            {userQueries.length}
          </span>
        </button>

        <button
          id="profile-tab-account-details"
          onClick={() => setActiveTabSection('account')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTabSection === 'account'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account & Delivery Details</span>
        </button>
      </div>

      {/* SECTION 1: DEDICATED MY ORDERS */}
      {activeTabSection === 'orders' && (
        <div className="space-y-6">
          {/* Order Search and Filter Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="my-orders-search-input"
                type="text"
                placeholder="Search by Order ID (e.g. ORD-2026) or product name..."
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {(
                [
                  { id: 'all', label: 'All Orders' },
                  { id: 'active', label: 'Active & In-Transit' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'cancelled', label: 'Cancelled' },
                ] as const
              ).map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setOrderStatusFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    orderStatusFilter === filter.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredCustomerOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredCustomerOrders.map((order, idx) => {
                const stepIndex = getTimelineStepIndex(order.status);
                const isCancelled = order.status === 'Cancelled';
                const canCancel = order.status === 'Pending' || order.status === 'Confirmed';

                return (
                  <div
                    key={`${order.id}-${idx}`}
                    id={`customer-order-${order.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-md transition-all hover:border-emerald-500/40"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 dark:text-white">Order #{order.id}</span>
                          <button
                            onClick={() => handleCopyOrderId(order.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Copy Order ID"
                          >
                            {copiedOrderId === order.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span>•</span>
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`font-black px-3.5 py-1 rounded-full text-xs uppercase tracking-wider border shadow-xs ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Interactive Tracking Stepper Bar (if not cancelled) */}
                    {!isCancelled ? (
                      <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-200/60 dark:border-slate-800/60">
                        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Live Fulfillment Progress</span>
                          </span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {order.status === 'Delivered' ? 'Delivered to Address' : 'Fast Lucknow Dispatch'}
                          </span>
                        </div>

                        <div className="relative pt-2 pb-1">
                          {/* Progress Line */}
                          <div className="absolute top-5 left-3 right-3 h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0">
                            <div
                              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                              style={{ width: `${(stepIndex / (timelineSteps.length - 1)) * 100}%` }}
                            />
                          </div>

                          {/* Stepper Nodes */}
                          <div className="relative z-10 flex justify-between">
                            {timelineSteps.map((step, idx) => {
                              const isCompleted = idx <= stepIndex;
                              const isCurrent = idx === stepIndex;

                              return (
                                <div key={idx} className="flex flex-col items-center text-center max-w-[70px] sm:max-w-[100px]">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                      isCompleted
                                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                                        : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                                    } ${isCurrent ? 'animate-pulse' : ''}`}
                                  >
                                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>
                                  <p
                                    className={`text-[10px] sm:text-xs font-bold mt-2 leading-tight ${
                                      isCurrent
                                        ? 'text-emerald-700 dark:text-emerald-400 font-extrabold'
                                        : isCompleted
                                        ? 'text-slate-800 dark:text-slate-200'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {step.title}
                                  </p>
                                  <p className="hidden sm:block text-[9px] text-slate-400 mt-0.5">{step.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 text-red-800 dark:text-red-300 text-xs">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                          <p className="font-bold">This order was cancelled.</p>
                          <p className="text-[11px] text-red-700 dark:text-red-400">
                            Inventory items were released. If this was a mistake, you can 1-click reorder all products below.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Products Purchased Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Order Items ({order.items.length})
                      </h4>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const targetProd = products.find(p => p.id === item.productId || p.name.toLowerCase() === item.productName.toLowerCase());
                          const existingReview = reviews.find(r => r.productId === item.productId && (r.orderId === order.id || (user?.email && r.userEmail === user.email)));

                          return (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl group transition-all"
                            >
                              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer"
                                  onClick={() => setSelectedProductId(item.productId)}
                                />

                                <div className="flex-1 min-w-0">
                                  <button
                                    onClick={() => setSelectedProductId(item.productId)}
                                    className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block text-left hover:text-emerald-600 transition-colors"
                                  >
                                    {item.productName}
                                  </button>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Unit Price: ₹{item.unitPrice.toLocaleString('en-IN')} • Qty: <strong className="text-slate-900 dark:text-white">{item.quantity}</strong>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                                <div className="text-left sm:text-right">
                                  <p className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                                  </p>
                                </div>

                                {targetProd && (
                                  existingReview ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1 rounded-xl shrink-0">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                      <span>Rated {existingReview.rating}★</span>
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => openReviewModal(targetProd, order.id)}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl transition-colors shrink-0 shadow-xs"
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                      <span>Review</span>
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery & Financial Summary Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {/* Shipping Info */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Delivery Destination:</span>
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">{order.customerName}</p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {order.address}, {order.city} - {order.pincode}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                          Contact: +91 {order.customerPhone}
                        </p>
                      </div>

                      {/* Financial Calculation */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Items Subtotal:</span>
                          <span>₹{(order.subtotal || order.totalAmount).toLocaleString('en-IN')}</span>
                        </div>

                        {order.discountAmount ? (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              <span>Personal Coupon ({order.discountCode || 'Applied'}):</span>
                            </span>
                            <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                          </div>
                        ) : null}

                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>GST (18% Tax Inclusive):</span>
                          <span>₹{order.gstAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                          <span>Shipping Fee:</span>
                          <span>{order.shippingFee === 0 ? <strong className="text-emerald-600">FREE Delivery</strong> : `₹${order.shippingFee}`}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                          <span className="font-extrabold text-slate-900 dark:text-white">Total Amount Paid / Due:</span>
                          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 text-right">Payment Mode: {order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Customer Actions Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            onClick={() => setCancellingOrder(order)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-red-200 dark:border-red-800 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Invoice</span>
                        </button>

                        <button
                          onClick={() => handleWhatsAppInquiry(order)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-800 dark:text-slate-200 hover:text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Update</span>
                        </button>

                        <button
                          onClick={() => reorderItems(order)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Buy Again</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {orderSearchQuery || orderStatusFilter !== 'all'
                  ? 'No orders found matching your filters'
                  : 'You have not placed any orders yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {orderSearchQuery || orderStatusFilter !== 'all'
                  ? 'Try clearing the search or switching status tabs.'
                  : 'Explore our genuine Dr. Fixit waterproofing solutions, Sika structural repair chemicals, and Nippon paints.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                {(orderSearchQuery || orderStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setOrderSearchQuery('');
                      setOrderStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Products Catalog</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: SERVICE ENQUIRIES */}
      {activeTabSection === 'queries' && (
        <div className="space-y-4">
          {userQueries.length > 0 ? (
            userQueries.map(q => (
              <div
                key={q.id}
                id={`profile-query-card-${q.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-md"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-sm">{q.serviceType}</span>
                    <span className="text-[11px] text-slate-400">Ref: #{q.id}</span>
                  </div>

                  <span
                    className={`font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border ${
                      q.status === 'Completed'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : q.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Site Requirement / Problem Description:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                    {q.requirement}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Location: <strong className="text-slate-700 dark:text-slate-300">{q.location}</strong></span>
                  <span>Submitted on: {new Date(q.createdAt).toLocaleDateString()}</span>
                </div>

                {q.internalNotes && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Technical Engineer Assessment (Rajeshwar Shukla):</span>
                    </p>
                    <p className="leading-relaxed">{q.internalNotes}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
              <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No active service quote enquiries</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Need a terrace leakage inspection, basement waterproofing, or industrial flooring survey?
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('services')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Schedule Site Inspection
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: ACCOUNT & DELIVERY DETAILS */}
      {activeTabSection === 'account' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Customer Profile & Delivery Address</span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Firebase Synced
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your phone number, profile photo, and delivery site address for 1-click checkout
              </p>
            </div>

            <button
              onClick={() => {
                if (!isEditingProfile) {
                  setEditName(user.name || '');
                  setEditPhone(user.phone || '');
                  setEditAddress(user.address || '');
                  setEditCity(user.city || 'Lucknow');
                  setEditPincode(user.pincode || '226028');
                  setEditState(user.state || 'Uttar Pradesh');
                  setEditPhotoURL(user.photoURL || '');
                }
                setIsEditingProfile(!isEditingProfile);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              {isEditingProfile ? 'Cancel Editing' : 'Edit Profile & Address'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              {/* Profile Photo / Avatar Selection */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <label className="block font-bold text-slate-800 dark:text-slate-200">
                  Profile Photo / Avatar
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative shrink-0">
                    {editPhotoURL ? (
                      <img
                        src={editPhotoURL}
                        alt="Profile preview"
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-300 dark:border-slate-700">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      {editPhotoURL && (
                        <button
                          type="button"
                          onClick={() => setEditPhotoURL('')}
                          className="px-3 py-2 bg-slate-200 hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 dark:text-slate-400">Or choose a professional profile avatar:</label>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditPhotoURL(preset.url)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                              editPhotoURL === preset.url
                                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal & Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    placeholder="e.g. Ramesh Kumar Verma"
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 dark:text-slate-400 font-bold text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      placeholder="9454666748"
                      onChange={e => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pr-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Used for order dispatch calls & WhatsApp delivery status.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={editCity}
                    placeholder="Lucknow"
                    onChange={e => setEditCity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Complete Site Delivery Address / Street <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editAddress}
                    placeholder="Plot / House / Shop No, Street Name, Near Landmark (e.g. Near Neem Karoli Dham / Chinhat Market)"
                    onChange={e => setEditAddress(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PIN Code (Lucknow & UP)</label>
                  <input
                    type="text"
                    value={editPincode}
                    placeholder="226028"
                    onChange={e => setEditPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    placeholder="Uttar Pradesh"
                    onChange={e => setEditState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingProfile ? 'Saving to Database...' : 'Save Profile & Address'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-emerald-500 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl font-black shrink-0">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</p>
                    <span className="inline-block mt-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {user.role === 'admin' ? 'Business Admin' : 'Verified Customer'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Contact Phone</label>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium flex items-center justify-between">
                    <span>{user.phone ? `+91 ${user.phone}` : 'Not set (Click Edit Profile to add)'}</span>
                    {user.phone && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">PIN Code & Region</label>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium">
                    {user.city || 'Lucknow'}, {user.state || 'Uttar Pradesh'} - PIN: {user.pincode || '226028'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default Lucknow Delivery / Site Address</label>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white font-medium min-h-[90px] leading-relaxed">
                    {user.address ? (
                      <div>
                        <p>{user.address}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                          {user.city || 'Lucknow'}, {user.state || 'Uttar Pradesh'} - {user.pincode || '226028'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">No delivery address saved. Add your site address for 1-click order checkout.</span>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                    <Building2 className="w-4 h-4" />
                    <span>Maa Vaibhav Lakshmi Authorized Assurance</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    All deliveries dispatched directly from our Pal Market Chinhat stockyard with genuine batch barcodes, warranty coverage, and free site chemical consultation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Cancel Order #{cancellingOrder.id}?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total: ₹{cancellingOrder.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to cancel this order? Reserved stock items will be returned to inventory.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Cancellation:</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="Change of requirements">Change of requirements / project delay</option>
                <option value="Ordered wrong product / pack size">Ordered wrong product or packaging size</option>
                <option value="Need urgent on-site engineer visit instead">Need technical site visit first</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
              >
                Keep Order
              </button>

              <button
                onClick={handleConfirmCancellation}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;
