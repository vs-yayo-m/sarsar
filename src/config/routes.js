/**
 * Application Routes Configuration
 * Centralized route definitions for the entire SARSAR platform
 */

// Public routes (accessible without authentication)
export const PUBLIC_ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT_DETAIL: '/product/:id',
  CATEGORY: '/category/:category',
  SEARCH: '/search',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  HOW_IT_WORKS: '/how-it-works',
  TERMS: '/terms',
  PRIVACY: '/privacy',
};

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  SUPPLIER_REGISTER: '/register/supplier',
};

// Customer routes (requires customer authentication)
export const CUSTOMER_ROUTES = {
  DASHBOARD: '/customer/dashboard',
  ORDERS: '/customer/orders',
  ORDER_DETAIL: '/customer/orders/:id',
  ORDER_TRACKING: '/customer/orders/:id/track',
  ADDRESSES: '/customer/addresses',
  WISHLIST: '/customer/wishlist',
  PROFILE: '/customer/profile',
  SETTINGS: '/customer/settings',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success/:id',
};

// Supplier routes (requires supplier authentication)
export const SUPPLIER_ROUTES = {
  DASHBOARD: '/supplier/dashboard',
  PRODUCTS: '/supplier/products',
  PRODUCT_ADD: '/supplier/products/add',
  PRODUCT_EDIT: '/supplier/products/:id/edit',
  ORDERS: '/supplier/orders',
  ORDER_DETAIL: '/supplier/orders/:id',
  INVENTORY: '/supplier/inventory',
  ANALYTICS: '/supplier/analytics',
  SETTINGS: '/supplier/settings',
  PROFILE: '/supplier/profile',
};

// Admin routes (requires admin authentication)
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  ORDERS: '/admin/orders',
  ORDER_DETAIL: '/admin/orders/:id',
  PRODUCTS: '/admin/products',
  PRODUCT_DETAIL: '/admin/products/:id',
  CUSTOMERS: '/admin/customers',
  CUSTOMER_DETAIL: '/admin/customers/:id',
  SUPPLIERS: '/admin/suppliers',
  SUPPLIER_DETAIL: '/admin/suppliers/:id',
  FINANCIAL: '/admin/financial',
  ANALYTICS: '/admin/analytics',
  MARKETING: '/admin/marketing',
  SETTINGS: '/admin/settings',
  USERS: '/admin/users',
  REPORTS: '/admin/reports',
};

// All routes combined
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...CUSTOMER_ROUTES,
  ...SUPPLIER_ROUTES,
  ...ADMIN_ROUTES,
};

// Route groups for role-based access control
export const ROUTE_GROUPS = {
  PUBLIC: Object.values(PUBLIC_ROUTES),
  AUTH: Object.values(AUTH_ROUTES),
  CUSTOMER: Object.values(CUSTOMER_ROUTES),
  SUPPLIER: Object.values(SUPPLIER_ROUTES),
  ADMIN: Object.values(ADMIN_ROUTES),
};

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ...Object.values(CUSTOMER_ROUTES),
  ...Object.values(SUPPLIER_ROUTES),
  ...Object.values(ADMIN_ROUTES),
];

// Routes accessible only to unauthenticated users
export const GUEST_ONLY_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.SUPPLIER_REGISTER,
];

// Role-based route mapping
export const ROLE_ROUTES = {
  customer: CUSTOMER_ROUTES,
  supplier: SUPPLIER_ROUTES,
  admin: ADMIN_ROUTES,
};

// Default dashboard routes for each role
export const DEFAULT_DASHBOARD = {
  customer: CUSTOMER_ROUTES.DASHBOARD,
  supplier: SUPPLIER_ROUTES.DASHBOARD,
  admin: ADMIN_ROUTES.DASHBOARD,
  guest: PUBLIC_ROUTES.HOME,
};

// Route helpers
export const getRouteByRole = (role) => {
  return ROLE_ROUTES[role] || PUBLIC_ROUTES;
};

export const getDefaultRoute = (role) => {
  return DEFAULT_DASHBOARD[role] || PUBLIC_ROUTES.HOME;
};

export const isPublicRoute = (path) => {
  return ROUTE_GROUPS.PUBLIC.includes(path) || ROUTE_GROUPS.AUTH.includes(path);
};

export const isProtectedRoute = (path) => {
  return PROTECTED_ROUTES.some((route) => {
    // Handle dynamic routes (e.g., /product/:id)
    const regex = new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`);
    return regex.test(path);
  });
};

export const isGuestOnlyRoute = (path) => {
  return GUEST_ONLY_ROUTES.includes(path);
};

export const canAccessRoute = (path, userRole) => {
  // Public routes accessible to all
  if (isPublicRoute(path)) return true;
  
  // Auth routes only for guests
  if (isGuestOnlyRoute(path) && !userRole) return true;
  
  // Role-specific routes
  const roleRoutes = getRouteByRole(userRole);
  return Object.values(roleRoutes).some((route) => {
    const regex = new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`);
    return regex.test(path);
  });
};

// Route navigation helpers
export const buildProductDetailRoute = (productId) => {
  return PUBLIC_ROUTES.PRODUCT_DETAIL.replace(':id', productId);
};

