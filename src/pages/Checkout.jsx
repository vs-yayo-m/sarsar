// FILE PATH: src/pages/Checkout.jsx
// Checkout Page - Complete order placement flow

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CartSummary from '@/components/customer/CartSummary';
import AddressList from '@/components/customer/AddressList';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Create order in database
      const orderId = 'ORDER_' + Date.now();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart
      clearCart();

      // Show success
      toast.success('Order placed successfully!');

      // Navigate to success page
      navigate(`/order-success?orderId=${orderId}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: 'Address', description: 'Delivery location' },
    { number: 2, title: 'Delivery', description: 'Choose time slot' },
    { number: 3, title: 'Review', description: 'Confirm order' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Cart</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.number
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </motion.div>
                  
                  {/* Step Info */}
                  <div className="mt-2 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${
                    currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address Selection */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Select Delivery Address
                </h2>
                <AddressList
                  onSelectAddress={(address) => {
                    setSelectedAddress(address);
                    setCurrentStep(2);
                  }}
                  selectedAddressId={selectedAddress?.id}
                />
              </motion.div>
            )}

            {/* Step 2: Delivery Time */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Choose Delivery Time
                </h2>
                <div className="space-y-3">
                  {/* ASAP */}
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    deliveryTime === 'asap'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="asap"
                      checked={deliveryTime === 'asap'}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">As Soon As Possible</div>
                        <div className="text-sm text-gray-600">Delivery within 1 hour</div>
                      </div>
                      <div className="text-green-600 font-bold">FREE</div>
                    </div>
                  </label>

                  {/* Express */}
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    deliveryTime === 'express'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="express"
                      checked={deliveryTime === 'express'}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Express Delivery</div>
                        <div className="text-sm text-gray-600">Delivery within 30 minutes</div>
                      </div>
                      <div className="font-bold text-gray-900">Rs. 50</div>
                    </div>
                  </label>

                  {/* Scheduled */}
                  <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    deliveryTime === 'scheduled'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="scheduled"
                      checked={deliveryTime === 'scheduled'}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Schedule Later</div>
                        <div className="text-sm text-gray-600">Choose your preferred time</div>
                      </div>
                      <div className="text-green-600 font-bold">FREE</div>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  Review Your Order
                </h2>

                {/* Delivery Address */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                  {selectedAddress && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900">{selectedAddress.label}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedAddress.street}, Ward {selectedAddress.ward}
                      </p>
                      <p className="text-sm text-gray-600">{selectedAddress.landmark}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-2"
                  >
                    Change Address
                  </button>
                </div>

                {/* Delivery Time */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delivery Time</h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">
                      {deliveryTime === 'asap' && 'As Soon As Possible (1 hour)'}
                      {deliveryTime === 'express' && 'Express Delivery (30 minutes)'}
                      {deliveryTime === 'scheduled' && 'Scheduled Delivery'}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium mt-2"
                  >
                    Change Time
                  </button>
                </div>

                {/* Order Notes */}
                <div>
                  <label className="font-semibold text-gray-900 mb-2 block">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Add any special instructions for delivery..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary showItems={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;