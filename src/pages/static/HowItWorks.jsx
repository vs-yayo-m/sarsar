// ============================================================
// FILE PATH: src/pages/static/HowItWorks.jsx
// ============================================================
import { ShoppingBag, Clock, Truck, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: ShoppingBag,
      title: 'Browse & Select',
      description: 'Choose from thousands of products across multiple categories',
    },
    {
      icon: Clock,
      title: 'Quick Checkout',
      description: 'Complete your order in seconds with our streamlined process',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Your order is picked, packed, and delivered within 1 hour',
    },
    {
      icon: CheckCircle,
      title: 'Enjoy!',
      description: 'Receive your order and enjoy the convenience',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How SARSAR Works</h1>
          <p className="text-xl text-gray-600">Simple, Fast, Reliable</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose SARSAR?</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>1-hour delivery guarantee</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>Fresh, quality products</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>Transparent pricing</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;