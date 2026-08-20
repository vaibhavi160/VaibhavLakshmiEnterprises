import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from '../lib/firebase';
import {
  Product,
  Category,
  Order,
  Conversation,
  ServiceItem,
  ServiceQuery,
  CustomerDiscount,
  AdminSettings,
  FinancialRecord,
  UserProfile,
  ProductReview,
} from '../types';

export const DEFAULT_STORE_SETTINGS: AdminSettings = {
  businessName: 'Maa Vaibhav Lakshmi Enterprises',
  brandName: 'Maa Vaibhav Lakshmi Enterprises',
  tagline: 'Specialist Applicator and Dealer in Construction Chemicals, Waterproofing & Painting',
  primaryPhone: '9454666748',
  secondaryPhone: '7080805601',
  whatsappNumber: '919454666748',
  email: 'rajeshwar781@gmail.com',
  address: 'Pal Market, Opp. Baba Kabari, Baba Hospital Road, Chinhat, Lucknow U.P. - 226028',
  taxRate: 0,
  shippingFee: 0,
  freeShippingThreshold: 3000,
  lowStockThreshold: 10,
  businessHoursStart: 8.5, // 8:30 AM
  businessHoursEnd: 20.5, // 8:30 PM (20:30)
  businessDays: [0, 1, 2, 3, 4, 5, 6], // Mon - Sun
  businessHoursText: 'Mon – Sun: 8:30 AM – 8:30 PM IST',
  technicianName: 'Rajeshwar Shukla',
  technicianRole: 'Senior Chemical & Waterproofing Specialist',
  technicianOnlineOverride: null,
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-waterproofing',
    name: 'Waterproofing Chemicals',
    slug: 'waterproofing-chemicals',
    description: 'Integral liquid waterproofing, polymer membrane slurries, damp proofing & crystalline compounds.',
    iconName: 'Shield',
    productCount: 4,
  },
  {
    id: 'cat-wall-putty',
    name: 'Wall Putty & Damp-Lock Primers',
    slug: 'wall-putty-primers',
    description: 'White cement polymer wall putty, damp-lock base coats, and weather-seal primers.',
    iconName: 'Layers',
    productCount: 2,
  },
  {
    id: 'cat-tile-adhesives',
    name: 'Tile Adhesives & Epoxy Grouts',
    slug: 'tile-adhesives-grouts',
    description: 'Heavy-duty polymer-modified tile adhesives, anti-fungal epoxy joint grouts for vitrified and stone.',
    iconName: 'Grid',
    productCount: 2,
  },
  {
    id: 'cat-crack-sealants',
    name: 'Crack Fillers & Polyurethane Sealants',
    slug: 'crack-fillers-sealants',
    description: 'Elastomeric plaster crack fillers, silicone joint sealants, and polyurethane expansion materials.',
    iconName: 'Activity',
    productCount: 2,
  },
  {
    id: 'cat-epoxies',
    name: 'Epoxy, Bonding Agents & Admixtures',
    slug: 'epoxy-bonding-agents',
    description: 'SBR latex bonding agents, concrete repair mortars, industrial epoxy flooring & self-leveling coats.',
    iconName: 'Sparkles',
    productCount: 2,
  },
  {
    id: 'cat-paints-coatings',
    name: 'Exterior Waterproof Paints & Coatings',
    slug: 'waterproof-paints-coatings',
    description: 'High-performance elastomeric exterior wall coatings, anti-algal decorative weather coats.',
    iconName: 'Paintbrush',
    productCount: 2,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-dr-fixit-lw-plus',
    name: 'Dr. Fixit Pidiproof LW+ Integral Liquid Waterproofing Compound',
    slug: 'dr-fixit-pidiproof-lw-plus',
    brand: 'Dr. Fixit (Pidilite)',
    categoryId: 'cat-waterproofing',
    price: 185,
    originalPrice: 220,
    discountPercentage: 16,
    offerText: 'Special Contractor Discount on 20L Cans',
    isOfferActive: true,
    stock: 45,
    minStockThreshold: 10,
    sku: 'DF-LW-1L',
    unit: '1L Bottle',
    mainImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Specially formulated integral liquid waterproofing compound composed of surface active plasticising agents and polymers for concrete and mortar plasting.',
    specifications: [
      { key: 'Packaging', value: '1L, 5L, 10L, 20L' },
      { key: 'Dosage', value: '200ml per 50kg bag of cement' },
      { key: 'Standards', value: 'IS: 2645-2003 & IS: 9103-2000' },
      { key: 'Application', value: 'Basements, roof slabs, screeds, water tanks' },
    ],
    featured: true,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Roof Slabs', 'Internal Plaster', 'External Plaster', 'Foundations'],
  },
  {
    id: 'prod-dr-fixit-fastflex',
    name: 'Dr. Fixit Fastflex Two-Component Polymer Modified Waterproofing Membrane',
    slug: 'dr-fixit-fastflex',
    brand: 'Dr. Fixit (Pidilite)',
    categoryId: 'cat-waterproofing',
    price: 2450,
    originalPrice: 2790,
    discountPercentage: 12,
    offerText: 'Includes Liquid Polymer + Cementitious Powder',
    isOfferActive: true,
    stock: 22,
    minStockThreshold: 5,
    sku: 'DF-FF-12KG',
    unit: '12kg Pack (Kit)',
    mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A two-component cementitious coating consisting of liquid polymer and selected cements with graded aggregates for high-pressure water retaining structures and terrace roofs.',
    specifications: [
      { key: 'Form', value: '2-Part Polymer + Powder' },
      { key: 'Coverage', value: '80 - 90 sq.ft per 12kg kit in 2 coats' },
      { key: 'Elongation', value: '> 100% Elastic Flexibility' },
      { key: 'Best For', value: 'Sunken slabs, bathrooms, terrace, water reservoirs' },
    ],
    featured: true,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Terraces', 'Bathrooms & Sunken Slabs', 'Water Tanks', 'Balconies'],
  },
  {
    id: 'prod-sikatop-seal-107',
    name: 'SikaTop Seal-107 Cementitious Waterproofing Slurry & Protective Coating',
    slug: 'sikatop-seal-107',
    brand: 'Sika',
    categoryId: 'cat-waterproofing',
    price: 2150,
    originalPrice: 2400,
    discountPercentage: 10,
    offerText: 'Swiss Standard Industrial Waterproofing',
    isOfferActive: true,
    stock: 18,
    minStockThreshold: 4,
    sku: 'SIKA-TOP-25KG',
    unit: '25kg Kit (Part A + B)',
    mainImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Two-part polymer modified cementitious waterproofing mortar slurry for concrete and mortar to prevent water infiltration with excellent adhesion to structural surfaces.',
    specifications: [
      { key: 'Pot Life', value: '35 minutes at 30°C' },
      { key: 'Tensile Strength', value: '> 1.5 N/mm²' },
      { key: 'Potable Water Safe', value: 'Yes, certified non-toxic' },
    ],
    featured: true,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Basements', 'Retaining Walls', 'Swimming Pools', 'Overhead Tanks'],
  },
  {
    id: 'prod-fosroc-nitobond-sbr',
    name: 'Fosroc Nitobond SBR Latex Bonding Agent & Polymer Mortar Additive',
    slug: 'fosroc-nitobond-sbr',
    brand: 'Fosroc',
    categoryId: 'cat-epoxies',
    price: 1650,
    originalPrice: 1900,
    discountPercentage: 13,
    offerText: 'High Bond Strength Concrete Adhesive',
    isOfferActive: true,
    stock: 25,
    minStockThreshold: 5,
    sku: 'FOS-SBR-5L',
    unit: '5L Can',
    mainImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Mortar and screed modifier bonding agent providing excellent resistance to water penetration, chloride diffusion and superior adhesion to old and new concrete substrates.',
    specifications: [
      { key: 'Specific Gravity', value: '1.02' },
      { key: 'Application', value: 'Bonding coat, repair mortar, waterproof screeds' },
    ],
    featured: false,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Concrete Repairs', 'Floor Screeds', 'Plaster Bonding', 'Masonry'],
  },
  {
    id: 'prod-asianpaints-dampblock-2k',
    name: 'Asian Paints SmartCare Damp Block 2K Waterproofing Coating',
    slug: 'asian-paints-dampblock-2k',
    brand: 'Asian Paints',
    categoryId: 'cat-paints-coatings',
    price: 1850,
    originalPrice: 2100,
    discountPercentage: 12,
    offerText: 'Guaranteed Protection Against Severe Efflorescence',
    isOfferActive: true,
    stock: 30,
    minStockThreshold: 6,
    sku: 'AP-DB-3KG',
    unit: '3kg Pack',
    mainImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'High performance polymer modified cementitious anti-dampness treatment for interior walls affected by rising dampness and salt efflorescence.',
    specifications: [
      { key: 'Warranty', value: 'Up to 3 Years Waterproofing Warranty' },
      { key: 'Coverage', value: '15-18 sq.ft per kg for 2 coats' },
    ],
    featured: true,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Interior Damp Walls', 'Base of Skirting', 'Saltpeter Efflorescence Areas'],
  },
  {
    id: 'prod-roff-tile-adhesive',
    name: 'Roff Non-Skid Polymer Tile Adhesive (Grey/White)',
    slug: 'roff-non-skid-tile-adhesive',
    brand: 'Roff (Pidilite)',
    categoryId: 'cat-tile-adhesives',
    price: 420,
    originalPrice: 480,
    discountPercentage: 12,
    offerText: 'High Grip Anti-Slip Formula',
    isOfferActive: true,
    stock: 60,
    minStockThreshold: 15,
    sku: 'ROFF-NSA-20KG',
    unit: '20kg Bag',
    mainImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Polymer-modified cementitious tile adhesive for fixing ceramic, vitrified and terracotta tiles on floors and walls with zero vertical slip.',
    specifications: [
      { key: 'Open Time', value: '20-25 mins' },
      { key: 'Coverage', value: '45-50 sq.ft per 20kg bag at 3mm bed' },
    ],
    featured: false,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Floor Tiling', 'Wall Cladding', 'Kitchen Backsplashes', 'Bathrooms'],
  },
  {
    id: 'prod-dr-fixit-crack-x-paste',
    name: 'Dr. Fixit Crack-X Paste Acrylic Elastomeric Crack Filler',
    slug: 'dr-fixit-crack-x-paste',
    brand: 'Dr. Fixit (Pidilite)',
    categoryId: 'cat-crack-sealants',
    price: 220,
    originalPrice: 250,
    discountPercentage: 12,
    offerText: 'Non-Shrink Flexible Crack Sealant',
    isOfferActive: true,
    stock: 50,
    minStockThreshold: 10,
    sku: 'DF-CX-1KG',
    unit: '1kg Bucket',
    mainImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Single component acrylic emulsion based flexible paste for sealing surface cracks up to 5mm width in internal and external plaster.',
    specifications: [
      { key: 'Max Crack Width', value: '5 mm' },
      { key: 'Drying Time', value: '2 to 3 hours' },
    ],
    featured: false,
    active: true,
    rating: 0,
    reviewCount: 0,
    usageAreas: ['Interior Plaster Cracks', 'Exterior Facade Cracks', 'Ceiling Joints'],
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-terrace-waterproofing',
    category: 'Waterproofing',
    title: 'Terrace & Roof Comprehensive Waterproofing Solution',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ],
    siteMedia: [
      {
        id: 'sm-tw-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        title: 'Live Site Walkthrough: Elastomeric Membrane Coating',
        description: '2-coat Dr. Fixit Fastflex with fiber-mesh joint reinforcement at Gomti Nagar site.',
        siteLocation: 'Gomti Nagar Ext., Lucknow',
        stage: 'In Progress',
        duration: '0:15',
        createdAt: '2025-02-14',
      },
      {
        id: 'sm-tw-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
        title: 'Crack V-Groove Cutting & Surface Prep',
        description: 'Mechanical chiseling of shrinkage cracks before polymer injection.',
        siteLocation: 'Hazratganj Commercial Terrace',
        stage: 'Before Work',
        createdAt: '2025-02-11',
      },
      {
        id: 'sm-tw-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        title: '48-Hour Flood Water Ponding Test',
        description: 'Pond test inspection certifying 100% leak-proof finish with 10-year warranty.',
        siteLocation: 'Indira Nagar Villa',
        stage: 'Water Test',
        createdAt: '2025-02-15',
      },
    ],
    description: 'End-to-end multi-layer elastomeric polymer membrane and fiber-mesh reinforced terrace waterproofing treatment with 5-10 years written service warranty by senior applicator Rajeshwar Shukla.',
    features: [
      'Pressure washing & surface crack groove chiseling',
      'High bond SBR polymer primer coat application',
      'Glass-fiber mesh reinforcement on joints & parapet corners',
      '2 Coats of heavy-duty elastomeric waterproofing membrane',
      'Flood pond test verification for 48 hours',
      '5 to 10 Years Service & Leakage Warranty',
    ],
    startingPrice: '₹38 / sq.ft',
    warrantyPeriod: '7 to 10 Years',
    duration: '2 - 4 Days depending on area',
    active: true,
  },
  {
    id: 'srv-bathroom-leakage-repair',
    category: 'Waterproofing',
    title: 'Bathroom & Kitchen Leakage Repair (No Tile Breaking)',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    ],
    siteMedia: [
      {
        id: 'sm-bl-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        title: 'Non-Destructive Sanitary Joint Epoxy Sealing Video',
        description: 'Deep tile joint vacuuming and anti-fungal epoxy grout injection without breaking tiles.',
        siteLocation: 'Aliganj Sector B, Lucknow',
        stage: 'In Progress',
        duration: '0:15',
        createdAt: '2025-02-12',
      },
      {
        id: 'sm-bl-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
        title: 'Thermal Moisture Scan of Sunken Slab',
        description: 'Pinpointing concealed pipe seepage behind tile walls.',
        siteLocation: 'Mahanagar Apartment',
        stage: 'Inspection',
        createdAt: '2025-02-10',
      },
    ],
    description: 'Advanced non-destructive sanitary waterproofing technique using transparent polymer barrier injection and hydrophobic epoxy tile joint sealants without breaking existing costly tiles.',
    features: [
      'Thermal/Moisture inspection to identify hidden plumbing leaks',
      'Old degraded grout removal & sterile joint cleaning',
      'Anti-fungal waterproof epoxy grout packing',
      'Clear penetrating nanotech hydrophobic barrier coat',
      'Completed in 24 hours with immediate bathroom reuse',
    ],
    startingPrice: '₹4,500 / bathroom',
    warrantyPeriod: '5 Years',
    duration: '1 Day',
    active: true,
  },
  {
    id: 'srv-basement-waterproofing',
    category: 'Waterproofing',
    title: 'Basement, Lift Pit & Retaining Wall High-Pressure Grouting',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    ],
    siteMedia: [
      {
        id: 'sm-bw-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
        title: 'High Pressure Polyurethane PU Injection Grouting',
        description: 'Instant running water stoppage using expandable PU resin ports in commercial basement.',
        siteLocation: 'Vibhuti Khand, Gomti Nagar',
        stage: 'In Progress',
        duration: '0:15',
        createdAt: '2025-02-09',
      },
    ],
    description: 'Specialist negative-side high-pressure polyurethane (PU) injection grouting and crystalline coating system for stopping running active water leakages in basements and underground structures.',
    features: [
      'Polyurethane (PU) expanding foam pressure grouting',
      'Crystalline capillary water-blocking deep coat',
      'Heavy-duty negative side polymer slurry application',
      'Ideal for lift pits, underground water tanks & basements',
    ],
    startingPrice: '₹65 / sq.ft / Port Grouting',
    warrantyPeriod: '10 Years',
    duration: '3 - 6 Days',
    active: true,
  },
  {
    id: 'srv-exterior-wall-coating',
    category: 'Painting',
    title: 'Exterior Wall Weather-Proof Damp Coating & Painting',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    ],
    siteMedia: [
      {
        id: 'sm-ew-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
        title: 'Exterior Facade Anti-Damp Coating Application',
        description: 'Elastomeric weather barrier spray and roller application on 4-storey building.',
        siteLocation: 'Vrindavan Yojna, Lucknow',
        stage: 'In Progress',
        duration: '0:15',
        createdAt: '2025-02-13',
      },
    ],
    description: 'Complete exterior wall dampness remediation, plaster crack sealing, and elastomeric weather-proof painting with dust and UV resistance.',
    features: [
      'Scraping loose paint & fungal algae removal',
      'Crack-X paste groove filling for hairline & structural cracks',
      'Damp-block penetrative primer base coat',
      '2 Coats of anti-fade exterior elastomeric acrylic paint',
    ],
    startingPrice: '₹18 / sq.ft',
    warrantyPeriod: '5 to 7 Years',
    duration: '4 - 7 Days',
    active: true,
  },
  {
    id: 'srv-industrial-epoxy-flooring',
    category: 'Construction & Maintenance',
    title: 'Industrial Epoxy Flooring & Anti-Static Floor Coating',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    ],
    siteMedia: [
      {
        id: 'sm-ef-1',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        title: '3mm Self-Leveling Epoxy Floor Spreading Walkthrough',
        description: 'Mirror-finish chemical resistant flooring execution for pharmaceutical warehouse.',
        siteLocation: 'Sarojini Nagar Industrial Area, Lucknow',
        stage: 'Completed',
        duration: '0:15',
        createdAt: '2025-02-05',
      },
    ],
    description: 'High-build self-leveling epoxy and polyurethane flooring for commercial showrooms, warehouses, hospitals, workshops, and pharmaceutical clean rooms in Lucknow and UP.',
    features: [
      'Concrete mechanical grinding and dust extraction',
      'Deep penetrating epoxy primer base coat',
      'High compressive strength self-leveling screed',
      'Seamless, chemical-resistant and mirror gloss finish',
    ],
    startingPrice: '₹55 / sq.ft (1mm to 3mm)',
    warrantyPeriod: '5 Years',
    duration: '3 - 5 Days',
    active: true,
  },
];

