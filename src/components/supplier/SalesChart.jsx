// FILE PATH: src/components/supplier/SalesChart.jsx

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { formatPrice } from '@/utils/formatters';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

const SalesChart = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchSalesData = async () => {
      setLoading(true);
      
      try {
        // Determine date range
        const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
        const endDate = endOfDay(new Date());
        const startDate = startOfDay(subDays(new Date(), days));
        
        // Fetch orders within date range
        const ordersQuery = query(
          collection(db, 'orders'),
          where('supplierId', '==', user.uid),
          where('createdAt', '>=', startDate),
          where('createdAt', '<=', endDate),
          where('status', 'in', ['delivered', 'confirmed', 'out_for_delivery']),
          orderBy('createdAt', 'asc')
        );
        
        const snapshot = await getDocs(ordersQuery);
        
        // Group by date
        const salesByDate = {};
        let total = 0;
        
        snapshot.forEach((doc) => {
          const order = doc.data();
          const date = format(order.createdAt.toDate(), 'MMM dd');
          
          if (!salesByDate[date]) {
            salesByDate[date] = {
              date,
              revenue: 0,
              orders: 0
            };
          }
          
          salesByDate[date].revenue += order.total || 0;
          salesByDate[date].orders += 1;
          total += order.total || 0;
        });
        
        // Convert to array and fill missing dates
        const data = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'MMM dd');
          data.push(salesByDate[date] || { date, revenue: 0, orders: 0 });
        }
        
        setChartData(data);
        setTotalRevenue(total);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalesData();
  }, [user, timeRange]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-gray-600">
            Revenue: <span className="font-bold text-orange-600">{formatPrice(payload[0].value)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Orders: <span className="font-bold">{payload[0].payload.orders}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sales Overview</h2>
          <p className="text-sm text-gray-600">Total Revenue: 
            <span className="font-bold text-orange-600 ml-1">{formatPrice(totalRevenue)}</span>
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
          <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
          <p>No sales data for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `Rs. ${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF6B35"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(chartData.length > 0 ? totalRevenue / chartData.reduce((acc, d) => acc + d.orders, 0) : 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-lg font-bold text-gray-900">
            {chartData.reduce((acc, d) => acc + d.orders, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Best Day</p>
          <p className="text-lg font-bold text-orange-600">
            {chartData.length > 0 
              ? chartData.reduce((max, d) => d.revenue > max.revenue ? d : max, chartData[0]).date
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesChart;