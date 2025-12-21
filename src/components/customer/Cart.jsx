// FILE PATH: src/components/customer/Cart.jsx
// Shopping Cart Component - Slide-in panel with cart items

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import Button from '@/components/ui/Button';

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  
  // Calculate totals
  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 50) : 0;
  const total = subtotal + deliveryFee;
  const itemCount = getCartCount();
  
  // Handle checkout
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  
  // Handle continue shopping
  const handleContinueShopping = () => {
    onClose();
    navigate('/shop');
  };
  
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Cart Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <Dialog.Title className="text-lg font-bold text-gray-900">
                            Shopping Cart
                          </Dialog.Title>
                          <p className="text-sm text-gray-500">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {cartItems.length === 0 ? (
                        // Empty cart state
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4"
                          >
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                          </motion.div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-sm text-gray-500 mb-6">
                            Add items to get started
                          </p>
                          <Button onClick={handleContinueShopping}>
                            Continue Shopping
                          </Button>
                        </div>
                      ) : (
                        // Cart items list
                        <AnimatePresence>
                          <div className="space-y-4">
                            {cartItems.map((item) => (
                              <CartItem key={item.id} item={item} />
                            ))}
                          </div>
                        </AnimatePresence>
                      )}
                    </div>

                    {/* Footer - Cart Summary */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                        {/* Delivery Info */}
                        {subtotal < 500 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm text-orange-800">
                              Add Rs. {500 - subtotal} more for free delivery! 🎉
                            </p>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-900">
                              Rs. {subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                              {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 flex justify-between">
                            <span className="text-base font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-orange-600">
                              Rs. {total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button
                            onClick={handleCheckout}
                            className="w-full"
                            size="lg"
                          >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                          <button
                            onClick={clearCart}
                            className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2"
                          >
                            Clear Cart
                          </button>
                        </div>

                        {/* Delivery Time Badge */}
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-green-700">
                              Delivery in 1 hour
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Cart;