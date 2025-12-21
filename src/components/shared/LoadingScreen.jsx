// File: src/components/shared/LoadingScreen.jsx
// Full-screen loading component with SARSAR branding

import { motion } from 'framer-motion';
import { Package, Loader2 } from 'lucide-react';

const LoadingScreen = ({ message = 'Loading...', fullScreen = true }) => {
  const containerClass = fullScreen ?
    'fixed inset-0 z-50 flex items-center justify-center bg-white' :
    'flex items-center justify-center py-12';
  
  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-6"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl" />
          <motion.div
            className="absolute inset-2 bg-white rounded-xl flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Package className="w-10 h-10 text-orange-600" />
          </motion.div>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="inline-flex mb-4"
        >
          <Loader2 className="w-8 h-8 text-orange-600" />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium"
        >
          {message}
        </motion.p>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-orange-600 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;