// File: src/pages/customer/Orders.jsx
// Customer Orders List Page with filtering and search

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useDebounce } from '@/hooks/useDebounce';
import OrderCard from '@/components/customer/OrderCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingScreen from '@/components/shared/LoadingScreen';

const CustomerOrders = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, fetchMyOrders, loading, cancel } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch orders on mount
  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(
          o => !['delivered', 'cancelled'].includes(o.status)
        );
      } else {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
    }

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(
        o =>
          o.orderId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          o.items.some(item =>
            item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, debouncedSearch]);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package, color: 'gray' },
    { value: 'active', label: 'Active', icon: Clock, color: 'orange' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' }
  ];

  // Get status color classes
  const getStatusColorClass = (color, isActive) => {
    if (!isActive) return 'border-gray-200 hover:border-gray-300';
    
    const colorMap = {
      orange: 'border-orange-500 bg-orange-50',
      green: 'border-green-500 bg-green-50',
      red: 'border-red-500 bg-red-50',
      gray: 'border-gray-500 bg-gray-50'
    };
    return colorMap[color] || 'border-gray-200';
  };

  const getStatusIconClass = (color, isActive) => {
    if (!isActive) return 'bg-gray-100 text-gray-600';
    
    const colorMap = {
      orange: 'bg-orange-500 text-white',
      green: 'bg-green-500 text-white',
      red: 'bg-red-500 text-white',
      gray: 'bg-gray-500 text-white'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  const getStatusTextClass = (color, isActive) => {
    if (!isActive) return 'text-gray-700';
    
    const colorMap = {
      orange: 'text-orange-700',
      green: 'text-green-700',
      red: 'text-red-700',
      gray: 'text-gray-700'
    };
    return colorMap[color] || 'text-gray-700';
  };

  // Handle reorder
  const handleReorder = (order) => {
    // Add items to cart and navigate to cart
    // This would use the cart context from Section 11
    console.log('Reorder:', order);
    navigate('/cart');
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );
    if (confirmed) {
      const result = await cancel(orderId, 'Customer requested cancellation');
      if (result.success) {
        alert('Order cancelled successfully');
      } else {
        alert(`Failed to cancel order: ${result.error}`);
      }
    }
  };

  if (loading && orders.length === 0) {
    return <LoadingScreen message="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            View and manage all your orders
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <Filter className="w-5 h-5" />
                Filter Orders
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Status Filters */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${
                showFilters ? 'block' : 'hidden md:grid'
              }`}
            >
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isActive = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${getStatusColorClass(option.color, isActive)}`}
                  >
                    <div className={`p-2 rounded-full ${getStatusIconClass(option.color, isActive)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${getStatusTextClass(option.color, isActive)}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {
                          orders.filter((o) =>
                            option.value === 'all'
                              ? true
                              : option.value === 'active'
                              ? !['delivered', 'cancelled'].includes(o.status)
                              : o.status === option.value
                          ).length
                        }
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredOrders.length}</span>{' '}
            {statusFilter !== 'all' && `${statusFilter} `}
            {filteredOrders.length === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OrderCard
                  order={order}
                  onReorder={handleReorder}
                  onTrack={(id) => navigate(`/tracking?orderId=${id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Card className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'You have not placed any orders yet'}
              </p>
              {(!searchTerm && statusFilter === 'all') && (
                <Button
                  variant="primary"
                  onClick={() => navigate('/shop')}
                >
                  Start Shopping
                </Button>
              )}
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          </motion.div>
        )}

        {/* Loading More */}
        {loading && orders.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;