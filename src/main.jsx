// FILE PATH: src/main.jsx
// Application Entry Point - Simplified for build compatibility

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Styles
import './styles/index.css';
import './styles/animations.css';
import './styles/utilities.css';

// Initialize Firebase services (imported but initialized in lib/firebase.js)
import './lib/firebase';

// ==================== RENDER APPLICATION ====================
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ==================== HOT MODULE REPLACEMENT ====================
if (import.meta.hot) {
  import.meta.hot.accept();
}

// ==================== DEVELOPMENT TOOLS ====================
if (import.meta.env.DEV) {
  window.__SARSAR_DEBUG__ = {
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.MODE,
  };
  
  console.log('%c🚀 SARSAR Platform', 'color: #FF6B35; font-size: 20px; font-weight: bold;');
  console.log('%cDevelopment Mode', 'color: #10B981; font-size: 14px;');
}