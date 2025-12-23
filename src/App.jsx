import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout Components (not lazy - always needed)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Loading Component
import LoadingScreen from './components/shared/LoadingScreen';

// Protected Route Component
import ProtectedRoute from './components/shared/ProtectedRoute';

// Lazy load pages with proper error boundaries
const Home = lazy(() => import('./pages/Home').catch(() => ({ default: () => <div>Error loading Home</div> })));
const Shop = lazy(() => import('./pages/Shop').catch(() => ({ default: () => <div>Error loading Shop</div> })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').catch(() => ({ default: () => <div>Error loading Product</div> })));
const Cart = lazy(() => import('./pages/Cart').catch(() => ({ default: () => <div>Error loading Cart</div> })));
const Checkout = lazy(() => import('./pages/Checkout').catch(() => ({ default: () => <div>Error loading Checkout</div> })));

// Auth Pages
const Login = lazy(() => import('./pages/auth/Login').catch(() => ({ default: () => <div>Error loading Login</div> })));
const Register = lazy(() => import('./pages/auth/Register').catch(() => ({ default: () => <div>Error loading Register</div> })));

// Customer Pages
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard').catch(() => ({ default: () => <div>Error loading Dashboard</div> })));
const Orders = lazy(() => import('./pages/customer/Orders').catch(() => ({ default: () => <div>Error loading Orders</div> })));

// Supplier Pages
const SupplierDashboard = lazy(() => import('./pages/supplier/Dashboard').catch(() => ({ default: () => <div>Error loading Supplier Dashboard</div> })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').catch(() => ({ default: () => <div>Error loading Admin Dashboard</div> })));

// Static Pages
const About = lazy(() => import('./pages/static/About').catch(() => ({ default: () => <div>Error loading About</div> })));
const Contact = lazy(() => import('./pages/static/Contact').catch(() => ({ default: () => <div>Error loading Contact</div> })));

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Header />
              
              <main className="flex-grow">
                <Suspense fallback={<LoadingScreen />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Protected Customer Routes */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/customer/dashboard"
                        element={
                          <ProtectedRoute>
                            <CustomerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/customer/orders"
                        element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Supplier Routes */}
                      <Route
                        path="/supplier/dashboard"
                        element={
                          <ProtectedRoute requiredRole="supplier">
                            <SupplierDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Admin Routes */}
                      <Route
                        path="/admin/dashboard"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 - Redirect to home */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </main>

              <Footer />
            </div>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#2D2D2D',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;