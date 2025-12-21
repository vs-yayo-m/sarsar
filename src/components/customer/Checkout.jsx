// FILE PATH: src/components/customer/Checkout.jsx
// Checkout Component - Reusable checkout flow

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import Button from '@/components/ui/Button';

const CheckoutComponent = ({ onComplete, initialStep = 1 }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [checkoutData, setCheckoutData] = useState({
    address: null,
    deliveryTime: 'asap',
    paymentMethod: 'cod',
    notes: '',
  });
  
  const steps = [
    { id: 1, title: 'Address', component: 'address' },
    { id: 2, title: 'Delivery', component: 'delivery' },
    { id: 3, title: 'Payment', component: 'payment' },
    { id: 4, title: 'Review', component: 'review' },
  ];
  
  // Handle step completion
  const handleStepComplete = (data) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
    
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(checkoutData);
    }
  };
  
  // Go back
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                transition-all duration-300
                ${currentStep > step.id
                  ? 'bg-green-500 text-white'
                  : currentStep === step.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              
              {/* Step Title */}
              <span className={`
                mt-2 text-xs font-medium
                ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {step.title}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className={`
                h-1 flex-1 mx-2 rounded-full transition-all duration-300
                ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select or Add Delivery Address
              </h3>
              <AddressList
                onSelectAddress={(address) => handleStepComplete({ address })}
              />
            </div>
          )}

          {/* Step 2: Delivery Time */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Choose Delivery Time
              </h3>
              {/* Delivery options here */}
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={() => handleStepComplete({})}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Select Payment Method
              </h3>
              {/* Payment options here */}
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={() => handleStepComplete({})}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Review Your Order
              </h3>
              {/* Review content here */}
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={() => handleStepComplete({})}>
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CheckoutComponent;