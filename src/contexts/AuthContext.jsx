import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register new user
  const register = async (email, password, additionalData = {}) => {
    try {
      setError(null);
      setLoading(true);

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name if provided
      if (additionalData.name) {
        await updateProfile(user, {
          displayName: additionalData.name,
        });
      }

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        name: additionalData.name || '',
        phone: additionalData.phone || '',
        role: additionalData.role || 'customer',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Customer-specific fields
        ...(additionalData.role === 'customer' && {
          addresses: [],
          wishlist: [],
          orderCount: 0,
          totalSpent: 0,
        }),
        // Supplier-specific fields
        ...(additionalData.role === 'supplier' && {
          businessName: additionalData.businessName || '',
          businessAddress: additionalData.businessAddress || '',
          verified: false,
          productsCount: 0,
          ordersCount: 0,
          rating: 0,
        }),
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      setUserProfile(userDoc);

      return { success: true, user };
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      });

      return { success: true, user };
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Logout error:', err);
      return { success: false, error: err.message };
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Password reset error:', err);
      return { success: false, error: err.message };
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      // Update Firebase Auth profile if name is changed
      if (updates.name && updates.name !== user.displayName) {
        await updateProfile(user, {
          displayName: updates.name,
        });
      }

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Refresh user profile
      await fetchUserProfile(user.uid);

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Profile update error:', err);
      return { success: false, error: err.message };
    }
  };

  // Change email
  const changeEmail = async (newEmail, currentPassword) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Email change error:', err);
      return { success: false, error: err.message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Password change error:', err);
      return { success: false, error: err.message };
    }
  };

  // Add address
  const addAddress = async (address) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const newAddress = {
        id: Date.now().toString(),
        ...address,
        createdAt: new Date().toISOString(),
      };

      const currentAddresses = userProfile?.addresses || [];
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: [...currentAddresses, newAddress],
        updatedAt: serverTimestamp(),
      });

      await fetchUserProfile(user.uid);
      return { success: true, address: newAddress };
    } catch (err) {
      setError(err.message);
      console.error('Add address error:', err);
      return { success: false, error: err.message };
    }
  };

  // Update address
  const updateAddress = async (addressId, updates) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const currentAddresses = userProfile?.addresses || [];
      const updatedAddresses = currentAddresses.map((addr) =>
        addr.id === addressId ? { ...addr, ...updates } : addr
      );

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp(),
      });

      await fetchUserProfile(user.uid);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Update address error:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const currentAddresses = userProfile?.addresses || [];
      const filteredAddresses = currentAddresses.filter((addr) => addr.id !== addressId);

      await updateDoc(doc(db, 'users', user.uid), {
        addresses: filteredAddresses,
        updatedAt: serverTimestamp(),
      });

      await fetchUserProfile(user.uid);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Delete address error:', err);
      return { success: false, error: err.message };
    }
  };

  // Check if user has role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    // State
    user,
    userProfile,
    loading,
    error,
    
    // Auth methods
    register,
    login,
    logout,
    resetPassword,
    
    // Profile methods
    updateUserProfile,
    changeEmail,
    changePassword,
    
    // Address methods
    addAddress,
    updateAddress,
    deleteAddress,
    
    // Utility methods
    hasRole,
    isAuthenticated,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;