// FILE PATH: src/config/app.config.js
// Application Configuration - Constants and settings

export const APP_CONFIG = {
  // Application Info
  APP: {
    NAME: 'SARSAR',
    VERSION: '1.0.0',
    DESCRIPTION: 'Order now, delivered in 1 hour',
    URL: import.meta.env.VITE_APP_URL || 'https://sarsar.com.np',
  },
  
  // Contact Information
  CONTACT: {
    EMAIL: 'support@sarsar.com.np',
    PHONE: '+977-9821072912',
    WHATSAPP: '9779821072912',
    ADDRESS: 'Butwal, Nepal',
  },
  
  // Social Media
  SOCIAL: {
    INSTAGRAM: 'https://www.instagram.com/_official_sarsar',
    FOUNDER_INSTAGRAM: 'https://www.instagram.com/sharma_vishal_o',
    TIKTOK: '',
    YOUTUBE: '',
    FACEBOOK: '',
  },
  
  // Business Hours
  BUSINESS_HOURS: {
    START: '06:00',
    END: '23:00',
    TIMEZONE: 'Asia/Kathmandu',
  },
  
  // Delivery Settings
  DELIVERY: {
    STANDARD: {
      TIME: 60, // minutes
      FEE: 0,
      LABEL: '1-Hour Delivery',
    },
    EXPRESS: {
      TIME: 30, // minutes
      FEE: 50,
      LABEL: '30-Minute Express',
    },
    FREE_THRESHOLD: 500, // Rs.
    ZONES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  
  // Order Settings
  ORDER: {
    MIN_AMOUNT: 10,
    MAX_ITEMS: 100,
    CANCEL_WINDOW: 5, // minutes
    AUTO_CANCEL_TIME: 30, // minutes if not confirmed
  },
  
  // Payment Methods
  PAYMENT: {
    METHODS: ['COD', 'ESEWA', 'KHALTI', 'BANK_TRANSFER'],
    DEFAULT: 'COD',
    COD_LIMIT: 10000, // Rs.
  },
  
  // Product Settings
  PRODUCT: {
    MIN_PRICE: 1,
    MAX_PRICE: 100000,
    MAX_IMAGES: 5,
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // Categories
  CATEGORIES: [
    { id: 'groceries', name: 'Groceries', icon: '🛒' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' },
    { id: 'meat', name: 'Meat & Fish', icon: '🍖' },
    { id: 'bakery', name: 'Bakery', icon: '🍞' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
    { id: 'household', name: 'Household', icon: '🧹' },
    { id: 'personal-care', name: 'Personal Care', icon: '🧴' },
    { id: 'baby', name: 'Baby Products', icon: '👶' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
  ],
  
  // User Roles
  ROLES: {
    CUSTOMER: 'customer',
    SUPPLIER: 'supplier',
    ADMIN: 'admin',
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  
  // Search
  SEARCH: {
    MIN_CHARS: 2,
    DEBOUNCE_MS: 300,
    MAX_RESULTS: 50,
  },
  
  // Cart
  CART: {
    MAX_QUANTITY: 99,
    EXPIRY_DAYS: 7,
  },
  
  // Notifications
  NOTIFICATIONS: {
    DURATION: 5000, // ms
    MAX_STACK: 3,
  },
  
  // Feature Flags
  FEATURES: {
    PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ERROR_TRACKING: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
    LOYALTY: import.meta.env.VITE_ENABLE_LOYALTY_PROGRAM === 'true',
    REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS === 'true',
    WISHLIST: import.meta.env.VITE_ENABLE_WISHLIST === 'true',
  },
  
  // Animation Durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Breakpoints (matches Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'MMM dd, yyyy',
    INPUT: 'yyyy-MM-dd',
    TIME: 'HH:mm',
    DATETIME: 'MMM dd, yyyy HH:mm',
  },
  
  // Currency
  CURRENCY: {
    CODE: 'NPR',
    SYMBOL: 'Rs.',
    POSITION: 'before', // 'before' or 'after'
    DECIMALS: 0,
  },
};

export default APP_CONFIG;