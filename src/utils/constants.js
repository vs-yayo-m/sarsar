// SARSAR Platform - Global Constants
// All constants used across the application

// ==================== ROUTES ====================
export const ROUTES = {
  // Public routes
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:id',
  SEARCH: '/search',
  CATEGORY: '/category/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  ORDER_TRACKING: '/order/:id',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Customer routes
  CUSTOMER_DASHBOARD: '/customer',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_ORDER_DETAIL: '/customer/orders/:id',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_WISHLIST: '/customer/wishlist',
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_SETTINGS: '/customer/settings',
  
  // Supplier routes
  SUPPLIER_DASHBOARD: '/supplier',
  SUPPLIER_PRODUCTS: '/supplier/products',
  SUPPLIER_ORDERS: '/supplier/orders',
  SUPPLIER_INVENTORY: '/supplier/inventory',
  SUPPLIER_ANALYTICS: '/supplier/analytics',
  SUPPLIER_SETTINGS: '/supplier/settings',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SUPPLIERS: '/admin/suppliers',
  ADMIN_FINANCIAL: '/admin/financial',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_MARKETING: '/admin/marketing',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Static pages
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  FAQ: '/faq',
  HOW_IT_WORKS: '/how-it-works',
}

// ==================== USER ROLES ====================
export const USER_ROLES = {
  CUSTOMER: 'customer',
  SUPPLIER: 'supplier',
  ADMIN: 'admin',
}

// ==================== ORDER STATUS ====================
export const ORDER_STATUS = {
  PLACED: 'placed',
  CONFIRMED: 'confirmed',
  PICKING: 'picking',
  PACKING: 'packing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PLACED]: 'Order Placed',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PICKING]: 'Picking Items',
  [ORDER_STATUS.PACKING]: 'Packing',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded',
}

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PLACED]: 'blue',
  [ORDER_STATUS.CONFIRMED]: 'green',
  [ORDER_STATUS.PICKING]: 'yellow',
  [ORDER_STATUS.PACKING]: 'orange',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'purple',
  [ORDER_STATUS.DELIVERED]: 'green',
  [ORDER_STATUS.CANCELLED]: 'red',
  [ORDER_STATUS.REFUNDED]: 'gray',
}

// ==================== PAYMENT METHODS ====================
export const PAYMENT_METHODS = {
  COD: 'cod',
  ESEWA: 'esewa',
  KHALTI: 'khalti',
  BANK: 'bank',
  WALLET: 'wallet',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

// ==================== DELIVERY TYPES ====================
export const DELIVERY_TYPES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SCHEDULED: 'scheduled',
}

export const DELIVERY_TIMES = {
  [DELIVERY_TYPES.STANDARD]: 60, // 1 hour in minutes
  [DELIVERY_TYPES.EXPRESS]: 30, // 30 minutes
}

export const DELIVERY_FEES = {
  [DELIVERY_TYPES.STANDARD]: 50, // NPR
  [DELIVERY_TYPES.EXPRESS]: 100, // NPR
}

// ==================== PRODUCT CATEGORIES ====================
export const CATEGORIES = [
  { id: 'groceries', name: 'Groceries', icon: 'ShoppingBasket' },
  { id: 'vegetables', name: 'Vegetables', icon: 'Salad' },
  { id: 'fruits', name: 'Fruits', icon: 'Apple' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'Milk' },
  { id: 'meat', name: 'Meat & Fish', icon: 'Fish' },
  { id: 'bakery', name: 'Bakery', icon: 'Croissant' },
  { id: 'beverages', name: 'Beverages', icon: 'Coffee' },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie' },
  { id: 'personal-care', name: 'Personal Care', icon: 'Sparkles' },
  { id: 'household', name: 'Household', icon: 'Home' },
  { id: 'baby', name: 'Baby Care', icon: 'Baby' },
  { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
]

// ==================== BUTWAL WARDS ====================
export const BUTWAL_WARDS = Array.from({ length: 19 }, (_, i) => ({
  value: i + 1,
  label: `Ward ${i + 1}`,
  zone: i < 8 ? 'central' : i < 15 ? 'extended' : 'outer',
}))

export const DELIVERY_ZONES = {
  CENTRAL: 'central', // Wards 1-7
  EXTENDED: 'extended', // Wards 8-14
  OUTER: 'outer', // Wards 15-19
}

// ==================== BUSINESS SETTINGS ====================
export const BUSINESS = {
  NAME: 'SARSAR',
  TAGLINE: 'Order now, delivered in 1 hour',
  PHONE: '+977 9821072912',
  EMAIL: 'support@sarsar.com.np',
  WHATSAPP: '9779821072912',
  ADDRESS: 'Butwal, Nepal',
  HOURS: {
    OPEN: '06:00',
    CLOSE: '23:00',
  },
}

export const SOCIAL_MEDIA = {
  INSTAGRAM: 'https://www.instagram.com/_official_sarsar',
  FOUNDER_INSTAGRAM: 'https://www.instagram.com/sharma_vishal_o',
  TIKTOK: '',
  YOUTUBE: '',
  FACEBOOK: '',
}

// ==================== LIMITS & CONSTRAINTS ====================
export const LIMITS = {
  MIN_ORDER_AMOUNT: 100, // NPR
  MAX_CART_ITEMS: 50,
  MAX_PRODUCT_IMAGES: 5,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_ORDER_CANCEL_TIME: 5, // minutes
  MIN_PASSWORD_LENGTH: 8,
  MAX_REVIEW_LENGTH: 500,
  MAX_ADDRESS_COUNT: 5,
}

// ==================== VALIDATION PATTERNS ====================
export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+977)?[0-9]{10}$/,
  NEPAL_PHONE: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  POSTAL_CODE: /^[0-9]{5}$/,
}

