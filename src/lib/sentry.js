// ============================================================
// FILE PATH: src/lib/sentry.js
// ============================================================
// Sentry Error Tracking (placeholder - install @sentry/react if needed)
export const sentryLib = {
  init() {
    // Placeholder for Sentry initialization
    console.log('Sentry would be initialized here');
  },
  
  captureException(error, context = {}) {
    console.error('Error captured:', error, context);
    // Sentry.captureException(error, { extra: context });
  },
  
  captureMessage(message, level = 'info') {
    console.log(`[${level}] ${message}`);
    // Sentry.captureMessage(message, level);
  },
};

export default sentryLib;