// FILE PATH: src/pages/admin/Financial.jsx
// Admin Financial Management Page - Revenue tracking and financial reports
// Commission management, payouts, and transaction monitoring

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Download, 
  RefreshCw,
  Calendar,
  CreditCard,
  Wallet
} from 'lucide-react';
import FinancialDashboard from '@/components/admin/FinancialDashboard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';

const Financial = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalCommission: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
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

        // Get orders in date range
        const ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', startDate),
          where('status', '==', 'delivered')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map(doc => doc.data());

        // Calculate metrics
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Commission calculation (assume 10% platform commission)
        const totalCommission = totalRevenue * 0.10;

        // Get previous period for comparison
        const prevStartDate = new Date(startDate);
        const prevEndDate = new Date(startDate);
        
        if (dateRange === 'week') {
          prevStartDate.setDate(prevStartDate.getDate() - 7);
        } else if (dateRange === 'month') {
          prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        } else if (dateRange === 'year') {
          prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        }

        const prevOrdersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', prevStartDate),
          where('createdAt', '<', startDate),
          where('status', '==', 'delivered')
        );
        
        const prevOrdersSnapshot = await getDocs(prevOrdersQuery);
        const prevOrders = prevOrdersSnapshot.docs.map(doc => doc.data());
        const prevRevenue = prevOrders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Calculate growth
        const revenueGrowth = prevRevenue > 0 
          ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 
          : 100;
        const ordersGrowth = prevOrders.length > 0
          ? ((totalOrders - prevOrders.length) / prevOrders.length) * 100
          : 100;

        setFinancialData({
          totalRevenue,
          totalOrders,
          avgOrderValue,
          totalCommission,
          pendingPayouts: totalCommission * 0.3, // Example
          completedPayouts: totalCommission * 0.7, // Example
          revenueGrowth: Math.round(revenueGrowth),
          ordersGrowth: Math.round(ordersGrowth)
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [dateRange]);

  // Export financial report
  const handleExport = () => {
    const csvContent = [
      ['Metric', 'Value'].join(','),
      ['Total Revenue', `Rs. ${financialData.totalRevenue}`],
      ['Total Orders', financialData.totalOrders],
      ['Average Order Value', `Rs. ${financialData.avgOrderValue.toFixed(2)}`],
      ['Total Commission', `Rs. ${financialData.totalCommission.toFixed(2)}`],
      ['Pending Payouts', `Rs. ${financialData.pendingPayouts.toFixed(2)}`],
      ['Completed Payouts', `Rs. ${financialData.completedPayouts.toFixed(2)}`]
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Revenue tracking and commission management
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
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export Report</span>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                financialData.revenueGrowth >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {financialData.revenueGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {Math.abs(financialData.revenueGrowth)}%
                </span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">
              Rs. {(financialData.totalRevenue / 1000).toFixed(1)}k
            </p>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                financialData.ordersGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {financialData.ordersGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {Math.abs(financialData.ordersGrowth)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">
              {financialData.totalOrders}
            </p>
          </motion.div>

          {/* Average Order Value */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
            <p className="text-3xl font-bold text-gray-900">
              Rs. {financialData.avgOrderValue.toFixed(0)}
            </p>
          </motion.div>

          {/* Total Commission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Platform Commission</p>
            <p className="text-3xl font-bold text-gray-900">
              Rs. {(financialData.totalCommission / 1000).toFixed(1)}k
            </p>
          </motion.div>
        </div>

        {/* Financial Dashboard Component */}
        <FinancialDashboard 
          data={financialData}
          loading={loading}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};

export default Financial;