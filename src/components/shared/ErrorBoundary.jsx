// FILE PATH: src/components/shared/ErrorBoundary.jsx
// Error Boundary Component - Shows actual error details

import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }
  
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));
    
    // Log error details
    console.error('❌ Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Error Stack:', error.stack);
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
  
  handleReload = () => {
    window.location.reload();
  };
  
  handleGoHome = () => {
    window.location.href = '/';
  };
  
  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children } = this.props;
    
    if (!hasError) {
      return children;
    }
    
    // Critical error (too many errors)
    if (errorCount > 5) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-6">
              Multiple errors detected. Please reload the page.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    // Regular error display WITH DETAILS
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full"
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-gray-600">
              We encountered an unexpected error.
            </p>
          </div>

          {/* SHOW ACTUAL ERROR - ALWAYS VISIBLE */}
          <div className="mb-8 bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Error Details:
            </h3>
            <pre className="text-xs text-red-700 overflow-x-auto whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
              {error?.toString() || 'Unknown error'}
            </pre>
            
            {error?.stack && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-red-900">
                  Stack Trace (click to expand)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                  {error.stack}
                </pre>
              </details>
            )}

            {errorInfo?.componentStack && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-red-900">
                  Component Stack (click to expand)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-x-auto whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Page
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={this.handleGoHome}
              className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-md border-2 border-gray-200"
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Error ID: {Date.now()} | SARSAR Platform v1.0
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contact support:{' '}
              <a
                href="mailto:support@sarsar.com.np"
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                support@sarsar.com.np
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
}

export default ErrorBoundary;