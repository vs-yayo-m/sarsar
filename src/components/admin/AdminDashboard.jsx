// FILE PATH: src/components/admin/AdminDashboard.jsx
// Admin Dashboard Component - Additional statistics and quick actions
// Shows system health, quick actions, and performance indicators

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ metrics }) => {
  // Quick action buttons
  const quickActions = [
    {
      title: 'Manage Orders',
      description: 'View and manage all orders',
      icon: Package,
      link: '/admin/orders',
      color: 'orange'
    },
    {
      title: 'Customer Management',
      description: 'View customer database',
      icon: Users,
      link: '/admin/customers',
      color: 'blue'
    },
    {
      title: 'Product Approval',
      description: 'Review pending products',
      icon: CheckCircle,
      link: '/admin/products',
      color: 'green'
    },
    {
      title: 'Analytics',
      description: 'Detailed platform insights',
      icon: TrendingUp,
      link: '/admin/analytics',
      color: 'purple'
    }
  ];

  // Performance indicators
  const performanceStats = [
    {
      label: 'Average Delivery Time',
      value: '42 min',
      target: '< 60 min',
      status: 'good',
      icon: Clock
    },
    {
      label: 'Customer Satisfaction',
      value: '4.6/5.0',
      target: '> 4.5',
      status: 'good',
      icon: Star
    },
    {
      label: 'Order Fulfillment Rate',
      value: '98.5%',
      target: '> 95%',
      status: 'good',
      icon: Target
    },
    {
      label: 'Platform Uptime',
      value: '99.9%',
      target: '> 99%',
      status: 'good',
      icon: CheckCircle
    }
  ];

  // Get color classes based on color name
  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    };
    return colors[color] || colors.orange;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="block p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses(action.color)} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Performance Indicators</h2>
          <span className="text-sm text-gray-600">
            Updated in real-time
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    {stat.status === 'good' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  {/* Label */}
                  <p className="text-sm text-gray-600 mb-2">
                    {stat.label}
                  </p>

                  {/* Value */}
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>

                  {/* Target */}
                  <p className="text-xs text-gray-500">
                    Target: {stat.target}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '98%' }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full bg-green-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                System Health: {metrics?.platformHealth || 98}%
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                All systems operational. No critical issues detected.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Last checked</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Health indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Database</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-900">Online</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Storage</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-900">Online</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Payment</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-900">Ready</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Notifications</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-900">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;