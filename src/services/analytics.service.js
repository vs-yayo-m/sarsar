//=== === === === === === === === === === === === === === === === === === === ==
// FILE PATH: src/services/analytics.service.js
// ============================================================
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/config/firebase';

export const analyticsService = {
  // Track page view
  trackPageView(pageName, pageParams = {}) {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: pageName,
        ...pageParams,
      });
    }
  },
  
  // Track event
  trackEvent(eventName, eventParams = {}) {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  },
  
  // E-commerce events
  trackProductView(product) {
    this.trackEvent('view_item', {
      items: [product],
    });
  },
  
  trackAddToCart(product) {
    this.trackEvent('add_to_cart', {
      items: [product],
      value: product.price,
    });
  },
  
  trackPurchase(order) {
    this.trackEvent('purchase', {
      transaction_id: order.id,
      value: order.total,
      items: order.items,
    });
  },
};

export default analyticsService;