// FILE PATH: src/components/customer/CartItem.jsx
// Individual Cart Item Component with quantity controls

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  // Calculate item total
  const price = item.discountPrice || item.price;
  const itemTotal = price * item.quantity;
  
  // Handle quantity change
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  const handleIncrease = () => {
    // Check stock limit if available
    if (item.stock && item.quantity >= item.stock) {
      return;
    }
    updateQuantity(item.id, item.quantity + 1);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-200 transition-colors"
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image || item.images?.[0] || '/placeholder-product.jpg'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        {/* Product Name */}
        <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
          {item.name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-bold text-orange-600">
            Rs. {price.toFixed(2)}
          </span>
          {item.discountPrice && (
            <span className="text-xs text-gray-400 line-through">
              Rs. {item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
            {/* Decrease Button */}
            <button
              onClick={handleDecrease}
              className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
              aria-label="Decrease quantity"
            >
              {item.quantity === 1 ? (
                <Trash2 className="w-4 h-4 text-red-500" />
              ) : (
                <Minus className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Quantity Display */}
            <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
              {item.quantity}
            </span>

            {/* Increase Button */}
            <button
              onClick={handleIncrease}
              disabled={item.stock && item.quantity >= item.stock}
              className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Item Total */}
          <span className="text-sm font-bold text-gray-900 ml-auto">
            Rs. {itemTotal.toFixed(2)}
          </span>
        </div>

        {/* Stock Warning */}
        {item.stock && item.quantity >= item.stock && (
          <p className="text-xs text-amber-600 mt-1">
            Maximum quantity reached
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.id)}
        className="flex-shrink-0 self-start p-2 hover:bg-red-50 rounded-lg transition-colors group"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
      </button>
    </motion.div>
  );
};

export default CartItem;