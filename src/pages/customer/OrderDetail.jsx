// File: src/pages/customer/OrderDetail.jsx
// Detailed order view page with full information

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  MapPin,
  Clock,
  Phone,
  Download,
  Share2,
  RotateCcw,
  XCircle,
  MessageCircle
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import OrderTimeline from '@/components/customer/OrderTimeline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { formatDateTime, getRelativeTime } from '@/utils/dateUtils';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, cancel, loading } = useOrders();
  const [order, setOrder] = useState(null);

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    const orderData = await getOrder(orderId);
    if (orderData) {
      setOrder(orderData);
    }
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this order? This action cannot be undone.'
    );
    
    if (confirmed) {
      const reason = prompt('Please provide a reason for cancellation:');
      if (reason) {
        const result = await cancel(orderId, reason);
        if (result.success) {
          alert('Order cancelled successfully');
          fetchOrderDetails(); // Refresh order data
        } else {
          alert(`Failed to cancel: ${result.error}`);
        }
      }
    }
  };

  // Handle reorder
  const handleReorder = () => {
    // Add items to cart (would use CartContext)
    console.log('Reorder items:', order.items);
    navigate('/cart');
  };

  // Handle download invoice
  const handleDownloadInvoice = () => {
    alert('Invoice download will be implemented soon');
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.orderId}`,
        text: `Check out my SARSAR order details`,
        url: window.location.href
      });
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-purple-100 text-purple-700',
      picking: 'bg-yellow-100 text-yellow-700',
      packing: 'bg-orange-100 text-orange-700',
      out_for_delivery: 'bg-blue-100 text-blue-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.placed;
  };

  if (loading || !order) {
    return <LoadingScreen message="Loading order details..." />;
  }

  const canCancel = order.status === 'placed' || order.status === 'confirmed';
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/customer/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Orders</span>
            </button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownloadInvoice}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order {order.orderId}
                  </h1>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  Placed {getRelativeTime(order.createdAt)} • {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {!isDelivered && !isCancelled && (
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/tracking?orderId=${orderId}`)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                )}
                {(isDelivered || isCancelled) && (
                  <Button variant="outline" onClick={handleReorder}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outline" onClick={handleCancelOrder}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h2 className="text-xl font-semibold mb-4">Order Progress</h2>
                <OrderTimeline
                  statusHistory={order.statusHistory}
                  currentStatus={order.status}
                />
              </Card>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  Order Items ({order.items.length})
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × Rs. {item.price}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mt-1">
                            Variant: {item.variant}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Rs. {item.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Delivery Address
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">{order.deliveryAddress.area}</p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>Ward {order.deliveryAddress.ward}, Butwal</p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-gray-600 mt-2">
                      Near: {order.deliveryAddress.landmark}
                    </p>
                  )}
                </div>
                {order.deliveryInstructions && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Delivery Instructions:
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Delivery Time */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Delivery Time
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Estimated Delivery</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(order.estimatedDelivery)}
                    </p>
                  </div>
                  {order.actualDelivery && (
                    <div>
                      <p className="text-gray-600">Actual Delivery</p>
                      <p className="font-medium text-green-700">
                        {formatDateTime(order.actualDelivery)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600">Delivery Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.deliveryType}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>
                      {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-Rs. {order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-orange-600">Rs. {order.total}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <Badge
                      className={
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-orange-50 border-orange-200">
                <h3 className="font-semibold mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your order? We're here to help!
                </p>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      window.open('https://wa.me/9779821072912', '_blank')
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => (window.location.href = 'tel:+9779821072912')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;