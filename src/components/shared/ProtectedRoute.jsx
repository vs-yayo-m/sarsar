// File: src/components/shared/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import Spinner from '@/components/ui/Spinner';

/**
 * ProtectedRoute Component
 * Protects routes that require authentication
 */
const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = ROUTES.LOGIN }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
  
  // Check if user has required role
  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const userDashboard = {
      customer: ROUTES.CUSTOMER_DASHBOARD,
      supplier: ROUTES.SUPPLIER_DASHBOARD,
      admin: ROUTES.ADMIN_DASHBOARD,
    };
    
    return <Navigate to={userDashboard[userProfile?.role] || ROUTES.HOME} replace />;
  }
  
  // User is authenticated and has correct role
  return <>{children}</>;
};

/**
 * GuestRoute Component
 * Redirects authenticated users away from guest-only pages (login, register)
 */
export const GuestRoute = ({ children, redirectTo = ROUTES.HOME }) => {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }
  
  // Redirect authenticated users to their dashboard
  if (user) {
    const userDashboard = {
      customer: ROUTES.CUSTOMER_DASHBOARD,
      supplier: ROUTES.SUPPLIER_DASHBOARD,
      admin: ROUTES.ADMIN_DASHBOARD,
    };
    
    const destination = userDashboard[userProfile?.role] || redirectTo;
    return <Navigate to={destination} replace />;
  }
  
  return <>{children}</>;
};

/**
 * RoleBasedRoute Component
 * More flexible role-based protection with multiple allowed roles
 */
export const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = ROUTES.HOME
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile?.role)) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
};

/**
 * EmailVerifiedRoute Component
 * Requires email verification
 */
export const EmailVerifiedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!user.emailVerified) {
    return <Navigate to={ROUTES.VERIFY_EMAIL} replace />;
  }
  
  return <>{children}</>;
};

/**
 * AdminRoute Component
 * Shorthand for admin-only routes
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath={ROUTES.HOME}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * SupplierRoute Component
 * Shorthand for supplier-only routes
 */
export const SupplierRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="supplier" fallbackPath={ROUTES.HOME}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * CustomerRoute Component
 * Shorthand for customer-only routes
 */
export const CustomerRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="customer" fallbackPath={ROUTES.HOME}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * ConditionalRoute Component
 * Custom condition-based routing
 */
export const ConditionalRoute = ({
  children,
  condition,
  fallbackPath = ROUTES.HOME,
  loadingComponent = null
}) => {
  const { loading } = useAuth();
  
  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="xl" />
      </div>
    );
  }
  
  if (!condition) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;