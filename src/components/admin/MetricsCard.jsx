// FILE PATH: src/components/admin/MetricsCard.jsx
// Metrics Card Component - Reusable card for displaying KPI metrics
// Shows value, trend, and comparison with beautiful animations

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'orange',
  loading = false,
  trend = 'up',
  subtitle = null
}) => {
  // Color configurations
  const colorClasses = {
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      gradient: 'from-orange-500 to-orange-600'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      gradient: 'from-green-500 to-green-600'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.orange;
  
  // Determine trend icon and color
  const getTrendIcon = () => {
    if (change === 0) return <Minus className="w-4 h-4" />;
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };
  
  const getTrendColor = () => {
    if (change === 0) return 'text-gray-600';
    if (change > 0) return 'text-green-600';
    return 'text-red-600';
  };
  
  const getTrendBg = () => {
    if (change === 0) return 'bg-gray-100';
    if (change > 0) return 'bg-green-100';
    return 'bg-red-100';
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer overflow-hidden relative"
    >
      {/* Background gradient decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -mr-16 -mt-16`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>

      {/* Value */}
      <div className="relative z-10">
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          {value}
        </motion.p>

        {/* Trend indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getTrendBg()}`}>
            {getTrendIcon()}
            <span className={`text-sm font-semibold ${getTrendColor()}`}>
              {Math.abs(change)}%
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {change > 0 ? 'vs yesterday' : change < 0 ? 'vs yesterday' : 'no change'}
          </span>
        </div>

        {/* Optional subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-500 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Animated bottom border */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.gradient}`}
      />
    </motion.div>
  );
};

export default MetricsCard;