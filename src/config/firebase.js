// Firebase Configuration for SARSAR Platform
// This file initializes Firebase with environment variables

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase configuration
const validateConfig = () => {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId']
  const missing = required.filter(key => !firebaseConfig[key])
  
  if (missing.length > 0) {
    console.error(`Missing Firebase config: ${missing.join(', ')}`)
    console.error('Please check your .env.local file')
    return false
  }
  return true
}

// Only validate in development
if (import.meta.env.DEV) {
  validateConfig()
}
export const db = getFirestore(app);
export default firebaseConfig