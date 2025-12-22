// FILE PATH: src/components/supplier/PickingList.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Package, Clock, MapPin, AlertCircle, ChevronRight } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

const PickingList = ({ order, onComplete }) => {
  const [pickedItems, setPickedItems] = useState({});
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState({});
  
  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);
  
  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle item picked
  const togglePicked = (itemIndex) => {
    setPickedItems(prev => ({
      ...prev,
      [itemIndex]: !prev[itemIndex]
    }));
  };
  
  // Calculate progress
  const totalItems = order.items?.length || 0;
  const pickedCount = Object.values(pickedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? (pickedCount / totalItems) * 100 : 0;
  
  // Handle complete picking
  const handleCompletePicking = async () => {
    if (pickedCount < totalItems) {
      toast.error('Please pick all items before completing');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'packing',
        pickingCompletedAt: new Date(),
        pickingTime: elapsedTime,
        pickingNotes: notes
      });
      
      toast.success('Picking completed! Ready for packing.');
      onComplete();
    } catch (error) {
      console.error('Error completing picking:', error);
      toast.error('Failed to complete picking');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Order #{order.orderId?.slice(-6)}
            </h2>
            <p className="text-orange-100 text-sm">
              {order.customerName} • {order.items?.length} items
            </p>
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm mb-1">Picking Time</p>
            <p className="text-3xl font-bold">{formatTime(elapsedTime)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-orange-400/30 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-white rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-sm mt-2">
            {pickedCount} of {totalItems} items picked ({Math.round(progress)}%)
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Delivery Address</p>
            <p className="text-sm text-blue-700">
              {order.deliveryAddress?.street}<br />
              {order.deliveryAddress?.area}, Ward {order.deliveryAddress?.ward}
            </p>
            {order.deliveryAddress?.landmark && (
              <p className="text-xs text-blue-600 mt-1">
                Near: {order.deliveryAddress.landmark}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-500" />
          Items to Pick
        </h3>

        <AnimatePresence>
          {order.items?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`
                border-2 rounded-xl p-4 transition-all cursor-pointer
                ${pickedItems[index]
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-orange-300'
                }
              `}
              onClick={() => togglePicked(index)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePicked(index);
                  }}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${pickedItems[index]
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-orange-500'
                    }
                  `}
                >
                  {pickedItems[index] && <CheckCircle className="w-5 h-5 text-white" />}
                </button>

                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${pickedItems[index] ? 'text-green-900' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      <p className={`text-sm ${pickedItems[index] ? 'text-green-700' : 'text-gray-600'}`}>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className={`font-bold ${pickedItems[index] ? 'text-green-900' : 'text-orange-600'}`}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Item Notes */}
                  {!pickedItems[index] && (
                    <input
                      type="text"
                      placeholder="Add note (e.g., substitution, damage)..."
                      value={notes[index] || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        setNotes(prev => ({ ...prev, [index]: e.target.value }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mt-2"
                    />
                  )}

                  {notes[index] && pickedItems[index] && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-800">{notes[index]}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Customer Notes */}
      {order.notes && (
        <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 mb-1">Customer Notes</p>
              <p className="text-sm text-yellow-700">{order.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onComplete}
          className="flex-1"
        >
          Save & Continue Later
        </Button>
        <Button
          onClick={handleCompletePicking}
          disabled={pickedCount < totalItems}
          className="flex-1 flex items-center justify-center gap-2"
        >
          Complete Picking
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Items Picked</p>
          <p className="text-2xl font-bold text-gray-900">{pickedCount}/{totalItems}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-orange-600">{formatPrice(order.total)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Time Taken</p>
          <p className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default PickingList;