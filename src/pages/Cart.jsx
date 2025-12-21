// FILE PATH: src/pages/Cart.jsx
// Shopping Cart Page

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/shared/EmptyState';
import { formatPrice } from '@/utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, deliveryFee, total } = useCart();
  
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some products to your cart and they'll show up here"
            action={{
              label: 'Start Shopping',
              onClick: () => navigate('/shop'),
            }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/shop" className="flex items-center text-orange-600 hover:text-orange-700 mb-2">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{cart.length} items</p>
          </div>
          
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                Delivery in 1 hour guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;