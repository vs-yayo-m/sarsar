// ============================================================
// FILE PATH: src/lib/analytics.js
// ============================================================
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { app } from '@/lib/firebase';

let analytics = null;

// Initialize analytics
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  analytics = getAnalytics(app);
}

export const analyticsLib = {
  // Initialize user
  setUser(userId, properties = {}) {
    if (analytics) {
      setUserId(analytics, userId);
      setUserProperties(analytics, properties);
    }
  },

  // Track event
  track(eventName, params = {}) {
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  },

  // Page view
  pageView(pageName) {
    this.track('page_view', { page_title: pageName });
  },
};

export default analyticsLib;