/**
 * Utility function to sanitize objects before sending to Firestore.
 * Firestore setDoc/updateDoc throws an error if any field is `undefined`.
 * This strips all undefined properties cleanly.
 */
export function cleanForFirestore<T>(data: T): Record<string, any> {
  if (data === null || data === undefined) return {};
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = cleanForFirestore(value);
      } else if (Array.isArray(value)) {
        cleaned[key] = value.map(item =>
          item !== null && typeof item === 'object' ? cleanForFirestore(item) : item
        );
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// User Profile Operations
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Error fetching user profile from Firestore:', err);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const docRef = doc(db, 'users', profile.uid);
    const cleanData = cleanForFirestore({
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    console.warn('Error saving user profile to Firestore:', err);
  }
}

// Initial Database Setup & Auto-Seeding of Products, Categories & Services
export async function initializeFirestoreSeedIfNeeded(): Promise<void> {
  try {
    // 1. Check settings
    const settingsSnap = await getDoc(doc(db, 'settings', 'main'));
    if (!settingsSnap.exists()) {
      await setDoc(doc(db, 'settings', 'main'), cleanForFirestore(DEFAULT_STORE_SETTINGS));
    }

    // 2. Check Admin Profiles (Vaibhavi Keshari & Rajeshwar Shukla)
    const adminUserSnap1 = await getDoc(doc(db, 'users', 'admin-vaibhavi'));
    if (!adminUserSnap1.exists()) {
      await setDoc(doc(db, 'users', 'admin-vaibhavi'), cleanForFirestore({
        uid: 'admin-vaibhavi',
        email: 'kesharivaibhavi8@gmail.com',
        name: 'Vaibhavi Keshari (Admin)',
        phone: '9454666748',
        address: 'Near Neem Karoli Dham, Chinhat',
        city: 'Lucknow',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }));
    }

    const adminUserSnap2 = await getDoc(doc(db, 'users', 'admin-rajeshwar'));
    if (!adminUserSnap2.exists()) {
      await setDoc(doc(db, 'users', 'admin-rajeshwar'), cleanForFirestore({
        uid: 'admin-rajeshwar',
        email: 'rajeshwar781@gmail.com',
        name: 'Rajeshwar Shukla (Admin)',
        phone: '9454666748',
        address: 'Near Neem Karoli Dham, Chinhat',
        city: 'Lucknow',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }));
    }

    // 3. Seed Categories if empty
    const catSnapshot = await getDocs(collection(db, 'categories'));
    if (catSnapshot.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cleanForFirestore(cat), { merge: true });
      }
    }

    // 4. Seed Products if empty
    const prodSnapshot = await getDocs(collection(db, 'products'));
    if (prodSnapshot.empty) {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), cleanForFirestore(prod), { merge: true });
      }
    }

    // 5. Seed Services if empty
    const srvSnapshot = await getDocs(collection(db, 'services'));
    if (srvSnapshot.empty) {
      for (const srv of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', srv.id), cleanForFirestore(srv), { merge: true });
      }
    }

    // 6. Seed Reviews if empty
    const revSnapshot = await getDocs(collection(db, 'reviews'));
    if (revSnapshot.empty) {
      for (const rev of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', rev.id), cleanForFirestore(rev), { merge: true });
      }
    }
  } catch (err) {
    console.warn('Firestore initial seeding error:', err);
  }
}

