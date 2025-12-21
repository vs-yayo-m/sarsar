import { useContext } from 'react';
import AuthContext from '@/contexts/AuthContext';

/**
 * Custom hook to access authentication context
 * Provides all auth methods and state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (role) => {
  const { userProfile } = useAuth();
  return userProfile?.role === role;
};

/**
 * Hook to check if user is customer
 */
export const useIsCustomer = () => {
  return useHasRole('customer');
};

/**
 * Hook to check if user is supplier
 */
export const useIsSupplier = () => {
  return useHasRole('supplier');
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  return useHasRole('admin');
};

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const { user, loading } = useAuth();
  const navigate = typeof window !== 'undefined' ? window.location : null;
  
  if (!loading && !user && navigate) {
    navigate.href = redirectTo;
  }
  
  return { user, loading };
};

/**
 * Hook to require specific role
 * Redirects if user doesn't have the role
 */
export const useRequireRole = (role, redirectTo = '/') => {
  const { userProfile, loading } = useAuth();
  const navigate = typeof window !== 'undefined' ? window.location : null;
  
  if (!loading && userProfile?.role !== role && navigate) {
    navigate.href = redirectTo;
  }
  
  return { userProfile, loading };
};

/**
 * Hook to get user's default address
 */
export const useDefaultAddress = () => {
  const { userProfile } = useAuth();
  const addresses = userProfile?.addresses || [];
  return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
};

/**
 * Hook to get user's addresses
 */
export const useAddresses = () => {
  const { userProfile } = useAuth();
  return userProfile?.addresses || [];
};

/**
 * Hook to get user's wishlist
 */
export const useWishlist = () => {
  const { userProfile } = useAuth();
  return userProfile?.wishlist || [];
};

/**
 * Hook to check if product is in wishlist
 */
export const useIsInWishlist = (productId) => {
  const wishlist = useWishlist();
  return wishlist.includes(productId);
};

/**
 * Hook to get user's order statistics
 */
export const useOrderStats = () => {
  const { userProfile } = useAuth();
  return {
    orderCount: userProfile?.orderCount || 0,
    totalSpent: userProfile?.totalSpent || 0,
  };
};

/**
 * Hook to get supplier's business info
 */
export const useSupplierInfo = () => {
  const { userProfile } = useAuth();
  
  if (userProfile?.role !== 'supplier') {
    return null;
  }
  
  return {
    businessName: userProfile.businessName,
    businessAddress: userProfile.businessAddress,
    verified: userProfile.verified,
    productsCount: userProfile.productsCount,
    ordersCount: userProfile.ordersCount,
    rating: userProfile.rating,
  };
};

/**
 * Hook to check if supplier is verified
 */
export const useIsVerifiedSupplier = () => {
  const supplierInfo = useSupplierInfo();
  return supplierInfo?.verified || false;
};

/**
 * Hook to handle auth errors
 */
export const useAuthError = () => {
  const { error } = useAuth();
  
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Check your connection',
      'auth/requires-recent-login': 'Please log in again to continue',
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again';
  };
  
  return {
    error,
    errorMessage: error ? getErrorMessage(error) : null,
    hasError: !!error,
  };
};

/**
 * Hook to get user's display name
 */
export const useUserDisplayName = () => {
  const { user, userProfile } = useAuth();
  return userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
};

/**
 * Hook to get user's initials
 */
export const useUserInitials = () => {
  const displayName = useUserDisplayName();
  const names = displayName.split(' ');
  
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  
  return displayName.substring(0, 2).toUpperCase();
};

/**
 * Hook to check if user profile is complete
 */
export const useIsProfileComplete = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile) return false;
  
  const requiredFields = ['name', 'email', 'phone'];
  return requiredFields.every((field) => userProfile[field]);
};

/**
 * Hook to get user's role label
 */
export const useRoleLabel = () => {
  const { userProfile } = useAuth();
  
  const roleLabels = {
    customer: 'Customer',
    supplier: 'Supplier',
    admin: 'Administrator',
  };
  
  return roleLabels[userProfile?.role] || 'User';
};

/**
 * Hook to format user's join date
 */
export const useJoinDate = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile?.createdAt) return null;
  
  const date = userProfile.createdAt.toDate?.() || new Date(userProfile.createdAt);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Hook to check if user can perform action
 */
export const useCanPerformAction = (action) => {
  const { userProfile } = useAuth();
  
  const permissions = {
    customer: ['browse', 'order', 'review', 'wishlist'],
    supplier: ['browse', 'order', 'manage_products', 'fulfill_orders', 'view_analytics'],
    admin: ['browse', 'order', 'manage_products', 'fulfill_orders', 'view_analytics', 'manage_users', 'manage_platform'],
  };
  
  const userPermissions = permissions[userProfile?.role] || [];
  return userPermissions.includes(action);
};

/**
 * Hook for auth loading state
 */
export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};

/**
 * Hook to get complete user data
 */
export const useUserData = () => {
  const { user, userProfile, loading } = useAuth();
  
  return {
    user,
    profile: userProfile,
    loading,
    isAuthenticated: !!user,
    role: userProfile?.role,
    displayName: userProfile?.name || user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
  };
};

export default useAuth;