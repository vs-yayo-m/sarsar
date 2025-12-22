import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */

// User registration
export const registerUser = async (email, password, additionalData = {}) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    if (additionalData.name) {
      await updateProfile(user, {
        displayName: additionalData.name,
      });
    }

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      name: additionalData.name || '',
      phone: additionalData.phone || '',
      role: additionalData.role || 'customer',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      
      // Customer fields
      ...(additionalData.role === 'customer' && {
        addresses: [],
        wishlist: [],
        orderCount: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
      }),
      
      // Supplier fields
      ...(additionalData.role === 'supplier' && {
        businessName: additionalData.businessName || '',
        businessAddress: additionalData.businessAddress || '',
        businessPhone: additionalData.businessPhone || '',
        verified: false,
        productsCount: 0,
        ordersCount: 0,
        rating: 0,
        reviewCount: 0,
      }),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return {
      success: true,
      user: user,
      message: 'Registration successful! Please verify your email.',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// User login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp(),
    });

    return {
      success: true,
      user: user,
      message: 'Login successful!',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'customer',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        addresses: [],
        wishlist: [],
        orderCount: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
      });
    } else {
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      });
    }

    return {
      success: true,
      user: user,
      message: 'Signed in with Google successfully!',
    };
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'customer',
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        addresses: [],
        wishlist: [],
        orderCount: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
      });
    } else {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
      });
    }

    return {
      success: true,
      user: user,
      message: 'Signed in with Facebook successfully!',
    };
  } catch (error) {
    console.error('Facebook sign in error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// User logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Logged out successfully!',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Password reset
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Resend email verification
export const resendEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    await sendEmailVerification(user);
    return {
      success: true,
      message: 'Verification email sent!',
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Update Firebase Auth profile
    if (updates.name || updates.photoURL) {
      await updateProfile(user, {
        ...(updates.name && { displayName: updates.name }),
        ...(updates.photoURL && { photoURL: updates.photoURL }),
      });
    }

    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Change user email
export const changeUserEmail = async (newEmail, currentPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Reauthenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update email
    await updateEmail(user, newEmail);

    // Send verification to new email
    await sendEmailVerification(user);

    // Update Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail,
      emailVerified: false,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: 'Email updated! Please verify your new email.',
    };
  } catch (error) {
    console.error('Email change error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Change user password
export const changeUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Reauthenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: 'Password changed successfully!',
    };
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Delete user account
export const deleteUserAccount = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Reauthenticate
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete Firestore document
    await deleteDoc(doc(db, 'users', user.uid));

    // Delete user from Auth
    await deleteUser(user);

    return {
      success: true,
      message: 'Account deleted successfully.',
    };
  } catch (error) {
    console.error('Account deletion error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Get user profile
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data(),
      };
    } else {
      return {
        success: false,
        message: 'User not found',
      };
    }
  } catch (error) {
    console.error('Get profile error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code),
    };
  }
};

// Check if email exists
export const checkEmailExists = async (email) => {
  try {
    // This is a workaround since Firebase doesn't have a direct method
    // We try to send a password reset email
    await sendPasswordResetEmail(auth, email);
    return { exists: true };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return { exists: false };
    }
    return { exists: false, error: error.code };
  }
};

// Get error messages
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
    'auth/invalid-credential': 'Invalid credentials provided',
    'auth/account-exists-with-different-credential': 'Account exists with different sign-in method',
    'auth/popup-blocked': 'Popup was blocked by browser',
    'auth/popup-closed-by-user': 'Popup was closed before completion',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
};

export default {
  registerUser,
  loginUser,
  signInWithGoogle,
  signInWithFacebook,
  logoutUser,
  resetUserPassword,
  resendEmailVerification,
  updateUserProfile,
  changeUserEmail,
  changeUserPassword,
  deleteUserAccount,
  getUserProfile,
  checkEmailExists,
};