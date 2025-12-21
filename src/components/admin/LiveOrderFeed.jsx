// FILE PATH: src/components/admin/LiveOrderFeed.jsx
// Live Order Feed - Real-time scrolling feed of active orders
// Shows latest orders with status, customer info, and quick actions

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  User,
  MapPin,
  ChevronRight,
  Package,
  Truck,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const LiveOrderFeed = ({ orders = [] }) => {
  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      placed: {
        label: 'Order Placed',
        color: 'bg-blue-100 text-blue-700',
        icon: ShoppingBag
      },
      confirmed: {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle
      },
      picking: {
        label: 'Picking Items',
        color: 'bg-yellow-100 text-yellow-700',
        icon: Package
      },
      packing: {
        label: 'Packing',
        color: 'bg-orange-100 text-orange-700',
        icon: Package
      },
      out_for_delivery: {
        label: 'Out for Delivery',
        color: 'bg-purple-100 text-purple-700',
        icon: Truck
      }
    };
    return configs[status] || configs.placed;
  };
  
  // Format order time
  const formatOrderTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Live Orders</h3>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-medium text-gray-600">Live</span>
          </div>
        </div>
      </div>

      {/* Orders Feed - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px]">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm text-center">
                No active orders at the moment
              </p>
            </motion.div>
          ) : (
            orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="block p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <StatusIcon className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {order.orderId || order.id}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatOrderTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2">
                      {/* Customer */}
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {order.customerName || 'Customer'}
                        </span>
                      </div>

                      {/* Location */}
                      {order.deliveryAddress && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            {order.deliveryAddress.area || order.deliveryAddress.ward}
                          </span>
                        </div>
                      )}

                      {/* Amount and Status */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-900">
                          Rs. {order.total?.toLocaleString() || 0}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Items count */}
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer - View All */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/admin/orders"
          className="block w-full py-2 text-center text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default LiveOrderFeed;