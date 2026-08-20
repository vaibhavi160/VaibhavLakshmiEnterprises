import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  ServiceItem,
  ServiceQuery,
  Conversation,
  ChatMessage,
  AdminSettings,
  FinancialRecord,
  UserProfile,
  OrderStatus,
  QueryStatus,
  CustomerDiscount,
  SiteMediaItem,
  ProductReview,
} from '../types';
import {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  collection,
  doc,
  onSnapshot,
} from '../lib/firebase';
import {
  DEFAULT_STORE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_REVIEWS,
  fetchUserProfile,
  saveUserProfile,
  initializeFirestoreSeedIfNeeded,
  forceSyncAllToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveOrderToFirestore,
  deleteOrderFromFirestore,
  saveConversationToFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveQueryToFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  saveDiscountToFirestore,
  deleteDiscountFromFirestore,
  saveSettingsToFirestore,
  saveReviewToFirestore,
  deleteReviewFromFirestore,
} from '../services/firebaseDb';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Authorized Admin Emails
export const ADMIN_EMAILS = [
  'kesharivaibhavi8@gmail.com',
  'rajeshwar781@gmail.com',
];

export const checkIsAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(clean);
};

export const getAdminDisplayName = (email?: string | null): string => {
  if (!email) return 'Admin';
  const clean = email.trim().toLowerCase();
  if (clean === 'kesharivaibhavi8@gmail.com') return 'Vaibhavi Keshari';
  if (clean === 'rajeshwar781@gmail.com') return 'Rajeshwar Shukla (Admin)';
  return clean.split('@')[0];
};

interface AppContextType {
  // Theme State
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isQuoteOpen: boolean;
  setIsQuoteOpen: (open: boolean) => void;
  quotePreSelectedService: string | null;
  setQuotePreSelectedService: (service: string | null) => void;

  // Data collections
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  updateStock: (id: string, delta: number) => void;
  toggleProductStockStatus: (id: string) => void;
  reorderProducts: (newProducts: Product[]) => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Personalized Discounts
  customerDiscounts: CustomerDiscount[];
  appliedDiscount: CustomerDiscount | null;
  discountAmount: number;
  addCustomerDiscount: (discount: Omit<CustomerDiscount, 'id' | 'usageCount' | 'createdAt'>) => void;
  updateCustomerDiscount: (id: string, discount: Partial<CustomerDiscount>) => void;
  deleteCustomerDiscount: (id: string) => void;
  applyDiscountCode: (code: string, customerPhoneOrEmail?: string) => { success: boolean; message: string; discount?: CustomerDiscount };
  removeAppliedDiscount: () => void;

  orders: Order[];
  myOrders: Order[];
  sessionOrderIds: string[];
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> | Order) => Order;
  updateOrder: (orderId: string, orderData: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelCustomerOrder: (orderId: string, reason?: string) => boolean;
  reorderItems: (order: Order) => void;

  // Order Tracking Modal State
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingInitialQuery: string;
  setTrackingInitialQuery: (query: string) => void;

  // Services CRUD
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  uploadServicePhotos: (serviceId: string, photoUrls: string[]) => void;
  uploadServiceVideos: (serviceId: string, videoUrls: string[]) => void;
  uploadServiceSiteMedia: (serviceId: string, items: SiteMediaItem[]) => void;
  deleteServiceMedia: (serviceId: string, mediaType: 'image' | 'video' | 'siteMedia', idOrUrl: string) => void;

  queries: ServiceQuery[];
  submitQuery: (queryData: Omit<ServiceQuery, 'id' | 'createdAt' | 'status'>) => ServiceQuery;
  updateQueryStatus: (queryId: string, status: QueryStatus, internalNotes?: string) => void;

  conversations: Conversation[];
  adminUnreadChatCount: number;
  sendMessage: (conversationId: string, text: string, sender: 'user' | 'admin') => void;
  startNewConversation: (name: string, email: string, phone: string, initialMsg: string) => string;
  markConversationResolved: (conversationId: string) => void;
  markConversationSeenByAdmin: (conversationId: string) => void;

  financials: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;

  // Auth & Profile state
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, name: string, phone?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  isFirebaseConnected: boolean;
  isDatabaseLoading: boolean;

  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Customer Product Reviews
  reviews: ProductReview[];
  addProductReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteProductReview: (reviewId: string) => Promise<boolean>;
  addSellerReplyToReview: (reviewId: string, replyText: string) => Promise<boolean>;
  hasUserPurchasedProduct: (productId: string, emailOrUserId?: string) => { purchased: boolean; orderId?: string };
  reviewModalProduct: { product: Product; orderId?: string } | null;
  openReviewModal: (product: Product, orderId?: string) => void;
  closeReviewModal: () => void;

  // Cloud Sync
  syncAllToFirestore: () => Promise<void>;

  // Helpers
  getShareableProductUrl: (product: Product) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'mvle_settings_v1',
  CATEGORIES: 'mvle_categories_v1',
  PRODUCTS: 'mvle_products_v1',
  CART: 'mvle_cart_v1',
  ORDERS: 'mvle_orders_v1',
  QUERIES: 'mvle_queries_v1',
  CONVERSATIONS: 'mvle_conversations_v1',
  FINANCIALS: 'mvle_financials_v1',
  USER: 'mvle_user_v1',
  THEME: 'mvle_theme_v1',
  DISCOUNTS: 'mvle_discounts_v1',
  SESSION_ORDERS: 'mvle_session_orders_v1',
  SERVICES: 'mvle_services_v1',
  REVIEWS: 'mvle_reviews_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization: prioritize cached database state or start empty until real-time Firestore synchronization connects
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CATEGORIES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SERVICES;
  });

  const [customerDiscounts, setCustomerDiscounts] = useState<CustomerDiscount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISCOUNTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedDiscount, setAppliedDiscount] = useState<CustomerDiscount | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.product && item.product.id);
        }
      }
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [queries, setQueries] = useState<ServiceQuery[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUERIES);
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FINANCIALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_REVIEWS;
  });

  const [reviewModalProduct, setReviewModalProduct] = useState<{ product: Product; orderId?: string } | null>(null);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [isDatabaseLoading, setIsDatabaseLoading] = useState<boolean>(true);

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'light' || saved === 'dark' ? saved : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // UI state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [quotePreSelectedService, setQuotePreSelectedService] = useState<string | null>(null);

  const [sessionOrderIds, setSessionOrderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSION_ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingInitialQuery, setTrackingInitialQuery] = useState<string>('');

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to localStorage for offline cache & speed
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(customerDiscounts)); }, [customerDiscounts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SESSION_ORDERS, JSON.stringify(sessionOrderIds)); }, [sessionOrderIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.QUERIES, JSON.stringify(queries)); }, [queries]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FINANCIALS, JSON.stringify(financials)); }, [financials]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  // Firestore Real-time Collections Synchronization & Initial Seed
  useEffect(() => {
    initializeFirestoreSeedIfNeeded();

    const handleSnapshotError = (collectionName: string, err: any) => {
      const errMsg = err?.message || String(err);
      // Suppress noisy logs during tab visibility change or database closing
      if (
        errMsg.includes('closing') ||
        errMsg.includes('hidden') ||
        errMsg.includes('offline') ||
        errMsg.includes('cancelled')
      ) {
        return;
      }
      console.warn(`Firestore ${collectionName} listener:`, err);
    };

    // 1. Products listener
    const unsubProducts = onSnapshot(collection(db, 'products'), snapshot => {
      const prodMap = new Map<string, Product>();
      snapshot.forEach(docSnap => {
        const p = docSnap.data() as Product;
        if (p && p.id) prodMap.set(p.id, p);
      });
      const prods = Array.from(prodMap.values());
      if (prods.length > 0) {
        setProducts(prods);
      } else {
        // If Firestore is empty, seed initial catalog
        initializeFirestoreSeedIfNeeded();
      }
      setIsDatabaseLoading(false);
    }, err => {
      handleSnapshotError('products', err);
      setIsDatabaseLoading(false);
    });

    // 2. Categories listener
    const unsubCategories = onSnapshot(collection(db, 'categories'), snapshot => {
      const catMap = new Map<string, Category>();
      snapshot.forEach(docSnap => {
        const c = docSnap.data() as Category;
        if (c && c.id) catMap.set(c.id, c);
      });
      const cats = Array.from(catMap.values());
      if (cats.length > 0) {
        setCategories(cats);
      }
    }, err => {
      handleSnapshotError('categories', err);
    });

    // 3. Orders listener
    const unsubOrders = onSnapshot(collection(db, 'orders'), snapshot => {
      const orderMap = new Map<string, Order>();
      snapshot.forEach(docSnap => {
        const o = docSnap.data() as Order;
        if (o && o.id) orderMap.set(o.id, o);
      });
      const ords = Array.from(orderMap.values());
      // sort by newest
      ords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(ords);
    }, err => {
      handleSnapshotError('orders', err);
    });

    // 4. Conversations & Live Chat listener
    const unsubConv = onSnapshot(collection(db, 'conversations'), snapshot => {
      const convMap = new Map<string, Conversation>();
      snapshot.forEach(docSnap => {
        const c = docSnap.data() as Conversation;
        if (c && c.id) convMap.set(c.id, c);
      });
      setConversations(Array.from(convMap.values()));
    }, err => {
      handleSnapshotError('conversations', err);
    });

    // 5. Services listener
    const unsubServices = onSnapshot(collection(db, 'services'), snapshot => {
      const srvMap = new Map<string, ServiceItem>();
      snapshot.forEach(docSnap => {
        const s = docSnap.data() as ServiceItem;
        if (s && s.id) srvMap.set(s.id, s);
      });
      const srvList = Array.from(srvMap.values());
      if (srvList.length > 0) {
        setServices(srvList);
      }
    }, err => {
      handleSnapshotError('services', err);
    });

    // 6. Service Queries listener
    const unsubQueries = onSnapshot(collection(db, 'serviceQueries'), snapshot => {
      const qMap = new Map<string, ServiceQuery>();
      snapshot.forEach(docSnap => {
        const q = docSnap.data() as ServiceQuery;
        if (q && q.id) qMap.set(q.id, q);
      });
      const qList = Array.from(qMap.values());
      qList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setQueries(qList);
    }, err => {
      handleSnapshotError('serviceQueries', err);
    });

    // 7. Customer Discounts listener
    const unsubDiscounts = onSnapshot(collection(db, 'customerDiscounts'), snapshot => {
      const discMap = new Map<string, CustomerDiscount>();
      snapshot.forEach(docSnap => {
        const d = docSnap.data() as CustomerDiscount;
        if (d && d.id) discMap.set(d.id, d);
      });
      setCustomerDiscounts(Array.from(discMap.values()));
    }, err => {
      handleSnapshotError('customerDiscounts', err);
    });

    // 8. Settings listener
    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), docSnap => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AdminSettings);
      }
    }, err => {
      handleSnapshotError('settings', err);
    });

    // 9. Reviews listener
    const unsubReviews = onSnapshot(collection(db, 'reviews'), snapshot => {
      const revMap = new Map<string, ProductReview>();
      snapshot.forEach(docSnap => {
        const r = docSnap.data() as ProductReview;
        if (r && r.id) revMap.set(r.id, r);
      });
      const rList = Array.from(revMap.values());
      rList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReviews(rList);
    }, err => {
      handleSnapshotError('reviews', err);
    });

    // Clean up all snapshot listeners safely
    return () => {
      try { unsubProducts(); } catch {}
      try { unsubCategories(); } catch {}
      try { unsubOrders(); } catch {}
      try { unsubConv(); } catch {}
      try { unsubServices(); } catch {}
      try { unsubQueries(); } catch {}
      try { unsubDiscounts(); } catch {}
      try { unsubSettings(); } catch {}
      try { unsubReviews(); } catch {}
    };
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = (firebaseUser.email || '').trim().toLowerCase();
        const isAdmin = checkIsAdmin(email);
        const defaultAdminName = getAdminDisplayName(email);

        // Check if user document exists in Firestore
        const existingProfile = await fetchUserProfile(firebaseUser.uid);
        if (existingProfile) {
          // Keep role strictly in sync with authorized admin emails
          const syncedProfile: UserProfile = {
            ...existingProfile,
            name: existingProfile.name || defaultAdminName,
            role: isAdmin ? 'admin' : 'user',
          };
          setUser(syncedProfile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: email,
            name: firebaseUser.displayName || defaultAdminName,
            phone: firebaseUser.phoneNumber || '9454666748',
            city: 'Lucknow',
            role: isAdmin ? 'admin' : 'user',
          };
          setUser(newProfile);
          await saveUserProfile(newProfile);
        }
      } else {
        // If not logged in via Firebase, keep or clear user state
      }
    });

    return () => unsubscribe();
  }, []);

  // URL Hash / Query String synchronization for shareable links
  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const prodParam = params.get('product') || (hash.startsWith('#product-') ? hash.replace('#product-', '') : null);

      if (prodParam) {
        const found = products.find(p => p.id === prodParam || p.slug === prodParam);
        if (found) {
          setSelectedProductId(found.id);
        }
      }

      const tabParam = params.get('tab') || (hash.startsWith('#') && !hash.startsWith('#product-') ? hash.replace('#', '') : null);
      if (tabParam && ['home', 'products', 'services', 'about', 'profile'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (tabParam === 'admin') {
        if (user?.role === 'admin') {
          setActiveTab('admin');
        } else {
          setActiveTab('home');
        }
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, [products]);

  // Auth actions
  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminAccount = checkIsAdmin(cleanEmail);
    const defaultAdminName = getAdminDisplayName(cleanEmail);

    try {
      // 1. Attempt real Firebase Auth login with email & password
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const profile = await fetchUserProfile(cred.user.uid);
      const activeUser: UserProfile = profile || {
        uid: cred.user.uid,
        email: cleanEmail,
        name: isAdminAccount ? defaultAdminName : cleanEmail.split('@')[0],
        role: isAdminAccount ? 'admin' : 'user',
        phone: '9454666748',
        city: 'Lucknow',
      };
      setUser(activeUser);
      await saveUserProfile(activeUser);
      showToast(`Welcome back, ${activeUser.name}!`, 'success');
      if (isAdminAccount) {
        setActiveTab('admin');
      }
      return true;
    } catch (err: any) {
      console.warn('Firebase login attempt:', err);
      const errorCode = err?.code || '';

      // For admin accounts, strictly require valid credentials - NEVER allow bypass
      if (isAdminAccount) {
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          showToast('Invalid password for administrator account. Access denied.', 'error');
          throw new Error('Invalid administrator password.');
        } else if (errorCode === 'auth/user-not-found') {
          // If the admin user hasn't been registered in Firebase Auth yet, register it with this password
          try {
            const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            const adminUser: UserProfile = {
              uid: newCred.user.uid,
              email: cleanEmail,
              name: defaultAdminName,
              role: 'admin',
              phone: '9454666748',
              city: 'Lucknow',
            };
            setUser(adminUser);
            await saveUserProfile(adminUser);
            showToast(`Admin credentials registered and secured! Welcome, ${adminUser.name}`, 'success');
            setActiveTab('admin');
            return true;
          } catch (regErr: any) {
            showToast(regErr?.message || 'Admin authentication failed.', 'error');
            throw regErr;
          }
        } else {
          showToast(err?.message || 'Administrator authentication failed. Please check credentials.', 'error');
          throw err;
        }
      }

      // For normal customer accounts:
      if (errorCode === 'auth/user-not-found') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          const newUser: UserProfile = {
            uid: newCred.user.uid,
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            role: 'user',
            phone: '9454666748',
            city: 'Lucknow',
          };
          setUser(newUser);
          await saveUserProfile(newUser);
          showToast(`Welcome, ${newUser.name}!`, 'success');
          return true;
        } catch (createErr: any) {
          showToast(createErr?.message || 'Sign in failed.', 'error');
          throw createErr;
        }
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        showToast('Incorrect password. Please try again.', 'error');
        throw new Error('Incorrect password.');
      } else {
        showToast(err?.message || 'Login failed. Please check your credentials.', 'error');
        throw err;
      }
    }
  };

  const register = async (email: string, pass: string, name: string, phone?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminAccount = checkIsAdmin(cleanEmail);

    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cleanEmail,
        name: name.trim() || (isAdminAccount ? getAdminDisplayName(cleanEmail) : cleanEmail.split('@')[0]),
        phone: phone || '9454666748',
        city: 'Lucknow',
        role: isAdminAccount ? 'admin' : 'user',
      };
      setUser(newProfile);
      await saveUserProfile(newProfile);
      showToast(`Account created successfully! Welcome, ${newProfile.name}`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Registration failed via Firebase:', err);
      showToast(err?.message || 'Registration failed. Please check input details.', 'error');
      throw err;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Please enter your email address to reset password.', 'error');
      return false;
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      showToast(`Password reset link sent to ${cleanEmail}. Please check your inbox!`, 'success');
      return true;
    } catch (err: any) {
      console.warn('Password reset error:', err);
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        showToast('No registered user account found with this email address.', 'error');
      } else if (code === 'auth/invalid-email') {
        showToast('Please enter a valid email address format.', 'error');
      } else {
        showToast(err?.message || 'Failed to send password reset email. Please try again.', 'error');
      }
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user.email || '').trim().toLowerCase();
      const isAdminAccount = checkIsAdmin(email);
      const defaultAdminName = getAdminDisplayName(email);

      const existing = await fetchUserProfile(result.user.uid);
      const activeUser: UserProfile = existing
        ? {
            ...existing,
            email: email,
            name: result.user.displayName || existing.name || (isAdminAccount ? defaultAdminName : email.split('@')[0]),
            role: isAdminAccount ? 'admin' : 'user',
          }
        : {
            uid: result.user.uid,
            email: email,
            name: result.user.displayName || (isAdminAccount ? defaultAdminName : email.split('@')[0]),
            phone: result.user.phoneNumber || '9454666748',
            city: 'Lucknow',
            role: isAdminAccount ? 'admin' : 'user',
          };

      setUser(activeUser);
      await saveUserProfile(activeUser);
      showToast(`Signed in as ${activeUser.name}`, 'success');
      if (isAdminAccount) {
        setActiveTab('admin');
      }
      return true;
    } catch (err: any) {
      console.warn('Google login popup error:', err);
      const errorCode = err?.code || '';

      if (errorCode === 'auth/popup-closed-by-user') {
        showToast('Google Sign-In was cancelled.', 'info');
        return false;
      }

      if (errorCode === 'auth/popup-blocked') {
        showToast('Browser popup blocked. Please allow popups for this site to sign in with Google.', 'error');
        throw new Error('POPUP_BLOCKED');
      }

      showToast(err?.message || 'Google sign-in could not be completed.', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signout:', err);
    }
    setUser(null);
    if (activeTab === 'admin') {
      setActiveTab('home');
    }
    setIsAuthOpen(true);
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...data };
    setUser(updated);
    await saveUserProfile(updated);
    showToast('Profile details updated in Firebase!', 'success');
  };

  // Category Actions
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: 'cat-' + Date.now(), productCount: 0 };
    setCategories(prev => [...prev, newCat]);
    try {
      await saveCategoryToFirestore(newCat);
      showToast(`Category "${newCat.name}" saved to database`, 'success');
    } catch (err: any) {
      showToast(`Category saved locally, database sync error: ${err.message || 'Check connection'}`, 'error');
    }
  };

  const updateCategory = async (id: string, catData: Partial<Category>) => {
    const existing = categories.find(c => c.id === id);
    if (existing) {
      const updated = { ...existing, ...catData };
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      try {
        await saveCategoryToFirestore(updated);
        showToast('Category updated in database', 'success');
      } catch (err: any) {
        showToast(`Category update error: ${err.message || 'Check connection'}`, 'error');
      }
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    try {
      await deleteCategoryFromFirestore(id);
      showToast('Category deleted from database', 'info');
    } catch (err: any) {
      showToast(`Category delete error: ${err.message}`, 'error');
    }
  };

  // Product Actions
  const addProduct = async (pData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...pData,
      id: 'prod-' + Date.now(),
      rating: pData.rating !== undefined ? pData.rating : 0,
      reviewCount: pData.reviewCount !== undefined ? pData.reviewCount : 0,
    };
    setProducts(prev => [newProd, ...prev]);
    try {
      await saveProductToFirestore(newProd);
      showToast(`Product "${newProd.name}" saved to database!`, 'success');
    } catch (err: any) {
      showToast(`Product added locally, database sync error: ${err.message || 'Check connection'}`, 'error');
    }
  };

  const updateProduct = async (id: string, pData: Partial<Product>) => {
    const existing = products.find(p => p.id === id);
    if (existing) {
      const updated = { ...existing, ...pData };
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      try {
        await saveProductToFirestore(updated);
        showToast('Product updated successfully in database', 'success');
      } catch (err: any) {
        showToast(`Product update error: ${err.message}`, 'error');
      }
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await deleteProductFromFirestore(id);
      showToast('Product removed from database', 'info');
    } catch (err: any) {
      showToast(`Product removal error: ${err.message}`, 'error');
    }
  };

  const duplicateProduct = async (id: string) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const copy: Product = {
      ...target,
      id: 'prod-' + Date.now(),
      name: `${target.name} (Copy)`,
      slug: `${target.slug}-copy`,
      sku: `${target.sku}-COPY`,
      rating: 0,
      reviewCount: 0,
    };
    setProducts(prev => [copy, ...prev]);
    try {
      await saveProductToFirestore(copy);
      showToast(`Duplicated "${target.name}" and saved to database`, 'success');
    } catch (err: any) {
      showToast(`Duplicate error: ${err.message}`, 'error');
    }
  };

  const updateStock = async (id: string, delta: number) => {
    let updatedProduct: Product | null = null;
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          updatedProduct = { ...p, stock: newStock };
          return updatedProduct;
        }
        return p;
      })
    );
    if (updatedProduct) {
      try {
        await saveProductToFirestore(updatedProduct);
      } catch (err) {
        console.warn('Stock update database error:', err);
      }
    }
  };

  const toggleProductStockStatus = async (id: string) => {
    let updatedProduct: Product | null = null;
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = p.stock > 0 ? 0 : (p.minStockThreshold ? p.minStockThreshold * 3 : 30);
          const statusText = newStock === 0 ? 'Out of Stock' : `In Stock (${newStock})`;
          updatedProduct = { ...p, stock: newStock };
          showToast(`"${p.name}" marked as ${statusText}`, newStock === 0 ? 'info' : 'success');
          return updatedProduct;
        }
        return p;
      })
    );
    if (updatedProduct) {
      try {
        await saveProductToFirestore(updatedProduct);
      } catch (err) {
        console.warn('Toggle stock database error:', err);
      }
    }
  };

  const reorderProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    newProducts.forEach(prod => {
      saveProductToFirestore(prod).catch(err => console.warn('Reorder save error:', err));
    });
    showToast('Catalog sequence updated!', 'success');
  };

  // Service Management Actions
  const addService = async (srvData: Omit<ServiceItem, 'id'>) => {
    const initialImages = srvData.images && srvData.images.length > 0
      ? srvData.images
      : (srvData.image ? [srvData.image] : []);
    const newService: ServiceItem = {
      ...srvData,
      id: 'srv-' + Date.now(),
      image: srvData.image || initialImages[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      images: initialImages,
      active: srvData.active !== undefined ? srvData.active : true,
    };
    setServices(prev => [newService, ...prev]);
    try {
      await saveServiceToFirestore(newService);
      showToast(`Service "${newService.title}" saved to database!`, 'success');
    } catch (err: any) {
      showToast(`Service created locally, database sync error: ${err.message}`, 'error');
    }
  };

  const updateService = async (id: string, srvData: Partial<ServiceItem>) => {
    let updatedService: ServiceItem | null = null;
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...srvData };
        if (srvData.images && srvData.images.length > 0 && !srvData.image) {
          updated.image = srvData.images[0];
        }
        updatedService = updated;
        return updated;
      }
      return s;
    }));
    if (updatedService) {
      try {
        await saveServiceToFirestore(updatedService);
        showToast('Service updated in database', 'success');
      } catch (err: any) {
        showToast(`Service update error: ${err.message}`, 'error');
      }
    }
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (selectedServiceId === id) {
      setSelectedServiceId(null);
    }
    try {
      await deleteServiceFromFirestore(id);
      showToast('Service deleted from database', 'info');
    } catch (err: any) {
      showToast(`Service deletion error: ${err.message}`, 'error');
    }
  };

  const uploadServicePhotos = (serviceId: string, photoUrls: string[]) => {
    if (!photoUrls || photoUrls.length === 0) return;
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const currentImages = s.images && s.images.length > 0 ? s.images : (s.image ? [s.image] : []);
          const merged = Array.from(new Set([...currentImages, ...photoUrls]));
          const newMediaItems: SiteMediaItem[] = photoUrls.map((url, i) => ({
            id: 'sm-img-' + Date.now() + '-' + i,
            type: 'image' as const,
            url,
            title: `Construction Site Photo ${merged.length}`,
            stage: 'In Progress',
            createdAt: new Date().toISOString().split('T')[0],
          }));
          const existingMedia = s.siteMedia || [];
          const updated = {
            ...s,
            image: s.image || merged[0] || '',
            images: merged,
            siteMedia: [...existingMedia, ...newMediaItems],
          };
          saveServiceToFirestore(updated);
          return updated;
        }
        return s;
      })
    );
    showToast(`Added ${photoUrls.length} site photo(s) to service portfolio!`, 'success');
  };

  const uploadServiceVideos = (serviceId: string, videoUrls: string[]) => {
    if (!videoUrls || videoUrls.length === 0) return;
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const currentVideos = s.videos || [];
          const merged = Array.from(new Set([...currentVideos, ...videoUrls]));
          const newMediaItems: SiteMediaItem[] = videoUrls.map((url, i) => ({
            id: 'sm-vid-' + Date.now() + '-' + i,
            type: 'video' as const,
            url,
            title: `Site Execution Video Walkthrough ${merged.length}`,
            stage: 'In Progress',
            createdAt: new Date().toISOString().split('T')[0],
          }));
          const existingMedia = s.siteMedia || [];
          const updated = {
            ...s,
            videos: merged,
            siteMedia: [...existingMedia, ...newMediaItems],
          };
          saveServiceToFirestore(updated);
          return updated;
        }
        return s;
      })
    );
    showToast(`Added ${videoUrls.length} construction site video(s)!`, 'success');
  };

  const uploadServiceSiteMedia = (serviceId: string, items: SiteMediaItem[]) => {
    if (!items || items.length === 0) return;
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const existingMedia = s.siteMedia || [];
          const existingImages = s.images || (s.image ? [s.image] : []);
          const existingVideos = s.videos || [];

          const newImages = items.filter(m => m.type === 'image').map(m => m.url);
          const newVideos = items.filter(m => m.type === 'video').map(m => m.url);

          const updatedImages = Array.from(new Set([...existingImages, ...newImages]));
          const updatedVideos = Array.from(new Set([...existingVideos, ...newVideos]));

          const updated = {
            ...s,
            image: s.image || updatedImages[0] || '',
            images: updatedImages,
            videos: updatedVideos,
            siteMedia: [...existingMedia, ...items],
          };
          saveServiceToFirestore(updated);
          return updated;
        }
        return s;
      })
    );
    showToast(`Added ${items.length} site documentation media item(s)!`, 'success');
  };

  const deleteServiceMedia = (serviceId: string, mediaType: 'image' | 'video' | 'siteMedia', idOrUrl: string) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          let updatedImages = s.images || (s.image ? [s.image] : []);
          let updatedVideos = s.videos || [];
          let updatedSiteMedia = s.siteMedia || [];

          if (mediaType === 'image') {
            updatedImages = updatedImages.filter(img => img !== idOrUrl);
            updatedSiteMedia = updatedSiteMedia.filter(m => m.url !== idOrUrl && m.id !== idOrUrl);
          } else if (mediaType === 'video') {
            updatedVideos = updatedVideos.filter(vid => vid !== idOrUrl);
            updatedSiteMedia = updatedSiteMedia.filter(m => m.url !== idOrUrl && m.id !== idOrUrl);
          } else {
            const target = updatedSiteMedia.find(m => m.id === idOrUrl || m.url === idOrUrl);
            updatedSiteMedia = updatedSiteMedia.filter(m => m.id !== idOrUrl && m.url !== idOrUrl);
            if (target) {
              if (target.type === 'image') updatedImages = updatedImages.filter(i => i !== target.url);
              if (target.type === 'video') updatedVideos = updatedVideos.filter(v => v !== target.url);
            }
          }

          const updated = {
            ...s,
            image: updatedImages[0] || s.image || '',
            images: updatedImages,
            videos: updatedVideos,
            siteMedia: updatedSiteMedia,
          };
          saveServiceToFirestore(updated);
          return updated;
        }
        return s;
      })
    );
    showToast('Media removed from service portfolio', 'info');
  };

  // Personalized Customer Discounts Actions
  const addCustomerDiscount = (discData: Omit<CustomerDiscount, 'id' | 'usageCount' | 'createdAt'>) => {
    const newDisc: CustomerDiscount = {
      ...discData,
      id: 'disc-' + Date.now(),
      code: discData.code.trim().toUpperCase(),
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCustomerDiscounts(prev => [newDisc, ...prev]);
    saveDiscountToFirestore(newDisc);
    showToast(`Personalized discount code "${newDisc.code}" created for ${newDisc.customerName}`, 'success');
  };

  const updateCustomerDiscount = (id: string, discData: Partial<CustomerDiscount>) => {
    setCustomerDiscounts(prev =>
      prev.map(d => {
        if (d.id === id) {
          const updated = { ...d, ...discData, ...(discData.code ? { code: discData.code.trim().toUpperCase() } : {}) };
          saveDiscountToFirestore(updated);
          return updated;
        }
        return d;
      })
    );
    showToast('Customer discount updated', 'success');
  };

  const deleteCustomerDiscount = (id: string) => {
    setCustomerDiscounts(prev => prev.filter(d => d.id !== id));
    deleteDiscountFromFirestore(id);
    if (appliedDiscount?.id === id) {
      setAppliedDiscount(null);
    }
    showToast('Customer discount removed', 'info');
  };

  const applyDiscountCode = (
    code: string,
    customerPhoneOrEmail?: string
  ): { success: boolean; message: string; discount?: CustomerDiscount } => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid coupon code.' };
    }

    const found = customerDiscounts.find(
      d => d.code.toUpperCase() === cleanCode && d.isActive
    );

    if (!found) {
      return { success: false, message: `Discount code "${cleanCode}" is invalid or expired.` };
    }

    // Check expiry
    if (found.expiryDate && new Date(found.expiryDate) < new Date()) {
      return { success: false, message: `Discount code "${cleanCode}" has expired.` };
    }

    // Check min order amount against current cart total
    if (found.minOrderAmount && cartTotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum cart value of ₹${found.minOrderAmount.toLocaleString('en-IN')} required for this coupon (Current: ₹${cartTotal.toLocaleString('en-IN')}).`,
      };
    }

    setAppliedDiscount(found);
    showToast(`Personal discount "${found.code}" applied for ${found.customerName}!`, 'success');
    return {
      success: true,
      message: `Personal discount "${found.code}" applied! (${found.discountType === 'percentage' ? `${found.discountValue}% OFF` : `₹${found.discountValue} OFF`} for ${found.customerName})`,
      discount: found,
    };
  };

  const removeAppliedDiscount = () => {
    setAppliedDiscount(null);
    showToast('Personal discount removed', 'info');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  // Computed discount amount
  const discountAmount = React.useMemo(() => {
    if (!appliedDiscount || cartTotal <= 0) return 0;
    if (appliedDiscount.discountType === 'percentage') {
      return Math.round((cartTotal * appliedDiscount.discountValue) / 100);
    }
    return Math.min(cartTotal, appliedDiscount.discountValue);
  }, [appliedDiscount, cartTotal]);

  // Cart Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!user) {
      showToast('Please log in or create an account to add items to your cart.', 'info');
      setIsAuthOpen(true);
      return;
    }

    if (!product || !product.id) {
      showToast('Invalid product selected', 'error');
      return;
    }

    if (product.stock <= 0) {
      showToast('Product is currently out of stock', 'error');
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item?.product?.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, (updated[existingIndex].quantity || 0) + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    showToast(`Added ${quantity} x ${product.name} to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (!productId) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item?.product?.id === productId) {
          const clampedQty = Math.min(item.product.stock || 999, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    if (!productId) return;
    setCart(prev => prev.filter(item => item?.product?.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    if (!user) {
      showToast('Authentication required: Please log in or register before placing an order.', 'error');
      setIsAuthOpen(true);
      throw new Error('Authentication required to place an order');
    }

    const newOrder: Order = {
      ...orderData,
      userId: user.uid,
      customerEmail: user.email || orderData.customerEmail,
      id: 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    setSessionOrderIds(prev => Array.from(new Set([newOrder.id, ...prev])));

    // Save to Firestore
    saveOrderToFirestore(newOrder);

    // Update product stock levels
    newOrder.items.forEach(item => {
      updateStock(item.productId, -item.quantity);
    });

    // Add to financial revenue log
    addFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'Revenue',
      category: 'Store Order',
      amount: newOrder.totalAmount,
      description: `Order ${newOrder.id} placed by ${newOrder.customerName}`,
    });

    // Increment discount usage count if applied
    if (appliedDiscount) {
      setCustomerDiscounts(prev =>
        prev.map(d => {
          if (d.id === appliedDiscount.id) {
            const updatedDisc = { ...d, usageCount: d.usageCount + 1 };
            saveDiscountToFirestore(updatedDisc);
            return updatedDisc;
          }
          return d;
        })
      );
      setAppliedDiscount(null);
    }

    clearCart();
    showToast(`Order ${newOrder.id} placed and recorded in Firebase!`, 'success');
    return newOrder;
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> | Order): Order => {
    const orderId = ('id' in orderData && orderData.id)
      ? orderData.id
      : 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const createdAt = ('createdAt' in orderData && orderData.createdAt)
      ? orderData.createdAt
      : new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt,
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    saveOrderToFirestore(newOrder);

    // Optional stock adjustment if products provided
    if (newOrder.items && newOrder.items.length > 0) {
      newOrder.items.forEach(item => {
        if (item.productId) {
          updateStock(item.productId, -item.quantity);
        }
      });
    }

    addFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'Revenue',
      category: 'Admin Order',
      amount: newOrder.totalAmount,
      description: `Manual order ${newOrder.id} created for ${newOrder.customerName}`,
    });

    showToast(`Order #${newOrder.id} created and synced to Firebase!`, 'success');
    return newOrder;
  };

  const updateOrder = (orderId: string, orderData: Partial<Order>) => {
    const existing = orders.find(o => o.id === orderId);
    if (existing) {
      const updated = { ...existing, ...orderData, updatedAt: new Date().toISOString() };
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      saveOrderToFirestore(updated);
      showToast(`Order #${orderId} updated in Firebase!`, 'success');
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setSessionOrderIds(prev => prev.filter(id => id !== orderId));
    deleteOrderFromFirestore(orderId);
    showToast(`Order #${orderId} deleted successfully.`, 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const existing = orders.find(o => o.id === orderId);
    if (existing) {
      const updated = { ...existing, status, updatedAt: new Date().toISOString() };
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      saveOrderToFirestore(updated);
      showToast(`Order ${orderId} status changed to ${status}`, 'success');
    }
  };

  // Customer Orders Filtering - strictly scopes orders for the current user/session
  const myOrders = React.useMemo<Order[]>(() => {
    if (!user) {
      return orders.filter(o => sessionOrderIds.includes(o.id));
    }
    if (user.role === 'admin') {
      return orders;
    }
    return orders.filter(o => {
      if (sessionOrderIds.includes(o.id)) return true;
      if (user.email && o.customerEmail && o.customerEmail.trim().toLowerCase() === user.email.trim().toLowerCase()) return true;
      if (user.phone && o.customerPhone && o.customerPhone.trim() === user.phone.trim()) return true;
      if (user.name && o.customerName && o.customerName.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
      return false;
    });
  }, [orders, sessionOrderIds, user]);

  // Customer self-service order cancellation
  const cancelCustomerOrder = (orderId: string, reason?: string): boolean => {
    const orderToCancel = orders.find(o => o.id === orderId);
    if (!orderToCancel) {
      showToast('Order not found.', 'error');
      return false;
    }

    if (orderToCancel.status === 'Cancelled') {
      showToast('This order is already cancelled.', 'info');
      return false;
    }

    if (orderToCancel.status === 'Shipped' || orderToCancel.status === 'Delivered') {
      showToast(`Cannot cancel order #${orderId} as it is already ${orderToCancel.status.toLowerCase()}. Please contact store support.`, 'error');
      return false;
    }

    // Return items back to available inventory
    orderToCancel.items.forEach(item => {
      if (item.productId) {
        updateStock(item.productId, item.quantity);
      }
    });

    const updated = { ...orderToCancel, status: 'Cancelled' as OrderStatus, updatedAt: new Date().toISOString() };
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    saveOrderToFirestore(updated);

    showToast(`Order #${orderId} has been successfully cancelled in Firebase.`, 'info');
    return true;
  };

  // 1-Click Reorder items from a past order
  const reorderItems = (order: Order) => {
    let addedCount = 0;
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod && prod.stock > 0) {
        addToCart(prod, Math.min(prod.stock, item.quantity));
        addedCount++;
      } else if (prod) {
        showToast(`"${prod.name}" is currently out of stock.`, 'error');
      }
    });

    if (addedCount > 0) {
      setIsCartOpen(true);
      showToast(`Added ${addedCount} item(s) from Order #${order.id} to your cart.`, 'success');
    } else {
      showToast('Items from this order are currently out of stock.', 'error');
    }
  };

  // Queries
  const submitQuery = (qData: Omit<ServiceQuery, 'id' | 'createdAt' | 'status'>): ServiceQuery => {
    const newQuery: ServiceQuery = {
      ...qData,
      id: 'SRV-' + Math.floor(1000 + Math.random() * 9000),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    setQueries(prev => [newQuery, ...prev]);
    saveQueryToFirestore(newQuery);
    showToast('Service quote enquiry submitted and saved in Firebase!', 'success');
    return newQuery;
  };

  const updateQueryStatus = (queryId: string, status: QueryStatus, internalNotes?: string) => {
    const existing = queries.find(q => q.id === queryId);
    if (existing) {
      const updated = { ...existing, status, ...(internalNotes !== undefined ? { internalNotes } : {}) };
      setQueries(prev => prev.map(q => q.id === queryId ? updated : q));
      saveQueryToFirestore(updated);
      showToast(`Query ${queryId} updated to ${status}`, 'info');
    }
  };

  // Live Customer-to-Store Chat Management
  const sendMessage = (conversationId: string, text: string, sender: 'user' | 'admin') => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUserSend = sender === 'user';
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      sender,
      senderName: sender === 'admin' ? 'Maa Vaibhav Lakshmi Expert' : (user?.name || 'Customer'),
      text,
      timestamp: timeStr,
      seenByAdmin: !isUserSend,
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const newAdminUnread = isUserSend ? (c.adminUnreadCount || 0) + 1 : 0;
          const updatedConv: Conversation = {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            unreadCount: isUserSend ? c.unreadCount : c.unreadCount + 1,
            adminUnreadCount: newAdminUnread,
            messages: [...c.messages, newMsg],
          };
          saveConversationToFirestore(updatedConv);
          return updatedConv;
        }
        return c;
      })
    );
  };

  const startNewConversation = (name: string, email: string, phone: string, initialMsg: string): string => {
    const convId = 'conv-' + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: 'msg-1',
      sender: 'user',
      senderName: name || 'Customer',
      text: initialMsg,
      timestamp: timeStr,
      seenByAdmin: false,
    };

    const newConv: Conversation = {
      id: convId,
      userId: user?.uid || ('usr-' + Date.now()),
      userName: name || 'Customer',
      userEmail: email || 'customer@lucknow.in',
      userPhone: phone || '9454666748',
      lastMessage: initialMsg,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      adminUnreadCount: 1,
      status: 'active',
      messages: [userMsg],
    };

    setConversations(prev => [newConv, ...prev]);
    saveConversationToFirestore(newConv);
    return convId;
  };

  const markConversationResolved = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const updated: Conversation = {
            ...c,
            status: 'resolved',
            unreadCount: 0,
            adminUnreadCount: 0,
            messages: c.messages.map(m => ({ ...m, seenByAdmin: true })),
          };
          saveConversationToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
    showToast('Conversation marked as resolved in Firebase', 'info');
  };

  const markConversationSeenByAdmin = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          const hasUnseen = (c.adminUnreadCount && c.adminUnreadCount > 0) || c.messages.some(m => m.sender === 'user' && !m.seenByAdmin);
          if (!hasUnseen) return c;
          const updated: Conversation = {
            ...c,
            adminUnreadCount: 0,
            messages: c.messages.map(m => (m.sender === 'user' && !m.seenByAdmin ? { ...m, seenByAdmin: true } : m)),
          };
          saveConversationToFirestore(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const adminUnreadChatCount = conversations.reduce((total, conv) => {
    const unreadMsgs = conv.messages.filter(m => m.sender === 'user' && m.seenByAdmin === false).length;
    return total + (conv.adminUnreadCount !== undefined ? conv.adminUnreadCount : unreadMsgs);
  }, 0);

  // Financials
  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    const newRecord = { ...record, id: 'fin-' + Date.now() };
    setFinancials(prev => [newRecord, ...prev]);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettingsToFirestore(updated);
    showToast('Business settings saved to Firebase!', 'success');
  };

  const syncAllToFirestore = async () => {
    showToast('Syncing all catalog & system data to Firestore...', 'info');
    const result = await forceSyncAllToFirestore();
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  // Product Review Operations
  const hasUserPurchasedProduct = (productId: string, emailOrUserId?: string): { purchased: boolean; orderId?: string } => {
    if (!productId) return { purchased: false };
    const userEmail = (emailOrUserId || user?.email || '').trim().toLowerCase();
    const userId = user?.uid;

    for (const ord of orders) {
      if (!ord) continue;
      const matchCustomer =
        (userEmail && ord.customerEmail && ord.customerEmail.trim().toLowerCase() === userEmail) ||
        (userId && ord.userId === userId) ||
        (user?.phone && ord.customerPhone && ord.customerPhone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')) ||
        (ord.id && sessionOrderIds.includes(ord.id));

      if (matchCustomer && Array.isArray(ord.items)) {
        const hasItem = ord.items.some(it => 
          (it?.product && it.product.id === productId) ||
          (it?.product?.name && it.product.name.toLowerCase() === productId.toLowerCase()) ||
          (it?.productId === productId)
        );
        if (hasItem && ord.id) {
          return { purchased: true, orderId: ord.id };
        }
      }
    }
    return { purchased: false };
  };

  const openReviewModal = (product: Product, orderId?: string) => {
    setReviewModalProduct({ product, orderId });
  };

  const closeReviewModal = () => {
    setReviewModalProduct(null);
  };

  const addProductReview = async (reviewData: Omit<ProductReview, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const purchaseCheck = hasUserPurchasedProduct(reviewData.productId, reviewData.userEmail || reviewData.userId);
      if (!purchaseCheck.purchased && !reviewData.orderId) {
        showToast('Only verified customers who ordered this product can submit a review.', 'error');
        return false;
      }

      const newReview: ProductReview = {
        ...reviewData,
        id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        isVerifiedPurchase: true,
        orderId: reviewData.orderId || purchaseCheck.orderId,
        createdAt: new Date().toISOString(),
      };

      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      await saveReviewToFirestore(newReview);

      // Recompute product rating and review count
      const productReviews = updatedReviews.filter(r => r.productId === reviewData.productId);
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = productReviews.length > 0 ? Number((totalRating / productReviews.length).toFixed(1)) : 0;

      const targetProduct = products.find(p => p.id === reviewData.productId);
      if (targetProduct) {
        const updatedProduct: Product = {
          ...targetProduct,
          rating: avgRating,
          reviewCount: productReviews.length,
        };
        updateProduct(targetProduct.id, { rating: avgRating, reviewCount: productReviews.length });
        saveProductToFirestore(updatedProduct).catch(console.warn);
      }

      showToast('Thank you! Your product review has been published.', 'success');
      return true;
    } catch (err: any) {
      console.error('Error adding product review:', err);
      showToast('Could not save review: ' + (err.message || 'Unknown error'), 'error');
      return false;
    }
  };

  const deleteProductReview = async (reviewId: string): Promise<boolean> => {
    try {
      const targetReview = reviews.find(r => r.id === reviewId);
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      setReviews(updatedReviews);
      await deleteReviewFromFirestore(reviewId);

      if (targetReview) {
        const remainingReviews = updatedReviews.filter(r => r.productId === targetReview.productId);
        const totalRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = remainingReviews.length > 0 ? Number((totalRating / remainingReviews.length).toFixed(1)) : 0;
        const targetProduct = products.find(p => p.id === targetReview.productId);
        if (targetProduct) {
          updateProduct(targetProduct.id, { rating: avgRating, reviewCount: remainingReviews.length });
          saveProductToFirestore({ ...targetProduct, rating: avgRating, reviewCount: remainingReviews.length }).catch(console.warn);
        }
      }

      showToast('Review removed successfully.', 'info');
      return true;
    } catch (err: any) {
      showToast('Error removing review', 'error');
      return false;
    }
  };

  const addSellerReplyToReview = async (reviewId: string, replyText: string): Promise<boolean> => {
    try {
      const target = reviews.find(r => r.id === reviewId);
      if (!target) return false;

      const updated: ProductReview = {
        ...target,
        sellerReply: {
          author: user?.name || 'Maa Vaibhav Lakshmi Enterprises',
          comment: replyText,
          createdAt: new Date().toISOString(),
        },
      };

      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
      await saveReviewToFirestore(updated);
      showToast('Seller reply posted to review!', 'success');
      return true;
    } catch (err: any) {
      showToast('Error posting seller reply', 'error');
      return false;
    }
  };

  // Helper: Shareable Product URL
  const getShareableProductUrl = (product: Product): string => {
    const baseUrl = window.location.origin + window.location.pathname;
    if (!product || !product.id) return baseUrl;
    return `${baseUrl}?product=${product.id}#product-${product.id}`;
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        selectedServiceId,
        setSelectedServiceId,
        searchQuery,
        setSearchQuery,
        selectedCategoryId,
        setSelectedCategoryId,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isQuoteOpen,
        setIsQuoteOpen,
        quotePreSelectedService,
        setQuotePreSelectedService,
        settings,
        updateSettings,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        updateStock,
        toggleProductStockStatus,
        reorderProducts,
        services,
        addService,
        updateService,
        deleteService,
        uploadServicePhotos,
        uploadServiceVideos,
        uploadServiceSiteMedia,
        deleteServiceMedia,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        customerDiscounts,
        appliedDiscount,
        discountAmount,
        addCustomerDiscount,
        updateCustomerDiscount,
        deleteCustomerDiscount,
        applyDiscountCode,
        removeAppliedDiscount,
        orders,
        myOrders,
        sessionOrderIds,
        placeOrder,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        cancelCustomerOrder,
        reorderItems,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingInitialQuery,
        setTrackingInitialQuery,
        queries,
        submitQuery,
        updateQueryStatus,
        conversations,
        adminUnreadChatCount,
        sendMessage,
        startNewConversation,
        markConversationResolved,
        markConversationSeenByAdmin,
        financials,
        addFinancialRecord,
        user,
        login,
        register,
        forgotPassword,
        loginWithGoogle,
        logout,
        updateUserProfile,
        isFirebaseConnected,
        isDatabaseLoading,
        toasts,
        showToast,
        removeToast,
        reviews,
        addProductReview,
        deleteProductReview,
        addSellerReplyToReview,
        hasUserPurchasedProduct,
        reviewModalProduct,
        openReviewModal,
        closeReviewModal,
        syncAllToFirestore,
        getShareableProductUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