export const buildCategoryRoute = (category) => {
  return PUBLIC_ROUTES.CATEGORY.replace(':category', category);
};

export const buildOrderDetailRoute = (orderId, role = 'customer') => {
  const routes = {
    customer: CUSTOMER_ROUTES.ORDER_DETAIL,
    supplier: SUPPLIER_ROUTES.ORDER_DETAIL,
    admin: ADMIN_ROUTES.ORDER_DETAIL,
  };
  return routes[role]?.replace(':id', orderId) || '#';
};

export const buildOrderTrackingRoute = (orderId) => {
  return CUSTOMER_ROUTES.ORDER_TRACKING.replace(':id', orderId);
};

export const buildProductEditRoute = (productId) => {
  return SUPPLIER_ROUTES.PRODUCT_EDIT.replace(':id', productId);
};

export const buildCustomerDetailRoute = (customerId) => {
  return ADMIN_ROUTES.CUSTOMER_DETAIL.replace(':id', customerId);
};

export const buildSupplierDetailRoute = (supplierId) => {
  return ADMIN_ROUTES.SUPPLIER_DETAIL.replace(':id', supplierId);
};

export const buildOrderSuccessRoute = (orderId) => {
  return CUSTOMER_ROUTES.ORDER_SUCCESS.replace(':id', orderId);
};

// Breadcrumb helpers
export const getBreadcrumbs = (path, params = {}) => {
  const breadcrumbs = [{ label: 'Home', path: PUBLIC_ROUTES.HOME }];
  
  // Split path and build breadcrumbs
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Replace dynamic params
    let label = segment;
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      label = params[paramName] || segment;
    }
    
    // Capitalize and format label
    label = label
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      path: currentPath,
      isActive: index === segments.length - 1,
    });
  });
  
  return breadcrumbs;
};

// Navigation menu structure
export const NAVIGATION_MENU = {
  customer: [
    { label: 'Dashboard', path: CUSTOMER_ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'My Orders', path: CUSTOMER_ROUTES.ORDERS, icon: 'ShoppingBag' },
    { label: 'Wishlist', path: CUSTOMER_ROUTES.WISHLIST, icon: 'Heart' },
    { label: 'Addresses', path: CUSTOMER_ROUTES.ADDRESSES, icon: 'MapPin' },
    { label: 'Profile', path: CUSTOMER_ROUTES.PROFILE, icon: 'User' },
    { label: 'Settings', path: CUSTOMER_ROUTES.SETTINGS, icon: 'Settings' },
  ],
  supplier: [
    { label: 'Dashboard', path: SUPPLIER_ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Products', path: SUPPLIER_ROUTES.PRODUCTS, icon: 'Package' },
    { label: 'Orders', path: SUPPLIER_ROUTES.ORDERS, icon: 'ShoppingCart' },
    { label: 'Inventory', path: SUPPLIER_ROUTES.INVENTORY, icon: 'Archive' },
    { label: 'Analytics', path: SUPPLIER_ROUTES.ANALYTICS, icon: 'BarChart3' },
    { label: 'Settings', path: SUPPLIER_ROUTES.SETTINGS, icon: 'Settings' },
  ],
  admin: [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Orders', path: ADMIN_ROUTES.ORDERS, icon: 'ShoppingCart' },
    { label: 'Products', path: ADMIN_ROUTES.PRODUCTS, icon: 'Package' },
    { label: 'Customers', path: ADMIN_ROUTES.CUSTOMERS, icon: 'Users' },
    { label: 'Suppliers', path: ADMIN_ROUTES.SUPPLIERS, icon: 'Store' },
    { label: 'Financial', path: ADMIN_ROUTES.FINANCIAL, icon: 'DollarSign' },
    { label: 'Analytics', path: ADMIN_ROUTES.ANALYTICS, icon: 'TrendingUp' },
    { label: 'Marketing', path: ADMIN_ROUTES.MARKETING, icon: 'Megaphone' },
    { label: 'Settings', path: ADMIN_ROUTES.SETTINGS, icon: 'Settings' },
  ],
};

export const getNavigationMenu = (role) => {
  return NAVIGATION_MENU[role] || [];
};

// Quick access routes
export const QUICK_ACCESS = {
  customer: [
    { label: 'Track Order', path: CUSTOMER_ROUTES.ORDERS, icon: 'MapPin' },
    { label: 'Reorder', path: CUSTOMER_ROUTES.ORDERS, icon: 'RefreshCw' },
    { label: 'Support', path: PUBLIC_ROUTES.CONTACT, icon: 'HelpCircle' },
  ],
  supplier: [
    { label: 'Add Product', path: SUPPLIER_ROUTES.PRODUCT_ADD, icon: 'Plus' },
    { label: 'View Orders', path: SUPPLIER_ROUTES.ORDERS, icon: 'Eye' },
    { label: 'Check Inventory', path: SUPPLIER_ROUTES.INVENTORY, icon: 'Package' },
  ],
  admin: [
    { label: 'All Orders', path: ADMIN_ROUTES.ORDERS, icon: 'List' },
    { label: 'Reports', path: ADMIN_ROUTES.REPORTS, icon: 'FileText' },
    { label: 'Users', path: ADMIN_ROUTES.USERS, icon: 'Users' },
  ],
};

export default ROUTES;