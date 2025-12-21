// File: src/components/layout/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Heart,
  MapPin,
  User,
  Settings,
  Archive,
  BarChart3,
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Megaphone,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { NAVIGATION_MENU } from '@/config/routes';

const Sidebar = ({ isOpen = true, onClose }) => {
  const location = useLocation();
  const { userProfile } = useAuth();
  
  const role = userProfile?.role || 'customer';
  const menuItems = NAVIGATION_MENU[role] || [];
  
  const iconMap = {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Heart,
    MapPin,
    User,
    Settings,
    Archive,
    BarChart3,
    Users,
    Store,
    DollarSign,
    TrendingUp,
    Megaphone,
    ShoppingCart,
  };
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 30 }}
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white border-r border-gray-200
          z-40 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* User Info */}
          <div className="mb-8">
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {userProfile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${
                      active
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-primary'
                    }
                  `}
                >
                  {Icon && (
                    <Icon
                      className={`
                        w-5 h-5
                        ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary'}
                      `}
                    />
                  )}
                  <span className="font-medium">{item.label}</span>
                  
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              Contact our support team for assistance
            </p>
            <a
              href="tel:+9779821072912"
              className="block text-center px-4 py-2 bg-white text-primary rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
            >
              Call Support
            </a>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;