// FILE PATH: src/components/supplier/OrderCard.jsx

import { motion } from 'framer-motion';
import { Clock, User, MapPin, Phone, Package, ChevronRight, Check, X, Printer } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { formatDistanceToNow } from 'date-fns';
import Button from '@/components/ui/Button';

const OrderCard = ({
  order,
  onAccept,
  onReject,
  onStartPicking,
  onViewPicking,
  onStartPacking,
  onPrint
}) => {
  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-red-100 text-red-700',
      confirmed: 'bg-green-100 text-green-700',
      picking: 'bg-orange-100 text-orange-700',
      packing: 'bg-blue-100 text-blue-700',
      ready: 'bg-purple-100 text-purple-700',
      delivered: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };
  
  const getTimeElapsed = () => {
    if (!order.createdAt) return '';
    return formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true });
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-900 text-sm">
            #{order.orderId?.slice(-6) || 'N/A'}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>{getTimeElapsed()}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {order.status?.toUpperCase()}
        </span>
      </div>

      {/* Customer Info */}
      <div className="space-y-2 mb-3 text-xs">
        <div className="flex items-center gap-2 text-gray-700">
          <User className="w-3 h-3 text-gray-400" />
          <span className="font-semibold">{order.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-3 h-3 text-gray-400" />
          <span>{order.customerPhone}</span>
        </div>
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">
            {order.deliveryAddress?.street}, {order.deliveryAddress?.area}
          </span>
        </div>
      </div>

      {/* Items Summary */}
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-semibold text-gray-700">
            {order.items?.length || 0} items
          </span>
        </div>
        <span className="text-sm font-bold text-orange-600">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Actions based on status */}
      <div className="flex flex-col gap-2">
        {order.status === 'placed' && (
          <>
            <Button
              size="sm"
              onClick={() => onAccept?.(order)}
              className="w-full flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              Accept Order
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onReject?.(order)}
              className="w-full flex items-center justify-center gap-1 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Reject
            </Button>
          </>
        )}

        {order.status === 'confirmed' && (
          <Button
            size="sm"
            onClick={() => onStartPicking?.(order)}
            className="w-full flex items-center justify-center gap-1"
          >
            Start Picking
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {order.status === 'picking' && (
          <Button
            size="sm"
            onClick={() => onViewPicking?.(order)}
            className="w-full flex items-center justify-center gap-1"
          >
            View Picking List
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {order.status === 'packing' && (
          <Button
            size="sm"
            onClick={() => onStartPacking?.(order)}
            className="w-full flex items-center justify-center gap-1"
          >
            Pack Order
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {order.status === 'ready' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPrint?.(order)}
            className="w-full flex items-center justify-center gap-1"
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </Button>
        )}

        {order.status === 'delivered' && (
          <div className="text-center text-xs text-gray-500 py-2">
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;