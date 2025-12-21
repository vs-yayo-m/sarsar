// File: src/components/layout/Breadcrumbs.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Breadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Separator */}
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {/* Breadcrumb Item */}
              {isLast ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-primary transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Animated Breadcrumbs with stagger effect
export const AnimatedBreadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.nav
      aria-label="Breadcrumb"
      className={`py-3 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home */}
        <motion.li variants={itemVariant}>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </motion.li>

        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <motion.li
              key={index}
              className="flex items-center gap-2"
              variants={itemVariant}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {isLast ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-primary transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

// Card-style Breadcrumbs
export const CardBreadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />

                {isLast ? (
                  <span className="font-medium text-primary truncate max-w-[200px]">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-primary transition-colors truncate max-w-[200px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

// Breadcrumbs with custom separator
export const CustomBreadcrumbs = ({
  items = [],
  separator = '/',
  className = '',
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex items-center flex-wrap gap-3 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-3">
              <span className="text-gray-400">{separator}</span>

              {isLast ? (
                <span className="font-medium text-gray-900 truncate max-w-[200px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-primary transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Mobile-optimized Breadcrumbs (shows only last 2 items)
export const MobileBreadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  const displayItems = items.length > 2 ? items.slice(-2) : items;
  const hasMore = items.length > 2;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {hasMore && (
          <li className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">...</span>
          </li>
        )}

        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {isLast ? (
                <span className="font-medium text-gray-900 truncate max-w-[150px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-600 hover:text-primary transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Breadcrumbs with icons
export const IconBreadcrumbs = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {isLast ? (
                <span className="flex items-center gap-2 font-medium text-gray-900">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="truncate max-w-[200px]">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;