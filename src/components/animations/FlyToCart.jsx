// FILE PATH: src/components/animations/FlyToCart.jsx
// Fly-to-Cart Animation Component

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

const FlyToCart = ({ startPosition, onComplete }) => {
  // Get cart icon position (top right)
  const cartPosition = {
    x: window.innerWidth - 100,
    y: 30,
  };
  
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: startPosition.x,
        top: startPosition.y,
      }}
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        x: cartPosition.x - startPosition.x,
        y: cartPosition.y - startPosition.y,
        scale: 0.3,
        opacity: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      onAnimationComplete={onComplete}
    >
      <div className="bg-orange-500 rounded-full p-3 shadow-lg">
        <Package className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  );
};

export default FlyToCart;