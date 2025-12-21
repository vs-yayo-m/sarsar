// File: src/components/customer/OrderCard.jsx
// Reusable Order Card Component for displaying order summary

import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const OrderCard = ({ order, onReorder, onTrack, onReview }) => {
  const navigate = useNavigate();
  
  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      placed: {
        color: 'bg-blue-100 text-blue-700',
        icon: Clock,
        label: 'Order Placed'
      },
      confirmed: {
        color: 'bg-purple-100 text-purple-700',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      picking: {
        color: 'bg-yellow-100 text-yellow-700',
        icon: Package,
        label: 'Picking Items'
      },
      packing: {
        color: 'bg-orange-100 text-orange-700',
        icon: Package,
        label: 'Packing'
      },
      out_for_delivery: {
        color: 'bg-blue-100 text-blue-700',
        icon: Truck,
        label: 'Out for Delivery'
      },
      delivered: {
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
        label: 'Delivered'
      },
      cancelled: {
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
        label: 'Cancelled'
      }
    };
    return configs[status] || configs.placed;
  };
  
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle click
  const handleClick = () => {
    navigate(`/customer/orders/${order.id}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-300 cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-bold text-gray-900">{order.orderId}</p>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </span>
          <span>{formatTime(order.createdAt)}</span>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <Package className="w-5 h-5 text-orange-600" />
          <p className="font-semibold text-gray-900">
            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-600">
                  Qty: {item.quantity} × Rs. {item.price}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                Rs. {item.total}
              </p>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-600">
              + {order.items.length - 2} more items
            </p>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {order.deliveryAddress.area}
            </p>
            <p className="text-xs text-gray-600">
              {order.deliveryAddress.street}, Ward {order.deliveryAddress.ward}
            </p>
            {order.deliveryAddress.landmark && (
              <p className="text-xs text-gray-500 mt-1">
                Near: {order.deliveryAddress.landmark}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Total Amount</span>
          <span className="text-xl font-bold text-orange-600">
            Rs. {order.total}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onTrack) onTrack(order.id);
                else navigate(`/tracking?orderId=${order.id}`);
              }}
            >
              Track Order
            </Button>
          )}
          
          {order.status === 'delivered' && !order.rating && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onReview) onReview(order.id);
              }}
            >
              Write Review
            </Button>
          )}

          {(order.status === 'delivered' || order.status === 'cancelled') && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                if (onReorder) onReorder(order);
              }}
            >
              Reorder
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className="px-3"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;