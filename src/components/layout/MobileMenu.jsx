// File: src/components/layout/MobileMenu.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, ShoppingBag, Heart, User, Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import Button from '@/components/ui/Button';

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, userProfile, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  const menuItems = [
    { icon: Home, label: 'Home', path: ROUTES.HOME },
    { icon: ShoppingBag, label: 'Shop', path: ROUTES.SHOP },
    { icon: Heart, label: 'Wishlist', path: ROUTES.WISHLIST, authRequired: true },
    { icon: User, label: 'Profile', path: ROUTES.CUSTOMER_PROFILE, authRequired: true },
    { icon: Settings, label: 'Settings', path: ROUTES.CUSTOMER_SETTINGS, authRequired: true },
  ];
  
  const categories = [
    { label: 'Groceries', path: '/category/groceries' },
    { label: 'Vegetables', path: '/category/vegetables' },
    { label: 'Fruits', path: '/category/fruits' },
    { label: 'Dairy', path: '/category/dairy' },
    { label: 'Snacks', path: '/category/snacks' },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Section */}
            {user && (
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {userProfile?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    <p className="text-xs text-primary font-medium mt-1 capitalize">
                      {userProfile?.role || 'Customer'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <nav className="space-y-1">
                {menuItems
                  .filter((item) => !item.authRequired || user)
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50 hover:text-primary transition-colors group"
                    >
                      <item.icon className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}
              </nav>
            </div>

            {/* Categories */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-50 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link
                  to={ROUTES.ABOUT}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to={ROUTES.CONTACT}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  to={ROUTES.FAQ}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  Help & FAQ
                </Link>
                <Link
                  to={ROUTES.HOW_IT_WORKS}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-gray-700 hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              {user ? (
                <>
                  <Link to={ROUTES.CUSTOMER_DASHBOARD} onClick={onClose}>
                    <Button variant="primary" fullWidth className="mb-2">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} onClick={onClose}>
                    <Button variant="outline" fullWidth className="mb-2">
                      Login
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER} onClick={onClose}>
                    <Button variant="primary" fullWidth>
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Need help?</p>
              <a
                href="tel:+9779821072912"
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +977 9821072912
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;