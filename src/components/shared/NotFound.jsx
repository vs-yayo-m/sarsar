// FILE PATH: src/components/shared/NotFound.jsx
// 404 Not Found Page Component

import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              {/* Large 404 */}
              <h1 className="text-[200px] md:text-[300px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 leading-none select-none">
                404
              </h1>
              
              {/* Floating Package Icon */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <Package className="w-24 h-24 md:w-32 md:h-32 text-orange-500 opacity-20" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Oops! The page you're looking for seems to have wandered off. 
              Don't worry, we'll help you find your way back.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {/* Go Home */}
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </motion.button>
            </Link>

            {/* Browse Products */}
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200"
              >
                <Search className="w-5 h-5" />
                Browse Products
              </motion.button>
            </Link>

            {/* Go Back */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Home className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Home
                </span>
              </Link>
              
              <Link
                to="/shop"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <Package className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Shop
                </span>
              </Link>
              
              <Link
                to="/about"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <svg className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  About
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-orange-50 transition-colors group"
              >
                <svg className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Contact
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-8"
          >
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a
                href="mailto:support@sarsar.com.np"
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                support@sarsar.com.np
              </a>
              {' '}or call{' '}
              <a
                href="tel:+9779821072912"
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                +977 9821072912
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;