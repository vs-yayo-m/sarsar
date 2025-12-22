// FILE PATH: src/pages/admin/Analytics.jsx
// Admin Analytics Page - Comprehensive platform analytics
// User behavior, conversion funnels, and performance metrics

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topProducts: [],
    topCategories: [],
    usersByLocation: []
  });
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const now = new Date();
        let startDate = new Date();
        
        // Calculate date range
        if (dateRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (dateRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else if (dateRange === 'year') {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        // Get users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const totalUsers = users.filter(u => u.role === 'customer').length;
        const newUsers = users.filter(u => {
          const createdAt = u.createdAt?.toDate();
          return createdAt && createdAt >= startDate;
        }).length;
        
        // Get orders
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        
        const periodOrders = orders.filter(order => {
          const createdAt = order.createdAt?.toDate();
          return createdAt && createdAt >= startDate;
        });
        
        // Calculate active users (users with orders in period)
        const activeUserIds = new Set(periodOrders.map(o => o.customerId));
        const activeUsers = activeUserIds.size;
        
        // Calculate conversion rate (users who made orders / total users)
        const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
        
        // Get products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate top products by order count
        const productOrderCount = {};
        periodOrders.forEach(order => {
          order.items?.forEach(item => {
            if (!productOrderCount[item.productId]) {
              productOrderCount[item.productId] = {
                id: item.productId,
                name: item.name,
                count: 0,
                revenue: 0
              };
            }
            productOrderCount[item.productId].count += item.quantity;
            productOrderCount[item.productId].revenue += item.total;
          });
        });
        
        const topProducts = Object.values(productOrderCount)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        // Calculate top categories
        const categoryRevenue = {};
        periodOrders.forEach(order => {
          order.items?.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const category = product?.category || 'Other';
            
            if (!categoryRevenue[category]) {
              categoryRevenue[category] = 0;
            }
            categoryRevenue[category] += item.total;
          });
        });
        
        const topCategories = Object.entries(categoryRevenue)
          .map(([name, revenue]) => ({ name, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        // Users by location (ward)
        const usersByWard = {};
        users.forEach(user => {
          if (user.addresses && user.addresses.length > 0) {
            const ward = user.addresses[0].ward || 'Unknown';
            usersByWard[ward] = (usersByWard[ward] || 0) + 1;
          }
        });
        
        const usersByLocation = Object.entries(usersByWard)
          .map(([ward, count]) => ({ ward: `Ward ${ward}`, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setAnalyticsData({
          totalUsers,
          activeUsers,
          newUsers,
          totalOrders: periodOrders.length,
          conversionRate: conversionRate.toFixed(1),
          avgSessionDuration: 245, // Mock data (in seconds)
          bounceRate: 32, // Mock data (percentage)
          topProducts,
          topCategories,
          usersByLocation
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [dateRange]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                User behavior and performance insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="mt-4 flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Last {range === 'week' ? '7 Days' : range === 'month' ? 'Month' : 'Year'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">
              +{analyticsData.newUsers} new this period
            </p>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.activeUsers}</p>
            <p className="text-sm text-gray-500 mt-2">
              {((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-2">
              {(analyticsData.totalOrders / (analyticsData.activeUsers || 1)).toFixed(1)} orders/user
            </p>
          </motion.div>

          {/* Conversion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.conversionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">
              Users who made purchases
            </p>
          </motion.div>
        </div>

        {/* Analytics Panel */}
        <AnalyticsPanel 
          data={analyticsData}
          loading={loading}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default Analytics;