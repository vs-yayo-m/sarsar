// FILE PATH: src/lib/firebase.js
// Firebase Initialization and Service Exports

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Import firebaseConfig from config directory
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production and browser environment)
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD ?
  getAnalytics(app) :
  null;

// Export initialized app as default
export default app;