export async function forceSyncAllToFirestore(): Promise<{ success: boolean; message: string }> {
  try {
    // Save Settings
    await setDoc(doc(db, 'settings', 'main'), cleanForFirestore(DEFAULT_STORE_SETTINGS), { merge: true });

    // Save Admin Profiles (Vaibhavi Keshari & Rajeshwar Shukla)
    await setDoc(doc(db, 'users', 'admin-vaibhavi'), cleanForFirestore({
      uid: 'admin-vaibhavi',
      email: 'kesharivaibhavi8@gmail.com',
      name: 'Vaibhavi Keshari (Admin)',
      phone: '9454666748',
      address: 'Near Neem Karoli Dham, Chinhat',
      city: 'Lucknow',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }), { merge: true });

    await setDoc(doc(db, 'users', 'admin-rajeshwar'), cleanForFirestore({
      uid: 'admin-rajeshwar',
      email: 'rajeshwar781@gmail.com',
      name: 'Rajeshwar Shukla (Admin)',
      phone: '9454666748',
      address: 'Near Neem Karoli Dham, Chinhat',
      city: 'Lucknow',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }), { merge: true });

    // Save all Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cleanForFirestore(cat), { merge: true });
    }

    // Save all Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), cleanForFirestore(prod), { merge: true });
    }

    // Save all Services
    for (const srv of INITIAL_SERVICES) {
      await setDoc(doc(db, 'services', srv.id), cleanForFirestore(srv), { merge: true });
    }

    // Save all Initial Reviews
    for (const rev of INITIAL_REVIEWS) {
      await setDoc(doc(db, 'reviews', rev.id), cleanForFirestore(rev), { merge: true });
    }

    return { success: true, message: 'All Products, Categories, Services, Reviews & Settings successfully synced to Firestore!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error syncing data to Firestore' };
  }
}

