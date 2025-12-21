// FILE PATH: src/config/api.config.js
// API Configuration - Base URLs, endpoints, and settings

export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY_EMAIL: '/auth/verify-email',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    
    // User
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
      ADDRESSES: '/user/addresses',
      ORDERS: '/user/orders',
      WISHLIST: '/user/wishlist',
    },
    
    // Products
    PRODUCTS: {
      LIST: '/products',
      DETAIL: '/products/:id',
      SEARCH: '/products/search',
      CATEGORIES: '/products/categories',
      FEATURED: '/products/featured',
      TRENDING: '/products/trending',
    },
    
    // Orders
    ORDERS: {
      CREATE: '/orders',
      LIST: '/orders',
      DETAIL: '/orders/:id',
      TRACK: '/orders/:id/track',
      CANCEL: '/orders/:id/cancel',
      RATE: '/orders/:id/rate',
    },
    
    // Cart
    CART: {
      GET: '/cart',
      ADD: '/cart/add',
      UPDATE: '/cart/update',
      REMOVE: '/cart/remove',
      CLEAR: '/cart/clear',
    },
    
    // Supplier
    SUPPLIER: {
      DASHBOARD: '/supplier/dashboard',
      PRODUCTS: '/supplier/products',
      ORDERS: '/supplier/orders',
      INVENTORY: '/supplier/inventory',
      ANALYTICS: '/supplier/analytics',
    },
    
    // Admin
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      PRODUCTS: '/admin/products',
      ORDERS: '/admin/orders',
      SUPPLIERS: '/admin/suppliers',
      ANALYTICS: '/admin/analytics',
      SETTINGS: '/admin/settings',
    },
    
    // Payment
    PAYMENT: {
      INITIALIZE: '/payment/initialize',
      VERIFY: '/payment/verify',
      WEBHOOK: '/payment/webhook',
    },
    
    // Upload
    UPLOAD: {
      IMAGE: '/upload/image',
      DOCUMENT: '/upload/document',
    },
    
    // Notifications
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: '/notifications/:id/read',
      MARK_ALL_READ: '/notifications/read-all',
    },
  },
  
  // Request Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Error Codes
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  
  // Retry Configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    RETRY_CODES: [408, 429, 500, 502, 503, 504],
  },
};

export default API_CONFIG;