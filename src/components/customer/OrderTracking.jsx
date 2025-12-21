// File: src/components/customer/OrderTracking.jsx
// Live map tracking component with delivery person location

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Truck } from 'lucide-react';
import Card from '@/components/ui/Card';

const OrderTracking = ({ order }) => {
  // Simulated delivery location (in production, this would come from GPS)
  const [deliveryLocation, setDeliveryLocation] = useState({
    lat: 27.6962 + (Math.random() - 0.5) * 0.01,
    lng: 83.4649 + (Math.random() - 0.5) * 0.01
  });
  
  const [estimatedTime, setEstimatedTime] = useState(25); // minutes
  
  // Simulate location updates (in production, use WebSocket or Firebase)
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005
      }));
      
      setEstimatedTime(prev => Math.max(1, prev - 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Customer location (from order)
  const customerLocation = {
    lat: 27.6962, // Butwal coordinates
    lng: 83.4649
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Out for Delivery</h3>
            <p className="text-sm text-orange-100">
              Your order is on the way!
            </p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Truck className="w-12 h-12" />
          </motion.div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 md:h-80 bg-gray-100">
        {/* In production, replace with actual map (Mapbox, Google Maps, etc.) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">
              Map integration coming soon
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Location: {deliveryLocation.lat.toFixed(4)}, {deliveryLocation.lng.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Delivery Person Marker (Animated) */}
        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="bg-orange-500 text-white p-3 rounded-full shadow-lg">
            <Truck className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Customer Location Marker */}
        <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Route Line */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <motion.path
            d="M 50% 33% Q 60% 50%, 66% 75%"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="3"
            strokeDasharray="10,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Tracking Info */}
      <div className="p-4 space-y-4">
        {/* ETA */}
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 text-white p-2 rounded-full">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Arrival</p>
              <p className="text-2xl font-bold text-orange-600">
                {estimatedTime} min
              </p>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Navigation className="w-6 h-6 text-orange-600" />
          </motion.div>
        </div>

        {/* Delivery Person Info */}
        {order.deliveryPerson && (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-orange-700">
                {order.deliveryPerson.name?.[0] || 'D'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {order.deliveryPerson.name}
              </p>
              <p className="text-sm text-gray-600">
                {order.deliveryPerson.vehicle} • 
                <span className="text-orange-600 ml-1">On the way</span>
              </p>
            </div>
          </div>
        )}

        {/* Live Updates */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 text-sm"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Delivery in progress</p>
              <p className="text-gray-600 text-xs">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default OrderTracking;