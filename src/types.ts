export type Role = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  state?: string;
  photoURL?: string;
  role: Role;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  productCount?: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  offerText?: string; // Custom offer text decided by admin (e.g., "Special 10% Monsoon Discount")
  isOfferActive?: boolean; // Whether the admin-decided offer is active
  stock: number;
  minStockThreshold: number;
  sku: string;
  unit: string; // e.g., '1L', '20L Container', '50kg Bag', 'Piece'
  mainImage: string;
  images: string[];
  description: string;
  specifications: ProductSpecification[];
  featured?: boolean;
  active: boolean;
  rating: number; // default rating is 0
  reviewCount: number; // default 0
  usageAreas?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  subtotal?: number;
  totalAmount: number;
  discountAmount?: number;
  discountCode?: string;
  gstAmount?: number;
  shippingFee: number;
  paymentMethod: 'COD' | 'Pickup' | 'UPI' | 'NetBanking' | 'Cash' | 'Card';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type QueryStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';

export interface SiteMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  siteLocation?: string;
  stage?: 'Before Work' | 'In Progress' | 'Completed' | 'Inspection' | 'Water Test' | string;
  duration?: string;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  category: 'Waterproofing' | 'Painting' | 'Construction & Maintenance' | string;
  title: string;
  image: string; // Main banner image
  images?: string[]; // Multiple photos of services/construction sites uploaded by admin
  videos?: string[]; // Construction site execution videos / walkthroughs
  siteMedia?: SiteMediaItem[]; // Rich site photos and video items with stages and location
  description: string;
  features: string[];
  startingPrice?: string;
  warrantyPeriod?: string;
  duration?: string;
  active?: boolean;
}

export interface ServiceQuery {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: 'Waterproofing' | 'Painting' | 'Construction & Structural Maintenance' | 'Epoxy & PU Flooring' | 'Other';
  location: string;
  requirement: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video';
  status: QueryStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  seenByAdmin?: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number; // unread by customer
  adminUnreadCount?: number; // unread / unseen by admin
  status: 'active' | 'resolved';
  messages: ChatMessage[];
}

export interface AdminSettings {
  businessName: string;
  brandName: string;
  tagline: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  gstNumber?: string;
  taxRate: number; // percentage
  shippingFee: number; // flat fee
  freeShippingThreshold: number; // min order for free shipping
  lowStockThreshold: number;
  businessHoursStart?: number; // e.g. 8.5 for 8:30 AM
  businessHoursEnd?: number; // e.g. 20.5 for 8:30 PM
  businessDays?: number[]; // [0, 1, 2, 3, 4, 5, 6]
  businessHoursText?: string;
  technicianName?: string;
  technicianRole?: string;
  technicianOnlineOverride?: boolean | null;
}

export interface CustomerDiscount {
  id: string;
  code: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  description?: string;
  expiryDate?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'Revenue' | 'Expense';
  category: string;
  amount: number;
  description: string;
}

export interface ReviewSellerReply {
  author: string;
  comment: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  orderId?: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  userCity?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount?: number;
  sellerReply?: ReviewSellerReply;
}
