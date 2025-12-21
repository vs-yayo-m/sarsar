// File: src/components/customer/OrderTimeline.jsx
// Visual timeline component showing order status progression

import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Package, 
  Truck, 
  MapPin,
  XCircle 
} from 'lucide-react';

const OrderTimeline = ({ statusHistory, currentStatus }) => {
  // Define all possible statuses in order
  const allStatuses = [
    {
      key: 'placed',
      label: 'Order Placed',
      icon: Clock,
      description: 'Your order has been received'
    },
    {
      key: 'confirmed',
      label: 'Confirmed',
      icon: CheckCircle,
      description: 'Supplier has confirmed your order'
    },
    {
      key: 'picking',
      label: 'Picking Items',
      icon: Package,
      description: 'Items are being picked from store'
    },
    {
      key: 'packing',
      label: 'Packing',
      icon: Package,
      description: 'Your items are being packed'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: Truck,
      description: 'Your order is on the way'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      description: 'Order has been delivered'
    }
  ];

  // Special handling for cancelled orders
  if (currentStatus === 'cancelled') {
    const cancelledIndex = statusHistory.findIndex(s => s.status === 'cancelled');
    const completedStatuses = statusHistory.slice(0, cancelledIndex + 1);
    
    return (
      <div className="py-8">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Status items */}
          <div className="space-y-8">
            {completedStatuses.map((status, index) => {
              const isCancelled = status.status === 'cancelled';
              const StatusIcon = isCancelled ? XCircle : 
                allStatuses.find(s => s.key === status.status)?.icon || Clock;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center 
                    w-12 h-12 rounded-full border-4 border-white
                    ${isCancelled ? 'bg-red-500' : 'bg-green-500'}
                    shadow-lg
                  `}>
                    <StatusIcon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`
                        font-semibold text-lg
                        ${isCancelled ? 'text-red-700' : 'text-gray-900'}
                      `}>
                        {isCancelled ? 'Order Cancelled' : 
                          allStatuses.find(s => s.key === status.status)?.label}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(status.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{status.note}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Get the index of current status
  const currentIndex = allStatuses.findIndex(s => s.key === currentStatus);

  return (
    <div className="py-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Completed line (animated) */}
        <motion.div
          className="absolute left-6 top-0 w-0.5 bg-orange-500"
          initial={{ height: 0 }}
          animate={{ 
            height: `${(currentIndex / (allStatuses.length - 1)) * 100}%` 
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Status items */}
        <div className="space-y-8">
          {allStatuses.map((status, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const StatusIcon = status.icon;
            
            // Find actual timestamp from statusHistory
            const historyItem = statusHistory.find(h => h.status === status.key);

            return (
              <motion.div
                key={status.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Icon */}
                <motion.div
                  className={`
                    relative z-10 flex items-center justify-center 
                    w-12 h-12 rounded-full border-4 border-white
                    transition-all duration-300
                    ${isCompleted 
                      ? 'bg-orange-500 shadow-lg shadow-orange-200' 
                      : 'bg-gray-200'
                    }
                    ${isCurrent ? 'scale-110 ring-4 ring-orange-100' : ''}
                  `}
                  animate={isCurrent ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <StatusIcon className="w-6 h-6 text-gray-400" />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`
                      font-semibold text-lg
                      ${isCompleted ? 'text-gray-900' : 'text-gray-400'}
                    `}>
                      {status.label}
                    </h3>
                    {historyItem && (
                      <span className="text-sm text-gray-500">
                        {new Date(historyItem.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  <p className={`
                    text-sm
                    ${isCompleted ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    {historyItem?.note || status.description}
                  </p>
                  
                  {/* Current status indicator */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      <motion.div
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0.5, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                      In Progress
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Estimated time remaining (only for active orders) */}
      {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">
                Estimated delivery in {allStatuses.length - currentIndex - 1} step
                {allStatuses.length - currentIndex - 1 !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600">
                We'll notify you when your order moves to the next stage
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTimeline;