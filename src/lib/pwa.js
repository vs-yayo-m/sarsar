// FILE PATH: src/lib/pwa.js
// PWA Service Worker Registration and Management

/**
 * Register service worker for PWA functionality
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('✅ Service Worker registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('🔄 New version available! Refresh to update.');
            showUpdateNotification();
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('⚠️ Service Workers not supported');
    return null;
  }
};

/**
 * Unregister service worker
 */
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('✅ Service Worker unregistered');
  }
};

/**
 * Show update notification
 */
const showUpdateNotification = () => {
  // You can use your toast/notification system here
  if (confirm('New version available! Reload to update?')) {
    window.location.reload();
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      return true;
    } else {
      console.log('❌ Notification permission denied');
      return false;
    }
  }
  
  return false;
};

/**
 * Show local notification
 */
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo-192.png',
      badge: '/logo-192.png',
      ...options,
    });
  }
};

/**
 * Check if app is installed
 */
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
};

/**
 * Prompt to install PWA
 */
let deferredPrompt;

export const initInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('✅ Install prompt ready');
  });
};

export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    console.log('❌ Install prompt not available');
    return false;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} install prompt`);
  
  deferredPrompt = null;
  return outcome === 'accepted';
};

// Initialize install prompt listener
if (typeof window !== 'undefined') {
  initInstallPrompt();
}