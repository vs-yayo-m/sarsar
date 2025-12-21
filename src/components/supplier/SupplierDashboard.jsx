// FILE PATH: src/components/supplier/SupplierDashboard.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Package,
  ArrowRight
} from 'lucide-react';
import MetricsCard from './MetricsCard';
import SalesChart from './SalesChart';
import PerformanceMetrics from './PerformanceMetrics';
import { formatPrice } from '@/utils/formatters';
import { formatDistanceToNow } from 'date-fns';

const SupplierDashboard = ({ data }) => {
  const {
    todayRevenue,
    todayOrders,
    pendingOrders,
    lowStockProducts,
    recentOrders,
    topProducts
  } = data;

  const metrics = [
    {
      title: "Today's Revenue",
      value: formatPrice(todayRevenue),
      icon: DollarSign,
      color: 'orange',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'blue',
      actionLabel: 'View Orders',
      actionLink: '/supplier/orders'
    },
    {
      title: "Today's Orders",
      value: todayOrders,
      icon: ShoppingBag,
      color: 'green',
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Low Stock Alert',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'red',
      actionLabel: 'Manage Stock',
      actionLink: '/supplier/inventory'
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Supplier Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricsCard {...metric} />
          </motion.div>
        ))}
      </div>

      {/* Charts and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Performance Metrics */}
        <div>
          <PerformanceMetrics />
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/supplier/orders"
              className="text-orange-500 hover:text-orange-600 flex items-center gap-1 text-sm font-semibold"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No recent orders</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Order #{order.orderId?.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items • {formatPrice(order.total)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.createdAt && formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'placed' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'picking' ? 'bg-orange-100 text-orange-700' : ''}
                      ${order.status === 'delivered' ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No product data yet</p>
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{product.sales} sales</span>
                      <span>•</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
      >
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/supplier/products/new"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-all"
          >
            <Package className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Add Product</p>
          </Link>
          <Link
            to="/supplier/orders"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-all"
          >
            <ShoppingBag className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">View Orders</p>
          </Link>
          <Link
            to="/supplier/inventory"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-all"
          >
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">Manage Stock</p>
          </Link>
          <Link
            to="/supplier/analytics"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-center transition-all"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <p className="text-sm font-semibold">View Analytics</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SupplierDashboard;