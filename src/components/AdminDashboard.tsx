import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, Order, OrderItem, OrderStatus, ServiceItem, ServiceQuery, CustomerDiscount, ProductReview } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Package,
  Layers,
  ShoppingBag,
  Wrench,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Settings,
  X,
  Search,
  ShieldCheck,
  Building2,
  Save,
  MessageSquare,
  GripVertical,
  Upload,
  Image as ImageIcon,
  Grid,
  List,
  ArrowUp,
  ArrowDown,
  Star,
  Copy,
  Sparkles,
  Check,
  Filter,
  Tag,
  Percent,
  UserCheck,
  Ban,
  PackageX,
  PackageCheck,
  Calendar,
  Truck,
  Database,
  RefreshCw,
  Video,
  Play,
  Film,
} from 'lucide-react';

export const POPULAR_BRANDS = [
  'Dr. Fixit (Pidilite)',
  'Sika',
  'Fosroc',
  'Asian Paints (SmartCare)',
  'Berger',
  'Birla Opus',
  'Birla White',
  'Nippon Paint',
  'AkzoNobel',
  'MYK Laticrete',
  'Pidilite (Roff)',
  'Maa Vaibhav Lakshmi Enterprises',
];

export const AdminDashboard: React.FC = () => {
  const {
    user,
    products,
    categories,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    queries,
    settings,
    conversations,
    adminUnreadChatCount,
    sendMessage,
    markConversationResolved,
    markConversationSeenByAdmin,
    customerDiscounts,
    addCustomerDiscount,
    updateCustomerDiscount,
    deleteCustomerDiscount,
    services,
    addService,
    updateService,
    deleteService,
    uploadServicePhotos,
    selectedServiceId,
    setSelectedServiceId,
    toggleProductStockStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    updateStock,
    reorderProducts,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updateQueryStatus,
    updateSettings,
    showToast,
    setIsAuthOpen,
    syncAllToFirestore,
    reviews,
    deleteProductReview,
    addSellerReplyToReview,
    setActiveTab: setGlobalActiveTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'services' | 'orders' | 'discounts' | 'queries' | 'reviews' | 'inventory' | 'settings' | 'chat'>('analytics');

  // Customer Reviews Moderation State
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>('');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');
  const [reviewProductFilter, setReviewProductFilter] = useState<string>('all');
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);
  const [sellerReplyInput, setSellerReplyInput] = useState<string>('');

  // Service Management CRUD State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceCategory, setServiceCategory] = useState<string>('Waterproofing');
  const [serviceTitle, setServiceTitle] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [serviceImage, setServiceImage] = useState<string>('');
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [serviceFeatures, setServiceFeatures] = useState<string>('');
  const [serviceStartingPrice, setServiceStartingPrice] = useState<string>('');
  const [serviceWarrantyPeriod, setServiceWarrantyPeriod] = useState<string>('');
  const [serviceDuration, setServiceDuration] = useState<string>('');
  const [serviceActive, setServiceActive] = useState<boolean>(true);
  const [serviceSearch, setServiceSearch] = useState<string>('');
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');

  // Admin Live Chat State
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState<string>('');

  // Auto-mark conversation as seen when viewed in live chat tab
  useEffect(() => {
    if (activeTab === 'chat') {
      const activeId = selectedConvId || conversations[0]?.id;
      if (activeId) {
        markConversationSeenByAdmin(activeId);
      }
    }
  }, [activeTab, selectedConvId, conversations, markConversationSeenByAdmin]);

  // Order CRUD State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderCustomerPhone, setOrderCustomerPhone] = useState('');
  const [orderCustomerEmail, setOrderCustomerEmail] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('Lucknow');
  const [orderPincode, setOrderPincode] = useState('226028');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'COD' | 'UPI' | 'Card' | 'Cash'>('Cash');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Confirmed');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderDiscountCode, setOrderDiscountCode] = useState('');
  const [orderDiscountAmount, setOrderDiscountAmount] = useState<number>(0);
  const [orderShippingFee, setOrderShippingFee] = useState<number>(0);
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderProductSelectId, setOrderProductSelectId] = useState<string>('');
  const [orderProductSelectQty, setOrderProductSelectQty] = useState<number>(1);

  // Discount Management State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<CustomerDiscount | null>(null);
  const [discCustomerName, setDiscCustomerName] = useState('');
  const [discCustomerIdentifier, setDiscCustomerIdentifier] = useState('');
  const [discCode, setDiscCode] = useState('');
  const [discType, setDiscType] = useState<'percentage' | 'fixed'>('percentage');
  const [discValue, setDiscValue] = useState<number>(15);
  const [discMinOrder, setDiscMinOrder] = useState<number>(500);
  const [discMaxUses, setDiscMaxUses] = useState<number>(10);
  const [discExpiryDate, setDiscExpiryDate] = useState<string>('2026-12-31');
  const [discNote, setDiscNote] = useState<string>('');
  const [discIsActive, setDiscIsActive] = useState<boolean>(true);
  const [discountSearch, setDiscountSearch] = useState<string>('');

  // Product Format & Filter state
  const [productFormat, setProductFormat] = useState<'table' | 'grid' | 'reorder'>('table');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [productBrandFilter, setProductBrandFilter] = useState<string>('all');

  // Drag and drop index state for reordering products
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('Dr. Fixit (Pidilite)');
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodPrice, setProdPrice] = useState(500);
  const [prodOrigPrice, setProdOrigPrice] = useState(600);
  const [prodStock, setProdStock] = useState(50);
  const [prodUnit, setProdUnit] = useState('5 Ltr');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodDesc, setProdDesc] = useState('');
  const [prodFeatured, setProdFeatured] = useState(true);
  const [prodOfferText, setProdOfferText] = useState('');
  const [prodIsOfferActive, setProdIsOfferActive] = useState(false);
  const [prodRating, setProdRating] = useState(0);
  const [prodReviewCount, setProdReviewCount] = useState(0);

  // Drag and drop file upload state
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingServiceFile, setIsDraggingServiceFile] = useState(false);

  // Category Modal & Management State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Settings Form state
  const [phone1, setPhone1] = useState(settings.primaryPhone);
  const [phone2, setPhone2] = useState(settings.secondaryPhone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [shippingFeeInput, setShippingFeeInput] = useState<number>(settings.shippingFee ?? 150);
  const [threshold, setThreshold] = useState(settings.freeShippingThreshold);
  const [techName, setTechName] = useState(settings.technicianName || 'Rajeshwar Shukla');
  const [techRole, setTechRole] = useState(settings.technicianRole || 'Senior Chemical & Waterproofing Specialist');
  const [hoursStart, setHoursStart] = useState<number>(settings.businessHoursStart ?? 8.5);
  const [hoursEnd, setHoursEnd] = useState<number>(settings.businessHoursEnd ?? 20.5);
  const [techOverride, setTechOverride] = useState<string>(
    settings.technicianOnlineOverride === true ? 'online' : settings.technicianOnlineOverride === false ? 'away' : 'auto'
  );

  if (!user || user.role !== 'admin') {
    return (
      <div id="admin-access-denied" className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 text-slate-900 dark:text-white shadow-xl">
        <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-extrabold">Admin Access Required</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sign in with an authorized administrator account (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">kesharivaibhavi8@gmail.com</span> or <span className="text-emerald-600 dark:text-emerald-400 font-semibold">rajeshwar781@gmail.com</span>) to access the business administration portal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-sm"
          >
            Sign In as Admin
          </button>
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Brands list from catalog and presets
  const allBrands = useMemo(() => {
    const fromProds = products.map(p => p.brand).filter(Boolean);
    const combined = Array.from(new Set([...POPULAR_BRANDS, ...fromProds]));
    return combined.sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockProducts = products.filter(p => p.stock < 15);

  // Chart Data Preparation
  const categoryChartData = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.categoryId === cat.id).length,
  }));

  const orderStatusData = [
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10b981' },
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#f59e0b' },
    { name: 'Processing', value: orders.filter(o => o.status === 'Processing').length, color: '#3b82f6' },
    { name: 'Dispatched', value: orders.filter(o => o.status === 'Dispatched').length, color: '#8b5cf6' },
  ];

  // Drag and Drop File Upload for Product Images
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);

    const files: File[] = e.dataTransfer.files ? (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('image/')) : [];
    if (files.length === 0) {
      showToast('Please drop valid image files (PNG, JPG, WebP).', 'error');
      return;
    }

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProdImage(prev => prev || result);
          setProdImages(prev => (prev.includes(result) ? prev : [...prev, result]));
          showToast(`Image "${file.name}" added to product!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? (Array.from(e.target.files) as File[]) : [];
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProdImage(prev => prev || result);
          setProdImages(prev => (prev.includes(result) ? prev : [...prev, result]));
          showToast(`Image "${file.name}" uploaded!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and Drop File Upload for Service Multiple Images
  const handleServiceFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingServiceFile(false);

    const files: File[] = e.dataTransfer.files ? (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('image/')) : [];
    if (files.length === 0) {
      showToast('Please drop valid image files (PNG, JPG, WebP).', 'error');
      return;
    }

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setServiceImage(prev => prev || result);
          setServiceImages(prev => (prev.includes(result) ? prev : [...prev, result]));
          showToast(`Service photo "${file.name}" added!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleServiceFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? (Array.from(e.target.files) as File[]) : [];
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setServiceImage(prev => prev || result);
          setServiceImages(prev => (prev.includes(result) ? prev : [...prev, result]));
          showToast(`Service photo "${file.name}" uploaded!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and Drop Reordering Handlers for Products List
  const handleProductDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleProductDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleProductDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...products];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    reorderProducts(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveProduct = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const temp = updated[currentIndex];
    updated[currentIndex] = updated[targetIndex];
    updated[targetIndex] = temp;

    reorderProducts(updated);
  };

  // Service CRUD Handlers
  const handleOpenServiceModal = (srv?: ServiceItem) => {
    if (srv) {
      setEditingService(srv);
      setServiceCategory(srv.category);
      setServiceTitle(srv.title);
      setServiceDescription(srv.description);
      const existingImgs = srv.images && srv.images.length > 0 ? srv.images : srv.image ? [srv.image] : ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'];
      setServiceImage(srv.image || existingImgs[0]);
      setServiceImages(existingImgs);
      setServiceFeatures(srv.features ? srv.features.join('\n') : '');
      setServiceStartingPrice(srv.startingPrice || '');
      setServiceWarrantyPeriod(srv.warrantyPeriod || '');
      setServiceDuration(srv.duration || '');
      setServiceActive(srv.active !== false);
    } else {
      setEditingService(null);
      setServiceCategory('Waterproofing');
      setServiceTitle('');
      setServiceDescription('');
      const defaultImg = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';
      setServiceImage(defaultImg);
      setServiceImages([defaultImg]);
      setServiceFeatures('Certified Technical Applicators\nLeak-Proof & Weather-Proof Guarantee\nFree On-Site Moisture & Crack Survey');
      setServiceStartingPrice('₹35 / sq.ft.');
      setServiceWarrantyPeriod('7 Years Warranty');
      setServiceDuration('2 - 4 Days');
      setServiceActive(true);
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim()) {
      showToast('Please provide a service title.', 'error');
      return;
    }

    const featureList = serviceFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const allServiceImgs = Array.from(
      new Set(
        [serviceImage.trim(), ...serviceImages.map(i => i.trim())].filter(Boolean)
      )
    );

    const payload: Omit<ServiceItem, 'id'> = {
      category: serviceCategory.trim() || 'Waterproofing',
      title: serviceTitle.trim(),
      description: serviceDescription.trim(),
      image: allServiceImgs[0] || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      images: allServiceImgs.length > 0 ? allServiceImgs : ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'],
      features: featureList.length > 0 ? featureList : ['Site Inspection & Surface Prep', 'Warranted Chemical Application'],
      startingPrice: serviceStartingPrice.trim() || undefined,
      warrantyPeriod: serviceWarrantyPeriod.trim() || undefined,
      duration: serviceDuration.trim() || undefined,
      active: serviceActive,
    };

    if (editingService) {
      updateService(editingService.id, payload);
    } else {
      addService(payload);
    }

    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (serviceId: string, srvTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${srvTitle}"? This will remove the service from the website.`)) {
      deleteService(serviceId);
    }
  };

  const handleToggleServiceActive = (service: ServiceItem) => {
    const nextState = service.active === false ? true : false;
    updateService(service.id, { active: nextState });
    showToast(`Service "${service.title}" is now ${nextState ? 'Active (Visible)' : 'Hidden'}`, nextState ? 'success' : 'info');
  };

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdBrand(product.brand);
      setIsCustomBrand(!POPULAR_BRANDS.includes(product.brand) && !products.some(p => p.brand === product.brand && p.id !== product.id));
      setProdCategoryId(product.categoryId);
      setProdPrice(product.price);
      setProdOrigPrice(product.originalPrice || product.price);
      setProdStock(product.stock);
      setProdUnit(product.unit);
      setProdImage(product.mainImage);
      setProdImages(product.images && product.images.length > 0 ? product.images : [product.mainImage]);
      setProdDesc(product.description);
      setProdFeatured(product.featured ?? true);
      setProdOfferText(product.offerText || '');
      setProdIsOfferActive(product.isOfferActive ?? false);
      setProdRating(product.rating ?? 0);
      setProdReviewCount(product.reviewCount ?? 0);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdBrand('Dr. Fixit (Pidilite)');
      setIsCustomBrand(false);
      setProdCategoryId(categories[0]?.id || 'cat-1');
      setProdPrice(500);
      setProdOrigPrice(600);
      setProdStock(50);
      setProdUnit('5 Ltr');
      const defaultImg = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
      setProdImage(defaultImg);
      setProdImages([defaultImg]);
      setProdDesc('');
      setProdFeatured(true);
      setProdOfferText('');
      setProdIsOfferActive(false);
      setProdRating(0);
      setProdReviewCount(0);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodImage.trim()) {
      showToast('Please complete Product Name and Main Image.', 'error');
      return;
    }

    const galleryImages = Array.from(new Set([prodImage, ...prodImages]));

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        brand: prodBrand,
        categoryId: prodCategoryId,
        price: Number(prodPrice),
        originalPrice: Number(prodOrigPrice),
        discountPercentage: prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0,
        stock: Number(prodStock),
        unit: prodUnit,
        mainImage: prodImage,
        images: galleryImages,
        description: prodDesc,
        featured: prodFeatured,
        offerText: prodOfferText.trim() || undefined,
        isOfferActive: prodIsOfferActive,
      });
      showToast('Product updated successfully.', 'success');
    } else {
      addProduct({
        name: prodName,
        brand: prodBrand,
        categoryId: prodCategoryId,
        price: Number(prodPrice),
        originalPrice: Number(prodOrigPrice),
        discountPercentage: prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0,
        rating: 0,
        reviewCount: 0,
        stock: Number(prodStock),
        unit: prodUnit,
        sku: `SKU-${Date.now().toString().slice(-5)}`,
        mainImage: prodImage,
        images: galleryImages,
        description: prodDesc,
        featured: prodFeatured,
        active: true,
        offerText: prodOfferText.trim() || undefined,
        isOfferActive: prodIsOfferActive,
        slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      showToast('New product added to catalog (Default rating: 0).', 'success');
    }

    setIsProductModalOpen(false);
  };

  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.description || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
    }
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName.trim(),
        slug: catName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: catDesc.trim(),
      });
      showToast(`Category "${catName.trim()}" updated successfully.`, 'success');
    } else {
      addCategory({
        name: catName.trim(),
        slug: catName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: catDesc.trim(),
        iconName: 'Droplets',
        productCount: 0,
      });
      showToast(`Category "${catName.trim()}" created successfully.`, 'success');
    }

    setIsCatModalOpen(false);
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      primaryPhone: phone1,
      secondaryPhone: phone2,
      email,
      address,
      shippingFee: Number(shippingFeeInput),
      freeShippingThreshold: Number(threshold),
      taxRate: 0,
      technicianName: techName.trim() || 'Rajeshwar Shukla',
      technicianRole: techRole.trim() || 'Senior Chemical & Waterproofing Specialist',
      businessHoursStart: Number(hoursStart),
      businessHoursEnd: Number(hoursEnd),
      technicianOnlineOverride: techOverride === 'online' ? true : techOverride === 'away' ? false : null,
    });
    showToast('Store settings, COD delivery charges & WhatsApp schedule updated.', 'success');
  };

  const handleOpenDiscountModal = (discount?: CustomerDiscount) => {
    if (discount) {
      setEditingDiscount(discount);
      setDiscCustomerName(discount.customerName);
      setDiscCustomerIdentifier(discount.customerPhone || discount.customerEmail || '');
      setDiscCode(discount.code);
      setDiscType(discount.discountType);
      setDiscValue(discount.discountValue);
      setDiscMinOrder(discount.minOrderAmount || 0);
      setDiscExpiryDate(discount.expiryDate || '2026-12-31');
      setDiscNote(discount.description || '');
      setDiscIsActive(discount.isActive);
    } else {
      setEditingDiscount(null);
      setDiscCustomerName('');
      setDiscCustomerIdentifier('');
      setDiscCode('VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase());
      setDiscType('percentage');
      setDiscValue(15);
      setDiscMinOrder(500);
      setDiscExpiryDate('2026-12-31');
      setDiscNote('');
      setDiscIsActive(true);
    }
    setIsDiscountModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discCustomerName.trim() || !discCode.trim() || discValue <= 0) {
      showToast('Please provide valid customer name, coupon code and discount value.', 'error');
      return;
    }

    const payload = {
      customerName: discCustomerName.trim(),
      customerPhone: discCustomerIdentifier.includes('@') ? undefined : discCustomerIdentifier.trim(),
      customerEmail: discCustomerIdentifier.includes('@') ? discCustomerIdentifier.trim() : undefined,
      code: discCode.trim().toUpperCase(),
      discountType: discType,
      discountValue: Number(discValue),
      minOrderAmount: Number(discMinOrder) || undefined,
      expiryDate: discExpiryDate || undefined,
      description: discNote.trim() || undefined,
      isActive: discIsActive,
    };

    if (editingDiscount) {
      updateCustomerDiscount(editingDiscount.id, payload);
    } else {
      addCustomerDiscount(payload);
    }
    setIsDiscountModalOpen(false);
  };

  // Order CRUD Handlers
  const handleOpenCreateOrderModal = () => {
    setEditingOrder(null);
    setOrderCustomerName('');
    setOrderCustomerPhone('');
    setOrderCustomerEmail('');
    setOrderAddress('');
    setOrderCity('Lucknow');
    setOrderPincode('226028');
    setOrderPaymentMethod('Cash');
    setOrderStatus('Confirmed');
    setOrderItems([]);
    setOrderDiscountCode('');
    setOrderDiscountAmount(0);
    setOrderShippingFee(0);
    setOrderProductSelectId(products[0]?.id || '');
    setOrderProductSelectQty(1);
    setIsOrderModalOpen(true);
  };

  const handleOpenEditOrderModal = (order: Order) => {
    setEditingOrder(order);
    setOrderCustomerName(order.customerName);
    setOrderCustomerPhone(order.customerPhone);
    setOrderCustomerEmail(order.customerEmail);
    setOrderAddress(order.address);
    setOrderCity(order.city);
    setOrderPincode(order.pincode);
    setOrderPaymentMethod(order.paymentMethod as any);
    setOrderStatus(order.status);
    setOrderItems([...order.items]);
    setOrderDiscountCode(order.discountCode || '');
    setOrderDiscountAmount(order.discountAmount || 0);
    setOrderShippingFee(order.shippingFee || 0);
    setOrderProductSelectId(products[0]?.id || '');
    setOrderProductSelectQty(1);
    setIsOrderModalOpen(true);
  };

  const handleAddItemToOrder = () => {
    const selectedProd = products.find(p => p.id === orderProductSelectId);
    if (!selectedProd) {
      showToast('Please select a valid product.', 'error');
      return;
    }
    const qty = Math.max(1, Number(orderProductSelectQty) || 1);

    // Check if already in items
    const existingIndex = orderItems.findIndex(it => it.productId === selectedProd.id);
    if (existingIndex >= 0) {
      const updated = [...orderItems];
      updated[existingIndex].quantity += qty;
      setOrderItems(updated);
    } else {
      setOrderItems(prev => [
        ...prev,
        {
          productId: selectedProd.id,
          productName: selectedProd.name,
          unitPrice: selectedProd.price,
          quantity: qty,
          image: selectedProd.mainImage,
        },
      ]);
    }
    showToast(`Added ${selectedProd.name} (Qty: ${qty}) to order.`, 'info');
  };

  const handleRemoveItemFromOrder = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItemFromOrder(index);
      return;
    }
    setOrderItems(prev =>
      prev.map((it, i) => (i === index ? { ...it, quantity: newQty } : it))
    );
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCustomerName.trim() || !orderCustomerPhone.trim()) {
      showToast('Please provide customer name and phone number.', 'error');
      return;
    }
    if (orderItems.length === 0) {
      showToast('Please add at least one product item to the order.', 'error');
      return;
    }

    const subtotal = orderItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const disc = Math.max(0, Number(orderDiscountAmount) || 0);
    const afterDisc = Math.max(0, subtotal - disc);
    const gst = 0;
    const shipping = Number(orderShippingFee) || 0;
    const grandTotal = afterDisc + shipping;

    if (editingOrder) {
      updateOrder(editingOrder.id, {
        customerName: orderCustomerName,
        customerPhone: orderCustomerPhone,
        customerEmail: orderCustomerEmail,
        address: orderAddress,
        city: orderCity,
        pincode: orderPincode,
        paymentMethod: orderPaymentMethod,
        status: orderStatus,
        items: orderItems,
        subtotal,
        discountCode: orderDiscountCode.trim() || undefined,
        discountAmount: disc,
        gstAmount: 0,
        shippingFee: shipping,
        totalAmount: grandTotal,
      });
      showToast(`Order #${editingOrder.id} updated successfully!`, 'success');
    } else {
      addOrder({
        customerName: orderCustomerName,
        customerPhone: orderCustomerPhone,
        customerEmail: orderCustomerEmail || `${orderCustomerPhone}@customer.mvle`,
        address: orderAddress || 'Store Pickup / Counter Sale',
        city: orderCity || 'Lucknow',
        pincode: orderPincode || '226028',
        paymentMethod: orderPaymentMethod,
        status: orderStatus,
        items: orderItems,
        subtotal,
        discountCode: orderDiscountCode.trim() || undefined,
        discountAmount: disc,
        gstAmount: 0,
        shippingFee: shipping,
        totalAmount: grandTotal,
      });
    }

    setIsOrderModalOpen(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to completely delete Order #${orderId}? This cannot be undone.`)) {
      deleteOrder(orderId);
    }
  };



  return (
    <section id="admin-portal-wrapper" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Maa Vaibhav Lakshmi Enterprises</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Store & Services Admin Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => syncAllToFirestore()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-sm"
            title="Push and synchronize all product catalog, categories, services, and store data into Firebase Firestore"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sync All to Firestore</span>
          </button>
          <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Logged in: {user.email}
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'analytics', label: 'Overview Analytics', icon: TrendingUp },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'services', label: `Services (${services.length})`, icon: Wrench },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'discounts', label: `Personal Discounts (${customerDiscounts.length})`, icon: Tag },
          { id: 'queries', label: `Service Quotes (${queries.length})`, icon: MessageSquare },
          { id: 'chat', label: `Live Chat (${conversations.length})`, icon: MessageSquare, unreadCount: adminUnreadChatCount },
          { id: 'inventory', label: `Stock Alerts (${lowStockProducts.length})`, icon: AlertTriangle },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
              {Boolean(tab.unreadCount && tab.unreadCount > 0) && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse ml-0.5 shadow-xs">
                  {tab.unreadCount} unread
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Sales Revenue</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">From completed & pending customer orders</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{totalOrdersCount}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{pendingOrdersCount} require dispatch</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Service Quotes Requested</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{queries.length}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">On-Site Technical Surveys</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Low Stock Warnings</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{lowStockProducts.length}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Products with &lt;15 items in store</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Products Count By Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-800" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '12px' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Order Status Distribution</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '12px', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Header & Main Add Button */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Store Catalog Products ({products.length})</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage items, upload product photos via drag & drop, and reorder storefront display sequence.
              </p>
            </div>

            <button
              id="admin-add-product-btn"
              onClick={() => handleOpenProductModal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Controls Bar: Format Switcher + Search + Category Filter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            {/* Format Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                id="admin-format-table-btn"
                onClick={() => setProductFormat('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  productFormat === 'table'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>

              <button
                id="admin-format-grid-btn"
                onClick={() => setProductFormat('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  productFormat === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid Cards</span>
              </button>

              <button
                id="admin-format-reorder-btn"
                onClick={() => setProductFormat('reorder')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  productFormat === 'reorder'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5" />
                <span>Drag & Drop Order</span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
              <div className="relative flex-1 min-w-40">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search catalog by name, brand, or SKU..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Brand Filter Dropdown */}
              <select
                value={productBrandFilter}
                onChange={e => setProductBrandFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 shrink-0 font-medium"
              >
                <option value="all">All Brands ({allBrands.length})</option>
                {allBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              {/* Category Filter Dropdown */}
              <select
                value={productCatFilter}
                onChange={e => setProductCatFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 shrink-0 font-medium"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* VIEW FORMAT 1: DRAG & DROP REORDER FORMAT */}
          {productFormat === 'reorder' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-300">
                <GripVertical className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">Drag & Drop Catalog Sequencer Active</p>
                  <p className="text-[11px] opacity-90">
                    Click and hold the drag handle on any item to drop it into your preferred position. You can also use the Up/Down buttons to adjust order.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {products.map((p, idx) => {
                  const isBeingDragged = draggedIndex === idx;
                  const isDragTarget = dragOverIndex === idx && draggedIndex !== idx;

                  return (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={e => handleProductDragStart(e, idx)}
                      onDragOver={e => handleProductDragOver(e, idx)}
                      onDrop={e => handleProductDrop(e, idx)}
                      onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-xs ${
                        isBeingDragged
                          ? 'opacity-40 bg-slate-200 dark:bg-slate-800 border-dashed border-emerald-500'
                          : isDragTarget
                          ? 'bg-emerald-100 dark:bg-emerald-950 border-2 border-emerald-500 scale-[1.01] shadow-md'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-950 font-black text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>

                        <img src={p.mainImage} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0" />

                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white leading-snug">{p.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{p.brand}</span>
                            <span>•</span>
                            <span>₹{p.price}</span>
                            <span>•</span>
                            <span>{p.unit}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveProduct(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveProduct(idx, 'down')}
                          disabled={idx === products.length - 1}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenProductModal(p)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW FORMAT 2: GRID CARDS FORMAT */}
          {productFormat === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products
                .filter(p => {
                  const matchesSearch = !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
                  const matchesCat = productCatFilter === 'all' || p.categoryId === productCatFilter;
                  const matchesBrand = productBrandFilter === 'all' || p.brand.toLowerCase() === productBrandFilter.toLowerCase();
                  return matchesSearch && matchesCat && matchesBrand;
                })
                .map((p) => (
                  <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 flex flex-col justify-between shadow-xs hover:border-emerald-500/50 transition-all">
                    <div className="space-y-2">
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {p.brand}
                        </span>
                        {p.featured && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-slate-950" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">SKU: {p.sku} • Pack: {p.unit}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="text-base font-black text-slate-900 dark:text-white">₹{p.price}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{p.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          <button onClick={() => updateStock(p.id, -1)} className="text-slate-500 hover:text-red-500 font-extrabold px-1">-</button>
                          <span className={`text-[11px] font-bold ${p.stock <= 0 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                            {p.stock <= 0 ? 'Out of Stock' : `${p.stock} in stock`}
                          </span>
                          <button onClick={() => updateStock(p.id, 1)} className="text-slate-500 hover:text-emerald-500 font-extrabold px-1">+</button>
                        </div>
                      </div>

                      {/* 1-Click In Stock / Out of Stock Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleProductStockStatus(p.id)}
                        className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          p.stock > 0
                            ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {p.stock > 0 ? (
                          <>
                            <PackageX className="w-3.5 h-3.5" />
                            <span>Mark Out of Stock</span>
                          </>
                        ) : (
                          <>
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Mark In Stock (Restock)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => duplicateProduct(p.id)}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white text-[11px] font-bold flex items-center gap-1 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenProductModal(p)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* VIEW FORMAT 3: TABLE FORMAT */}
          {productFormat === 'table' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5 w-10">Order</th>
                      <th className="p-3.5">Product Details</th>
                      <th className="p-3.5">Brand</th>
                      <th className="p-3.5">Pack Unit</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock Level & Status</th>
                      <th className="p-3.5">Featured</th>
                      <th className="p-3.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products
                      .filter(p => {
                        const matchesSearch = !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
                        const matchesCat = productCatFilter === 'all' || p.categoryId === productCatFilter;
                        const matchesBrand = productBrandFilter === 'all' || p.brand.toLowerCase() === productBrandFilter.toLowerCase();
                        return matchesSearch && matchesCat && matchesBrand;
                      })
                      .map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                          <td className="p-3.5 font-bold text-slate-400 text-[10px]">#{idx + 1}</td>
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={p.mainImage} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white leading-snug">{p.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">SKU: {p.sku}</p>
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{p.brand}</td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300">{p.unit}</td>
                          <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">₹{p.price}</td>
                          <td className="p-3.5">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                                  p.stock <= 0
                                    ? 'bg-red-600 text-white'
                                    : p.stock < 15
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                }`}>
                                  {p.stock <= 0 ? 'Out of Stock' : `${p.stock}`}
                                </span>
                                {p.stock > 0 && (
                                  <div className="flex items-center gap-0.5 border border-slate-200 dark:border-slate-800 rounded-md p-0.5">
                                    <button onClick={() => updateStock(p.id, -5)} className="text-[10px] font-bold text-slate-500 hover:text-red-500 px-1" title="Subtract 5">-5</button>
                                    <button onClick={() => updateStock(p.id, 5)} className="text-[10px] font-bold text-slate-500 hover:text-emerald-500 px-1" title="Add 5">+5</button>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleProductStockStatus(p.id)}
                                className={`text-[10px] font-bold py-0.5 px-2 rounded-md transition-colors text-left flex items-center gap-1 w-fit ${
                                  p.stock > 0
                                    ? 'text-red-600 dark:text-red-400 hover:underline'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {p.stock > 0 ? (
                                  <>
                                    <PackageX className="w-3 h-3" />
                                    <span>Set Out of Stock</span>
                                  </>
                                ) : (
                                  <>
                                    <PackageCheck className="w-3 h-3" />
                                    <span>Mark In Stock</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => updateProduct(p.id, { featured: !p.featured })}
                              className={`p-1 rounded-lg ${p.featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' : 'text-slate-300 dark:text-slate-700'}`}
                              title="Toggle Featured"
                            >
                              <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                            </button>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => duplicateProduct(p.id)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Product Categories Management</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Organize products into categories. You can create, edit, or remove categories as your product line evolves.
              </p>
            </div>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {cat.name}
                      </h4>
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60 shrink-0">
                        {count} {count === 1 ? 'product' : 'products'}
                      </span>
                    </div>
                    {cat.description ? (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {cat.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No description provided</p>
                    )}
                  </div>

                  {/* Actions: Edit and Delete */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 text-red-600 hover:text-white hover:bg-red-600 dark:hover:bg-red-600 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      title="Remove Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: SERVICES MANAGEMENT (FULL CRUD - ADD, EDIT/MODIFY, DELETE) */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Services & Application Portfolio Management</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Add new site services, modify technical descriptions, pricing, warranties, and remove services. All changes sync dynamically with the customer website.
              </p>
            </div>
            <button
              id="admin-add-service-btn"
              onClick={() => handleOpenServiceModal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Total Services</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{services.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active on Website</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {services.filter(s => s.active !== false).length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Waterproofing</p>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {services.filter(s => s.category.toLowerCase().includes('waterproof')).length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Painting & Structural</p>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {services.filter(s => !s.category.toLowerCase().includes('waterproof')).length}
              </p>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search services by title, keywords, or description..."
                  value={serviceSearch}
                  onChange={e => setServiceSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={serviceCategoryFilter}
                onChange={e => setServiceCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 shrink-0"
              >
                <option value="all">All Service Categories</option>
                {Array.from(new Set(services.map(s => s.category))).map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter(s => {
                const q = serviceSearch.trim().toLowerCase();
                const matchesSearch =
                  !q ||
                  s.title.toLowerCase().includes(q) ||
                  s.description.toLowerCase().includes(q) ||
                  s.category.toLowerCase().includes(q) ||
                  (s.features && s.features.some(f => f.toLowerCase().includes(q)));
                const matchesCategory =
                  serviceCategoryFilter === 'all' || s.category === serviceCategoryFilter;
                return matchesSearch && matchesCategory;
              })
              .map(service => (
                <div
                  key={service.id}
                  id={`admin-service-card-${service.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner & Category Tags */}
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={service.image || (service.images && service.images[0]) || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[80%]">
                        <span className="bg-slate-950/80 text-white border border-slate-700/60 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                          {service.category}
                        </span>
                        {(() => {
                          const vCount = (service.videos?.length || 0) + (service.siteMedia?.filter(m => m.type === 'video').length || 0);
                          const pCount = service.images?.length || (service.image ? 1 : 0);
                          return (
                            <>
                              {vCount > 0 && (
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                  <Video className="w-3 h-3" />
                                  <span>{vCount} {vCount === 1 ? 'Video' : 'Videos'}</span>
                                </span>
                              )}
                              <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>{pCount} {pCount === 1 ? 'Photo' : 'Photos'}</span>
                              </span>
                            </>
                          );
                        })()}
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-md ${
                            service.active !== false
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-rose-500/90 text-white'
                          }`}
                        >
                          {service.active !== false ? 'Active (Live)' : 'Hidden'}
                        </span>
                      </div>

                      {service.startingPrice && (
                        <span className="absolute bottom-2.5 right-2.5 bg-slate-950/85 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
                          From {service.startingPrice}
                        </span>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {service.title}
                        </h4>
                      </div>

                      {service.duration && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            Est: {service.duration}
                          </span>
                        </div>
                      )}

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features List */}
                      {service.features && service.features.length > 0 && (
                        <div className="pt-1 space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Key Inclusions & Highlights:
                          </p>
                          <div className="space-y-1">
                            {service.features.slice(0, 3).map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                            {service.features.length > 3 && (
                              <p className="text-[10px] text-slate-400 italic">
                                +{service.features.length - 3} more technical specs
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleServiceActive(service)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-colors ${
                        service.active !== false
                          ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
                      }`}
                    >
                      {service.active !== false ? 'Disable' : 'Enable'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedServiceId(service.id)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Upload, manage and watch site videos & photos for this service"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Media ({service.images?.length || (service.image ? 1 : 0)} 📸 / {(service.videos?.length || 0) + (service.siteMedia?.filter(m => m.type === 'video').length || 0)} 🎥)</span>
                      </button>

                      <button
                        onClick={() => handleOpenServiceModal(service)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Edit Service Details"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900 dark:text-white text-base">No Services in Portfolio</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Add your technical execution services such as Roof Waterproofing, Epoxy Flooring, or Exterior Painting.
              </p>
              <button
                onClick={() => handleOpenServiceModal()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Service</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT (FULL CRUD) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Header & Create Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Customer Orders Management</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Create manual counter orders, edit customer items and addresses, update fulfillment statuses, and print receipts.
              </p>
            </div>
            <button
              id="admin-create-order-btn"
              onClick={handleOpenCreateOrderModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Order</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Total Orders</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{orders.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Pending / In Progress</p>
              <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Confirmed').length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Out for Delivery</p>
              <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {orders.filter(o => o.status === 'Shipped').length}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Delivered / Completed</p>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {orders.filter(o => o.status === 'Delivered').length}
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, phone, or email..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 shrink-0"
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped / Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders
              .filter(o => {
                const q = orderSearch.trim().toLowerCase();
                const matchesSearch =
                  !q ||
                  o.id.toLowerCase().includes(q) ||
                  o.customerName.toLowerCase().includes(q) ||
                  o.customerPhone.includes(q) ||
                  (o.customerEmail && o.customerEmail.toLowerCase().includes(q));
                const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                return matchesSearch && matchesStatus;
              })
              .map(order => (
                <div
                  key={order.id}
                  id={`admin-order-card-${order.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                          Order #{order.id}
                        </span>
                        <span
                          className={`font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60'
                              : order.status === 'Shipped' || order.status === 'Processing' || order.status === 'Confirmed'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700/60'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700/60'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Status update & Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleOpenEditOrderModal(order)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Edit Order Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${order.customerName}, this is regarding your Order #${order.id} at Maa Vaibhav Lakshmi Enterprises. Current status: ${order.status}. Total: ₹${order.totalAmount}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                        title="Contact Customer on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Customer: {order.customerName}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Phone: <strong className="text-slate-900 dark:text-slate-200">+91 {order.customerPhone}</strong>
                        {order.customerEmail && ` • ${order.customerEmail}`}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Address: {order.address}, {order.city} - {order.pincode}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1 text-right sm:text-left">
                      <p className="font-bold text-slate-900 dark:text-white">Financials & Payment</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        Payment: <strong className="text-slate-900 dark:text-slate-200">{order.paymentMethod === 'Pickup' ? 'Store Pick-Up' : 'Cash on Delivery (COD)'}</strong> • Subtotal: ₹{(order.subtotal || order.totalAmount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {order.discountAmount ? `Discount (${order.discountCode || 'Applied'}): -₹${order.discountAmount} • ` : ''}
                        Delivery: {order.paymentMethod === 'Pickup' ? 'FREE (Pick-Up)' : (order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`)} • Total: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Ordered Products ({order.items.length})
                    </p>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.image && (
                              <img src={item.image} alt={item.productName} className="w-8 h-8 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Rate: ₹{item.unitPrice} × Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white shrink-0">
                            ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

            {orders.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">No orders recorded in database yet.</p>
                <button
                  onClick={handleOpenCreateOrderModal}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  Create First Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PERSONALIZED DISCOUNTS MANAGEMENT */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Personalized Customer Discounts & Coupons</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Issue customer-specific promo codes, percentage or fixed discounts, and track redemptions.
              </p>
            </div>
            <button
              id="admin-create-discount-btn"
              onClick={() => handleOpenDiscountModal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Personal Discount</span>
            </button>
          </div>

          {/* Search and Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search discount by customer name, coupon code, phone, email..."
                value={discountSearch}
                onChange={e => setDiscountSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 px-4 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Active:</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {customerDiscounts.filter(d => d.isActive).length} / {customerDiscounts.length}
              </span>
            </div>
          </div>

          {/* Discounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerDiscounts
              .filter(d => {
                if (!discountSearch.trim()) return true;
                const q = discountSearch.toLowerCase();
                return (
                  d.customerName.toLowerCase().includes(q) ||
                  d.code.toLowerCase().includes(q) ||
                  (d.customerPhone && d.customerPhone.includes(q)) ||
                  (d.customerEmail && d.customerEmail.toLowerCase().includes(q)) ||
                  (d.description && d.description.toLowerCase().includes(q))
                );
              })
              .map(discount => {
                const isExpired = discount.expiryDate && new Date(discount.expiryDate) < new Date();

                return (
                  <div
                    key={discount.id}
                    id={`discount-card-${discount.id}`}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs transition-all ${
                      !discount.isActive || isExpired
                        ? 'border-slate-200 dark:border-slate-800 opacity-60'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/60'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Header: Code & Value */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            {discount.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(discount.code);
                                showToast(`Copied code "${discount.code}"!`, 'info');
                              }
                            }}
                            className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1"
                            title="Copy code to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/60">
                          {discount.discountType === 'percentage'
                            ? `${discount.discountValue}% OFF`
                            : `₹${discount.discountValue} OFF`}
                        </span>
                      </div>

                      {/* Customer Target Info */}
                      <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{discount.customerName}</span>
                        </div>
                        {(discount.customerPhone || discount.customerEmail) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {discount.customerPhone || discount.customerEmail}
                          </p>
                        )}
                      </div>

                      {/* Details & Specs */}
                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                        {discount.minOrderAmount ? (
                          <p>
                            Min Order Value: <strong className="text-slate-900 dark:text-white">₹{discount.minOrderAmount.toLocaleString('en-IN')}</strong>
                          </p>
                        ) : (
                          <p>Min Order: No minimum</p>
                        )}
                        {discount.expiryDate && (
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Expires: {discount.expiryDate} {isExpired && <span className="text-red-500 font-bold">(Expired)</span>}</span>
                          </p>
                        )}
                        <p className="text-slate-500">
                          Used: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{discount.usageCount}</strong> times
                        </p>
                        {discount.description && (
                          <p className="text-[10px] text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            "{discount.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => updateCustomerDiscount(discount.id, { isActive: !discount.isActive })}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border transition-colors ${
                          discount.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {discount.isActive ? 'Active' : 'Disabled'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDiscountModal(discount)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                          title="Edit discount"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCustomerDiscount(discount.id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg"
                          title="Delete discount"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE QUOTES */}
      {activeTab === 'queries' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Service Quote Requests</h3>
          <div className="space-y-4">
            {queries.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{q.serviceType} (Ref: {q.id})</span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">Customer: {q.customerName} ({q.customerPhone})</p>
                  </div>

                  <select
                    value={q.status}
                    onChange={e => updateQueryStatus(q.id, e.target.value as any)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-2.5 py-1"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">{q.requirement}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Location: {q.location} • Submitted: {new Date(q.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INVENTORY STOCK WARNINGS */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Low Stock Alert List</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 shadow-xs">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={p.mainImage} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-amber-600 dark:text-amber-400 text-[10px]">Current Stock: {p.stock}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenProductModal(p)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
                    >
                      Update Stock
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">All products have sufficient stock inventory (&gt;15).</p>
            )}
          </div>
        </div>
      )}

      {/* TAB: CUSTOMER PRODUCT REVIEWS MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>Customer Ratings & Reviews Moderation</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review verified buyer feedback, respond as store management, and maintain authentic product ratings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60">
                {reviews.length} Total Reviews
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Store-Wide Rating</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {reviews.length > 0
                    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                    : '5.0'}
                </span>
                <span className="text-xs text-amber-500 font-bold">/ 5.0 ★</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Verified Buyer Reviews</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {reviews.filter(r => r.isVerifiedPurchase).length}
                </span>
                <span className="text-xs text-slate-400">
                  ({reviews.length > 0 ? Math.round((reviews.filter(r => r.isVerifiedPurchase).length / reviews.length) * 100) : 100}%)
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Seller Responses Given</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {reviews.filter(r => Boolean(r.sellerReply)).length}
                </span>
                <span className="text-xs text-slate-400">
                  of {reviews.length} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews by customer, product, city, or comment text..."
                value={reviewSearchQuery}
                onChange={e => setReviewSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={reviewRatingFilter}
                onChange={e => setReviewRatingFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
              >
                <option value="all">All Star Ratings</option>
                <option value="5">5 Stars (★★★★★)</option>
                <option value="4">4 Stars (★★★★☆)</option>
                <option value="3">3 Stars (★★★☆☆)</option>
                <option value="2">2 Stars (★★☆☆☆)</option>
                <option value="1">1 Star (★☆☆☆☆)</option>
              </select>

              <select
                value={reviewProductFilter}
                onChange={e => setReviewProductFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none max-w-xs truncate"
              >
                <option value="all">All Products</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {(() => {
              const filtered = reviews.filter(rev => {
                if (reviewRatingFilter !== 'all' && rev.rating !== Number(reviewRatingFilter)) return false;
                if (reviewProductFilter !== 'all' && rev.productId !== reviewProductFilter) return false;
                if (reviewSearchQuery.trim()) {
                  const q = reviewSearchQuery.toLowerCase();
                  const matchUser = rev.userName.toLowerCase().includes(q);
                  const matchProd = rev.productName.toLowerCase().includes(q);
                  const matchComment = rev.comment.toLowerCase().includes(q);
                  const matchCity = (rev.userCity || '').toLowerCase().includes(q);
                  if (!matchUser && !matchProd && !matchComment && !matchCity) return false;
                }
                return true;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center">
                    <Star className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No reviews found matching the selected filters.</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Try resetting the search query or rating filter.</p>
                  </div>
                );
              }

              return filtered.map(rev => {
                const targetProd = products.find(p => p.id === rev.productId);

                return (
                  <div
                    key={rev.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={rev.productImage || targetProd?.mainImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'}
                          alt={rev.productName}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {rev.productName}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 rounded-lg text-amber-700 dark:text-amber-300 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{rev.rating}★</span>
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{rev.title}</span>
                            {rev.isVerifiedPurchase && (
                              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified Buyer</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            <span>By <strong className="text-slate-700 dark:text-slate-300">{rev.userName}</strong></span>
                            {rev.userCity && <span> • {rev.userCity}</span>}
                            <span> • {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {rev.orderId && <span> • Order #{rev.orderId.slice(-6).toUpperCase()}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                        <button
                          onClick={() => {
                            if (activeReplyReviewId === rev.id) {
                              setActiveReplyReviewId(null);
                              setSellerReplyInput('');
                            } else {
                              setActiveReplyReviewId(rev.id);
                              setSellerReplyInput(rev.sellerReply?.comment || '');
                            }
                          }}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{rev.sellerReply ? 'Edit Reply' : 'Post Reply'}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete review by "${rev.userName}"?`)) {
                              deleteProductReview(rev.id);
                            }
                          }}
                          className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 border border-red-200 dark:border-red-800/60 font-bold px-2.5 py-1.5 rounded-xl text-xs transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                      "{rev.comment}"
                    </p>

                    {/* Official Seller Response Display */}
                    {rev.sellerReply && activeReplyReviewId !== rev.id && (
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-l-3 border-emerald-500 p-3 rounded-r-2xl text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Seller Response • {rev.sellerReply.author}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(rev.sellerReply.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-normal">
                          {rev.sellerReply.comment}
                        </p>
                      </div>
                    )}

                    {/* Admin Reply Composer Form */}
                    {activeReplyReviewId === rev.id && (
                      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-3.5 rounded-2xl space-y-2">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Official Store Response (displayed to all customers):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Thank the customer, provide technical advice, or offer further support..."
                          value={sellerReplyInput}
                          onChange={e => setSellerReplyInput(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyReviewId(null);
                              setSellerReplyInput('');
                            }}
                            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!sellerReplyInput.trim()) return;
                              await addSellerReplyToReview(rev.id, sellerReplyInput.trim());
                              setActiveReplyReviewId(null);
                              setSellerReplyInput('');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Seller Reply</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* TAB 7: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-xl space-y-4 text-xs shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Business Store Info</h3>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Primary Phone</label>
            <input
              type="text"
              value={phone1}
              onChange={e => setPhone1(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Secondary Phone</label>
            <input
              type="text"
              value={phone2}
              onChange={e => setPhone2(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Store Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Store Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Delivery & Payment Methods (COD / Pick-Up)</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Configure Cash on Delivery (COD) shipping charges. Store Pick-Up is always ₹0. Tax (GST) is disabled (0%).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Cash on Delivery (COD) Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={shippingFeeInput}
                  onChange={e => setShippingFeeInput(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                  placeholder="150"
                />
                <span className="text-[10px] text-slate-400">Applied when customer chooses COD</span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Free Delivery Threshold (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                  placeholder="3000"
                />
                <span className="text-[10px] text-slate-400">Orders above this get free COD delivery</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>WhatsApp Widget & Technician Availability</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Control the live online indicator, consultation hours, and technical specialist info displayed on the customer floating widget.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Technician / Specialist Name</label>
                <input
                  type="text"
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  placeholder="Rajeshwar Shukla"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Technician Title / Role</label>
                <input
                  type="text"
                  value={techRole}
                  onChange={e => setTechRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  placeholder="Senior Chemical & Waterproofing Specialist"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Opening Hour (e.g. 8.5 for 8:30 AM)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={hoursStart}
                  onChange={e => setHoursStart(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Closing Hour (e.g. 20.5 for 8:30 PM)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={hoursEnd}
                  onChange={e => setHoursEnd(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Technician Live Status Mode</label>
              <select
                value={techOverride}
                onChange={e => setTechOverride(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
              >
                <option value="auto">Automatic (Based on Predefined Business Hours: 8:30 AM - 8:30 PM IST)</option>
                <option value="online">Force Online (Always Active & Responding)</option>
                <option value="away">Force Away / Offline (Show Leave Message Mode)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store & Technician Settings</span>
          </button>
        </form>
      )}

      {/* TAB 8: LIVE CHAT MANAGEMENT */}
      {activeTab === 'chat' && (
        <div id="admin-live-chat-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List Column */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Customer Live Chats</span>
              </h3>
              <div className="flex items-center gap-1.5">
                {adminUnreadChatCount > 0 && (
                  <span className="text-xs bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                    {adminUnreadChatCount} Unread
                  </span>
                )}
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-full">
                  {conversations.length} total
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No active live chat conversations found.
                </div>
              ) : (
                conversations.map(conv => {
                  const isSelected = (selectedConvId || conversations[0]?.id) === conv.id;
                  const unreadForAdmin = (conv.adminUnreadCount && conv.adminUnreadCount > 0)
                    ? conv.adminUnreadCount
                    : conv.messages.filter(m => m.sender === 'user' && m.seenByAdmin === false).length;
                  const hasUnread = unreadForAdmin > 0;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        markConversationSeenByAdmin(conv.id);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 relative ${
                        isSelected
                          ? 'bg-slate-100 dark:bg-slate-800 border-emerald-500 shadow-xs'
                          : hasUnread
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800/80 hover:bg-red-50 dark:hover:bg-red-950/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" title="Unread messages" />
                          )}
                          <span className="font-bold text-slate-900 dark:text-white text-xs">{conv.userName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{conv.lastMessageTime}</span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 line-clamp-1 text-[11px] font-normal">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{conv.userPhone || conv.userEmail}</span>
                        <div className="flex items-center gap-1">
                          {hasUnread && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                              {unreadForAdmin} Unread
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              conv.status === 'resolved'
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60'
                            }`}
                          >
                            {conv.status === 'resolved' ? 'Resolved' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Message & Reply Area */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between h-[560px] shadow-xs">
            {(() => {
              const activeConv = conversations.find(
                c => c.id === (selectedConvId || conversations[0]?.id)
              );

              if (!activeConv) {
                return (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-600" />
                    <span>Select a conversation from the left to view and respond.</span>
                  </div>
                );
              }

              const hasUnseenMessages = activeConv.messages.some(m => m.sender === 'user' && m.seenByAdmin === false) || (activeConv.adminUnreadCount && activeConv.adminUnreadCount > 0);

              const handleSendAdminReply = (e: React.FormEvent) => {
                e.preventDefault();
                if (!adminReplyText.trim()) return;
                sendMessage(activeConv.id, adminReplyText.trim(), 'admin');
                setAdminReplyText('');
                showToast('Reply sent to customer', 'success');
              };

              return (
                <>
                  {/* Conversation Header */}
                  <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{activeConv.userName}</h3>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            activeConv.status === 'resolved'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60'
                          }`}
                        >
                          {activeConv.status}
                        </span>
                        {hasUnseenMessages && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse">
                            Unread Messages
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Phone: {activeConv.userPhone || 'N/A'} • Email: {activeConv.userEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasUnseenMessages && (
                        <button
                          onClick={() => markConversationSeenByAdmin(activeConv.id)}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
                        >
                          Mark as Seen
                        </button>
                      )}
                      {activeConv.status !== 'resolved' && (
                        <button
                          onClick={() => markConversationResolved(activeConv.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors border border-slate-700"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3 my-2 pr-1 scrollbar-none">
                    {activeConv.messages.map(msg => {
                      const isAdminMsg = msg.sender === 'admin';
                      const isUnseenUserMsg = !isAdminMsg && msg.seenByAdmin === false;

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                              isAdminMsg
                                ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                                : isUnseenUserMsg
                                ? 'bg-amber-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-bl-none border-2 border-red-400 dark:border-red-600/80 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-[10px] font-bold opacity-80">{msg.senderName}</span>
                              {isUnseenUserMsg && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-600 text-white">
                                  NEW / UNREAD
                                </span>
                              )}
                            </div>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Admin Reply Input */}
                  <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type response as Maa Vaibhav Lakshmi Expert..."
                      value={adminReplyText}
                      onChange={e => setAdminReplyText(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim()}
                      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shrink-0"
                    >
                      Send Reply
                    </button>
                  </form>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* PRODUCT MODAL WITH DRAG & DROP IMAGE UPLOAD */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 text-xs text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{editingProduct ? 'Edit Product Details' : 'Add New Catalog Item'}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Configure catalog specs, upload photos via drag & drop, and stock levels</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  placeholder="e.g. Dr. Fixit Roofseal Fast Elastomeric Waterproofing"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Brand Name *</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomBrand(!isCustomBrand)}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      {isCustomBrand ? 'Select from list' : '+ Custom brand'}
                    </button>
                  </div>

                  {!isCustomBrand ? (
                    <select
                      value={allBrands.includes(prodBrand) ? prodBrand : 'custom'}
                      onChange={e => {
                        if (e.target.value === 'custom') {
                          setIsCustomBrand(true);
                          setProdBrand('');
                        } else {
                          setProdBrand(e.target.value);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      {allBrands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                      <option value="custom">+ Enter Custom Brand Name...</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        required
                        value={prodBrand}
                        onChange={e => setProdBrand(e.target.value)}
                        placeholder="Type brand name (e.g. Sika, Fosroc)"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomBrand(false);
                          if (!prodBrand) setProdBrand('Dr. Fixit (Pidilite)');
                        }}
                        className="px-2.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold hover:bg-slate-200 shrink-0"
                        title="Back to dropdown"
                      >
                        List
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={prodCategoryId}
                    onChange={e => setProdCategoryId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">MRP Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodOrigPrice}
                    onChange={e => setProdOrigPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodStock}
                    onChange={e => setProdStock(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Packaging Unit</label>
                  <input
                    type="text"
                    required
                    value={prodUnit}
                    onChange={e => setProdUnit(e.target.value)}
                    placeholder="e.g. 5 Ltr, 20L Drum, 40kg Bag"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* DRAG AND DROP IMAGE UPLOAD DROPZONE */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Product Images (Drag & Drop or Upload)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Supports PNG, JPG, WebP</span>
                </div>

                {/* Dropzone Box */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDraggingFile(true); }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                    isDraggingFile
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                  onClick={() => document.getElementById('admin-file-upload-input')?.click()}
                >
                  <input
                    type="file"
                    id="admin-file-upload-input"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-xs">
                      Drag & Drop product image files here
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      or <span className="text-emerald-600 dark:text-emerald-400 underline font-semibold">click to browse local files</span>
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">Or paste Direct Image URL:</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={e => {
                      setProdImage(e.target.value);
                      if (e.target.value && !prodImages.includes(e.target.value)) {
                        setProdImages(prev => [e.target.value, ...prev]);
                      }
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Uploaded / Attached Gallery Images Thumbnails */}
                {prodImages.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Image Gallery ({prodImages.length}):</span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {prodImages.map((img, imgIdx) => {
                        const isMain = prodImage === img;
                        return (
                          <div
                            key={imgIdx}
                            className={`relative group shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                              isMain ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Gallery ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            {isMain && (
                              <span className="absolute top-0 left-0 bg-emerald-600 text-white text-[8px] font-black px-1 rounded-br-md">
                                MAIN
                              </span>
                            )}

                            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => setProdImage(img)}
                                  className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded"
                                >
                                  Make Main
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = prodImages.filter((_, i) => i !== imgIdx);
                                  setProdImages(updated);
                                  if (isMain && updated.length > 0) {
                                    setProdImage(updated[0]);
                                  }
                                }}
                                className="text-[9px] bg-red-600 text-white font-bold px-1 py-0.5 rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Product Description</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  placeholder="Detailed chemical usage guidelines, coverage rates, and surface prep..."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* ADMIN SPECIAL OFFER & PROMOTION CONTROLS */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Admin Custom Offer & Badge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="prod-offer-toggle"
                      checked={prodIsOfferActive}
                      onChange={e => setProdIsOfferActive(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    />
                    <label htmlFor="prod-offer-toggle" className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold cursor-pointer">
                      Activate Offer Badge
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    Custom Offer Text / Deal Headline (Decided by Admin)
                  </label>
                  <input
                    type="text"
                    value={prodOfferText}
                    onChange={e => setProdOfferText(e.target.value)}
                    placeholder="e.g. BUY 2 GET 10% OFF, MONSOON SPECIAL 15% OFF, FREE APPLICATOR ROLLER"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    When activated, this highlighted badge displays on the product card across the store for all customers.
                  </p>
                </div>
              </div>

              {/* DEFAULT RATING INFO */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 dark:text-amber-400">★</span>
                  <span>Catalog Rating:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{editingProduct ? `${editingProduct.rating} (${editingProduct.reviewCount || 0} reviews)` : '0.0 (0 reviews - Default initial rating)'}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">New products start with 0 rating</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="prod-featured-checkbox"
                  checked={prodFeatured}
                  onChange={e => setProdFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="prod-featured-checkbox" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Feature in Homepage Popular Products Showcase
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingProduct ? 'Update Product Details' : 'Publish Product to Store'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL (ADD & EDIT) */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 text-xs text-slate-900 dark:text-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => {
                  setIsCatModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterproofing Chemicals"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Liquid membranes, polymer additives, coatings"
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCatModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl transition-colors text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM CATEGORY DELETION MODAL */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs text-slate-900 dark:text-white shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Remove Category "{categoryToDelete.name}"?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This will remove the category from your catalog.
                  {products.filter(p => p.categoryId === categoryToDelete.id).length > 0 && (
                    <span className="block mt-1 font-semibold text-amber-600 dark:text-amber-400">
                      Note: {products.filter(p => p.categoryId === categoryToDelete.id).length} products are currently assigned to this category.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Yes, Remove Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERSONALIZED DISCOUNT MODAL */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs text-slate-900 dark:text-white my-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingDiscount ? 'Edit Personalized Discount' : 'Create Personalized Discount'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Custom coupon code linked to an individual client or project</p>
                </div>
              </div>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4">
              {/* Target Customer info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Customer / Client Name *</label>
                  <input
                    type="text"
                    required
                    value={discCustomerName}
                    onChange={e => setDiscCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra / Sharma Builders"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone or Email (Optional)</label>
                  <input
                    type="text"
                    value={discCustomerIdentifier}
                    onChange={e => setDiscCustomerIdentifier(e.target.value)}
                    placeholder="+91 98765 43210 or email"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Promo / Coupon Code *</label>
                  <button
                    type="button"
                    onClick={() => setDiscCode('VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase())}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Generate Random Code
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={discCode}
                  onChange={e => setDiscCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SPECIAL15 or VIP-RAMESH"
                  className="w-full font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Discount Type</label>
                  <select
                    value={discType}
                    onChange={e => setDiscType(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Percentage (%) Off</option>
                    <option value="fixed">Fixed Amount (₹) Off</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    {discType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={discType === 'percentage' ? 100 : 100000}
                    value={discValue}
                    onChange={e => setDiscValue(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
              </div>

              {/* Constraints */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Min Cart Order (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={discMinOrder}
                    onChange={e => setDiscMinOrder(Number(e.target.value))}
                    placeholder="0 for no minimum"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Expiry Date</label>
                  <input
                    type="date"
                    value={discExpiryDate}
                    onChange={e => setDiscExpiryDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Reason / Internal Note */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Internal Note / Reason (Optional)</label>
                <input
                  type="text"
                  value={discNote}
                  onChange={e => setDiscNote(e.target.value)}
                  placeholder="e.g. Approved 15% discount for temple project / loyal builder"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="disc-active-checkbox"
                  checked={discIsActive}
                  onChange={e => setDiscIsActive(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="disc-active-checkbox" className="text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  Enable coupon code immediately for checkout redemption
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingDiscount ? 'Update Personal Discount' : 'Save & Issue Discount Code'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE & EDIT ORDER MODAL */}
      {isOrderModalOpen && (
        <div
          id="admin-order-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            id="admin-order-modal-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-slate-900 dark:text-slate-100 shadow-2xl relative space-y-6 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {editingOrder ? `Edit Order #${editingOrder.id}` : 'Create New Customer Order'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {editingOrder ? 'Update order items, customer address, or status' : 'Add manual sales order or counter invoice'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={orderCustomerName}
                    onChange={e => setOrderCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Mobile Phone *</label>
                  <input
                    type="text"
                    required
                    value={orderCustomerPhone}
                    onChange={e => setOrderCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile (e.g. 9839818816)"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={orderCustomerEmail}
                    onChange={e => setOrderCustomerEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Delivery Address</label>
                  <input
                    type="text"
                    value={orderAddress}
                    onChange={e => setOrderAddress(e.target.value)}
                    placeholder="Shop/Site location, Chinhat / Gomti Nagar"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Pincode</label>
                  <input
                    type="text"
                    value={orderPincode}
                    onChange={e => setOrderPincode(e.target.value)}
                    placeholder="226028"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Status & Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Order Fulfillment Status</label>
                  <select
                    value={orderStatus}
                    onChange={e => setOrderStatus(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Payment Mode</label>
                  <select
                    value={orderPaymentMethod}
                    onChange={e => setOrderPaymentMethod(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Cash">Cash (Counter/On-site)</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {/* Order Items Editor */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block font-bold text-slate-900 dark:text-slate-200">
                  Products in Order ({orderItems.length})
                </label>

                {/* Add Product Line Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <select
                    value={orderProductSelectId}
                    onChange={e => setOrderProductSelectId(e.target.value)}
                    className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price} ({p.brand})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      min={1}
                      value={orderProductSelectQty}
                      onChange={e => setOrderProductSelectQty(Math.max(1, Number(e.target.value) || 1))}
                      className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-center rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="Qty"
                    />

                    <button
                      type="button"
                      onClick={handleAddItemToOrder}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Items List Table */}
                {orderItems.length > 0 ? (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                    {orderItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {item.image && (
                            <img src={item.image} alt={item.productName} className="w-8 h-8 object-cover rounded-lg border border-slate-200 dark:border-slate-800 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{item.productName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Rate: ₹{item.unitPrice}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                              className="w-6 h-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                              className="w-6 h-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>

                          <span className="font-bold text-emerald-600 dark:text-emerald-400 w-16 text-right">
                            ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveItemFromOrder(idx)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/60 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 text-center py-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    Please select and add products to this order.
                  </p>
                )}
              </div>

              {/* Discounts & Adjustments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Discount Code (Optional)</label>
                  <input
                    type="text"
                    value={orderDiscountCode}
                    onChange={e => setOrderDiscountCode(e.target.value)}
                    placeholder="VIP-SPECIAL"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Discount Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={orderDiscountAmount}
                    onChange={e => setOrderDiscountAmount(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Transport / Shipping (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={orderShippingFee}
                    onChange={e => setOrderShippingFee(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Grand Total Preview Card */}
              {orderItems.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Items Subtotal:</span>
                    <span>₹{orderItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0).toLocaleString('en-IN')}</span>
                  </div>
                  {orderDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span>Discount Deducted:</span>
                      <span>-₹{orderDiscountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Delivery Charges:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {orderShippingFee === 0 ? 'FREE (Store Pick-Up / Waived)' : `₹${orderShippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-800">
                    <span>Order Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ₹{(
                        Math.max(0, orderItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0) - orderDiscountAmount) +
                        Number(orderShippingFee)
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-md text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingOrder ? 'Update Order Details' : 'Save & Log Order in System'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SERVICE ADD / EDIT MODAL */}
      {isServiceModalOpen && (
        <div
          id="admin-service-modal"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl text-slate-900 dark:text-white shadow-2xl flex flex-col max-h-[88vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingService ? `Modify Service: ${editingService.title}` : 'Add New Service to Portfolio'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Configure technical specs, pricing, and project gallery</p>
                </div>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Service Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceTitle}
                    onChange={e => setServiceTitle(e.target.value)}
                    placeholder="e.g. Terrace & Roof Waterproofing"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={serviceCategory}
                    onChange={e => setServiceCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Waterproofing">Waterproofing</option>
                    <option value="Painting">Painting</option>
                    <option value="Construction & Maintenance">Construction & Maintenance</option>
                    <option value="Epoxy & PU Flooring">Epoxy & PU Flooring</option>
                    <option value="Injection Grouting">Injection Grouting</option>
                    <option value="Tile & Stone Care">Tile & Stone Care</option>
                  </select>
                </div>
              </div>

              {/* MULTI-PHOTO SERVICE GALLERY (DRAG & DROP + UPLOAD + URL) */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Service Photos Gallery (Multiple Photos Supported)</span>
                  </label>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{serviceImages.length} Photos attached</span>
                </div>

                {/* Dropzone Box */}
                <div
                  onDragOver={e => { e.preventDefault(); setIsDraggingServiceFile(true); }}
                  onDragLeave={() => setIsDraggingServiceFile(false)}
                  onDrop={handleServiceFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${
                    isDraggingServiceFile
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-emerald-500 dark:hover:border-slate-500'
                  }`}
                  onClick={() => document.getElementById('admin-service-file-upload-input')?.click()}
                >
                  <input
                    type="file"
                    id="admin-service-file-upload-input"
                    accept="image/*"
                    multiple
                    onChange={handleServiceFileInputChange}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-xs">
                      Drag & Drop service execution photos here
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      or <span className="text-emerald-600 dark:text-emerald-400 underline font-semibold">click to browse local files (Supports Multiple Files)</span>
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input with Add button */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={serviceImage}
                    onChange={e => setServiceImage(e.target.value)}
                    placeholder="Paste service image URL (e.g. https://images.unsplash.com/...)"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!serviceImage.trim()) return;
                      if (!serviceImages.includes(serviceImage.trim())) {
                        setServiceImages(prev => [serviceImage.trim(), ...prev]);
                        showToast('Photo added to service gallery!', 'success');
                      }
                    }}
                    className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add URL</span>
                  </button>
                </div>

                {/* Attached Service Photos Gallery Thumbnails */}
                {serviceImages.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Attached Service Gallery ({serviceImages.length} Photos):
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {serviceImages.map((img, imgIdx) => {
                        const isMain = (serviceImage === img) || (imgIdx === 0 && !serviceImage);
                        return (
                          <div
                            key={imgIdx}
                            className={`relative group shrink-0 w-20 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                              isMain ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Service Photo ${imgIdx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {isMain && (
                              <span className="absolute top-0 left-0 bg-emerald-600 text-white text-[8px] font-black px-1 rounded-br-md z-10">
                                COVER
                              </span>
                            )}

                            <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1 z-20">
                              {!isMain && (
                                <button
                                  type="button"
                                  onClick={() => setServiceImage(img)}
                                  className="text-[8px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded shadow-xs"
                                >
                                  Make Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = serviceImages.filter((_, i) => i !== imgIdx);
                                  setServiceImages(updated);
                                  if (isMain && updated.length > 0) {
                                    setServiceImage(updated[0]);
                                  }
                                }}
                                className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded shadow-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price, Warranty, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Starting Price</label>
                  <input
                    type="text"
                    value={serviceStartingPrice}
                    onChange={e => setServiceStartingPrice(e.target.value)}
                    placeholder="e.g. ₹35 / sq.ft."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Warranty Period</label>
                  <input
                    type="text"
                    value={serviceWarrantyPeriod}
                    onChange={e => setServiceWarrantyPeriod(e.target.value)}
                    placeholder="e.g. 10 Years Warranty"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Execution Duration</label>
                  <input
                    type="text"
                    value={serviceDuration}
                    onChange={e => setServiceDuration(e.target.value)}
                    placeholder="e.g. 2 - 4 Days"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Service Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceDescription}
                  onChange={e => setServiceDescription(e.target.value)}
                  placeholder="Detailed description of technical chemical process, chemical brands used (Dr. Fixit, Sika, Nippon), and site preparation..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              {/* Features / Inclusions (1 per line) */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Key Inclusions & Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={serviceFeatures}
                  onChange={e => setServiceFeatures(e.target.value)}
                  placeholder="Sika & Dr. Fixit Certified System&#10;Leak-Proof 10 Year Guarantee&#10;Crack Bridging Elastomeric Membrane&#10;Free Moisture Survey in Lucknow"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Each line will be formatted as a checkmark highlight on the customer website.
                </p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="service-active-toggle"
                  checked={serviceActive}
                  onChange={e => setServiceActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                />
                <label htmlFor="service-active-toggle" className="text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                  Publish service live on website (Visible to customers)
                </label>
              </div>

              {/* Sticky Submit Footer inside modal form */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Update Service' : 'Save & Publish Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
