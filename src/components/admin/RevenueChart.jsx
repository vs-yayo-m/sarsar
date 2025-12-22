// FILE PATH: src/components/admin/RevenueChart.jsx
// Revenue Chart Component - Interactive chart showing revenue trends
// Uses Recharts for beautiful, responsive charts with animations

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        let startDate = new Date();
        
        // Calculate start date based on time range
        if (timeRange === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeRange === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        } else {
          startDate.setFullYear(now.getFullYear() - 1);
        }
        
        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', startDate),
          where('status', '==', 'delivered')
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const orders = ordersSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        
        // Group orders by day
        const revenueByDay = {};
        let total = 0;
        
        orders.forEach(order => {
          const date = order.createdAt.toDate();
          const dayKey = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          
          if (!revenueByDay[dayKey]) {
            revenueByDay[dayKey] = {
              date: dayKey,
              revenue: 0,
              orders: 0
            };
          }
          
          revenueByDay[dayKey].revenue += order.total || 0;
          revenueByDay[dayKey].orders += 1;
          total += order.total || 0;
        });
        
        // Convert to array and sort by date
        const chartDataArray = Object.values(revenueByDay).sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        
        setChartData(chartDataArray);
        setTotalRevenue(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [timeRange]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-gray-600">
            Revenue: <span className="font-bold text-orange-600">
              Rs. {payload[0].value.toLocaleString()}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {payload[0].payload.orders} orders
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Time range buttons
  const timeRanges = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
            <p className="text-sm text-gray-600">
              Total: Rs. {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download Report"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-4 h-4 text-gray-600" />
        <div className="flex gap-2">
          {timeRanges.map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No revenue data available</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B35"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Summary Stats */}
      {!loading && chartData.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Avg. Daily</p>
            <p className="text-lg font-bold text-gray-900">
              Rs. {Math.round(totalRevenue / chartData.length).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Peak Day</p>
            <p className="text-lg font-bold text-gray-900">
              Rs. {Math.max(...chartData.map(d => d.revenue)).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
            <p className="text-lg font-bold text-gray-900">
              {chartData.reduce((sum, d) => sum + d.orders, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;