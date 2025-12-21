// File: src/pages/customer/Dashboard.jsx
// Customer Dashboard - Overview page with quick actions and stats

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Gift,
  Star,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OrderCard from '@/components/customer/OrderCard';
import ProductCard from '@/components/customer/ProductCard';
import LoadingScreen from '@/components/shared/LoadingScreen';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchMyOrders, orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    loyaltyPoints: 0
  });

  // Fetch customer data
  useEffect(() => {
    if (user) {
      fetchMyOrders({ limit: 5 });
    }
  }, [user, fetchMyOrders]);

  // Calculate stats
  useEffect(() => {
    if (orders.length > 0) {
      const activeCount = orders.filter(
        o => !['delivered', 'cancelled'].includes(o.status)
      ).length;
      const deliveredCount = orders.filter(o => o.status === 'delivered').length;
      
      setStats({
        totalOrders: orders.length,
        activeOrders: activeCount,
        deliveredOrders: deliveredCount,
        loyaltyPoints: deliveredCount * 10 // Simplified loyalty calculation
      });
    }
  }, [orders]);

  // Get recommended products (last 4 products for demo)
  const recommendedProducts = products.slice(0, 4);

  // Get active orders
  const activeOrders = orders.filter(
    o => !['delivered', 'cancelled'].includes(o.status)
  ).slice(0, 2);

  if (ordersLoading && orders.length === 0) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.displayName || user?.name || 'Friend'}! 👋
            </h1>
            <p className="text-orange-100">
              Here's what's happening with your orders
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/customer/orders')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Active Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/customer/orders?status=active')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {stats.activeOrders}
                  </p>
                </div>
                <div className="bg-orange-500 text-white p-3 rounded-full">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Delivered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/customer/orders?status=delivered')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-green-900">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Loyalty Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 mb-1">Points</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats.loyaltyPoints}
                  </p>
                </div>
                <div className="bg-purple-500 text-white p-3 rounded-full">
                  <Gift className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/shop')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Start Shopping
                </span>
              </button>

              <button
                onClick={() => navigate('/customer/orders')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Order History
                </span>
              </button>

              <button
                onClick={() => navigate('/customer/wishlist')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Wishlist
                </span>
              </button>

              <button
                onClick={() => navigate('/customer/addresses')}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="bg-orange-100 text-orange-600 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Addresses
                </span>
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Active Orders</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/customer/orders')}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onTrack={(id) => navigate(`/tracking?orderId=${id}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-6 h-6 text-orange-600" />
                Recommended for You
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/shop')}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start shopping and experience 1-hour delivery with SARSAR!
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/shop')}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;