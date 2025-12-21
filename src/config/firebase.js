// Firebase Configuration for SARSAR Platform
// Initializes Firebase and exports auth & db

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase configuration (dev only)
const validateConfig = () => {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId']
  const missing = required.filter((key) => !firebaseConfig[key])

  if (missing.length > 0) {
    console.warn(`⚠️ Missing Firebase config: ${missing.join(', ')}`)
    console.warn('⚠️ Check your .env or Netlify environment variables')
    return false
  }
  return true
}

if (import.meta.env.DEV) {
  validateConfig()
}

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig)

// 🔐 Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app