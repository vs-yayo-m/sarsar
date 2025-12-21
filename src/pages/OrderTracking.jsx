// File: src/pages/OrderTracking.jsx
// Real-time order tracking page with live updates

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Share2,
  Download,
  MapPin,
  Navigation
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import OrderTimeline from '@/components/customer/OrderTimeline';
import OrderTracking from '@/components/customer/OrderTracking';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import LoadingScreen from '@/components/shared/LoadingScreen';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const { subscribeToOrderUpdates } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time order updates
  useEffect(() => {
    if (!orderId) {
      setError('Order ID not provided');
      setLoading(false);
      return;
    }

    // Subscribe to order updates
    const unsubscribe = subscribeToOrderUpdates(orderId, (result) => {
      if (result.success) {
        setOrder(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId, subscribeToOrderUpdates]);

  // Handle contact delivery person
  const handleCallDelivery = () => {
    if (order?.deliveryPerson?.phone) {
      window.location.href = `tel:${order.deliveryPerson.phone}`;
    }
  };

  const handleMessageDelivery = () => {
    if (order?.deliveryPerson?.phone) {
      const message = encodeURIComponent(
        `Hi, I'm tracking my order ${order.orderId}. When will it arrive?`
      );
      window.open(
        `https://wa.me/${order.deliveryPerson.phone.replace(/\D/g, '')}?text=${message}`,
        '_blank'
      );
    }
  };

  // Share tracking
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SARSAR Order Tracking',
        text: `Track my order ${order.orderId}`,
        url: window.location.href
      });
    }
  };

  // Download invoice (placeholder)
  const handleDownloadInvoice = () => {
    // TODO: Implement PDF generation
    alert('Invoice download will be implemented soon');
  };

  if (loading) {
    return <LoadingScreen message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to load order details'}
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadInvoice}
              >
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Order
          </h1>
          <p className="text-gray-600">
            Order ID: <span className="font-semibold text-orange-600">{order.orderId}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Tracking Component */}
            {order.status === 'out_for_delivery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <OrderTracking order={order} />
              </motion.div>
            )}

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
                <h2 className="text-xl font-semibold mb-4">
                  Order Items ({order.items.length})
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <MapPin className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × Rs. {item.price}
                        </p>
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
            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <h3 className="font-semibold mb-4">Delivery Address</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {order.deliveryAddress.area}
                    </p>
                    <p className="text-gray-600">{order.deliveryAddress.street}</p>
                    <p className="text-gray-600">
                      Ward {order.deliveryAddress.ward}, Butwal
                    </p>
                    {order.deliveryAddress.landmark && (
                      <p className="text-gray-500 mt-1">
                        Near: {order.deliveryAddress.landmark}
                      </p>
                    )}
                  </div>
                </div>
                {order.deliveryInstructions && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span>{' '}
                      {order.deliveryInstructions}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Delivery Person (if out for delivery) */}
            {order.status === 'out_for_delivery' && order.deliveryPerson && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-orange-50 to-white">
                  <h3 className="font-semibold mb-4">Delivery Person</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-orange-700">
                        {order.deliveryPerson.name?.[0] || 'D'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.deliveryPerson.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.deliveryPerson.vehicle}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={handleCallDelivery}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleMessageDelivery}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

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
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Need Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-orange-50 border-orange-200">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for any assistance
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open('https://wa.me/9779821072912', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;