// ==================== LOCAL STORAGE KEYS ====================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sarsar_auth_token',
  USER_DATA: 'sarsar_user',
  CART: 'sarsar_cart',
  WISHLIST: 'sarsar_wishlist',
  RECENT_SEARCHES: 'sarsar_recent_searches',
  THEME: 'sarsar_theme',
  LANGUAGE: 'sarsar_language',
}

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please login to continue.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_IN_USE: 'This email is already registered.',
  WEAK_PASSWORD: 'Password must be at least 8 characters.',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  OUT_OF_STOCK: 'This item is currently out of stock.',
  MIN_ORDER: `Minimum order amount is NPR ${LIMITS.MIN_ORDER_AMOUNT}`,
}

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGES = {
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_CANCELLED: 'Order cancelled successfully.',
  PRODUCT_ADDED: 'Product added to cart.',
  PRODUCT_REMOVED: 'Product removed from cart.',
  WISHLIST_ADDED: 'Added to wishlist.',
  WISHLIST_REMOVED: 'Removed from wishlist.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  ADDRESS_SAVED: 'Address saved successfully.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
}

// ==================== SORT OPTIONS ====================
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'discount', label: 'Discount' },
]

// ==================== FILTER OPTIONS ====================
export const PRICE_RANGES = [
  { min: 0, max: 100, label: 'Under NPR 100' },
  { min: 100, max: 500, label: 'NPR 100 - 500' },
  { min: 500, max: 1000, label: 'NPR 500 - 1000' },
  { min: 1000, max: 2000, label: 'NPR 1000 - 2000' },
  { min: 2000, max: null, label: 'Above NPR 2000' },
]

export const RATING_FILTERS = [
  { value: 4, label: '4 Stars & Above' },
  { value: 3, label: '3 Stars & Above' },
  { value: 2, label: '2 Stars & Above' },
  { value: 1, label: '1 Star & Above' },
]

// ==================== NOTIFICATION TYPES ====================
export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: 'order_update',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  REVIEW: 'review',
  LOW_STOCK: 'low_stock',
}

// ==================== DATE FORMATS ====================
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  DISPLAY_TIME: 'MMM dd, yyyy hh:mm a',
  TIME_ONLY: 'hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
}

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  REVIEWS: '/reviews',
  CATEGORIES: '/categories',
  SEARCH: '/search',
  ANALYTICS: '/analytics',
}

// ==================== ANALYTICS EVENTS ====================
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  SHARE: 'share',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
}

// Export all as default for convenience
export default {
  ROUTES,
  USER_ROLES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  DELIVERY_TYPES,
  DELIVERY_TIMES,
  DELIVERY_FEES,
  CATEGORIES,
  BUTWAL_WARDS,
  DELIVERY_ZONES,
  BUSINESS,
  SOCIAL_MEDIA,
  LIMITS,
  VALIDATION,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SORT_OPTIONS,
  PRICE_RANGES,
  RATING_FILTERS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  API_ENDPOINTS,
  ANALYTICS_EVENTS,
}