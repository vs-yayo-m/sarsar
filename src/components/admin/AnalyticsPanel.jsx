// FILE PATH: src/components/admin/AnalyticsPanel.jsx
// Analytics Panel Component - Detailed charts and insights
// Product performance, user behavior, and geographic distribution

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  MapPin,
  Star
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

const AnalyticsPanel = ({ data, loading }) => {
  const COLORS = ['#FF6B35', '#F7931E', '#FFB88C', '#10B981', '#6366F1'];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].payload.name || payload[0].payload.ward}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].name}: <span className="font-bold text-orange-600">
              {payload[0].value.toLocaleString()}
            </span>
          </p>
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
      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Top Performing Products</h3>
        </div>

        <div className="space-y-4">
          {data.topProducts.length > 0 ? (
            data.topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.count} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    Rs. {product.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">Top seller</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No product data available</p>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Category Performance</h3>
          </div>

          {data.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#FF6B35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>

        {/* Users by Location */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Users by Location</h3>
          </div>

          {data.usersByLocation.length > 0 ? (
            <div className="space-y-3">
              {data.usersByLocation.map((location, index) => {
                const maxCount = Math.max(...data.usersByLocation.map(l => l.count));
                const percentage = (location.count / maxCount) * 100;

                return (
                  <motion.div
                    key={location.ward}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {location.ward}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {location.count} users
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No location data available</p>
            </div>
          )}
        </div>
      </div>

      {/* User Behavior Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">User Behavior Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Session Duration */}
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Avg. Session Duration</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {Math.floor(data.avgSessionDuration / 60)}:{(data.avgSessionDuration % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-xs text-gray-600">minutes</p>
          </div>

          {/* Bounce Rate */}
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Bounce Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {data.bounceRate}%
            </p>
            <p className="text-xs text-gray-600">of sessions</p>
          </div>

          {/* Conversion Rate */}
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Conversion Rate</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {data.conversionRate}%
            </p>
            <p className="text-xs text-gray-600">users converted</p>
          </div>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Strong User Engagement</p>
              <p className="text-sm text-gray-600">
                {data.activeUsers} active users with an average conversion rate of {data.conversionRate}%
              </p>
            </div>
          </div>

          {data.topProducts.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Top Product Performance</p>
                <p className="text-sm text-gray-600">
                  "{data.topProducts[0].name}" is your bestseller with {data.topProducts[0].count} units sold
                </p>
              </div>
            </div>
          )}

          {data.usersByLocation.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Geographic Concentration</p>
                <p className="text-sm text-gray-600">
                  {data.usersByLocation[0].ward} has the highest user concentration with {data.usersByLocation[0].count} users
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;