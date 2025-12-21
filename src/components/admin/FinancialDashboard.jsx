// FILE PATH: src/components/admin/FinancialDashboard.jsx
// Financial Dashboard Component - Detailed financial analytics and charts
// Revenue breakdown, payout management, and transaction history

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const FinancialDashboard = ({ data, loading, dateRange }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for charts (would come from props in real implementation)
  const revenueByCategory = [
    { name: 'Groceries', value: 45000, percentage: 35 },
    { name: 'Vegetables', value: 30000, percentage: 23 },
    { name: 'Fruits', value: 25000, percentage: 19 },
    { name: 'Dairy', value: 20000, percentage: 15 },
    { name: 'Others', value: 10000, percentage: 8 }
  ];

  const dailyRevenue = [
    { day: 'Mon', revenue: 12000, orders: 45 },
    { day: 'Tue', revenue: 15000, orders: 52 },
    { day: 'Wed', revenue: 18000, orders: 61 },
    { day: 'Thu', revenue: 14000, orders: 48 },
    { day: 'Fri', revenue: 22000, orders: 75 },
    { day: 'Sat', revenue: 28000, orders: 92 },
    { day: 'Sun', revenue: 25000, orders: 84 }
  ];

  const recentTransactions = [
    { id: 'TXN001', type: 'Order Payment', amount: 2500, status: 'completed', date: '2 hours ago' },
    { id: 'TXN002', type: 'Supplier Payout', amount: -1800, status: 'completed', date: '3 hours ago' },
    { id: 'TXN003', type: 'Order Payment', amount: 1200, status: 'completed', date: '5 hours ago' },
    { id: 'TXN004', type: 'Refund', amount: -500, status: 'pending', date: '1 day ago' },
    { id: 'TXN005', type: 'Order Payment', amount: 3400, status: 'completed', date: '1 day ago' }
  ];

  const COLORS = ['#FF6B35', '#F7931E', '#FFB88C', '#10B981', '#6366F1'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600">
              {entry.name}: <span className="font-bold text-orange-600">
                Rs. {entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-1 overflow-x-auto px-4 border-b border-gray-200">
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'transactions', label: 'Transactions' },
            { value: 'payouts', label: 'Payouts' }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Revenue Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Revenue */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue by Category */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Category Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {revenueByCategory.map((category, index) => (
                        <tr key={category.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index] }}
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {category.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            Rs. {category.value.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full"
                                  style={{ 
                                    width: `${category.percentage}%`,
                                    backgroundColor: COLORS[index]
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {category.percentage}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View All
                </button>
              </div>

              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`w-6 h-6 ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.id}</p>
                      <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}Rs. {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status === 'completed' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {transaction.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="space-y-6">
              {/* Payout Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm font-medium text-gray-700">Pending Payouts</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    Rs. {data.pendingPayouts.toLocaleString()}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-gray-700">Completed Payouts</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    Rs. {data.completedPayouts.toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-gray-700">Total Commission</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    Rs. {data.totalCommission.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payout Actions */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Process Pending Payouts</p>
                        <p className="text-xs text-gray-500">5 suppliers awaiting payout</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-orange-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Review Payout History</p>
                        <p className="text-xs text-gray-500">View all completed payouts</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-orange-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">Export Payout Report</p>
                        <p className="text-xs text-gray-500">Download detailed report</p>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;