// Product Firestore Operations
export async function saveProductToFirestore(product: Product): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(product);
    await setDoc(doc(db, 'products', product.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving product to Firestore:', err);
    throw err;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (err: any) {
    console.error('Error deleting product from Firestore:', err);
    throw err;
  }
}

// Category Firestore Operations
export async function saveCategoryToFirestore(cat: Category): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(cat);
    await setDoc(doc(db, 'categories', cat.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving category to Firestore:', err);
    throw err;
  }
}

export async function deleteCategoryFromFirestore(catId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'categories', catId));
    return true;
  } catch (err: any) {
    console.error('Error deleting category from Firestore:', err);
    throw err;
  }
}

// Service Item Firestore Operations
export async function saveServiceToFirestore(serviceItem: ServiceItem): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(serviceItem);
    await setDoc(doc(db, 'services', serviceItem.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving service to Firestore:', err);
    throw err;
  }
}

export async function deleteServiceFromFirestore(serviceId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'services', serviceId));
    return true;
  } catch (err: any) {
    console.error('Error deleting service from Firestore:', err);
    throw err;
  }
}

// Order Firestore Operations
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(order);
    await setDoc(doc(db, 'orders', order.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving order to Firestore:', err);
    throw err;
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return true;
  } catch (err: any) {
    console.error('Error deleting order from Firestore:', err);
    throw err;
  }
}

