// FILE PATH: src/components/customer/CartSummary.jsx
// Cart Summary Component - Used in checkout page

import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Tag, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartSummary = ({ showItems = false, className = '' }) => {
  const { cartItems, getCartTotal, getCartCount } = useCart();
  
  // Calculate totals
  const subtotal = getCartTotal();
  const itemCount = getCartCount();
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  const savings = cartItems.reduce((total, item) => {
    if (item.discountPrice) {
      return total + ((item.price - item.discountPrice) * item.quantity);
    }
    return total;
  }, 0);
  const total = subtotal + deliveryFee;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Order Summary</h3>
            <p className="text-sm text-orange-100">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Items List (Optional) */}
        {showItems && cartItems.length > 0 && (
          <div className="space-y-3 pb-4 border-b border-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image || item.images?.[0] || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × Rs. {(item.discountPrice || item.price).toFixed(2)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Rs. {((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-semibold text-gray-900">
              Rs. {subtotal.toFixed(2)}
            </span>
          </div>

          {/* Savings */}
          {savings > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">You Save</span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                - Rs. {savings.toFixed(2)}
              </span>
            </div>
          )}

          {/* Delivery Fee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Delivery Fee</span>
            </div>
            <span className={`text-sm font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toFixed(2)}`}
            </span>
          </div>

          {/* Free Delivery Progress */}
          {subtotal < 500 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-orange-800 mb-2">
                    Add Rs. {(500 - subtotal).toFixed(2)} more for FREE delivery!
                  </p>
                  {/* Progress Bar */}
                  <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(subtotal / 500) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-3 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">
                  Rs. {total.toFixed(2)}
                </div>
                {savings > 0 && (
                  <div className="text-xs text-gray-500">
                    Original: Rs. {(total + savings).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Truck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">1-Hour Delivery</p>
              <p className="text-xs text-gray-500">Fast & reliable service</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-900">Secure</p>
            <p className="text-xs text-gray-500">Payment</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-900">Easy</p>
            <p className="text-xs text-gray-500">Returns</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;