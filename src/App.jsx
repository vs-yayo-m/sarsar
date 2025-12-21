// FILE PATH: src/App.jsx
// Main Application Component - Routes and Global Layout

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchProvider } from '@/contexts/SearchContext';

// Shared Components
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import LoadingScreen from '@/components/shared/LoadingScreen';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

// Layout Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Lazy load pages for better performance
// Public Pages
const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Search = lazy(() => import('@/pages/Search'));
const Category = lazy(() => import('@/pages/Category'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));

// Customer Pages
const CustomerDashboard = lazy(() => import('@/pages/customer/Dashboard'));
const CustomerOrders = lazy(() => import('@/pages/customer/Orders'));
const CustomerOrderDetail = lazy(() => import('@/pages/customer/OrderDetail'));
const CustomerAddresses = lazy(() => import('@/pages/customer/Addresses'));
const CustomerWishlist = lazy(() => import('@/pages/customer/Wishlist'));
const CustomerProfile = lazy(() => import('@/pages/customer/Profile'));
const CustomerSettings = lazy(() => import('@/pages/customer/Settings'));

// Supplier Pages
const SupplierDashboard = lazy(() => import('@/pages/supplier/Dashboard'));
const SupplierProducts = lazy(() => import('@/pages/supplier/Products'));
const SupplierOrders = lazy(() => import('@/pages/supplier/Orders'));
const SupplierInventory = lazy(() => import('@/pages/supplier/Inventory'));
const SupplierAnalytics = lazy(() => import('@/pages/supplier/Analytics'));
const SupplierSettings = lazy(() => import('@/pages/supplier/Settings'));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminCustomers = lazy(() => import('@/pages/admin/Customers'));
const AdminSuppliers = lazy(() => import('@/pages/admin/Suppliers'));
const AdminFinancial = lazy(() => import('@/pages/admin/Financial'));
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminMarketing = lazy(() => import('@/pages/admin/Marketing'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

// Static Pages
const About = lazy(() => import('@/pages/static/About'));
const Contact = lazy(() => import('@/pages/static/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/static/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/static/Terms'));
const FAQ = lazy(() => import('@/pages/static/FAQ'));
const HowItWorks = lazy(() => import('@/pages/static/HowItWorks'));

// 404 Page
const NotFound = lazy(() => import('@/components/shared/NotFound'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <NotificationProvider>
                <SearchProvider>
                  <div className="app min-h-screen bg-gray-50 flex flex-col">
                    {/* Global Toast Notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#FFFFFF',
                          color: '#2D2D2D',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          padding: '16px',
                        },
                        success: {
                          iconTheme: {
                            primary: '#10B981',
                            secondary: '#FFFFFF',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: '#EF4444',
                            secondary: '#FFFFFF',
                          },
                        },
                      }}
                    />

                    {/* Header (shown on all pages) */}
                    <Header />

                    {/* Main Content Area with Suspense for lazy loading */}
                    <main className="flex-grow">
                      <Suspense fallback={<LoadingScreen />}>
                        <AnimatePresence mode="wait">
                          <Routes>
                            {/* ==================== PUBLIC ROUTES ==================== */}
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/category/:categoryName" element={<Category />} />

                            {/* ==================== AUTH ROUTES ==================== */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/verify-email" element={<VerifyEmail />} />

                            {/* ==================== CHECKOUT ROUTES ==================== */}
                            <Route
                              path="/checkout"
                              element={
                                <ProtectedRoute>
                                  <Checkout />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/order-success/:orderId"
                              element={
                                <ProtectedRoute>
                                  <OrderSuccess />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/track-order/:orderId"
                              element={
                                <ProtectedRoute>
                                  <OrderTracking />
                                </ProtectedRoute>
                              }
                            />

                            {/* ==================== CUSTOMER ROUTES ==================== */}
                            <Route
                              path="/customer/dashboard"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/orders"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerOrders />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/orders/:orderId"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerOrderDetail />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/addresses"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerAddresses />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/wishlist"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerWishlist />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/profile"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerProfile />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/customer/settings"
                              element={
                                <ProtectedRoute requiredRole="customer">
                                  <CustomerSettings />
                                </ProtectedRoute>
                              }
                            />

                            {/* ==================== SUPPLIER ROUTES ==================== */}
                            <Route
                              path="/supplier/dashboard"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/supplier/products"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierProducts />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/supplier/orders"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierOrders />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/supplier/inventory"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierInventory />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/supplier/analytics"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierAnalytics />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/supplier/settings"
                              element={
                                <ProtectedRoute requiredRole="supplier">
                                  <SupplierSettings />
                                </ProtectedRoute>
                              }
                            />

                            {/* ==================== ADMIN ROUTES ==================== */}
                            <Route
                              path="/admin/dashboard"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminDashboard />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/orders"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminOrders />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/products"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminProducts />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/customers"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminCustomers />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/suppliers"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminSuppliers />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/financial"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminFinancial />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/analytics"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminAnalytics />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/marketing"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminMarketing />
                                </ProtectedRoute>
                              }
                            />
                            <Route
                              path="/admin/settings"
                              element={
                                <ProtectedRoute requiredRole="admin">
                                  <AdminSettings />
                                </ProtectedRoute>
                              }
                            />

                            {/* ==================== STATIC PAGES ==================== */}
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/how-it-works" element={<HowItWorks />} />

                            {/* ==================== 404 & REDIRECTS ==================== */}
                            <Route path="/404" element={<NotFound />} />
                            <Route path="*" element={<Navigate to="/404" replace />} />
                          </Routes>
                        </AnimatePresence>
                      </Suspense>
                    </main>

                    {/* Footer (shown on all pages) */}
                    <Footer />
                  </div>
                </SearchProvider>
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;