// FILE PATH: src/utils/constants.js
// Application Constants

// App Information
export const APP_NAME = 'SARSAR';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Order now, delivered in 1 hour';

// Contact Information
export const CONTACT = {
  EMAIL: 'support@sarsar.com.np',
  PHONE: '+977-9821072912',
  WHATSAPP: '9779821072912',
  ADDRESS: 'Butwal, Nepal',
};

// Social Media
export const SOCIAL_MEDIA = {
  INSTAGRAM: 'https://www.instagram.com/_official_sarsar',
  FOUNDER_INSTAGRAM: 'https://www.instagram.com/sharma_vishal_o',
  TIKTOK: '',
  YOUTUBE: '',
  FACEBOOK: '',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
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
];

// Delivery Settings
export const DELIVERY = {
  STANDARD_TIME: 60, // minutes
  EXPRESS_TIME: 30, // minutes
  STANDARD_FEE: 0, // Rs.
  EXPRESS_FEE: 50, // Rs.
  FREE_DELIVERY_THRESHOLD: 500, // Rs.
  ZONES: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
};

// Order Status
export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PICKING: 'picking',
  PACKING: 'packing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  picking: 'Picking Items',
  packing: 'Packing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  ESEWA: 'esewa',
  KHALTI: 'khalti',
  BANK_TRANSFER: 'bank_transfer',
};

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  ADMIN: 'admin',
};

// Routes
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Customer
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_WISHLIST: '/customer/wishlist',
  
  // Supplier
  SUPPLIER_DASHBOARD: '/supplier/dashboard',
  SUPPLIER_PRODUCTS: '/supplier/products',
  SUPPLIER_ORDERS: '/supplier/orders',
  SUPPLIER_INVENTORY: '/supplier/inventory',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SUPPLIERS: '/admin/suppliers',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Image Settings
export const IMAGE_SETTINGS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_PATTERN: /^[0-9]{10}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Business Hours
export const BUSINESS_HOURS = {
  START: '06:00',
  END: '23:00',
  TIMEZONE: 'Asia/Kathmandu',
};

// API Endpoints (if needed)
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  AUTH: '/auth',
};

// Toast/Notification Duration
export const NOTIFICATION_DURATION = 5000; // ms

// Cart Settings
export const CART = {
  MAX_QUANTITY: 99,
  MIN_ORDER_AMOUNT: 10,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
};

// Currency
export const CURRENCY = {
  CODE: 'NPR',
  SYMBOL: 'Rs.',
  POSITION: 'before', // 'before' or 'after'
};

// Export all as default object as well
export default {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  CONTACT,
  SOCIAL_MEDIA,
  PRODUCT_CATEGORIES,
  DELIVERY,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHODS,
  USER_ROLES,
  ROUTES,
  PAGINATION,
  IMAGE_SETTINGS,
  VALIDATION,
  BUSINESS_HOURS,
  API_ENDPOINTS,
  NOTIFICATION_DURATION,
  CART,
  DATE_FORMATS,
  CURRENCY,
};