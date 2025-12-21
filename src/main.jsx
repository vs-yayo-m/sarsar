// FILE PATH: src/main.jsx
// Application Entry Point - Initializes React and Global Services

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Styles
import './styles/index.css';
import './styles/animations.css';
import './styles/utilities.css';

// Firebase Initialization
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@/config/firebase';

// Performance Monitoring
import { getPerformance } from 'firebase/performance';

// Service Worker for PWA
import { registerServiceWorker } from '@/lib/pwa';

// Error Tracking (Sentry - optional, uncomment if using)
// import * as Sentry from '@sentry/react';
// import { BrowserTracing } from '@sentry/tracing';

// ==================== INITIALIZE FIREBASE ====================
let app;
let analytics;
let performance;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
  
  // Initialize Analytics (only in production)
  if (import.meta.env.PROD) {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  }
  
  // Initialize Performance Monitoring
  performance = getPerformance(app);
  console.log('✅ Firebase Performance Monitoring initialized');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// ==================== INITIALIZE ERROR TRACKING ====================
// Uncomment and configure if using Sentry
/*
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: import.meta.env.MODE,
  });
  console.log('✅ Sentry error tracking initialized');
}
*/

// ==================== PERFORMANCE MONITORING ====================
// Log performance metrics in development
if (import.meta.env.DEV) {
  // Log First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`⚡ ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
    }
  });
  
  observer.observe({ entryTypes: ['paint', 'navigation'] });
}

// ==================== REGISTER SERVICE WORKER ====================
// Register service worker for PWA functionality (production only)
if (import.meta.env.PROD) {
  registerServiceWorker()
    .then(() => {
      console.log('✅ Service Worker registered successfully');
    })
    .catch((error) => {
      console.error('❌ Service Worker registration failed:', error);
    });
}

// ==================== GLOBAL ERROR HANDLER ====================
// Catch unhandled errors
window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
  
  // Log to analytics or error tracking service
  if (analytics) {
    // Log error to Firebase Analytics
    // logEvent(analytics, 'exception', {
    //   description: event.error.message,
    //   fatal: false,
    // });
  }
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  
  // Prevent the default handling (which would log to console)
  event.preventDefault();
});

// ==================== RENDER APPLICATION ====================
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ==================== HOT MODULE REPLACEMENT ====================
// Enable HMR in development
if (import.meta.hot) {
  import.meta.hot.accept();
}

// ==================== DEVELOPMENT TOOLS ====================
// Expose useful debug info in development
if (import.meta.env.DEV) {
  window.__SARSAR_DEBUG__ = {
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.MODE,
    firebase: {
      projectId: firebaseConfig.projectId,
      appId: firebaseConfig.appId,
    },
  };
  
  console.log('%c🚀 SARSAR Platform', 'color: #FF6B35; font-size: 20px; font-weight: bold;');
  console.log('%cDevelopment Mode', 'color: #10B981; font-size: 14px;');
  console.log('Debug info available at: window.__SARSAR_DEBUG__');
}

 

// ==================== ANALYTICS TRACKING ====================
// Track page views (uncomment when analytics is set up)
/*
import { logEvent } from 'firebase/analytics';

if (analytics) {
  // Track initial page load
  logEvent(analytics, 'page_view', {
    page_path: window.location.pathname,
    page_title: document.title,
  });
}
*/

// ==================== EXPORT FOR TESTING ====================
export { app, analytics, performance };