// Chat Conversation Firestore Operations
export async function saveConversationToFirestore(conv: Conversation): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(conv);
    await setDoc(doc(db, 'conversations', conv.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving conversation to Firestore:', err);
    throw err;
  }
}

// Service Query Firestore Operations
export async function saveQueryToFirestore(queryItem: ServiceQuery): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(queryItem);
    await setDoc(doc(db, 'serviceQueries', queryItem.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving service query to Firestore:', err);
    throw err;
  }
}

// Customer Discount Firestore Operations
export async function saveDiscountToFirestore(discount: CustomerDiscount): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(discount);
    await setDoc(doc(db, 'customerDiscounts', discount.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving discount to Firestore:', err);
    throw err;
  }
}

export async function deleteDiscountFromFirestore(discId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'customerDiscounts', discId));
    return true;
  } catch (err: any) {
    console.error('Error deleting discount from Firestore:', err);
    throw err;
  }
}

// Settings Firestore Operations
export async function saveSettingsToFirestore(settings: AdminSettings): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(settings);
    await setDoc(doc(db, 'settings', 'main'), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving settings to Firestore:', err);
    throw err;
  }
}

// Initial Verified Customer Reviews (Empty by default - built purely from customer orders)
export const INITIAL_REVIEWS: ProductReview[] = [];

// Product Review Firestore Operations
export async function saveReviewToFirestore(review: ProductReview): Promise<boolean> {
  try {
    const cleanData = cleanForFirestore(review);
    await setDoc(doc(db, 'reviews', review.id), cleanData, { merge: true });
    return true;
  } catch (err: any) {
    console.error('Error saving review to Firestore:', err);
    throw err;
  }
}

export async function deleteReviewFromFirestore(reviewId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    return true;
  } catch (err: any) {
    console.error('Error deleting review from Firestore:', err);
    throw err;
  }
}

